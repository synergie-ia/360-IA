/* 
  ============================================
  Pass-Orientation - PAGE D'ACCUEIL
  ============================================
  Gestion des actions
  VERSION COMPLÈTE - Copie profil + univers + bilan
  VERSION JEUNES - Adapté pour 15 questions
  VERSION 39 - Atlas désactivé + Copie obligatoire
  VERSION 40 - Confirmation connexion ChatGPT
  ============================================
*/

document.addEventListener('DOMContentLoaded', function() {
  
  console.log("🏠 PAGE D'ACCUEIL - Initialisation");
  console.log("====================================\n");
  
  // updateCompletionBadges(); // DÉSACTIVÉ
  // updateAtlasData(); // DÉSACTIVÉ - Atlas en commentaire
  
  const btnReset = document.getElementById('btnResetData');
  if(btnReset){
    btnReset.addEventListener('click', confirmReset);
  }
  
  const btnCopy = document.getElementById('btnCopyResults');
  if(btnCopy){
    btnCopy.addEventListener('click', copyResultsToClipboard);
  }
  
  const btnDownload = document.getElementById('btnDownloadPDF');
  if(btnDownload){
    btnDownload.addEventListener('click', downloadPDF);
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
});

/* ===== ATLAS DATA - DÉSACTIVÉ =====

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
  
  // 3. BILAN PERSONNEL - ADAPTÉ POUR 15 QUESTIONS ORIENTATION JEUNES
  const situationData = localStorage.getItem('situation_data');
  
  if(situationData){
    try {
      const situation = JSON.parse(situationData);
      
      // Identité & Objectif
      const atlasIdentite = document.getElementById('atlasIdentite');
      if(atlasIdentite){
        let html = '<h3>Identité & Objectif</h3><dl>';
        if(situation.prenom) html += `<div><dt>Prénom</dt><dd data-field="prenom">${situation.prenom}</dd></div>`;
        if(situation.age) html += `<div><dt>Âge</dt><dd data-field="age">${situation.age}</dd></div>`;
        if(situation.q1) html += `<div><dt>Situation actuelle</dt><dd data-field="q1">${situation.q1}</dd></div>`;
        if(situation.q2) html += `<div><dt>Besoin d'orientation</dt><dd data-field="q2">${situation.q2}</dd></div>`;
        html += '</dl>';
        atlasIdentite.innerHTML = html;
      }
      
      // Parcours et apprentissage
      const atlasSituation = document.getElementById('atlasSituation');
      if(atlasSituation){
        let html = '<h3>Parcours et apprentissage</h3><dl>';
        if(situation.q3) html += `<div><dt>Parcours</dt><dd data-field="q3">${situation.q3}</dd></div>`;
        if(situation.q4) html += `<div><dt>Scolarité</dt><dd data-field="q4">${situation.q4}</dd></div>`;
        if(situation.q5) html += `<div><dt>Apprentissage</dt><dd data-field="q5">${situation.q5}</dd></div>`;
        if(situation.q6) html += `<div><dt>Expériences hors cadre scolaire</dt><dd data-field="q6">${situation.q6}</dd></div>`;
        html += '</dl>';
        atlasSituation.innerHTML = html;
      }
      
      // Compétences, motivations et réussites
      const atlasRessources = document.getElementById('atlasRessources');
      if(atlasRessources){
        let html = '<h3>Compétences, motivations et réussites</h3><dl>';
        if(situation.q7) html += `<div><dt>Compétences et qualités</dt><dd data-field="q7">${situation.q7}</dd></div>`;
        if(situation.q8) html += `<div><dt>Motivations et sens</dt><dd data-field="q8">${situation.q8}</dd></div>`;
        if(situation.q9) html += `<div><dt>Réalisation dont je suis fier·e</dt><dd data-field="q9">${situation.q9}</dd></div>`;
        html += '</dl>';
        atlasRessources.innerHTML = html;
      }
      
      // Critères et contraintes
      const atlasValeurs = document.getElementById('atlasValeurs');
      if(atlasValeurs){
        let html = '<h3>Critères et contraintes</h3><dl>';
        if(situation.q10) html += `<div><dt>Critères non-négociables</dt><dd data-field="q10">${situation.q10}</dd></div>`;
        if(situation.q11) html += `<div><dt>Situations à éviter</dt><dd data-field="q11">${situation.q11}</dd></div>`;
        if(situation.q12) html += `<div><dt>Contraintes</dt><dd data-field="q12">${situation.q12}</dd></div>`;
        html += '</dl>';
        atlasValeurs.innerHTML = html;
      }
      
      // Projet
      const atlasContraintes = document.getElementById('atlasContraintes');
      if(atlasContraintes){
        let html = '<h3>Projet</h3><dl>';
        if(situation.q13) html += `<div><dt>Échéance</dt><dd data-field="q13">${situation.q13}</dd></div>`;
        if(situation.q14) html += `<div><dt>Formation envisagée</dt><dd data-field="q14">${situation.q14}</dd></div>`;
        html += '</dl>';
        atlasContraintes.innerHTML = html;
      }
      
      // Informations complémentaires
      const atlasFormation = document.getElementById('atlasFormation');
      if(atlasFormation){
        let html = '<h3>Informations complémentaires</h3><dl>';
        if(situation.q15) html += `<div><dt>Complément</dt><dd data-field="q15">${situation.q15}</dd></div>`;
        html += '</dl>';
        atlasFormation.innerHTML = html;
      }
      
      console.log("✅ Atlas - Bilan complet ajouté (15 questions)");
    } catch(e) {
      console.error("❌ Atlas - Erreur bilan:", e);
    }
  }
  
  console.log("✅ Atlas - Mise à jour terminée");
}

===== FIN ATLAS DÉSACTIVÉ ===== */

/* ===== BADGES DE COMPLÉTION - DÉSACTIVÉ =====

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

===== FIN BADGES DÉSACTIVÉ ===== */

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
      'situation_data_autosave', // AJOUTÉ : Auto-sauvegarde
      'data_exported'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Supprimé: ${key}`);
    });
    
    console.log('✅ Toutes les données ont été supprimées');
    
    alert("✅ Toutes vos données ont été supprimées avec succès.\n\nLa page va se recharger.");
    
    location.reload();
    
  } catch(error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    alert("❌ Une erreur s'est produite lors de la suppression des données.");
  }
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

/* ===== COPIE DES RÉSULTATS - ADAPTÉ POUR 15 QUESTIONS ===== */

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
    textToCopy += "   Pass-Orientation - MES RÉSULTATS\n";
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
    
    // BILAN PERSONNEL - 15 QUESTIONS ORIENTATION JEUNES
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
        
        textToCopy += "1. IDENTITÉ & OBJECTIF\n";
        textToCopy += "─────────────────────────\n";
        if(situation.q1) textToCopy += `Situation actuelle: ${situation.q1}\n\n`;
        if(situation.q2) textToCopy += `Besoin d'orientation: ${situation.q2}\n\n`;
        
        textToCopy += "2. PARCOURS ET APPRENTISSAGE\n";
        textToCopy += "─────────────────────────────\n";
        if(situation.q3) textToCopy += `Parcours: ${situation.q3}\n\n`;
        if(situation.q4) textToCopy += `Scolarité: ${situation.q4}\n\n`;
        if(situation.q5) textToCopy += `Apprentissage: ${situation.q5}\n\n`;
        if(situation.q6) textToCopy += `Expériences hors cadre scolaire: ${situation.q6}\n\n`;
        
        textToCopy += "3. COMPÉTENCES, MOTIVATIONS ET RÉUSSITES\n";
        textToCopy += "──────────────────────────────────────────\n";
        if(situation.q7) textToCopy += `Compétences et qualités: ${situation.q7}\n\n`;
        if(situation.q8) textToCopy += `Motivations et sens: ${situation.q8}\n\n`;
        if(situation.q9) textToCopy += `Réalisation dont je suis fier·e: ${situation.q9}\n\n`;
        
        textToCopy += "4. CRITÈRES ET CONTRAINTES\n";
        textToCopy += "────────────────────────────\n";
        if(situation.q10) textToCopy += `Critères non-négociables: ${situation.q10}\n\n`;
        if(situation.q11) textToCopy += `Situations à éviter: ${situation.q11}\n\n`;
        if(situation.q12) textToCopy += `Contraintes: ${situation.q12}\n\n`;
        
        textToCopy += "5. PROJET\n";
        textToCopy += "───────────\n";
        if(situation.q13) textToCopy += `Échéance: ${situation.q13}\n\n`;
        if(situation.q14) textToCopy += `Formation envisagée: ${situation.q14}\n\n`;
        
        textToCopy += "6. INFORMATIONS COMPLÉMENTAIRES\n";
        textToCopy += "──────────────────────────────────\n";
        if(situation.q15) textToCopy += `Complément: ${situation.q15}\n\n`;
        
        console.log("✅ Bilan complet ajouté (15 questions)");
      } catch(e) {
        console.error("❌ Erreur situation:", e);
      }
    }
    
    textToCopy += "═══════════════════════════════════════\n";
    textToCopy += "Généré par Pass-Orientation\n";
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

