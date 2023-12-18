const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const oppositeDirMap = { 'u': 'd', 'r': 'l', 'd': 'u', 'l': 'r' }
    const map = []
    for await (const line of read) {
        map.push(line.split(''))
    }

    const getKey = ({ x, y }) => `${x}_${y}`
    const getDirKey = ({ x, y, dir }) => `${x}_${y}_${dir}`
    const goDownFrom = ({ x, y }) => ({ x: x + 1, y, dir: 'd' })
    const goLeftFrom = ({ x, y }) => ({ x, y: y - 1, dir: 'l' })
    const goRightFrom = ({ x, y }) => ({ x, y: y + 1, dir: 'r' })
    const goUpFrom = ({ x, y }) => ({ x: x - 1, y, dir: 'u' })
    const getNextMovesFrom = ({ x, y, dir }, path) => {
        const next = []
        switch (map[x][y]) {
            case '.':
                if (dir === 'u') {
                    next.push(goUpFrom({ x, y }))
                } else if (dir === 'r') {
                    next.push(goRightFrom({ x, y }))
                } else if (dir === 'd') {
                    next.push(goDownFrom({ x, y }))
                } else {
                    next.push(goLeftFrom({ x, y }))
                }
                break;
            case '\\':
                if (dir === 'u') {
                    next.push(goLeftFrom({ x, y }))
                } else if (dir === 'r') {
                    next.push(goDownFrom({ x, y }))
                } else if (dir === 'd') {
                    next.push(goRightFrom({ x, y }))
                } else {
                    next.push(goUpFrom({ x, y }))
                }
                break;
            case '/':
                if (dir === 'u') {
                    next.push(goRightFrom({ x, y }))
                } else if (dir === 'r') {
                    next.push(goUpFrom({ x, y }))
                } else if (dir === 'd') {
                    next.push(goLeftFrom({ x, y }))
                } else {
                    next.push(goDownFrom({ x, y }))
                }
                break;
            case '-':
                if (dir === 'u') {
                    next.push(goRightFrom({ x, y }))
                    next.push(goLeftFrom({x, y}))
                } else if (dir === 'r') {
                    next.push(goRightFrom({ x, y }))
                } else if (dir === 'd') {
                    next.push(goLeftFrom({ x, y }))
                    next.push(goRightFrom({x,y}))
                } else {
                    next.push(goLeftFrom({ x, y }))
                }
                break;
            case '|':
                if (dir === 'u') {
                    next.push(goUpFrom({ x, y }))
                } else if (dir === 'r') {
                    next.push(goUpFrom({ x, y }))
                    next.push(goDownFrom({x, y}))
                } else if (dir === 'd') {
                    next.push(goDownFrom({ x, y }))
                } else {
                    next.push(goUpFrom({ x, y }))
                    next.push(goDownFrom({x, y}))
                }
                break;
        }

        return next
            .filter(({ x, y }) => x > -1 && y > -1 && x < map[0].length && y < map.length)
            .filter(({ x, y, dir }) => {
                if (
                    (map[x][y] === '|' && (dir ==='l' || dir === 'r') && path.has(getDirKey({ x, y, dir: oppositeDirMap[dir] }))) ||
                    (map[x][y] === '-' && (dir === 'u' || dir === 'd') && path.has(getDirKey({ x, y, dir: oppositeDirMap[dir] })))
                ) {
                    // console.log(`Hit splitter at ${x},${y} going ${dir} but it's already been hit going ${oppositeDirMap[dir]}`)
                    return false;
                }

                return true;
            });
    }

    const starting = [
        ...(Array.from({ length: map.length }, (v, i) => i).flatMap((v, i) => [`${i},0,r`, `${i},${map[0].length - 1},l`])),
        ...(Array.from({ length: map[0].length }, (v, i) => i).flatMap((v, i) => [`0,${i},d`, `${map.length - 1},${i},u`]))
    ].sort()

    const energizedCounts = []
    let startingFrom
    while (startingFrom = starting.shift()) {
        const [startingX, startingY, startingDir] = startingFrom.split(',')
        const startingFromKey = getDirKey({ x: startingX, y: startingY, dir: startingDir })
        const beams = [{ x: +startingX, y: +startingY, dir: startingDir, history: [] }]
        // console.log(`Starting from: ${startingX},${startingY} going: ${startingDir}`)

        const energized = new Set()
        const path = new Set()
        let totalEnergized = 0
        let currBeam
        while (currBeam = beams.shift()) {
            const { x, y, dir, history } = currBeam
            // console.log(`Processing ${x},${y} (${map[x][y]}) going: ${dir}, with history: ${history.join(';') || 'none'}`)
            const key = getKey({ x, y })
            const dirKey = getDirKey({ x, y, dir })

            if (path.has(dirKey)) {
                // console.log('This path has already been hit in this run, exiting')
                continue;
            }

            const nextIfProcessed = getNextMovesFrom(currBeam, path)
            const nextKeys = nextIfProcessed.map(getDirKey)
            if (nextKeys.some(k => path.has(k))) {
                // console.log('Next path has already been processed, exiting')
                continue;
            }

            // console.log(`Next up: ${nextKeys.join(';')}`)
            beams.push(...(nextIfProcessed.map(n => ({ ...n, history: [...history, dirKey] }))))
            path.add(dirKey)

            if (!energized.has(key)) {
                totalEnergized++
                energized.add(key)
            }
        }

        // console.log(`Ending start from ${startingX},${startingY} going ${startingDir}, total energized count: ${totalEnergized}`)
        energizedCounts.push(totalEnergized)
    }

    console.log(`Answer: ${Math.max(...energizedCounts)}`)
}

execute();