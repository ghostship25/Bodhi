import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type NoteContext = { title: string; excerpt: string };

export const askNotes = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { question: string; notes: NoteContext[] }) => {
    const question = String(input?.question ?? "").trim().slice(0, 500);
    if (question.length < 2) throw new Error("Ask a question first.");
    const notes = (Array.isArray(input?.notes) ? input.notes : []).slice(0, 8).map((note) => ({
      title: String(note?.title ?? "").slice(0, 140),
      excerpt: String(note?.excerpt ?? "").slice(0, 500),
    }));
    return { question, notes };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Asking your notes is not available right now." };
    const context = data.notes.map((note) => `# ${note.title}\n${note.excerpt}`).join("\n\n");
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 400,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You answer using only the notes provided. Cite note titles as [[Title]]. If the notes do not contain the answer, say so in one sentence. Do not invent objects.",
          },
          {
            role: "user",
            content: `Notes:\n${context || "(none)"}\n\nQuestion: ${data.question}`,
          },
        ],
      }),
    });
    if (!response.ok) return { ok: false as const, error: "The assistant could not answer just now." };
    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "The assistant returned an empty answer." };
    return { ok: true as const, text };
  });