/* ===== TÉLÉCHARGEMENT PDF - ADAPTÉ POUR 15 QUESTIONS ===== */

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
    pdfContent += "        Pass-Orientation - MES RÉSULTATS\n";
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
        
        pdfContent += "1. IDENTITÉ & OBJECTIF\n";
        pdfContent += "─────────────────────────\n\n";
        if(situation.q1) pdfContent += `Situation actuelle:\n${situation.q1}\n\n`;
        if(situation.q2) pdfContent += `Besoin d'orientation:\n${situation.q2}\n\n`;
        
        pdfContent += "2. PARCOURS ET APPRENTISSAGE\n";
        pdfContent += "─────────────────────────────\n\n";
        if(situation.q3) pdfContent += `Parcours:\n${situation.q3}\n\n`;
        if(situation.q4) pdfContent += `Scolarité:\n${situation.q4}\n\n`;
        if(situation.q5) pdfContent += `Apprentissage:\n${situation.q5}\n\n`;
        if(situation.q6) pdfContent += `Expériences hors cadre scolaire:\n${situation.q6}\n\n`;
        
        pdfContent += "3. COMPÉTENCES, MOTIVATIONS ET RÉUSSITES\n";
        pdfContent += "──────────────────────────────────────────\n\n";
        if(situation.q7) pdfContent += `Compétences et qualités:\n${situation.q7}\n\n`;
        if(situation.q8) pdfContent += `Motivations et sens:\n${situation.q8}\n\n`;
        if(situation.q9) pdfContent += `Réalisation dont je suis fier·e:\n${situation.q9}\n\n`;
        
        pdfContent += "4. CRITÈRES ET CONTRAINTES\n";
        pdfContent += "────────────────────────────\n\n";
        if(situation.q10) pdfContent += `Critères non-négociables:\n${situation.q10}\n\n`;
        if(situation.q11) pdfContent += `Situations à éviter:\n${situation.q11}\n\n`;
        if(situation.q12) pdfContent += `Contraintes:\n${situation.q12}\n\n`;
        
        pdfContent += "5. PROJET\n";
        pdfContent += "───────────\n\n";
        if(situation.q13) pdfContent += `Échéance:\n${situation.q13}\n\n`;
        if(situation.q14) pdfContent += `Formation envisagée:\n${situation.q14}\n\n`;
        
        pdfContent += "6. INFORMATIONS COMPLÉMENTAIRES\n";
        pdfContent += "──────────────────────────────────\n\n";
        if(situation.q15) pdfContent += `Complément:\n${situation.q15}\n\n`;
        
        console.log("✅ Bilan complet ajouté au PDF (15 questions)");
      } catch(e) {
        console.error("❌ Erreur situation:", e);
      }
    }
    
    pdfContent += "═══════════════════════════════════════════════════════\n";
    pdfContent += "Document généré par Pass-Orientation\n";
    pdfContent += "© 2025 Synergie IA\n";
    pdfContent += "═══════════════════════════════════════════════════════";
    
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `Pass-Orientation_${dateStr}.txt`;
    
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

