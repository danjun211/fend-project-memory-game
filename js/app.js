/*
 * Create a list that holds all of your cards
 */
let cards = Array.prototype.slice.call(document.querySelectorAll(".deck li.card"));
const scorePanel = document.querySelector(".score-panel");
const stars = document.querySelector(".stars");
const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const popupPanel = document.querySelector(".popup-panel");

let moveCnt = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function restart(init = true) {
    if(!init) {
        for(let card of cards) {
            if(card.classList.contains("match")) {
                card.classList.remove("match");
            }
            if(card.classList.contains("open")) {
                card.classList.remove("open");
            }
            if(card.classList.contains("show")) {
                card.classList.remove("show");
            }
        }
    }
    moveCnt = 0;
    moves.textContent = moveCnt;
    cards = shuffle(cards);
    deck.innerHTML = cards.map(card => card.outerHTML).join("");
}

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", restart.bind(this, false));

let selectedCards = []; 

popupPanel.addEventListener("click", (e) => { 
    e.currentTarget.classList.add("hide");
});

deck.addEventListener("click", (e) => {
    const targetClasses = e.target.classList;

    if(targetClasses.contains("card")) {
        if(!isMatchedAll()) {
            if(!targetClasses.contains("open") && selectedCards.length < 2) {
                targetClasses.add("show");
                targetClasses.add("open");
                selectedCards.push(e.target);
    
                if(selectedCards.length === 2){
                    plusMove();
    
                    if(isMatched(selectedCards)) {
                        selectedCards.forEach(card => {
                            card.classList.add("match");
                        });
                    }
    
                    setTimeout(() => {
                        selectedCards.forEach(card => {
                            card.classList.remove("show");
                            card.classList.remove("open");
                        });
                        selectedCards = [];
                    }, 500);

                    if(isMatchedAll()) {
                        popupPanel.classList.remove(".hide");
                    }
                }
            }
        } else {

        }
    }
});

function isMatchedAll() {
    return document.querySelectorAll(".match").length === document.querySelectorAll(".card").length
}

function plusMove() {
    moves.textContent = ++moveCnt;
}

function isMatched(cards) {
    return (cards[0].dataset.shape === cards[1].dataset.shape)? true : false; 
}

document.addEventListener("DOMContentLoaded", () => {
    restart();
});

