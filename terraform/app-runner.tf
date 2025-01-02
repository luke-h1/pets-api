locals {
  create_access_iam_role = false
}

resource "aws_default_vpc" "default_vpc" {
}

resource "aws_default_subnet" "application_subnet_a" {
  availability_zone = "eu-west-2a"
}

resource "aws_default_subnet" "application_subnet_b" {
  availability_zone = "eu-west-2b"
}

resource "aws_default_subnet" "application_subnet_c" {
  availability_zone = "eu-west-2c"
}

resource "aws_security_group" "sg" {
  name   = "${var.project_name}-${var.env}-app-runner-security-group"
  vpc_id = aws_default_vpc.default_vpc.id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_iam_role" "app_runner_role" {
  name = "app-runner-poc"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Terraform = "true"
  }
}

resource "aws_iam_role_policy_attachment" "app_runner_policy_attachment" {
  role       = aws_iam_role.app_runner_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

resource "aws_apprunner_custom_domain_association" "domain" {
  domain_name = "pets-staging.lhowsam.com"
  service_arn = aws_apprunner_service.app_runner_service.arn
}

resource "aws_apprunner_auto_scaling_configuration_version" "scale" {
  auto_scaling_configuration_name = "${var.project_name}-${var.env}"

  max_concurrency = 200
  max_size        = 1
  min_size        = 1

}

resource "aws_apprunner_service" "app_runner_service" {
  service_name = var.project_name
  source_configuration {

    auto_deployments_enabled = false
    authentication_configuration {
      access_role_arn = aws_iam_role.app_runner_role.arn
    }
    image_repository {
      image_configuration {
        port = 8000
        runtime_environment_variables = {
          MY_VARIABLE = "hello!"
        }
      }
      image_identifier      = "${aws_ecr_repository.application_ecr_repo.repository_url}:${var.docker_image_tag}"
      image_repository_type = "ECR"
    }
  }

  instance_configuration {
    cpu    = "256"
    memory = "512"
  }

  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.scale.arn
  network_configuration {

    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.app_runner_vpc_connector.arn
    }
    ingress_configuration {
      is_publicly_accessible = true
    }
  }
  health_check_configuration {
    protocol = "HTTP"
    path     = "/api/healthcheck"
  }

  tags = {
    Terraform   = "true"
    Environment = var.env
  }
}

resource "aws_apprunner_vpc_connector" "app_runner_vpc_connector" {
  vpc_connector_name = "${var.project_name}-vpc-connector"
  subnets = [
    aws_default_subnet.application_subnet_a.id,
    aws_default_subnet.application_subnet_b.id,
    aws_default_subnet.application_subnet_c.id
  ]
  security_groups = [aws_security_group.sg.id]

}