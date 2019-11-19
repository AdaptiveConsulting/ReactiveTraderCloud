target_origin="sizov"
target_branch="master"

git_data=$(curl https://api.github.com/repos/sizov/ReactiveTraderCloud/pulls\?state=open\?access_token\=---)
pr_branches=$( grep -oP "(?<=\"label\": \"${target_origin}:).*?(?=\")" <<< $git_data | sort -u)

for branch in $pr_branches
do
  if [ "$branch" != $target_branch ]; then
    echo "\"branch\": \"${branch}\""
         curl -u ---: -X POST --header "Content-Type: application/json" -d "{
           \"branch\": \"${branch}\"
         }" https://circleci.com/api/v2/project/github/sizov/ReactiveTraderCloud/pipeline
  fi
done
