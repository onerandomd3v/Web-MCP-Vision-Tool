import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";

export function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      setError(((await response.json().catch(() => null)) as { error?: string } | null)?.error ?? "Unable to log in.");
      setLoading(false);
      return;
    }
    navigate("/");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Log in</h1>
      <label className="block text-sm">Username<input required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
      <label className="block text-sm">Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-stone-900 px-4 py-2 text-white disabled:opacity-50">{loading ? "Logging in…" : "Log in"}</button>
    </form>
  );
}
