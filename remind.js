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

let USER = process.env.user.split(',')
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
    users.some( (user, i) => {
        USER.forEach((name, j) => {
            if (name.toLowerCase() === user.name.toLowerCase() ||
                name.toLowerCase() === user.profile.real_name.toLowerCase()) {
                
                remind(user.id) // initial reminder
                setInterval(() => {
                    remind(user.id)
                }, FREQUENCY) // repeat reminder
                
                USER.splice(j, 1);
            }
        })

        if (i === users.length - 1 && USER.length) {
            console.log('ERROR: invalid slack username(s):', USER.join(', '));
            console.log('- messages not sent to:', USER.join(', '));
            console.log('- please enter a valid slack user');
        }
    });
});
