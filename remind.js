// call this file by typing something like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`
'use-strict'
const Slack = require('slack-node');
const apiToken = "<-- your slack API token -->";

const slack = new Slack(apiToken);

// gets all users and writes the json to a file - you can comment this block out once you run it once
slack.api("users.list", function(err, response) {
    const fs = require('fs');
    fs.writeFile('users.json', JSON.stringify(response));
    console.log(response);
});

const USER = process.env.user
const PR = process.env.pr

// Fill in this object with the name: ID of any user you want to regularly remind. 
// Search the users.json that's written above for users' IDs 
const users = {
    bob: 'U5YPX8JR',
    sally: 'U9XYX7PJ'
    // etc...
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

let remind = () => {
    let randomIdx = Math.floor(Math.random() * messages.length)
    let message = messages[randomIdx]
    slack.api('chat.postMessage', {
        text: `${PR} ${message}`,
        channel: users[USER],
        as_user: true
    }, function(err, response) {
        console.log(response);
    });
}

if (USER && PR){
    remind() // initial reminder
    setInterval(() => {
        remind()
    }, 3600000) // repeat every hour
} else {
    console.log('user or pr not defined. message not sent');
}