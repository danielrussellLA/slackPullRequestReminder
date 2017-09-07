# Automatic PR Reminder

## Description
Reminds a slack user every hour to check out your PR

## Dependencies
nodejs (latest version)
Slack app installed on your computer

## Running the App: 
- Get a slack API token from your group's slack here: https://api.slack.com/custom-integrations/legacy-tokens. You will need to be signed into slack to generate a token.
- paste that token into the config file:
- to run the app, execute the following in your terminal with your desired recipient's slack username and a link to your PR:
```
user=bob pr=http://github.com/example-pr/12345 node remind.js 
```

## Notes
example of how to tag someone on slack: 'Hey <@U024BE7LH|bob>, did you see my PR?' - remember to use the @ + userID + | + human readable name