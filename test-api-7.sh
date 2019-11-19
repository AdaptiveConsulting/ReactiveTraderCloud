target_origin="sizov"
target_branch="master"
git_data=$(curl https://api.github.com/repos/sizov/ReactiveTraderCloud/pulls\---?state=open\?access_token\=)
pr_branches=$( grep -oP "(?<=\"label\": \"${target_origin}:).*?(?=\")" <<< $git_data | sort -u)
#echo $pr_branches


#pr_branches_strings_all=$( grep '"label":' <<< $git_data )
#echo $pr_branches_strings_all
#all_branches_with_prs=$( grep -oP '(?<=\:).*?(?=")'  <<< $pr_branches_strings_all ) ## extract branch names
#echo $all_branches_with_prs
#$all_branches_with_prs_u=$($all_branches_with_prs)
#echo $all_branches_with_prs_u



for branch in $pr_branches
do
  if [ "$branch" != $target_branch ]; then
    echo $branch
#     curl -u ---: -X POST --header "Content-Type: application/json" -d '{
#              "branch": "'$branch_name'"
#            }' https://circleci.com/api/v2/project/github/sizov/ReactiveTraderCloud/pipeline
  fi
done



#branches=$(grep -oP 'sizov.*?(\s|$)' --color <<< $output)
#echo $branches




#########################################
#output=$(git ls-remote --heads sizov)
#branches=$(grep -oP 'refs/heads/.*?(\s|$)' --color <<< $output)
#
#prefix="refs/heads/"
#
#for branch in $branches
#do
#  branch_name=${branch/#$prefix}
#  if [ "$branch_name" != "master" ]; then
#     curl -u 5499650a2b39ca98df218f487e6b047cd47f4b21: -X POST --header "Content-Type: application/json" -d '{
#              "branch": "'$branch_name'"
#            }' https://circleci.com/api/v2/project/github/sizov/ReactiveTraderCloud/pipeline
#  fi
#done
