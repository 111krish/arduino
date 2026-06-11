variable "prefix" { type = string }
variable "app_assume_role_policy" { type = string }
variable "app_policy_json" { type = string }
variable "tags" { type = map(string); default = {} }
