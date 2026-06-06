## Estrutura definitiva do notebook

Nove seções, todas justificadas pelo desafio:

- A seção 1 é Configuração do ambiente e importações. Inclui as duas personas (Seu João e Mariana), os números do El Niño 2026 que estão nos documentos de pesquisa, e a pergunta de pesquisa: "Em que grau a anomalia ONI do Pacífico explica estatisticamente os impactos climáticos e agrícolas em municípios brasileiros de perfis opostos, e como podemos transformar essa relação em um score acionável de risco?".

- A seção 2 é Fontes de dados, carregamento e descrição das variáveis. Sete subsecoes: 2.1 mapeamento das fontes; 2.2 carregamento ONI (Pacífico); 2.3 classificação de fases ENSO (CPC); 2.4 precipitação INMET — CE: A325 Quixeramobim (arquivos disponíveis 2007–2026, usados como proxy até 2017) + A369 Quixadá (2018–2026); RS: A840 Bento Gonçalves (arquivos disponíveis 2006–2026, usados como proxy até 2012) + A882 Teutônia (2013–2026); todas as séries vão até abril/2026; 2.5 produção de milho/trigo do IBGE/PAM; 2.6 decretos de emergência do S2iD; 2.7 AMM — Atlantic Meridional Mode (arquivo local amm_mensal.csv, NOAA/PSL, cobertura 1948–agosto/2024, sep=';', decimal='.').

- A seção 3 é Limpeza e tratamento (obrigatória). Tratamento de NaN, alinhamento temporal, tratamento de outliers com winsorização justificada (não removemos, porque outlier de chuva é o que mais importa), padronização de unidades.

- A seção 4 é Estatística descritiva. Boxplots de precipitação por fase ENSO, séries temporais ONI vs. precipitação para ambos municípios, distribuição de produção agrícola.

- A seção 5 é Amostragem estratificada por fase ENSO. Justifica que a estratificação é necessária porque anos neutros dominam a série histórica (cerca de 60%) e isso enviesa testes de comparação. Define os estratos (sete fases ENSO) e mostra a representatividade após amostragem.

- A seção 6 é Análise inferencial. Quatro blocos: 6.1 correlação Pearson e Spearman com lag de 0 a 12 meses entre ONI/AMM e precipitação local; 6.2 teste Mann-Whitney comparando precipitação em El Niño forte/super vs. anos neutros nas janelas críticas (Fev-Mar-Abr e Set-Out-Nov); 6.3 regressão linear múltipla para modelar a chuva trimestral a partir de ONI + AMM + dummies de fase + mês cíclico (seno/cosseno); 6.4 correlação AMM × precipitação e análise de interação ONI×AMM (Quixadá-CE) — achado principal: El Niño + AMM negativo confirma seca; El Niño + AMM positivo cancela seca (explica chuvas de 2024 no Sertão).

- A seção 7 é Derivadas, integrais e análise de taxa de variação. Derivada da série ONI (taxa de variação mensal) como feature de aceleração do fenômeno. Integral da chuva acumulada nas janelas críticas ajustadas (Fev-Mar-Abr para Quixadá; Set-Out-Nov para Lajeado) como medida de impacto real. Cobre os itens "limites e derivadas" e "conceitos de integrais" do rubrica GS.

- A seção 8 é Score de risco municipal S.ENSO. Função que recebe o estado atual do ONI e o último AMM disponível (ago/2024), município, e retorna um score de risco 0-100 e um nível de alerta (Verde/Amarelo/Laranja/Vermelho). Aplicação concreta com dados de 2026.

- A seção 9 é Recomendações práticas e conclusão. Resume os achados, reconhece as limitações (correlação não é causalidade, AMM disponível apenas até ago/2024, série curta para alguns dados, sistema é probabilístico), gera a recomendação que o Seu João e a Mariana receberiam, e amarra com os ODS 2, 11 e 13.