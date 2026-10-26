"use strict";
const cards = Array.from(document.querySelectorAll(".layout-card"));
const filters = Array.from(document.querySelectorAll("[data-filter]"));
for (const button of filters) {
  button.addEventListener("click", () => {
    for (const other of filters) other.setAttribute("aria-pressed", String(other === button));
    for (const card of cards) card.hidden = button.dataset.filter !== "all" && card.dataset.mode !== button.dataset.filter;
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector("#layout-count").textContent = `${count} of ${cards.length} layouts`;
  });
}
const viewer = document.querySelector("#layout-viewer");
const full = document.querySelector("#layout-full");
let selected;
function show(link) {
  selected = link;
  full.src = link.href;
  full.alt = link.querySelector("img").alt;
  document.querySelector("#layout-title").textContent = link.dataset.title;
  document.querySelector("#layout-original").href = link.href;
  if (!viewer.open) viewer.showModal();
}
function step(offset) {
  const links = cards.filter(card => !card.hidden).map(card => card.querySelector(".layout-shot"));
  if (links.length) show(links[(links.indexOf(selected) + offset + links.length) % links.length]);
}
for (const link of document.querySelectorAll(".layout-shot")) {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof viewer.showModal !== "function") return;
    event.preventDefault();
    show(link);
  });
}
document.querySelector("#layout-close").addEventListener("click", () => viewer.close());
document.querySelector("#layout-prev").addEventListener("click", () => step(-1));
document.querySelector("#layout-next").addEventListener("click", () => step(1));
viewer.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
});
viewer.addEventListener("click", event => { if (event.target === viewer) viewer.close(); });
