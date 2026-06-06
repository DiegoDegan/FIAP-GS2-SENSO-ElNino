# Avaliação — S.ENSO | Global Solution 2026.1

> **Avaliador:** Professor/Avaliador de Data Science (FIAP)
> **Data:** 06/06/2026
> **Notebook avaliado:** `SENSO_notebook_rascunho.ipynb`
> **Critério:** 3ª Parte do Desafio — Entrega Técnica (GS Desafio.md)

---

## [NOTA FINAL: 9,0/10]

---

## Pontos Fortes do Projeto

**1. Proposta excepcionalmente bem fundamentada.** O cenário é contextualizado com dados reais e atuais do CPC/NOAA (probabilidades numéricas, ONI = +0,9°C em maio/2026), e o problema da lacuna entre alertas reativos e preventivos é descrito com precisão cirúrgica. As personas — Seu João, agricultor familiar em Quixadá-CE, e Mariana, coordenadora de Defesa Civil em Lajeado-RS — têm nome, idade, profissão, contexto e necessidade específica. Raras vezes uma entrega de GS chega com personas tão bem operacionalizadas.

**2. Cobertura integral do rubric com sobra.** O projeto aplica **todos** os sete tópicos da avaliação técnica, sendo que o mínimo exigido é três além da limpeza. Isso por si só não seria diferencial — a qualidade de execução de cada um é o que impressiona: cada resultado numérico tem unidade física, interpretação causal e conexão com a persona afetada.

**3. Rigor metodológico avançado.** A decisão de usar winsorização em vez de remoção de outliers de precipitação (com justificativa explícita de que eventos extremos *são* o sinal de interesse) demonstra maturidade de cientista de dados. A estratificação amostral por fase ENSO seguida de validação KS (p = 1,00, D < 0,030) é um protocolo raro em trabalhos de graduação. A seção 6.7 com comparação OLS vs. Random Forest vs. XGBoost em `TimeSeriesSplit` temporal é nível de artigo científico.

**4. Textos analíticos fora da curva.** Os parágrafos de interpretação não se limitam a descrever o gráfico — explicam o *porquê* físico do resultado (teleconexão Pacífico → Atlântico → ZCIT → sertão nordestino), reconciliam aparentes contradições entre seções (por que o Mann-Whitney não rejeita H₀ em Quixadá mas a regressão atinge R² = 0,54), e conectam os números a ações operacionais específicas para as personas.

**5. Consistência analítica transversal.** Os três métodos independentes — correlação univariada (Seção 6.1/6.4), regressão múltipla (6.3) e feature importance do Random Forest (6.7) — convergiram para a mesma conclusão: AMM é o preditor dominante em Quixadá-CE; ONI é o preditor dominante em Lajeado-RS. Essa consistência entre métodos de natureza radicalmente diferente (paramétrico linear vs. ensemble não-paramétrico) é um dos resultados mais elegantes do notebook.

---

## Oportunidades de Melhoria (O que falta para a nota 10?)

**1. Corrigir a especificação da regressão (Seção 6.3 × Seção 6.4).**
O próprio notebook admite na Seção 6.4: *"Respecificar a regressão com AMM lag = 5 meses provavelmente aumentaria o R² e tornaria o coeficiente significativo — esse refinamento está na direção natural de melhoria do modelo."* Identificar o problema sem corrigi-lo é metade do caminho. Adicionar um bloco de código na Seção 6.3 respecificando com `AMM_lag5` e comparando os dois R²s em uma tabela eliminaria essa inconsistência declarada.

**2. Calibração dos pesos da função de score via dados.**
A função `calcular_score_risco()` na Seção 8.1 usa pesos (ex.: `w_oni`, `w_delta`, `w_correlacao`) que não são otimizados empiricamente — são definidos arbitrariamente. Dado que o notebook já tem a validação histórica (Seção 8.4) e a varredura de F1 (Seção 8.5), seria metodologicamente coerente usar grid search ou regressão logística sobre o dataset histórico de decretos para calibrar esses pesos. Isso transformaria o score de "proposta engenhosa" em "modelo validado".

