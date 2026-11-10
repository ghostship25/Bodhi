# Bodhi

A calm, object-based notebook. Notes, people, projects, and daily pages are all objects. Link them with `[[double brackets]]`. Use it with or without an account.

## Run it on Windows, macOS, or Linux

Install [Node.js 22](https://nodejs.org), then:

```bash
npm install
npm run dev
```

Open the address the terminal prints (port 8080). The same command works in Command Prompt, PowerShell, Terminal, and a Linux shell.

Notes stay in this browser until you create an account on that running app and turn on sync.

## Account sync

- **Without an account**, the library lives in this browser only. Export it from Account if you want a file.
- **With an account**, Bodhi stores the library on the server you signed in to. Open that same server from another browser, or install the site as an app, and sign in to continue.
- A copy you start on your own computer uses its own database. To share accounts with a hosted Bodhi, start it with the same `DATABASE_URL`:

```bash
# macOS / Linux
DATABASE_URL="postgres://…" npm run dev

# Windows PowerShell
$env:DATABASE_URL="postgres://…"; npm run dev
```

Sign-in is email and password, Google, or X.

## GitHub Pages

The [Bodhi landing page](https://ghostship25.github.io/Bodhi/) is hosted on GitHub Pages. It introduces the project; it is not the application. GitHub Pages only serves files and cannot run Bodhi's account server, so it cannot sign people in by itself.

Use one of these:

1. Run Bodhi with `npm run dev` and open it in the browser. Sign in there. Install the site from the browser if you want a desktop window — it is the same account.
2. Publish the app to a host that runs Node (the included server). Every device that opens that host can sign in and resume.
3. Move notes with Account → Export, then Import on the other device. This works even when you are not signed in.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Bodhi for local use |
| `npm run build` | Production build and database migrations |
| `npm run typecheck` | Typecheck |

## License

[MIT](LICENSE)
