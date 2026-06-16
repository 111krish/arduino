output "eks_cluster_role_arn" { value = aws_iam_role.eks_cluster.arn }
output "eks_node_role_arn" { value = aws_iam_role.eks_node.arn }
output "app_role_arn" { value = aws_iam_role.app.arn }
output "app_policy_arn" { value = aws_iam_policy.app_custom.arn }
