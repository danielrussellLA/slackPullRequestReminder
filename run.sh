#!/bin/bash

{ # try
    # echo $PR
    PR_NUM=$(echo $PR | cut -d'/' -f 7)
    wait
    curl -u "danielrussellla" "https://api.github.com/repos/Openmail/OpenMail/pulls/${PR_NUM}" > pullrequest.json
    sleep 3
    pr=$PR name=$NAME node remind.js
} || { # catch
    # rm -rf pullrequest.json
    echo "failure"
}