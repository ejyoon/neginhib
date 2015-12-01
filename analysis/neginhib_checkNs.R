##AEN generic-or
rm(list=ls())

#Load libraries
library(reshape2)
library(bootstrap)
library(dplyr)
library(ggplot2)
library(rjson)
library(readr)
library(tidyr)
library(lattice)

## number of unique subs
n.unique <- function (x) {
  length(unique(x))
}

#CDM data
#Kid data
d <- read.csv("../long_data/long_data_cdm.csv")

#Demographics
demo <- read.csv("../long_data/Neginhib_demo_CDM.csv")
aggregate(subid ~ agegroup, demo, n.unique)
demo <- filter(demo, english > 50)
aggregate(subid ~ agegroup, demo, n.unique)

ages <- select(demo, subid, agegroup)

d <- merge(d, ages)
aggregate(subid ~ agegroup, d, n.unique)

#remove kids who didn't play all three games
reject <- d %>%
  group_by(subid, game) %>%
  summarise(ntrials = n()) %>%
  spread(game, ntrials) %>% 
  filter(is.na(implicature) | is.na(inhibition) | is.na(negation))

for (i in reject$subid) {
  d <- filter(d, subid !=i)
}

aggregate(subid ~ agegroup, d, n.unique)
