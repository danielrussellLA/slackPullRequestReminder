# Automatic PR Reminder for Slack

## Description
Reminds a slack user every hour to check out your PR

## Dependencies
- nodejs (latest version)
- Slack app installed on your computer

## Running the App: 
Step 1
- run `npm i` to install dependencies
Step 2
- Get a slack API token from your group's slack here: https://api.slack.com/custom-integrations/legacy-tokens. You will need to be signed into slack to generate a token.
- paste that token into `slack.config.js`:
```
// slack.config.js
module.exports = "<-- your API token here -->";
```
Step 3
- to run the app, execute the following in your terminal with your desired recipient's slack username and a link to your PR:
```
user=bob pr=http://github.com/example-pr/12345 node remind.js 
```
- to send to multiple users at once:
```
user=bob,sally,jamie pr=http://github.com/example-pr/12345 node remind.js 
```

## Notes
example of how to tag someone on slack: 
```
'Hey <@U024BE7LH|bob>, did you see my PR?'
```
- remember to use the @ + userID + | + human readable name