#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if a view name is provided
if [ -z "$1" ]; then
  echo -e "${RED}Usage: $0 viewname${NC}"
  exit 1
fi

# Get the view name from the argument
view_name=$1

# Convert the first letter to uppercase for the view file name
view_file_name="$(tr '[:lower:]' '[:upper:]' <<< ${view_name:0:1})${view_name:1}"

# Set base directory to the relative ./frontend/static directory
base_dir="./frontend/static"

# Create directories if they don't exist
mkdir -p "$base_dir/js/views"
mkdir -p "$base_dir/js/scripts"
mkdir -p "$base_dir/html"

# Provide feedback
echo -e "${GREEN}Creating view files for: $view_name${NC}"

# Check and create the Example.js file in ./frontend/static/js/views/
if [ ! -f "$base_dir/js/views/${view_file_name}.js" ]; then
cat <<EOL > "$base_dir/js/views/${view_file_name}.js"
import AbstractView from "./AbstractView.js";
import { ${view_name} } from "../scripts/${view_name}.js";
// import { eventListeners } from "../scripts/${view_name}.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("${view_name}");
    }

    async getHtml() {
        return (await fetch("static/html/${view_name}.html")).text();
    }

    loadJS() {
        ${view_name}();
    }

    // cleanUpEventListeners() {
    //  for (const [event, listener] of Object.entries(eventListeners)) {
    //      document.removeEventListener(event, listener);
    //  }
    // }
}
EOL
    echo -e "${GREEN}Created $base_dir/js/views/${view_file_name}.js${NC}"
else
    echo -e "${YELLOW}File $base_dir/js/views/${view_file_name}.js already exists, skipping...${NC}"
fi

# Check and create the example.js file in ./frontend/static/js/scripts/
if [ ! -f "$base_dir/js/scripts/${view_name}.js" ]; then
cat <<EOL > "$base_dir/js/scripts/${view_name}.js"
// Function that will be called when the view is loaded
export function ${view_name} () {
    // const test = "Hello from the ${view_name} view!";
    // console.log(test);

    // // add event listner for keydown
    // document.addEventListener("keydown", printKey);

    // function testFunction () {
    //  const test = "this is a test function";
    //  console.log(test);
    // }

    // testFunction();
}

// --------------------------- Event Listener Functions ---------------------------
// (Only Event Listener that are attached to the document.
// Those attached to elements in the view are gonna be removed
// when the view changes anyway)

// function printKey (event) {
//  console.log(event.key);

// }

// --------------------------- Export Event Listeners Object ---------------------------
// export const eventListeners = {
//  "keydown": printKey
// }
EOL
    echo -e "${GREEN}Created $base_dir/js/scripts/${view_name}.js${NC}"
else
    echo -e "${YELLOW}File $base_dir/js/scripts/${view_name}.js already exists, skipping...${NC}"
fi

# Check and create the example.html file in ./frontend/static/html/
if [ ! -f "$base_dir/html/${view_name}.html" ]; then
cat <<EOL > "$base_dir/html/${view_name}.html"
<div class="full-height d-flex flex-column align-items-center justify-content-center">
    <div class="container container-login p-5">
        <div class="row justify-content-center mb-5">
            <div class="col-12 text-left">
                <p class="text-white h1" animated-letters data-translate="${view_name}">${view_name}</p>
            </div>
        </div>
        <div class="row justify-content-center mb-3">
            <div class="col-12 text-center text-white">
                <p>dummie text 1</p>
            </div>
        </div>
        <div class="row justify-content-center mb-3">
            <div class="col-12 text-center text-white">
                <p>dummie text 2</p>
            </div>
        </div>
    </div>
    <a role="button" class="return-btn btn btn-lg text-light text-center d-flex align-items-center justify-content-center p-3 mt-5" href="/" data-link>
        <img src="static/assets/UI/icons/left_arrow.svg" alt="return button" id="left-arrow">
    </a>
</div>
EOL
    echo -e "${GREEN}Created $base_dir/html/${view_name}.html${NC}"
else
    echo -e "${YELLOW}File $base_dir/html/${view_name}.html already exists, skipping...${NC}"
fi

echo -e "${GREEN}View files for ${view_name} processed successfully!${NC}"
