# Avaliação — S.ENSO | 3ª Parte da Entrega Técnica GS 2026.1

> **Avaliador:** Professor/Avaliador de Data Science (FIAP)
> **Data:** 05/06/2026
> **Notebook avaliado:** `SENSO_notebook_rascunho.ipynb`
> **Rubrico base:** `Regras/GS Desafio.md` — 3ª Parte do Desafio (Entrega Técnica)

---

## NOTA FINAL: 8,0 / 10

---

## Pontos Fortes do Projeto

**1. Cobertura máxima dos critérios técnicos.**
O projeto aplica **todos** os tópicos do rubrico — não os 3 obrigatórios mínimos, mas os 7 listados + regressão múltipla + score preditivo proprietário. Isso evidencia domínio da cadeia analítica completa.

**2. Qualidade excepcional do texto analítico.**
Cada seção possui uma célula markdown dedicada com a estrutura "O que o gráfico mostra → mecanismo físico → implicação para decisão". A interpretação do Mann-Whitney de Quixadá (p = 0,2706) como evidência da mediação atlântica, e não como falha do modelo, é um raciocínio de nível sênior.

**3. Problema muito bem formulado.**
O cenário contextualiza dados reais de maio/2026 (NOAA CPC Watch, ONI = +0,9°C, probabilidade 82–98%), as duas personas são concretas e operacionais, e as 4 perguntas do rubrico estão respondidas na introdução.

**4. Limpeza com justificativas metodológicas sólidas.**
A decisão de **winsorizár em vez de remover** outliers de precipitação — com justificativa explícita de que extremos são o sinal — demonstra maturidade analítica rara no nível de graduação.

**5. Resultado central genuinamente relevante.**
A análise de quadrante ONI × AMM (seção 6.4) com a tabela de medianas por combinação de índices (El Niño + AMM−: 17,6 mm vs. Neutro + AMM+: 45,6 mm) é o achado cientificamente mais robusto do notebook e tem interpretação impecável.

**6. Derivadas e integrais com sentido físico real.**
ΔONI como "velocidade de aquecimento do Pacífico" e a integral de precipitação acumulada em janela crítica (excedente de +80,9% em Lajeado-RS) não são artifícios matemáticos para cumprir rubrico — são métricas operacionais que alimentam o score de risco.

**7. Alinhamento ODS pertinente e não genérico.**
ODS 2, 9, 11 e 13 são conectados com ações concretas (ex.: Garantia-Safra, planos de contingência do Taquari) em vez de apenas citados.

---

## Oportunidades de Melhoria (O que falta para atingir nota 10)

### Bloqueador crítico

**A seção 9.3 é um placeholder.**
A célula 65 contém `[Preencher após rodar a análise completa com os dados reais]` com valores entre colchetes — correlações, desvios e scores ficaram como template. Para uma entrega final, esta seção precisa ser preenchida com os valores reais calculados ao longo do notebook. É o ponto que mais penaliza a nota.

### Melhorias substanciais

**Dados de produção agrícola (IBGE/PAM) e decretos (S2iD) carregados mas pouco analisados.**
As seções 2.5 e 2.6 fazem o carregamento desses datasets, mas não há análise inferencial cruzando fases ENSO com (a) rendimento de milho/trigo e (b) contagem de decretos de emergência por fase ENSO. Uma tabela "número de decretos por fase ENSO" ou um gráfico de rendimento agrícola em anos de El Niño Forte vs. Neutro seria a validação histórica direta que o score promete mas não entrega.

**Matriz de correlação visual ausente.**
O rubrico cita explicitamente "matriz de correlação". O projeto faz correlações pontuais e lag correlations excelentes, mas não apresenta um heatmap consolidado mostrando as relações entre ONI, AMM, GPAT, precipitação e produção.

**Regressão de Quixadá precisa de refinamento.**
O AMM_lag não atingiu significância (p = 0,128) no lag = 1 mês na regressão, mas o projeto reporta que o lag ótimo do AMM é 5 meses (seção 6.4). O modelo final deveria re-estimar a regressão com `AMM_lag5` — o texto promete isso mas o código de regressão (seção 6.3) usa lag = 1.

**Score de risco com linha de código incompleta.**
Na célula 55, a linha `atl_corr =` está cortada — sinal de que o notebook não foi executado completamente até esse ponto do desenvolvimento.

---

## Análise Detalhada por Critério

### Critério 1 — Alinhamento e Proposta | 9,5 / 10

| Item | Avaliação |
|---|---|
| Cenário atual e problema | Excelente — dados NOAA de maio/2026, contexto ENSO, polarização NE vs. Sul |
| Relevância | Muito boa — contraste sistemático vs. alertas reativos existentes (CEMADEN: horas/dias; ENSO: 3–6 meses) |
| Personas | Duas personas específicas com nome, idade, ocupação, necessidade e contexto de uso real |
| Impactos socioambientais | ODS 2, 9, 11 e 13 com conexões operacionais concretas, não genéricas |
| Público-alvo | Claramente segmentado (agricultor familiar + coordenador de defesa civil) |
| Detalhe a melhorar | Arquitetura técnica da solução não aparece no notebook (é coberta no PDF/pitch — ok para este entregável) |

