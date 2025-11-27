/* 
  ============================================
  RECONVERSION 360 IA - PAGE D'ACCUEIL
  ============================================
  Gestion des badges de complétion et actions
  VERSION COMPLÈTE - Copie profil + univers + bilan
  VERSION ATLAS - Section HTML cachée pour ChatGPT
  VERSION FINALE - Messages améliorés + gestion blocage
  ============================================
*/

document.addEventListener('DOMContentLoaded', function() {
  
  console.log("🏠 PAGE D'ACCUEIL - Initialisation");
  console.log("====================================\n");
  
  updateCompletionBadges();
  updateAtlasData(); // NOUVEAU : Remplir la section Atlas
  
  const btnReset = document.getElementById('btnResetData');
  if(btnReset){
    btnReset.addEventListener('click', confirmReset);
  }
  
  const btnCopy = document.getElementById('btnCopyResults');
  if(btnCopy){
    btnCopy.addEventListener('click', copyResultsToClipboard);
  }
  
  const btnProject = document.getElementById('btnConstructProject');
  if(btnProject){
    btnProject.addEventListener('click', checkProjectAccess);
  }
  
  const btnUniversMetiers = document.getElementById('btnUniversMetiers');
  if(btnUniversMetiers){
    btnUniversMetiers.addEventListener('click', function() {
      window.location.href = 'univers-metiers.html';
    });
  }
  
  // NOUVEAU : Bouton DEBUG provisoire
  const btnDebugAtlas = document.getElementById('btnDebugAtlas');
  if(btnDebugAtlas){
    btnDebugAtlas.addEventListener('click', showAtlasData);
  }
});

/* ===== NOUVELLE FONCTION : REMPLIR SECTION ATLAS ===== */

