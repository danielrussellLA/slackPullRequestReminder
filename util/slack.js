const Slack = require('slack-node');
const apiToken = require('../config.js').slack;
const slack = new Slack(apiToken); // init app
const error = require('./error');
const moment = require('moment');

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

module.exports = {
    getUserList() {
        return new Promise((resolve, reject) => {
            slack.api("users.list", (err, response) => {
                if (err) {
                    console.log(err);
                    error.log({
                        error: `fetching slack API data.`,
                        reason: `invalid slack API token`,
                        solution: `Try renewing your API token here: https://api.slack.com/custom-integrations/legacy-tokens and pasting the new token in ./slack.config.js`
                    });
                    reject(err);
                }
                resolve(response);
            });
            
        })
    },
    sendMessage(params) {
        let randomIdx = Math.floor(Math.random() * messages.length);
        let message = messages[randomIdx];
        
        slack.api('chat.postMessage', {
            text: `${params.pr} ${message}`,
            channel: params.to,
            as_user: true
        }, (err, response) => {
            if (err) {
                console.log(err);
                error.log({
                    error: `sending message on slack`,
                    reason: err,
                    solution: `Either something went wrong with the API or you entered a wrong user name. Try renewing your API token here: https://api.slack.com/custom-integrations/legacy-tokens and pasting the new token in ./slack.config.js OR entering in a valid slack user name. Otherwise investiage further.`
                })
            }
            console.log(`${moment().format('LT')} Slack - reminder sent to ${params.name}`);
        });
    }
}