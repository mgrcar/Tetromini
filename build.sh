#!/bin/bash

# parse params
while getopts pt:l OPTION
do
	case "${OPTION}"
	in
		t) TAG=${OPTARG};;
		p) PUSH=yes;;
		l) LATEST=yes;;
		?) echo "Usage: $(basename $0) [-t <tag>] [-l] [-p]" >&2
		   exit 1
		   ;;
	esac
done 

# determine root folder
ROOT=$(dirname "${BASH_SOURCE[0]}")
echo ROOT=$ROOT 

# defaults
TAG=${TAG:-latest}
PUSH=${PUSH:-no}
LATEST=${LATEST:-no}

echo TAG=$TAG
echo PUSH=$PUSH
echo LATEST=$LATEST

# set error handing
set -o errexit

echo Building \"$TAG\"...
docker build --pull -t mgrcar/tetromini:$TAG "$ROOT"

if [ "$PUSH" = yes ]
then
	echo Pushing \"$TAG\"...
	docker push mgrcar/tetromini:$TAG 
fi

if [ "$LATEST" = yes ] && [ "$TAG" != latest ]
then
	echo Tagging as \"latest\"...
	docker tag mgrcar/tetromini:$TAG mgrcar/tetromini:latest
	if [ "$PUSH" = yes ]
	then
		echo Pushing "latest"...
		docker push mgrcar/tetromini:latest
	fi
fi

echo All done.