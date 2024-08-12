output "ecr_repo_name" {
  description = "The name of the ECR repository"
  value       = aws_ecr_repository.ecr_repo.name
}