---

### Critério 2 — Coleta, Limpeza e Tratamento | 9,0 / 10

| Item | Avaliação |
|---|---|
| Fontes de dados | 6 fontes integradas (ONI, AMM, GPAT=TNA−TSA, INMET, IBGE/PAM, S2iD) — excelente diversidade |
| Valores ausentes | Interpolação linear limitada (max_gap=3 meses) com justificativa de autocorrelação sazonal |
| Outliers | Winsorização no p99,9 — decisão correta e bem justificada |
| Inconsistências | Sentinel −9999 → NaN; encoding latin-1; skiprows documentados por fonte |
| Padronização | Dataset integrado mensal via join Ano/Mes; alinhamento temporal explícito |
| Diagnóstico | Célula 3.1 apresenta contagens de ausentes, duplicatas e range por variável |
| Detalhe a melhorar | Falta heatmap de missing data antes/depois do tratamento; validação de completude pós-limpeza mais visual |

---

### Critério 3 — Aplicação Teórica e Prática de DS | 8,5 / 10

| Tópico | Aplicado? | Qualidade |
|---|---|---|
| Estatística descritiva | Sim | Boxplots estratificados por fase ENSO com medianas anotadas (16,4 mm vs. 23,6 mm), sazonalidade por mês × fase, série temporal ONI 1980–2026 |
| Amostragem | Sim | Estratificação proporcional por 7 fases ENSO (justificada: Neutro = 41,7% da série), validação KS com p = 1,00 — metodologia rigorosa |
| Testes de hipótese | Sim | Mann-Whitney U com H₀/H₁ explícitos, p-values reportados (Lajeado p = 0,0064; Quixadá p = 0,2706), interpretação causal do resultado negativo |
| Correlação e associação | Sim | Pearson + Spearman + Lag correlation 0–12 meses, AMM×precipitação, interação ONI×AMM por quadrante — nível técnico elevado |
| Regressão | Sim | Regressão múltipla com ONI_lag, AMM_lag, codificação cíclica de sazonalidade (sin/cos) — R² = 0,546 Quixadá; interpretação dos coeficientes em mm/°C |
| Derivadas | Sim | ΔONI/mês como velocidade de aquecimento, Δ²ONI como aceleração; valores reportados (+0,20°C/mês histórico vs. +0,35°C/mês projetado IRI/NOAA) |
| Integrais | Sim | Precipitação acumulada trimestral em janela crítica (El Niño vs. Neutro): +80,9% Lajeado, +37,8% Quixadá (com análise de consistência explicada) |
| Score preditivo (extra) | Sim | Função S.ENSO 0–100 com 5 componentes (ONI, ΔONI, sensibilidade, histórico, Atlântico), projeção 6 meses com barras coloridas por nível |
| Detalhe a melhorar | Matriz de correlação visual ausente; regressão de Quixadá deveria usar AMM_lag5 (não lag1); PAM e S2iD não cruzados com fases ENSO |

---

### Critério 4 — Qualidade Visual e Texto Analítico | 6,5 / 10

| Item | Avaliação |
|---|---|
| Texto analítico por gráfico | Excelente — cada seção tem célula "O que mostra" com interpretação quantitativa + mecanismo físico + implicação operacional |
| Pipeline decisório | Célula 61 ("do oceano à ação") articula as 5 etapas analíticas com elegância — texto de conclusão intermediária forte |
| Conexão achados → negócio | Bem executada: coeficiente −42,4 mm/°C → alertas de plantio; +80,9% acumulado → plano de contingência |
| Visualizações | Boxplots, séries temporais, lag correlation, scatter real vs. predito, barras de score coloridas — cobertura adequada |
| **Conclusão principal (célula 65)** | **PLACEHOLDER — valores entre colchetes, zero preenchimento com dados reais** |
| ODS na conclusão | Presente no texto das seções mas a conclusão formal (9.3) não pôde ser avaliada por ser template |
| Limitações | Descritas com honestidade científica (série curta, ausência de dados intra-município, restrição ao MVP) — ponto positivo |

> A nota deste critério seria 9,5/10 se a conclusão estivesse preenchida. O placeholder é o fator de penalização principal.

---

## Síntese para o Aluno

O S.ENSO é, metodologicamente, um dos projetos mais completos que se pode avaliar nesta disciplina: cobre todos os tópicos do rubrico com rigor, o texto analítico conecta estatística à física e à decisão, e a inovação do score preditivo vai além do exigido. O que separa este trabalho de uma nota 9,5 são correções pontuais — todas executáveis antes da entrega final:

| Prioridade | Ação |
|---|---|
| Critica | Preencher a célula 65 com os valores reais calculados ao longo do notebook |
| Alta | Adicionar análise cruzando fases ENSO com número de decretos S2iD e com rendimento agrícola IBGE — os dados já estão carregados |
| Média | Heatmap de correlação consolidado entre todas as variáveis |
| Média | Re-estimar a regressão de Quixadá com `AMM_lag5` em vez de `AMM_lag1` |
| Baixa | Completar a linha `atl_corr =` incompleta no score de risco (célula 55) |
