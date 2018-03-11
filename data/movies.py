import pandas as pd

filename = 'Copy of movies.csv'
df = pd.read_csv(filename)

df['Total Gross'] = df['Total Gross'].str.replace(r'$', '')
df['Total Gross'] = df['Total Gross'].str.replace(r',', '')
df['Total Gross'] = df['Total Gross'].str.replace(r' ', '')
pd.to_numeric(df['Total Gross'])

df['Opening Gross'] = df['Opening Gross'].str.replace(r'$', '')
df['Opening Gross'] = df['Opening Gross'].str.replace(r',', '')
df['Opening Gross'] = df['Opening Gross'].str.replace(r' ', '')
pd.to_numeric(df['Opening Gross'])

col_headers = list(df)

new_colheaders = []

for header in col_headers:
  header = header.lower()
  if ' ' in header:
    header = header.replace(' ', '_')
  new_colheaders.append(header)

print(df)
df.to_csv('movies.csv', header=new_colheaders)


def save_file(col_name, file_name):
  df = pd.read_csv('movies.csv')
  if col_name == 'open_date':
    df[col_name] = pd.to_datetime(df[col_name])
  
  total_by = df.groupby(col_name)['total_gross'].sum().reset_index()
  opening_by = df.groupby(col_name)['opening_gross'].sum().reset_index()
  data = pd.merge(total_by, opening_by, on=col_name)
  data.sort_values(by=col_name)
  if 'open_date' in data:
    data['open_date'] = data['open_date'].dt.strftime('%-m/%-d/%y')
  print(data)

  data.to_csv(file_name + '.csv')

save_file('open_date', 'gross_by_date')
save_file('genre', 'gross_by_genre')
save_file('studio', 'gross_by_studio')

