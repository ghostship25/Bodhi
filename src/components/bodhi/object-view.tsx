import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, Pin } from "lucide-react";
import { liveLinks, typeById, useBodhi, visibleObjects } from "@/lib/bodhi/store";
import { unlinkedMentions } from "@/lib/bodhi/mentions";
import type { PropDef, PropValue } from "@/lib/bodhi/types";
import { TYPE_IDS } from "@/lib/bodhi/types";
import { BodyEditor } from "@/components/bodhi/body-editor";
import { TYPE_DOT } from "@/components/bodhi/icons";
import { cn } from "@/lib/cn";

export function ObjectView({ objectId }: { objectId: string }) {
  const library = useBodhi((state) => state.library);
  const updateObject = useBodhi((state) => state.updateObject);
  const setProp = useBodhi((state) => state.setProp);
  const deleteObject = useBodhi((state) => state.deleteObject);
  const connect = useBodhi((state) => state.connect);
  const disconnect = useBodhi((state) => state.disconnect);
  const addProperty = useBodhi((state) => state.addProperty);
  const setTemplate = useBodhi((state) => state.setTemplate);
  const duplicateObject = useBodhi((state) => state.duplicateObject);
  const moveType = useBodhi((state) => state.moveType);
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [connectQuery, setConnectQuery] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [propName, setPropName] = useState("");
  const [propKind, setPropKind] = useState<PropDef["kind"]>("text");

  const object = library.objects.find((item) => item.id === objectId && !item.deletedAt);
  const type = object ? typeById(library, object.typeId) : undefined;

  const [copied, setCopied] = useState(false);
  const related = useMemo(() => {
    if (!object) return [];
    return liveLinks(library).filter((link) => link.fromId === object.id || link.toId === object.id);
  }, [library, object]);

  if (!object || !type) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-serif text-3xl">That object is gone</h1>
        <Link to="/objects" className="mt-4 inline-block text-sm text-ink-soft">
          Back to objects
        </Link>
      </div>
    );
  }

  const linkedIds = new Set(related.map((link) => (link.fromId === object.id ? link.toId : link.fromId)));
  const unlinked = unlinkedMentions(object.body, visibleObjects(library), linkedIds, object.id);
  const others = visibleObjects(library).filter((item) => item.id !== object.id && item.typeId !== TYPE_IDS.daily);
  const suggestions = others
    .filter((item) => item.title.toLowerCase().includes(connectQuery.trim().toLowerCase()))
    .slice(0, 6);

  function onProp(key: string, value: PropValue) {
    if (!object) return;
    setProp(object.id, key, value);
  }

  return (
    <article className="rise mx-auto max-w-2xl px-5 py-6 md:py-12">
      <div className="flex items-center justify-between gap-3">
        <Link to="/objects" search={{ type: type.key }} className="flex items-center gap-2 text-sm text-ink-soft">
          <span className={cn("size-2 rounded-full", TYPE_DOT[type.color])} />
          {type.name}
          {object.inbox ? " · Inbox" : ""}
        </Link>
        <div className="flex items-center">
          {type.id !== TYPE_IDS.daily && (
            <button
              type="button"
              aria-label={object.pinned ? "Unpin" : "Pin"}
              aria-pressed={!!object.pinned}
              className={cn("grid size-11 place-items-center rounded-full", object.pinned ? "text-ink" : "text-ink-faint")}
              onClick={() => updateObject(object.id, { pinned: !object.pinned })}
            >
              <Pin className="size-4" />
            </button>
          )}
          <details className="relative">
            <summary className="menu-sum grid size-11 place-items-center rounded-full text-ink-soft" aria-label="More actions">
              <MoreHorizontal className="size-5" />
            </summary>
            <div className="absolute right-0 z-20 mt-1 w-56 rounded-2xl border border-line bg-paper p-1 shadow-panel">
              <MenuButton
                label={copied ? "Copied" : "Copy Markdown"}
                onClick={() => {
                  const markdown = `# ${object.title}\n\n${object.body}`;
                  void navigator.clipboard.writeText(markdown).then(() => {
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  });
                }}
              />
              {type.id !== TYPE_IDS.daily && (
                <MenuButton label="Use as template" onClick={() => setTemplate(type.id, object.body)} />
              )}
              {type.id !== TYPE_IDS.daily && (
                <MenuButton
                  label="Duplicate"
                  onClick={() => {
                    const copyId = duplicateObject(object.id);
                    void navigate({ to: "/o/$objectId", params: { objectId: copyId } });
                  }}
                />
              )}
              {object.inbox && <MenuButton label="File from inbox" onClick={() => updateObject(object.id, { inbox: false })} />}
              <MenuButton
                label={object.archived ? "Unarchive" : "Archive"}
                onClick={() => updateObject(object.id, { archived: !object.archived })}
              />
              {type.id !== TYPE_IDS.daily &&
                (confirm ? (
                  <MenuButton
                    label="Confirm delete"
                    danger
                    onClick={() => {
                      deleteObject(object.id);
                      void navigate({ to: "/objects" });
                    }}
                  />
                ) : (
                  <MenuButton label="Delete" onClick={() => setConfirm(true)} />
                ))}
              {type.id !== TYPE_IDS.daily && (
                <label className="mt-1 flex items-center justify-between gap-2 border-t border-line px-3 py-2 text-sm">
                  Type
                  <select
                    value={type.id}
                    aria-label="Object type"
                    className="bg-transparent text-ink outline-none"
                    onChange={(event) => moveType(object.id, event.target.value)}
                  >
                    {library.types
                      .filter((item) => item.id !== TYPE_IDS.daily)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
            </div>
          </details>
        </div>
      </div>
      {type.id === TYPE_IDS.daily ? (
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-balance">{object.title}</h1>
      ) : (
        <input
          value={object.title}
          onChange={(event) => updateObject(object.id, { title: event.target.value })}
          aria-label="Title"
          className="mt-4 w-full bg-transparent font-serif text-4xl tracking-tight text-ink outline-none"
        />
      )}

      {type.properties.length > 0 && (
        <dl className="mt-6 divide-y divide-line">
          {type.properties.map((property) => (
            <div key={property.id} className="grid gap-2 px-3 py-3 sm:grid-cols-[8rem_1fr] sm:items-center">
              <dt className="text-sm text-ink-soft">{property.name}</dt>
              <dd>
                <PropertyField
                  property={property}
                  value={object.props[property.id] ?? null}
                  onChange={(value) => onProp(property.id, value)}
                />
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-6">
        <BodyEditor
          bare
          label="Writing"
          value={object.body}
          onChange={(body) => updateObject(object.id, { body })}
          objects={visibleObjects(library).filter((item) => item.id !== object.id)}
        />
      </div>

      {unlinked.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm text-ink-faint">Also named here</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {unlinked.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="rounded-full border border-line px-3 py-1 text-sm"
                  onClick={() => connect(object.id, item.id)}
                >
                  Link {item.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm text-ink-faint">Linked</h2>
          <button type="button" className="text-sm text-ink-soft" onClick={() => setShowConnect((value) => !value)}>
            {showConnect ? "Close" : "Connect"}
          </button>
        </div>
        {showConnect && (
          <div className="mt-3 rounded-2xl border border-line p-3">
            <input
              value={connectQuery}
              onChange={(event) => setConnectQuery(event.target.value)}
              placeholder="Find an object"
              className="w-full rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm outline-none"
            />
            <ul className="mt-2">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-2 py-2 text-left text-sm hover:bg-paper-2"
                    onClick={() => {
                      connect(object.id, item.id);
                      setConnectQuery("");
                      setShowConnect(false);
                    }}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ul className="mt-2">
          {related.length === 0 && <li className="py-2 text-sm text-ink-faint">Nothing linked yet.</li>}
          {related.map((link) => {
            const otherId = link.fromId === object.id ? link.toId : link.fromId;
            const other = library.objects.find((item) => item.id === otherId && !item.deletedAt);
            if (!other) return null;
            return (
              <li key={link.id} className="flex items-center gap-3 py-1.5">
                <Link to="/o/$objectId" params={{ objectId: other.id }} className="min-w-0 flex-1 truncate">
                  {other.title}
                </Link>
                <button type="button" className="text-sm text-ink-faint" onClick={() => disconnect(link.id)}>
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {type.id !== TYPE_IDS.daily && (
        <details className="mt-10">
          <summary className="menu-sum cursor-pointer text-sm text-ink-soft">Add a property</summary>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={propName}
              onChange={(event) => setPropName(event.target.value)}
              placeholder="Name"
              className="flex-1 rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm outline-none"
            />
            <select
              value={propKind}
              onChange={(event) => setPropKind(event.target.value as PropDef["kind"])}
              className="rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="checkbox">Checkbox</option>
              <option value="select">Select</option>
            </select>
            <button
              type="button"
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
              onClick={() => {
                addProperty(type.id, {
                  name: propName,
                  kind: propKind,
                  options: propKind === "select" ? ["One", "Two"] : undefined,
                });
                setPropName("");
              }}
            >
              Add
            </button>
          </div>
        </details>
      )}
    </article>
  );
}

function MenuButton({ label, onClick, danger = false }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      className={cn("flex w-full rounded-xl px-3 py-2 text-left text-sm", danger ? "text-type-wine" : "text-ink")}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function PropertyField({
  property,
  value,
  onChange,
}: {
  property: PropDef;
  value: PropValue;
  onChange: (value: PropValue) => void;
}) {
  const className = "w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none";
  if (property.kind === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={value === true}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-accent"
        aria-label={property.name}
      />
    );
  }
  if (property.kind === "select") {
    return (
      <select className={className} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose</option>
        {(property.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  if (property.kind === "number") {
    return (
      <input
        type="number"
        className={className}
        value={typeof value === "number" ? value : ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        aria-label={property.name}
      />
    );
  }
  if (property.kind === "date") {
    return (
      <input
        type="date"
        className={className}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        aria-label={property.name}
      />
    );
  }
  return (
    <input
      className={className}
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      aria-label={property.name}
    />
  );
}
