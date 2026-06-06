# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**S.ENSO** is a data-science project for FIAP's Global Solution 2026.1 (1TSCOR — Indústria Espacial). It correlates ENSO (El Niño / La Niña) oceanic signals with Brazilian municipal climate, agriculture, and disaster-decree data, then builds a risk score with 3–6 month lead time. The deliverable pair is a Jupyter notebook (statistical analysis) plus a dashboard mockup for the pitch — there is no application code or backend.

The project is written in **Portuguese**. Variable names, comments, markdown, and column headers are PT-BR. Preserve that when editing.

Two pilot municipalities anchor every analysis:
- **Quixadá-CE** (Nordeste, drought-vulnerable, target crop = milho)
- **Lajeado-RS** (Sul, flood-vulnerable, target crop = trigo)

## Environment

Python 3.13 in `.venv/`. Activate and use the project interpreter:

```powershell
.venv\Scripts\Activate.ps1            # PowerShell
.venv\Scripts\python <script>.py      # run a script directly
.venv\Scripts\jupyter lab             # open the notebook
```

Core stack (already installed in `.venv`): `pandas`, `numpy`, `scipy`, `scikit-learn`, `statsmodels`, `matplotlib`, `seaborn`, `earthaccess`, `netCDF4`, `xarray`-family (`h5netcdf`, `cftime`). There is **no `requirements.txt` and no `pyproject.toml`** — if a dependency is missing, `pip install` it into `.venv` and (optionally) freeze.

## Main artifact

`SENSO_notebook_rascunho.ipynb` — the single analytical deliverable. Structure (see `Escopo e Planos/Estrutura Notebook.md` for the rationale of each section):

1. Environment setup + imports
2. Data loading & variable description — 6 sources (ONI, fase ENSO, precipitação INMET, produção agrícola, decretos S2iD, AMM); subsections 2.1 mapping + 2.2–2.7 loading
3. Cleaning (winsorize precipitation — do **not** drop rainfall outliers; they are the signal)
4. Descriptive stats (boxplots by ENSO phase, ONI vs. precipitation time series)
5. Stratified sampling by ENSO phase (neutral years dominate ~60% — must stratify)
6. Inferential analysis: (6.1) Pearson/Spearman lag correlation 0–12 months; (6.2) Mann-Whitney El Niño forte vs. neutral; (6.3) multiple linear regression ONI+AMM+seasonality; (6.4) AMM × precipitation correlation and ONI×AMM interaction (Quixadá-CE)
7. Derivatives, integrals & rate-of-change analysis — ONI derivative as acceleration feature, precipitation integral over critical window (satisfies GS rubric "limits/derivatives" and "integrals")
8. Risk score 0–100 per município (S.ENSO score function)
9. Conclusion, practical recommendations, ODS 2/11/13 linkage

The notebook is configured to use seed `42` and `plt.rcParams['font.family'] = 'DejaVu Sans'` — keep these for reproducible figures.

## Data ingestion scripts

- `extract_noaa.py` — downloads Niño 3.4 anomalies from NOAA CPC into the **repo root** (writes `nino34.csv` next to the script, not into `data/raw/`). If you change it, point the output at `data/raw/`.

The NASA Earthdata SSH ENSO source has been dropped from the MVP; the snapshots already in `data/raw/ssh_enso/` are kept as reference but are not refreshed.

## Data layout

```
data/raw/
  oni_trimestral.csv            # NOAA CPC ONI, ;-separated, decimal=','
  tsm_nino34_mensal.csv         # NOAA CPC Niño 3.4 SST, ,-separated, decimal='.'
  amm_mensal.csv                # NOAA PSL AMM, ;-separated, decimal='.', 1948–ago/2024
  decretos_ce.csv               # S2iD emergency decrees Ceará, ;-separated
  decretos_rs.csv               # S2iD emergency decrees Rio Grande do Sul, ;-separated
  producao_agricola.csv         # IBGE/PAM table 1612, multi-header SIDRA export (skip top rows)
  INMET BDMEP/CEARA/*.CSV       # A325 Quixeramobim (2007–2026) + A369 Quixadá (2018–2026)
  INMET BDMEP/RIO GRANDE DO SUL/*.CSV  # A840 Bento Gonçalves (2006–2026) + A882 Teutônia (2012–2026)
  tna_mensal.csv                # NOAA PSL Tropical North Atlantic SST anomaly, ;-separated, decimal='.'
  tsa_mensal.csv                # NOAA PSL Tropical South Atlantic SST anomaly, ;-separated, decimal='.'
  ssh_enso/*.txt                # NASA SSH ENSO Indicator weekly snapshots (reference only, not used)
```

