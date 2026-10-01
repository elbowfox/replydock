importScripts("defaults.js");

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(["templates", "vars", "pro"]);
  if (!existing.templates) {
    await chrome.storage.local.set({
      templates: DEFAULT_TEMPLATES,
      vars: DEFAULT_VARS,
      pro: false,
      uses: 0
    });
  }
});
