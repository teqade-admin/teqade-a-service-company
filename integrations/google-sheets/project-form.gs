/**
 * @OnlyCurrentDoc
 *
 * Teqade "Start a project" form -> Google Sheet.
 *
 * Setup (about 2 minutes):
 *  1. Open the Google Sheet that should collect project requests (or create a new one).
 *  2. Extensions -> Apps Script. Replace the editor contents with this file and click Save.
 *  3. Deploy -> New deployment -> Select type: Web app.
 *       Execute as: Me        Who has access: Anyone
 *     Click Deploy and approve the access prompt (the script can only touch this spreadsheet).
 *  4. Copy the Web app URL (it ends in /exec) into lib/project-form-config.ts on the website.
 *
 * Each submission becomes a row in the "Project requests" tab, created on first use.
 * After editing this script, publish the change with Deploy -> Manage deployments -> Edit ->
 * Version: New version. The /exec URL stays the same.
 */

const SHEET_NAME = "Project requests"

// Optional: an address to email on every new request, e.g. "info@teqade.com". Leave empty to skip.
const NOTIFY_EMAIL = ""

// [form field, column header]
const COLUMNS = [
  ["name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["company", "Company"],
  ["need", "Need"],
  ["timeline", "Timeline"],
  ["brief", "Project brief"],
]

function doPost(e) {
  const params = (e && e.parameter) || {}
  if (!params.name || !params.email) return reply("error")

  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME)
    // Written on every submission so the header stays in step with COLUMNS when a field is added.
    const headers = ["Submitted at"].concat(COLUMNS.map((column) => column[1]))
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    if (sheet.getFrozenRows() === 0) sheet.setFrozenRows(1)
    sheet.appendRow([new Date()].concat(COLUMNS.map((column) => clean(params[column[0]]))))
  } finally {
    lock.releaseLock()
  }

  if (NOTIFY_EMAIL) {
    try {
      notify(params)
    } catch (error) {
      console.error(error) // the row is saved; a failed email shouldn't fail the submission
    }
  }
  return reply("success")
}

// Keep cells as plain text: cap the length, and stop values starting with = + - @ from running as formulas.
function clean(value) {
  const text = String(value == null ? "" : value).trim().slice(0, 5000)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function notify(params) {
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: params.email,
    subject: "New project request: " + (params.company || params.name),
    body: COLUMNS.map((column) => column[1] + ": " + (params[column[0]] || "-")).join("\n"),
  })
}

function reply(result) {
  return ContentService.createTextOutput(JSON.stringify({ result: result })).setMimeType(ContentService.MimeType.JSON)
}
