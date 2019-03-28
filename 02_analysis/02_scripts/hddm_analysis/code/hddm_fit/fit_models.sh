#!/usr/bin/env bash

# fit all three models running simultaneously
# args: python script, input data, output file name, n samples, n burn-in

#python fit_hddm.py neginhib_adult_hddm_e1.csv neginhib-mcmc-pinned-ndt-e1.csv 3000 300
#python fit_hddm.py neginhib_adult_hddm_replication.csv neginhib-mcmc-pinned-ndt-replication.csv 3000 300
python fit_hddm.py neginhib_adult_hddm_replication_filtered.csv neginhib-mcmc-pinned-ndt-replication-filtered.csv 3000 300
