module.exports = {
    // enter github username and password
    github: {
        credentials: {
            type: "basic",
            username: USERNAME,
            password: PASSWORD
        },
        repo: {
            owner: OWNER,
            repo: REPO
        }
    },
    // create token at https://api.slack.com/custom-integrations/legacy-tokens
    slack: SLACK_API_TOKEN
}
