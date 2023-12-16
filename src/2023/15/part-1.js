const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    let initSequence;
    for await (const line of read) {
        initSequence = line.split(',')
    }

    function getHashCode(str) {
        let v = 0;

        for (let char of str) {
            v += char.charCodeAt(0)
            v *= 17
            v %= 256
        }

        return v;
    }

    console.log(`Answer: ${initSequence.reduce((acc, curr) => acc += getHashCode(curr), 0)}`)
}

execute();