/* ===== VÉRIFICATION ACCÈS PROJET - COPIE OBLIGATOIRE ===== */

function checkProjectAccess() {
  const { hasUnivers, hasSituation } = checkRequiredData();
  
  // ✅ CONTRÔLE 1 : Test + Univers + Bilan
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
  
  // ✅ CONTRÔLE 2 : COPIE OBLIGATOIRE
  const dataExported = localStorage.getItem('data_exported');
  if(!dataExported || dataExported !== 'true'){
    alert(
      "⚠️ COPIE OBLIGATOIRE\n\n" +
      "Avant d'accéder à ChatGPT, vous devez d'abord :\n\n" +
      "1. Cliquer sur \"Copier mes résultats\"\n" +
      "2. Attendre la confirmation de copie\n" +
      "3. Puis revenir cliquer sur \"Construire mon projet\"\n\n" +
      "Vous pourrez alors coller vos données dans ChatGPT."
    );
    return;
  }
  
  // ✅ CONFIRMATION CONNEXION CHATGPT
  const isConnected = confirm(
    "⚠️ CONNEXION CHATGPT REQUISE\n\n" +
    "Vous devez être connecté à ChatGPT pour accéder à l'accompagnement personnalisé.\n\n" +
    "Êtes-vous actuellement connecté à votre compte ChatGPT ?\n\n" +
    "➡️ Cliquez sur OK si vous êtes connecté\n" +
    "➡️ Cliquez sur Annuler si vous devez d'abord vous connecter"
  );
  
  if(isConnected){
    // ✅ OUVERTURE CHATGPT
    const chatURL = 'https://chatgpt.com/g/g-69286ee4397881919a0f0d8517d86c4a-pass-orientation';
    window.open(chatURL, '_blank');
    console.log("✅ Ouverture ChatGPT");
  } else {
    alert(
      "ℹ️ COMMENT SE CONNECTER\n\n" +
      "1. Ouvrez ChatGPT dans un nouvel onglet\n" +
      "2. Connectez-vous à votre compte\n" +
      "3. Revenez sur cette page\n" +
      "4. Cliquez à nouveau sur \"Construire mon projet\""
    );
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
