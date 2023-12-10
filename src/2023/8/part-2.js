const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const nodeMap = {};
    let currentNodes = [];
    let steps = '';
    for await (const line of read) {
        if (steps == '') {
            steps = line;
            continue;
        }

        if (line === '') continue;

        const [nodeKey, directionMap] = line.split(' = ').map(s => s.trim());
        if (nodeKey.endsWith('A')) {
            currentNodes.push(nodeKey);
        }
        const [L, R] = directionMap.slice(1).slice(0, -1).split(', ').map(n => n.trim());
        nodeMap[nodeKey] = { L, R };
    }

    const stepsCountsForNodes = Array(currentNodes.length).fill(0);
    for (let i = 0; i < currentNodes.length; i++) {
        while (!currentNodes[i].endsWith('Z')) {
            for (const direction of steps) {
                currentNodes[i] = nodeMap[currentNodes[i]][direction];
                stepsCountsForNodes[i]++;

                if (currentNodes[i].endsWith("Z")) break;
            }
        }
    }

    function lcm(...stepCounts) {
        return stepCounts.reduce((a, b) => a * b / gcd(a, b));
    }
    
    function gcd(a, b) {
        return !b ? a : gcd(b, a % b);
    }

    console.log(`Answer: ${lcm(...stepsCountsForNodes)}`)
}

execute();