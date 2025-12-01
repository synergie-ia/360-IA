/* 
  ============================================
  Passerelle-  - QUESTIONNAIRE PROFIL
  ============================================
  VERSION 12 QUESTIONS - 1 QUESTION PAR DIMENSION
  Limitation stricte des notes : 0(×2), 1(×3), 2(×3), 3(×4), 4(×3)
  LIMITE: 3 à 5 univers sélectionnables
  Novembre 2025
  ============================================
*/

let answers = {};
let profileComputed = false;
let selectedUnivers = new Set();
let totalQuestions = 12;

// Limitations strictes par note
const NOTE_LIMITS = {
  0: 2,  // Max 2 fois
  1: 3,  // Max 3 fois
  2: 3,  // Max 3 fois
  3: 4,  // Max 4 fois
  4: 3   // Max 3 fois
};

/* ===== GESTION DU LOCALSTORAGE ===== */

function loadSelections(){
  const saved = localStorage.getItem('selectedUnivers');
  if(saved){
    selectedUnivers = new Set(JSON.parse(saved));
  }
}

function saveSelections(){
  localStorage.setItem('selectedUnivers', JSON.stringify([...selectedUnivers]));
  // ✅ CORRECTION: Ne jamais modifier le badge ici
  // Le badge sera géré uniquement lors de la validation
  console.log(`💾 ${selectedUnivers.size} univers sélectionné(s) (non validé)`);
}

function loadAnswers(){
  const saved = localStorage.getItem('questionnaire_answers');
  if(saved){
    answers = JSON.parse(saved);
    return true;
  }
  return false;
}

function saveAnswers(){
  localStorage.setItem('questionnaire_answers', JSON.stringify(answers));
  // ✅ CORRECTION: Ne plus activer le badge automatiquement
  // Le badge "interets_completed" sera activé uniquement lors de la validation des univers
  const questionsCompleted = allQuestionsAnswered();
  console.log(`📌 Questions complétées: ${questionsCompleted}/${totalQuestions}`);
}

/* ===== UTILITAIRES ===== */

function allQuestionsAnswered(){
  const currentCount = Object.keys(answers).length;
  console.log(`Réponses: ${currentCount}/${totalQuestions}`);
  return currentCount === totalQuestions;
}

function getUnansweredQuestions(){
  const unanswered = [];
  
  QUESTIONS.forEach(q => {
    if(answers[q.id] === undefined){
      unanswered.push({
        questionId: q.id,
        questionTitle: q.title,
        questionText: q.text
      });
    }
  });
  
  return unanswered;
}

function highlightUnansweredQuestions(){
  document.querySelectorAll('.question-card').forEach(card => {
    card.classList.remove('unanswered');
  });
  
  const unanswered = getUnansweredQuestions();
  
  unanswered.forEach(item => {
    const card = document.getElementById(`card-${item.questionId}`);
    if(card){
      card.classList.add('unanswered');
    }
  });
  
  return unanswered;
}

/* ===== VALIDATION LIMITATIONS GLOBALES ===== */

function countNoteUsage(value){
  let count = 0;
  Object.values(answers).forEach(v => {
    if(v === value) count++;
  });
  return count;
}

function canUseNote(value, currentQuestionId){
  // Si c'est déjà la note sélectionnée pour cette question, toujours autoriser
  if(answers[currentQuestionId] === value){
    return true;
  }
  
  const usage = countNoteUsage(value);
  return usage < NOTE_LIMITS[value];
}

function updateAllButtonStates(){
  QUESTIONS.forEach(q => {
    updateButtonStatesForQuestion(q.id);
  });
}

function updateButtonStatesForQuestion(questionId){
  const card = document.getElementById(`card-${questionId}`);
  if(!card) return;
  
  [0, 1, 2, 3, 4].forEach(value => {
    const btn = card.querySelector(`.rate-btn[data-val='${value}']`);
    if(!btn) return;
    
    const isSelected = answers[questionId] === value;
    
    if(isSelected){
      btn.classList.remove('disabled');
      return;
    }
    
    if(canUseNote(value, questionId)){
      btn.classList.remove('disabled');
    } else {
      btn.classList.add('disabled');
    }
  });
}

