#!/usr/bin/env python
# coding: utf-8

# Necessary libraries
import os
import sys
import csv
import math
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func
from pprint import pprint
import numpy as np
import datetime as dt
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float 
import pymysql
import json
pymysql.install_as_MySQLdb()

engine = create_engine('sqlite:///p3.db', echo=False)

engine.execute("SELECT * FROM info_by_year_state").fetchall()

db_df = pd.read_sql('info_by_year_state', con=engine)

db_df.rename(index=str, columns={"level_0": "Year"},inplace=True)

db_df.rename(index=str, columns={"level_1": "State"},inplace=True)

db_df_ys = db_df.set_index(['Year', 'State'], inplace=False)

DB_dict = {}

import json
db_df_ys_dict = db_df_ys.to_dict('index')
for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1] = {}
    
for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1][key2] = {}
    
for (key1,key2) in db_df_ys_dict.keys():
    DB_dict[key1][key2] = db_df_ys_dict[(key1,key2)]

