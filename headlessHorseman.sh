#!/bin/bash

# USAGE: [file-of-edx-urls-to-crawl] [output-file]

while IFS='' read -r line || [[ -n "$line" ]]; do
    
    echo "Crawling $line"
    node run.js -x crawl_edx_course_page -u $line -o $2
    
done < "$1"