import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CcVgDxJ4.mjs";
import { s as normalizeLibrary } from "./merge-ntzy-eJJ.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sync-fns-D_dufz5y.js
function asLibrary(value) {
	if (typeof value === "string") try {
		return normalizeLibrary(JSON.parse(value));
	} catch {
		return null;
	}
	return normalizeLibrary(value);
}
var pullLibrary_createServerFn_handler = createServerRpc({
	id: "aeafc1383127146681f84199e213d0068836988391a3d5ffdfec1358046b32e6",
	name: "pullLibrary",
	filename: "src/lib/bodhi/sync-fns.ts"
}, (opts) => pullLibrary.__executeServer(opts));
var pullLibrary = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(pullLibrary_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-PQKhDX2Q.mjs").then((n) => n.t).then((n) => n.t);
	return asLibrary((await (await getSql())`
      select snapshot from bodhi_libraries where user_id = ${context.userId}
    `)[0]?.snapshot ?? null);
});
var pushLibrary_createServerFn_handler = createServerRpc({
	id: "34a963e0844e7631682d39c2e1e3db7bd884e31ec1bdfe173d81ec8ff6134120",
	name: "pushLibrary",
	filename: "src/lib/bodhi/sync-fns.ts"
}, (opts) => pushLibrary.__executeServer(opts));
var pushLibrary = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const library = normalizeLibrary(input?.library);
	if (!library) throw new Error("Invalid library");
	if (library.objects.length > 5e3) throw new Error("Library is too large");
	const encoded = JSON.stringify(library);
	if (encoded.length > 4e6) throw new Error("Library is too large");
	return {
		library,
		baseUpdatedAt: input.baseUpdatedAt,
		encoded
	};
}).handler(pushLibrary_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-PQKhDX2Q.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	const current = asLibrary((await sql`
      select snapshot from bodhi_libraries where user_id = ${context.userId}
    `)[0]?.snapshot ?? null);
	if (current && data.baseUpdatedAt && current.updatedAt !== data.baseUpdatedAt) return {
		conflict: true,
		snapshot: current
	};
	await sql`
      insert into bodhi_libraries (user_id, snapshot, updated_at)
      values (${context.userId}, ${data.encoded}::jsonb, now())
      on conflict (user_id)
      do update set snapshot = excluded.snapshot, updated_at = now()
    `;
	return {
		conflict: false,
		updatedAt: data.library.updatedAt
	};
});
//#endregion
export { pullLibrary_createServerFn_handler, pushLibrary_createServerFn_handler };
