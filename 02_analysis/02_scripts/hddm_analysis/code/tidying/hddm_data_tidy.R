## This script reformats neginhib data so it can 
# be used with HDDM python module

## Libraries
hddm_read_path <- "02_analysis/02_scripts/hddm_analysis"
data_path <- "02_analysis/01_data/"
hddm_save_path <- "data/input_data"
library(here); library(tidyverse)
source(here(hddm_read_path, "code/hddm_helpers.R"))

## Globals
min_trials_cut <- 200
max_trials_cut <- 408
min_rt <- 0.2 # sec
max_rt <- 10 # sec

# CDM Kid Experiment ------------------------------------------------------
d_cdm <- read_csv(here(data_path, "01_before_reg/long_data_cdm.csv"))

check_n_ss(d_cdm) # how many ss (start with 90)

# RT trimming: +/- 3 SD from mean RT
# Also stores output of filter for later analysis and the paper
d_cdm <- process_rts(d_cdm) # some preprocessing of RT data
d_cdm_filt <- trim_rts(d_cdm, min_rt, max_rt, save_filters = T, 
                       save_path = here(read_path, save_path, 
                                        "filtering_output/neginhib-e1-rt-filters.csv"))
# remove kids who we don't have data for all trial types
sub_whitelist <- d_cdm_filt %>%
  group_by(subid, trial.type) %>%
  summarise(ntrials = n()) %>%
  spread(trial.type, ntrials) %>% 
  drop_na() %>% 
  pull(subid)

d_cdm_filt <- d_cdm_filt %>% filter(subid %in% sub_whitelist)
check_n_ss(d_cdm_filt) # how many ss (should be 66)

write_csv(d_cdm_filt, here(read_path, save_path, "neginhib_cdm_hddm_e1.csv"))

# Adult experiment 1 ------------------------------------------------------
d <- read_csv(here(data_path, "01_before_reg/long_data_mturk.csv"))

d %>% filter(subid != 50) -> d ## for some reason this subject only had one games worth of data

check_n_ss(d) # how many ss (start with 49)
process_rts(d) -> d # some preprocessing of RT data

# RT trimming: +/- 3 SD from mean RT
# Also stores output of filter for later analysis and the paper
trim_rts(d, min_rt, max_rt, save_filters = T, 
         save_path = here(read_path, save_path, 
                          "filtering_output/neginhib-e1-rt-filters.csv")) -> d_e1_filt

write_csv(d_e1_filt, here(read_path, save_path, "neginhib_adult_hddm_e1.csv"))

# Adult replication ------------------------------------------------------

d_rep <- read_csv(here(data_path, "02_replication/long_data_neginhib_replication.csv"))

check_n_ss(d_rep)            # how many ss (start with 80)
process_rts(d_rep) -> d_rep  # RT trimming

trim_rts(d_rep, min_rt, max_rt, save_filters = T, 
         save_path = here(read_path, save_path, 
                          "filtering_output/neginhib-rep-rt-filters.csv")) -> d_rep_filt

# check that we didn't lose any subjects with rt filter (should be TRUE)
check_n_ss(d_rep_filt) == check_n_ss(d_rep_filt) 

# Remove participants with fewer than 200 trials
filter_trial_range(d_rep_filt, min_trials_cut, max_trials_cut, 
                   save_filters = T, 
                   save_path = here(read_path, save_path, 
                                    "filtering_output/neginhib-rep-ss-filters.csv")) -> d_rep_filt

# how many ss? (should be 74 ss, so 6 removed by number of trials filter)
check_n_ss(d_rep_filt)
write_csv(d_rep_filt, here(read_path, save_path,
                           "neginhib_adult_hddm_replication.csv"))

############## REPLICATION ACCURACY FILTER ---------------------------------

# remove participants who scored below P accuracy on any game
filter_low_acc(d_rep_filt, min_acc = 0.6, save_output = T, 
               save_path = here(read_path, save_path,
                                "filtering_output/neginhib-rep-acc-filters.csv")) -> d_rep_final

# how many ss in final dataset (should be 59)
check_n_ss(d_rep_final)
d_rep_final %>% 
  write_csv(here(read_path, save_path, 
                 "neginhib_adult_hddm_replication_filtered.csv"))
