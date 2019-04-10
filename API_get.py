#  I'm going to make this one big function that is called to update the sqlite database from 
#  a route in app.py

#  import statements
import pandas as pd
import requests
import json
from sqlalchemy import create_engine
from config import BEA_GDP_url
from config import BEA_pop_url
# REPLACE 'WILDCARD' with 51, 52, 53

# JSON for per year change over year/state, empty at start, need to run updateDB to get values
yearly_change_dict_states = {}
yearly_change_dict_regions = {}
DB_dict = {}
DB_r_dict = {}

# BEA_GDP: 
# note that value in millions of 2012 dollars
# index for alabama starts at 21
skipCountry = 21
# dict structure {'BEAAPI': {'Results': 'Data': [21:]}}
# within that we want {'GeoName', 'TimePeriod', 'DataValue'}

# BEA_pop with WILDCARD = 51, same dict structure, same values wanted (51 is for personal disposable income)
# stored as millions of dollars (not necessarily 2012 dollars?)
# after checking, all 51, 52, 53 have same required structure, noting here that 52 is population (persons) and 53 is
# personal disposable income per capita (53 in dollars, not millions)

raw_GDP_dict = requests.get(BEA_GDP_url).json()
raw_pop_dict_list = []
for i in ['51', '52', '53']:
    BEA_pop_temp_url = BEA_pop_url.replace('WILDCARD', i)
    raw_pop_dict_list.append(requests.get(BEA_pop_temp_url).json())
    # now index 0 refers to 51, 1 to 52, 2 to 53
# Going to store as {'$YEAR$' : '$STATE$' : {keys-values}}

DB_dict = {}

# make a list of the regions to set them in another table
regions = [
    'NewEngland', 'Mideast', 'GreatLakes', 'Plains', 'Southeast', 'Southwest', 'RockyMountain', 'FarWest'
]
# first set the $YEAR$ keys
for y in range(1997, 2018):
    DB_dict[y] = {}
# stored $YEAR$ as integer key for dictionary
# next set state keys and other values
for data_d in raw_GDP_dict['BEAAPI']['Results']['Data'][skipCountry:]:
# fixing up data format
    dataVal = data_d['DataValue'].split(',')
    dataVal = ''.join(dataVal)
    geoName = data_d['GeoName']
    geoName = ''.join([c for c in geoName if c.isalpha()])
    DB_dict[int(data_d['TimePeriod'])][geoName] = {}
    DB_dict[int(data_d['TimePeriod'])][geoName]['GDP (millions of dollars)'] = float(dataVal)
    # now DB_dict[$YEAR$][$STATE$]['GDP'] = $GDP$ in millions
    # also now the year/state is typed as a dictionary, so the first line in the for loop
    #   is no longer required (in the next 3 dictionaries)
categories = ['Personal Disposable Income (millions of dollars)', 'Population (persons)', 'Personal Disposable Income per capita (dollars)']
category = -1
for pop_dict in raw_pop_dict_list:
    category += 1
    for data_d in pop_dict['BEAAPI']['Results']['Data'][skipCountry:]:
    # fixing up the data format
        dataVal = data_d['DataValue'].split(',')
        dataVal = ''.join(dataVal)
        geoName = data_d['GeoName']
        geoName = ''.join([c for c in geoName if c.isalpha()])
        DB_dict[int(data_d['TimePeriod'])][geoName][categories[category]] = float(dataVal)
# now DB_dict[$YEAR$][$STATE$] has GDP, $categories$ keys and stored values as floats

# DB_dict now has the desired structure

# Split DB_dict into state_dict and region_dict
state_dict = {}
region_dict = {}
for year in list(DB_dict.keys()):
    state_dict[year] = {}
    region_dict[year] = {}
    for key in list(DB_dict[year].keys()):
        if key in regions:
            region_dict[year][key] = DB_dict[year][key]
        else:
            state_dict[year][key] = DB_dict[year][key]


