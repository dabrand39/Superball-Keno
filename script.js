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
