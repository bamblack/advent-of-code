const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    let initSequence;
    for await (const line of read) {
        initSequence = line.split(',')
    }

    function getHashCode(str) {
        let v = 0;

        for (let char of str) {
            v += char.charCodeAt(0)
            v *= 17
            v %= 256
        }

        return v;
    }

    const hashmap = Array(256).fill(0).reduce((acc, curr, index) => {
        acc[index] = []
        return acc
    }, {})

    for (const sequence of initSequence) {
        if (sequence.indexOf('=') > -1) {
            add = true
            const [label, focalLength] = sequence.split('=')
            const key = getHashCode(label)
            const existing = hashmap[key].findIndex(v => v.label === label);
            if (existing > -1) {
                hashmap[key].splice(existing, 1, { label, focalLength })
            } else {
                hashmap[key].push({ label, focalLength })
            }
        } else {
            const label = sequence.slice(0, -1)
            const key = getHashCode(label)
            const existing = hashmap[key].findIndex(v => v.label === label);
            if (existing > -1) {
                hashmap[key].splice(existing, 1)
            }
        }
    }


    const boxesToTotal = Object.keys(hashmap).filter(k => hashmap[k].length).map(k => +k)
    const boxTotals = boxesToTotal.reduce((boxesTotal, boxKey) => {
        let boxTotal = hashmap[boxKey].reduce((lensesTotal, lens, lensIndex) => {
            let lensTotal = [
                boxKey + 1,
                lensIndex + 1,
                lens.focalLength
            ].reduce((lensTotal, lensMultiplier) => lensTotal *= lensMultiplier, 1)

            console.log(`Totaling lens ${lens.label} ${lens.focalLength} in ${boxKey}: ${lensTotal}`)
            return lensesTotal + lensTotal
        }, 0);
        
        console.log(`Totaling box ${boxKey}: ${boxTotal}`)
        return boxesTotal + boxTotal
    }, 0)
    console.log(`Answer: ${boxTotals}`)
}

execute();