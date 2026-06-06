# S.ENSO — Sistema Preditivo Integrado de Risco Agricola e Desastres Naturais orientado por Dados Espaciais e Sinais ENSO

---

## 1. Visao Geral

O S.ENSO e um sistema preditivo de risco que integra sinais oceanicos e atmosfericos do fenomeno ENSO com dados historicos de desastres naturais, producao agricola e vulnerabilidade municipal, gerando alertas antecipados de 3 a 6 meses para dois publicos distintos: gestores publicos de defesa civil e agricultores familiares em regioes vulneraveis do Brasil.

A proposta central e simples: transformar o sinal do Pacifico — ja disponivel e confiavel — em linguagem de risco acionavel, antes que o desastre aconteca.

---

## 2. Problema

O Brasil e um dos paises mais afetados pelo ENSO no mundo. Cada evento de El Nino forte provoca simultaneamente:

- Enchentes e deslizamentos no Sul e Sudeste
- Seca severa no Nordeste e norte da Amazonia
- Ondas de calor e incendios florestais no Centro-Oeste e Amazonia
- Reducao de safra em culturas essenciais como milho, feijao, arroz e soja

Apesar disso, os sistemas existentes atuam de forma reativa e fragmentada. O agricultor familiar do sertao nao recebe um aviso de que, dada a anomalia atual do Pacifico, o risco de estiagem critica no seu municipio nos proximos quatro meses e alto e que o plantio de milho deve ser adiado ou substituido. A defesa civil municipal tambem nao tem acesso a um painel integrado que conecte o estado atual do ENSO ao historico especifico de desastres do seu municipio.

---

## 3. Dados Utilizados

### 3.1 Dados Oceanicos e Atmosfericos (Sinal ENSO)

| Fonte | Dado | Uso no sistema |
|---|---|---|
| NOAA/CPC | Anomalia de SST nas regioes Nino 3.4, Nino 1+2 | Classificacao do estado ENSO e intensidade |
| NOAA/CPC | Indice de Oscilacao Sul (SOI) historico | Confirmacao do acoplamento oceanico-atmosferico |
| NOAA/PSL | Indice AMM (Atlantic Meridional Mode) mensal 1948–ago/2024 (arquivo local amm_mensal.csv) | Medir a influencia da temperatura e ventos do Atlantico na ZCIT e nas chuvas do Nordeste; interacao com ONI para confirmar ou cancelar seca no NE |
| NOAA/ARGO | Temperatura subsuperficial do Pacifico equatorial | Antecipacao do desenvolvimento do evento |
| IRI/Columbia | Probabilidades previstas de ENSO para proximos trimestres | Horizonte de risco futuro |
| NASA EarthData | Dados de vento, pressao e convecção tropical | Contexto atmosferico complementar |

### 3.2 Dados Climaticos Regionais Brasileiros

| Fonte | Dado | Uso no sistema |
|---|---|---|
| INMET | Serie historica de precipitacao — CE: estacao A325 Quixeramobim (2007–2026, usada como proxy ate 2017) e A369 Quixada (2018–2026); RS: estacao A840 Bento Goncalves (2006–2026, usada como proxy ate 2012) e A882 Teutonia (2013–2026). Todas as series se estendem ate abril/2026. | Correlacao ENSO/Atlantico x chuva por municipio |
| INMET | Serie historica de temperatura maxima e minima | Correlacao ENSO x calor extremo |
| ANA (Agencia Nacional de Aguas) | Nivel de reservatorios e vazao de rios | Risco hidrico e energetico |
| INPE/BDQueimadas | Focos de incendio historicos por municipio | Risco de queimada em anos de El Nino |

### 3.3 Dados de Desastres Naturais

