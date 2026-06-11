output "log_group_name" { value = aws_cloudwatch_log_group.app.name }
output "log_group_arn" { value = aws_cloudwatch_log_group.app.arn }
output "sns_topic_arn" { value = aws_sns_topic.alerts.arn }
output "dashboard_name" { value = aws_cloudwatch_dashboard.main.dashboard_name }
