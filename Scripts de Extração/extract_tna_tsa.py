import os
import requests
import pandas as pd

# URLs oficiais dos índices TNA e TSA da NOAA PSL
INDICES = {
    "TNA": "https://psl.noaa.gov/data/correlation/tna.data",
    "TSA": "https://psl.noaa.gov/data/correlation/tsa.data"
}

diretorio_destino = "data/raw"
os.makedirs(diretorio_destino, exist_ok=True)

def processar_indice_noaa(nome_indice, url):
    print(f"Baixando dados do {nome_indice} de: {url}")
    resposta = requests.get(url, timeout=10)
    if resposta.status_code != 200:
        raise Exception(f"Falha ao baixar dados do {nome_indice}. Status HTTP: {resposta.status_code}")
    
    linhas = resposta.text.splitlines()
    
    # Primeira linha contém os limites de anos do arquivo (ex: 1948 2025)
    anos_limite = linhas[0].split()
    ano_inicio = int(anos_limite[0])
    ano_fim = int(anos_limite[1])
    
    dados_processados = []
    
    # Varre a partir da segunda linha
    for linha in linhas[1:]:
        partes = linha.split()
        if not partes:
            continue
        
        try:
            ano = int(partes[0])
            # Verifica se está no intervalo de anos válido indicado no cabeçalho
            if ano_inicio <= ano <= ano_fim:
                # 12 colunas seguintes correspondem a Jan a Dez
                valores_meses = [float(val) for val in partes[1:13]]
                
                for mes_idx, valor in enumerate(valores_meses, start=1):
                    # Ignorar valores nulos/ausentes representados por sentinelas como -99.99 ou -99.9
                    if valor <= -99.0:
                        continue
                    
                    dados_processados.append({
                        "Ano": ano,
                        "Mes": mes_idx,
                        nome_indice: valor
                    })
        except (ValueError, IndexError):
            # Pula cabeçalhos secundários ou linhas descritivas de rodapé
            continue
            
    # Cria o DataFrame e ordena
    df = pd.DataFrame(dados_processados)
    df = df.sort_values(by=["Ano", "Mes"]).reset_index(drop=True)
    
    # Cria coluna no formato datetime
    df["Data"] = pd.to_datetime(
        df[["Ano", "Mes"]].rename(columns={"Ano": "year", "Mes": "month"}).assign(day=1)
    )
    
    # Reordena colunas
    df = df[["Data", "Ano", "Mes", nome_indice]]
    return df

# Executa o download e processamento para ambos os índices
for nome, url in INDICES.items():
    try:
        df_processado = processar_indice_noaa(nome, url)
        
        # Salva o arquivo na pasta data/raw
        caminho_csv = os.path.join(diretorio_destino, f"{nome.lower()}_mensal.csv")
        df_processado.to_csv(caminho_csv, index=False, sep=";")
        
        print(f"Dados do {nome} salvos com sucesso em: {caminho_csv}")
        print(f"  Período: {df_processado['Ano'].min()} a {df_processado['Ano'].max()}")
        print(df_processado.tail(3))
        print("-" * 50)
    except Exception as e:
        print(f"Erro ao processar o índice {nome}: {e}")

print("\nProcessamento Concluído!")
