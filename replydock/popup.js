const $ = (id) => document.getElementById(id);
let state = { templates: [], vars: {}, pro: false, uses: 0 };
let editing = null;

async function load() {
  const data = await chrome.storage.local.get(["templates", "vars", "pro", "uses"]);
  state.templates = data.templates || DEFAULT_TEMPLATES;
  state.vars = { ...DEFAULT_VARS, ...(data.vars || {}) };
  state.pro = Boolean(data.pro);
  state.uses = data.uses || 0;
  if (!data.templates) await chrome.storage.local.set({ templates: state.templates, vars: state.vars, pro: false, uses: 0 });
  $("plan").textContent = state.pro ? "Pro" : "Free";
  render();
}

function save() {
  return chrome.storage.local.set({ templates: state.templates, vars: state.vars, pro: state.pro, uses: state.uses });
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const items = state.templates.filter((t) =>
    !q || `${t.title} ${t.category} ${t.body}`.toLowerCase().includes(q)
  );
  $("count").textContent = state.pro ? `${state.templates.length} replies` : `${state.templates.length}/${FREE_LIMIT} free`;
  if (!items.length) {
    $("list").innerHTML = `<div class="empty">No replies yet.</div>`;
    return;
  }
  $("list").innerHTML = items.map((t, i) => {
    const locked = !state.pro && state.templates.indexOf(t) >= FREE_LIMIT;
    return `<article class="card ${locked ? "lock" : ""}" data-id="${t.id}">
      <h3>${escapeHtml(t.title)}</h3>
      <div class="meta">${escapeHtml(t.category || "General")}${locked ? " · Pro" : ""}</div>
      <div class="preview">${escapeHtml(t.body)}</div>
      <div class="actions">
        <button data-act="insert" data-id="${t.id}" ${locked ? "disabled" : ""}>Insert</button>
        <button data-act="edit" data-id="${t.id}">Edit</button>
        <button data-act="delete" data-id="${t.id}">Delete</button>
      </div>
    </article>`;
  }).join("");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[c]));
}

function fill(body) {
  const needed = [...body.matchAll(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi)].map((m) => m[1].toLowerCase());
  const unique = [...new Set(needed)];
  let out = body;
  for (const key of unique) {
    const current = state.vars[key] || "";
    const value = prompt(`Value for {{${key}}}`, current);
    if (value === null) return null;
    state.vars[key] = value;
    out = out.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "gi"), value);
  }
  if (/\{\{\s*date\s*\}\}/i.test(body) === false && out.includes("{{date}}")) {
    out = out.replaceAll("{{date}}", new Date().toLocaleDateString());
  }
  out = out.replaceAll("{{date}}", state.vars.date || new Date().toLocaleDateString());
  return out;
}

async function insert(id) {
  const t = state.templates.find((x) => x.id === id);
  if (!t) return;
  const index = state.templates.indexOf(t);
  if (!state.pro && index >= FREE_LIMIT) {
    alert("Free includes 10 replies. Unlock Pro in Settings.");
    return;
  }
  const text = fill(t.body);
  if (text === null) return;
  await save();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return alert("No active tab.");
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    const res = await chrome.tabs.sendMessage(tab.id, { type: "insert", text });
    if (!res?.ok) alert(res?.reason || "Could not insert.");
    else {
      state.uses += 1;
      await save();
      window.close();
    }
  } catch (err) {
    alert("This page blocked the extension. Try a normal site field, not the Chrome Web Store or a chrome:// page.");
  }
}

$("list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.act === "insert") insert(id);
  if (btn.dataset.act === "edit") openEditor(id);
  if (btn.dataset.act === "delete") {
    state.templates = state.templates.filter((t) => t.id !== id);
    save().then(render);
  }
});

function openEditor(id) {
  editing = id || null;
  const t = state.templates.find((x) => x.id === id);
  $("title").value = t?.title || "";
  $("category").value = t?.category || "General";
  $("body").value = t?.body || "";
  $("composer").classList.remove("hidden");
  $("list").classList.add("hidden");
}

$("add").addEventListener("click", () => {
  if (!state.pro && state.templates.length >= FREE_LIMIT) {
    alert("Free plan holds 10 replies. Open Settings and paste a Pro license.");
    return;
  }
  openEditor(null);
});
$("cancel").addEventListener("click", () => {
  $("composer").classList.add("hidden");
  $("list").classList.remove("hidden");
});
$("composer").addEventListener("submit", async (e) => {
  e.preventDefault();
  const item = {
    id: editing || crypto.randomUUID(),
    title: $("title").value.trim(),
    category: $("category").value.trim() || "General",
    body: $("body").value
  };
  if (editing) state.templates = state.templates.map((t) => (t.id === editing ? item : t));
  else state.templates.unshift(item);
  await save();
  $("composer").classList.add("hidden");
  $("list").classList.remove("hidden");
  render();
});
$("search").addEventListener("input", render);
$("options").addEventListener("click", () => chrome.runtime.openOptionsPage());

load();
