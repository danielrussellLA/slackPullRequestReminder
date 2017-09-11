'use-strict'
module.exports = {
    isValidErrorLog(params) {
        return Object.keys(params).sort().join(' ') === ['error', 'reason', 'solution'].sort().join(' ');
    },
    
    log(params, err) {
        if (err) {
            console.log(err);
        }
        if (this.isValidErrorLog(params))  {
            console.log('ERROR:', params.error)
            console.log('REASON:', params.reason)
            console.log('SOLUTION:', params.solution)
        } else {
            console.log('PROGRAM ERROR: please provide an error, reason, and solution to error.log');
        }
    }
    
}
