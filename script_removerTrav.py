import json

caminho_arquivo = "SENSO_notebook_rascunho.ipynb"

# 1. Ler o notebook como JSON
with open(caminho_arquivo, 'r', encoding='utf-8') as f:
    dados = json.load(f)

# 2. Converter para string, substituir os caracteres e carregar de volta
dados_convertidos = json.loads(json.dumps(dados).replace("—", "-"))

# 3. Salvar o arquivo atualizado
with open(caminho_arquivo, 'w', encoding='utf-8') as f:
    json.dump(dados_convertidos, f, indent=1, ensure_ascii=False)

print("Substituição concluída com sucesso!")
