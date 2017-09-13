const GithubApi = require('github');
const github = new GithubApi({ Promise: require('bluebird') });
const githubConfig = require('../config.js').github;
const githubRepo = githubConfig.repo;
const githubCredentials = githubConfig.credentials;
github.authenticate(githubCredentials);

const error = require('./error');

module.exports = {
    getPullRequest(pullrequestUrl) {
        const pr_number = pullrequestUrl.split('/').reverse()[0];
        return github.pullRequests.get(Object.assign(githubRepo, { number: pr_number }))
    }
}
