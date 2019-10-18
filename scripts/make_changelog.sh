#!/bin/bash

TAGS=$(git tag)
TAGS_ARRAY=($TAGS)

MARKDOWN="## Changelog \n"

PREV_TAG="";

for i in "${!TAGS_ARRAY[@]}"; do 
  if [ $i != 0 ]; then
    PREV_TAG=${TAGS_ARRAY[$i-1]}
    CURR_TAG=${TAGS_ARRAY[$i]}
    
    RANGE="${PREV_TAG}...${CURR_TAG}"
    
    TAG_DATE=$(git log -1 --format=%ai ${PREV_TAG})
    MARKDOWN+="\n"
    MARKDOWN+="### ${PREV_TAG} ($TAG_DATE)"
    MARKDOWN+="\n"

    COMMITS=$(git log ${RANGE} origin/master --merges --pretty=format:"%H")
    COMMITS_ARRAY=($COMMITS)
    for x in "${!COMMITS_ARRAY[@]}"; do 
      echo "Processing Tag ${i} of ${#TAGS_ARRAY[@]}"
      echo "--> Processing commit ${x} of ${#COMMITS_ARRAY[@]}"
      
      COMMIT=${COMMITS_ARRAY[$x]}

      SUBJECT=$(git log -1 ${COMMIT} --pretty=format:"%s")
      PULL_REQUEST=$( grep -Eo "Merge pull request #[[:digit:]]+" <<< "$SUBJECT" )
      
      if [[ $PULL_REQUEST ]]; then
        PULL_NUM=${PULL_REQUEST#"Merge pull request #"}
        BODY=$(git log -1 ${COMMIT} --pretty=format:"%b")
        MARKDOWN+=" - [#$PULL_NUM](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/pull/$PULL_NUM): $BODY"
        MARKDOWN+="\n"
      fi
    done
    MARKDOWN+="\n"
    MARKDOWN+="\n"
  fi
done

echo -e $MARKDOWN > ../CHANGELOG.md