/* 
  ============================================
  ORIENTATION JEUNES IA - BILAN DE SITUATION
  ============================================
  Gestion du formulaire de bilan personnel
  VERSION JEUNES - 15 questions (q1 à q15)
  VERSION 3 - Conservation garantie des données
  ============================================
*/

document.addEventListener('DOMContentLoaded', function() {
  
  console.log("📋 PAGE BILAN - Initialisation");
  console.log("================================\n");
  
  // Attendre que le DOM soit vraiment prêt puis charger les données
  setTimeout(() => {
    loadSavedData();
  }, 100);
  
  // Gestion de la soumission du formulaire
  const form = document.getElementById('situationForm');
  if(form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Auto-sauvegarde à chaque modification de champ
  const formInputs = document.querySelectorAll('#situationForm input, #situationForm textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', autoSave); // Change 'change' en 'input' pour sauvegarder en temps réel
    input.addEventListener('blur', autoSave);
  });
  
  // Auto-sauvegarde toutes les 5 secondes
  setInterval(autoSave, 5000);
  
  console.log("✅ Initialisation terminée");
  console.log("✅ Auto-sauvegarde activée");
});

/* ===== CHARGEMENT DES DONNÉES SAUVEGARDÉES ===== */

function loadSavedData() {
  try {
    console.log("📥 Tentative de chargement des données...");
    
    // Essayer d'abord les données validées
    let savedData = localStorage.getItem('situation_data');
    let source = 'validées';
    
    // Si pas de données validées, essayer l'auto-sauvegarde
    if(!savedData) {
      savedData = localStorage.getItem('situation_data_autosave');
      source = 'auto-sauvegarde';
    }
    
    if(savedData) {
      console.log(`📥 Chargement des données ${source}...`);
      
      const data = JSON.parse(savedData);
      console.log("📊 Données trouvées:", data);
      
      // Liste des champs du formulaire
      const formFields = [
        'prenom', 'age',
        'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
        'q11', 'q12', 'q13', 'q14', 'q15'
      ];
      
      // Remplir tous les champs du formulaire
      let fieldsLoaded = 0;
      formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if(field && data[fieldId] !== undefined && data[fieldId] !== null && data[fieldId] !== '') {
          field.value = data[fieldId];
          fieldsLoaded++;
          console.log(`   ✓ ${fieldId}: "${data[fieldId].substring(0, 30)}..."`);
        }
      });
      
      if(fieldsLoaded > 0) {
        console.log(`✅ ${fieldsLoaded} champs chargés avec succès`);
        
        // Message visuel pour l'utilisateur
        showLoadMessage(fieldsLoaded);
      }
    } else {
      console.log("ℹ️ Aucune donnée sauvegardée trouvée");
    }
  } catch(error) {
    console.error("❌ Erreur lors du chargement:", error);
    alert("⚠️ Erreur lors du chargement de vos données.\n\nVérifiez la console (F12) pour plus de détails.");
  }
}

/* ===== MESSAGE DE CHARGEMENT ===== */

function showLoadMessage(count) {
  const pageTitle = document.querySelector('.page-title');
  if(!pageTitle) return;
  
  const loadMsg = document.createElement('div');
  loadMsg.style.cssText = 'background: #10b981; color: white; padding: 10px 20px; border-radius: 8px; margin: 10px 0; text-align: center; font-size: 14px;';
  loadMsg.textContent = `✅ ${count} réponses chargées depuis votre dernière visite`;
  
  pageTitle.insertAdjacentElement('afterend', loadMsg);
  
  setTimeout(() => {
    loadMsg.style.transition = 'opacity 1s';
    loadMsg.style.opacity = '0';
    setTimeout(() => loadMsg.remove(), 1000);
  }, 3000);
}

/* ===== SOUMISSION DU FORMULAIRE ===== */