function updateAtlasData() {
  console.log("🌐 Atlas - Mise à jour des données...");
  
  const atlasDate = document.getElementById('atlasDate');
  if(atlasDate){
    atlasDate.textContent = new Date().toISOString();
    atlasDate.setAttribute('datetime', new Date().toISOString());
  }
  
  // 1. PROFIL PERSONNEL
  const profileData = localStorage.getItem('profile_percentages');
  const atlasProfileData = document.getElementById('atlasProfileData');
  
  if(profileData && atlasProfileData){
    try {
      const profile = JSON.parse(profileData);
      let html = '<dl data-type="profil-dimensions">';
      
      const profileArray = Object.entries(profile)
        .map(([code, data]) => ({
          code: code,
          name: data.name,
          pct: data.pct,
          score: data.score
        }))
        .sort((a, b) => b.pct - a.pct);
      
      profileArray.forEach(dim => {
        html += `<div data-dimension="${dim.code}">`;
        html += `<dt>${dim.code} - ${dim.name}</dt>`;
        html += `<dd data-percentage="${dim.pct}" data-score="${dim.score}">${dim.pct}%</dd>`;
        html += `</div>`;
      });
      
      html += '</dl>';
      
      html += '<div data-type="top-dimensions">';
      profileArray.slice(0, 3).forEach((dim, index) => {
        html += `<div data-rank="${index + 1}" data-dimension="${dim.code}" data-percentage="${dim.pct}">`;
        html += `${dim.code} (${dim.name}): ${dim.pct}%`;
        html += `</div>`;
      });
      html += '</div>';
      
      atlasProfileData.innerHTML = html;
      console.log("✅ Atlas - Profil ajouté");
    } catch(e) {
      console.error("❌ Atlas - Erreur profil:", e);
    }
  }
  
  // 2. UNIVERS SÉLECTIONNÉS
  const universData = localStorage.getItem('selected_univers_details');
  const atlasUniversData = document.getElementById('atlasUniversData');
  
  if(universData && atlasUniversData){
    try {
      const univers = JSON.parse(universData);
      const universArray = Object.entries(univers);
      
      if(universArray.length > 0){
        let html = '<ul data-type="univers-list">';
        
        universArray
          .sort((a, b) => b[1].score - a[1].score)
          .forEach(([id, data]) => {
            const percentage = Math.round((data.score / 12) * 100);
            html += `<li data-univers-id="${id}" data-score="${data.score}" data-percentage="${percentage}" data-level="${data.level}">`;
            html += `<span data-field="name">${data.name}</span>`;
            html += `<span data-field="compatibility">${percentage}%</span>`;
            html += `<span data-field="level">${data.level}</span>`;
            html += `</li>`;
          });
        
        html += '</ul>';
        atlasUniversData.innerHTML = html;
        console.log("✅ Atlas - Univers ajoutés");
      }
    } catch(e) {
      console.error("❌ Atlas - Erreur univers:", e);
    }
  }
  
  // 3. BILAN PERSONNEL
  const situationData = localStorage.getItem('situation_data');
  
  if(situationData){
    try {
      const situation = JSON.parse(situationData);
      
      // Identité
      const atlasIdentite = document.getElementById('atlasIdentite');
      if(atlasIdentite){
        let html = '<h3>Identité</h3><dl>';
        if(situation.prenom) html += `<div><dt>Prénom</dt><dd data-field="prenom">${situation.prenom}</dd></div>`;
        if(situation.age) html += `<div><dt>Âge</dt><dd data-field="age">${situation.age}</dd></div>`;
        html += '</dl>';
        atlasIdentite.innerHTML = html;
      }
      
      // Situation & Parcours
      const atlasSituation = document.getElementById('atlasSituation');
      if(atlasSituation){
        let html = '<h3>Situation & Parcours</h3><dl>';
        if(situation.q1) html += `<div><dt>Objectif professionnel</dt><dd data-field="q1">${situation.q1}</dd></div>`;
        if(situation.q2) html += `<div><dt>Statut actuel</dt><dd data-field="q2">${situation.q2}</dd></div>`;
        if(situation.q3) html += `<div><dt>Niveau de formation</dt><dd data-field="q3">${situation.q3}</dd></div>`;
        if(situation.q4) html += `<div><dt>Certifications</dt><dd data-field="q4">${situation.q4}</dd></div>`;
        html += '</dl>';
        atlasSituation.innerHTML = html;
      }
      
      // Ressources & Compétences
      const atlasRessources = document.getElementById('atlasRessources');
      if(atlasRessources){
        let html = '<h3>Ressources & Compétences</h3><dl>';
        if(situation.q5) html += `<div><dt>Compétences techniques</dt><dd data-field="q5">${situation.q5}</dd></div>`;
        if(situation.q6) html += `<div><dt>Compétences à réutiliser</dt><dd data-field="q6">${situation.q6}</dd></div>`;
        if(situation.q7) html += `<div><dt>Compétences relationnelles</dt><dd data-field="q7">${situation.q7}</dd></div>`;
        if(situation.q8) html += `<div><dt>Expériences marquantes</dt><dd data-field="q8">${situation.q8}</dd></div>`;
        html += '</dl>';
        atlasRessources.innerHTML = html;
      }
      
      // Valeurs & Sens du travail
      const atlasValeurs = document.getElementById('atlasValeurs');
      if(atlasValeurs){
        let html = '<h3>Valeurs & Sens du travail</h3><dl>';
        if(situation.q9) html += `<div><dt>Valeurs essentielles</dt><dd data-field="q9">${situation.q9}</dd></div>`;
        if(situation.q10) html += `<div><dt>Secteurs à éviter</dt><dd data-field="q10">${situation.q10}</dd></div>`;
        html += '</dl>';
        atlasValeurs.innerHTML = html;
      }
      
      // Contraintes & Conditions
      const atlasContraintes = document.getElementById('atlasContraintes');
      if(atlasContraintes){
        let html = '<h3>Contraintes & Conditions</h3><dl>';
        if(situation.q11) html += `<div><dt>Géographie/Mobilité</dt><dd data-field="q11">${situation.q11}</dd></div>`;
        if(situation.q12) html += `<div><dt>Conditions de travail</dt><dd data-field="q12">${situation.q12}</dd></div>`;
        if(situation.q13) html += `<div><dt>Horaires</dt><dd data-field="q13">${situation.q13}</dd></div>`;
        if(situation.q14) html += `<div><dt>Limitations</dt><dd data-field="q14">${situation.q14}</dd></div>`;
        if(situation.q15) html += `<div><dt>Rémunération minimale</dt><dd data-field="q15">${situation.q15}</dd></div>`;
        if(situation.q16) html += `<div><dt>Situations à éviter</dt><dd data-field="q16">${situation.q16}</dd></div>`;
        if(situation.q17) html += `<div><dt>Environnement idéal</dt><dd data-field="q17">${situation.q17}</dd></div>`;
        if(situation.q18) html += `<div><dt>Échéance du projet</dt><dd data-field="q18">${situation.q18}</dd></div>`;
        html += '</dl>';
        atlasContraintes.innerHTML = html;
      }
      
      // Formation
      const atlasFormation = document.getElementById('atlasFormation');
      if(atlasFormation){
        let html = '<h3>Formation</h3><dl>';
        if(situation.q19) html += `<div><dt>Formation envisagée</dt><dd data-field="q19">${situation.q19}</dd></div>`;
        html += '</dl>';
        atlasFormation.innerHTML = html;
      }
      
      // Tests psychotechniques
      const atlasTests = document.getElementById('atlasTests');
      if(atlasTests){
        let html = '<h3>Tests psychotechniques</h3><dl>';
        if(situation.q21) html += `<div><dt>Tests passés</dt><dd data-field="q21">${situation.q21}</dd></div>`;
        html += '</dl>';
        atlasTests.innerHTML = html;
      }
      
      // Ouverture
      const atlasOuverture = document.getElementById('atlasOuverture');
      if(atlasOuverture){
        let html = '<h3>Ouverture</h3><dl>';
        if(situation.q20) html += `<div><dt>Informations complémentaires</dt><dd data-field="q20">${situation.q20}</dd></div>`;
        html += '</dl>';
        atlasOuverture.innerHTML = html;
      }
      
      console.log("✅ Atlas - Bilan complet ajouté");
    } catch(e) {
      console.error("❌ Atlas - Erreur bilan:", e);
    }
  }
  
  console.log("✅ Atlas - Mise à jour terminée");
}

