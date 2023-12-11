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
        '|': { connects: ['N','S'], output: '│', stepLevelChange: 1 },
        '-': { connects: ['E','W'], output: '─', stepLevelChange: 0 },
        'L': { connects: ['N','E'], output: '└', stepLevelChange: 1 },
        'J': { connects: ['N','W'], output: '┘', stepLevelChange: 1 },
        '7': { connects: ['S','W'], output: '┐', stepLevelChange: 1 },
        'F': { connects: ['S','E'], output: '┌', stepLevelChange: 1 },
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

            currentCoords = nextCoords.slice();
            currentPipe = pipeMap[nextPipeChar];
            comingFrom = connectsFromMap[exitingFrom];
            connected = currentCoords[0] === startingCoords[0] &&currentCoords[1] === startingCoords[1]
            if (!connected) {
                possiblePath.path.push(currentCoords)
            }
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

    // part 2 start
    // create map of all items
    const e = new Array(p.length)
    for (let x = 0; x < p.length; x++) {
        e[x] = new Array(p[0].length);
        for (let y = 0; y < e[x].length; y++) {
            e[x][y] = { char: 'X' }
        }
    }

    // update map with pipe locations
    // store step count for later
    for (let i = 0; i < path.path.length; i++) {
        let coords = path.path[i];
        const [x,y] = coords;
        let pipeChar = p[x][y]
        let pipe = pipeMap[pipeChar]
        if (!pipe) {
            pipeChar = path.pipe
            pipe = pipeMap[pipeChar]
        }
        e[x][y].step = i;
        e[x][y].pipe = pipeChar
        e[x][y].char = pipe.output
    }

    let enclosedTileCount = 0;
    for (let x = 0; x < e.length; x++) {
        // track if we're in enclosed tiles or not on each row
        let inside = false;
        for (let y = 0; y < e[x].length; y++) {
            let entry = e[x][y];
            // if it's a pipe character
            if (entry.char !== 'X') {
                // check for the character beneath it in the plane
                if (x + 1 < e.length) {
                    const entryBelow = e[x + 1][y];
                    // if it's a pipe character
                    if (entryBelow.char !== 'X') {
                        // check what the diff in their step value is
                        const diff = entry.step - entryBelow.step;
                        if (diff === 1) {
                            // if positive you're going up and entering an internal area
                            inside = true;
                        } else if (diff === -1) {
                            // if negative you're going down and exiting an internal area
                            inside = false;
                        }
                    }
                }
            } else {
                // if we're a normal character, check if we're in an internal area or not and if so tally it
                if (inside) {
                    enclosedTileCount++
                } else {
                    e[x][y].char = ' '
                }
            }
        }
    }

    const contents = e.map(r => r.map(c => c.char).join(''))
    fs.writeFile('./output.txt', contents.join('\n'), () => { })
    console.log(`Answer: ${enclosedTileCount}`);
}

execute();