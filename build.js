const fs = require('fs')
const { exec } = require('pkg');

(async function() {
    await exec([__dirname + '/proxy', '--target', 'win', '--output', __dirname + '/build/proxy-win'])
    await exec([__dirname + '/proxy', '--target', 'linux', '--output', __dirname + '/build/proxy-linux'])
    await exec([__dirname + '/proxy', '--target', 'macos', '--output', __dirname + '/build/proxy-macos'])

    fs.writeFileSync(__dirname + '/build/proxy-version.json', JSON.stringify({
        version: require(__dirname + '/proxy/package.json').version
    }))

    await exec([__dirname + '/patcher', '--debug', '--target', 'win', '--output', __dirname + '/build/patcher-win'])
    await exec([__dirname + '/patcher', '--target', 'linux', '--output', __dirname + '/build/patcher-linux'])
    await exec([__dirname + '/patcher', '--target', 'macos', '--output', __dirname + '/build/patcher-macos'])

})().then(() => console.log("done"), console.error)