/* ===== RENDU DES QUESTIONS ===== */

function renderQuestions(){
  const root = document.getElementById("questionsContainer");
  
  root.innerHTML = QUESTIONS.map(q => `
    <div class="question-card" id="card-${q.id}">
      <div class="question-header">
        <div class="question-title">${q.title}</div>
      </div>
      <div class="question-text">${q.text}</div>
      <div class="rating-scale">
        ${[0,1,2,3,4].map(v => `
          <button class="rate-btn" data-q="${q.id}" data-val="${v}">
            <span class="rate-value">${v}</span>
            <span class="rate-label">${getLabelForNote(v)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");

  // Restaurer les sélections
  Object.keys(answers).forEach(qId => {
    const v = answers[qId];
    const card = document.getElementById(`card-${qId}`);
    if(card){
      const btn = card.querySelector(`.rate-btn[data-val='${v}']`);
      if(btn){
        btn.classList.add("selected", `v${v}`);
      }
    }
  });

  updateAllButtonStates();
  attachRatingEvents();
}

function getLabelForNote(value){
  const labels = {
    0: "Pas du tout",
    1: "Plutôt non",
    2: "Moyennement",
    3: "Plutôt oui",
    4: "Totalement"
  };
  return labels[value];
}

function attachRatingEvents(){
  document.querySelectorAll(".rate-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const qId = btn.dataset.q;
      const v = Number(btn.dataset.val);
      
      // Si déjà sélectionné, on désélectionne
      if(answers[qId] === v){
        delete answers[qId];
      } else {
        // Vérifier si on peut utiliser cette note
        if(!canUseNote(v, qId)){
          btn.style.transform = 'scale(0.95)';
          setTimeout(() => {
            btn.style.transform = '';
          }, 100);
          
          const remaining = NOTE_LIMITS[v] - countNoteUsage(v);
          alert(`⚠️ Limite atteinte pour la note ${v}\n\nCette note peut être utilisée au maximum ${NOTE_LIMITS[v]} fois.\n\nUtilisations restantes : ${remaining}`);
          return;
        }
        
        answers[qId] = v;
      }
      
      saveAnswers();

      // Mettre à jour l'affichage
      const card = document.getElementById(`card-${qId}`);
      card.querySelectorAll('.rate-btn').forEach(b => {
        b.classList.remove("selected","v0","v1","v2","v3","v4");
      });
      
      if(answers[qId] !== undefined){
        btn.classList.add("selected", `v${answers[qId]}`);
      }

      card.classList.remove('unanswered');
      updateAllButtonStates();

      if(allQuestionsAnswered()){
        document.getElementById("errorMessage").classList.add("hidden");
      }

      if(profileComputed){
        document.getElementById("profileSection").classList.add("hidden");
        document.getElementById("univers-section").classList.add("hidden");
        profileComputed = false;
      }
    });
  });
}

/* ===== CALCUL DU PROFIL ===== */
function calcProfile(){
  const scores = Object.fromEntries(DIMENSIONS.map(d => [d.code, 0]));
  
  Object.keys(answers).forEach(qId => {
    const question = QUESTIONS.find(q => q.id === qId);
    if(question){
      const dim = question.dim;
      const val = answers[qId];
      scores[dim] = val;
    }
  });
  
  console.log("📊 Scores par dimension:");
  DIMENSIONS.forEach(d => {
    console.log(`   ${d.code} (${d.name}): ${scores[d.code]}`);
  });
  
  return scores;
}

