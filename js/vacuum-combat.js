const VACUUM_IDLE_SECONDS = 0.9;
const VACUUM_EXTEND_SECONDS = 1.2;
const VACUUM_SUCK_SECONDS = 2.2;
const VACUUM_RECOVER_SECONDS = 0.65;
const VACUUM_SUCK_FRAME_SECONDS = 0.22;
const VACUUM_CAPTURE_RADIUS = 72;
const VACUUM_CAUGHT_HOLD_SECONDS = 0.65;
const VACUUM_STRUGGLE_INITIAL = 35;
const VACUUM_STRUGGLE_TAP_GAIN = 15;
const VACUUM_STRUGGLE_DRAIN_PER_SECOND = 24;
const VACUUM_STRUGGLE_ESCAPE = 100;
const VACUUM_ESCAPE_DISTANCE = 120;
const VACUUM_GRAPPLE_SECONDS = 1.8;
const VACUUM_MOVE_SECONDS = 1.25;
const VACUUM_LIGHTS_FADE_MS = 900;
const VACUUM_BLACKOUT_MS = 700;
const VACUUM_BOSS_LAYOUT = INTERIOR_LAYOUTS.basement.elements.vacuum;
const VACUUM_BODY_RECT = { left: 140, top: 180, right: 202, bottom: 263 };
const VACUUM_PATROL_POINTS = [
  { x: VACUUM_BOSS_LAYOUT.left, y: VACUUM_BOSS_LAYOUT.top },
  { x: 390, y: 410 },
  { x: 760, y: 410 },
  { x: 540, y: 560 }
];
const VACUUM_NOZZLE_POINTS = [
  { x: 112, y: 69 },
  { x: 76, y: 108 },
  { x: 112, y: 69 },
  { x: 132, y: 43 }
];
const VACUUM_FRAME_SOURCES = [
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Idle/Vacuum${index + 1}.png`),
  ...Array.from({ length: 6 }, (_, index) => `assets/sprites/characters/Vacuum/Extend/VacuumExtend${index + 1}.png`),
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Suck/VacuumSuck${index + 1}.png`),
  ...Array.from({ length: 4 }, (_, index) => `assets/sprites/characters/Vacuum/Grapple/VacuumGrapple${index + 1}.png`),
  ...Array.from({ length: 3 }, (_, index) => `assets/sprites/characters/Vacuum/Grapple/sucked${index + 1}.png`),
  ...Array.from({ length: 3 }, (_, index) => `assets/sprites/characters/Vacuum/Portraits/vacuum-portrait${index + 1}.png`)
];
const vacuumFramePreloads = VACUUM_FRAME_SOURCES.map((source) => {
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  return image;
});
const vacuumBoss = document.querySelector(".basement-vacuum");
const basementAreaElement = document.getElementById("basement-interior");
const vacuumEncounter = {
  phase: "inactive",
  elapsed: 0,
  movementLocked: false,
  captureStart: null,
  captureTarget: null,
  struggle: VACUUM_STRUGGLE_INITIAL,
  bossPosition: { x: VACUUM_BOSS_LAYOUT.left, y: VACUUM_BOSS_LAYOUT.top },
  moveStart: null,
  moveTarget: null,
  patrolIndex: 0,
  timers: new Set(),
  generation: 0
};

function handleVacuumAreaEntered(areaName, previousAreaName) {
  if (previousAreaName === "basement" && areaName !== "basement") {
    cancelVacuumEncounter();
    return;
  }

  if (areaName === "basement") {
    beginVacuumEncounterIntro();
  }
}

function beginVacuumEncounterIntro() {
  cancelVacuumEncounter();
  vacuumEncounter.phase = "intro";
  vacuumEncounter.movementLocked = true;
  basementAreaElement.classList.add("is-dark");
  resetVacuumBossPosition();
  setVacuumBossVisual("off");
  clearVacuumPlayerClasses();

  scheduleVacuumAction(() => {
    if (state.area !== "basement") {
      return;
    }

    const lines = getVacuumDarkThreatLines();
    lines.onComplete = startVacuumBootSequence;
    startDialogue(lines);
  }, 140);
}

function startVacuumBootSequence() {
  if (state.area !== "basement") {
    return;
  }

  vacuumEncounter.phase = "booting";
  vacuumEncounter.movementLocked = true;
  setVacuumBossVisual("booting");
  callOptionalVacuumSound("playVacuumBootSound");
  startDialogue([getVacuumBootLine()]);

  scheduleVacuumAction(() => {
    showVacuumCleaningLine();
  }, 760);
}

