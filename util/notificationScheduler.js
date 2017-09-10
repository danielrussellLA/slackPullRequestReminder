const path = require('path');
const opn = require('opn');

const notifier = require('node-notifier');



module.exports = {
    notificationQueue: [],
    
    init (pr) {
        setInterval(() => {
            if(this.notificationQueue.length) {
                let notification = this.notificationQueue.shift();
                notification();
            }
        }, 3000)
        
        notifier.on('click', (notifierObject, options) => {
            opn(pr);
        })
    },
    
    send(options) {
        let notifications = {
            reminderSent() {
                notifier.notify({
                    title: `Reminder sent to: ${options.name}`,
                    message: options.pr,
                    sound: true,
                    icon: path.join(__dirname, '../logos/slack-logo.png')
                })
            },
            commentAdded() {
                notifier.notify({
                    title: `someone commented on your PR`,
                    message: options.pr,
                    sound: true,
                    icon: path.join(__dirname, '../logos/github-logo.png'),
                    wait: true
                })
            },
            commentRemoved() {
                notifier.notify({
                    title: `someone removed a comment from your PR`,
                    message: options.pr,
                    sound: true,
                    icon: path.join(__dirname, '../logos/github-logo.png'),
                    wait: true
                })
            },
            readyToMerge() {
                notifier.notify({
                    title: `your PR is good to merge`,
                    message: options.pr,
                    sound: true,
                    icon: path.join(__dirname, '../logos/approved.png'),
                    wait: true
                })
            }
        }
        
        this.notificationQueue.push(notifications[options.type])
        
    }
        
}