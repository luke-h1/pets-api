resource "aws_default_vpc" "default_vpc" {
}

resource "aws_default_subnet" "app_subnet_a" {
  availability_zone = "eu-west-2a"
}

resource "aws_default_subnet" "app_subnet_b" {
  availability_zone = "eu-west-2b"
}

resource "aws_default_subnet" "app_subnet_c" {
  availability_zone = "eu-west-2c"
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



module "alb" {
  source             = "terraform-aws-modules/alb/aws"
  name               = "${var.project_name}-${var.env}-alb"
  vpc_id             = aws_default_vpc.default_vpc.id
  load_balancer_type = "application"
  subnets = [
    aws_default_subnet.app_subnet_a.id,
    aws_default_subnet.app_subnet_b.id,
    aws_default_subnet.app_subnet_c.id,
  ]

  # Security Group
  security_group_ingress_rules = {
    all_http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      description = "HTTP web traffic"
      cidr_ipv4   = "0.0.0.0/0"
    }
    all_https = {
      from_port   = 443
      to_port     = 443
      ip_protocol = "tcp"
      description = "HTTPS web traffic"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
  security_group_egress_rules = {
    all = {
      ip_protocol = "-1"
      cidr_ipv4   = "10.0.0.0/16"
    }
  }

  #   access_logs = {
  #     bucket = "my-alb-logs"
  #   }

  listeners = {
    ex-http-https-redirect = {
      port     = 80
      protocol = "HTTP"
      redirect = {
        port        = "443"
        protocol    = "HTTPS"
        status_code = "HTTP_301"
      }
    }
    ex-https = {
      port            = 443
      protocol        = "HTTPS"
      certificate_arn = aws_acm_certificate.domain.arn

      forward = {
        target_group_key = "ex-instance"
      }
    }
  }

  target_groups = {
    ex-instance = {
      name_prefix = "h1"
      protocol    = "HTTP"
      port        = 80
      target_type = "instance"
      target_id   = aws_lb_target_group.app_target_group.arn
    }
  }

  tags = var.tags
}

resource "aws_lb_target_group" "app_target_group" {
  name = "${var.project_name}-${var.env}-tg"
  tags = merge(var.tags, {
    "Name" = "${var.project_name}-${var.env}-tg"
  })
  port                          = 80
  protocol                      = "HTTP"
  target_type                   = "ip"
  vpc_id                        = aws_default_vpc.default_vpc.id
  deregistration_delay          = 300
  load_balancing_algorithm_type = "least_outstanding_requests"

  health_check {
    matcher           = "200,301,302"
    path              = "/api/healthcheck"
    interval          = 60
    timeout           = 30
    healthy_threshold = 3
  }
  stickiness {
    cookie_name     = "lb"
    cookie_duration = 3600
    enabled         = true
    type            = "lb_cookie"
  }
}
