// Recebe as confirmações do site e grava na planilha.
// Cole este código em: Planilha > Extensões > Apps Script.

const ABA = 'Confirmações';
const CABECALHO = ['Data/hora', 'Nome', 'Vem?', 'Adultos', 'Crianças', 'Palpite', 'Recadinho'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
      aba.setFrozenRows(1);
    }

    const p = e.parameter || {};
    const vem = p.vem === 'sim';
    aba.appendRow([
      new Date(),
      limpar(p.nome),
      vem ? 'Sim' : 'Não',
      vem ? numero(p.adultos) : 0,
      vem ? numero(p.criancas) : 0,
      limpar(p.palpite),
      limpar(p.msg)
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Abre a URL /exec no navegador para testar: deve aparecer "ok".
function doGet() {
  return ContentService.createTextOutput('ok');
}

function limpar(v) {
  const s = String(v || '').trim().slice(0, 400);
  // Evita que um texto começando com = + - @ vire fórmula na planilha.
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function numero(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : Math.max(0, Math.min(n, 20));
}
