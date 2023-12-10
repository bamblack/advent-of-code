const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const nodeMap = {};
    let steps = '';
    for await (const line of read) {
        if (steps == '') {
            steps = line;
            continue;
        }

        if (line === '') continue;

        const [nodeKey, directionMap] = line.split(' = ').map(s => s.trim());
        const [L, R] = directionMap.slice(1).slice(0, -1).split(', ').map(n => n.trim());
        nodeMap[nodeKey] = { L, R };
    }

    let currentNode = 'AAA';
    let totalSteps = 0;
    while (currentNode !== 'ZZZ') {
        for (const direction of steps) {
            if (currentNode === 'ZZZ') break;
            currentNode = nodeMap[currentNode][direction]
            totalSteps++;
        }
    }

    console.log(`Answer: ${totalSteps}`);
}

execute();