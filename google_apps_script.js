/**
 * QG PMMA 2026 - Google Apps Script Database Bridge
 * Cole este código no editor de scripts do seu Google Sheets (Extensões -> Apps Script)
 * e implante como um "App da Web" com acesso para "Qualquer pessoa".
 */

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getData') {
    return handleGetData();
  }
  
  return createResponse({ status: 'error', message: 'Ação GET desconhecida ou ausente.' });
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return createResponse({ status: 'error', message: 'JSON inválido enviado no corpo da requisição.' });
  }
  
  var action = data.action;
  
  if (action === 'addStudy') {
    return handleAddStudy(data);
  } else if (action === 'toggleEdital') {
    return handleToggleEdital(data);
  } else if (action === 'addTAF') {
    return handleAddTAF(data);
  } else if (action === 'addTAFSimulado') {
    return handleAddTAFSimulado(data);
  } else if (action === 'addSimulado') {
    return handleAddSimulado(data);
  } else if (action === 'updateCrono') {
    return handleUpdateCrono(data);
  } else if (action === 'toggleErrorReview') {
    return handleToggleErrorReview(data);
  }
  
  return createResponse({ status: 'error', message: 'Ação POST desconhecida.' });
}

function handleGetData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ['Cronograma', 'Controle do Edital', 'Registro de Estudos', 'Simulados Cabecalho', 'Simulados Detalhes', 'Treino do TAF', 'Simulados do TAF'];
    var result = {};
    
    sheets.forEach(function(sheetName) {
      var sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        var values = sheet.getDataRange().getValues();
        result[sheetName] = values;
      } else {
        result[sheetName] = [];
      }
    });
    
    return createResponse({ status: 'success', data: result });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleAddStudy(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registro de Estudos');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Registro de Estudos não encontrada.' });
    
    // Formato da linha: Data, Matéria, Assunto, Tipo de Estudo, Tempo (min), Questões Feitas, Acertos, Erros, Aproveitamento, Anotações
    sheet.appendRow([
      data.date,
      data.subject,
      data.topic,
      data.type,
      data.duration,
      data.questions,
      data.correct,
      data.errors,
      data.correct / (data.questions || 1), // Aproveitamento (%)
      data.notes
    ]);
    
    return createResponse({ status: 'success', message: 'Estudo registrado com sucesso!' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleToggleEdital(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Controle do Edital');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Controle do Edital não encontrada.' });
    
    var values = sheet.getDataRange().getValues();
    var targetSubject = data.subject.toLowerCase().trim();
    var targetTopic = data.topic.toLowerCase().trim();
    
    for (var i = 1; i < values.length; i++) {
      var rowSubject = String(values[i][0]).toLowerCase().trim();
      var rowTopic = String(values[i][1]).toLowerCase().trim();
      
      if (rowSubject === targetSubject && rowTopic === targetTopic) {
        // Coluna C (Índice 2): Estudado? (Sim/Não)
        // Coluna D (Índice 3): Questões Feitas
        // Coluna E (Índice 4): Acertos
        // Coluna H (Índice 7): Status Revisão (Pendente / Em Revisão / Revisado)
        
        if (data.studied !== undefined) {
          sheet.getRange(i + 1, 3).setValue(data.studied ? 'Sim' : 'Não');
        }
        if (data.revisionStatus !== undefined) {
          sheet.getRange(i + 1, 8).setValue(data.revisionStatus);
        }
        if (data.questions !== undefined) {
          sheet.getRange(i + 1, 4).setValue(data.questions);
        }
        if (data.correct !== undefined) {
          sheet.getRange(i + 1, 5).setValue(data.correct);
        }
        
        return createResponse({ status: 'success', message: 'Edital atualizado com sucesso!' });
      }
    }
    
    return createResponse({ status: 'error', message: 'Tópico do edital não encontrado.' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleAddTAF(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Treino do TAF');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Treino do TAF não encontrada.' });
    
    // Colunas: Data, Exercício, Resultado (Reps/Min/Metros), Meta, Aproveitamento, Status Treino, Séries, Tempo Descanso (s), Tempo Total (min)
    sheet.appendRow([
      data.date,
      data.exercise,
      data.result,
      data.target,
      data.result / (data.target || 1),
      data.result >= data.target ? 'META ALCANÇADA' : 'ABAIXO DA META',
      data.sets || '',
      data.restTime || '',
      data.duration || ''
    ]);
    
    return createResponse({ status: 'success', message: 'Treino TAF registrado!' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleAddTAFSimulado(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Simulados do TAF');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Simulados do TAF não encontrada.' });
    
    // Colunas: Data, Barra, Meio Sugado, Abdominal, Corrida, Tempo Total, Concluído? (Aprovado/Não Alcançado), Observações
    sheet.appendRow([
      data.date,
      data.barra,
      data.sugado,
      data.abdominal,
      data.corrida,
      data.duration,
      data.passed ? 'APROVADO NO TAF' : 'NÃO ALCANÇADO',
      data.notes
    ]);
    
    return createResponse({ status: 'success', message: 'Simulado TAF registrado!' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleAddSimulado(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetCab = ss.getSheetByName('Simulados Cabecalho');
    var sheetDet = ss.getSheetByName('Simulados Detalhes');
    
    if (!sheetCab || !sheetDet) {
      return createResponse({ status: 'error', message: 'Abas de Simulado não encontradas.' });
    }
    
    var simId = 'SIM-' + new Date().getTime();
    
    // Registro do Cabeçalho: ID, Nome, Data, Total Questões, Total Acertos
    sheetCab.appendRow([
      simId,
      data.name,
      data.date,
      data.totalQuestions,
      data.totalCorrect
    ]);
    
    // Registro dos Detalhes de cada matéria
    data.details.forEach(function(detail) {
      // ID Simulado, Matéria, Tópico, Questões, Acertos, Erros, Observação Erro, Precisa Revisar
      sheetDet.appendRow([
        simId,
        detail.subject,
        detail.topic,
        detail.questions,
        detail.correct,
        detail.errors,
        detail.notes,
        detail.needsReview ? 'Sim' : 'Não'
      ]);
    });
    
    return createResponse({ status: 'success', message: 'Simulado registrado com sucesso!', id: simId });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleUpdateCrono(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Cronograma');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Cronograma não encontrada.' });
    
    var values = sheet.getDataRange().getValues();
    var targetDateStr = String(data.date).trim(); // Formato esperado DD/MM/YYYY
    
    for (var i = 1; i < values.length; i++) {
      var cellVal = values[i][0];
      var formattedCellDate = '';
      if (cellVal instanceof Date) {
        formattedCellDate = Utilities.formatDate(cellVal, Session.getScriptTimeZone(), 'dd/MM/yyyy');
      } else {
        formattedCellDate = String(cellVal).trim();
      }
      
      if (formattedCellDate === targetDateStr) {
        // Coluna J (Índice 9): Concluído?
        sheet.getRange(i + 1, 10).setValue(data.completed ? 'Concluído' : 'A Estudar');
        return createResponse({ status: 'success', message: 'Dia do cronograma atualizado!' });
      }
    }
    
    return createResponse({ status: 'error', message: 'Data do cronograma não encontrada: ' + targetDateStr });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleToggleErrorReview(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Simulados Detalhes');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Simulados Detalhes não encontrada.' });
    
    var values = sheet.getDataRange().getValues();
    var simId = String(data.simId).trim();
    var subject = String(data.subject).toLowerCase().trim();
    var topic = String(data.topic).toLowerCase().trim();
    
    for (var i = 1; i < values.length; i++) {
      var rowSimId = String(values[i][0]).trim();
      var rowSubject = String(values[i][1]).toLowerCase().trim();
      var rowTopic = String(values[i][2]).toLowerCase().trim();
      
      if (rowSimId === simId && rowSubject === subject && rowTopic === topic) {
        // Coluna H (Índice 7): Precisa Revisar (Sim/Não)
        sheet.getRange(i + 1, 8).setValue(data.needsReview ? 'Sim' : 'Não');
        return createResponse({ status: 'success', message: 'Status de revisão de erro atualizado!' });
      }
    }
    
    return createResponse({ status: 'error', message: 'Registro de detalhe de simulado não encontrado.' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