function showVacuumCleaningLine() {
  if (state.area !== "basement" || !dialogueState.active) {
    return;
  }

  dialogueState.index = 0;
  dialogueState.lines = getVacuumCleaningLines();
  dialogueState.onComplete = revealVacuumEncounter;
  showDialogueLine();
}

function revealVacuumEncounter() {
  if (state.area !== "basement") {
    return;
  }

  vacuumEncounter.phase = "revealing";
  vacuumEncounter.movementLocked = true;
  basementAreaElement.classList.remove("is-dark");
  setVacuumBossVisual("idle");

  scheduleVacuumAction(() => {
    if (state.area !== "basement") {
      return;
    }

    vacuumEncounter.movementLocked = false;
    setVacuumEncounterPhase("moving");
  }, VACUUM_LIGHTS_FADE_MS);
}

function isVacuumEncounterMovementLocked() {
  return state.area === "basement" && vacuumEncounter.movementLocked;
}

function updateVacuumEncounter(delta) {
  if (state.area !== "basement" || vacuumEncounter.phase === "inactive") {
    return;
  }

  if (vacuumEncounter.phase === "caught") {
    updateVacuumStruggle(delta);
    return;
  }

  if (vacuumEncounter.phase === "grappling") {
    vacuumEncounter.elapsed += delta;

    if (vacuumEncounter.elapsed >= VACUUM_GRAPPLE_SECONDS) {
      beginVacuumCaptureBlackout();
    }

    return;
  }

  if (vacuumEncounter.phase === "moving") {
    updateVacuumMovement(delta);
    return;
  }

  if (!["idle", "extending", "sucking", "recovering"].includes(vacuumEncounter.phase)) {
    return;
  }

  vacuumEncounter.elapsed += delta;

  if (vacuumEncounter.phase === "idle" && vacuumEncounter.elapsed >= VACUUM_IDLE_SECONDS) {
    setVacuumEncounterPhase("extending");
    return;
  }

  if (vacuumEncounter.phase === "extending" && vacuumEncounter.elapsed >= VACUUM_EXTEND_SECONDS) {
    setVacuumEncounterPhase("sucking");
    return;
  }

  if (vacuumEncounter.phase === "sucking") {
    if (isPlayerInsideVacuumNozzle()) {
      beginVacuumCapture();
      return;
    }

    if (vacuumEncounter.elapsed >= VACUUM_SUCK_SECONDS) {
      setVacuumEncounterPhase("recovering");
    }

    return;
  }

  if (vacuumEncounter.phase === "recovering" && vacuumEncounter.elapsed >= VACUUM_RECOVER_SECONDS) {
    setVacuumEncounterPhase("moving");
  }
}

function setVacuumEncounterPhase(phase) {
  if (vacuumEncounter.phase === "sucking" && phase !== "sucking") {
    callOptionalVacuumSound("stopVacuumSuctionSound");
  }

  vacuumEncounter.phase = phase;
  vacuumEncounter.elapsed = 0;
  setVacuumBossVisual(phase === "moving" ? "moving" : phase);

  if (phase === "moving") {
    beginVacuumMovement();
  }

  if (phase === "sucking") {
    callOptionalVacuumSound("startVacuumSuctionSound");
  }
}

function setVacuumBossVisual(visualState) {
  if (!vacuumBoss) {
    return;
  }

  vacuumBoss.classList.remove("is-off", "is-booting", "is-idle", "is-moving", "is-extending", "is-sucking", "is-recovering", "is-grappling");
  vacuumBoss.classList.add(`is-${visualState}`);
}

function getVacuumNozzlePoint() {
  const frameIndex = vacuumEncounter.phase === "sucking"
    ? Math.floor(vacuumEncounter.elapsed / VACUUM_SUCK_FRAME_SECONDS) % VACUUM_NOZZLE_POINTS.length
    : 0;
  const point = VACUUM_NOZZLE_POINTS[frameIndex];

  return {
    x: vacuumEncounter.bossPosition.x + point.x,
    y: vacuumEncounter.bossPosition.y + point.y
  };
}

