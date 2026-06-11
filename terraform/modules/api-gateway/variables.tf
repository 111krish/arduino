variable "prefix" { type = string }
variable "endpoint_type" { type = string; default = "REGIONAL" }
variable "authorization_type" { type = string; default = "NONE" }
variable "lambda_invoke_arn" { type = string }
variable "authorizer_lambda_uri" { type = string; default = "" }
variable "stage_name" { type = string; default = "v1" }
variable "access_log_arn" { type = string }
variable "burst_limit" { type = number; default = 500 }
variable "rate_limit" { type = number; default = 1000 }
variable "quota_limit" { type = number; default = 10000 }
variable "tags" { type = map(string); default = {} }
