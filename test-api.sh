curl \
  --user 7e4908ce353876a2fa0e83aebffc93bb7313ca8f: \
  --header "Content-Type: application/json" \
  --data "{\"build_parameters\": {\"CIRCLE_JOB\": \"feature_build\"}}" \
  --request POST "https://circleci.com/api/v1.1/project/github/sizov/ReactiveTraderCloud/tree/master"
