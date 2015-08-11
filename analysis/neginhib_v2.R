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

##functions
# for bootstrapping 95% confidence intervals
theta <- function(x,xdata) {mean(xdata[x])}
ci.low <- function(x) {
  quantile(bootstrap(1:length(x),1000,theta,x)$thetastar,.025)}
ci.high <- function(x) {
  quantile(bootstrap(1:length(x),1000,theta,x)$thetastar,.975)}


## add some style elements for ggplot2
plot.style <- theme_bw() + theme(panel.grid.minor=element_blank(), panel.grid.major=element_blank(), legend.position="right", axis.line = element_line(colour="black",size=.5), axis.ticks = element_line(size=.5), axis.title.x = element_text(vjust=-.5), axis.title.y = element_text(angle=90,vjust=0.25))

## number of unique subs
n.unique <- function (x) {
  length(unique(x))
}


d <- read_csv('../long_data/long_data_mturk2.csv')

##Prep data
d$correct <- as.numeric(as.character(factor(d$response, levels=c("Y","N"), labels=c("1","0"))))==1
d$trial.type <- factor(d$trial.type, levels=c("control","inhib","unambiguous","implicature","positive","negative"))

d$game2 <- as.character(d$game)
d[d$trial.type == "unambiguous" | d$trial.type == "implicature",]$game2 <- "implicature"
d[d$trial.type == "positive" | d$trial.type == "negative",]$game2 <- "negation"
d$game2 <- factor(d$game2, levels=c("inhibition","implicature","negation"))

d$trial.crit <- factor(d$trial.type %in% c("inhib","implicature","negative"), 
                       levels = c(FALSE, TRUE), 
                       labels = c("control","critical"))

##Reject participants who got <80% correct
d <- d %>%
  group_by(subid) %>%
  mutate(prop.correct = mean(correct)) %>%
  filter(prop.correct >= .8)

####Correct
#Plot data
ms <- d %>%
  group_by(game2, trial.crit, subid) %>%
  summarise(m = mean(correct)) %>%
  group_by(game2, trial.crit) %>%
  summarise(cih = ci.high(m),
            cil = ci.low(m),
            m = mean(m)) 

qplot(data=ms, x=game2, y=m, fill=trial.crit,
      stat="identity", position="dodge", geom="bar") + 
  geom_errorbar(aes(ymin=cil, ymax=cih), 
                position=position_dodge(.9), width=0) + 
  ylab("Prop correct") + xlab("Trial Type") +
  plot.style

##### trial-by-trial for the reaction times
qplot(trial.num, rt, 
      col = correct,
      lty = correct,
      facets = trial.crit ~ game,
      data=filter(d, rt < 3000)) +
  geom_smooth(size = 2, col = "black", 
              method = "lm", 
              formula = y ~ log(x)) + 
  ylim(c(0,3000)) + 
  theme_bw()

#### trial by trial for the accuracies
ms <- d %>%
  mutate(trial.num = round(trial.num / 10) * 10) %>%
  group_by(trial.num, trial.crit, game) %>%
  summarise(correct = mean(correct))
    
qplot(trial.num, correct, 
      facets = trial.crit ~ game,
      data=ms) +
  geom_smooth(size = 2, col = "black") + 
  ylim(c(0,1)) +
  theme_bw()



####Reaction time
#Only correct trials
dc <- filter(d, correct==1)

#log transform
#LogRT

#remove negative RTs...(why/how did this happen??)
dc <- dc[dc$rt >= 0,]

qplot(data=dc, x=rt, geom="histogram")
dc$log.rt<-log(dc$rt)
qplot(data=dc, x=log.rt, geom="histogram")

#trim outliers outside 3 standard deviations of the log mean
lrt <- dc$log.rt
dct <- dc[lrt < mean(lrt) + 3*sd(lrt) & lrt > mean(lrt) - 3*sd(lrt),]

qplot(data=dct, x=rt, geom = "histogram")
qplot(data=dct, x=log.rt, geom = "histogram")

#Plot data
ms <- dct %>%
  group_by(game2, trial.crit, subid) %>%
  summarise(m = mean(rt)) %>%
  group_by(game2, trial.crit) %>%
  summarise(cih = ci.high(m),
            cil = ci.low(m),
            m = mean(m)) 

qplot(data=ms, x=game2, y=m, fill=trial.crit,
      stat="identity", position="dodge", geom="bar") + 
  geom_errorbar(aes(ymin=cil, ymax=cih), 
                position=position_dodge(.9), width=0) + 
  ylab("Reaction time") + xlab("Trial Type") +
  plot.style


###### INDIVIDUAL DIFFERENCES ######
mss.rt <- dct %>%
  group_by(subid, game2, trial.crit) %>%
  summarise(rt = mean(rt)) %>%
  spread(trial.crit, rt) %>%
  mutate(ratio = (critical - control) / (critical + control)) %>%
  select(-control, -critical) %>%
  spread(game2, ratio)

mss.acc <- d %>%
  group_by(subid, game2, trial.crit) %>%
  summarise(correct = mean(correct)) %>%
  spread(trial.crit, correct) %>%
  mutate(ratio = (critical - control) / (critical + control)) %>%
  select(-control, -critical) %>%
  spread(game2, ratio)

splom(mss.rt[,2:4])
splom(mss.acc[,2:4])

qplot(implicature, inhibition, data=mss.rt) + 
  geom_smooth(method="lm") + 
  theme_bw() 

qplot(implicature, negation, data=mss.rt) + 
  geom_smooth(method="lm") + 
  theme_bw() 

qplot(negation, inhibition, data=mss.rt) + 
  geom_smooth(method="lm") + 
  theme_bw() 



qplot(implicature, inhibition, data=mss.acc) + 
  geom_smooth(method="lm") + 
  theme_bw() 
cor.test(mss.acc$implicature, mss.rt$inhibition)

qplot(implicature, negation, data=mss.acc) + 
  geom_smooth(method="lm") + 
  theme_bw() 

qplot(negation, inhibition, data=mss.acc) + 
  geom_smooth(method="lm") + 
  theme_bw() 



