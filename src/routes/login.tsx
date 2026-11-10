import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useBodhi } from "@/lib/bodhi/store";

export const Route = createFileRoute("/login")({
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const syncUsers = useBodhi((state) => state.syncUsers);
  const syncStatus = useBodhi((state) => state.syncStatus);
  const syncError = useBodhi((state) => state.syncError);
  const enableSync = useBodhi((state) => state.enableSync);
  const disableSync = useBodhi((state) => state.disableSync);
  const importLibrary = useBodhi((state) => state.importLibrary);
  const library = useBodhi((state) => state.library);

  if (isPending) {
    return (
      <div className="mx-auto max-w-lg px-5 py-10">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-paper-2" />
      </div>
    );
  }

  const synced = !!user && syncUsers.includes(user.id);

  return (
    <div className="rise mx-auto max-w-lg px-5 py-6 md:py-10">
      <h1 className="font-serif text-4xl tracking-tight">Account</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Bodhi works without an account. Notes stay on this device until you choose to sync them.
      </p>

      {user ? (
        <section className="mt-6 rounded-3xl border border-line p-4">
          <UserButton />
          <p className="mt-4 text-sm text-ink-soft">
            {synced
              ? "This library syncs with your account on this server. Sign in on another browser or desktop install of this same Bodhi and you continue from here."
              : "You are signed in, but this library is still only on this device."}
          </p>
          <button
            type="button"
            className="mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
            onClick={() => void (synced ? disableSync(user.id) : enableSync(user.id))}
          >
            {synced ? "Keep this device only" : "Sync this library"}
          </button>
          <p className="mt-3 text-sm text-ink-soft">
            {syncStatus === "syncing" && "Syncing…"}
            {syncStatus === "synced" && synced && "Saved to your account."}
            {syncStatus === "error" && (syncError ?? "Sync paused.")}
            {syncStatus === "local" && !synced && "On this device."}
          </p>
        </section>
      ) : (
        <SignedOutCard />
      )}

      <section className="mt-6 rounded-3xl border border-line p-4">
        <h2 className="font-serif text-xl">Move the library</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Download a file to carry notes between computers, or into a copy you cloned from GitHub. Import merges
          unless you choose replace.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-line px-4 py-2 text-sm"
            onClick={() => {
              const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.href = url;
              anchor.download = "bodhi-library.json";
              anchor.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </button>
          <label className="rounded-full border border-line px-4 py-2 text-sm">
            Import and merge
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  importLibrary(JSON.parse(await file.text()) as unknown, "merge");
                } catch {
                  /* ignore a file that is not a Bodhi library */
                }
              }}
            />
          </label>
          <label className="rounded-full border border-line px-4 py-2 text-sm">
            Import and replace
            <input
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                try {
                  importLibrary(JSON.parse(await file.text()) as unknown, "replace");
                } catch {
                  /* ignore a file that is not a Bodhi library */
                }
              }}
            />
          </label>
        </div>
      </section>

      <section className="mt-6 text-sm leading-relaxed text-ink-soft">
        <h2 className="font-serif text-xl text-ink">Desktop and GitHub Pages</h2>
        <p className="mt-2">
          Clone the repo and run it on Windows, macOS, or Linux with Node. That copy is a full Bodhi, with or without
          an account. An account is stored by the server you are talking to. The published site and a desktop window
          opened to that same site share one login. A second server you start on your own machine does not, unless it
          uses the same database.
        </p>
        <p className="mt-2">
          GitHub Pages can open the interface in a browser, but it cannot run the account server. Use export and
          import to move notes there, or sign in on a running Bodhi so the library is saved for every device that
          reaches that server.
        </p>
        <Link to="/" className="mt-4 inline-block text-ink">
          Back to today
        </Link>
      </section>
    </div>
  );
}

function SignedOutCard() {
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!authEnabled) return;
    setPending(true);
    setError(null);
    const result =
      mode === "up"
        ? await authClient.signUp.email({
            name: name.trim() || email.split("@")[0] || "Reader",
            email: email.trim(),
            password,
            callbackURL: "/",
          })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
    if (result.error) {
      setError(result.error.message ?? "That didn't work. Check the email and password.");
      setPending(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-line p-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={mode === "up" ? "rounded-full bg-ink px-3 py-2 text-sm text-paper" : "rounded-full px-3 py-2 text-sm text-ink-soft"}
          onClick={() => setMode("up")}
        >
          Create account
        </button>
        <button
          type="button"
          className={mode === "in" ? "rounded-full bg-ink px-3 py-2 text-sm text-paper" : "rounded-full px-3 py-2 text-sm text-ink-soft"}
          onClick={() => setMode("in")}
        >
          Sign in
        </button>
      </div>
      {authEnabled ? (
        <form onSubmit={(event) => void submit(event)} className="mt-4 space-y-3">
          {mode === "up" && (
            <label className="block text-sm">
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none"
                autoComplete="name"
              />
            </label>
          )}
          <label className="block text-sm">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none"
              autoComplete="email"
            />
          </label>
          <label className="block text-sm">
            Password
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none"
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
          </label>
          {error && <p className="text-sm text-type-wine">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-50"
          >
            {pending ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink-soft">Sign-in is not turned on for this build.</p>
      )}
      {authEnabled && (
        <div className="mt-4 space-y-2">
          {GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              onClick={() => void signIn(provider.providerId, { callbackURL: "/" })}
              className="w-full rounded-full border border-line px-4 py-2 text-sm"
            >
              Continue with {provider.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
