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
const filename = path.join(__dirname, "..", "js", "areas", "outside.js");
vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });

function evaluate(source) {
  return vm.runInContext(source, context);
}

assert.deepEqual(Array.from(evaluate("[OUTSIDE_LAYOUT.width, OUTSIDE_LAYOUT.height]")), [2720, 1712]);
assert.equal(evaluate("OUTSIDE_LAYOUT.riverFrameDurationMs"), 300);
assert.equal(evaluate("OUTSIDE_LAYOUT.pickups.length"), 15);
assert.equal(evaluate("OUTSIDE_LAYOUT.pickups.filter(({ type }) => type === 'sunflower').length"), 9);
assert.equal(evaluate("OUTSIDE_LAYOUT.pickups.filter(({ type }) => type === 'millet').length"), 6);
assert.deepEqual(Array.from(evaluate("OUTSIDE_LAYOUT.transitions.map(({ to }) => to)")), ["lab", "forest"]);
assert.equal(evaluate("OUTSIDE_LAYOUT.walkableZones.riverLogs.polygons.length"), 4);
assert.equal(evaluate("OUTSIDE_LAYOUT.walkableZones.riverLogs.padding"), 16);
assert.equal(evaluate("OUTSIDE_LAYOUT.collisionLayers[1].name"), "terrain");
assert.equal(
  evaluate("isPointInWalkableZone(2300, 420, OUTSIDE_LAYOUT.walkableZones.riverLogs)"),
  true,
  "the upper river log must be walkable"
);
assert.equal(
  evaluate("isPointInWalkableZone(2120, 410, OUTSIDE_LAYOUT.walkableZones.riverLogs)"),
  true,
  "bridge padding must connect the log to its bank"
);

assert.equal(
  evaluate(`(() => {
    const gridSize = OUTSIDE_LAYOUT.collisionGridSize;
    const columns = Math.ceil(OUTSIDE_LAYOUT.width / gridSize);
    const rows = Math.ceil(OUTSIDE_LAYOUT.height / gridSize);
    const start = [Math.floor(800 / gridSize), Math.floor(930 / gridSize)];
    const queue = [start];
    const visited = new Set([start.join(",")]);

    function isTransitionPoint(worldX, worldY) {
      return OUTSIDE_LAYOUT.transitions.some((transition) => {
        return worldX >= transition.left && worldX <= transition.right
          && worldY >= transition.top && worldY <= transition.bottom;
      });
    }

    function isBlocked(cellX, cellY) {
      const worldX = cellX * gridSize + gridSize / 2;
      const worldY = cellY * gridSize + gridSize / 2;
      if (isTransitionPoint(worldX, worldY)) {
        return false;
      }

      return OUTSIDE_LAYOUT.collisionLayers.some((layer) => {
        if (layer.walkableZone
          && isPointInWalkableZone(worldX, worldY, OUTSIDE_LAYOUT.walkableZones[layer.walkableZone])) {
          return false;
        }
        const ranges = layer.rows.get(cellY);
        return Boolean(ranges && ranges.some(([left, right]) => cellX >= left && cellX <= right));
      });
    }

    while (queue.length) {
      const [cellX, cellY] = queue.shift();
      const worldX = cellX * gridSize + gridSize / 2;
      const worldY = cellY * gridSize + gridSize / 2;
      const forestTransition = OUTSIDE_LAYOUT.transitions[1];
      if (worldX >= forestTransition.left && worldX <= forestTransition.right
        && worldY >= forestTransition.top && worldY <= forestTransition.bottom) {
        return true;
      }

      for (const [deltaX, deltaY] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nextX = cellX + deltaX;
        const nextY = cellY + deltaY;
        const key = nextX + "," + nextY;
        if (nextX < 0 || nextX >= columns || nextY < 0 || nextY >= rows
          || visited.has(key) || isBlocked(nextX, nextY)) {
          continue;
        }
        visited.add(key);
        queue.push([nextX, nextY]);
      }
    }

    return false;
  })()`),
  true,
  "the Lab Zero landing must remain connected to the east forest transition"
);

for (const layer of evaluate("OUTSIDE_LAYOUT.collisionLayers")) {
  for (const [row, ranges] of layer.rows) {
    assert.ok(row >= 0 && row < Math.ceil(1712 / 32), `${layer.name} row must be inside the map`);
    for (const [left, right] of ranges) {
      assert.ok(left >= 0 && right < Math.ceil(2720 / 32), `${layer.name} range must be inside the map`);
      assert.ok(left <= right, `${layer.name} range must be ordered`);
    }
  }
}

evaluate("applyOutsideLayout(root)");
assert.equal(elements.get("#world").style.width, "2720px");
assert.equal(elements.get(".cricket-thicket-base").style.height, "1712px");
assert.equal(elements.get(".lab-zero-building").style.width, "1404px");
assert.equal(elements.get(".cricket-thicket-river").style.left, "1560px");
assert.equal(elements.get(".cricket-thicket-river").style.animationDuration, "900ms");

console.log("Outside layout smoke tests passed.");