/* ===== NOUVELLE FONCTION : AFFICHER DONNÉES ATLAS (DEBUG) ===== */

function showAtlasData() {
  const atlasData = document.getElementById('atlasData');
  
  if(!atlasData){
    alert("❌ Section Atlas introuvable");
    return;
  }
  
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    overflow: auto;
    padding: 20px;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    position: relative;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Fermer';
  closeBtn.style.cssText = `
    position: sticky;
    top: 10px;
    float: right;
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    z-index: 1;
  `;
  closeBtn.onclick = () => document.body.removeChild(modal);
  
  const title = document.createElement('h2');
  title.textContent = '🔍 DEBUG - Données Atlas (HTML caché)';
  title.style.cssText = 'color: #333; margin-bottom: 20px; clear: both;';
  
  const htmlDisplay = document.createElement('pre');
  htmlDisplay.textContent = atlasData.innerHTML;
  htmlDisplay.style.cssText = `
    background: #f5f5f5;
    padding: 20px;
    border-radius: 5px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
  `;
  
  content.appendChild(closeBtn);
  content.appendChild(title);
  content.appendChild(htmlDisplay);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  console.log("🔍 DEBUG - HTML Atlas affiché");
  console.log(atlasData.innerHTML);
}

/* ===== BADGES DE COMPLÉTION ===== */

function updateCompletionBadges() {
  const hasAnswers = localStorage.getItem('questionnaire_answers');
  const hasProfile = localStorage.getItem('profile_percentages');
  const hasUnivers = localStorage.getItem('selected_univers_details');
  
  const cards = document.querySelectorAll('.action-card');
  
  if(cards[0] && (hasAnswers || hasProfile || hasUnivers)){
    const badge = document.createElement('div');
    badge.className = 'completion-badge';
    badge.textContent = '✓ Complété';
    cards[0].appendChild(badge);
    console.log('✅ Badge Questionnaire ajouté');
  }
  
  const hasSituation = localStorage.getItem('situation_data');
  if(cards[1] && hasSituation){
    const badge = document.createElement('div');
    badge.className = 'completion-badge';
    badge.textContent = '✓ Complété';
    cards[1].appendChild(badge);
    console.log('✅ Badge Bilan ajouté');
  }
}

/* ===== RÉINITIALISATION ===== */

function confirmReset() {
  const confirmation = confirm(
    "⚠️ ATTENTION ⚠️\n\n" +
    "Êtes-vous sûr de vouloir SUPPRIMER TOUTES vos données ?\n\n" +
    "Cela inclut :\n" +
    "• Vos réponses au questionnaire (12 questions)\n" +
    "• Votre profil calculé\n" +
    "• Vos univers sélectionnés\n" +
    "• Votre bilan personnel\n\n" +
    "Cette action est IRRÉVERSIBLE."
  );
  
  if(confirmation){
    const secondConfirm = confirm(
      "⚠️ DERNIÈRE CONFIRMATION ⚠️\n\n" +
      "Voulez-vous VRAIMENT tout supprimer ?\n\n" +
      "Cliquez sur OK pour confirmer la suppression définitive."
    );
    
    if(secondConfirm){
      resetAllData();
    }
  }
}