| Fonte | Dado | Uso no sistema |
|---|---|---|
| S2iD/SEDEC (MI) | Decretos de emergencia e calamidade por municipio e tipo de evento | Base historica de ocorrencias para correlacao |
| CEMADEN | Alertas e registros de deslizamentos e enchentes | Validacao de risco e calibracao do modelo |
| EM-DAT (CRED) | Base global de desastres com danos e afetados | Contexto internacional e eventos extremos |

### 3.4 Dados Agricolas

| Fonte | Dado | Uso no sistema |
|---|---|---|
| IBGE/PAM | Producao agricola municipal por cultura e ano | Correlacao entre ENSO e perda de safra |
| CONAB | Calendario agricola por cultura e regiao | Identificacao de janelas criticas de vulnerabilidade |
| EMBRAPA/Zoneamento Agricola | Aptidao por cultura e municipio | Elegibilidade de culturas para alerta |
| MapBiomas | Cobertura e uso do solo por municipio | Area plantada atual e vegetacao exposta |

### 3.5 Dados Socioeconomicos

| Fonte | Dado | Uso no sistema |
|---|---|---|
| IBGE | IDH, populacao, renda per capita por municipio | Ponderacao de vulnerabilidade social |
| MDS/CadUnico | Densidade de agricultores familiares por municipio | Priorizacao de alertas para publico-alvo |
| MAPA/PRONAF | Contratos de credito rural por municipio | Estimativa de exposicao financeira agricola |

---

## 4. Como os Dados Sao Relacionados e Correlacionados

### 4.1 Logica Central do Modelo

O sistema opera em tres camadas de processamento:

**Camada 1 — Estado ENSO**
A partir das anomalias de SST na regiao Nino 3.4 e do SOI, o sistema classifica o estado atual em: La Nina forte, La Nina fraca, Neutro, El Nino fraco, El Nino moderado, El Nino forte, Super El Nino. Essa classificacao e atualizada mensalmente com os boletins do NOAA e IRI.

**Camada 2 — Resposta Historica Regional**
Para cada municipio brasileiro, o sistema calcula, com base nos ultimos 40 anos de dados:
- Como cada classe de ENSO historicamente afetou a precipitacao local (desvio em %)
- Frequencia de decretos de emergencia por tipo de evento em anos de El Nino forte
- Variacao media de producao agricola por cultura em anos de El Nino forte

Isso gera um perfil de sensibilidade ENSO por municipio — alguns sao muito sensiveis, outros pouco.

**Camada 3 — Score de Risco Integrado**
Combinando o estado atual do ENSO com o perfil de sensibilidade municipal e o calendario agricola vigente, o sistema calcula:

```
Score_Risco_Desastre  = f(ClasseENSO, AMM_Atlantico, SensibilidadeClimatica, HistoricoDecretos, IDH_invertido)
Score_Risco_Agricola  = f(ClasseENSO, AMM_Atlantico, CulturaAtiva, FaseDoCiclo, PerdaHistorica, AreaPlantada)
Score_Risco_Final     = ponderacao(Score_Desastre, Score_Agricola, VulnerabilidadeSocial)
```

O resultado e um nivel de alerta (Verde / Amarelo / Laranja / Vermelho) por municipio, por tipo de risco e por janela de tempo (30, 60, 90, 180 dias).

### 4.2 Tecnicas de Correlacao Aplicadas

- **Correlacao de Pearson e Spearman** entre as anomalias oceanicas (ONI do Pacifico e AMM do Atlantico) e a precipitacao historica por municipio
- **Defasagem temporal (lag correlation)** para identificar com quantos meses o sinal oceanico antecede o impacto local
- **Regressao linear multipla** para modelar e prever a precipitacao trimestral acumulada em funcao do ONI (Pacifico), AMM (Atlantico), fase simplificada do ENSO e termos ciclicos de sazonalidade (seno e cosseno do mes)
- **Testes de hipotese (t-test / Mann-Whitney)** para validar se a precipitacao em anos de El Nino forte/super difere estatisticamente de anos neutros nas janelas criticas regionais
- **Series temporais** para identificar tendencias de longo prazo e anomalias recentes
- **Analise de correlacao cruzada** entre focos de incendio e anomalia de SST com defasagem

