# Nima Aksoy Today — Chrome New Tab Extension v1.0.1

Nima Aksoy Today replaces Chrome's New Tab page with a local-first daily dashboard based on `https://nimaaksoy.com/today`.

The extension does not include the website header or footer. It is a standalone Chrome Extension Manifest V3 package.

## Features

- Combined Gregorian and Persian calendar with month and year views.
- English and Persian interface with bundled Vazirmatn font files.
- Gregorian to Persian and Persian to Gregorian date converter.
- Toman-based currency converter with live rates from `https://nimaaksoy.com/api/today/currency`.
- Personal Note stored locally in Chrome storage.
- Latest Radar and Prompts cards linking to `nimaaksoy.com`.
- Latest public Vahid Online news from `https://nimaaksoy.com/api/today/news`, refreshed hourly while the tab is open.

## Privacy

Personal Note, language, and open/closed panel preferences stay in Chrome storage on the user's device. The extension does not upload personal notes or preferences to Nima Aksoy servers.

The extension fetches public website data for currency rates and news. Those requests do not include personal note content.

Google Calendar is not connected inside extension v1. The new tab includes a link to open the website version for Google Calendar. Adding Calendar directly to the extension later requires a separate Chrome extension OAuth client ID and Chrome Identity setup.

## Local Installation

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Turn on Developer mode.
4. Click Load unpacked.
5. Select `chrome-extension/nima-aksoy-today-v1`.
6. Open a new tab.

## Package Contents

The release ZIP should include:

```text
manifest.json
newtab.html
styles.css
app.js
assets/
  fonts/
  icons/
README.md
```

Store listing assets live in `store-listing/` and are not required inside the extension ZIP.

## Package Command

From this folder:

```bash
zip -r nima-aksoy-today-v1.0.1.zip manifest.json newtab.html styles.css app.js assets README.md
```
