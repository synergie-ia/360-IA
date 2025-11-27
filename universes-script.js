/* ====== Paramètres ====== */
const STORAGE_KEY = "ia360_selected_universes";
/* ======================== */

/* -- Lecture des sélections en mémoire -- */
let selected = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

/* -- Tri alphabétique des univers (par nom) -- */
const universSorted = [...universesData].sort((a,b) =>
  a.name.localeCompare(b.name, "fr", {sensitivity:"base"})
);

/* -- Rendu principal -- */
const root = document.getElementById("universList");
const counter = document.getElementById("selectedCounter");
const btnClear = document.getElementById("btnClear");

renderAll();
updateCounter();

/* ----- Fonctions ----- */

function renderAll(){
  root.innerHTML = universSorted.map(u => renderCard(u)).join("");
  attachEvents();
}

function renderCard(u){
  const pressed = selected.has(u.id);
  return `
    <section class="card" data-id="${u.id}">
      <div class="card-head">
        <div class="head-left">
          <div class="icon" aria-hidden="true">${u.icon}</div>
          <div>
            <div class="name">${u.name}</div>
            ${u.description ? `<div class="desc">${u.description}</div>` : ""}
          </div>
        </div>

        <div class="actions">
          <button class="btn-ghost js-toggle" type="button" aria-expanded="false" title="Voir les sous-univers">
            🔎 Sous-univers
          </button>
          <button class="btn-round js-select" type="button"
                  aria-label="Sélectionner ${u.name}"
                  aria-pressed="${pressed ? "true" : "false"}">
            <span class="tick">${pressed ? "✓" : ""}</span>
          </button>
        </div>
      </div>

      <div class="accordion js-accordion" hidden>
        ${u.subUniverses?.map(s => `
          <div class="subitem">
            <div class="sub-ico">${s.icon ?? "•"}</div>
            <div>
              <div class="sub-name">${s.name}</div>
              ${s.description ? `<div class="sub-desc">${s.description}</div>` : ""}
            </div>
          </div>
        `).join("") || `<div class="subitem"><div>Aucun sous-univers renseigné.</div></div>`}
      </div>
    </section>
  `;
}

function attachEvents(){
  // Toggle accordéon
  root.querySelectorAll(".js-toggle").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const card = e.currentTarget.closest(".card");
      const acc = card.querySelector(".js-accordion");
      const expanded = e.currentTarget.getAttribute("aria-expanded")==="true";
      e.currentTarget.setAttribute("aria-expanded", String(!expanded));
      if(expanded){
        acc.hidden = true;
        acc.style.display = "none";
      }else{
        acc.hidden = false;
        acc.style.display = "block";
      }
    });
  });

  // Sélection / désélection (cercle)
  root.querySelectorAll(".js-select").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const card = e.currentTarget.closest(".card");
      const id = Number(card.dataset.id);

      if(selected.has(id)){ selected.delete(id); }
      else{ selected.add(id); }

      // Maj UI du bouton
      const pressed = selected.has(id);
      e.currentTarget.setAttribute("aria-pressed", String(pressed));
      e.currentTarget.querySelector(".tick").textContent = pressed ? "✓" : "";

      // Persistance
      persistSelection();
      updateCounter();
    });
  });

  // Reset
  btnClear.addEventListener("click", ()=>{
    if(!selected.size) return;
    selected.clear();
    persistSelection();
    // remettre tous les boutons à off
    root.querySelectorAll(".js-select").forEach(b=>{
      b.setAttribute("aria-pressed","false");
      b.querySelector(".tick").textContent = "";
    });
    updateCounter();
  });
}

function persistSelection(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
}

function updateCounter(){
  const n = selected.size;
  counter.textContent = n===0
    ? "0 univers sélectionné"
    : n===1
      ? "1 univers sélectionné"
      : `${n} univers sélectionnés`;
}