**3. Threshold operacional ambíguo.**
A Seção 8.5 encontrou threshold ótimo = 1,0 — o que significa que praticamente todo ano emite alerta, tornando o score contínuo 0–100 o único diferencial real. O notebook explica isso bem, mas deveria apresentar uma **tabela de trade-offs** (threshold × precisão × recall × F1) para que o gestor escolha o limiar conforme a sua aversão a falsos negativos. Atualmente a recomendação implícita é "ignore o threshold binário e use a gradação", o que é correto, mas deixa o usuário sem uma regra de decisão operacional.

**4. Correlação de Spearman subutilizada.**
O módulo `spearmanr` é importado na Seção 1 e aplicado na Seção 6.1, mas não aparece de forma proeminente nos resultados apresentados — os textos analíticos citam majoritariamente o Pearson. Para séries com distribuições assimétricas (precipitação no Nordeste tem assimetria positiva forte), Spearman seria mais robusto e sua comparação explícita com Pearson enriqueceria a análise metodológica.

**5. Grupo individual.**
O desafio é especificado como atividade de grupo. Uma entrega individual pode receber penalização administrativa independentemente da qualidade técnica. Mesmo que a entrega seja aceita individualmente, adicionar na capa uma nota sobre a composição do grupo é recomendável.

---

## Análise Detalhada por Critério

---

### Critério 1 — Alinhamento e Proposta | **9,5/10**

| Subcritério | Avaliação |
|---|---|
| Cenário atual | Excepcional. Dados reais do CPC/NOAA de maio/2026, probabilidades numéricas, anomalia TSM +0,9°C. |
| Relevância do problema | Muito boa. Lacuna entre sistemas reativos (horas) e o lead time disponível (3–6 meses) está precisamente identificada. |
| Personas | Melhor do que o esperado para uma graduação: específicas, nomeadas, com contexto real (Garantia-Safra, CEMADEN). |
| Impacto socioambiental | ODS 2, 11 e 13 explicitamente linkadas na Seção 9.3 com conexão clara ao que foi analisado. |
| Proposta de solução | Score municipal 0–100 com lead time de 3–6 meses é uma proposta realista e diferenciada. |

O único ponto que impede 10/10 aqui é que a arquitetura da solução (como o S.ENSO seria operacionalizado, atualizado e distribuído para os usuários finais) fica implícita. A Seção 9.1 entrega recomendações práticas, mas não descreve o fluxo operacional do sistema.

---

### Critério 2 — Coleta, Limpeza e Tratamento de Dados | **9,5/10**

| Etapa | Nota | Detalhe |
|---|---|---|
| Identificação de fontes | 10/10 | 7 fontes heterogêneas (NOAA, INMET, IBGE/PAM, S2iD, NOAA PSL), cada uma com separadores, encodings e formatos distintos corretamente tratados. |
| Valores ausentes | 9/10 | Interpolação linear (≤ 3 meses) + flag para lacunas maiores. Bem justificado. Poderia detalhar o que acontece após o flag (exclusão? flag na feature?). |
| Outliers | 10/10 | Winsorização com justificativa metodológica explícita e correta: eventos extremos de precipitação *são* o sinal, não ruído. |
| Padronização/normalização | 9/10 | StandardScaler aplicado na regressão, alinhamento temporal Ano-Mes para todos os datasets. |
| Diagnóstico de qualidade | 9/10 | Seção 3.1 com print dos registros, NaNs e distribuições. Poderia incluir um DataFrame de resumo visual (ex.: tabela de completude por fonte). |
| Sentinela INMET (-9999) | 10/10 | Identificado e tratado como NaN. |
| Estratégia de estações | 10/10 | Fusão A325+A369 (CE) e A840+A882 (RS) com filtros temporais corretos e justificados. |

