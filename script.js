const grid = document.getElementById("keno-grid");

let selected = [];
const MAX_PICKS = 10;

for (let i = 1; i <= 80; i++) {
    const btn = document.createElement("button");
    btn.className = "number";
    btn.textContent = i;

    btn.onclick = () => {

        if (btn.classList.contains("selected")) {
            btn.classList.remove("selected");
            selected = selected.filter(n => n !== i);
            return;
        }

        if (selected.length >= MAX_PICKS)
            return;

        btn.classList.add("selected");
        selected.push(i);
    };

    grid.appendChild(btn);
}

document.getElementById("clear").onclick = () => {

    selected = [];

    document
        .querySelectorAll(".number")
        .forEach(b => {
            b.classList.remove("selected");
            b.classList.remove("hit");
            b.classList.remove("superball");
        });

    document.getElementById("drawn-balls").innerHTML = "";
};

document.getElementById("quickPick").onclick = () => {

    document.getElementById("clear").click();

    while (selected.length < MAX_PICKS) {

        let n = Math.floor(Math.random() * 80) + 1;

        if (!selected.includes(n)) {

            selected.push(n);

            document
                .querySelectorAll(".number")[n - 1]
                .classList.add("selected");
        }
    }
};

document.getElementById("play").onclick = () => {

    if (selected.length === 0) {
        alert("Select at least one number.");
        return;
    }

    document
        .querySelectorAll(".number")
        .forEach(b => {
            b.classList.remove("hit");
            b.classList.remove("superball");
        });

    document.getElementById("drawn-balls").innerHTML = "";

    let pool = [];

    for (let i = 1; i <= 80; i++)
        pool.push(i);

    pool.sort(() => Math.random() - 0.5);

    let draw = pool.slice(0, 20);

    let hits = 0;

    draw.forEach((ball, index) => {

        setTimeout(() => {

            let chip = document.createElement("div");
            chip.textContent = ball;
            chip.style.margin = "6px";
            chip.style.fontSize = "24px";
            chip.style.fontWeight = "bold";

            if (index === 19)
                chip.style.color = "#ff33cc";

            document
                .getElementById("drawn-balls")
                .appendChild(chip);

            let btn =
                document.querySelectorAll(".number")[ball - 1];

            if (selected.includes(ball)) {

                btn.classList.add("hit");
                hits++;

                if (index === 19)
                    btn.classList.add("superball");
            }

            if (index === 19) {

                document.getElementById("win").textContent = hits;

            }

        }, index * 250);

    });

};
