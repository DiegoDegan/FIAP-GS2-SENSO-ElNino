import pandas as pd
import requests

# 1. URL oficial do índice AMM (SST) da NOAA
URL_AMM = "https://psl.noaa.gov/data/timeseries/monthly/AMM/ammsst.data"
caminho_destino = "data/raw/amm_mensal.csv"

print(f"Baixando dados do AMM de: {URL_AMM}")

# 2. Fazer o download do arquivo de texto bruto
resposta = requests.get(URL_AMM)
if resposta.status_code != 200:
    raise Exception(f"Falha ao baixar os dados. Código HTTP: {resposta.status_code}")

linhas = resposta.text.splitlines()

# 3. Processar o formato padrão da NOAA (PSL format)
# A primeira linha contém os anos limite (ex: 1948 2026)
anos_limite = linhas[0].split()
ano_inicio = int(anos_limite[0])
ano_fim = int(anos_limite[1])

dados_processados = []

# Varre o arquivo linha por linha a partir da linha 1
for linha in linhas[1:]:
    partes = linha.split()
    if not partes:
        continue
    
    # Se a primeira coluna for um ano válido dentro do intervalo do arquivo
    try:
        ano = int(partes[0])
        if ano_inicio <= ano <= ano_fim:
            # As próximas 12 colunas são os valores mensais (Jan a Dez)
            valores_meses = [float(val) for val in partes[1:13]]
            
            # Adiciona cada mês individualmente
            for mes_idx, valor in enumerate(valores_meses, start=1):
                # Desconsidera valores futuros/ausentes representados por -99.99 ou -99.9
                if valor <= -99.0:
                    continue
                    
                dados_processados.append({
                    "Ano": ano,
                    "Mes": mes_idx,
                    "AMM": valor
                })
    except ValueError:
        # Pula linhas explicativas no rodapé que não começam com ano
        continue

# 4. Criar o DataFrame e ordenar cronologicamente
df_amm = pd.DataFrame(dados_processados)
df_amm = df_amm.sort_values(by=["Ano", "Mes"]).reset_index(drop=True)

# 5. Criar coluna de Data (datetime) para facilitar gráficos e análises
df_amm["Data"] = pd.to_datetime(
    df_amm[["Ano", "Mes"]].rename(columns={"Ano": "year", "Mes": "month"}).assign(day=1)
)
# Reorganiza a ordem das colunas
df_amm = df_amm[["Data", "Ano", "Mes", "AMM"]]

# 6. Salvar na pasta do projeto
import os
os.makedirs("data/raw", exist_ok=True)
df_amm.to_csv(caminho_destino, index=False, sep=";")

print("\nProcessamento Concluído!")
print(f"Dados salvos com sucesso em: {caminho_destino}")
print(f"Período extraído: {df_amm['Ano'].min()} a {df_amm['Ano'].max()}")
print(df_amm.tail())
