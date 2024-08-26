resource "aws_security_group" "sec" {
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.app_load_balancer_security_group.id]
  }
}

resource "aws_elasticache_serverless_cache" "cache" {
  engine = "redis"
  name   = "${var.project_name}-${var.env}-cache"
  cache_usage_limits {
    data_storage {
      maximum = 1
      unit    = "GB"
    }
    ecpu_per_second {
      maximum = 1000
    }

  }
  daily_snapshot_time  = "09:00"
  description          = "${var.project_name}-${var.env}-cache"
  major_engine_version = "7"
  security_group_ids   = [aws_security_group.sec.id]
  subnet_ids           = [aws_default_subnet.application_subnet_a.id, aws_default_subnet.application_subnet_b.id, aws_default_subnet.application_subnet_c.id]
}
