const grid = document.getElementById("keno-grid");
const drawArea = document.getElementById("drawn-balls");

let credits = 1000;
let bet = 1;
let selected = [];

const MAX_PICKS = 10;

function updateMeters() {
    document.getElementById("credits").textContent = credits;
    document.getElementById("bet").textContent = bet;
}

function createBoard() {
    grid.innerHTML = "";

    for (let i = 1; i <= 80; i++) {
        const cell = document.createElement("button");
        cell.className = "number";
        cell.textContent = i;

        cell.onclick = () => {

            if (cell.classList.contains("selected")) {
                cell.classList.remove("selected");
                selected = selected.filter(n => n !== i);
                return;
            }

            if (selected.length >= MAX_PICKS)
                return;

            selected.push(i);
            cell.classList.add("selected");
        };

        grid.appendChild(cell);
    }
}

document.getElementById("quickPick").onclick = () => {

    document.getElementById("clear").click();

    while (selected.length < MAX_PICKS) {

        let n = Math.floor(Math.random() * 80) + 1;

        if (!selected.includes(n)) {

            selected.push(n);

            grid.children[n - 1].classList.add("selected");
        }
    }
};

document.getElementById("clear").onclick = () => {

    selected = [];

    drawArea.innerHTML = "";

    document
        .querySelectorAll(".number")
        .forEach(b => {
            b.classList.remove("selected");
            b.classList.remove("hit");
            b.classList.remove("superball");
        });

    document.getElementById("win").textContent = "0";
};

document.getElementById("betUp").onclick = () => {
    bet++;
    updateMeters();
};

document.getElementById("betDown").onclick = () => {
    if (bet > 1) bet--;
    updateMeters();
};

document.getElementById("play").onclick = () => {

    if (selected.length === 0) {
        alert("Select 1 to 10 numbers.");
        return;
    }

    drawArea.innerHTML = "";

    document
        .querySelectorAll(".number")
        .forEach(b => {
            b.classList.remove("hit");
            b.classList.remove("superball");
        });

    let balls = [];

    while (balls.length < 20) {

        let n = Math.floor(Math.random() * 80) + 1;

        if (!balls.includes(n))
            balls.push(n);
    }

    let hits = 0;

    balls.forEach((ball, index) => {

        setTimeout(() => {

            const chip = document.createElement("div");
            chip.textContent = ball;
            chip.style.fontSize = "24px";
            chip.style.margin = "6px";

            if (index === 19)
                chip.style.color = "#ff44ff";

            drawArea.appendChild(chip);

            const square = grid.children[ball - 1];

            if (selected.includes(ball)) {

                hits++;

                square.classList.add("hit");

                if (index === 19)
                    square.classList.add("superball");
            }

            if (index === 19)
                document.getElementById("win").textContent = hits;

        }, index * 250);

    });

};

createBoard();
updateMeters();
// ===== Animated Ball Draw =====

async function animateDraw(numbers) {
    const drawBox = document.getElementById("drawNumbers");
    drawBox.innerHTML = "";

    for (let i = 0; i < numbers.length; i++) {

        const ball = document.createElement("div");
        ball.className = "draw-ball";
        ball.textContent = numbers[i];

        drawBox.appendChild(ball);

        const tile = document.querySelector(
            `[data-number="${numbers[i]}"]`
        );

        if (tile) {
            tile.classList.add("drawn");
        }

        await new Promise(r => setTimeout(r, 350));
    }
            }
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

    updateMeters();

    drawArea.innerHTML = "";

    document.querySelectorAll(".number").forEach(n => {
        n.classList.remove("hit");
        n.classList.remove("superball");
    });

    const balls = [];

    while (balls.length < 20) {
        let n = Math.floor(Math.random() * 80) + 1;

        if (!balls.includes(n))
            balls.push(n);
    }

    let hits = 0;

    for (let i = 0; i < balls.length; i++) {

        const ball = balls[i];

        const chip = document.createElement("div");

        chip.className = "draw-ball";
        chip.textContent = ball;

        if (i === 19)
            chip.classList.add("superball");

        drawArea.appendChild(chip);

        const square =
            document.querySelector(`[data-number="${ball}"]`);

        if (selected.includes(ball)) {

            hits++;

            square.classList.add("hit");

            if (i === 19)
                square.classList.add("superball");
        }

        await new Promise(r => setTimeout(r, 250));
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

    updateMeters();
};
// ---------- Game Initialization ----------

createBoard();
updateMeters();

console.log("Superball Keno Loaded");

// Optional: Press Enter to play
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.getElementById("play").click();
    }
});

// Optional: Double-click a selected number to remove it
grid.addEventListener("dblclick", (e) => {

    if (!e.target.classList.contains("number")) return;

    const num = Number(e.target.dataset.number);

    if (selected.includes(num)) {
        selected = selected.filter(n => n !== num);
        e.target.classList.remove("selected");
    }

});

// Future Features:
// - Superball multiplier
// - Real Keno paytable
// - Gamble feature
// - DIP switch settings
// - Auto Play
// - Sound effects
// - Ball blower animation
// - Progressive jackpot
