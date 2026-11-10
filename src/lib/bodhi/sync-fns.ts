import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { normalizeLibrary } from "@/lib/bodhi/merge";
import type { Library } from "@/lib/bodhi/types";

export type PushResult =
  | { conflict: false; updatedAt: string }
  | { conflict: true; snapshot: Library };

function asLibrary(value: unknown): Library | null {
  if (typeof value === "string") {
    try {
      return normalizeLibrary(JSON.parse(value));
    } catch {
      return null;
    }
  }
  return normalizeLibrary(value);
}

export const pullLibrary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Library | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ snapshot: unknown }>`
      select snapshot from bodhi_libraries where user_id = ${context.userId}
    `;
    return asLibrary(rows[0]?.snapshot ?? null);
  });

export const pushLibrary = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { library: Library; baseUpdatedAt: string | null }) => {
    const library = normalizeLibrary(input?.library);
    if (!library) throw new Error("Invalid library");
    if (library.objects.length > 5000) throw new Error("Library is too large");
    const encoded = JSON.stringify(library);
    if (encoded.length > 4_000_000) throw new Error("Library is too large");
    return {
      library,
      baseUpdatedAt: input.baseUpdatedAt,
      encoded,
    };
  })
  .handler(async ({ context, data }): Promise<PushResult> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ snapshot: unknown }>`
      select snapshot from bodhi_libraries where user_id = ${context.userId}
    `;
    const current = asLibrary(rows[0]?.snapshot ?? null);
    if (
      current &&
      data.baseUpdatedAt &&
      current.updatedAt !== data.baseUpdatedAt
    ) {
      return { conflict: true, snapshot: current };
    }
    await sql`
      insert into bodhi_libraries (user_id, snapshot, updated_at)
      values (${context.userId}, ${data.encoded}::jsonb, now())
      on conflict (user_id)
      do update set snapshot = excluded.snapshot, updated_at = now()
    `;
    return { conflict: false, updatedAt: data.library.updatedAt };
  });
