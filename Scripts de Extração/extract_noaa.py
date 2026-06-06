import pandas as pd

url = "https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/ensostuff/detrend.nino34.ascii.txt"
df = pd.read_csv(url, sep=r'\s+')
df.to_csv("nino34.csv", index=False)
print(f"Salvo! {len(df)} linhas")