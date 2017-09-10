const GithubApi = require('github');
const github = new GithubApi({ Promise: require('bluebird') });
const githubCredentials = require('../config.js').github;
github.authenticate(githubCredentials);

const error = require('./error');

module.exports = {
    getPullRequest(pullrequestUrl) {
        const pr_elements = pullrequestUrl.split('/').reverse();
        let pr_number = null;
        
        pr_elements.forEach((str) => {
            if (parseInt(str) !== NaN) {
                if(str.length === 5) {
                    pr_number = str;
                }
            }
        });
        
        if (pr_number == null) {
            error.log({
                error: 'ERROR: invalid PR url',
                reason: 'your pr url does not have a valid pr number',
                solution: 'please enter a PR with a valid number. ex: https://github.com/organization/repo/12345'
            });
        }
        
        const number = pr_elements[pr_elements.length - 1];

        return github.pullRequests.get({
            number: pr_number,
            owner: 'OpenMail',
            repo: 'Openmail',
        })
    }
}