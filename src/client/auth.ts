import { useCallback, useEffect, useState } from "react";

export type AuthUser = { id: number; displayName?: string | null; region?: string };

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function useAuth() {
  const [state, setState] = useState<{ data?: AuthUser | null; isLoading: boolean }>({ isLoading: true });
  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
      setState({ data: response.ok ? ((await response.json()) as AuthUser) : null, isLoading: false });
    } catch {
      setState({ data: null, isLoading: false });
    }
  }, []);
  useEffect(() => void refresh(), [refresh]);
  return { ...state, refetch: refresh };
}

export async function logout() {
  await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
  window.location.assign("/");
}
