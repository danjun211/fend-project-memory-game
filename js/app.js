/*
 * Create a list that holds all of your cards
 */
let cards = Array.prototype.slice.call(document.querySelectorAll(".deck li.card"));
const scorePanel = document.querySelector(".score-panel");
const stars = document.querySelectorAll(".stars");
const deck = document.querySelector(".deck");
const moves = document.querySelector(".moves");
const popupPanel = document.querySelector(".popup-panel");
const winPopup = document.getElementById("win-popup");

let moveCnt = 0;

let grade = 30;
let score = 3;

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

function restartGame(init = false) {
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
        showStars();
        Timer.stop();
        Timer.reset();
    }
    Timer.start();

    moveCnt = 0;
    moves.textContent = moveCnt;
    cards = shuffle(cards);
    deck.innerHTML = cards.map(card => card.outerHTML).join("");
}

const Timer = (function(){
    let seconds = 0;
    let interval;
    let timeSeconds;

    function init() {
        timeSeconds = document.querySelector(".time-seconds");
    }

    function start() {
        interval = setInterval(() => {
            timeSeconds.textContent = ++seconds;
        }, 1000);
    }

    function stop() {
        clearInterval(interval);
    }

    function reset() {
        seconds = 0;
        timeSeconds.textContent = seconds;
    }

    return {
        start, stop, reset, seconds, init
    }
})();

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => restartGame());

let selectedCards = []; 

winPopup.addEventListener("click", (e) => { 
    if(parseInt(e.target.dataset.isYes)) {
        restartGame();
    }
    e.target.closest(".popup-panel").classList.add("hide");
});

let isClicked = false;

deck.addEventListener("click", (e) => {
    const targetClasses = e.target.classList;

    if(targetClasses.contains("card")) {
        if(!isMatchedAll() && !isClicked) {
            isClicked = true;
            if(!targetClasses.contains("open") && selectedCards.length < 2) {
                targetClasses.add("show");
                targetClasses.add("flip");
                setTimeout(() => {
                    targetClasses.add("open");
                
                    selectedCards.push(e.target);
        
                    if(selectedCards.length === 2){
                        setTimeout(() => {
                            plusMoveAndCalScore();
    
                            if(isMatched(selectedCards)) {
                                selectedCards.forEach(card => {
                                    card.classList.add("match");
                                });
                            }
            
                            selectedCards.forEach(card => {
                                card.classList.remove("show");
                                card.classList.remove("open");
                                card.classList.remove("flip");
                            });
                            selectedCards = [];
        
                            if(isMatchedAll()) {
                                stopGame();
                            }
                            isClicked = false;
                        }, 500);
                    }
                    isClicked = false;
                }, 500);
            }
        } else {

        }
    }
});

function stopGame() {
    Timer.stop();
    popupPanel.classList.remove("hide");
}

function isMatchedAll() {
    return document.querySelectorAll(".match").length === document.querySelectorAll(".card").length
}

function plusMoveAndCalScore() {
    moves.textContent = ++moveCnt;
    grade = 30 - moveCnt;
    if(grade >= 0) {
        if(grade === 15) {
            score--;
            hideStar();
        } else if(grade === 0) {
            score = 1; // min score
            hideStar();
        }
    }
}

function hideStar() {
    for(let star of stars) {
        star.querySelector("li:not(.hide)").classList.add("hide");
    }
}

function showStars() {
    for(let star of stars) {
        let hiddenStar = star.querySelector("li.hide");
        if(hiddenStar !== null) {
            hiddenStar.classList.remove("hide");
        }
    }
}

function isMatched(cards) {
    return (cards[0].dataset.shape === cards[1].dataset.shape)? true : false; 
}

document.addEventListener("DOMContentLoaded", () => {
    restartGame(true);
    Timer.init();

    // for test
    makeMatchAll();
    if(isMatchedAll()) {
        stopGame();
    }
});

// Test Functions 
function makeMatchAll() {
    document.querySelectorAll(".card").forEach(card => card.classList.add("match"));
}