---

### Critério 3 — Aplicação Teórica e Prática de Data Science | **10/10**

O projeto aplica **7 dos 7 tópicos** do rubric, mais 3 adicionais (ML comparativo, análise de decretos, análise agrícola):

| Tópico (Rubric) | Seção | Avaliação |
|---|---|---|
| Limpeza e normalização | Seção 3 | Obrigatório — executado com rigor (ver Critério 2). |
| Estatística descritiva | Seção 4 | Tendência central, dispersão, boxplots por fase ENSO, sazonalidade. Todos interpretados. |
| Noções de amostragem | Seção 5 | Estratificação por fase ENSO + teste KS para representatividade. Discussão de viés de desbalanceamento (60% neutro). |
| Testes de hipótese | Seção 6.2 | Mann-Whitney U com H₀/H₁ explícitos, p-values, interpretação causal (por que Quixadá não rejeita H₀). |
| Correlação e associação | Seções 6.1, 6.4 | Pearson com lag 0–12m, correlação AMM×precipitação, análise de interação ONI×AMM em quadrantes. |
| Limites e derivadas | Seção 7.1 | Derivada discreta do ONI (ΔONI = taxa de variação em °C/mês). Interpretação física como acelerador do fenômeno. |
| Integrais | Seção 7.2 | Precipitação acumulada em janelas críticas (Set-Out-Nov para Lajeado, Fev-Mar-Abr para Quixadá). Traduzido em mm e em desvio percentual vs. Neutro (+80,9% em RS). |

**Tópicos adicionais além do rubric:**
- Regressão linear múltipla com sazonalidade cíclica (sin/cos), dummies de fase, multicolinearidade discutida.
- Comparação OLS vs. Random Forest vs. XGBoost com `TimeSeriesSplit` e feature importance.
- Score de risco 0–100 com validação histórica e otimização de threshold por F1.

---

### Critério 4 — Qualidade Visual e Texto Analítico | **9,5/10**

| Subcritério | Avaliação |
|---|---|
| Quantidade de visualizações | Mais de 12 figuras, cobrindo séries temporais, boxplots, mapas de correlação, scatter de regressão, comparação de modelos, projeções de score. |
| Qualidade das interpretações | Alta. Cada figura tem um bloco de texto que vai além do gráfico: explica o mecanismo físico, reconcilia resultados aparentemente contraditórios entre seções, e conecta ao impacto nas personas. |
| Conexão com tomada de decisão | Excelente. A Seção 9.1 entrega recomendações específicas por nível de risco (Verde/Amarelo/Laranja/Vermelho) e por persona, derivadas diretamente dos achados analíticos. |
| Texto final (Seção 9.3) | Muito bom. Sumariza os achados com números específicos, explicita limitações de forma honesta e conecta ao Global Solution com clareza. |

**O que impede 10/10:** algumas figuras geradas como saída de células de código (`fig_ml_comparativo.png`, `fig_feature_importance.png`) aparecem como arquivos não commitados no repositório — indicando que o notebook pode estar com algumas células não reexecutadas. Um notebook limpo (Kernel → Restart & Run All) que gera todas as figuras de forma reproduzível seria o estado esperado para entrega final.

---

## Resumo Executivo

O S.ENSO é uma das entregas técnicas mais completas que um avaliador FIAP encontrará neste semestre. O projeto vai da coleta de 7 fontes de dados heterogêneas até um score de risco municipal calibrado e validado historicamente, passando por todas as etapas do rubric com rigor metodológico consistente. Os textos analíticos demonstram que o autor compreende o fenômeno físico além da técnica estatística — e isso é raro. Para atingir nota 10, o caminho é curto: corrigir a especificação da regressão AMM (já identificada no próprio notebook), calibrar os pesos do score via dados, e garantir a reexecução limpa e reproduzível de todas as células antes da entrega.
