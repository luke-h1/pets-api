resource "aws_ecr_repository" "ecr_repo" {
  name = "${var.project_name}-${var.env}-ecr-repo"
  # required if we need to do a full teardown
  force_delete = true

  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-ecr-repo"
  })
}

# keep last 10 images
resource "aws_ecr_lifecycle_policy" "ecr_repo_policy" {
  repository = aws_ecr_repository.ecr_repo.name
  policy     = <<EOF
  {
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last 10 images",
            "selection": {
                "tagStatus": "tagged",
                "tagPrefixList": ["${var.project_name}"],
                "countType": "imageCountMoreThan",
                "countNumber": 10
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