---

## 5. Publico-Alvo

### 5.1 Gestores Municipais de Defesa Civil
Municipios com historico de desastres associados ao ENSO, especialmente no Sul (enchentes) e Nordeste (seca). Necessidade: antecipacao de 3 a 6 meses para alocar recursos, acionar planos de contingencia e comunicar populacao.

### 5.2 Agricultores Familiares
Pequenos produtores nas regioes Nordeste, Norte e Sul, que nao tem acesso a consultorias climaticas privadas. Necessidade: orientacao pratica sobre quando plantar, qual cultura e menos arriscada na estacao, e quando acionar seguro rural.

### 5.3 Secretarias Estaduais de Agricultura e Defesa Civil
Nivel intermediario que precisa de visao panoramica por regiao para coordenar acoes entre municipios e alocar recursos preventivamente.

### 5.4 Operadoras de Seguro Rural e Credito Agricola
Instituicoes que precisam ajustar exposicao de risco de carteira com antecedencia. O score do sistema pode ser usado como insumo para precificacao de seguros em anos de El Nino.

---

## 6. Diferencial em Relacao aos Sistemas Existentes

| Criterio | Sistemas Atuais | S.ENSO |
|---|---|---|
| Antecedencia do alerta | Horas a dias (reativos) | 3 a 6 meses (preditivo) |
| Integracao de dados | Silos separados (clima, agricultura, desastre) | Dados integrados em score unico |
| Granularidade | Nivel estadual ou regional | Nivel municipal com perfil individual |
| Publico | Tecnicos especializados | Gestores municipais e agricultores familiares |
| Combinacao de riscos | Clima OU agricultura | Clima E agricultura no mesmo painel |
| Uso do sinal ENSO | Monitoramento generico | Correlacao historica especifica por municipio |
| Linguagem | Tecnica (anomalias, indices) | Acionavel (nivel de alerta + recomendacao pratica) |

O diferencial fundamental e a **traducao do sinal cientifico em decisao pratica**, com antecedencia suficiente para que a acao preventiva seja possivel.

---

## 7. Arquitetura Tecnica

```
+---------------------------+
|     FONTES DE DADOS       |
|  NOAA | INMET | IBGE      |
|  INPE | S2iD  | MapBiomas |
|  CONAB| ANA   | IRI       |
+-------------+-------------+
              |
              v
+---------------------------+
|    CAMADA DE INGESTAO     |
|  Coleta automatizada via  |
|  APIs publicas e arquivos |
|  CSV/NetCDF periodicos    |
|  (batch mensal + updates  |
|   quinzenais NOAA)        |
+-------------+-------------+
              |
              v
+---------------------------+
|    DATA LAKE / STORAGE    |
|  Google Cloud Storage     |
|  ou estrutura local       |
|  Dados brutos versionados |
+-------------+-------------+
              |
              v
+---------------------------+
|  CAMADA DE PROCESSAMENTO  |
|  Python (Pandas, NumPy,   |
|  SciPy, Scikit-learn)     |
|                           |
|  - Limpeza e normalizacao |
|  - Calculo de correlacoes |
|  - Calculo de lags ENSO   |
|  - Score de risco         |
|  - Modelo preditivo       |
|    (regressao / RF)       |
+-------------+-------------+
              |
              v
+---------------------------+
|   CAMADA ANALITICA        |
|  BigQuery ou PostgreSQL   |
|  Tabelas por municipio    |
|  Score mensal atualizado  |
+-------------+-------------+
              |
              v
+---------------------------+
|   CAMADA DE CONSUMO       |
|                           |
|  Dashboard Power BI /     |
|  Streamlit / Looker        |
|                           |
|  - Mapa de calor de risco |
|  - Painel por municipio   |
|  - Alertas por cultura    |
|  - Serie historica ENSO   |
|  - Recomendacoes de acao  |
+---------------------------+
```

