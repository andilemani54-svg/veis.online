# VEIS PWA starter files

These files add installability to the existing VEIS website. They do not replace index.html, change Supabase, or change LiveKit.

## Upload to the repository root
- manifest.json
- service-worker.js
- icons/icon-192.png
- icons/icon-512.png

## Integrate into the existing index.html
1. Open index.html on your new working branch.
2. Inside the existing <head> section, add the contents of `index-head-snippet.html`.
3. Immediately before the existing `</body>` tag, add the contents of `index-body-snippet.html`.
4. Save and commit all changes.

Do not replace the existing index.html with either snippet. They are additions only.

## Important
- The generated icons are simple VEIS text placeholders. Replace them with the official VEIS logo later if available.
- The service worker only caches the app shell and same-origin static requests. It deliberately does not intercept cross-origin requests, APIs, authentication paths, LiveKit traffic, or uploads.
- The service worker uses network-first navigation and falls back to a cached home page when offline. It is not a full offline version of the VEIS application.
- PWA installation requires HTTPS (veis.online qualifies if its certificate is valid).
- After deploying, test in Chrome: open https://veis.online, refresh, then use the browser menu and look for "Install app" or "Add to Home screen". Browser wording varies.