function resetAllData() {
  try {
    const keysToRemove = [
      'questionnaire_answers',
      'profile_percentages',
      'univers_details',
      'selected_univers_details',
      'selectedUnivers',
      'situation_data',
      'data_exported'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Supprimé: ${key}`);
    });
    
    // NOUVEAU : Vider la section Atlas
    clearAtlasData();
    
    console.log('✅ Toutes les données ont été supprimées');
    
    alert("✅ Toutes vos données ont été supprimées avec succès.\n\nLa page va se recharger.");
    
    location.reload();
    
  } catch(error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    alert("❌ Une erreur s'est produite lors de la suppression des données.");
  }
}

/* ===== NOUVELLE FONCTION : VIDER SECTION ATLAS ===== */

function clearAtlasData() {
  console.log("🌐 Atlas - Suppression des données...");
  
  const atlasProfileData = document.getElementById('atlasProfileData');
  const atlasUniversData = document.getElementById('atlasUniversData');
  const atlasIdentite = document.getElementById('atlasIdentite');
  const atlasSituation = document.getElementById('atlasSituation');
  const atlasRessources = document.getElementById('atlasRessources');
  const atlasValeurs = document.getElementById('atlasValeurs');
  const atlasContraintes = document.getElementById('atlasContraintes');
  const atlasFormation = document.getElementById('atlasFormation');
  const atlasTests = document.getElementById('atlasTests');
  const atlasOuverture = document.getElementById('atlasOuverture');
  const atlasDate = document.getElementById('atlasDate');
  
  if(atlasProfileData) atlasProfileData.innerHTML = '';
  if(atlasUniversData) atlasUniversData.innerHTML = '';
  if(atlasIdentite) atlasIdentite.innerHTML = '';
  if(atlasSituation) atlasSituation.innerHTML = '';
  if(atlasRessources) atlasRessources.innerHTML = '';
  if(atlasValeurs) atlasValeurs.innerHTML = '';
  if(atlasContraintes) atlasContraintes.innerHTML = '';
  if(atlasFormation) atlasFormation.innerHTML = '';
  if(atlasTests) atlasTests.innerHTML = '';
  if(atlasOuverture) atlasOuverture.innerHTML = '';
  if(atlasDate) atlasDate.textContent = '';
  
  console.log("✅ Atlas - Données supprimées");
}

/* ===== VÉRIFICATION DES DONNÉES REQUISES ===== */

function checkRequiredData() {
  const selectedUniversDetails = localStorage.getItem('selected_univers_details');
  let hasUnivers = false;
  
  if(selectedUniversDetails) {
    try {
      const univers = JSON.parse(selectedUniversDetails);
      const universCount = Object.keys(univers).length;
      hasUnivers = universCount >= 3;
      console.log(`🌍 Univers sélectionnés: ${universCount}`);
    } catch(e) {
      console.error("❌ Erreur lecture univers:", e);
    }
  }
  
  const situationData = localStorage.getItem('situation_data');
  let hasSituation = false;
  
  if(situationData) {
    try {
      const situation = JSON.parse(situationData);
      hasSituation = situation && Object.keys(situation).length > 2;
      console.log(`📋 Bilan: ${hasSituation ? 'Rempli' : 'Incomplet'}`);
    } catch(e) {
      console.error("❌ Erreur lecture bilan:", e);
    }
  }
  
  return { 
    hasUnivers, 
    hasSituation 
  };
}

/* ===== COPIE DES RÉSULTATS ===== */

function copyResultsToClipboard() {
  try {
    console.log("📋 Début de la copie des résultats...");
    
    const { hasUnivers, hasSituation } = checkRequiredData();
    
    if(!hasUnivers && !hasSituation){
      alert("⚠️ Aucune donnée à copier.\n\nVeuillez d'abord :\n• Sélectionner au moins 3 univers\n• Compléter votre bilan personnel");
      return;
    }
    
    if(!hasUnivers){
      alert("⚠️ Univers non sélectionnés.\n\nVeuillez sélectionner au moins 3 univers dans le questionnaire avant de copier vos résultats.");
      return;
    }
    
    if(!hasSituation){
      alert("⚠️ Bilan personnel non rempli.\n\nVeuillez compléter votre bilan personnel avant de copier vos résultats.");
      return;
    }
    
    const universData = localStorage.getItem('selected_univers_details');
    const situationData = localStorage.getItem('situation_data');
    
    let textToCopy = "═══════════════════════════════════════\n";
    textToCopy += "   RECONVERSION 360 IA - MES RÉSULTATS\n";
    textToCopy += "═══════════════════════════════════════\n\n";
    
    // PROFIL PERSONNEL
    const profileData = localStorage.getItem('profile_percentages');
    if(profileData){
      try {
        const profile = JSON.parse(profileData);
        textToCopy += "👤 MON PROFIL PERSONNEL\n";
        textToCopy += "───────────────────────────────────────\n\n";
        
        const profileArray = Object.entries(profile)
          .map(([code, data]) => ({
            code: code,
            name: data.name,
            pct: data.pct,
            score: data.score
          }))
          .sort((a, b) => b.pct - a.pct);
        
        profileArray.forEach(dim => {
          textToCopy += `${dim.code} - ${dim.name}: ${dim.pct}%\n`;
        });
        
        textToCopy += "\n📊 Mes 3 dimensions dominantes:\n";
        profileArray.slice(0, 3).forEach((dim, index) => {
          textToCopy += `${index + 1}. ${dim.code} (${dim.name}): ${dim.pct}%\n`;
        });
        
        textToCopy += "\n";
        console.log("✅ Profil ajouté");
      } catch(e) {
        console.error("❌ Erreur profil:", e);
      }
    }
    
    // UNIVERS SÉLECTIONNÉS
    if(universData){
      try {
        const univers = JSON.parse(universData);
        const universArray = Object.entries(univers);
        
        if(universArray.length > 0){
          textToCopy += "🌍 MES UNIVERS SÉLECTIONNÉS\n";
          textToCopy += "───────────────────────────────────────\n\n";
          
          universArray
            .sort((a, b) => b[1].score - a[1].score)
            .forEach(([id, data]) => {
              const percentage = Math.round((data.score / 12) * 100);
              textToCopy += `• ${data.name}\n`;
              textToCopy += `  Compatibilité: ${percentage}% (${data.level})\n\n`;
            });
          
          console.log("✅ Univers ajoutés");
        }
      } catch(e) {
        console.error("❌ Erreur univers:", e);
      }
    }
    
    // BILAN PERSONNEL
    if(situationData){
      try {
        const situation = JSON.parse(situationData);
        textToCopy += "📋 MON BILAN PERSONNEL\n";
        textToCopy += "───────────────────────────────────────\n\n";
        
        if(situation.prenom){
          textToCopy += `Prénom: ${situation.prenom}\n`;
        }
        if(situation.age){
          textToCopy += `Âge: ${situation.age} ans\n\n`;
        }
        
        textToCopy += "1. SITUATION & PARCOURS\n";
        textToCopy += "─────────────────────────\n";
        if(situation.q1) textToCopy += `Objectif professionnel: ${situation.q1}\n\n`;
        if(situation.q2) textToCopy += `Statut actuel: ${situation.q2}\n\n`;
        if(situation.q3) textToCopy += `Niveau de formation: ${situation.q3}\n\n`;
        if(situation.q4) textToCopy += `Certifications: ${situation.q4}\n\n`;
        
        textToCopy += "2. RESSOURCES & COMPÉTENCES\n";
        textToCopy += "─────────────────────────────\n";
        if(situation.q5) textToCopy += `Compétences techniques: ${situation.q5}\n\n`;
        if(situation.q6) textToCopy += `Compétences à réutiliser: ${situation.q6}\n\n`;
        if(situation.q7) textToCopy += `Compétences relationnelles: ${situation.q7}\n\n`;
        if(situation.q8) textToCopy += `Expériences marquantes: ${situation.q8}\n\n`;
        
        textToCopy += "3. VALEURS & SENS DU TRAVAIL\n";
        textToCopy += "──────────────────────────────\n";
        if(situation.q9) textToCopy += `Valeurs essentielles: ${situation.q9}\n\n`;
        if(situation.q10) textToCopy += `Secteurs à éviter: ${situation.q10}\n\n`;
        
        textToCopy += "4. CONTRAINTES & CONDITIONS\n";
        textToCopy += "─────────────────────────────\n";
        if(situation.q11) textToCopy += `Géographie/Mobilité: ${situation.q11}\n\n`;
        if(situation.q12) textToCopy += `Conditions de travail: ${situation.q12}\n\n`;
        if(situation.q13) textToCopy += `Horaires: ${situation.q13}\n\n`;
        if(situation.q14) textToCopy += `Limitations: ${situation.q14}\n\n`;
        if(situation.q15) textToCopy += `Rémunération minimale: ${situation.q15}\n\n`;
        if(situation.q16) textToCopy += `Situations à éviter: ${situation.q16}\n\n`;
        if(situation.q17) textToCopy += `Environnement idéal: ${situation.q17}\n\n`;
        if(situation.q18) textToCopy += `Échéance du projet: ${situation.q18}\n\n`;
        
        textToCopy += "5. FORMATION\n";
        textToCopy += "─────────────\n";
        if(situation.q19) textToCopy += `Formation envisagée: ${situation.q19}\n\n`;
        
        textToCopy += "6. TESTS PSYCHOTECHNIQUES\n";
        textToCopy += "───────────────────────────\n";
        if(situation.q21) textToCopy += `Tests passés: ${situation.q21}\n\n`;
        
        textToCopy += "7. OUVERTURE\n";
        textToCopy += "─────────────\n";
        if(situation.q20) textToCopy += `Informations complémentaires: ${situation.q20}\n\n`;
        
        console.log("✅ Bilan complet ajouté (20 questions)");
      } catch(e) {
        console.error("❌ Erreur situation:", e);
      }
    }
    
    textToCopy += "═══════════════════════════════════════\n";
    textToCopy += "Généré par Reconversion 360 IA\n";
    textToCopy += new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + "\n";
    textToCopy += "═══════════════════════════════════════";
    
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log("✅ Texte copié avec succès");
          localStorage.setItem('data_exported', 'true');
          showCopySuccess();
        })
        .catch(err => {
          console.error("❌ Erreur clipboard API:", err);
          fallbackCopy(textToCopy);
        });
    } else {
      fallbackCopy(textToCopy);
    }
    
  } catch(error) {
    console.error("❌ Erreur générale:", error);
    alert("❌ Une erreur s'est produite lors de la copie.\n\nDétails: " + error.message);
  }
}

/* ===== TÉLÉCHARGEMENT PDF (CONSERVÉ MAIS NON UTILISÉ) ===== */

function downloadPDF() {
  try {
    console.log("📄 Début de la génération PDF...");
    
    const { hasUnivers, hasSituation } = checkRequiredData();
    
    if(!hasUnivers && !hasSituation){
      alert("⚠️ Aucune donnée à télécharger.\n\nVeuillez d'abord :\n• Sélectionner au moins 3 univers\n• Compléter votre bilan personnel");
      return;
    }
    
    if(!hasUnivers){
      alert("⚠️ Univers non sélectionnés.\n\nVeuillez sélectionner au moins 3 univers dans le questionnaire avant de générer le PDF.");
      return;
    }
    
    if(!hasSituation){
      alert("⚠️ Bilan personnel non rempli.\n\nVeuillez compléter votre bilan personnel avant de générer le PDF.");
      return;
    }
    
    const universData = localStorage.getItem('selected_univers_details');
    const situationData = localStorage.getItem('situation_data');
    
    let pdfContent = "";
    
    pdfContent += "═══════════════════════════════════════════════════════\n";
    pdfContent += "        RECONVERSION 360 IA - MES RÉSULTATS\n";
    pdfContent += "═══════════════════════════════════════════════════════\n\n";
    pdfContent += "Date de génération: " + new Date().toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) + "\n\n";
    
    // PROFIL PERSONNEL
    const profileData = localStorage.getItem('profile_percentages');
    if(profileData){
      try {
        const profile = JSON.parse(profileData);
        pdfContent += "───────────────────────────────────────────────────────\n";
        pdfContent += "👤 MON PROFIL PERSONNEL\n";
        pdfContent += "───────────────────────────────────────────────────────\n\n";
        
        const profileArray = Object.entries(profile)
          .map(([code, data]) => ({
            code: code,
            name: data.name,
            pct: data.pct,
            score: data.score
          }))
          .sort((a, b) => b.pct - a.pct);
        
        profileArray.forEach(dim => {
          pdfContent += `${dim.code} - ${dim.name}: ${dim.pct}%\n`;
        });
        
        pdfContent += "\n📊 Mes 3 dimensions dominantes:\n\n";
        profileArray.slice(0, 3).forEach((dim, index) => {
          pdfContent += `${index + 1}. ${dim.code} (${dim.name}): ${dim.pct}%\n`;
        });
        
        pdfContent += "\n";
        console.log("✅ Profil ajouté au PDF");
      } catch(e) {
        console.error("❌ Erreur profil:", e);
      }
    }
    
    if(universData){
      try {
        const univers = JSON.parse(universData);
        const universArray = Object.entries(univers);
        
        if(universArray.length > 0){
          pdfContent += "───────────────────────────────────────────────────────\n";
          pdfContent += "🌍 MES UNIVERS SÉLECTIONNÉS\n";
          pdfContent += "───────────────────────────────────────────────────────\n\n";
          
          universArray
            .sort((a, b) => b[1].score - a[1].score)
            .forEach(([id, data], index) => {
              const percentage = Math.round((data.score / 12) * 100);
              pdfContent += `${index + 1}. ${data.name}\n`;
              pdfContent += `   Compatibilité: ${percentage}% (${data.level})\n\n`;
            });
          
          console.log("✅ Univers ajoutés au PDF");
        }
      } catch(e) {
        console.error("❌ Erreur univers:", e);
      }
    }
    
    if(situationData){
      try {
        const situation = JSON.parse(situationData);
        pdfContent += "───────────────────────────────────────────────────────\n";
        pdfContent += "📋 MON BILAN PERSONNEL\n";
        pdfContent += "───────────────────────────────────────────────────────\n\n";
        
        if(situation.prenom){
          pdfContent += `Prénom: ${situation.prenom}\n`;
        }
        if(situation.age){
          pdfContent += `Âge: ${situation.age} ans\n\n`;
        }
        
        pdfContent += "1. SITUATION & PARCOURS\n";
        pdfContent += "─────────────────────────\n\n";
        if(situation.q1) pdfContent += `Objectif professionnel:\n${situation.q1}\n\n`;
        if(situation.q2) pdfContent += `Statut actuel:\n${situation.q2}\n\n`;
        if(situation.q3) pdfContent += `Niveau de formation:\n${situation.q3}\n\n`;
        if(situation.q4) pdfContent += `Certifications:\n${situation.q4}\n\n`;
        
        pdfContent += "2. RESSOURCES & COMPÉTENCES\n";
        pdfContent += "─────────────────────────────\n\n";
        if(situation.q5) pdfContent += `Compétences techniques:\n${situation.q5}\n\n`;
        if(situation.q6) pdfContent += `Compétences à réutiliser:\n${situation.q6}\n\n`;
        if(situation.q7) pdfContent += `Compétences relationnelles:\n${situation.q7}\n\n`;
        if(situation.q8) pdfContent += `Expériences marquantes:\n${situation.q8}\n\n`;
        
        pdfContent += "3. VALEURS & SENS DU TRAVAIL\n";
        pdfContent += "──────────────────────────────\n\n";
        if(situation.q9) pdfContent += `Valeurs essentielles:\n${situation.q9}\n\n`;
        if(situation.q10) pdfContent += `Secteurs à éviter:\n${situation.q10}\n\n`;
        
        pdfContent += "4. CONTRAINTES & CONDITIONS\n";
        pdfContent += "─────────────────────────────\n\n";
        if(situation.q11) pdfContent += `Géographie/Mobilité:\n${situation.q11}\n\n`;
        if(situation.q12) pdfContent += `Conditions de travail:\n${situation.q12}\n\n`;
        if(situation.q13) pdfContent += `Horaires:\n${situation.q13}\n\n`;
        if(situation.q14) pdfContent += `Limitations:\n${situation.q14}\n\n`;
        if(situation.q15) pdfContent += `Rémunération minimale:\n${situation.q15}\n\n`;
        if(situation.q16) pdfContent += `Situations à éviter:\n${situation.q16}\n\n`;
        if(situation.q17) pdfContent += `Environnement idéal:\n${situation.q17}\n\n`;
        if(situation.q18) pdfContent += `Échéance du projet:\n${situation.q18}\n\n`;
        
        pdfContent += "5. FORMATION\n";
        pdfContent += "─────────────\n\n";
        if(situation.q19) pdfContent += `Formation envisagée:\n${situation.q19}\n\n`;
        
        pdfContent += "6. TESTS PSYCHOTECHNIQUES\n";
        pdfContent += "───────────────────────────\n\n";
        if(situation.q21) pdfContent += `Tests passés:\n${situation.q21}\n\n`;
        
        pdfContent += "7. OUVERTURE\n";
        pdfContent += "─────────────\n\n";
        if(situation.q20) pdfContent += `Informations complémentaires:\n${situation.q20}\n\n`;
        
        console.log("✅ Bilan complet ajouté au PDF (20 questions)");
      } catch(e) {
        console.error("❌ Erreur situation:", e);
      }
    }
    
    pdfContent += "═══════════════════════════════════════════════════════\n";
    pdfContent += "Document généré par Reconversion 360 IA\n";
    pdfContent += "© 2025 Synergie IA\n";
    pdfContent += "═══════════════════════════════════════════════════════";
    
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `Reconversion_360_IA_${dateStr}.txt`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    localStorage.setItem('data_exported', 'true');
    
    console.log("✅ Fichier téléchargé");
    showDownloadSuccess();
    
  } catch(error) {
    console.error("❌ Erreur génération PDF:", error);
    alert("❌ Une erreur s'est produite lors de la génération du PDF.\n\nDétails: " + error.message);
  }
}

/* ===== VÉRIFICATION ACCÈS PROJET (VERSION FINALE AVEC GESTION BLOCAGE) ===== */

function checkProjectAccess() {
  const { hasUnivers, hasSituation } = checkRequiredData();
  
  // ✅ CONTRÔLES OBLIGATOIRES : Test + Univers + Bilan
  if(!hasUnivers || !hasSituation){
    if(!hasUnivers && !hasSituation){
      alert("⚠️ Accès non autorisé\n\nPour construire votre projet, vous devez d'abord :\n\n1. Sélectionner au moins 3 univers\n2. Remplir votre bilan personnel");
      return;
    }
    
    if(!hasUnivers){
      alert("⚠️ Univers non sélectionnés\n\nVeuillez sélectionner au moins 3 univers dans le questionnaire avant d'accéder à la construction de votre projet.");
      return;
    }
    
    if(!hasSituation){
      alert("⚠️ Bilan personnel non rempli\n\nVeuillez compléter votre bilan personnel avant d'accéder à la construction de votre projet.");
      return;
    }
  }
  
  // ✅ MESSAGE AVEC CONFIRMATION AMÉLIORÉ
  const userConfirm = confirm(
    "✅ Données complètes !\n\n" +
    "📋 AVANT DE CONTINUER - IMPORTANT :\n\n" +
    "🌐 Vous utilisez ATLAS (navigateur ChatGPT) ?\n" +
    "   → Cliquez OK (vos données seront lues automatiquement)\n\n" +
    "📋 Vous N'utilisez PAS Atlas ?\n" +
    "   → Cliquez ANNULER\n" +
    "   → Copiez d'abord vos résultats avec le bouton ci-dessous\n" +
    "   → Puis revenez cliquer sur \"Construire mon projet\""
  );
  
  if(userConfirm){
    const chatURL = 'https://chatgpt.com/g/g-6914f232fb048191b5df9a123ac6af82-reconversion-360-ia';
    const newWindow = window.open(chatURL, '_blank');
    
    // ✅ VÉRIFIER SI BLOQUÉ (Windows / ChatGPT non chargé / Bloqueur pop-up)
    setTimeout(() => {
      if(!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined'){
        // Message avec le lien à copier manuellement
        alert(
          "⚠️ OUVERTURE BLOQUÉE PAR VOTRE NAVIGATEUR\n\n" +
          "Pas de problème ! Voici le lien à copier :\n\n" +
          chatURL + "\n\n" +
          "📋 ÉTAPES :\n" +
          "1️⃣ Sélectionnez et copiez le lien ci-dessus\n" +
          "2️⃣ Ouvrez un nouvel onglet dans votre navigateur\n" +
          "3️⃣ Collez le lien (Ctrl+V sur PC ou Cmd+V sur Mac)\n" +
          "4️⃣ Appuyez sur Entrée"
        );
      }
    }, 100);
  }
}

/* ===== MÉTHODE DE COPIE ALTERNATIVE ===== */

function fallbackCopy(text) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if(successful){
      console.log("✅ Copie réussie (méthode alternative)");
      localStorage.setItem('data_exported', 'true');
      showCopySuccess();
    } else {
      throw new Error("execCommand a échoué");
    }
  } catch(err) {
    console.error("❌ Erreur copie alternative:", err);
    alert("❌ Impossible de copier automatiquement.\n\nVeuillez copier manuellement le texte affiché dans la console (F12).");
    console.log("📋 TEXTE À COPIER:");
    console.log(text);
  }
}

/* ===== FEEDBACK VISUEL ===== */

function showCopySuccess() {
  const btn = document.getElementById('btnCopyResults');
  if(!btn) return;
  
  const originalHTML = btn.innerHTML;
  const originalBg = btn.style.background;
  const originalColor = btn.style.color;
  
  btn.innerHTML = `
    <svg class="btn-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>✅ Copié !</span>
  `;
  btn.style.background = '#10b981';
  btn.style.color = '#ffffff';
  btn.style.borderColor = '#10b981';
  
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = originalBg;
    btn.style.color = originalColor;
    btn.style.borderColor = '';
  }, 3000);
  
  alert(
    "✅ DONNÉES COPIÉES !\n\n" +
    "📋 Vos résultats sont dans le presse-papiers.\n\n" +
    "➡️ Cliquez sur \"Construire mon projet\"\n" +
    "➡️ Puis collez dans ChatGPT (Ctrl+V ou Cmd+V)"
  );
}

function showDownloadSuccess() {
  const btn = document.getElementById('btnDownloadPDF');
  if(!btn) return;
  
  const originalHTML = btn.innerHTML;
  const originalBg = btn.style.background;
  const originalColor = btn.style.color;
  
  btn.innerHTML = `
    <svg class="btn-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>✅ Téléchargé !</span>
  `;
  btn.style.background = '#10b981';
  btn.style.color = '#ffffff';
  btn.style.borderColor = '#10b981';
  
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = originalBg;
    btn.style.color = originalColor;
    btn.style.borderColor = '';
  }, 3000);
  
  alert(
    "✅ FICHIER TÉLÉCHARGÉ !\n\n" +
    "📄 Votre fichier a été enregistré.\n\n" +
    "➡️ Cliquez sur \"Construire mon projet\"\n" +
    "➡️ Puis transmettez ce fichier à l'IA"
  );
}
