const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deck, turns = 10; // define common game variables

// A simple blackjack game built for use with Discord :D
// Using source code from ThatSoftwareDude's "How to Code Blackjack Using JavaScript".
// Source: https://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript

// create our card deck
function createDeck() {
    deck = new Array();
    for (let v = 0; v < values.length; v++) {
        for (let s = 0; s < suits.length; s++) {
            let weight = parseInt(values[v]);
            switch(values[v]) {
                case "J":
                case "Q":
                case "K":
                    weight = 10;
                    break;
                case "A":
                    weight = 11;
                    break;
            };
            let card = { value: values[v], suit: suits[s], weight: weight };
            deck.push(card);
        };
    };
};
// deal a card to each player
function dealHands(players) {
    for (let c = 0; c < 2; c++) {
        // deal a card to each player
        for (let i = 0; i < players.length; i++) {
            players[i].hand.push(deck.pop());
        };
    };
};
// shuffle our card deck
function shuffleDeck() {
    for (let i = 0; i < turns; i++) {
        let pos1 = Math.floor((Math.random() * deck.length));
        let pos2 = Math.floor((Math.random() * deck.length));
        let temp = deck[pos1];
        deck[pos1] = deck[pos2];
        deck[pos2] = temp;
    };
};
// export game functions
module.exports = {
    createDeck,
    dealHands,
    shuffleDeck
};
/*
module.exports = () => {
    // TODO: Implement blackjack game logic here
};
*/