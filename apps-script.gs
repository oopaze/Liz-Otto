// Recebe as confirmações do site e grava uma linha por pessoa.
// Cole este código em: Planilha > Extensões > Apps Script.

const ABA = 'Confirmações';
const CABECALHO = ['Data/hora', 'Nome', 'Vem?', 'Adultos', 'Crianças', 'Palpite', 'Recadinho'];
const MAX_CONVIDADOS = 20;

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
    const nome = nomeLimpo(p.nome);
    if (!nome) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: 'nome vazio' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const agora = new Date();
    const palpite = vem ? limpar(p.palpite) : '';
    const msg = limpar(p.msg);

    // Uma linha por pessoa: quem confirmou + cada companhia.
    // O cabeçalho antigo é mantido; cada pessoa conta como 1 adulto.
    const linhas = [[agora, nome, vem ? 'Sim' : 'Não', vem ? 1 : 0, 0, palpite, msg]];
    if (vem) {
      for (const convidado of convidados(p.convidados, nome)) {
        linhas.push([agora, `${convidado} (Junto a ${nome})`, 'Sim', 1, 0, '', '']);
      }
    }

    aba.getRange(aba.getLastRow() + 1, 1, linhas.length, CABECALHO.length).setValues(linhas);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, linhas: linhas.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function convidados(texto, principal) {
  const vistos = new Set([principal.toLowerCase()]);
  const lista = [];
  for (const bruto of String(texto || '').split(/[\r\n,]+/)) {
    const nome = nomeLimpo(bruto);
    if (!nome) continue;
    const chave = nome.toLowerCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    lista.push(nome);
    if (lista.length >= MAX_CONVIDADOS) break;
  }
  return lista;
}

function nomeLimpo(v) {
  return limpar(v).slice(0, 100);
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
