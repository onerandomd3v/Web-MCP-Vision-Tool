import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const COOKIE = "webmcp_session";
const secret = () => process.env.JWT_SECRET ?? "development-only-secret-change-me";

export type AuthRepository = {
  user: {
    findUnique: (args: unknown) => Promise<{ id: number; username: string | null; passwordHash: string | null; displayName: string | null; region: string } | null>;
    create: (args: unknown) => Promise<{ id: number; username: string | null; displayName: string | null; region: string }>;
  };
};

export function readUserId(request: Request): number | null {
  const token = request.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret()) as { userId?: number };
    return typeof payload.userId === "number" ? payload.userId : null;
  } catch {
    return null;
  }
}

export function setSession(response: Response, userId: number) {
  response.cookie(COOKIE, jwt.sign({ userId }, secret(), { expiresIn: "7d" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(response: Response) {
  response.clearCookie(COOKIE);
}

export async function createUser(repository: AuthRepository, username: string, password: string, displayName: string) {
  if (!username.trim() || password.length < 8 || !displayName.trim()) {
    throw new Error("Display name, username, and a password of at least 8 characters are required.");
  }
  const existing = await repository.user.findUnique({ where: { username: username.trim() } });
  if (existing) throw new Error("That username is already in use.");
  const passwordHash = await bcrypt.hash(password, 12);
  return repository.user.create({ data: { username: username.trim(), passwordHash, displayName: displayName.trim() } });
}

export async function authenticate(repository: AuthRepository, username: string, password: string) {
  const user = await repository.user.findUnique({ where: { username: username.trim() } });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid username or password.");
  }
  return user;
}
