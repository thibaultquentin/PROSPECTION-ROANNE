/**
 * Webhook Apps Script pour le Google Sheets "SUIVI PROSPECTION".
 *
 * Ce fichier n'est PAS déployé automatiquement : aucun outil de cette session
 * ne peut modifier un projet Apps Script existant en place. Il doit être
 * copié-collé manuellement dans l'éditeur du projet lié au webhook déjà en
 * service (depuis le Sheets SUIVI PROSPECTION : Extensions > Apps Script),
 * puis redéployé (Déployer > Gérer les déploiements > modifier la version)
 * en conservant la même URL /exec pour ne pas casser le webhook existant.
 *
 * CORRECTIF (06/08/2026) : le schéma de colonnes a été réaligné sur le
 * tableau réel actuel. "Dossier Drive", "Notes" et "ID Brouillon" ont été
 * retirés (ils n'existent plus dans le Sheets) ; "Secteur" et
 * "Lien mail envoye" ont été ajoutés pour remplacer respectivement "Notes"
 * et l'ancien usage d'"ID Brouillon". Sans ce correctif, ensureColumns_
 * aurait recréé les trois anciennes colonnes en fin de tableau au prochain
 * appel.
 *
 * Deux actions sont supportées dans le corps JSON du POST :
 *  - pas de champ "action" (ou "action": "append") : ajoute une nouvelle
 *    ligne.
 *  - "action": "updateStatus" : met à jour le Statut (et éventuellement
 *    Date Envoi / Lien mail envoye) d'une ligne existante, retrouvée par
 *    email — ne crée jamais de nouvelle ligne. C'est cette action qu'utilise
 *    l'Étape 0 du skill prospection-roanne pour les mises à jour
 *    automatiques (détection Envoyé / Échange / Refusé).
 *
 * Rappel anti-duplication (voir SKILL.md) : ce endpoint répond par une
 * redirection 302 vers script.googleusercontent.com une fois l'action déjà
 * effectuée côté serveur. Les appelants doivent utiliser `curl -X POST` SANS
 * `-L` : suivre la redirection réémettrait la requête et dupliquerait
 * l'action (ligne ajoutée deux fois, ou statut réappliqué).
 */

var SHEET_NAME = 'SUIVI PROSPECTION';

var COLUMNS = [
  'Date',
  'Entreprise',
  'Secteur',
  'Ville',
  'Site',
  'Email',
  'Statut',
  'Lien mail envoye',
  'Lien maquette',
  'Date Envoi'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    ensureColumns_(sheet);

    if (data.action === 'updateStatus') {
      return updateStatus_(sheet, data);
    }
    return appendRow_(sheet, data);
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  return sheet;
}

// Ajoute les colonnes du schéma courant si elles n'existent pas encore,
// pour ne pas exiger de geste manuel préalable sur le Sheets.
function ensureColumns_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  COLUMNS.forEach(function (name) {
    if (headers.indexOf(name) === -1) {
      var nextCol = sheet.getLastColumn() + 1;
      sheet.getRange(1, nextCol).setValue(name);
      headers.push(name);
    }
  });
}

function colIndex_(sheet, name) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var i = headers.indexOf(name);
  if (i === -1) {
    throw new Error('Colonne introuvable : ' + name);
  }
  return i + 1;
}

function appendRow_(sheet, data) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var row = headers.map(function (h) {
    switch (h) {
      case 'Date':
        return data.date || Utilities.formatDate(new Date(), 'Europe/Paris', 'dd/MM/yyyy');
      case 'Entreprise':
        return data.entreprise || '';
      case 'Secteur':
        return data.secteur || '';
      case 'Ville':
        return data.ville || '';
      case 'Site':
        return data.site || '';
      case 'Email':
        return data.email || '';
      // Statut par défaut : "Brouillon", jamais "Envoye" a la creation —
      // le passage a "Envoye" est automatique (Etape 0.1 du skill) une fois
      // le mail reellement parti.
      case 'Statut':
        return data.statut || 'Brouillon';
      case 'Lien mail envoye':
        return data.lienMailEnvoye || '';
      case 'Lien maquette':
        return data.lienMaquette || data.lien || '';
      case 'Date Envoi':
        return data.dateEnvoi || '';
      default:
        return '';
    }
  });
  sheet.appendRow(row);
  return jsonOutput_({ ok: true, row: sheet.getLastRow() });
}

// Retrouve une ligne par email et met a jour Statut / Date Envoi /
// Lien mail envoye sans jamais creer de nouvelle ligne. Ne touche jamais
// une ligne "Facture".
function updateStatus_(sheet, data) {
  var targetEmail = String(data.email || '').trim().toLowerCase();
  if (!targetEmail) {
    return jsonOutput_({ ok: false, error: 'email manquant' });
  }

  var emailCol = colIndex_(sheet, 'Email');
  var statutCol = colIndex_(sheet, 'Statut');
  var lienMailCol = colIndex_(sheet, 'Lien mail envoye');
  var dateEnvoiCol = colIndex_(sheet, 'Date Envoi');

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return jsonOutput_({ ok: false, error: 'aucune ligne dans la feuille' });
  }

  var emails = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
  var rowIndex = -1;
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === targetEmail) {
      rowIndex = i + 2;
      break;
    }
  }

  if (rowIndex === -1) {
    return jsonOutput_({ ok: false, error: 'ligne introuvable pour ' + targetEmail });
  }

  var currentStatut = String(sheet.getRange(rowIndex, statutCol).getValue() || '').trim();
  if (currentStatut === 'Facture') {
    // Garde-fou : "Facture" est exclusivement manuel, la routine ne le touche jamais.
    return jsonOutput_({ ok: false, error: 'ligne deja Facture, non modifiee' });
  }

  if (data.statut) {
    sheet.getRange(rowIndex, statutCol).setValue(data.statut);
  }
  if (data.lienMailEnvoye) {
    sheet.getRange(rowIndex, lienMailCol).setValue(data.lienMailEnvoye);
  }
  if (data.dateEnvoi) {
    sheet.getRange(rowIndex, dateEnvoiCol).setValue(data.dateEnvoi);
  }

  return jsonOutput_({ ok: true, row: rowIndex });
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
