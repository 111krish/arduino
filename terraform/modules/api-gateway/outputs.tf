output "api_id" { value = aws_api_gateway_rest_api.main.id }
output "api_arn" { value = aws_api_gateway_rest_api.main.arn }
output "invoke_url" { value = aws_api_gateway_stage.main.invoke_url }
output "stage_arn" { value = aws_api_gateway_stage.main.arn }
output "usage_plan_id" { value = aws_api_gateway_usage_plan.main.id }
