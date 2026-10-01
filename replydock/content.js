function insertIntoPage(text) {
  const el = document.activeElement;
  if (!el) return { ok: false, reason: "No focused field. Click a text box first." };

  if (el.isContentEditable) {
    el.focus();
    const ok = document.execCommand("insertText", false, text);
    if (!ok) {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return { ok: false, reason: "Could not insert into this editor." };
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
    return { ok: true };
  }

  const tag = (el.tagName || "").toUpperCase();
  if (tag === "TEXTAREA" || (tag === "INPUT" && /^(text|search|email|url|tel)$/i.test(el.type || "text"))) {
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + text + el.value.slice(end);
    const proto = tag === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    if (setter) setter.call(el, next);
    else el.value = next;
    el.selectionStart = el.selectionEnd = start + text.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return { ok: true };
  }

  return { ok: false, reason: "Click into a text field or editor, then insert again." };
}

if (!globalThis.__replydockInstalled) {
  globalThis.__replydockInstalled = true;
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === "insert") sendResponse(insertIntoPage(msg.text || ""));
    return true;
  });
}