function handleFormSubmit(event) {
  event.preventDefault();
  
  console.log("💾 Enregistrement du bilan...");
  
  // Validation
  if(!validateForm()) {
    return false;
  }
  
  // Collecte des données
  const formData = collectFormData();
  
  // Sauvegarde dans localStorage
  try {
    localStorage.setItem('situation_data', JSON.stringify(formData));
    
    // Supprimer l'auto-sauvegarde puisqu'on a une version validée
    localStorage.removeItem('situation_data_autosave');
    
    console.log("✅ Bilan enregistré avec succès");
    console.log("📊 Données sauvegardées:", formData);
    
    // Afficher message de succès
    showSuccessMessage();
    
    // Message simple
    alert(
      "✅ BILAN ENREGISTRÉ !\n\n" +
      "Votre bilan personnel a été sauvegardé avec succès.\n\n" +
      "Utilisez le bouton \"Retour à l'accueil\" pour continuer."
    );
    
  } catch(error) {
    console.error("❌ Erreur lors de la sauvegarde:", error);
    alert("❌ Une erreur s'est produite lors de l'enregistrement.\n\nDétails: " + error.message);
  }
  
  return false;
}

/* ===== VALIDATION DU FORMULAIRE ===== */

function validateForm() {
  const form = document.getElementById('situationForm');
  let isValid = true;
  let firstError = null;
  
  // Récupérer tous les champs requis
  const requiredFields = form.querySelectorAll('[required]');
  
  // Supprimer les anciennes erreurs
  document.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
  });
  document.querySelectorAll('.error-message').forEach(el => {
    el.remove();
  });
  
  // Valider chaque champ
  requiredFields.forEach(field => {
    if(!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
      
      const errorMsg = document.createElement('span');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'Ce champ est obligatoire';
      field.parentNode.appendChild(errorMsg);
      
      if(!firstError) {
        firstError = field;
      }
    }
  });
  
  // Validation spécifique pour l'âge
  const ageField = document.getElementById('age');
  if(ageField && ageField.value) {
    const age = parseInt(ageField.value);
    if(age < 14 || age > 30) {
      isValid = false;
      ageField.classList.add('error');
      
      const errorMsg = document.createElement('span');
      errorMsg.className = 'error-message';
      errorMsg.textContent = 'L\'âge doit être entre 14 et 30 ans';
      ageField.parentNode.appendChild(errorMsg);
      
      if(!firstError) {
        firstError = ageField;
      }
    }
  }
  
  // Si erreur, scroller vers le premier champ en erreur
  if(!isValid && firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    firstError.focus();
    
    alert(
      "⚠️ Formulaire incomplet\n\n" +
      "Veuillez remplir tous les champs obligatoires (marqués d'un astérisque *)."
    );
  }
  
  return isValid;
}

/* ===== COLLECTE DES DONNÉES ===== */

function collectFormData() {
  const formData = {};
  
  const fields = [
    'prenom', 'age',
    'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
    'q11', 'q12', 'q13', 'q14', 'q15'
  ];
  
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if(field) {
      formData[fieldId] = field.value.trim();
    }
  });
  
  formData.timestamp = new Date().toISOString();
  
  return formData;
}

/* ===== AUTO-SAUVEGARDE ===== */

function autoSave() {
  try {
    const formData = collectFormData();
    
    // Vérifier si au moins un champ est rempli
    const hasData = Object.keys(formData).some(key => {
      return key !== 'timestamp' && formData[key] && formData[key].length > 0;
    });
    
    if(hasData) {
      // Ne sauvegarder l'auto-save QUE si pas de données validées
      const validatedData = localStorage.getItem('situation_data');
      
      if(!validatedData) {
        localStorage.setItem('situation_data_autosave', JSON.stringify(formData));
        console.log("💾 Auto-sauvegarde effectuée");
      } else {
        console.log("ℹ️ Auto-sauvegarde ignorée (données validées présentes)");
      }
    }
  } catch(error) {
    console.error("❌ Erreur auto-sauvegarde:", error);
  }
}

/* ===== MESSAGES & NOTIFICATIONS ===== */

function showSuccessMessage() {
  const btn = document.querySelector('.main-btn');
  if(!btn) return;
  
  const originalHTML = btn.innerHTML;
  const originalBg = btn.style.background;
  
  btn.innerHTML = `
    <svg style="width: 20px; height: 20px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>✅ Bilan enregistré !</span>
  `;
  btn.style.background = '#10b981';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = originalBg;
    btn.disabled = false;
  }, 3000);
}

/* ===== GESTION DES ERREURS DE SAISIE ===== */

document.addEventListener('input', function(event) {
  if(event.target.matches('input[required], textarea[required]')) {
    if(event.target.value.trim()) {
      event.target.classList.remove('error');
      const errorMsg = event.target.parentNode.querySelector('.error-message');
      if(errorMsg) {
        errorMsg.remove();
      }
    }
  }
});

console.log("✅ Script situation chargé et prêt");
