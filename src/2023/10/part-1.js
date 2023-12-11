const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    let startingCoords = [];
    let x = 0;
    const p = [];
    let stepCount = 0;

    const connectsFromMap = {
        'N': 'S',
        'E': 'W',
        'S': 'N',
        'W': 'E'
    }
    const pipeMap = {
        '|': { connects: ['N','S'] },
        '-': { connects: ['E','W'] },
        'L': { connects: ['N','E'] },
        'J': { connects: ['N','W'] },
        '7': { connects: ['S','W'] },
        'F': { connects: ['S','E'] },
        '.': { connects: [], connectsTo: [] },
    }

    let path = undefined;
    for await (const line of read) {
        const row = line.split('');
        const y = row.indexOf('S');
        if (y > -1) {
            startingCoords = [x, y];
        }

        p[x++] = row;
    }

    for (let pipeToTest of ['|','-','L','J','7','F']) {
        let currentPipe = pipeMap[pipeToTest];
        let currentCoords = startingCoords.slice();
        let comingFrom = connectsFromMap[currentPipe.connects[0]];

        let valid = true;
        let connected = false;
        let possiblePath = { pipe: pipeToTest, path: [currentCoords], valid }

        while (valid && !connected) {
            const exitingFrom = currentPipe.connects.find(c => c !== comingFrom);
            if (!exitingFrom) {
                valid = false;
                continue;
            }

            switch (exitingFrom) {
                case 'N': 
                    nextCoords = [currentCoords[0] - 1, currentCoords[1]];
                    break;
                case 'E': 
                    nextCoords = [currentCoords[0], currentCoords[1] + 1];
                    break;
                case 'S': 
                    nextCoords = [currentCoords[0] + 1, currentCoords[1]];
                    break;
                case 'W': 
                    nextCoords = [currentCoords[0], currentCoords[1] - 1];
                    break;
            }

            if (!nextCoords || !isCoordInPlane(nextCoords)) {
                valid = false;
                continue;
            }

            const [x,y] = currentCoords;
            const [nX,nY] = nextCoords;
            let currentPipeChar = p[x][y]
            let nextPipeChar = p[nX][nY]
            
            if (currentPipeChar === 'S') currentPipeChar = pipeToTest;
            if (nextPipeChar === 'S') nextPipeChar = pipeToTest;

            const nextPipeMustConnectFrom = connectsFromMap[exitingFrom];
            const nextPipe = pipeMap[nextPipeChar];
            if (nextPipe.connects.indexOf(nextPipeMustConnectFrom) === -1) {
                valid = false;
                continue;
            }

            console.log(`Testing: ${currentPipeChar} at ${currentCoords}, connecting to ${nextPipeChar} at ${nextCoords}, coming from ${comingFrom}`);

            currentCoords = nextCoords.slice();
            possiblePath.path.push(currentCoords)
            currentPipe = pipeMap[nextPipeChar];
            comingFrom = connectsFromMap[exitingFrom];
            connected = currentCoords[0] === startingCoords[0] &&currentCoords[1] === startingCoords[1]
        }

        if (valid) {
            path = possiblePath
            break;
        }
    }

    function isCoordInPlane(coords) {
        return coords.length === 2
               && coords[0] > -1 && coords[1] > -1
               && coords[0] < p.length && coords[1] < p[0].length
    }

    console.log(`Answer: ${(path.path.length - 1) / 2}`);
}

execute();