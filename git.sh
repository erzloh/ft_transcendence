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
    echo "Usage: ./git_push.sh 'Commit message' [merge]${RESET_COLOR}"
    exit 1
fi

# Get the commit message from the arguments
commit_message="$1"

# Get the current branch name
branch_name=$(git symbolic-ref --short HEAD)

# Perform git add .
git add .

# Perform git commit with the provided message
git commit -m "$commit_message"

# Perform git push to the current branch
git push origin "$branch_name"

echo "${GREEN}Changes have been pushed to branch ${MAGENTA}$branch_name${GREEN} with message: ${CYAN}$commit_message${RESET_COLOR}"

# Check if merge option is provided
if [ "$2" = "merge" ]; then
    echo "${YELLOW}Merging $branch_name into main...${RESET_COLOR}"
    git checkout main
    git pull origin main
    git merge "$branch_name"
    git push origin main
    echo "${GREEN}$branch_name has been merged into main${RESET_COLOR}"
fi
# Check if merge-main option is provided
if [ "$2" = "merge-main" ]; then
    echo "${YELLOW}Merging main into $branch_name...${RESET_COLOR}"
    git checkout "$branch_name"
    git fetch origin main
    git merge --no-edit origin/main
    git push origin "merged main into my branch : $branch_name"
    echo "${GREEN}main has been merged into $branch_name${RESET_COLOR}"
fi