function beginVacuumMovement() {
  vacuumEncounter.moveStart = { ...vacuumEncounter.bossPosition };
  vacuumEncounter.patrolIndex = (vacuumEncounter.patrolIndex + 1) % VACUUM_PATROL_POINTS.length;
  vacuumEncounter.moveTarget = VACUUM_PATROL_POINTS[vacuumEncounter.patrolIndex];
}

function updateVacuumMovement(delta) {
  vacuumEncounter.elapsed += delta;
  const progress = clamp(vacuumEncounter.elapsed / VACUUM_MOVE_SECONDS, 0, 1);
  const easedProgress = progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  vacuumEncounter.bossPosition.x = lerp(vacuumEncounter.moveStart.x, vacuumEncounter.moveTarget.x, easedProgress);
  vacuumEncounter.bossPosition.y = lerp(vacuumEncounter.moveStart.y, vacuumEncounter.moveTarget.y, easedProgress);
  placeVacuumBoss();

  if (progress >= 1) {
    vacuumEncounter.bossPosition = { ...vacuumEncounter.moveTarget };
    vacuumEncounter.moveStart = null;
    vacuumEncounter.moveTarget = null;
    placeVacuumBoss();
    setVacuumEncounterPhase("idle");
  }
}

function placeVacuumBoss() {
  if (!vacuumBoss) {
    return;
  }

  vacuumBoss.style.left = `${vacuumEncounter.bossPosition.x}px`;
  vacuumBoss.style.top = `${vacuumEncounter.bossPosition.y}px`;
}

function resetVacuumBossPosition() {
  vacuumEncounter.bossPosition = { x: VACUUM_BOSS_LAYOUT.left, y: VACUUM_BOSS_LAYOUT.top };
  vacuumEncounter.moveStart = null;
  vacuumEncounter.moveTarget = null;
  vacuumEncounter.patrolIndex = 0;
  placeVacuumBoss();
}

function isVacuumBodyBlockingPoint(worldX, worldY, padding = 0) {
  if (state.area !== "basement" || vacuumEncounter.phase === "inactive") {
    return false;
  }

  const position = vacuumEncounter.bossPosition;
  return worldX >= position.x + VACUUM_BODY_RECT.left - padding
    && worldX <= position.x + VACUUM_BODY_RECT.right + padding
    && worldY >= position.y + VACUUM_BODY_RECT.top - padding
    && worldY <= position.y + VACUUM_BODY_RECT.bottom + padding;
}

function isPlayerInsideVacuumNozzle() {
  const nozzle = getVacuumNozzlePoint();
  return Math.hypot(state.x - nozzle.x, state.y - nozzle.y) <= VACUUM_CAPTURE_RADIUS;
}

function beginVacuumCapture() {
  const activePlayer = getActiveArea().player;
  vacuumEncounter.phase = "caught";
  vacuumEncounter.elapsed = 0;
  vacuumEncounter.movementLocked = true;
  vacuumEncounter.captureStart = { x: state.x, y: state.y };
  vacuumEncounter.captureTarget = getVacuumNozzlePoint();
  vacuumEncounter.struggle = VACUUM_STRUGGLE_INITIAL;
  state.path = [];
  state.targetX = state.x;
  state.targetY = state.y;
  getActiveArea().target.classList.remove("visible");
  stopPlayerFlightForVacuumCapture();
  activePlayer.classList.remove("facing-left", "facing-up", "facing-down", "is-moving");
  activePlayer.classList.add("is-vacuum-caught");
  showVacuumStruggleControl();
  callOptionalVacuumSound("playVacuumCatchSound");
}

function updateVacuumStruggle(delta) {
  vacuumEncounter.elapsed += delta;
  if (vacuumEncounter.elapsed > VACUUM_CAUGHT_HOLD_SECONDS) {
    vacuumEncounter.struggle = Math.max(0, vacuumEncounter.struggle - VACUUM_STRUGGLE_DRAIN_PER_SECOND * delta);
  }

  const progress = clamp(1 - vacuumEncounter.struggle / VACUUM_STRUGGLE_INITIAL, 0, 1);
  const easedProgress = 1 - Math.pow(1 - progress, 3);
  state.x = lerp(vacuumEncounter.captureStart.x, vacuumEncounter.captureTarget.x, easedProgress);
  state.y = lerp(vacuumEncounter.captureStart.y, vacuumEncounter.captureTarget.y, easedProgress);
  state.targetX = state.x;
  state.targetY = state.y;
  placePlayer();
  placeCamera();
  updateVacuumStruggleControl();

  if (vacuumEncounter.struggle <= 0) {
    hideVacuumStruggleControl();
    vacuumEncounter.phase = "grappling";
    vacuumEncounter.elapsed = 0;
    getActiveArea().player.classList.add("is-vacuum-held");
    setVacuumBossVisual("grappling");
    callOptionalVacuumSound("stopVacuumSuctionSound");
    callOptionalVacuumSound("playVacuumGrappleSound");
  }
}

