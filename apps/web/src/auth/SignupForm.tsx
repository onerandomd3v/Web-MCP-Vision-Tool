import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";

export function SignupForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password, displayName }),
    });
    if (!response.ok) {
      setError(((await response.json().catch(() => null)) as { error?: string } | null)?.error ?? "Unable to sign up.");
      setLoading(false);
      return;
    }
    navigate("/");
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Create account</h1>
      <label className="block text-sm">Display name<input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
      <label className="block text-sm">Username<input required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
      <label className="block text-sm">Password<input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-stone-900 px-4 py-2 text-white disabled:opacity-50">{loading ? "Creating account…" : "Sign up"}</button>
    </form>
  );
}
