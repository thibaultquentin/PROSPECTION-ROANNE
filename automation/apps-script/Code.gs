/**
 * Webhook Apps Script pour le Google Sheets "SUIVI PROSPECTION".
 *
 * Ce fichier n'est PAS déployé automatiquement : aucun outil de cette session
 * ne peut modifier un projet Apps Script existant en place. Il doit être
 * copié-collé manuellement dans l'éditeur du projet lié au webhook déjà en
 * service (Extensions > Apps Script depuis le Sheets SUIVI PROSPECTION),
 * puis redéployé (Déployer > Gérer les déploiements > modifier la version)
 * en conservant la même URL /exec pour ne pas casser le webhook existant.
 *
 * Deux actions sont supportées dans le corps JSON du POST :
 *  - pas de champ "action" (ou "action": "append") : ajoute une nouvelle
 *    ligne — comportement historique, conservé à l'identique.
 *  - "action": "updateStatus" : met à jour le Statut (et éventuellement
 *    Date Envoi / Notes) d'une ligne existante, retrouvée par email — ne
 *    crée jamais de nouvelle ligne. C'est cette action qu'utilise l'Étape 0
 *    du skill prospection-roanne pour les mises à jour automatiques.
 *
 * Rappel anti-duplication (voir SKILL.md) : ce endpoint répond par une
 * redirection 302 vers script.googleusercontent.com une fois l'action déjà
 * effectuée côté serveur. Les appelants doivent utiliser `curl -X POST` SANS
 * `-L` : suivre la redirection réémettrait la requête et dupliquerait
 * l'action (ligne ajoutée deux fois, ou note dupliquée).
 */

var SHEET_NAME = 'SUIVI PROSPECTION';

var COLUMNS = [
  'Date',
  'Entreprise',
  'Ville',
  'Site',
  'Email',
  'Statut',
  'Dossier Drive',
  'Notes',
  'Lien maquette',
  'ID Brouillon',
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

// Ajoute les colonnes "ID Brouillon" / "Date Envoi" si elles n'existent pas
// encore, pour ne pas exiger de geste manuel préalable sur le Sheets.
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
      case 'Ville':
        return data.ville || '';
      case 'Site':
        return data.site || '';
      case 'Email':
        return data.email || '';
      // Statut par défaut : "Brouillon", jamais "Envoyé" à la création —
      // le passage à "Envoyé" est désormais automatique (Étape 0.1 du skill).
      case 'Statut':
        return data.statut || 'Brouillon';
      case 'Dossier Drive':
        return data.dossierDrive || '';
      case 'Notes':
        return data.notes || '';
      case 'Lien maquette':
        return data.lien || '';
      case 'ID Brouillon':
        return data.idBrouillon || '';
      case 'Date Envoi':
        return '';
      default:
        return '';
    }
  });
  sheet.appendRow(row);
  return jsonOutput_({ ok: true, row: sheet.getLastRow() });
}

// Retrouve une ligne par email et met à jour Statut / Date Envoi / Notes
// sans jamais créer de nouvelle ligne. Ne touche jamais une ligne "Facturé".
function updateStatus_(sheet, data) {
  var targetEmail = String(data.email || '').trim().toLowerCase();
  if (!targetEmail) {
    return jsonOutput_({ ok: false, error: 'email manquant' });
  }

  var emailCol = colIndex_(sheet, 'Email');
  var statutCol = colIndex_(sheet, 'Statut');
  var notesCol = colIndex_(sheet, 'Notes');
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
  if (currentStatut === 'Facturé') {
    // Garde-fou : "Facturé" est exclusivement manuel, la routine ne le touche jamais.
    return jsonOutput_({ ok: false, error: 'ligne déjà Facturé, non modifiée' });
  }

  if (data.statut) {
    sheet.getRange(rowIndex, statutCol).setValue(data.statut);
  }
  if (data.dateEnvoi) {
    sheet.getRange(rowIndex, dateEnvoiCol).setValue(data.dateEnvoi);
  }
  if (data.noteAppend) {
    var current = String(sheet.getRange(rowIndex, notesCol).getValue() || '');
    var updated = current ? current + ' | ' + data.noteAppend : data.noteAppend;
    sheet.getRange(rowIndex, notesCol).setValue(updated);
  }

  return jsonOutput_({ ok: true, row: rowIndex });
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
