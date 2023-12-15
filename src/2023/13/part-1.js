const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    const inputs = []
    let horizontal = []
    for await (const line of read) {
        if (line !== '') {
            horizontal.push(line)
        } else {
            let vertical = new Array(horizontal[0].length).fill('').map(s => s.slice())
            for (let i = 0; i < vertical.length; i++) {
                for (let j = 0; j < horizontal.length; j++) {
                    vertical[i] += horizontal[j][i]
                }
            }
            inputs.push({ horizontal: horizontal.slice(), vertical: vertical.slice() })
            
            horizontal = []
            vertical = []
        }
    }
    let vertical = new Array(horizontal[0].length).fill('').map(s => s.slice())
    for (let i = 0; i < vertical.length; i++) {
        for (let j = 0; j < horizontal.length; j++) {
            vertical[i] += horizontal[j][i]
        }
    }
    inputs.push({ horizontal: horizontal.slice(), vertical: vertical.slice() })

    // console.log(inputs)

    let total = 0;
    for (let i = 0; i < inputs.length; i++) {
        // console.log(`Checking ${i}`)
        const input = inputs[i];
        const horizontalRowMirror = getMirrorNum(input.horizontal)
        
        if (!horizontalRowMirror) {
            const verticalColMirror = getMirrorNum(input.vertical)

            if (verticalColMirror) {
                console.log(`Found vertical mirror at ${verticalColMirror}`)
                total += verticalColMirror;
            }
        } else {
            console.log(`Found horizontal mirror at ${horizontalRowMirror}`)
            total += (horizontalRowMirror * 100)
        }
    }

    function getMirrorNum(input) {
        let isMatching = false;
        let matchingRows = []

        for (let i = 0; i < input.length - 1; i++) {
            for (let j = 0; j < input.length - i - 1; j++) {
                if (i - j < 0) break;

                console.log('checking', i - j, i + j + 1, input[i - j], input[i + j + 1])
                if (input[i - j] === input[i + j + 1]) {
                    matchingRows.push(i - j)
                    isMatching = true
                } else {
                    machingRows = []
                    isMatching = false
                    break;
                };
            }

            if (isMatching)
                break;
        }

        if (isMatching) return Math.max(...matchingRows) + 1
        else return 0
    }

    console.log(`Answer: ${total}`)
}

execute();