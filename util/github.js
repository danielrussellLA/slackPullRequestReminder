const GithubApi = require('github');
const github = new GithubApi({ Promise: require('bluebird') });
const githubConfig = require('../config.js').github;
const githubRepo = githubConfig.repo;
const githubCredentials = githubConfig.credentials;
github.authenticate(githubCredentials);

const moment = require('moment');
const error = require('./error');

module.exports = {
    getPullRequest(url) {
        const pr_number = url.split('/').reverse()[0];
        return github.pullRequests.get(Object.assign(githubRepo, { number: pr_number }))
    },
    logUpdate(githubData) {
            console.log(`${moment().format('LT')} Github - current PR status:`)
            console.log(`    pullrequest: ${githubData.data.html_url}`)
            console.log(`    comments: ${githubData.data.comments + githubData.data.review_comments}`)
            console.log(`    approved: ${githubData.data.mergeable_state !== 'blocked'}`);
            
            if (githubData.data.mergeable_state.toLowerCase() === 'mergeable') {
                notificationScheduler.send({ type: 'readyToMerge', pr: PR })
            }
    }
}
