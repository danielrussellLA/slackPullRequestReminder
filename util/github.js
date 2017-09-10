const GithubApi = require('github');
const github = new GithubApi({ Promise: require('bluebird') });
const githubCredentials = require('../config.js').github;
github.authenticate(githubCredentials);

module.exports = {
    getPullRequest(pullrequestUrl) {
        const pr_elements = pullrequestUrl.split('/');
        const number = pr_elements[pr_elements.length - 1];

        return github.pullRequests.get({
            number,
            owner: 'OpenMail',
            repo: 'Openmail',
        })
    }
}