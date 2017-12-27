const spawn = require('cross-spawn')
const path = require('path')
const currentVersion = require('./package.json').version
const plat = process.platform === 'win32' ? 'win' :
process.platform === 'darwin' ? 'macos' :
'linux'
const platBinary = `upm-${plat}.original${process.platform == 'win32' ? '.exe' : ''}`

// just do version
if (process.argv.indexOf('--proxy-version') != -1) {
    console.log(currentVersion)
    process.exit(0)
    return
}

// patch in the flag to ignore TLS errors
let incomingEnv = process.env
incomingEnv['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

// run
const res = spawn.sync(`${path.join(path.dirname(process.execPath), platBinary)}`,
    process.argv.slice(2),
    {stdio: 'inherit', env: incomingEnv})
    
process.exit(res.status)