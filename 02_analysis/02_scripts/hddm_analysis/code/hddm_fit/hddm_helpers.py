"""
Module for extracting group and individual
parameter values from fitted HDDM object
"""
import pandas as pd

def model_to_df(model, param_list):
    """
    Extract posterior samples for particular parameters
    from an hddm model object and return as pandas dataframe
    """
    node_names = []
    samples = []

    for node in model.nodes_db.node[param_list]:
        node_names.append(str(node))
        samples.append(node.trace())

    return pd.DataFrame(dict(zip(node_names, samples)))

def extract_subject_traces(model, n_subs, param_type):
    """
    Extract individual participant's 
    posterior samples for particular parameters
    from an hddm model object and return as pandas dataframe
    """
    sub_traces = []
    sub_numbers = []
    for sub_num in range(1, n_subs):
        sub_index = param_type + "_subj." + str(sub_num)
        sub_numbers.append(sub_index)
        sub_traces.append(model.nodes_db.node[sub_index].trace())
    return pd.DataFrame(dict(zip(sub_numbers, sub_traces)))