/* ===== EXTRACTION DES DIMENSIONS PRINCIPALES ===== */
function extractMainDimensions(scores){
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1]);
  
  console.log("🔍 Toutes dimensions triées:");
  sorted.forEach(([code, value], index) => {
    const dimName = DIMENSIONS.find(d => d.code === code)?.name || code;
    console.log(`   ${index + 1}. ${code} (${dimName}): ${value}`);
  });
  
  const mainDims = sorted.slice(0, 3).map(([code]) => code);
  
  const thirdValue = sorted[2][1];
  const threshold = thirdValue * 0.9;
  
  console.log(`📏 Seuil d'égalité: ${threshold.toFixed(1)} (90% de ${thirdValue})`);
  
  for(let i = 3; i < sorted.length; i++){
    const [code, value] = sorted[i];
    if(value >= threshold){
      console.log(`   ✓ ${code} ajouté (${value} >= ${threshold.toFixed(1)})`);
      mainDims.push(code);
    } else {
      console.log(`   ✗ ${code} exclu (${value} < ${threshold.toFixed(1)})`);
    }
  }
  
  console.log("🎯 Dimensions principales finales:", mainDims);
  
  return mainDims;
}

/* ===== CALCUL DES UNIVERS ===== */
function calcUnivers(){
  const scores = calcProfile();
  const mainDims = extractMainDimensions(scores);
  
  if(typeof universesData === 'undefined' || typeof UNIVERS_WEIGHTS === 'undefined'){
    console.error("❌ Données univers non chargées");
    return [];
  }
  
  console.log("\n🔬 CALCUL DÉTAILLÉ DES UNIVERS");
  console.log("================================");
  
  const universAvecScores = universesData.map(univers => {
    const universWeights = UNIVERS_WEIGHTS.find(uw => uw.id === univers.id);
    
    if(!universWeights || !universWeights.weights){
      console.log(`⚠️ ${univers.name}: Pas de poids trouvés`);
      return {...univers, score: 0};
    }
    
    let score = 0;
    const details = [];
    
    universWeights.weights.forEach((coeff, index) => {
      if(index < DIMENSIONS.length){
        const dimCode = DIMENSIONS[index].code;
        const dimName = DIMENSIONS[index].name;
        
        if(mainDims.includes(dimCode) && coeff > 0){
          score += coeff;
          details.push(`${dimCode}(${coeff})`);
        }
      }
    });
    
    if(score > 0){
      console.log(`${univers.name}: ${score} pts [${details.join(' + ')}]`);
    }
    
    return {...univers, score: score};
  });
  
  const universTries = universAvecScores.sort((a, b) => b.score - a.score);
  
  console.log("\n🏆 TOP 10 UNIVERS:");
  console.log("==================");
  universTries.slice(0, 10).forEach((u, i) => {
    console.log(`${i+1}. ${u.name}: ${u.score} pts`);
  });
  
  return universTries;
}

/* ===== ÉCHELLE DE COMPATIBILITÉ ===== */
function getCompatibilityLevel(score){
  if(score >= 10){
    return {
      level: "très compatible",
      color: "#047857",
      class: "level-5"
    };
  } else if(score >= 8){
    return {
      level: "compatible",
      color: "#10b981",
      class: "level-4"
    };
  } else if(score >= 6){
    return {
      level: "moyennement compatible",
      color: "#d1d5db",
      class: "level-3"
    };
  } else if(score >= 4){
    return {
      level: "peu compatible",
      color: "#f97316",
      class: "level-2"
    };
  } else {
    return {
      level: "pas compatible",
      color: "#dc2626",
      class: "level-1"
    };
  }
}

