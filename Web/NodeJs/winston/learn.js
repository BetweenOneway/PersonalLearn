let winston = require('./log.js');

winston.log('info', 'Hello log!')
winston.info('Hello info')
winston.error('Hello error')
let name="wangwei";
winston.error(`Hello error ${name}`)