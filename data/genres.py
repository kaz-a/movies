import pandas as pd

filename = 'movies.csv'
df = pd.read_csv(filename)

print(df['genre'].value_counts())
# Comedy                44
# Drama                 42
# Animation             29
# Action / Adventure    29
# Horror                21
# Thriller              18
# Action                17
# Sci-Fi Action          9
# Fantasy                7
# Comedy / Drama         7
# Sci-Fi                 6
# Romantic Comedy        5
# Family                 5
# Action Drama           5
# Sci-Fi Adventure       4
# Crime Drama            4
# Action Comedy          4
# Musical                4
# Sports Drama           4
# Romance                4
# Horror Comedy          4
# Adventure              3
# Action Thriller        2
# Sci-Fi Thriller        2
# Western                2
# Family Adventure       2
# Family Comedy          2
# Drama / Thriller       1
# Sci-Fi Fantasy         1
# Romantic Thriller      1
# War                    1
# War Drama              1
# Horror Thriller        1
# Period Action          1
# Action Horror          1
# Music Drama            1
# Fantasy Drama          1
# Concert                1
# Western Comedy         1
# Historical Epic        1
# Comedy Thriller        1
# Action Fantasy         1

print(df['studio'].value_counts())
# Uni.       43
# Fox        41
# WB         34
# BV         31
# Par.       27
# Sony       26
# WB (NL)    17
# LGF        13
# LG/S       10
# SGem        8
# Focus       8
# Wein.       8
# Rela.       7
# TriS        6
# ORF         5
# FoxS        5
# A24         3
# STX         3
# Free        1
# IFC         1
# RAtt.       1
# BG          1
# W/Dim.      1



