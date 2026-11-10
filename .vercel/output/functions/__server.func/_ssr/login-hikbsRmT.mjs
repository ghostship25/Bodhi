import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-C62RRNwO.mjs";
import { d as useBodhi, g as useCurrentUserState, h as useCurrentUser } from "./router-Bg5G7pac.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-hikbsRmT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const syncUsers = useBodhi((state) => state.syncUsers);
	const syncStatus = useBodhi((state) => state.syncStatus);
	const syncError = useBodhi((state) => state.syncError);
	const enableSync = useBodhi((state) => state.enableSync);
	const disableSync = useBodhi((state) => state.disableSync);
	const importLibrary = useBodhi((state) => state.importLibrary);
	const library = useBodhi((state) => state.library);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-lg px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-lg bg-paper-2" })
	});
	const synced = !!user && syncUsers.includes(user.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise mx-auto max-w-lg px-5 py-6 md:py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl tracking-tight",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed text-ink-soft",
				children: "Bodhi works without an account. Notes stay on this device until you choose to sync them."
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-ink-soft",
						children: synced ? "This library syncs with your account on this server. Sign in on another browser or desktop install of this same Bodhi and you continue from here." : "You are signed in, but this library is still only on this device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg",
						onClick: () => void (synced ? disableSync(user.id) : enableSync(user.id)),
						children: synced ? "Keep this device only" : "Sync this library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-ink-soft",
						children: [
							syncStatus === "syncing" && "Syncing…",
							syncStatus === "synced" && synced && "Saved to your account.",
							syncStatus === "error" && (syncError ?? "Sync paused."),
							syncStatus === "local" && !synced && "On this device."
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOutCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl",
						children: "Move the library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-ink-soft",
						children: "Download a file to carry notes between computers, or into a copy you cloned from GitHub. Import merges unless you choose replace."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-full border border-line px-4 py-2 text-sm",
								onClick: () => {
									const blob = new Blob([JSON.stringify(library, null, 2)], { type: "application/json" });
									const url = URL.createObjectURL(blob);
									const anchor = document.createElement("a");
									anchor.href = url;
									anchor.download = "bodhi-library.json";
									anchor.click();
									URL.revokeObjectURL(url);
								},
								children: "Export"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-full border border-line px-4 py-2 text-sm",
								children: ["Import and merge", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/json",
									className: "sr-only",
									onChange: async (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										if (!file) return;
										try {
											importLibrary(JSON.parse(await file.text()), "merge");
										} catch {}
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "rounded-full border border-line px-4 py-2 text-sm",
								children: ["Import and replace", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "application/json",
									className: "sr-only",
									onChange: async (event) => {
										const file = event.target.files?.[0];
										event.target.value = "";
										if (!file) return;
										try {
											importLibrary(JSON.parse(await file.text()), "replace");
										} catch {}
									}
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 text-sm leading-relaxed text-ink-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-xl text-ink",
						children: "Desktop and GitHub Pages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Clone the repo and run it on Windows, macOS, or Linux with Node. That copy is a full Bodhi, with or without an account. An account is stored by the server you are talking to. The published site and a desktop window opened to that same site share one login. A second server you start on your own machine does not, unless it uses the same database."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "GitHub Pages can open the interface in a browser, but it cannot run the account server. Use export and import to move notes there, or sign in on a running Bodhi so the library is saved for every device that reaches that server."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "mt-4 inline-block text-ink",
						children: "Back to today"
					})
				]
			})
		]
	});
}
function SignedOutCard() {
	const [mode, setMode] = (0, import_react.useState)("up");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setPending(true);
		setError(null);
		const result = mode === "up" ? await authClient.signUp.email({
			name: name.trim() || email.split("@")[0] || "Reader",
			email: email.trim(),
			password,
			callbackURL: "/"
		}) : await authClient.signIn.email({
			email: email.trim(),
			password,
			callbackURL: "/"
		});
		if (result.error) {
			setError(result.error.message ?? "That didn't work. Check the email and password.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6 rounded-3xl border border-line p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: mode === "up" ? "rounded-full bg-ink px-3 py-2 text-sm text-paper" : "rounded-full px-3 py-2 text-sm text-ink-soft",
					onClick: () => setMode("up"),
					children: "Create account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: mode === "in" ? "rounded-full bg-ink px-3 py-2 text-sm text-paper" : "rounded-full px-3 py-2 text-sm text-ink-soft",
					onClick: () => setMode("in"),
					children: "Sign in"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => void submit(event),
				className: "mt-4 space-y-3",
				children: [
					mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							className: "mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none",
							autoComplete: "name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							className: "mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none",
							autoComplete: "email"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Password", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "password",
							minLength: 8,
							value: password,
							onChange: (event) => setPassword(event.target.value),
							className: "mt-1 w-full rounded-xl border border-line bg-paper-2 px-3 py-2 outline-none",
							autoComplete: mode === "up" ? "new-password" : "current-password"
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-type-wine",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: pending,
						className: "w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg disabled:opacity-50",
						children: pending ? "Working…" : mode === "up" ? "Create account" : "Sign in"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-2",
				children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void signIn(provider.providerId, { callbackURL: "/" }),
					className: "w-full rounded-full border border-line px-4 py-2 text-sm",
					children: ["Continue with ", provider.label]
				}, provider.providerId))
			})
		]
	});
}
//#endregion
export { AccountPage as component };
