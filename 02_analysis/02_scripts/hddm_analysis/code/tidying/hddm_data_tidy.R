library(tidyverse); library(magrittr)

d <- read_csv("../../../../long_data/long_data_mturk.csv")

d %<>% 
  mutate(response_numeric = ifelse(response == "Y", 1, 0),
         rt = rt / 1000) %>% 
  filter(rt > 0.05, rt <= 10)

write_csv(d, "../../data/raw_data/neginhib_adult_hddm.csv")