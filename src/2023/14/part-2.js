const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const mapCycleCache = {};
    const mapDirectionCache = {};
    let originalMap = []
    let map = []
    for await (const line of read) {
        originalMap.push(line.split(''))
        map.push(line.split(''))
    }

    function checkCycleCache() {
        const cacheCode = getStringifiedMap()
        let cycleFound = false;

        if (mapCycleCache[cacheCode]) {
            console.log('Cycle found')
            cycleFound = true
        }

        return { cacheCode, cycleFound }
    }

    function checkDirectionCacheAndSetMap(prefix) {
        const cacheCode = getDirectionCacheCode(prefix);
        let setMap = false;
        if (mapDirectionCache[cacheCode]) {
            console.log(`Cache found for ${prefix}`);
            map = mapDirectionCache[cacheCode].split(';').map(r => r.split(''));
            setMap = true;
        }

        return { cacheCode, setMap };
    }

    function getDirectionCacheCode(prefix) {
        return `${prefix}_${getStringifiedMap()}`
    }

    function getStringifiedMap() {
        return map.map(r => r.join('')).join(';')
    }

    function n() {
        const status = checkDirectionCacheAndSetMap('n');
        if (status.setMap) {
            return true;
        }

        for (let i = 0; i < map[0].length; i++) {
            const result = slideLeft(map.map(r => r[i]).join('')).split('')

            for (let j = 0; j < map.length; j++) {
                map[j][i] = result[j]
            }
        }

        mapDirectionCache[status.cacheCode] = getStringifiedMap()
        return false
    }

    function w() {
        const status = checkDirectionCacheAndSetMap('w');
        if (status.setMap) {
            return true;
        }

        for (let i = 0; i < map.length; i++) {
            const result = slideLeft(map[i].join('')).split('')
            map[i] = result
        }

        mapDirectionCache[status.cacheCode] = getStringifiedMap()
        return false
    }

    function s() {
        const status = checkDirectionCacheAndSetMap('s');
        if (status.setMap) {
            return true;
        }

        for (let i = 0; i < map[0].length; i++) {
            const result = slideLeft(map.map(r => r[i]).reverse().join('')).split('').reverse()

            for (let j = 0; j < map.length; j++) {
                map[j][i] = result[j]
            }
        }

        mapDirectionCache[status.cacheCode] = getStringifiedMap()
        return false
    }

    function e() {
        const status = checkDirectionCacheAndSetMap('e');
        if (status.setMap) {
            return true;
        }

        for (let i = 0; i < map.length; i++) {
            const result = slideLeft(map[i].reverse().join('')).split('').reverse()
            map[i] = result
        }

        mapDirectionCache[status.cacheCode] = getStringifiedMap()
        return false
    }

    const portionCache = {};
    function slideLeft(str) {
        return str
            .split('#')
            .map(x => {
                if (portionCache[x]) {
                    return portionCache[x]
                }

                let xx = x;
                if (x) {
                    const oCount = (x.match(/(O)/g) || []).length
                    if (oCount) {
                        xx = `${Array(oCount).fill('O').join('')}${Array(x.length - oCount).fill('.').join('')}`
                    }
                }

                return portionCache[x] = xx;
            }).join('#')
    }

    let cycleSize = 0
    let iter = 0;
    while (!cycleSize) {
        const cycle = checkCycleCache();
        if (cycle.cycleFound) {
            cycleSize = iter
            continue;
        }

        n()
        w()
        s()
        e()

        mapCycleCache[cycle.cacheCode] = iter++
    }

    const currentIter = mapCycleCache[getStringifiedMap()]
    const remainder = (1000 - cycleSize) % (cycleSize - currentIter)
    const finalKey = currentIter + remainder
    const finalState = Object.keys(mapCycleCache).find(k => mapCycleCache[k] === finalKey)
    map = finalState.split(';').map(r => r.split(''))


    console.log(`Cycle Length: ${cycleSize}, ${finalKey}`);


    fs.writeFile('output.txt', map.map(r => r.join('')).join('\n'), () => { })

    let total = 0;
    for (let i = 0; i < map.length; i++) {
        const distanceFromBottom = map.length - i
        const rockCount = map[i].filter(x => x === 'O').length
        total += rockCount * distanceFromBottom
    }

    console.log(`Answer: ${total}`)
}

execute();