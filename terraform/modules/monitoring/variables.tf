variable "prefix" { type = string }
variable "environment" { type = string }
variable "log_retention_days" { type = number; default = 30 }
variable "cpu_alarm_threshold" { type = number; default = 80 }
variable "memory_alarm_threshold" { type = number; default = 80 }
variable "alert_emails" { type = list(string); default = [] }
variable "tags" { type = map(string); default = {} }
