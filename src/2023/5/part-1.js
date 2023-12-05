const fs = require('fs');
const readline = require('readline');

async function execute() {
    const fileStream = fs.createReadStream('./example.txt');
    const read = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const almanac = {
        seed: [],
        soil: [],
        fertilizer: [],
        water: [],
        light: [],
        temperature: [],
        humidity: [],
        location: []
    };
    const seeds = [];
    let seedsSet = false;
    let inSection = '';

    for await (const line of read) {
        if (!seedsSet) {
            const [, seedsString] = line.split(':')
            seeds.push(...seedsString.split(' ').filter(v => v).map(v => parseInt(v.trim())));
            seedsSet = true;
            continue;
        }

        if (line.trim() === '') {
            inSection = '';
            continue;
        }

        if (!inSection) {
            const [section, ...dontCare] = line.split('-');
            inSection = section;
            continue;
        }

        const [destinationStart, sourceStart, recordCount] = line.split(' ').filter(v => v).map(v => parseInt(v.trim()));
        almanac[inSection].push(...[{ start: sourceStart, end: sourceStart + recordCount, destinationStart }]);
    }

    let lowest = Infinity;
    for (const seed of seeds) {
        let nextSourceValue = seed;
        for (const almanacKey of ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity', 'location']) {
            const sourceEntry = almanac[almanacKey].find(r => r.start <= nextSourceValue && r.end >= nextSourceValue);
            nextSourceValue = sourceEntry
                ? sourceEntry.destinationStart + nextSourceValue - sourceEntry.start
                : nextSourceValue;
        }

        if (nextSourceValue < lowest) {
            lowest = nextSourceValue;
            console.log('New lowest found', lowest);
        }
    }

    console.log(`Answer: ${lowest}`);
}

execute();