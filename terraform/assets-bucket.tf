resource "aws_iam_policy" "assets_policy" {
  name        = "${var.project_name}-${var.env}-assets-policy"
  path        = "/"
  description = "Allows API to read and write to s3 assets bucket"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        "Resource" : [
          "arn:aws:s3:::${var.project_name}-${var.env}-assets/*"
        ]
      }
    ]
  })
}

resource "aws_iam_user" "assets_user" {
  name                 = "${var.project_name}-${var.env}-assets-user"
  permissions_boundary = aws_iam_policy.assets_policy.arn
}

resource "aws_s3_bucket" "assets_bucket" {
  bucket = "${var.project_name}-${var.env}-assets"

  tags = {
    Name        = "Pets API Assets Bucket"
    Environment = var.env
  }
  depends_on = [
    aws_iam_policy.assets_policy,
    aws_iam_user.assets_user
  ]
}

resource "aws_s3_bucket_public_access_block" "pub_access" {
  bucket              = aws_s3_bucket.assets_bucket.id
  block_public_acls   = false
  block_public_policy = false
  depends_on = [
    aws_s3_bucket.assets_bucket
  ]
}