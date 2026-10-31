const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

class FakeImage {}

function makeClassList() {
  return {
    add() {},
    remove() {},
    toggle() {}
  };
}

const fakeElement = {
  classList: makeClassList(),
  style: {},
  textContent: "",
  append() {},
  setAttribute() {}
};
const context = vm.createContext({
  console,
  clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  },
  Image: FakeImage,
  INTERIOR_LAYOUTS: {
    basement: {
      elements: {
        vacuum: { left: 598, top: 340, width: 340, height: 258 }
      }
    }
  },
  document: {
    querySelector() { return fakeElement; },
    getElementById() { return fakeElement; },
    createElement() { return { ...fakeElement, classList: makeClassList() }; }
  },
  window: {
    setTimeout,
    clearTimeout,
    requestAnimationFrame(callback) { callback(); }
  },
  sessionStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {}
  },
  state: { area: "basement" },
  tapEvent: {
    preventDefault() {},
    stopPropagation() {}
  },
  stage: fakeElement
});
const filename = path.join(__dirname, "..", "js", "vacuum-combat.js");
const dialogueFilename = path.join(__dirname, "..", "js", "dialogues", "vacuum.js");
vm.runInContext(fs.readFileSync(dialogueFilename, "utf8"), context, { filename: dialogueFilename });
vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });

function evaluate(source) {
  return vm.runInContext(source, context);
}

assert.equal(evaluate("VACUUM_FRAME_SOURCES.length"), 24);
assert.equal(evaluate("VACUUM_NOZZLE_POINTS.length"), 4);
assert.equal(evaluate("VACUUM_CAPTURE_RADIUS"), 72);
assert.equal(evaluate("VACUUM_CAUGHT_HOLD_SECONDS"), 0.65);
assert.equal(evaluate("VACUUM_STRUGGLE_INITIAL"), 35);
assert.equal(evaluate("VACUUM_STRUGGLE_TAP_GAIN"), 15);
assert.equal(evaluate("VACUUM_STRUGGLE_DRAIN_PER_SECOND"), 24);
assert.equal(evaluate("VACUUM_STRUGGLE_ESCAPE"), 100);
assert.equal(evaluate("VACUUM_PATROL_POINTS.length"), 4);
evaluate("resetVacuumBossPosition(); vacuumEncounter.phase = 'idle'; setVacuumEncounterPhase('moving')");
assert.deepEqual(
  JSON.parse(JSON.stringify(evaluate("vacuumEncounter.moveTarget"))),
  { x: 390, y: 410 }
);
evaluate("updateVacuumMovement(VACUUM_MOVE_SECONDS)");
assert.equal(evaluate("vacuumEncounter.phase"), "idle");
assert.deepEqual(
  JSON.parse(JSON.stringify(evaluate("vacuumEncounter.bossPosition"))),
  { x: 390, y: 410 }
);
evaluate("setVacuumEncounterPhase('moving')");
assert.equal(evaluate("vacuumEncounter.facingRight"), true);
assert.deepEqual(
  JSON.parse(JSON.stringify(evaluate("vacuumEncounter.moveTarget"))),
  { x: 760, y: 410 }
);
evaluate("vacuumEncounter.bossPosition = { x: 760, y: 410 }; vacuumEncounter.phase = 'sucking'; vacuumEncounter.elapsed = 0");
assert.deepEqual(
  JSON.parse(JSON.stringify(evaluate("getVacuumNozzlePoint()"))),
  { x: 988, y: 479 }
);
assert.equal(evaluate("vacuumLine('Time to clean.', 3).speaker"), "Vacuum");
assert.equal(evaluate("vacuumLine('Time to clean.', 3).portrait.endsWith('vacuum-portrait3.png')"), true);
assert.equal(evaluate("vacuumLine('', 2, { speaker: '', lockAdvance: true }).lockAdvance"), true);
assert.equal(evaluate("getVacuumDarkThreatLines()[0].portrait.endsWith('vacuum-portrait1.png')"), true);
assert.equal(evaluate("getVacuumBootLine().portrait.endsWith('vacuum-portrait2.png')"), true);
assert.equal(evaluate("getVacuumCleaningLines()[0].portrait.endsWith('vacuum-portrait3.png')"), true);
evaluate("vacuumEncounter.phase = 'caught'; vacuumEncounter.struggle = VACUUM_STRUGGLE_INITIAL");
for (let tap = 0; tap < 4; tap += 1) {
  evaluate("handleVacuumEscapeTap(tapEvent)");
}
assert.equal(evaluate("vacuumEncounter.struggle"), 95);
assert.equal(evaluate("vacuumEncounter.phase"), "caught");
evaluate("resetVacuumBossPosition(); vacuumEncounter.phase = 'idle'");
assert.equal(evaluate("isVacuumBodyBlockingPoint(768, 560, 0)"), true);
assert.equal(evaluate("isVacuumBodyBlockingPoint(300, 300, 0)"), false);

const requiredAssets = [
  "assets/sprites/environment/map-layers/Lab Zero/Basement/Basement.png",
  "assets/sprites/environment/map-layers/Lab Zero/Basement/BasementTerrain.png",
  "assets/sprites/environment/map-layers/Lab Zero/Basement/BasementForeground.png",
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Idle/Vacuum${index + 1}.png`),
  ...Array.from({ length: 6 }, (_, index) => `assets/sprites/characters/Vacuum/Extend/VacuumExtend${index + 1}.png`),
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Suck/VacuumSuck${index + 1}.png`),
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Grapple/VacuumGrapple${index + 1}.png`),
  ...Array.from({ length: 3 }, (_, index) => `assets/sprites/characters/Vacuum/Grapple/sucked${index + 1}.png`),
  ...Array.from({ length: 3 }, (_, index) => `assets/sprites/characters/Vacuum/Portraits/vacuum-portrait${index + 1}.png`)
];

requiredAssets.forEach((asset) => {
  assert.equal(fs.existsSync(path.join(__dirname, "..", asset)), true, `${asset} must exist`);
});

console.log("Vacuum combat smoke tests passed.");
