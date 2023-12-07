const fs = require('fs');
const readline = require('readline');

async function execute() {
    const cardMap = {
        A: 13,
        K: 12,
        Q: 11,
        T: 10,
        9: 9,
        8: 8,
        7: 7,
        6: 6,
        5: 5,
        4: 4,
        3: 3,
        2: 2,
        J: 1,
    };

    const readStream = fs.createReadStream('input.txt');
    const read = readline.createInterface({
        crlfDelay: Infinity,
        input: readStream
    });
    const hands = []; // {bid, cards, rank, type, winnings};
    const handsByType = {};

    let handId = 0;
    for await (const line of read) {
        const [handString, bidString] = line.split(' ');
        const cards = handString.split('');
        const cardRanks = cards.map(c => cardMap[c]);
        const bid = parseInt(bidString);

        // group cards
        const cardGroups = cards.reduce((acc, curr) => {
            if (acc[curr] != undefined) {
                acc[curr].push(curr);
            } else {
                acc[curr] = [curr];
            }

            return acc;
        }, {});

        let type = 0;
        // if any wild cards
        if (cards.some(c => c === 'J')) {
            const wildCards = cards.filter(c => c === 'J');
            // if all are wild, then it's 5 of a kind, so we don't do this
            if (wildCards.length !== 5) {
                const normalCards = cards.filter(c => c !== 'J');
                // gruop up the normal cards
                const normalCardGroups = normalCards.reduce((acc, curr) => {
                    if (acc[curr] !== undefined) {
                        acc[curr].push(curr);
                    } else {
                        acc[curr] = [curr];
                    }

                    return acc;
                }, {});
                // sort the card groups by the longest card group or the group with the highest card value
                const sortedNormalCardGroups = Object.values(normalCardGroups).sort((a, b) => {
                    if (a.length === b.length) {
                        return cardMap[b[0]] - cardMap[a[0]];
                    } else {
                        return b.length - a.length;
                    }
                });
                const actAs = sortedNormalCardGroups[0][0];
                // add the wild cards to that group
                cardGroups[actAs].push(...wildCards);
                // delete the wilds group
                delete cardGroups['J']
            }
        }

        // determine what type of hand this is based by the numbers of cards in each group
        const cardGroupVals = Object.values(cardGroups);
        if (cardGroupVals.some(a => a.length === 5)) {
            type = 7; // 5 of a kind
        } else if (cardGroupVals.some(a => a.length === 4)) {
            type = 6; // 4 of a kind
        } else if (cardGroupVals.some(a => a.length === 3) && cardGroupVals.some(a => a.length === 2)) {
            type = 5; // full house
        } else if (cardGroupVals.some(a => a.length === 3) && !cardGroupVals.some(a => a.length === 2)) {
            type = 4; // three of a kind
        } else if (cardGroupVals.some(a => a.length === 2)) {
            // diff between 2 pair and 1 pair
            if (cardGroupVals.filter(a => a.length === 2).length === 2) {
                type = 3; // two pair
            } else {
                type = 2; // one pair
            }
        } else {
            type = 1; // high card
        }
        
        const hand = { id: handId++, bid, cards: cardRanks, type };
        hands.push(hand);
        // group the hands by their type
        if (handsByType[type] !== undefined) {
            handsByType[type].push(hand);
            // sort each hand type group such that hands of the same type but higher card value
            // are sorted higher
            handsByType[type].sort((a, b) => {
                let sortIndex;
                if (a.cards[0] !== b.cards[0]) {
                    sortIndex = 0;
                } else if (a.cards[1] !== b.cards[1]) {
                    sortIndex = 1;
                } else if (a.cards[2] !== b.cards[2]) {
                    sortIndex = 2;
                } else if (a.cards[3] !== b.cards[3]) {
                    sortIndex = 3;
                } else if (a.cards[4] !== b.cards[4]) {
                    sortIndex = 4;
                }

                return b.cards[sortIndex] - a.cards[sortIndex];
            });
        } else {
            handsByType[type] = [hand];
        }
    }

    let rank = hands.length;
    let winnings = 0;
    // go through handsByType, starting from the highest type present
    for (let key of Object.keys(handsByType).map(n => parseInt(n)).sort().reverse()) {
        // handsByType[key] is already sorted such that hands with a higher card value are first
        for (let hand of handsByType[key.toString()]) {
            hand.rank = rank--;
            hand.winnings = hand.rank * hand.bid;
            winnings += hand.winnings;
        }
    }

    console.log(`Answer: ${winnings}`);
}

execute();