import openpyxl
import json
import os
from datetime import datetime

file_path = r"C:\Users\and_g\Desktop\PMMA 26\Plano_de_Estudos_PMMA_2026.xlsm"
output_path = r"C:\Users\and_g\Desktop\PMMA 26\pmma_data_export.json"

if not os.path.exists(file_path):
    print(f"Erro: Planilha não encontrada em {file_path}")
    exit(1)

print("Carregando planilha...")
wb = openpyxl.load_workbook(file_path, data_only=True)

export_data = {
    "crono": [],
    "edital": [],
    "estudos": [],
    "taf": [],
    "taf_sim": []
}

# 1. Cronograma
print("Exportando aba Cronograma...")
if "Cronograma de Estudos" in wb.sheetnames:
    sheet = wb["Cronograma de Estudos"]
    rows = list(sheet.iter_rows(values_only=True))
    for r in rows[1:]:
        if r[0] is not None:
            # Data format
            d_val = r[0]
            if isinstance(d_val, datetime):
                d_str = d_val.strftime("%d/%m/%Y")
            else:
                d_str = str(d_val).split(" ")[0]
                
            export_data["crono"].append({
                "date": d_str,
                "dia": r[1] or "",
                "semana": r[2] or "",
                "m1": r[3] or "",
                "a1": r[4] or "",
                "m2": r[5] or "",
                "a2": r[6] or "",
                "ciclo": r[7] or "",
                "foco": r[8] or "",
                "completed": str(r[9]).strip().lower() in ["concluído", "sim", "concluido"]
            })

# 2. Controle do Edital
print("Exportando aba Controle do Edital...")
if "Controle do Edital" in wb.sheetnames:
    sheet = wb["Controle do Edital"]
    rows = list(sheet.iter_rows(values_only=True))
    for r in rows[1:]:
        # Matéria, Tópico, Estudado, Questões, Acertos, % Acertos, Aproveitamento, Status Revisão
        if r[0] is not None and r[1] is not None and str(r[1]).strip() != "":
            export_data["edital"].append({
                "subject": r[0],
                "topic": r[1],
                "studied": str(r[2]).strip().lower() in ["sim", "estudado", "s"],
                "questions": int(r[3]) if r[3] is not None else 0,
                "correct": int(r[4]) if r[4] is not None else 0,
                "revisionStatus": r[7] if len(r) > 7 and r[7] is not None else "Pendente"
            })

# 3. Registro de Estudos
print("Exportando aba Registro de Estudos...")
if "Registro de Estudos" in wb.sheetnames:
    sheet = wb["Registro de Estudos"]
    rows = list(sheet.iter_rows(values_only=True))
    for r in rows[1:]:
        # Data, Matéria, Assunto, Tipo, Tempo, Questões, Acertos, Erros, Aproveitamento, Anotações
        if r[1] is not None and str(r[1]).strip() != "":
            d_val = r[0]
            if isinstance(d_val, datetime):
                d_str = d_val.strftime("%d/%m/%Y")
            else:
                d_str = str(d_val).split(" ")[0]
                
            q = int(r[5]) if r[5] is not None else 0
            c = int(r[6]) if r[6] is not None else 0
            
            export_data["estudos"].append({
                "date": d_str,
                "subject": r[1],
                "topic": r[2] or "",
                "type": r[3] or "Questões",
                "duration": int(r[4]) if r[4] is not None else 0,
                "questions": q,
                "correct": c,
                "errors": int(r[7]) if r[7] is not None else max(0, q - c),
                "accuracy": float(r[8]) if r[8] is not None else (c / q if q > 0 else 0.0),
                "notes": r[9] or ""
            })

# 4. Treino do TAF
print("Exportando aba Treino do TAF...")
if "Treino do TAF" in wb.sheetnames:
    sheet = wb["Treino do TAF"]
    rows = list(sheet.iter_rows(values_only=True))
    for r in rows[1:]:
        # Data, Exercício, Resultado, Meta, Aproveitamento, Status
        if r[1] is not None and str(r[1]).strip() != "":
            d_val = r[0]
            if isinstance(d_val, datetime):
                d_str = d_val.strftime("%d/%m/%Y")
            else:
                d_str = str(d_val).split(" ")[0]
                
            res = float(r[2]) if r[2] is not None else 0.0
            tgt = float(r[3]) if r[3] is not None else 1.0
            
            export_data["taf"].append({
                "date": d_str,
                "exercise": r[1],
                "result": res,
                "target": tgt,
                "accuracy": float(r[4]) if r[4] is not None else (res / tgt),
                "status": r[5] or "",
                "sets": 1,
                "restTime": 0,
                "duration": 0
            })

# Salvando
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(export_data, f, ensure_ascii=False, indent=2)

print("\n" + "="*50)
print(f"Sucesso! Dados exportados para: {output_path}")
print("Para importar na plataforma web:")
print("1. Abra o arquivo 'pmma_data_export.json' e copie todo o seu conteúdo.")
print("2. Abra a plataforma web, vá na aba 'Configurações'.")
print("3. Cole o conteúdo no campo de importação JSON e clique em 'Importar'.")
print("="*50)
