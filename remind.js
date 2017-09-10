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


let USER = process.env.user || process.env.name || process.env.username || process.env.NAME || process.env.USERNAME;
let PR = process.env.pr || process.env.PR || process.env.link || process.env.LINK;
let FORCE_REMIND = process.env.f || process.env.force || false;
let PR_NUM = PR.substr(PR.length - 5);
let FREQUENCY = 3600000; // 1 hour
let NUM_REMINDERS_SENT = 0;

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


if (!USER || !PR) {
    console.log('ERROR: message not sent');
    console.log('REASON: "user" or "pr" environment variables not defined.');
    console.log('SOLUTION: Try running the command like: `user=bob pr=https://github.com/myorg/myorgrepo/pull/12345 node remind.js`');
    return;
} else {
    USER = USER.split(',')
}

let remind = (userId) => {
    let randomIdx = Math.floor(Math.random() * messages.length);
    let message = messages[randomIdx];
    
    slack.api('chat.postMessage', {
        text: `${PR} ${message}`,
        channel: userId,
        as_user: true
    }, (err, response) => {
        console.log(response);
    });
}

let scheduleReminders = () => {
    let schedules = {};
    slack.api("users.list", (err, response) => {
        if (err) {
            console.log('ERROR fetching slack users', err);
            return;
        }

        let users = response.members;
        users.forEach( (user, i) => {
            USER.some((name, j) => {
                if (name.toLowerCase() === user.name.toLowerCase() ||
                    name.toLowerCase() === user.profile.real_name.toLowerCase()) {
                    
                    remind(user.id); // initial reminder
                    NUM_REMINDERS_SENT++;
                    
                    schedules[user.id] = setInterval(() => {
                        remind(user.id);
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
                console.log('ERROR: invalid slack username(s):', USER.join(', '));
                console.log('- messages not sent to:', USER.join(', '));
                console.log('- please enter a valid slack user');
            }
        });
    });
}

let readPullRequest = () => {
    if (fs.existsSync('./pullrequest.json')) {
        return new Promise((resolve, reject) => {
            fs.readFile('./pullrequest.json', 'utf8', (err, response) => {
                let data = JSON.parse(response);
                if (err || !data) {
                    console.log('ERROR: fetching github data', err);
                    reject(`ERROR: fetching github data - ${err}`)
                    return;
                }
                resolve(data);
            })
        })
    }
}

readPullRequest().then((githubData) => {
    if (FORCE_REMIND) {
        scheduleReminders();
    }
    else if (githubData.comments == 0 && merged == false) {
        scheduleReminders();
    } else {
        console.log('Someone has already given feedback - try running with')
        console.log('force=true')
    }
});