# update yearly_change_dict using DB_dict
# updating the structure of y_c_d to be similar to DB_dict
yearly_change_dict = {}
years = list(DB_dict.keys())
for i in range(len(years)):
    yearly_change_dict[years[i]] = {}
    states = list(DB_dict[years[i]].keys())
    for state in states:
        if (i > 0):
            yearly_change_dict[years[i]][state] = {
                'GDP Change': DB_dict[years[i]][state]['GDP (millions of dollars)'] - DB_dict[years[i - 1]][state]['GDP (millions of dollars)'],
                'Personal Dist Income Change': DB_dict[years[i]][state][categories[0]] - DB_dict[years[i - 1]][state][categories[0]],
                'Population Change': DB_dict[years[i]][state][categories[1]] - DB_dict[years[i - 1]][state][categories[1]],
                'Personal Dist Income Per Capita Change': DB_dict[years[i]][state][categories[2]] - DB_dict[years[i - 1]][state][categories[2]]
            }
            # if this is the first year, change should be = entry
        else:
            yearly_change_dict[years[i]][state] = {
                'GDP Change': 0,
                'Personal Dist Income Change': 0,
                'Population Change': 0,
                'Personal Dist Income Per Capita Change': 0
            }

# split yearly_change_dict into _regions, _states
for year in years:
    yearly_change_dict_regions[year] = {}
    yearly_change_dict_states[year] = {}
    for key in list(yearly_change_dict[year].keys()):
        if key in regions:
            yearly_change_dict_regions[year][key] = yearly_change_dict[year][key]
        else:
            yearly_change_dict_states[year][key] = yearly_change_dict[year][key]

# put the changes into the dictionary for DB_DF, DB_regions_DF
# final_state_dict,final_region_dict
final_state_dict = {}
final_region_dict = {}
for year in years:
    final_state_dict[year] = {}
    final_region_dict[year] = {}
    for key in list(state_dict[year].keys()):
        final_state_dict[year][key] = state_dict[year][key]
    for key in list(region_dict[year].keys()):
        final_region_dict[year][key] = region_dict[year][key]
    for key in list(yearly_change_dict_states[year].keys()):
        final_state_dict[year][key].update(yearly_change_dict_states[year][key])
    for key in list(yearly_change_dict_regions[year].keys()):
        final_region_dict[year][key].update(yearly_change_dict_regions[year][key])

# create a DataFrame object using DB_dict
# multi-indexed

DB_DF = pd.DataFrame.from_dict({(i,j): final_state_dict[i][j] for i in final_state_dict.keys() for j in final_state_dict[i].keys()}, orient = 'index')
DB_regions_DF = pd.DataFrame.from_dict({(i,j): final_region_dict[i][j] for i in final_region_dict.keys() for j in final_region_dict[i].keys()}, orient = 'index')


# next create/update the sqlite database
engine = create_engine('sqlite:///p3.db', echo = False)
conn = engine.connect()

DB_DF.to_sql(name = 'info_by_year_state', con = conn, if_exists = 'replace')
DB_regions_DF.to_sql(name = 'info_by_year_region', con = conn, if_exists = 'replace')

#engine = create_engine('sqlite:///p3.db', echo=False)
#conn = engine.connect()

#engine.execute("SELECT * FROM info_by_year_state").fetchall()

db_df = pd.read_sql('info_by_year_state', con = conn)
db_r_df = pd.read_sql('info_by_year_region', con = conn)

db_df.rename(index=str, columns={"level_0": "Year"},inplace=True)
db_r_df.rename(index=str, columns={"level_0": "Year"},inplace=True)

db_df.rename(index=str, columns={"level_1": "State"},inplace=True)
db_r_df.rename(index=str, columns={"level_1": "Region"},inplace=True)

db_df_ys = db_df.set_index(['Year', 'State'], inplace=False)
db_df_yr = db_r_df.set_index(['Year', 'Region'], inplace=False)

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
conn.close()





