# Vlad Terminal — Vercel Fixed

This version is intentionally a zero-build static site.

## Why the previous deployment failed

Vercel ran `vite build`, but the deployed repository did not contain the referenced `/src/main.js`.
That caused:

`[vite:build-html] Failed to resolve /src/main.js from /vercel/path0/index.html`

## Fix

This project has:
- `index.html` — entire Vlad Terminal app, including CSS, JavaScript, and the Vlad image
- `vercel.json` — simple static-site configuration
- no Vite dependency
- no `/src/main.js`
- no build command
- no API keys required

## Deploy

Upload the contents of this folder to the ROOT of the GitHub repository, then redeploy it on Vercel.

Important: delete the old `package.json`, `src/`, and old `index.html` from the GitHub repo before replacing them with these files, otherwise Vercel may keep detecting the old Vite app.
