import numpy as np, os, sys, getopt, hddm

# create some paths
file_name = str(sys.argv[1])
output_file_name = str(sys.argv[2])
path_to_data = os.path.join("../../data/input_data", file_name)

# load data
data = hddm.load_csv(path_to_data)

# process data for fitting hddm
data = data.dropna(subset=['rt'])
data = data.rename(columns={'trial.type': 'trial_type'})
data['subj_idx'] = data.subid
data['response'] = data.response_numeric
data = hddm.utils.flip_errors(data)
data = data.dropna()
print("There are this many subs in dataset: ", len(data.subid.unique()))

# fit model
n_samples = int(sys.argv[3])
n_burn = int(sys.argv[4])
db_name = output_file_name.replace(".csv", ".db")
db_path = os.path.join("../../models", db_name)

m = hddm.HDDMRegressor(data,
                       ["v ~ C(trial_type, Treatment(reference='positive'))",
                           "a ~ C(trial_type, Treatment(reference='positive'))",
                           "z ~ C(trial_type, Treatment(reference='positive'))"],
                           p_outlier=0.05,
                           include='z')
m.find_starting_values()
m.sample(n_samples, burn=n_burn, dbname=db_path, db='pickle')

# save model traces
path_to_output = os.path.join("../../data/raw_chains/", output_file_name)
m.get_traces().to_csv(path_to_output)
