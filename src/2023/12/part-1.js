const fs = require('fs')
const readline = require('readline')
const { chain } = require('lodash')

async function execute() {
    const readStream = fs.createReadStream('input.txt')
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    })

    const records = []; // { input, format }

    for await (const line of read) {
        const [input, unparsedFormat] = line.split(' ')
        const format = unparsedFormat.split(',').map(v => parseInt(v))
        records.push({ input, format })
    }

    function getArrangements(input) {
        let output = []
        let str
        
        while ((str = input.shift()) != null) {
            let newStringsMade = false

            const index = str.indexOf('?')
            if (index > -1) {
                const withPeriod = `${str.substr(0, index)}.${str.substr(index + 1)}`
                const withNum = `${str.substr(0, index)}#${str.substr(index + 1)}`
                // console.log(`Adding ${withPeriod} & ${withNum} from ${str}`)
                input.push(withPeriod, withNum)
                newStringsMade = true
            }

            // if this is a finished string, add it to the output
            if (!newStringsMade) {
                // console.log(`Finished ${str}`)
                output.push(str)
            }
        }

        return output
    }

    let totalValidArrangements = 0;
    for (let i = 0; i < records.length; i++) {
        const record = records[i]
        console.log(`${record.input} (${i} / ${records.length})`)
        // console.log(`Get arrangements...`)
        const arrangements = getArrangements([record.input])
        // console.log('Checking arrangements for for validity')
        // console.log(arrangements);
        const validArrangements = chain(arrangements)
            .map(f => f.split('.').filter(v => v).map(v => v.length))
            .filter(v => {
                if (v.length !== record.format.length) return false;

                for (let i = 0; i < v.length; i++) {
                    if (v[i] !== record.format[i]) return false;
                }

                return true;
            })
            .valueOf()
            .length
        // console.log(`Found ${validArrangements} valid arrangements`)
        totalValidArrangements += validArrangements
        
    }

    console.log(`Answer: ${totalValidArrangements}`)
}

execute();