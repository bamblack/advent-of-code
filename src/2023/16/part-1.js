const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const map = []
    const energizedDir = new Set()
    const energized = new Set()
    for await (const line of read) {
        map.push(line.split(''))
    }

    function getNewBeams(beam) {
        const { x, y, dir } = currBeam
        const char = map[y][x]
        console.log(x, y, dir, char)
        const newBeams = []
        switch (char) {
            case '|':
                if (dir === 'l' || dir === 'r') {
                    newBeams.push({ x: beam.x, y: beam.y + 1, dir: 'd' })
                    newBeams.push({ x: beam.x, y: beam.y - 1, dir: 'u' })
                } else if (dir === 'u') {
                    newBeams.push({ x: beam.x, y: beam.y - 1, dir: 'u' })
                } else {
                    newBeams.push({ x: beam.x, y: beam.y + 1, dir: 'd' })
                }
                break;
            case '-': 
                if (dir === 'u' || dir === 'd') {
                    newBeams.push({ x: beam.x - 1, y: beam.y, dir: 'l' })
                    newBeams.push({ x: beam.x + 1, y: beam.y, dir: 'r' })
                } else if (dir === 'l') {
                    newBeams.push({ x: beam.x - 1, y: beam.y, dir: 'l' })
                } else {
                    newBeams.push({ x: beam.x + 1, y: beam.y, dir: 'r' })
                }
                break;
            case '\\':
                if (dir === 'u') {
                    newBeams.push({ x: beam.x - 1, y: beam.y, dir: 'l' })
                } else if (dir === 'r') {
                    newBeams.push({ x: beam.x, y: beam.y + 1, dir: 'd' })
                } else if (dir === 'd') {
                    newBeams.push({ x: beam.x + 1, y: beam.y, dir: 'r' })
                } else if (dir === 'l') {
                    newBeams.push({ x: beam.x, y: beam.y - 1, dir: 'u' })
                }
                break;
            case '/':
                if (dir === 'u') {
                    newBeams.push({ x: beam.x + 1, y: beam.y, dir: 'r' })
                } else if (dir === 'r') {
                    newBeams.push({ x: beam.x, y: beam.y - 1, dir: 'u' })
                } else if (dir === 'd') {
                    newBeams.push({ x: beam.x - 1, y: beam.y, dir: 'l' })
                } else if (dir === 'l') {
                    newBeams.push({ x: beam.x, y: beam.y + 1, dir: 'd' })
                }
                break;
            case '.': 
                if (dir === 'u') {
                    newBeams.push({ x: beam.x, y: beam.y - 1, dir: 'u' })
                } else if (dir === 'r') {
                    newBeams.push({ x: beam.x + 1, y: beam.y, dir: 'r' })
                } else if (dir === 'd') {
                    newBeams.push({ x: beam.x, y: beam.y + 1, dir: 'd' })
                } else if (dir === 'l') {
                    newBeams.push({ x: beam.x - 1, y: beam.y, dir: 'l' })
                }
                break;
        }

        return newBeams
            .filter(b => b.x > -1 && b.y > -1 && b.y < map.length && b.x < map[0].length)
            .filter(b => !energizedDir.has(`${b.x},${b.y},${b.dir}`))
    }

    const beams = [{ x: 0, y: 0, dir: 'r' }]
    let currBeam
    while (currBeam = beams.shift()) {
        energized.add(`${currBeam.x},${currBeam.y}`)
        energizedDir.add(`${currBeam.x},${currBeam.y},${currBeam.dir}`)
        const newBeams = getNewBeams(currBeam)
        beams.push(...newBeams)
    }

    console.log(`Answer: ${energized.size}`)
}

execute();