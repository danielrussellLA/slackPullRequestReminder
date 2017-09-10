'use-strict'
// docs https://www.npmjs.com/package/node-notifier
const notifier = require('node-notifier');

notifier.notify({
    title: 'GitHub PR Commment',
    message: 'Someone commented on your PR',
    sound: true
});

// notifer.on('click', (notifierObject, options) => {
    // Triggers if `wait: true` and user clicks notification 
// });