/* ===== AFFICHAGE DU PROFIL ===== */
function displayProfile(){
  const scores = calcProfile();
  const root = document.getElementById("profileResults");
  
  const MAX_SCORE = 4;
  
  const dimensionsAvecScores = DIMENSIONS.map(dim => ({
    ...dim,
    score: scores[dim.code],
    pct: Math.round((scores[dim.code] / MAX_SCORE) * 100)
  }));
  
  dimensionsAvecScores.sort((a, b) => b.score - a.score);
  
  console.log("\n👤 PROFIL UTILISATEUR :");
  console.log("======================");
  dimensionsAvecScores.forEach(dim => {
    console.log(`${dim.name}: ${dim.pct}% (${dim.score}/${MAX_SCORE})`);
  });
  
  const profilePercentages = {};
  dimensionsAvecScores.forEach(dim => {
    profilePercentages[dim.code] = {
      name: dim.name,
      pct: dim.pct,
      score: dim.score
    };
  });
  localStorage.setItem('profile_percentages', JSON.stringify(profilePercentages));
  console.log('✅ Profil sauvegardé');
  
  root.innerHTML = dimensionsAvecScores.map(dim => `
    <div class="profile-row">
      <div class="profile-label">${dim.name}</div>
      <div class="profile-bar">
        <div class="profile-fill" style="width:${dim.pct}%"></div>
      </div>
      <div><strong>${dim.pct}%</strong></div>
    </div>
  `).join("");

  document.getElementById("profileSection").classList.remove("hidden");
  profileComputed = true;
  
  setTimeout(() => {
    document.getElementById("profileSection").scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 100);
}

/* ===== COMPTEUR UNIVERS ===== */

function updateUniversCounter(){
  const counter = document.getElementById("selectedUniversCounter");
  if(!counter) return;
  
  const n = selectedUnivers.size;
  const maxLabel = n >= 5 ? " (maximum atteint)" : ` / 5 max`;
  
  counter.textContent = n === 0
    ? "0 univers sélectionné (3 à 5 requis)"
    : n === 1
      ? `1 univers sélectionné${maxLabel}`
      : `${n} univers sélectionnés${maxLabel}`;
  
  if(n >= 5){
    counter.style.background = "#ffffff";
    counter.style.color = "#0052A3";
    counter.style.borderColor = "#d1d5db";
  } else {
    counter.style.background = "#ffffff";
    counter.style.color = "#0052A3";
    counter.style.borderColor = "#d1d5db";
  }
}

/* ===== GESTION ÉTAT BOUTON VALIDATION ===== */

function updateValidationButtonState(){
  const btnValidateSelection = document.getElementById('btnValidateSelection');
  if(!btnValidateSelection) return;
  
  const canValidate = selectedUnivers.size >= 3 && selectedUnivers.size <= 5;
  
  if(canValidate){
    btnValidateSelection.disabled = false;
    btnValidateSelection.style.opacity = '1';
    btnValidateSelection.style.cursor = 'pointer';
  } else {
    btnValidateSelection.disabled = true;
    btnValidateSelection.style.opacity = '0.5';
    btnValidateSelection.style.cursor = 'not-allowed';
  }
}

/* ===== CARTE UNIVERS ===== */

function renderUniversCard(u, index){
  const isSelected = selectedUnivers.has(u.id);
  const hasSubUnivers = u.subUniverses && u.subUniverses.length > 0;
  
  const compatibility = getCompatibilityLevel(u.score);
  
  const subUniversHTML = hasSubUnivers
    ? `<div class="sub-univers-list" id="sub-${u.id}">
        ${u.subUniverses.map(s => `
          <div class="sub-item">
            <div class="sub-icon">${s.icon || '•'}</div>
            <div>
              <div class="sub-name">${s.name}</div>
              ${s.description ? `<div class="sub-desc">${s.description}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>`
    : '';

  const percentage = Math.round((u.score / 12) * 100);
  
  return `
    <div class="univers-card ${isSelected ? 'selected' : ''} ${compatibility.class}" id="card-${u.id}">
      <div class="univers-header">
        <div class="univers-main">
          <div class="univers-rank">${index + 1}</div>
          <div class="univers-icon">${u.icon}</div>
          <div class="univers-name">${u.name}</div>
          <div class="univers-percentage">${percentage}%</div>
        </div>
        <div class="univers-right">
          <div class="univers-actions">
            ${hasSubUnivers 
              ? `<button class="btn-toggle-sub" data-id="${u.id}" title="Voir sous-univers">🔎</button>` 
              : '<div style="width:40px"></div>'}
            <button class="btn-select-univers ${isSelected ? 'selected' : ''}" data-id="${u.id}" title="Sélectionner">
              <span class="tick">${isSelected ? '✓' : ''}</span>
            </button>
          </div>
        </div>
      </div>
      ${subUniversHTML}
    </div>
  `;
}

/* ===== ÉVÉNEMENTS UNIVERS ===== */

function attachUniversEvents(){
  document.querySelectorAll(".btn-toggle-sub").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      const id = btn.dataset.id;
      const subList = document.getElementById(`sub-${id}`);
      
      if(subList){
        const isVisible = subList.classList.contains("visible");
        subList.classList.toggle("visible");
        btn.textContent = isVisible ? "🔎" : "❌";
        btn.title = isVisible ? "Voir sous-univers" : "Masquer";
      }
    });
  });

  document.querySelectorAll(".btn-select-univers").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      const id = Number(btn.dataset.id);
      const card = document.getElementById(`card-${id}`);
      
      if(selectedUnivers.has(id)){
        selectedUnivers.delete(id);
        card.classList.remove("selected");
        btn.classList.remove("selected");
        btn.querySelector(".tick").textContent = "";
      } else {
        if(selectedUnivers.size >= 5){
          alert("⚠️ Maximum 5 univers autorisés.\n\nVous devez d'abord désélectionner un univers avant d'en ajouter un nouveau.");
          return;
        }
        
        selectedUnivers.add(id);
        card.classList.add("selected");
        btn.classList.add("selected");
        btn.querySelector(".tick").textContent = "✓";
      }
      
      saveSelections();
      updateUniversCounter();
      updateValidationButtonState();
    });
  });
}

