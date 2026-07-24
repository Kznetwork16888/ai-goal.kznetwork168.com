/**
 * Google Apps Script Backend for TPV AI Goal Replica
 * 
 * Instructions:
 * 1. Go to https://script.google.com/ and create a new project.
 * 2. Paste this code into Code.gs.
 * 3. Deploy > New deployment > Select type: Web App.
 * 4. Execute as: Me. Who has access: Anyone.
 * 5. Copy the Web App URL and paste it into the frontend src/services/api.js
 */

const SHEET_NAME = 'Submissions';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Setup headers
    sheet.appendRow([
      'Timestamp', 
      'Email', 
      'Score', 
      'Situation', 
      'Task', 
      'Action', 
      'Result',
      'AI_Categories'
    ]);
    sheet.getRange("A1:H1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      setup();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    
    // Add row to Google Sheet
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.score || 0,
      data.starAnswers?.situation || '',
      data.starAnswers?.task || '',
      data.starAnswers?.action || '',
      data.starAnswers?.result || '',
      JSON.stringify(data.radarData || {})
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS options request
function doOptions(e) {
  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
