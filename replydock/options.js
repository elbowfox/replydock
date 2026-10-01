const $ = (id) => document.getElementById(id);

async function refresh() {
  const data = await chrome.storage.local.get(["pro", "license", "vars"]);
  $("status").textContent = data.pro ? "Pro is active on this browser." : "Free plan · 10 replies.";
  $("key").value = data.license || "";
  $("me").value = data.vars?.me || "";
  $("company").value = data.vars?.company || "";
}

$("unlock").addEventListener("click", async () => {
  const key = $("key").value;
  const ok = await verifyLicense(key);
  $("msg").className = ok ? "ok" : "bad";
  $("msg").textContent = ok ? "License accepted." : "That key is not valid. Check the secret matches the generator.";
  if (!ok) return;
  const data = await chrome.storage.local.get(["vars"]);
  await chrome.storage.local.set({ pro: true, license: formatKey(key), vars: data.vars || {} });
  refresh();
});

$("clear").addEventListener("click", async () => {
  await chrome.storage.local.set({ pro: false, license: "" });
  refresh();
});

async function persistVars() {
  const data = await chrome.storage.local.get(["vars"]);
  await chrome.storage.local.set({
    vars: { ...(data.vars || {}), me: $("me").value, company: $("company").value }
  });
}
$("me").addEventListener("change", persistVars);
$("company").addEventListener("change", persistVars);

$("export").addEventListener("click", async () => {
  const data = await chrome.storage.local.get(["templates", "vars"]);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "replydock-backup.json";
  a.click();
  URL.revokeObjectURL(url);
});

$("import").addEventListener("click", () => $("file").click());
$("file").addEventListener("change", async () => {
  const file = $("file").files[0];
  if (!file) return;
  const data = JSON.parse(await file.text());
  if (!Array.isArray(data.templates)) return alert("File is missing templates.");
  await chrome.storage.local.set({ templates: data.templates, vars: data.vars || {} });
  alert("Imported.");
});

refresh();
