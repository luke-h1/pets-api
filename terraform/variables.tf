

variable "project_name" {
  type        = string
  description = "name of project"
  default     = "pets-api"
}

variable "env" {
  type        = string
  description = "environment to deploy resources to"
  default     = "staging"
}

variable "tags" {
  type        = map(string)
  description = "tags to apply to resources"
  default = {
    "ManagedBy" = "Terraform"
  }
}


// environment variables
variable "redis_url" {
  type        = string
  description = "URL of the Redis instance"
}

variable "api_base_url" {
  type        = string
  description = "Base URL of the API"
}

variable "session_secret" {
  type        = string
  description = "Secret key for session management"
}

variable "database_url" {
  type        = string
  description = "URL of the database"
}

variable "deployed_by" {
  type        = string
  description = "Name of the person deploying the resources"
  default     = "luke-h1"
}

variable "deployed_at" {
  type        = string
  description = "Time at which the resources were deployed"
}

variable "port" {
  type        = number
  description = "Port to run the application on"
  default     = 8000
}

