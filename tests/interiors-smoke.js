const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const elements = new Map();
const root = {
  querySelector(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, { style: {} });
    }

    return elements.get(selector);
  }
};
const context = vm.createContext({ console, root });
const filename = path.join(__dirname, "..", "js", "areas", "interiors.js");
vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });

function evaluate(source) {
  return vm.runInContext(source, context);
}

assert.deepEqual(Array.from(evaluate("[INTERIOR_LAYOUTS.lab.width, INTERIOR_LAYOUTS.lab.height]")), [1517, 1037]);
assert.deepEqual(Array.from(evaluate("[INTERIOR_LAYOUTS.bedroom.width, INTERIOR_LAYOUTS.bedroom.height]")), [1517, 1037]);
assert.deepEqual(Array.from(evaluate("[INTERIOR_LAYOUTS.basement.width, INTERIOR_LAYOUTS.basement.height]")), [1536, 1024]);
assert.equal(evaluate("INTERIOR_LAYOUTS.lab.transitions[0].to"), "outside");
assert.equal(evaluate("INTERIOR_LAYOUTS.lab.transitions[1].to"), "bedroom");
assert.equal(evaluate("INTERIOR_LAYOUTS.lab.transitions[2].to"), "basement");
assert.equal(evaluate("INTERIOR_LAYOUTS.bedroom.transitions[0].to"), "lab");
assert.equal(evaluate("INTERIOR_LAYOUTS.basement.transitions[0].to"), "lab");
assert.equal(evaluate("INTERIOR_LAYOUTS.basement.blocked.length"), 0, "The moving vacuum must not leave a fixed collision behind");
assert.equal(evaluate("INTERIOR_LAYOUTS.basement.collisionPadding"), 22, "Basement foreground edges need room for Little Wing's wings");
assert.equal(evaluate("INTERIOR_LAYOUTS.lab.transitions[2].entryY"), 350, "Basement entry must start beyond the padded stair seam");
assert.equal(evaluate("INTERIOR_LAYOUTS.basement.transitions[0].bottom >= 336"), true, "Basement stairs must connect to the first open path cell");
assert.equal(evaluate(`(() => {
  const padding = INTERIOR_LAYOUTS.basement.collisionPadding;
  const diagonal = padding * Math.SQRT1_2;
  const offsets = [[0, 0], [padding, 0], [-padding, 0], [0, padding], [0, -padding], [diagonal, diagonal], [diagonal, -diagonal], [-diagonal, diagonal], [-diagonal, -diagonal]];
  return offsets.every(([offsetX, offsetY]) => {
    const cellX = Math.floor((704 + offsetX) / 32);
    const cellY = Math.floor((350 + offsetY) / 32);
    const ranges = BASEMENT_TERRAIN_ROWS.get(cellY);
    return !ranges || !ranges.some(([left, right]) => cellX >= left && cellX <= right);
  });
})()`), true, "Basement entry point must remain clear after sprite-padding samples");
assert.equal(
  evaluate("INTERIOR_LAYOUTS.lab.talkZones.candlewick.right < INTERIOR_LAYOUTS.lab.talkZones.labCore.left"),
  true,
  "Candlewick and Lab Core talk zones must not overlap"
);

for (const areaName of ["lab", "bedroom", "basement"]) {
  const layout = evaluate(`INTERIOR_LAYOUTS.${areaName}`);

  for (const rect of [...Object.values(layout.elements), ...layout.blocked, ...layout.transitions]) {
    const right = rect.right ?? rect.left + rect.width;
    const bottom = rect.bottom ?? rect.top + rect.height;
    assert.ok(rect.left >= 0 && rect.top >= 0, `${areaName} rectangle must start inside the area`);
    assert.ok(right <= layout.width && bottom <= layout.height, `${areaName} rectangle must end inside the area`);
  }
}

evaluate("applyInteriorLayouts(root)");
assert.equal(elements.get(".lab-interior").style.width, "1517px");
assert.equal(elements.get(".lab-desk").style.left, "327px");
assert.equal(elements.get(".candlewick-terminal").style.left, "1092px");
assert.equal(elements.get(".lab-pc-monitor").style.left, "1245px");
assert.equal(elements.get(".bedroom-cage-art").style.width, "326px");
assert.equal(elements.get(".basement-interior").style.width, "1536px");
assert.equal(elements.get(".basement-vacuum").style.left, "598px");

console.log("Interior layout smoke tests passed.");
