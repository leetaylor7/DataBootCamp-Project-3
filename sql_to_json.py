#!/usr/bin/env python
# coding: utf-8

# Necessary libraries
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import pymysql
#pymysql.install_as_MySQLdb()

engine = create_engine('sqlite:///p3.db', echo=False)
conn = engine.connect()

#engine.execute("SELECT * FROM info_by_year_state").fetchall()

db_df = pd.read_sql('info_by_year_state', con = conn)
db_r_df = pd.read_sql('info_by_year_region', con = conn)

db_df.rename(index=str, columns={"level_0": "Year"},inplace=True)
db_r_df.rename(index=str, columns={"level_0": "Year"},inplace=True)

db_df.rename(index=str, columns={"level_1": "State"},inplace=True)
db_r_df.rename(index=str, columns={"level_1": "Region"},inplace=True)

db_df_ys = db_df.set_index(['Year', 'State'], inplace=False)
db_df_yr = db_df.set_index(['Year', 'Region'], inplace=False)

DB_dict = {}
DB_r_dict = {}

db_df_ys_dict = db_df_ys.to_dict('index')
db_df_yr_dict = db_df_yr.to_dict('index')

for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1] = {}
for (key1,key2) in db_df_yr_dict.keys():
    DB_r_dict[key1] = {}
    
for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1][key2] = {}
for (key1,key2) in db_df_yr_dict.keys():
    DB_r_dict[key1][key2] = {}
    
for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1][key2] = db_df_ys_dict[(key1,key2)]
for (key1,key2) in db_df_yr_dict.keys():
    DB_r_dict[key1][key2] = db_df_yr_dict[(key1,key2)]

