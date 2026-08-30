import { useCallback, useEffect, useState } from "react";

// Keep the deployed demo usable even when a preview is created before Vercel's
// environment variables are injected into the client build. VITE_API_URL still
// overrides this for hosted environments and local development.
const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "https://webmcp-vision-server-v5-production.up.railway.app";

export type OperationName =
  | "getProducts" | "getProduct" | "compareProducts" | "getMyGear"
  | "checkCompatibility" | "getCompareList" | "setCompareList" | "getCart"
  | "getMyCoupons" | "addToCart" | "updateCartQuantity" | "removeFromCart"
  | "applyCoupon" | "placeOrder";

type Operation = ((args?: Record<string, unknown>) => Promise<unknown>) & {
  operationName: OperationName;
};

function operation(name: OperationName): Operation {
  const fn = ((args?: Record<string, unknown>) => request(name, args)) as Operation;
  fn.operationName = name;
  return fn;
}

export const getProducts = operation("getProducts");
export const getProduct = operation("getProduct");
export const compareProducts = operation("compareProducts");
export const getMyGear = operation("getMyGear");
export const checkCompatibility = operation("checkCompatibility");
export const getCompareList = operation("getCompareList");
export const setCompareList = operation("setCompareList");
export const getCart = operation("getCart");
export const getMyCoupons = operation("getMyCoupons");
export const addToCart = operation("addToCart");
export const updateCartQuantity = operation("updateCartQuantity");
export const removeFromCart = operation("removeFromCart");
export const applyCoupon = operation("applyCoupon");
export const placeOrder = operation("placeOrder");

function endpoint(operation: OperationName, args: Record<string, unknown> | undefined) {
  if (operation === "getProducts") {
    const params = new URLSearchParams();
    if (typeof args?.query === "string") params.set("query", args.query);
    if (typeof args?.category === "string") params.set("category", args.category);
    return `/api/products${params.size ? `?${params}` : ""}`;
  }
  if (operation === "getProduct" && typeof args?.slug === "string") {
    return `/api/products/${encodeURIComponent(args.slug)}`;
  }
  return `/api/operations/${operation}`;
}

async function request<T>(operation: OperationName, args?: Record<string, unknown>): Promise<T> {
  const method = operation === getProducts || operation === getProduct ? "GET" : "POST";
  const response = await fetch(`${API_URL}${endpoint(operation, args)}`, {
    method,
    credentials: "include",
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify(args ?? {}) : undefined,
  });
  const payload = (await response.json().catch(() => null)) as { error?: string } | T | null;
  if (!response.ok) {
    throw new Error(
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : `Request failed (${response.status})`,
    );
  }
  return payload as T;
}

export function useQuery<T = unknown>(
  operationRef: Operation,
  args?: Record<string, unknown>,
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true;
  const [state, setState] = useState<{ data?: T; isLoading: boolean; error?: unknown }>({
    isLoading: enabled,
  });
  const run = useCallback(async () => {
    if (!enabled) return;
    setState((current) => ({ ...current, isLoading: true, error: undefined }));
    try {
      setState({ data: await request<T>(operationRef.operationName, args), isLoading: false });
    } catch (error) {
      setState({ isLoading: false, error });
    }
  }, [operationRef, enabled, JSON.stringify(args)]);
  useEffect(() => void run(), [run]);
  return { ...state, refetch: run };
}

export function useAction<TArgs extends Record<string, unknown> = Record<string, unknown>, TResult = unknown>(
  operationRef: Operation,
) {
  const mutate = useCallback((args: TArgs) => request<TResult>(operationRef.operationName, args), [operationRef]);
  return [mutate, { isLoading: false }] as const;
}

export function requestOperation<T>(operationRef: Operation, args?: Record<string, unknown>) {
  return request<T>(operationRef.operationName, args);
}