### Tecnologias por Camada

- **Ingestao:** Python (requests, xarray para NetCDF), schedule para automacao
- **Storage:** Google Cloud Storage ou diretorio local estruturado
- **Processamento:** Python (Pandas, NumPy, SciPy, Scikit-learn, statsmodels)
- **Banco analitico:** BigQuery (GCP) ou PostgreSQL local
- **Visualizacao:** Power BI, Streamlit ou Google Looker Studio
- **Controle de versao:** GitHub

---

## 8. Sugestao de Prototipo

O prototipo de baixa fidelidade deve ser um dashboard com quatro telas principais:

### Tela 1 — Painel Nacional (Mapa de Risco)
- Mapa do Brasil com municipios coloridos por nivel de alerta (Verde/Amarelo/Laranja/Vermelho)
- Filtros: tipo de risco (desastre / agricola / combinado), janela de tempo (30/60/90/180 dias), cultura agricola
- Indicador do estado atual do ENSO no topo (ex: "El Nino Forte — SST +1.8C — Probabilidade 96%")

### Tela 2 — Painel Municipal
- Selecionado um municipio, exibe:
  - Score de risco atual com historico dos ultimos 12 meses
  - Grafico de precipitacao historica em anos de El Nino vs. anos neutros
  - Culturas ativas no municipio e nivel de risco por cultura
  - Historico de decretos de emergencia com data e tipo
  - Recomendacoes praticas (ex: "Alta probabilidade de estiagem entre outubro e dezembro. Priorize culturas de ciclo curto e acione seguro rural preventivamente.")

### Tela 3 — Serie Historica ENSO x Impactos
- Grafico duplo-eixo: anomalia de SST (Nino 3.4) x precipitacao media regional ao longo dos anos
- Grafico de barras: producao agricola por cultura em anos de El Nino forte vs. anos neutros
- Grafico de dispersao: anomalia ENSO x numero de decretos de emergencia por estado

### Tela 4 — Previsao e Horizonte de Risco
- Probabilidades de ENSO para os proximos 6 trimestres (baseado em IRI/NOAA)
- Projecao de nivel de alerta para os proximos 180 dias por regiao
- Calendario de culturas com janelas criticas marcadas por nivel de risco

---

## 9. Conexao com os ODS

- **ODS 2 (Fome Zero e Agricultura Sustentavel):** reducao de perda de safra por antecipacao de risco climatico
- **ODS 11 (Cidades e Comunidades Sustentaveis):** alertas antecipados para defesa civil municipal
- **ODS 13 (Acao Contra a Mudanca do Clima):** uso de dados climaticos para adaptacao e resiliencia
- **ODS 9 (Industria, Inovacao e Infraestrutura):** plataforma de dados espaciais integrada e acessivel

---

## 10. Impactos Esperados

- Reducao do tempo de resposta de defesa civil municipal mediante antecipacao de 3 a 6 meses
- Reducao de perda de safra por orientacao de plantio baseada em risco climatico previsto
- Democratizacao do acesso a informacao climatica qualificada para municipios sem estrutura tecnica
- Insumo para politicas publicas de seguro rural, credito e protecao social antecipados
- Base analitica para pesquisa academica sobre vulnerabilidade ENSO no Brasil

---

## 11. Limitacoes e Pontos de Atencao

- O sinal ENSO tem maior previsibilidade para o Nordeste e Sul; o Sudeste tem resposta mais variavel
- A correlacao historica nao garante precisao para eventos individuais — o sistema e probabilistico
- Municipios com series historicas curtas ou com dados ausentes tem scores menos confiaveis
- O sistema nao substitui alertas operacionais de curto prazo do CEMADEN e INMET; e complementar

---

*Documento elaborado como escopo base para o projeto Global Solution — FIAP 2026.1*
