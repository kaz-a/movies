import pandas as pd

filename = 'Copy of movies.csv'
df = pd.read_csv(filename)
# print(df)
genre_count = df.groupby('Genre').count()
print(genre_count)
studio_count = df.groupby('Studio').count()
print(studio_count)
date_count = df.groupby('Open Date').count()
print(date_count.head(n=10))