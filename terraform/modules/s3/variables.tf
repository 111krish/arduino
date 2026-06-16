variable "bucket_name" { type = string }
variable "versioning_enabled" { type = bool; default = true }
variable "force_destroy" { type = bool; default = false }
variable "kms_key_id" { type = string; default = "" }
variable "lifecycle_rules" {
  type = list(object({
    id              = string
    enabled         = bool
    transition_days = number
    storage_class   = string
    expiration_days = number
  }))
  default = []
}
variable "tags" { type = map(string); default = {} }
