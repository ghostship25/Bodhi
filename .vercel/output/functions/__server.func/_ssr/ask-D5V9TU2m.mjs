import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CcVgDxJ4.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-D5V9TU2m.js
var askNotes_createServerFn_handler = createServerRpc({
	id: "1ea5f5ba63369885dac7d2f66b11397e278c0e7667125a7bc8f34ef8e41bcd83",
	name: "askNotes",
	filename: "src/lib/bodhi/ask.ts"
}, (opts) => askNotes.__executeServer(opts));
var askNotes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const question = String(input?.question ?? "").trim().slice(0, 500);
	if (question.length < 2) throw new Error("Ask a question first.");
	return {
		question,
		notes: (Array.isArray(input?.notes) ? input.notes : []).slice(0, 8).map((note) => ({
			title: String(note?.title ?? "").slice(0, 140),
			excerpt: String(note?.excerpt ?? "").slice(0, 500)
		}))
	};
}).handler(askNotes_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Asking your notes is not available right now."
	};
	const context = data.notes.map((note) => `# ${note.title}\n${note.excerpt}`).join("\n\n");
	const response = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 400,
			temperature: .2,
			messages: [{
				role: "system",
				content: "You answer using only the notes provided. Cite note titles as [[Title]]. If the notes do not contain the answer, say so in one sentence. Do not invent objects."
			}, {
				role: "user",
				content: `Notes:\n${context || "(none)"}\n\nQuestion: ${data.question}`
			}]
		})
	});
	if (!response.ok) return {
		ok: false,
		error: "The assistant could not answer just now."
	};
	const text = (await response.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "The assistant returned an empty answer."
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askNotes_createServerFn_handler };
