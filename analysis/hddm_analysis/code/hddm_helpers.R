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
    geom_pointrange(aes(ymin = lower, ymax = upper)) +
    geom_hline(yintercept = 0, lty = "dashed") +
    coord_flip() +
    labs(x = "participant", y = "parameter value") +
    facet_wrap(~param_type, ncol = 3, scales = "free_y")
}