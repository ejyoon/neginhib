library(magrittr); library(feather); library(ggridges); 
library(ggthemes); library(tidyverse)

theme_set(
  theme_minimal() + theme(panel.border = element_rect(size = 1, color = "grey", fill = NA))
          ) 

process_condition_name <- function(cond_name, condition_vect, df_type = "within") {
  if (df_type == "within") {
    param_type <- str_split(cond_name, "_", simplify = T) %>% .[1]
    cond_idx <- str_remove(cond_name, pattern = "reference='positive'") %>% str_which(pattern = condition_vect)
    new_cond_name <- condition_vect[cond_idx]
    if(is_empty(new_cond_name)) {cond_name} else {str_c(param_type, new_cond_name, sep = "_")}
  } else if (df_type == "between") {
    param_type <- str_split(cond_name, "\\(", simplify = T)[1]
    cond_idx <- str_which(cond_name, pattern = condition_vect)
    new_cond_name <- condition_vect[cond_idx]
    if(is_empty(new_cond_name)) {cond_name} else {str_c(param_type, new_cond_name, sep = "_")}
  } else {
    "Unrecognized df_type. Please indicated if paramters were estimated within or between subjects."
  }
}


plot_hddm_ss <- function(df, param) {
  var <- quo(param_type == !! param)
  message(var)
  df %>% 
    filter(param_level == "individual", statistic == "map") %>% 
    filter(!! var) %>% 
    group_by(subid, param_type, condition) %>% 
    summarise(m = mean(estimate),
              lower = quantile(estimate, probs = 0.025),
              upper = quantile(estimate, probs = 0.975)) %>% 
    ggplot(aes(x = fct_reorder(subid, .x = m), y = m)) +
    geom_pointrange(aes(ymin = lower, ymax = upper),
                    position = position_dodge(width = 0.1)) +
    geom_hline(yintercept = 0, lty = "dashed") +
    coord_flip() +
    labs(x = "participant", y = "parameter value") +
    facet_wrap(~param_type, ncol = 3, scales = "free_y")
}


## takes data frame and returns same shape data frame with relevant information 
## about RTs and converts response to a numeric variable
process_rts <- function(df) {
  df %>% mutate(response_numeric = ifelse(response == "Y", 1, 0),
                rt = rt / 1000,
                log_rt = log(rt))
}

# RT trimming: Planned analysis: -trim decisions < 200 ms from word onsent, > 10s after offset
# +/- 3SDs in log space

trim_rts <- function(df, min_rt, max_rt, save_filters = T, save_path) {
  
  if (save_filters) {
    df %>% filter(rt <= min_rt | rt >= max_rt) -> d_removed_trials
    
    df %>% 
      filter(rt >= min_rt & rt <= max_rt) %>% 
      mutate(m_log_rt = mean(log_rt, na.rm = T),
             sd_log_rt = sd(log_rt, na.rm = T)) -> df
    
    df %>%
      filter(log_rt > m_log_rt + 3 * sd_log_rt |  log_rt < m_log_rt - 3 * sd_log_rt) %>%
      bind_rows(d_removed_trials) %>%
      mutate(reason_removed = "bad_rt") %>%
      distinct() -> d_removed_trials # remove any duplicates

    
    write_csv(d_removed_trials, path = save_path)
  }
  
  # actual filtering step
  df %>%
    filter(rt >= min_rt & rt <= max_rt) %>%
    filter(log_rt < m_log_rt + 3 * sd_log_rt & log_rt > m_log_rt - 3 * sd_log_rt)
}


check_n_ss <- function(d) {
  d$subid %>% unique() %>% length()
}


# Remove participants with fewer than 200 trials
filter_trial_range <- function(d, min_trials_cut, max_trials_cut, 
                               save_filters = T, save_path) {
  d %>% 
    group_by(subid) %>% 
    mutate(n_trials = n()) -> d
  
  if (save_filters) {
    d %>% filter(n_trials <= min_trials_cut | n_trials >= max_trials_cut) %>% 
      distinct(subid, n_trials) %>% 
      mutate(reason_removed = "number of trials criteria") %>% 
      write_csv(path = save_path)
    
  } 
  
  d %>% filter(n_trials >= min_trials_cut & n_trials <= max_trials_cut)
  
}


# remove participants who scored below P accuracy on any game
# uses my own check trials function
# returns a list of subids to remove based on a predefined accuracy threshold
# if they scored below that threshold for any game, they get flagged for removal

filter_low_acc <- function(d, min_acc, save_output = T, save_path) {
  
  ss_filter <- d %>% 
    group_by(subid, game, trial.type) %>% 
    summarise(m = mean(response_numeric, na.rm = T)) %>% 
    group_by(subid) %>% 
    mutate(sub_filter = check_scores(m, threshold = min_acc)) %>% 
    filter(sub_filter == "remove") %>% 
    distinct(subid, trial.type, m, sub_filter) %>% 
    mutate(reason_removed = "accuracy below threshold")
  
  if (save_output) {write_csv(ss_filter, path = save_path)}
  
  black_list <- ss_filter$subid %>% unique()
  
  d %>% filter(!(subid %in% black_list)) 
  
}

check_scores <- function(x, threshold = 0.6) {
  if ( sum(x < threshold) > 0 ) {
    "remove"
  } else {
    'keep'
  }
}
