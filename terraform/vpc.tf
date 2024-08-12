resource "aws_vpc" "pets_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = var.tags
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.pets_vpc.id
  tags   = var.tags
}

resource "aws_subnet" "public_sub1" {
  vpc_id                  = aws_vpc.pets_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "eu-west-2a"
  map_public_ip_on_launch = true
  tags                    = var.tags
}

resource "aws_subnet" "public_sub2" {
  vpc_id                  = aws_vpc.pets_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "eu-west-2b"
  map_public_ip_on_launch = true
  tags                    = var.tags
}

resource "aws_route_table" "rtb" {
  vpc_id = aws_vpc.pets_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "rt_ass1" {
  subnet_id      = aws_subnet.public_sub1.id
  route_table_id = aws_route_table.rtb.id
}

resource "aws_route_table_association" "rt_ass2" {
  subnet_id      = aws_subnet.public_sub2.id
  route_table_id = aws_route_table.rtb.id
}

resource "aws_security_group" "allow_tls" {
  name        = "allow_tls"
  description = "Allow TLS inbound fraffic"
  vpc_id      = aws_vpc.pets_vpc.id
  ingress {
    description = "TLS from VPC"
    from_port   = 22
    to_port     = 22
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