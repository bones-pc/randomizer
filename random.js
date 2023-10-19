const ervy = require("ervy");
const readline = require("readline");
const { bullet, bar, bg } = ervy;
const fs = require("fs");

function search_person(a) {
    let k = 0;
    let cumulative = a[0].range;
    let random_num = Math.random();
    while (k < a.length) {
        if (random_num < cumulative) {
            a[k].picked += 1;
            return k;
        }
        k++;
        cumulative += a[k].range;
    }
    return k--;
}

function change_ranges(a, k) {
    let new_range = a[k].range / DIVIDED_BY;
    a[k].range = new_range;
    a.forEach((e, i) => {
        if (i == k) return;
        e.range += new_range / (a.length - 1);
    });
    return;
}

async function writeToFile(file, a) {
    const result = await fs.writeFileSync(file, JSON.stringify(a));
    return;
}

async function readFromFile(file) {
    const result = fs.readFileSync(file, { encoding: "utf-8" });
    const json = await JSON.parse(result);
    return json;
}

async function init() {
    //   let a = [
    //     { picked: 0, name: "Hubert", range: 0 },
    //     { picked: 0, name: "Karol", range: 0 },

    //     { picked: 0, name: "Mariusz", range: 0 },
    //     { picked: 0, name: "Piotr C", range: 0 },
    //     { picked: 0, name: "Piotr K", range: 0 },
    //     { picked: 0, name: "Rafał", range: 0 },
    //     { picked: 0, name: "Rushil", range: 0 },

    //   ];

    let a = await readFromFile(file);
    let k = a.length;
    let range = 1 / k;
    for (let o of a) {
        o.range = range;
    }
    drawData(a);
    await writeToFile(file, a);
}

function drawData(a, person, small) {
    if (!person) person = 0;
    let opts = { padding: 1 };
    if (small) {
        opts = { padding: 0 };
    }
    const chart_data = a.map((i) => {
        let colour = "blue";
        if (i.name == a[person].name) colour = "red";
        return {
            key: `${i.name}, picked: ${i.picked}, chance: ${Math.floor(
                100 * i.range
            )}%`,
            value: i.picked,
            style: bg(colour),
        };
    });
    console.log(bullet(chart_data, opts));
}

async function removePerson(name) {
    let ppl = await readFromFile(file);
    const odds_to_remove = ppl.filter((p) => p.name === name)[0].range;
    const len = ppl.length - 1;
    ppl = ppl.filter((p) => p.name !== name);
    ppl = ppl.map((p) => {
        if (p.name !== name) {
            p.range += odds_to_remove / len;
            return p;
        }
    });
    await writeToFile(file, ppl);
}

async function userAccepted(text) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    async function getUserInput() {
        return new Promise((resolve) => {
            rl.question(text, (answer) => {
                resolve(answer);
            });
        });
    }
    while (true) {
        const result = await getUserInput();
        if (result === "y" || result === "Y") {
            rl.close();
            return true;
        }
        if (result === "n" || result === "N") {
            rl.close();
            return false;
        }
    }
}

async function go(initialize) {
    if (initialize) {
        await init();
        return;
    }
    let a;
    let accept = false;

    while (!accept) {
        a = await readFromFile(file);
        // name = a.filter((p) => p?.last)[0].name;
        console.log(`Last time: `);
        drawData(a, 0, true);
        console.log();
        const draw = await userAccepted("Press 'y' to draw...   ");
        let person = search_person(a);
        console.log(`\n\n\n\nWinner --------->    ${a[person].name}\n\n\n`);
        change_ranges(a, person);
        drawData(a, person, true);
        accept = await userAccepted("Is it ok? (y/n)   ");
    }

    let result = writeToFile(file, a);
}

const DIVIDED_BY = 2;
const file = "random.json";
// set to true / 1 to reset
const initialize = 0;
// removePerson("Kush");
go(initialize);
