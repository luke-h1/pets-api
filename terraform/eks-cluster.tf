resource "aws_eks_cluster" "eks" {
  name     = "${var.project_name}-${var.env}-eks-cluster"
  role_arn = aws_iam_role.master.arn
  vpc_config {
    subnet_ids = [aws_subnet.public_sub1.id, aws_subnet.public_sub2.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.AmazonEKSServicePolicy,
    aws_iam_role_policy_attachment.AmazonEKSVPCResourceController,
    aws_iam_role_policy_attachment.AmazonEKSVPCResourceController,
  ]
}