function beginVacuumCaptureBlackout() {
  if (vacuumEncounter.phase === "blackout") {
    return;
  }

  vacuumEncounter.phase = "blackout";
  vacuumEncounter.elapsed = 0;
  vacuumEncounter.movementLocked = true;
  hideVacuumStruggleControl();
  const blackout = getVacuumBlackout();
  blackout.hidden = false;
  window.requestAnimationFrame(() => blackout.classList.add("is-active"));

  scheduleVacuumAction(() => {
    finishVacuumCaptureReset();
  }, VACUUM_BLACKOUT_MS);
}

function finishVacuumCaptureReset() {
  callOptionalVacuumSound("stopVacuumSuctionSound");
  stopPlayerFlightForVacuumCapture();
  clearVacuumPlayerClasses();
  basementAreaElement.classList.add("is-dark");
  setVacuumBossVisual("off");

  if (typeof resetBedroomCageAfterCapture === "function") {
    resetBedroomCageAfterCapture();
  }

  vacuumEncounter.phase = "inactive";
  vacuumEncounter.elapsed = 0;
  vacuumEncounter.movementLocked = false;
  vacuumEncounter.captureStart = null;
  vacuumEncounter.captureTarget = null;
  vacuumEncounter.struggle = VACUUM_STRUGGLE_INITIAL;

  const blackout = getVacuumBlackout();
  scheduleVacuumAction(() => blackout.classList.remove("is-active"), 220);
  scheduleVacuumAction(() => {
    blackout.hidden = true;
  }, VACUUM_BLACKOUT_MS + 260);
}

function stopPlayerFlightForVacuumCapture() {
  clearTimeout(state.flightTimer);
  state.flightMode = false;
  state.flightPhase = "ground";
  syncPlayerAnimationState();
}

function clearVacuumPlayerClasses() {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.remove("is-vacuum-caught", "is-vacuum-held");
  });
}

function showVacuumStruggleControl() {
  const control = getVacuumStruggleControl();
  updateVacuumStruggleControl();
  control.hidden = false;
}

function hideVacuumStruggleControl() {
  const control = document.getElementById("vacuum-struggle-control");
  const button = document.getElementById("vacuum-escape-button");

  if (control) {
    control.hidden = true;
  }

  if (button) {
    button.classList.remove("is-flapping");
  }
}

function getVacuumStruggleControl() {
  let control = document.getElementById("vacuum-struggle-control");

  if (control) {
    return control;
  }

  control = document.createElement("div");
  control.id = "vacuum-struggle-control";
  control.className = "vacuum-struggle-control";
  control.hidden = true;

  const labels = document.createElement("div");
  labels.className = "vacuum-struggle-labels";
  labels.innerHTML = "<span>Caught</span><span>Escape</span>";

  const track = document.createElement("div");
  track.id = "vacuum-struggle-track";
  track.className = "vacuum-struggle-track";
  track.setAttribute("role", "progressbar");
  track.setAttribute("aria-label", "Vacuum escape struggle");
  track.setAttribute("aria-valuemin", "0");
  track.setAttribute("aria-valuemax", String(VACUUM_STRUGGLE_ESCAPE));

  const fill = document.createElement("div");
  fill.id = "vacuum-struggle-fill";
  fill.className = "vacuum-struggle-fill";
  track.append(fill);

  const button = document.createElement("button");
  button.id = "vacuum-escape-button";
  button.className = "vacuum-escape-button";
  button.type = "button";
  button.textContent = "Flap!";
  button.addEventListener("click", handleVacuumEscapeTap);
  control.append(labels, track, button);
  stage.append(control);
  return control;
}

