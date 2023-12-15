const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('example.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const map = []
    for await (const line of read) {
        map.push(line.split(''))
    }

    let starting = true;
    let rocksMoved = false;
    while (starting || rocksMoved) {
        starting = false;
        rocksMoved = false;
        for (let i = 1; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
                if (map[i][j] === 'O' && map[i - 1][j] === '.') {
                    rocksMoved = true
                    map[i - 1][j] = 'O'
                    map[i][j] = '.'
                }
            }
        }
    }

    let total = 0;
    for (i = 0; i < map.length; i++) {
        const distanceFromBottom = map.length - i;
        const rockCount = map[i].filter(x => x === 'O').length
        total += rockCount * distanceFromBottom
    }

    console.log(`Answer: ${total}`)
}

execute();