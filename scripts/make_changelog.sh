#!/bin/bash

echo -n "Enter a tag range using using the following format: \$TAG1..\$TAG2 or leave blank to generate a changelog of all commits to master:"
read range

if [ -z "$range" ]
then
  COMMITS=$(git log --merges --pretty=format:"%H" origin/master)
else
  COMMITS=$(git log ${range} --merges --pretty=format:"%H" origin/master)
fi

GIT_USER_NAME=$(git config user.name)
GIT_USER_EMAIL=$(git config user.email)
DATE=$(date '+%Y-%m-%d')

MARKDOWN="## Changelog \n"

if [ -z "$range" ]
then
  MARKDOWN+='\n'
  MARKDOWN+="### ${range}"
fi

MARKDOWN+='\n'

for COMMIT in $COMMITS; do
	SUBJECT=$(git log -1 ${COMMIT} --pretty=format:"%s")
	PULL_REQUEST=$( grep -Eo "Merge pull request #[[:digit:]]+" <<< "$SUBJECT" )
	if [[ $PULL_REQUEST ]]; then
		PULL_NUM=${PULL_REQUEST#"Merge pull request #"}
		BODY=$(git log -1 ${COMMIT} --pretty=format:"%b")
		MARKDOWN+='\n'
		MARKDOWN+=" - [#$PULL_NUM](https://github.com/AdaptiveConsulting/ReactiveTraderCloud/pull/$PULL_NUM): $BODY"
	fi
done

echo -e $MARKDOWN > ../CHANGELOG.md
