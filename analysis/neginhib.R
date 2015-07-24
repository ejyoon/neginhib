##AEN generic-or
rm(list=ls())

#Load libraries
library(reshape2)
library(bootstrap)
library(dplyr)
library(ggplot2)
library(rjson)

##functions
# for bootstrapping 95% confidence intervals
theta <- function(x,xdata) {mean(xdata[x])}
ci.low <- function(x) {
  quantile(bootstrap(1:length(x),1000,theta,x)$thetastar,.025)}
ci.high <- function(x) {
  quantile(bootstrap(1:length(x),1000,theta,x)$thetastar,.975)}


## add some style elements for ggplot2
plot.style <- theme_bw() + theme(panel.grid.minor=element_blank(), panel.grid.major=element_blank(), legend.position="right", axis.line = element_line(colour="black",size=.5), axis.ticks = element_line(size=.5), axis.title.x = element_text(vjust=-.5), axis.title.y = element_text(angle=90,vjust=0.25))


# ##Load in data
# turk demo data
# path <- "~/Documents/Work/Research/Negation/neginhib/data/adults_mturk/production-results/"
# files <- dir(path)
# 
# demo <- as.data.frame(matrix(ncol = 4, nrow = 0))
# names(demo) <- c("subid", "age", "gender", "language")
# 
# for (f in files) {
#   this.file <- fromJSON( file = paste(path, f, sep="") )
#   subid <- this.file$WorkerId
#   age <- this.file$answers$data$age
#   gender <- this.file$answers$data$gender
#   language <- this.file$answers$data$nativeLanguage
#   tmp <- cbind(subid, age, gender, language)
#   demo <- rbind(demo, tmp)  
# }
# 
# #csv data
# path <- "~/Documents/Work/Research/Negation/neginhib/data/adults_mturk/"
# files <- dir(path)
# 
# d <- data.frame()
# 
# for (f in files) {
#   this.file <- read.csv(paste(path, f, sep=""), header=FALSE)
#   names(this.file) <- c("subid","list","game.order","trial.num","word","leftpic","rightpic","game","trial.type","leftpic.type","rightpic.type","side.chosen","pic.chosen","response","date","timestamp","rt")
#   d <- rbind(d, this.file)  
# }
# 
# #merge data
# d <- merge(d, demo)
# 
# #anonymize subid
# d$subid <- as.factor(as.numeric(as.factor(d$subid)))


d <- read.csv("~/Documents/Work/Research/Negation/neginhib/long_data/long_data_mturk.csv")

##Prep data
d$correct <- as.numeric(as.character(factor(d$response, levels=c("Y","N"), labels=c("1","0"))))
d$trial.type <- factor(d$trial.type, levels=c("control","inhib","unambiguous","implicature","positive","negative"))

####Correct
#Plot data
ms <- d %>%
  group_by(game, trial.type, subid) %>%
  summarise(m = mean(correct)) %>%
  group_by(game, trial.type) %>%
  summarise(cih = ci.high(m),
            cil = ci.low(m),
            m = mean(m)) 

qplot(data=ms, x=trial.type, y=m, fill=game,
      stat="identity", position="dodge", geom="bar") + 
  geom_errorbar(aes(ymin=cil, ymax=cih), 
                position=position_dodge(.9), width=0) + 
  ylab("Prop correct") + xlab("Trial Type") +
  plot.style

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
  group_by(game, trial.type, subid) %>%
  summarise(m = mean(rt)) %>%
  group_by(game, trial.type) %>%
  summarise(cih = ci.high(m),
            cil = ci.low(m),
            m = mean(m)) 

qplot(data=ms, x=trial.type, y=m, fill=game,
      stat="identity", position="dodge", geom="bar") + 
  geom_errorbar(aes(ymin=cil, ymax=cih), 
                position=position_dodge(.9), width=0) + 
  ylab("Reaction time") + xlab("Trial Type") +
  plot.style

