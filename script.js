// =====================================
// SUPERBALL KENO
// Part 1 - Setup
// =====================================

const grid = document.getElementById("keno-grid");
const drawArea = document.getElementById("drawnNumbers");
const currentBall = document.getElementById("currentBall");
const message = document.getElementById("message");

const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const winEl = document.getElementById("win");

let credits = 1000;
let bet = 1;
let win = 0;

const MAX_PICKS = 10;
const MAX_BET = 10;

let selected = [];
let drawnNumbers = [];
let playing = false;

const paytable = {
  0: 0,
  1: 0,
  2: 2,
  3: 5,
  4: 20,
  5: 50,
  6: 100,
  7: 250,
  8: 500,
  9: 1000,
  10: 5000
};

function updateMeters() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  winEl.textContent = win;
}

function createBoard() {

  grid.innerHTML = "";

  for (let i = 1; i <= 80; i++) {

    const tile = document.createElement("button");

    tile.className = "number";
    tile.textContent = i;
    tile.dataset.number = i;

    tile.onclick = () => {

      if (playing) return;

      if (selected.includes(i)) {

        selected = selected.filter(n => n !== i);
        tile.classList.remove("selected");

      } else {

        if (selected.length >= MAX_PICKS) return;

        selected.push(i);
        tile.classList.add("selected");

      }

      message.textContent =
        `Selected ${selected.length} of ${MAX_PICKS}`;

    };

    grid.appendChild(tile);

  }

}
// =====================================
// SUPERBALL KENO
// Part 2 - Controls & Drawing
// =====================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("betUp").onclick = () => {
    if (playing) return;

    if (bet < MAX_BET) {
        bet++;
        updateMeters();
    }
};

document.getElementById("betDown").onclick = () => {
    if (playing) return;

    if (bet > 1) {
        bet--;
        updateMeters();
    }
};

document.getElementById("clear").onclick = () => {

    if (playing) return;

    selected = [];

    document.querySelectorAll(".number").forEach(tile => {
        tile.classList.remove("selected");
        tile.classList.remove("hit");
    });

    message.textContent = "Selections cleared.";
};

document.getElementById("quickPick").onclick = () => {

    if (playing) return;

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

    message.textContent = "Quick Pick complete.";
};

document.getElementById("play").onclick = async () => {

    if (playing) return;

    if (selected.length === 0) {
        message.textContent = "Select 1 to 10 numbers.";
        return;
    }

    if (credits < bet) {
        message.textContent = "Not enough credits.";
        return;
    }

    playing = true;

    credits -= bet;
    win = 0;

    updateMeters();

    drawnNumbers = [];
    drawArea.innerHTML = "";

    message.textContent = "Drawing...";
    // =====================================
// SUPERBALL KENO
// Part 3 - Draw & Payout
// =====================================

const draw = [];

while (draw.length < 20) {

    const n = Math.floor(Math.random() * 80) + 1;

    if (!draw.includes(n)) {
        draw.push(n);
    }
}

let hits = 0;

for (const n of draw) {

    currentBall.classList.remove("hidden");
    currentBall.textContent = n;

    drawnNumbers.push(n);

    const ball = document.createElement("div");
    ball.className = "draw-ball";
    ball.textContent = n;

    drawArea.appendChild(ball);

    if (selected.includes(n)) {

        hits++;

        document
            .querySelector(`[data-number="${n}"]`)
            .classList.add("hit");

    }

    await sleep(250);

}

const payout = paytable[hits] || 0;

if (payout > 0) {

    win = payout * bet;
    credits += win;

    message.textContent =
        `🎉 ${hits} hits! You won ${win} credits!`;

} else {

    win = 0;

    message.textContent =
        `No win. ${hits} hit${hits === 1 ? "" : "s"}.`;

}

updateMeters();

playing = false;

currentBall.classList.add("hidden");
};
// =====================================
// SUPERBALL KENO
// Part 4 - Initialize Game
// =====================================

createBoard();
updateMeters();

message.textContent =
    "Welcome to Superball Keno! Select up to 10 numbers.";

currentBall.classList.add("hidden");
