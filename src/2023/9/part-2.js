const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    let lineIndex = 0;
    const history = [];
    for await (const line of read) {
        console.log(`Line from file: ${line}`);
        history.push({ 
            patterns: [line.split(' ').map(n => parseInt(n))]
        });
    }

    function diffs(arr){
        return arr.slice(1).map((num, i) => num - arr[i]);
      }

    let previousNumberInPatternSums = 0;
    for (let entry of history) {
        while(!entry.patterns[entry.patterns.length -1].every(d => d === 0)) {
            const newPattern = diffs(entry.patterns[entry.patterns.length - 1]);
            entry.patterns.push(newPattern);
        }

        let numberToSubtract = 0;
        for (let i = entry.patterns.length - 2; i > -1; i--) {
            const pattern = entry.patterns[i];
            const firstNumberInPattern = pattern[0];
            numberToSubtract = firstNumberInPattern - numberToSubtract;
        }

        console.log(`Previous number in pattern: ${numberToSubtract}`);
        previousNumberInPatternSums += numberToSubtract;
    }

    console.log(`Answer: ${previousNumberInPatternSums}`);
}

execute();