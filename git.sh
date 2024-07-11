#!/bin/bash

# ANSI color escape codes
RESET_COLOR=$(tput sgr0)
BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)

# Check if no commit message is provided
if [ -z "$1" ]; then
    echo "${RED}No commit message provided."
    echo "Usage: ./git_push.sh 'Commit message'${RESET_COLOR}"
    exit 1
fi

# Get the commit message from the arguments
commit_message="$*"

# Get the current branch name
branch_name=$(git symbolic-ref --short HEAD)

# Perform git add .
git add .

# Perform git commit with the provided message
git commit -m "$commit_message"

# Perform git push to the current branch
git push origin "$branch_name"

echo "${GREEN}Changes have been pushed to branch ${MAGENTA}$branch_name${GREEN} with message: ${CYAN}$commit_message${RESET_COLOR}"
