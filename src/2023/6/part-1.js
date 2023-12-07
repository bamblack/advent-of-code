const fs = require('fs');
const readline = require('readline');

async function execute() {
    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });

    let lineNum = 0;
    let times;
    let distances;

    for await (const line of read) {
        const numbers = line
            .match(/(\d+)/g)
            .map(n => parseInt(n.trim()));

        if (lineNum++ === 0) {
            times = numbers;
        } else {
            distances = numbers;
        }
    }

    const allWinningCombos = [];
    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const distance = distances[i];
        let winningCombos = 0;

        let j = time;
        while (j > 0) {
            const holdTime = time - j;
            const runTime = time - holdTime;
            const coveredDistance = holdTime * runTime;
            if (coveredDistance > distance) {
                winningCombos++;
            }

            
            console.log(`Testing ${j}: Hold Time: ${holdTime}; Run Time: ${runTime}; Distance: ${coveredDistance}; Record Breaker: ${coveredDistance > distance}`);
            j--;
        }

        allWinningCombos.push(winningCombos);
    }

    console.log(allWinningCombos);
    console.log(`Answer: ${allWinningCombos.reduce((acc, curr) => acc *= curr, 1)}`);
}

execute();