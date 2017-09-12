<span><img src="./icons/terminal.png" height='100px' /></span>
<span><img src="./icons/slack-logo.png" height='100px' /></span>
<span><img src="./icons/github-logo.png" height='100px' /></span>
<span><img src="./icons/approved.png" height='100px' /></span>

# Slack Pull Request Reminder

## Description
An automatic reminder scheduler for Slack. Sends Slack messages every hour under your user name to remind teammates to check out your github pull request.

## Dependencies
- nodejs (6.11.3LTS or higher) <a href='https://nodejs.org'>https://nodejs.org</a>
- Slack <a href='https://slack.com/downloads'>https://slack.com/downloads</a>

## Running the App: 
### Step 1 Install Dependencies
- run `npm i` to install dependencies

### Step 2 Setup your github and slack in config.js
- Get a slack API token from your group's slack here: https://api.slack.com/custom-integrations/legacy-tokens. You will need to be signed into slack to generate a token.
- paste that token into `config.js`:
- enter in all your github info too
```
// config.js
module.exports = {
    // enter github username and password
    github: {
        credentials: {
            type: "basic",
            username: GITHUB_USERNAME,
            password: GITHUB_PASSWORD
        },
        repo: {
            owner: OWNER,
            repo: REPO
        }
    },
    // create token at https://api.slack.com/custom-integrations/legacy-tokens
    slack: SLACK_API_TOKEN
}
```

### Step 3 Run the app
- to run the app, execute the following in your terminal with your desired recipient's slack username and a link to your PR:
```
user=bob pr=http://github.com/example-pr/12345 node remind.js 
```
- to send to multiple users at once:
```
user=bob,sally,jamie pr=http://github.com/example-pr/12345 node remind.js 
```
### Step 4
- keep the app running in a terminal tab for as long as you want to keep reminding people. the app will remind people up to 5 times per time you run it
- to stop reminding people, press `Ctrl + C` to quit the app.
## Notes
example of how to tag someone on slack: 
```
'Hey <@U024BE7LH|bob>, did you see my PR?'
```
- remember to use the @ + userID + | + human readable name

## Bonus
If you're tired of updating your branch to sync with master as your teammates merge their pull requests, add this snippet to your browser's bookmarlet tab and run it on your PR's page until your PR merges.
`javascript:window.setInterval(function(){ console.log('attempting to merge...'); Array.from(document.getElementsByTagName("button")).filter(function(btn){ return btn.innerText in {'Update branch':1, 'Merge pull request':2, 'Confirm merge':3, 'Try again': 4, 'Delete branch': 5} && !btn.disabled}).map(function(btn){btn.click()}) }, 3000)`
