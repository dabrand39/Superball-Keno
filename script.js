const grid = document.getElementById("keno-grid");
const drawArea = document.getElementById("drawn-Numbers");

let credits = 1000;
let bet = 1;
let win = 0;

const MAX_PICKS = 10;
const MAX_BET = 10;

let selected = [];

function updateMeters() {
    creditsEl.textContent = credits;
    betEl.textContent = bet;
    winEl.textContent = win;
}

const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const winEl = document.getElementById("win");

function createBoard() {

    grid.innerHTML = "";

    for (let i = 1; i <= 80; i++) {

        const ball = document.createElement("button");

        ball.className = "number";
        ball.dataset.number = i;
        ball.textContent = i;

        ball.onclick = () => {

            if (ball.classList.contains("selected")) {

                ball.classList.remove("selected");
                selected = selected.filter(n => n !== i);
                return;
            }

            if (selected.length >= MAX_PICKS)
                return;

            selected.push(i);
            ball.classList.add("selected");
        };

        grid.appendChild(ball);
    }
}
document.getElementById("betUp").onclick = () => {
    if (bet < MAX_BET) {
        bet++;
    createBoard();
updateMeters();
    }
};

document.getElementById("betDown").onclick = () => {
    if (bet > 1) {
        bet--;
    createBoard();
updateMeters();
    }
};

document.getElementById("clear").onclick = () => {
    selected = [];
    win = 0;

    drawArea.innerHTML = "";

    document.querySelectorAll(".number").forEach(ball => {
        ball.classList.remove("selected");
        ball.classList.remove("hit");
        ball.classList.remove("superball");
    });

    createBoard();
   updateMeters();
};

document.getElementById("quickPick").onclick = () => {

    document.getElementById("clear").click();

    while (selected.length < MAX_PICKS) {

        const n = Math.floor(Math.random() * 80) + 1;

        if (!selected.includes(n)) {
            selected.push(n);

            document
                .querySelector(`[data-number="${n}"]`)
                .classList.add("selected");
        }
    }
};
document.getElementById("play").onclick = async () => {

    if (selected.length === 0) {
        alert("Select 1 to 10 numbers.");
        return;
    }

    if (credits < bet) {
        alert("Not enough credits.");
        return;
    }

    credits -= bet;
    win = 0;
    createBoard();
updateMeters();

    drawArea.innerHTML = "";

    document.querySelectorAll(".number").forEach(ball => {
        ball.classList.remove("hit");
        ball.classList.remove("superball");
    });

    const drawn = [];

    while (drawn.length < 20) {
        const n = Math.floor(Math.random() * 80) + 1;
        if (!drawn.includes(n)) drawn.push(n);
    }

    let hits = 0;

    for (let i = 0; i < drawn.length; i++) {

        const n = drawn[i];

        const chip = document.createElement("div");
        chip.className = "draw-ball";
        chip.textContent = n;

        if (i === 19)
            chip.classList.add("superball");

        drawArea.appendChild(chip);

        const square = document.querySelector(`[data-number="${n}"]`);

        if (selected.includes(n)) {
            hits++;
            square.classList.add("hit");

            if (i === 19)
                square.classList.add("superball");
        }

        await new Promise(resolve => setTimeout(resolve, 250));
    }

    const paytable = {
        4: 1,
        5: 3,
        6: 8,
        7: 50,
        8: 300,
        9: 1500,
        10: 5000
    };

    if (paytable[hits]) {
        win = paytable[hits] * bet;
        credits += win;
    }
    highlightHits();
    updateMeters();
playing = false;
    
    function updateDrawBoard(){
        
    const board = document.getElementById("drawnNumbers");

    board.innerHTML = "";

    drawnNumbers.forEach(number=>{

        const ball=document.createElement("div");

        ball.className="draw-ball";

        ball.textContent=number;

        board.appendChild(ball);

    });

}
  function highlightHits(){

    document.querySelectorAll(".number").forEach(tile=>{

        const number = Number(tile.textContent);

        if(
            selected.includes(number) &&
            drawnNumbers.includes(number)
        ){
            tile.classList.add("hit");
        }

    });

}  
createBoard();
updateMeters();
    
