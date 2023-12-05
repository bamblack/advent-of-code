const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    for await (const line of read) {
        console.log(`Line from file: ${line}`);
        // start your adventure here
    }
}

execute();