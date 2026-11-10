import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { askNotes } from "@/lib/bodhi/ask";
import { useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/ask")({
  component: AskPage,
});

function AskPage() {
  const library = useBodhi((state) => state.library);
  const { user, isPending } = useCurrentUserState();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const objects = useMemo(() => visibleObjects(library).filter((object) => !object.day), [library]);

  async function ask() {
    const words = question.toLowerCase().split(/\W+/).filter((word) => word.length > 2);
    const ranked = objects
      .map((object) => {
        const hay = `${object.title} ${object.body}`.toLowerCase();
        const score = words.reduce((sum, word) => sum + (hay.includes(word) ? 1 : 0), 0);
        return { object, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    if (ranked.length === 0) {
      setAnswer("");
      setError("Nothing in this library matches that yet.");
      return;
    }
    setPending(true);
    setError("");
    setAnswer("");
    try {
      const result = await askNotes({
        data: {
          question,
          notes: ranked.map(({ object }) => ({
            title: object.title,
            excerpt: object.body.slice(0, 500),
          })),
        },
      });
      if (result.ok) setAnswer(result.text);
      else setError(result.error);
    } catch {
      setError("Sign in with email, then try again. Asking reads your account.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rise mx-auto max-w-2xl px-5 py-6 md:py-10">
      <h1 className="font-serif text-4xl tracking-tight">Ask your notes</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        A question is matched against this library, then answered only from those notes. Nothing is sent until you ask.
        Local use does not require an account. Asking does, so the same library can be read from another device.
      </p>
      {!isPending && !user && (
        <Link to="/login" className="mt-4 inline-block text-sm text-ink">
          Create an account or sign in
        </Link>
      )}
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="What did I write about links?"
        className="mt-5 min-h-24 w-full rounded-2xl border border-line bg-paper-2 px-4 py-3 text-base outline-none"
      />
      <button
        type="button"
        disabled={pending || question.trim().length < 2 || (!isPending && !user)}
        onClick={() => void ask()}
        className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-40"
      >
        {pending ? "Asking…" : "Ask"}
      </button>
      {error && <p className="mt-4 text-sm text-type-wine">{error}</p>}
      {answer && <p className="mt-4 whitespace-pre-wrap font-serif text-lg leading-relaxed">{answer}</p>}
    </div>
  );
}
