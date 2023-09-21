const ervy = require("ervy");
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
    let new_range = a[k].range / 2;
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
    let a = [
        { picked: 0, name: "Hubert", range: 0 },
        { picked: 0, name: "Karol", range: 0 },
        { picked: 0, name: "Kush", range: 0 },
        { picked: 0, name: "Mariusz", range: 0 },
        { picked: 0, name: "Piotr C", range: 0 },
        { picked: 0, name: "Piotr K", range: 0 },
        { picked: 0, name: "Rafał", range: 0 },
        { picked: 0, name: "Rushil", range: 0 },
        { picked: 0, name: "Seba", range: 0 },
    ];

    // let a = await readFromFile(file);
    let k = a.length;
    let range = 1 / k;
    for (let o of a) {
        o.range = range;
    }
    drawData(a);
    await writeToFile(file, a);
}

function drawData(a, person) {
    if (!person) person = 0;
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
    console.log(bullet(chart_data));
}

async function go(initialize) {
    if (initialize) {
        await init();
        return;
    }
    let a = await readFromFile(file);
    let person = search_person(a);
    console.log(`\n\n\n\nWinner --------->    ${a[person].name}\n\n\n`);
    change_ranges(a, person);
    drawData(a, person);
    let result = writeToFile(file, a);
}

const file = "random.json";
// set to true / 1 to reset
const initialize = 1;
go(initialize);
