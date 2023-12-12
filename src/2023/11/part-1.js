const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });
    
    const galaxies = [] // { x, y, eX, eY }
    let galaxyCount = 0
    let x = 0
    for await (let line of read) {
        const regex = /#/g
        let match
        while ((match = regex.exec(line)) !== null) {
            galaxies.push({ id: ++galaxyCount, x, y: match.index })
        }
        x++
    }

    const maxX = galaxies.reduce((acc, curr) => Math.max(acc, curr.x), 0)
    const maxY = galaxies.reduce((acc, curr) => Math.max(acc, curr.y), 0)
    const rowsWithNoGalaxies = [];
    const colsWithNoGalaxies = [];
    for (let i = 0; i < maxX; i++) {
        if (!galaxies.some(g => g.x === i))
            rowsWithNoGalaxies.push(i)
    }

    for (let i = 0; i < maxY; i++) {
        if (!galaxies.some(g => g.y === i))
            colsWithNoGalaxies.push(i)
    }

    for (const galaxy of galaxies) {
        const emptyRowsAbove = rowsWithNoGalaxies.filter(x => x < galaxy.x).length
        const emptyColsBefore = colsWithNoGalaxies.filter(y => y < galaxy.y).length
        // modify the x/y of our galaxies based on the number of empty rows/cols above/before it
        galaxy.eX = galaxy.x + emptyRowsAbove
        galaxy.eY = galaxy.y + emptyColsBefore
    }

    let totalDistance = 0
    for (let i = 0; i < galaxies.length; i++) {
        const g1 = galaxies[i]
        for (let j = i + 1; j < galaxies.length; j++) {
            const g2 = galaxies[j]
            const dX = Math.abs(g2.eX - g1.eX)
            const dY = Math.abs(g2.eY - g1.eY)
            const distance = dX + dY
            // console.log(`Distance between ${g1.id} (${g1.eX},${g1.eY}) and ${g2.id} (${g2.eX},${g2.eY}): ${distance}`);
            totalDistance += distance
        }
    }

    console.log(`Answer: ${totalDistance}`)
}

execute();