function handleVacuumEscapeTap(event) {
  event.preventDefault();
  event.stopPropagation();

  if (state.area !== "basement" || vacuumEncounter.phase !== "caught") {
    return;
  }

  vacuumEncounter.struggle = Math.min(
    VACUUM_STRUGGLE_ESCAPE,
    vacuumEncounter.struggle + VACUUM_STRUGGLE_TAP_GAIN
  );
  const button = document.getElementById("vacuum-escape-button");
  button.classList.remove("is-flapping");
  void button.offsetWidth;
  button.classList.add("is-flapping");
  updateVacuumStruggleControl();

  if (vacuumEncounter.struggle >= VACUUM_STRUGGLE_ESCAPE) {
    escapeVacuumCapture();
  }
}

function updateVacuumStruggleControl() {
  getVacuumStruggleControl();
  const value = Math.round(vacuumEncounter.struggle);
  const fill = document.getElementById("vacuum-struggle-fill");
  const track = document.getElementById("vacuum-struggle-track");
  const button = document.getElementById("vacuum-escape-button");
  fill.style.width = `${value}%`;
  track.setAttribute("aria-valuenow", String(value));
  button.setAttribute("aria-label", `Flap wings to escape. Struggle meter ${value} percent`);
}

function escapeVacuumCapture() {
  const nozzle = vacuumEncounter.captureTarget;
  const start = vacuumEncounter.captureStart;
  const awayX = start.x - nozzle.x;
  const awayY = start.y - nozzle.y;
  const distance = Math.hypot(awayX, awayY) || 1;
  const requestedX = clamp(nozzle.x + (awayX / distance) * VACUUM_ESCAPE_DISTANCE, 24, getActiveArea().width - 24);
  const requestedY = clamp(nozzle.y + (awayY / distance) * VACUUM_ESCAPE_DISTANCE, 24, getActiveArea().height - 24);
  const safePoint = findNearestWalkablePoint(requestedX, requestedY) || start;

  hideVacuumStruggleControl();
  clearVacuumPlayerClasses();
  callOptionalVacuumSound("stopVacuumSuctionSound");
  callOptionalVacuumSound("playVacuumEscapeSound");
  vacuumEncounter.movementLocked = false;
  vacuumEncounter.captureStart = null;
  vacuumEncounter.captureTarget = null;
  vacuumEncounter.struggle = VACUUM_STRUGGLE_INITIAL;
  state.x = safePoint.x;
  state.y = safePoint.y;
  state.targetX = state.x;
  state.targetY = state.y;
  state.path = [];
  placePlayer();
  placeTarget();
  placeCamera();
  setVacuumEncounterPhase("recovering");
}

function getVacuumBlackout() {
  let blackout = document.getElementById("vacuum-blackout");

  if (!blackout) {
    blackout = document.createElement("div");
    blackout.id = "vacuum-blackout";
    blackout.className = "vacuum-blackout";
    blackout.hidden = true;
    blackout.setAttribute("aria-hidden", "true");
    stage.append(blackout);
  }

  return blackout;
}

function scheduleVacuumAction(action, delay) {
  const generation = vacuumEncounter.generation;
  const timer = window.setTimeout(() => {
    vacuumEncounter.timers.delete(timer);

    if (generation === vacuumEncounter.generation) {
      action();
    }
  }, delay);
  vacuumEncounter.timers.add(timer);
  return timer;
}

function cancelVacuumEncounter() {
  vacuumEncounter.generation += 1;
  vacuumEncounter.timers.forEach((timer) => window.clearTimeout(timer));
  vacuumEncounter.timers.clear();
  vacuumEncounter.phase = "inactive";
  vacuumEncounter.elapsed = 0;
  vacuumEncounter.movementLocked = false;
  vacuumEncounter.captureStart = null;
  vacuumEncounter.captureTarget = null;
  vacuumEncounter.struggle = VACUUM_STRUGGLE_INITIAL;
  vacuumEncounter.moveStart = null;
  vacuumEncounter.moveTarget = null;
  callOptionalVacuumSound("stopVacuumSuctionSound");
  clearVacuumPlayerClasses();
  hideVacuumStruggleControl();
}

function stopVacuumEncounterForVictory() {
  cancelVacuumEncounter();
  basementAreaElement.classList.remove("is-dark");
  setVacuumBossVisual("idle");
}

function callOptionalVacuumSound(functionName) {
  const soundFunction = window[functionName];

  if (typeof soundFunction === "function") {
    soundFunction();
  }
}

function lerp(start, end, progress) {
  return start + (end - start) * progress;
}
