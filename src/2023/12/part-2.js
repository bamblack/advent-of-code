const fs = require('fs')
const readline = require('readline')
const { chain } = require('lodash')

async function execute() {
    const readStream = fs.createReadStream('input.txt')
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    })

    const records = []
    for await (const line of read) {
        const [input, format] = line.split(' ')
        const inputArr = Array(1).fill(input).join('?').split('')
        const formatArr = Array(1).fill(format.split(',').map(e => +e)).flat();
        records.push({ input: inputArr, format: formatArr })
    }

    function process(cache, input, format, inputIndex, formatIndex, anotherIndex) {
        const key = `${inputIndex}|${formatIndex}|${anotherIndex}`;
        if (key in cache) return cache[key]

        if (inputIndex === input.length) {
            if (formatIndex = format.length && anotherIndex === 0) return 1
            if (formatIndex === format.length - 1 && format[formatIndex] === anotherIndex) return 1;
            return 0;
        }

        let ans = 0;
        if (input[inputIndex] === '#' || input[inputIndex] === '?')
            ans += process(cache, input, format, inputIndex + 1, formatIndex, anotherIndex + 1)

        if (input[inputIndex] === '.' || input[inputIndex] === '?') {
            if (anotherIndex  === 0) 
                ans += process(cache, input, format, inputIndex + 1, formatIndex, 0)

            if (anotherIndex > 0 && formatIndex < format.length && format[formatIndex] === anotherIndex)
                ans += process(cache, input, format, inputIndex + 1, formatIndex + 1, 0)
        }

        return (cache[key] = ans)

    }

    const totalValidAnswers = records
            .map(r => process({}, r.input, r.format, 0, 0, 0))
           .reduce((acc, curr) => acc += curr, 0)
    console.log(totalValidAnswers)
}

execute();