/* ===== AFFICHAGE UNIVERS ===== */

function displayUnivers(){
  console.log("\n🚀 LANCEMENT CALCUL UNIVERS");
  console.log("============================\n");
  
  try {
    const list = calcUnivers();
    console.log(`\n✅ ${list.length} univers calculés avec succès`);
    
    if(list.length === 0){
      alert("Erreur : Aucun univers calculé.");
      return;
    }
    
    const universDetails = {};
    list.forEach(u => {
      const compatibility = getCompatibilityLevel(u.score);
      universDetails[u.id] = {
        name: u.name,
        score: u.score,
        level: compatibility.level,
        color: compatibility.color
      };
    });
    localStorage.setItem('univers_details', JSON.stringify(universDetails));
    console.log('✅ Détails univers sauvegardés\n');
    
    const root = document.getElementById("univers-results");
    const top10 = list.slice(0, 10);

    // Message informatif à la place de la légende
    const infoHTML = `
      <div class="univers-info-message">
        Les pourcentages donnent une tendance basée sur vos réponses. Ce ne sont que des indications : vous restez libre de choisir les univers métiers qui vous correspondent le mieux.
      </div>
    `;

    root.innerHTML = infoHTML + top10.map((u, index) => renderUniversCard(u, index)).join("");
    attachUniversEvents();
    updateUniversCounter();
    updateValidationButtonState();

    const btnShow = document.getElementById("btn-show-all");
    btnShow.classList.remove("hidden");
    
    const newBtnShow = btnShow.cloneNode(true);
    btnShow.parentNode.replaceChild(newBtnShow, btnShow);
    
    newBtnShow.addEventListener("click", ()=>{
      root.innerHTML = infoHTML + list.map((u, index) => renderUniversCard(u, index)).join("");
      attachUniversEvents();
      newBtnShow.classList.add("hidden");
    });

    document.getElementById("univers-section").classList.remove("hidden");
    
    setTimeout(() => {
      document.getElementById("univers-section").scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
    
  } catch(error) {
    console.error("❌ ERREUR:", error);
    alert("Erreur : " + error.message);
  }
}

/* ===== INITIALISATION ===== */

document.addEventListener('DOMContentLoaded', function() {
  
  console.log("🔧 INITIALISATION DU SYSTÈME");
  console.log("=============================\n");
  
  if(typeof QUESTIONS === 'undefined'){
    console.error("❌ QUESTIONS non défini");
    alert("Erreur : QUESTIONS non chargé.");
    return;
  }
  
  if(typeof DIMENSIONS === 'undefined'){
    console.error("❌ DIMENSIONS non défini");
    alert("Erreur : DIMENSIONS non chargé.");
    return;
  }
  
  if(typeof universesData === 'undefined'){
    console.error("❌ universesData non défini");
    alert("Erreur : universesData non chargé.");
    return;
  }
  
  if(typeof UNIVERS_WEIGHTS === 'undefined'){
    console.error("❌ UNIVERS_WEIGHTS non défini");
    alert("Erreur : UNIVERS_WEIGHTS non chargé.");
    return;
  }
  
  console.log("✅ Toutes les données chargées");
  console.log(`📋 ${QUESTIONS.length} questions`);
  console.log(`🎯 ${DIMENSIONS.length} dimensions`);
  console.log(`🌍 ${universesData.length} univers`);
  console.log(`⚙️ ${UNIVERS_WEIGHTS.length} matrices\n`);
  
  console.log("🔍 Ordre des dimensions:");
  DIMENSIONS.forEach((d, i) => {
    console.log(`   ${i}. ${d.code} - ${d.name}`);
  });
  console.log("");
  
  loadSelections();
  loadAnswers();
  
  console.log(`Total questions: ${totalQuestions}\n`);
  
  renderQuestions();

  const btnValidate = document.getElementById("validateBtn");
  const errorMessage = document.getElementById("errorMessage");
  
  btnValidate.addEventListener("click", ()=>{
    loadAnswers();
    
    if(!allQuestionsAnswered()){
      const unanswered = highlightUnansweredQuestions();
      errorMessage.classList.remove("hidden");
      
      if(unanswered.length > 0){
        const firstCard = document.getElementById(`card-${unanswered[0].questionId}`);
        if(firstCard){
          setTimeout(() => {
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
      return;
    }
    
    errorMessage.classList.add("hidden");
    displayProfile();
  });

  const btnUnivers = document.getElementById("goUniversesBtn");
  btnUnivers.addEventListener("click", displayUnivers);

  const btnValidateSelection = document.getElementById('btnValidateSelection');
  if(btnValidateSelection){
    btnValidateSelection.addEventListener('click', ()=>{
      
      // Vérification stricte
      if(selectedUnivers.size < 3){
        alert("⚠️ Minimum 3 univers requis.\n\nActuellement : " + selectedUnivers.size);
        return;
      }
      
      if(selectedUnivers.size > 5){
        alert("⚠️ Maximum 5 univers autorisés.\n\nActuellement : " + selectedUnivers.size);
        return;
      }
      
      try {
        const universDetailsAll = JSON.parse(localStorage.getItem('univers_details') || '{}');
        const selectedUniversDetails = {};
        
        selectedUnivers.forEach(id => {
          if(universDetailsAll[id]){
            selectedUniversDetails[id] = universDetailsAll[id];
          }
        });
        
        localStorage.setItem('selected_univers_details', JSON.stringify(selectedUniversDetails));
        
        // ✅ BADGE "CENTRES D'INTÉRÊTS" ACTIVÉ ICI UNIQUEMENT
        localStorage.setItem('interets_completed', 'true');
        console.log('✅ Badge CENTRES D\'INTÉRÊTS activé (validation confirmée avec ' + selectedUnivers.size + ' univers)');
        
        console.log('✅ Sélection validée:', selectedUniversDetails);
        
        const originalText = btnValidateSelection.innerHTML;
        btnValidateSelection.innerHTML = '✅ Enregistré !';
        btnValidateSelection.style.background = '#22c55e';
        btnValidateSelection.style.color = '#fff';
        
        setTimeout(() => {
          btnValidateSelection.innerHTML = originalText;
          btnValidateSelection.style.background = '';
          btnValidateSelection.style.color = '';
        }, 3000);
        
        alert("✅ Sélection de " + selectedUnivers.size + " univers enregistrée !\n\nVous pouvez retourner à l'accueil.");
        
      } catch(error) {
        console.error('❌ Erreur:', error);
        alert("❌ Erreur de sauvegarde.");
      }
    });
  }

  const btnAccueilTop = document.getElementById("btnAccueilTop");
  if(btnAccueilTop){
    btnAccueilTop.addEventListener("click", ()=>{
      window.location.href = 'index.html';
    });
  }

  const btnAccueilBottom = document.getElementById("btnAccueilBottom");
  if(btnAccueilBottom){
    btnAccueilBottom.addEventListener("click", ()=>{
      window.location.href = 'index.html';
    });
  }
});
