/**
 * Soccer Club Registration — backend
 * -----------------------------------
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Rename it something like "Club Registrations".
 * 2. In that sheet, go to Extensions > Apps Script.
 * 3. Delete anything in the editor and paste this whole file in.
 * 4. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize it (it's your own script, this is safe),
 *    and copy the "Web app URL" it gives you.
 * 6. Paste that URL into CONFIG.SCRIPT_URL in index.html.
 */

const SHEET_NAME = "Registrations";
const HEADERS = [
  "Submitted At",
  "Player First Name",
  "Player Last Name",
  "Date of Birth",
  "Age Group",
  "Parent/Guardian Name",
  "Email",
  "Phone",
  "Emergency Contact",
  "Emergency Phone",
  "Medical Notes",
  "Registration Fee",
  "Payment Method",
  "Zelle Confirmation #",
  "Payment Status",
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.playerFirstName || "",
      data.playerLastName || "",
      data.dob || "",
      data.ageGroup || "",
      data.parentName || "",
      data.email || "",
      data.phone || "",
      data.emergencyContact || "",
      data.emergencyPhone || "",
      data.medicalNotes || "",
      data.fee || "",
      data.paymentMethod || "",
      data.zelleRef || "",
      data.zelleRef ? "Reported — needs verification" : "Not yet paid",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you sanity-check the deployment by opening the Web app URL in a browser.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "Registration endpoint is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}
