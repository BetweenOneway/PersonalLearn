const config = require('config')
const title = config.get('title')

console.log(process.env.NODE_ENV)
console.log(title)
console.log(config.get('db.pwd'))

console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
console.log('NODE_CONFIG_ENV: ' + config.util.getEnv('NODE_CONFIG_ENV'));