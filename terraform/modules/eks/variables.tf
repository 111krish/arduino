variable "cluster_name" { type = string }
variable "kubernetes_version" { type = string; default = "1.29" }
variable "cluster_role_arn" { type = string }
variable "node_role_arn" { type = string }
variable "subnet_ids" { type = list(string) }
variable "private_subnet_ids" { type = list(string) }
variable "enable_public_endpoint" { type = bool; default = false }
variable "public_access_cidrs" { type = list(string); default = [] }
variable "desired_nodes" { type = number; default = 2 }
variable "min_nodes" { type = number; default = 1 }
variable "max_nodes" { type = number; default = 5 }
variable "instance_types" { type = list(string); default = ["t3.medium"] }
variable "disk_size" { type = number; default = 50 }
variable "tags" { type = map(string); default = {} }