GPAT (Gradiente Térmico do Atlântico Tropical) = TNA − TSA. Coverage: 1948-01 to 2025-12 (936 records — 16 months beyond AMM). GPAT > 0 means warmer North Atlantic → ZCIT displaced north → less rain in NE Brazil (opposite sign to AMM). GPAT is used as the **operational** Atlantic index in the score function when AMM data is unavailable; AMM is kept for historical regression training (section 6.3) where its lag-5 correlation (r=+0.378, Quixadá) is analytically validated. GPAT best lag is 0 months (r=−0.346, Quixadá), meaning it correlates with the current month's precipitation — a different temporal structure than AMM.

Quirks confirmed against real files:
- `oni_trimestral.csv`: sep=`;`, decimal=`,`, encoding=utf-8. Already **long format** (Year, Period, ONI) — no melt needed.
- `amm_mensal.csv`: sep=`;`, decimal=`.`, encoding=utf-8. Columns: `Data;Ano;Mes;AMM`. Coverage: 1948-01 to 2024-08 (921 records). Months after Aug/2024 will be NaN when merged into the main dataset.
- `tna_mensal.csv` / `tsa_mensal.csv`: sep=`;`, decimal=`.`, encoding=utf-8. Columns: `Data;Ano;Mes;TNA` (or `TSA`). Coverage: 1948-01 to 2025-12 (936 records each). Merged into `df_gpat` with `GPAT = TNA − TSA`. Zero NaNs — 100% coverage of the analysis window.
- `producao_agricola.csv`: encoding=utf-8, 2 SIDRA header rows to skip (`skiprows=2`), then columns `Variável | Ano | Produto | Quixadá (CE) | Lajeado (RS)`.
- `decretos_ce.csv` / `decretos_rs.csv`: encoding=utf-8, sep=`;`. Date column `Data do Decreto` in `dd/mm/YYYY` format.
- INMET BDMEP CSVs: encoding=**latin-1**, sep=`;`, decimal=`,`, 8 metadata rows + 1 header row → `skiprows=8`. Col index 0 = date, col index 2 = precipitation (mm). Sentinel for missing = -9999 (treat as NaN).
- INMET strategy: **CE** — A325 Quixeramobim filtered to `year < 2018` (files available through 2026) + A369 Quixadá from `year >= 2018`; **RS** — A840 Bento Gonçalves filtered to `year < 2013` (files available through 2026) + A882 Teutônia from `year >= 2013`. A369 Quixadá starts only in mar/2018 (jan–fev ausentes).

## Reference docs (read before changing methodology)

- `Escopo e Planos/Escopo.md` — full project scope, data sources table, risk-score formula, target audiences
- `Escopo e Planos/Estrutura Notebook.md` — definitive notebook outline (9 sections)
- `Escopo e Planos/Arquitetura do notebook.md` — rationale for each step (why winsorize, why stratify, etc.)
- `Escopo e Planos/Estrutura Dashboard.txt` — the 4 dashboard screens for the pitch
- `Regras/GS Desafio.md` — FIAP rubric (the methodology choices in the notebook are pinned to specific rubric items: "correlation & association", "hypothesis tests", "regression", "limits/derivatives", "integrals" — preserve these labels)
- `Pesquisa/` — PDFs/DOCX with the El Niño 2026 numbers cited in the notebook intro (do not modify; treat as source material)
- `Links para dados.txt` — current data-source URLs

## Conventions

- The notebook hardcodes the analysis window and the two pilot municipalities. When asked to "add another município", expect to touch loading, stratification, regression, and the risk-score function together.
- ENSO phase classification uses 7 buckets (La Niña forte/fraca, Neutro, El Niño fraco/moderado/forte, Super El Niño) — keep this taxonomy when grouping.
- The risk-score output is a 0–100 number mapped to **Verde / Amarelo / Laranja / Vermelho**. Don't introduce a 5th level without updating the dashboard mock too.
