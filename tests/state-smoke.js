const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const storage = new Map();
let pickupToast = null;

function makeElement() {
  return {
    children: [],
    className: "",
    classList: {
      add() {},
      remove() {}
    },
    hidden: false,
    innerHTML: "",
    offsetWidth: 0,
    removed: false,
    style: {},
    textContent: "",
    append(...children) {
      this.children.push(...children);
      children.forEach((child) => {
        if (child.className === "pickup-toast") {
          pickupToast = child;
        }
      });
    },
    remove() {
      this.removed = true;
    },
    setAttribute() {}
  };
}

const outsideElement = makeElement();
const stage = makeElement();
const context = vm.createContext({
  AREAS: {
    outside: { element: outsideElement }
  },
  Array,
  JSON,
  Map,
  Math,
  Number,
  Set,
  clearTimeout() {},
  console,
  document: {
    body: makeElement(),
    head: makeElement(),
    createElement: makeElement,
    getElementById() {
      return null;
    },
    querySelector(selector) {
      return selector === ".pickup-toast" ? pickupToast : null;
    },
    querySelectorAll() {
      return [];
    }
  },
  requestAnimationFrame() {},
  sessionStorage: {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    removeItem(key) {
      storage.delete(key);
    },
    setItem(key, value) {
      storage.set(key, String(value));
    }
  },
  setTimeout() {
    return 1;
  },
  stage,
  state: {
    area: "outside",
    flightPhase: "ground",
    x: 0,
    y: 0
  },
  window: {
    location: { href: "" }
  }
});

function loadScript(relativePath) {
  const filename = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
}

function evaluate(source) {
  return vm.runInContext(source, context);
}

loadScript("js/progress.js");
loadScript("js/inventory.js");
loadScript("js/pickups.js");

assert.deepEqual(
  JSON.parse(JSON.stringify(evaluate("getPlayerProgress()"))),
  { level: 1, hp: 100, completedQuests: [] }
);
assert.equal(evaluate("damagePlayer(30)"), 70);
assert.equal(evaluate("getPlayerProgress().hp"), 70, "damage must survive a progress reload");
assert.equal(evaluate("healPlayer(10)"), 80);
assert.equal(evaluate("healPlayer(1000)"), 100, "healing must stop at maximum HP");
assert.equal(evaluate("damagePlayer(1000)"), 0);
assert.equal(evaluate("isPlayerDefeated()"), true);
evaluate("setPlayerLevel(2)");
assert.equal(evaluate("getPlayerMaxHp()"), 150);
assert.equal(evaluate("getPlayerProgress().hp"), 150, "level-up must restore the new maximum HP");

assert.equal(evaluate("pickupElements.size"), 14);
evaluate("collectPickup(PICKUPS[0])");
assert.equal(evaluate("getInventoryItemCount('sunflowerSeeds')"), 1);
assert.equal(pickupToast.textContent, "Found Sunflower Seeds x1");
assert.equal(evaluate("pickupElements.has(PICKUPS[0].id)"), false);
assert.equal(evaluate("isPickupCollected(PICKUPS[0].id)"), true);

evaluate("collectPickup(PICKUPS[1])");
assert.equal(evaluate("getInventoryItemCount('sunflowerSeeds')"), 2);
assert.equal(pickupToast.textContent, "Found Sunflower Seeds x2");
assert.equal(evaluate("pickupElements.size"), 12);

console.log("State smoke tests passed.");
