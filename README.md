# Automatic PR Reminder

## Description
Give a user's name and a github PR link and it will remind them every hour to check out your PR

## Dependencies
nodejs (latest version)
slack app installed on your computer

## Running the App: 
add the ID of the desired user to the users object. ID's can be found by searching for people in users.json
```
user=bob pr=http://github.com/example-pr/12345 node remind.js 
```

## Notes
example of how to tag someone on slack: 'Hey <@U024BE7LH|bob>, did you see my PR?' - remember to use the @ + userID + | + human readable name