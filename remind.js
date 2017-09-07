/* 
    SLACK REMINDER
    created by: Daniel Russell (github.com/danielrussellla)
    date: 9/6/2017
*/

// call this file by typing something like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`
'use-strict'
const fs = require('fs');
const Slack = require('slack-node');
const apiToken = require('./slack.config.js');

const slack = new Slack(apiToken); // init app

let USER = process.env.user
let PR = process.env.pr
let FREQUENCY = 3600000 // 1 hour

if (!USER || !PR) {
    console.log('ERROR: message not sent');
    console.log('REASON: "user" or "pr" environment variables not defined.');
    console.log('SOLUTION: Try running the command like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`')
    return;
}

const messages = [
    'when you get a chance - thanks', 
    'thanks', 
    'whenever you get the time',
    'needs a review',
    'review please',
    'PR for ya',
    'much appreciated',
    'feedback welcome'
]

let remind = (userId) => {
    let randomIdx = Math.floor(Math.random() * messages.length)
    let message = messages[randomIdx]
    slack.api('chat.postMessage', {
        text: `${PR} ${message}`,
        channel: userId,
        as_user: true
    }, (err, response) => {
        console.log(response);
    });
}

slack.api("users.list", (err, response) => {
    if (err) {
        console.log('ERROR fetching slack users', err);
        return;
    }
    let users = response.members;
    users.some( (member, i) => {
        if (USER.toLowerCase() === member.name.toLowerCase() ||
        USER.toLowerCase() === member.profile.real_name.toLowerCase()) {
            remind(member.id) // initial reminder
            setInterval(() => {
                remind(member.id)
            }, FREQUENCY) // repeat reminder
            return true;
        }
        if (i === users.length - 1) {
            console.log('ERROR: could not find user:', USER);
            console.log('- please enter a valid slack user');
        }
    });
});
