#!/bin/bash
npx tsc

if [ $? -eq 1 ]; then
    echo "EXITING"
    exit $?
fi

line=$(grep -n '//CODE//' runAmd.js | cut -d ":" -f 1)
{ head -n $(($line-1)) runAmd.js; cat build/main.js; tail -n +$line runAmd.js; } > ./build/bundle.js


