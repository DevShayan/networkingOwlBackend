function printLog(msg) {
    console.log(`\x1B[37m[LOG] ${msg}\x1B[0m`)
}

function printWarning(msg) {
    console.log(`\x1B[33m[WARNING] ${msg}\x1B[0m`)
}

function printError(msg) {
    console.log(`\x1B[31m[ERROR] ${msg}\x1B[0m`)
}

module.exports = {
    printLog,
    printWarning,
    printError
};