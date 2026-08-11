/**
 * QG PMMA 2026 - Google Apps Script Database Bridge (Robust Version)
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
  } else if (action === 'deleteHistoryItem') {
    return handleDeleteHistoryItem(data);
  } else if (action === 'editHistoryItem') {
    return handleEditHistoryItem(data);
  } else if (action === 'syncErrors') {
    return handleSyncErrors(data);
  } else if (action === 'syncRespondidas') {
    return handleSyncRespondidas(data);
  }
  
  return createResponse({ status: 'error', message: 'Ação POST desconhecida.' });
}

// Retorna uma planilha robustamente buscando nomes alternativos de abas
function getSheetRobust(ss, targetName) {
  var sheetMappings = {
    'Cronograma': ['Cronograma', 'Cronograma de Estudos', 'Cronograma_de_Estudos'],
    'Controle do Edital': ['Controle do Edital', 'Controle_Edital', 'Edital', 'Controle_do_Edital'],
    'Registro de Estudos': ['Registro de Estudos', 'Registro_de_Estudos', 'Registro Estudos', 'Estudos'],
    'Treino do TAF': ['Treino do TAF', 'Treinos', 'Treino_do_TAF', 'Treino TAF', 'Treino_TAF'],
    'Simulados do TAF': ['Simulados do TAF', 'TAF_Semanal', 'Simulados_do_TAF', 'Simulados TAF', 'Simulados_TAF'],
    'Simulados Cabecalho': ['Simulados Cabecalho', 'Simulado_Semanal', 'Simulados_Cabecalho', 'Simulado Semanal', 'Simulado Cabecalho'],
    'Simulados Detalhes': ['Simulados Detalhes', 'Simulados_Detalhes', 'Simulado Detalhes', 'Simulado_Detalhes'],
    'Caderno de Erros': ['Caderno de Erros', 'Caderno_de_Erros', 'Erros'],
    'Questoes Respondidas': ['Questoes Respondidas', 'Questoes_Respondidas', 'Respondidas', 'Questões Respondidas', 'Questões_Respondidas']
  };
  
  var altNames = sheetMappings[targetName] || [targetName];
  for (var i = 0; i < altNames.length; i++) {
    var sheet = ss.getSheetByName(altNames[i]);
    if (sheet) return sheet;
  }
  return null;
}

function handleGetData() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return createResponse({ status: 'error', message: 'Script não associado à planilha. Abra a planilha e clique em Extensões -> Apps Script.' });
    
    // Auto-cria Caderno de Erros se não existir
    var errSheet = getSheetRobust(ss, 'Caderno de Erros');
    if (!errSheet) {
      errSheet = ss.insertSheet('Caderno de Erros');
      errSheet.appendRow(['ID da Questão', 'Data de Registro']);
    }
    
    // Auto-cria Questoes Respondidas se não existir
    var respSheet = getSheetRobust(ss, 'Questoes Respondidas');
    if (!respSheet) {
      respSheet = ss.insertSheet('Questoes Respondidas');
      respSheet.appendRow(['ID da Questão', 'Data de Resposta']);
    }

    var result = {};
    var listToLoad = ['Cronograma', 'Controle do Edital', 'Registro de Estudos', 'Simulados Cabecalho', 'Simulados Detalhes', 'Treino do TAF', 'Simulados do TAF', 'Caderno de Erros', 'Questoes Respondidas'];
    
    listToLoad.forEach(function(targetName) {
      var sheet = getSheetRobust(ss, targetName);
      if (sheet) {
        result[targetName] = sheet.getDataRange().getValues();
      } else {
        result[targetName] = [];
      }
    });
    
    return createResponse({ status: 'success', data: result });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleSyncErrors(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getSheetRobust(ss, 'Caderno de Erros');
    if (!sheet) {
      sheet = ss.insertSheet('Caderno de Erros');
    }
    
    sheet.clear();
    sheet.appendRow(['ID da Questão', 'Data de Registro']);
    
    if (data.errors && data.errors.length > 0) {
      var dateStr = new Date().toLocaleDateString('pt-BR');
      data.errors.forEach(function(id) {
        sheet.appendRow([id, dateStr]);
      });
    }
    
    return createResponse({ status: 'success', message: 'Caderno de erros sincronizado com sucesso!' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleSyncRespondidas(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getSheetRobust(ss, 'Questoes Respondidas');
    if (!sheet) {
      sheet = ss.insertSheet('Questoes Respondidas');
    }
    
    sheet.clear();
    sheet.appendRow(['ID da Questão', 'Data de Resposta']);
    
    if (data.answered && data.answered.length > 0) {
      var dateStr = new Date().toLocaleDateString('pt-BR');
      data.answered.forEach(function(id) {
        sheet.appendRow([id, dateStr]);
      });
    }
    
    return createResponse({ status: 'success', message: 'Questões respondidas sincronizadas com sucesso!' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleAddStudy(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = getSheetRobust(ss, 'Registro de Estudos');
    if (!sheet) {
      sheet = ss.insertSheet('Registro de Estudos');
      sheet.appendRow(['Data', 'Matéria', 'Assunto', 'Tipo de Estudo', 'Tempo (min)', 'Questões Feitas', 'Acertos', 'Erros', 'Aproveitamento', 'Anotações']);
    }
    
    sheet.appendRow([
      data.date,
      data.subject,
      data.topic,
      data.type,
      data.duration,
      data.questions,
      data.correct,
      data.errors,
      data.correct / (data.questions || 1),
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
    var sheet = getSheetRobust(ss, 'Controle do Edital');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba Controle do Edital não encontrada.' });
    
    var values = sheet.getDataRange().getValues();
    var targetSubject = data.subject.toLowerCase().trim();
    var targetTopic = data.topic.toLowerCase().trim();
    
    for (var i = 1; i < values.length; i++) {
      var rowSubject = String(values[i][0]).toLowerCase().trim();
      var rowTopic = String(values[i][1]).toLowerCase().trim();
      
      if (rowSubject === targetSubject && rowTopic === targetTopic) {
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
    var sheet = getSheetRobust(ss, 'Treino do TAF');
    if (!sheet) {
      sheet = ss.insertSheet('Treino do TAF');
      sheet.appendRow(['Data', 'Exercício', 'Resultado', 'Meta', 'Aproveitamento', 'Status Treino', 'Séries', 'Tempo Descanso (s)', 'Tempo Total (min)']);
    }
    
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
    var sheet = getSheetRobust(ss, 'Simulados do TAF');
    if (!sheet) {
      sheet = ss.insertSheet('Simulados do TAF');
      sheet.appendRow(['Data', 'Barra', 'Meio Sugado', 'Abdominal', 'Corrida', 'Tempo Total', 'Concluído?', 'Observações']);
    }
    
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
    var sheetCab = getSheetRobust(ss, 'Simulados Cabecalho');
    var sheetDet = getSheetRobust(ss, 'Simulados Detalhes');
    
    if (!sheetCab) {
      sheetCab = ss.insertSheet('Simulados Cabecalho');
      sheetCab.appendRow(['ID Simulado', 'Nome Simulado', 'Data', 'Total Questões', 'Total Acertos']);
    }
    if (!sheetDet) {
      sheetDet = ss.insertSheet('Simulados Detalhes');
      sheetDet.appendRow(['ID Simulado', 'Matéria', 'Tópico', 'Questões', 'Acertos', 'Erros', 'Observação Erro', 'Precisa Revisar']);
    }
    
    var simId = 'SIM-' + new Date().getTime();
    
    sheetCab.appendRow([
      simId,
      data.name,
      data.date,
      data.totalQuestions,
      data.totalCorrect
    ]);
    
    data.details.forEach(function(detail) {
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
    var sheet = getSheetRobust(ss, 'Cronograma');
    if (!sheet) return createResponse({ status: 'error', message: 'Aba de Cronograma não encontrada.' });
    
    var values = sheet.getDataRange().getValues();
    var targetDateStr = String(data.date).trim();
    
    for (var i = 1; i < values.length; i++) {
      var cellVal = values[i][0];
      var formattedCellDate = '';
      if (cellVal instanceof Date) {
        formattedCellDate = Utilities.formatDate(cellVal, Session.getScriptTimeZone(), 'dd/MM/yyyy');
      } else {
        formattedCellDate = String(cellVal).trim();
      }
      
      if (formattedCellDate === targetDateStr) {
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
    var sheet = getSheetRobust(ss, 'Simulados Detalhes');
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
        sheet.getRange(i + 1, 8).setValue(data.needsReview ? 'Sim' : 'Não');
        if (data.notes !== undefined) {
          sheet.getRange(i + 1, 7).setValue(data.notes);
        }
        return createResponse({ status: 'success', message: 'Status de revisão de erro atualizado!' });
      }
    }
    
    return createResponse({ status: 'error', message: 'Registro de detalhe de simulado não encontrado.' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleDeleteHistoryItem(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.cat === 'Estudo Diário') {
      var sheet = getSheetRobust(ss, 'Registro de Estudos');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Registro de Estudos não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === data.date && values[i][1] === data.subject && values[i][2] === data.topic && values[i][3] === data.type) {
          sheet.deleteRow(i + 1);
          return createResponse({ status: 'success', message: 'Registro de estudo excluído!' });
        }
      }
    } else if (data.cat === 'Simulado Teórico') {
      var sheetCab = getSheetRobust(ss, 'Simulados Cabecalho');
      var sheetDet = getSheetRobust(ss, 'Simulados Detalhes');
      if (sheetCab) {
        var vals = sheetCab.getDataRange().getValues();
        for (var i = vals.length - 1; i >= 1; i--) {
          if (vals[i][0] === data.id) {
            sheetCab.deleteRow(i + 1);
            break;
          }
        }
      }
      if (sheetDet) {
        var vals = sheetDet.getDataRange().getValues();
        for (var i = vals.length - 1; i >= 1; i--) {
          if (vals[i][0] === data.id) {
            sheetDet.deleteRow(i + 1);
          }
        }
      }
      return createResponse({ status: 'success', message: 'Simulado excluído!' });
    } else if (data.cat === 'Treino TAF') {
      var sheet = getSheetRobust(ss, 'Treino do TAF');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Treino do TAF não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === data.date && values[i][1] === data.exercise) {
          sheet.deleteRow(i + 1);
          return createResponse({ status: 'success', message: 'Registro de treino excluído!' });
        }
      }
    } else if (data.cat === 'Simulado TAF Completo') {
      var sheet = getSheetRobust(ss, 'Simulados do TAF');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Simulados do TAF não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = values.length - 1; i >= 1; i--) {
        if (values[i][0] === data.date) {
          sheet.deleteRow(i + 1);
          return createResponse({ status: 'success', message: 'Registro de simulado TAF excluído!' });
        }
      }
    }
    
    return createResponse({ status: 'error', message: 'Tipo de registro não encontrado ou inválido.' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function handleEditHistoryItem(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (data.cat === 'Estudo Diário') {
      var sheet = getSheetRobust(ss, 'Registro de Estudos');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Registro de Estudos não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === data.oldDate && values[i][1] === data.oldSubject && values[i][2] === data.oldTopic && values[i][3] === data.oldType) {
          sheet.getRange(i + 1, 5).setValue(data.duration);
          sheet.getRange(i + 1, 6).setValue(data.questions);
          sheet.getRange(i + 1, 7).setValue(data.correct);
          sheet.getRange(i + 1, 8).setValue(data.questions - data.correct);
          sheet.getRange(i + 1, 9).setValue(data.correct / (data.questions || 1));
          sheet.getRange(i + 1, 10).setValue(data.notes);
          return createResponse({ status: 'success', message: 'Estudo atualizado!' });
        }
      }
    } else if (data.cat === 'Treino TAF') {
      var sheet = getSheetRobust(ss, 'Treino do TAF');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Treino do TAF não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === data.oldDate && values[i][1] === data.oldExercise) {
          sheet.getRange(i + 1, 3).setValue(data.result);
          sheet.getRange(i + 1, 5).setValue(data.result / (values[i][3] || 1));
          sheet.getRange(i + 1, 6).setValue(data.result >= values[i][3] ? 'META ALCANÇADA' : 'ABAIXO DA META');
          sheet.getRange(i + 1, 7).setValue(data.sets || '');
          sheet.getRange(i + 1, 8).setValue(data.restTime || '');
          sheet.getRange(i + 1, 9).setValue(data.duration || '');
          return createResponse({ status: 'success', message: 'Treino TAF atualizado!' });
        }
      }
    } else if (data.cat === 'Simulado TAF Completo') {
      var sheet = getSheetRobust(ss, 'Simulados do TAF');
      if (!sheet) return createResponse({ status: 'error', message: 'Aba Simulados do TAF não encontrada.' });
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === data.oldDate) {
          sheet.getRange(i + 1, 2).setValue(data.barra);
          sheet.getRange(i + 1, 3).setValue(data.sugado);
          sheet.getRange(i + 1, 4).setValue(data.abdominal);
          sheet.getRange(i + 1, 5).setValue(data.corrida);
          sheet.getRange(i + 1, 6).setValue(data.duration);
          sheet.getRange(i + 1, 7).setValue(data.passed ? 'APROVADO NO TAF' : 'NÃO ALCANÇADO');
          sheet.getRange(i + 1, 8).setValue(data.notes || '');
          return createResponse({ status: 'success', message: 'Simulado TAF atualizado!' });
        }
      }
    }
    
    return createResponse({ status: 'error', message: 'Ação de edição não suportada.' });
  } catch (e) {
    return createResponse({ status: 'error', message: e.toString() });
  }
}

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
