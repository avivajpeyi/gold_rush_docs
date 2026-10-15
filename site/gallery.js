"use strict";
const rows = Array.from(document.querySelectorAll("tbody tr"));
const search = document.querySelector("#search");
const kind = document.querySelector("#kind");
const category = document.querySelector("#category");
const sort = document.querySelector("#sort");
function filterRooms() {
  const terms = search.value.toLowerCase().replaceAll("_", " ").trim().split(/\s+/);
  let count = 0;
  for (const row of rows) {
    const matchesCategory = category.value === "" || (category.value === "featured" ? row.dataset.category !== "standard" : row.dataset.category === category.value);
    row.hidden = !terms.every(term => row.dataset.search.includes(term)) || (kind.value !== "" && row.dataset.kind !== kind.value) || !matchesCategory;
    if (!row.hidden) count++;
  }
  document.querySelector("#count").textContent = `${count} of ${rows.length} spaces`;
  document.querySelector("#empty").hidden = count !== 0;
}
search.addEventListener("input", filterRooms);
kind.addEventListener("change", filterRooms);
category.addEventListener("change", filterRooms);
sort.addEventListener("change", () => {
  const priority = {relic: 0, treasure: 1, standard: 2};
  const ordered = [...rows].sort((a, b) => {
    let difference = 0;
    if (sort.value === "reward") difference = priority[a.dataset.category] - priority[b.dataset.category];
    if (sort.value === "area") difference = Number(b.dataset.area) - Number(a.dataset.area);
    return difference || a.dataset.name.localeCompare(b.dataset.name);
  });
  for (const row of ordered) document.querySelector("tbody").appendChild(row);
});
const dialog = document.querySelector("#viewer");
const full = document.querySelector("#full-image");
let selection = null;
function showImage(link) {
  selection = link;
  full.src = link.href;
  full.alt = link.querySelector("img").alt;
  document.querySelector("#view-title").textContent = link.dataset.title;
  document.querySelector("#original").href = link.href;
  if (!dialog.open) dialog.showModal();
}
function nextImage(step) {
  const links = Array.from(document.querySelectorAll("tbody tr:not([hidden]) .shot"));
  if (!links.length) return;
  showImage(links[(links.indexOf(selection) + step + links.length) % links.length]);
}
for (const link of document.querySelectorAll(".shot")) {
  link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof dialog.showModal !== "function") return;
    event.preventDefault();
    showImage(link);
  });
}
document.querySelector("#close").addEventListener("click", () => dialog.close());
document.querySelector("#prev").addEventListener("click", () => nextImage(-1));
document.querySelector("#next").addEventListener("click", () => nextImage(1));
dialog.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") { event.preventDefault(); nextImage(1); }
  if (event.key === "ArrowLeft") { event.preventDefault(); nextImage(-1); }
});
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
