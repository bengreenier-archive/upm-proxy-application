const fs = require('fs')
const path = require('path')
const readline = require('readline')
const semver = require('semver')
const spawn = require('cross-spawn')

const plat = process.platform === 'win32' ? 'win' :
    process.platform === 'darwin' ? 'macos' :
    'linux'
const platBinary = `upm-${plat}${process.platform == 'win32' ? '.exe' : ''}`
const backupBinary = `upm-${plat}.original${process.platform == 'win32' ? '.exe' : ''}`

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Unity Install Directory: ', (ans) => {
    ans = ans.replace(/\\/g, '/')

    if (ans.toLowerCase().endsWith('editor') || ans.toLowerCase().endsWith('editor/')) {
        ans = ans.substring(0, ans.lastIndexOf('ditor') - 1)
    }

    const fsPath = path.join(ans, 'Editor/Data/Resources/Upm')

    try {
        fs.writeFileSync(path.join(fsPath, 'access-test'), "")
        fs.unlinkSync(path.join(fsPath, 'access-test'))
    } catch(ex) {
        console.log(`[ERR] No access to '${fsPath}', try elevating permissions`)
        process.exit(-1)
    }

    tryInstall(fsPath)

    rl.close()
})

function tryInstall(fsPath) {
    const bundleVer = JSON.parse(fs.readFileSync((path.join(__dirname, "../build/proxy-version.json")))).version

    let curVer = spawn.sync(path.join(fsPath, platBinary), ['--proxy-version']).stdout.toString().trim()

    // if we don't have a curVer or it's older than we have bundled
    // or it's invalid semver (ie: help text from the real binary)
    if (semver.parse(curVer) == null || semver.gt(curVer, bundleVer)) {
        copyBinary(fsPath)
        console.log(`patched to ${bundleVer}`)
    } else {
        console.log(`no patch needed, running ${curVer}`)
    }
}

function copyBinary(fsPath) {
    // backup
    fs.copyFileSync(path.join(fsPath, platBinary), path.join(fsPath, backupBinary))

    // use this so we can use literals for the copy, to avoid needing pkg config
    // see https://github.com/zeit/pkg/blob/master/readme.md#detecting-assets-in-source-code
    if (plat === 'win') {
        fs.createReadStream(path.join(__dirname, "../build/proxy-win.exe")).pipe(fs.createWriteStream(path.join(fsPath, platBinary)))
    } else if (plat === 'macos') {
        fs.createReadStream(path.join(__dirname, "../build/proxy-macos")).pipe(fs.createWriteStream(path.join(fsPath, platBinary)))
    } else if (plat === 'linux') {
        fs.createReadStream(path.join(__dirname, "../build/proxy-linux")).pipe(fs.createWriteStream(path.join(fsPath, platBinary)))
    }
}