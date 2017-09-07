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
let FOUND_USER = true

if (!USER || !PR) {
    console.log('"user" or "pr" environment variables not defined.');
    console.log('Message not sent.');
    console.log('please run the command like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`')
    return;
}

// gets all users and writes the json to a file - you can comment this block out once you run it once
if (!fs.existsSync('./users.json')) {
    slack.api("users.list", (err, response) => {
        if (err) {
            console.log('ERROR fetching slack users', err);
            return;
        }
        fs.writeFile('users.json', JSON.stringify(response));
        console.log(response);
    });
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


// read users.json and get the members array
fs.readFile('./users.json', 'utf-8', (err, data) => {
    if (err) {
        console.log('ERROR reading user list', err);
        return;
    }
    let response = JSON.parse(data);
    let members = response.members;
    members.some( (member, i) => {
        if (USER.toLowerCase() === member.name.toLowerCase() ||
            USER.toLowerCase() === member.profile.real_name.toLowerCase()) {
                remind(member.id) // initial reminder
                setInterval(() => {
                    remind(member.id)
                }, FREQUENCY) // repeat every hour
                return true;
        }
        if (i === members.length -1) {
            FOUND_USER = false;
        }
    });
})

if (!FOUND_USER) {
    console.log('could not find user:', USER);
    console.log('please enter a valid slack user');
    return;
}
