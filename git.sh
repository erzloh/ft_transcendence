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

# Your Discord webhook URL
WEBHOOK_URL="https://discord.com/api/webhooks/1260922783026642975/gL2-PdwJSJ8T7q6FL-l8mbWS_5B-8Lw4xwl7_QMn_TaiYkAK4AnwReohQWtyg5NKntZ1"

# Function to send a message to Discord
send_discord_message() {
    local content="$1"
    curl -H "Content-Type: application/json" -X POST -d "{\"content\": \"$content\"}" "$WEBHOOK_URL"
}

# Check if no commit message is provided
if [ -z "$1" ]; then
    echo "${RED}No commit message provided."
    echo "Usage: ./git_push.sh 'Commit message'${RESET_COLOR}"
    exit 1
fi

# Prompt the user to enter the username
read -p "${BLACK}Who is You? ${CYAN}" username

# Get the current branch name
branch_name=$(git symbolic-ref --short HEAD)

# Perform git add .
git add .

# Display git status
git status

# Prompt the user to continue
read -p "${BLACK}Still want to push to branch ${MAGENTA}$branch_name ${CYAN}$username${BLACK}? (y/n): ${GREEN}" choice
echo -e "${BLACK}"
if [ "$choice" != "y" ]; then
    echo "${RED}Aborted.${RESET_COLOR}"
    exit 0
fi

# Concatenate all arguments into a single commit message
commit_message="$*"

# Perform git commit with the provided message
git commit -m "$commit_message"

# Perform git push to the current branch
git push origin "$branch_name"

# Send a message to Discord with the commit message
send_discord_message "Git operation completed: **$username** committed and pushed to branch **$branch_name** with message: **$commit_message**."
echo "${GREEN}Your teammate has been warned of your push ;)${RESET_COLOR}"
