/* 
    SLACK REMINDER
    created by: Daniel Russell (github.com/danielrussellla)
    date: 9/6/2017
*/

// call this file by typing something like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`
'use-strict'
const fs = require('fs');
const notifier = require('node-notifier');
const error = require('./util/error');
const github = require('./util/github');
const slack = require('./util/slack');


let USER = process.env.user || process.env.name || process.env.username || process.env.NAME || process.env.USERNAME;
let PR = process.env.pr || process.env.PR || process.env.link || process.env.LINK;
let FORCE_REMIND = process.env.f || process.env.force || false;
let PR_NUM = PR.substr(PR.length - 5);
let FREQUENCY = 3600000; // 1 hour
let NUM_REMINDERS_SENT = 0;


if (!USER || !PR) {
    error.log({
        error: `ERROR: message not sent`,
        reason: `"user" or "pr" environment variables not defined.`,
        solution: `Try running the command like: user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`
    })
    return;
} else {
    USER = USER.split(',')
}

let checkGithubForUpdates = () => {
    let reviewComments = 0;
    let comments = 0;
    
    github.getPullRequest(PR).then((githubData) => {
        reviewComments = githubData.data.review_comments;
        comments = githubData.data.comments;
        console.log('github update:', {
            comments: githubData.data.comments + githubData.data.review_comments,
            approved: githubData.data.mergeable_state !== 'blocked',
            pr: PR
        })
    })
    
    setInterval(() => {
        github.getPullRequest(PR).then((githubData) => {
            if (githubData.data.mergeable_state !== 'blocked') {
                notifier.notify({
                    title: `your PR has been approved!`,
                    message: PR,
                    sound: true
                })
            }
            if (githubData.data.review_comments > reviewComments ||
                githubData.data.comments > comments) {
                notifier.notify({
                    title: `someone commented on your PR`,
                    message: PR,
                    sound: true
                })
            }
            console.log('github update:', {
                comments: githubData.data.comments + githubData.data.review_comments,
                approved: githubData.data.mergeable_state !== 'blocked',
                pr: PR
            })
        })
    }, 60000)
}

checkGithubForUpdates();


let remind = (user) => {
    slack.sendMessage({
        name: user.name,
        to: user.id,
        pr: PR
    });
}

let scheduleReminders = () => {
    let schedules = {};

    slack.getUserList().then((response) => {
        let users = response.members;
        users.forEach( (user, i) => {
            USER.some((name, j) => {
                if (name.toLowerCase() === user.name.toLowerCase() ||
                name.toLowerCase() === user.profile.real_name.toLowerCase()) {
                    
                    remind(user); // initial reminder
                    notifier.notify({
                        title: `Reminder sent to: ${name}`,
                        message: PR,
                        sound: true
                    })
                    NUM_REMINDERS_SENT++;
                    
                    schedules[user.id] = setInterval(() => {
                        remind(user);
                        notifier.notify({
                            title: `Reminder sent to: ${name}`,
                            message: PR,
                            sound: true
                        })
                        NUM_REMINDERS_SENT++;
                        if (NUM_REMINDERS_SENT == 5) {
                            clearInterval(schedules[user.id]); // stop reminders after 5
                            delete schedules[user.id];
                        }
                    }, FREQUENCY) // repeat reminder
                    
                    USER.splice(j, 1);
                    return true;
                }
            })
            
            if (i === users.length - 1 && USER.length) {
                error.log({
                    error: `Invalid slack username(s)`,
                    reason: `Messages not sent to ${USER.join(', ')}`,
                    solution: 'Please enter a valid slack user'
                });
            }
        });
    })    
}

scheduleReminders();
