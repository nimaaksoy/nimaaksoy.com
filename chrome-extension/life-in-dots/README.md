# Life in Dots — Chrome New Tab Extension

A clean, minimal, privacy-first replacement for your browser's New Tab page. It shows your current day of life, a visual grid of the time you have lived and the possible time still ahead, a deterministic daily message, and a small area to note one gentle intention for the day.

---

## Features

- **Conversational Onboarding**: Set up your timeline directly in the new tab interface.
- **Privacy-First**: No tracking, no external APIs, and no accounts. All personal values remain local to your browser.
- **High Performance**: Employs an optimized HTML5 Canvas to render the full day grid smoothly.
- **Offline Enabled**: Runs 100% offline, storing data via `chrome.storage.local` with `localStorage` fallbacks.
- **Fully Responsive**: Adapts seamlessly to standard widescreen monitors down to narrow browser sizes.

---

## Local Installation & Testing

To load and test the extension locally:

1. Open Google Chrome.
2. In the URL bar, navigate to `chrome://extensions`.
3. In the top-right corner, toggle **Developer mode** to **On**.
4. In the top-left, click **Load unpacked**.
5. Select the `chrome-extension/life-in-dots` directory containing this README and the manifest.
6. Open a new tab (`Ctrl+T` or `Cmd+T`) to see the extension in action.

---

## How Data is Stored

All data is stored inside Chrome's secure storage. The extension requests a single permission: `["storage"]`.
- `life-in-dots:profile`: Stores your name, birthday, target age, timeline mode, and sleep hours.
- `life-in-dots:preferences`: Stores the active unit tab (Years, Months, Days, or Hours).
- `life-in-dots:intentions`: Stores a map of date keys to your daily intentions.

No analytics, cookies, or remote databases are used.

### Resetting Local Data

To wipe your data and restart onboarding:
1. Click **Settings** in the top-right corner of the New Tab page.
2. Click **Forget my data** under the Danger Zone.
3. Confirm the action to reset the extension.

---

## Packaging for Release

To package this extension as a ZIP file for the Chrome Web Store or sharing:

### Files to Include
Ensure only the following files are bundled in your ZIP archive:
```text
manifest.json
newtab.html
styles.css
app.js
icons/
  icon16.png
  icon32.png
  icon48.png
  icon128.png
README.md
```

### Steps to ZIP
Run the following command in your terminal from the extension root:
```bash
zip -r life-in-dots-extension.zip . -x "*.git*" -x "*tests*"
```

---

## Chrome Web Store Preparation

1. Ensure all icons inside `icons/` are properly formatted PNG files.
2. Verify that `manifest.json` matches Manifest V3 standards with correct versioning numbers.
3. Run the extension through the local Chrome extension developer checks to ensure no warning logs appear.
4. Upload the packaged ZIP file via the Chrome Web Store Developer Dashboard.
