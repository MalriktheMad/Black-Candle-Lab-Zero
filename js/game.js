const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;
const LAB_WIDTH = 920;
const LAB_HEIGHT = 620;
const DILLY_WIDTH = 880;
const DILLY_HEIGHT = 640;
const BEDROOM_WIDTH = 820;
const BEDROOM_HEIGHT = 560;
const MIN_ZOOM = 0.65;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 0.85;
const PATH_GRID_SIZE = 32;
const PATH_SEARCH_LIMIT = 8000;
const TRANSITION_COOLDOWN = 0.45;
const FLIGHT_TAKEOFF_MS = 380;
const FLIGHT_LAND_MS = 320;
const BLOCKED_TERRAIN = [
  { name: "old-dilly-house", left: 194, top: 108, right: 386, bottom: 308 },
  { name: "lab-zero-building", left: 1952, top: 636, right: 2124, bottom: 754 },
  { name: "end-of-road", left: 1850, top: 0, right: 2240, bottom: 352 },
  { name: "water-000", left: 1024, top: 0, right: 1184, bottom: 32, flightPassable: true },
  { name: "water-001", left: 1056, top: 32, right: 1216, bottom: 64, flightPassable: true },
  { name: "water-002", left: 1056, top: 64, right: 1216, bottom: 96, flightPassable: true },
  { name: "water-003", left: 1088, top: 96, right: 1248, bottom: 128, flightPassable: true },
  { name: "water-004", left: 1120, top: 128, right: 1280, bottom: 160, flightPassable: true },
  { name: "water-005", left: 1120, top: 160, right: 1312, bottom: 192, flightPassable: true },
  { name: "water-006", left: 1152, top: 192, right: 1344, bottom: 224, flightPassable: true },
  { name: "water-007", left: 1152, top: 224, right: 1408, bottom: 256, flightPassable: true },
  { name: "water-008", left: 1216, top: 256, right: 1408, bottom: 288, flightPassable: true },
  { name: "water-009", left: 1248, top: 288, right: 1440, bottom: 320, flightPassable: true },
  { name: "water-010", left: 1280, top: 320, right: 1504, bottom: 352, flightPassable: true },
  { name: "water-011", left: 1312, top: 352, right: 1504, bottom: 384, flightPassable: true },
  { name: "water-012", left: 1344, top: 384, right: 1536, bottom: 416, flightPassable: true },
  { name: "water-013", left: 1376, top: 416, right: 1536, bottom: 448, flightPassable: true },
  { name: "water-014", left: 1408, top: 448, right: 1568, bottom: 480, flightPassable: true },
  { name: "water-015", left: 1408, top: 480, right: 1600, bottom: 512, flightPassable: true },
  { name: "water-016", left: 1472, top: 512, right: 1600, bottom: 544, flightPassable: true },
  { name: "water-017", left: 1472, top: 544, right: 1600, bottom: 576, flightPassable: true },
  { name: "water-018", left: 1472, top: 576, right: 1600, bottom: 608, flightPassable: true },
  { name: "water-019", left: 1472, top: 608, right: 1600, bottom: 640, flightPassable: true },
  { name: "water-020", left: 1472, top: 640, right: 1632, bottom: 672, flightPassable: true },
  { name: "water-021", left: 1472, top: 672, right: 1600, bottom: 704, flightPassable: true },
  { name: "water-022", left: 1472, top: 704, right: 1600, bottom: 736, flightPassable: true },
  { name: "water-023", left: 1440, top: 736, right: 1600, bottom: 768, flightPassable: true },
  { name: "water-024", left: 1408, top: 768, right: 1600, bottom: 800, flightPassable: true },
  { name: "water-025", left: 1184, top: 800, right: 1568, bottom: 832, flightPassable: true },
  { name: "water-026", left: 1120, top: 832, right: 1536, bottom: 864, flightPassable: true },
  { name: "water-027", left: 1056, top: 864, right: 1504, bottom: 896, flightPassable: true },
  { name: "water-028", left: 992, top: 896, right: 1440, bottom: 928, flightPassable: true },
  { name: "water-029", left: 928, top: 928, right: 1248, bottom: 960, flightPassable: true },
  { name: "water-030", left: 896, top: 960, right: 1152, bottom: 992, flightPassable: true },
  { name: "water-031", left: 896, top: 992, right: 1088, bottom: 1024, flightPassable: true },
  { name: "water-032", left: 864, top: 1024, right: 1056, bottom: 1056, flightPassable: true },
  { name: "water-033", left: 832, top: 1056, right: 992, bottom: 1088, flightPassable: true },
  { name: "water-034", left: 800, top: 1088, right: 960, bottom: 1120, flightPassable: true },
  { name: "water-035", left: 800, top: 1120, right: 928, bottom: 1152, flightPassable: true },
  { name: "water-036", left: 800, top: 1152, right: 896, bottom: 1184, flightPassable: true },
  { name: "water-037", left: 768, top: 1184, right: 896, bottom: 1216, flightPassable: true },
  { name: "water-038", left: 768, top: 1216, right: 896, bottom: 1248, flightPassable: true },
  { name: "water-039", left: 768, top: 1248, right: 928, bottom: 1280, flightPassable: true },
  { name: "water-040", left: 704, top: 1280, right: 928, bottom: 1312, flightPassable: true },
  { name: "water-041", left: 640, top: 1312, right: 992, bottom: 1344, flightPassable: true },
  { name: "water-042", left: 576, top: 1344, right: 1056, bottom: 1376, flightPassable: true },
  { name: "water-043", left: 512, top: 1376, right: 768, bottom: 1408, flightPassable: true },
  { name: "water-044", left: 800, top: 1376, right: 1120, bottom: 1408, flightPassable: true },
  { name: "water-045", left: 480, top: 1408, right: 704, bottom: 1440, flightPassable: true },
  { name: "water-046", left: 896, top: 1408, right: 1152, bottom: 1440, flightPassable: true },
  { name: "water-047", left: 2240, top: 1408, right: 2400, bottom: 1440, flightPassable: true },
  { name: "water-048", left: 448, top: 1440, right: 672, bottom: 1472, flightPassable: true },
  { name: "water-049", left: 928, top: 1440, right: 1216, bottom: 1472, flightPassable: true },
  { name: "water-050", left: 2176, top: 1440, right: 2400, bottom: 1472, flightPassable: true },
  { name: "water-051", left: 64, top: 1472, right: 544, bottom: 1504, flightPassable: true },
  { name: "water-052", left: 960, top: 1472, right: 1248, bottom: 1504, flightPassable: true },
  { name: "water-053", left: 2016, top: 1472, right: 2400, bottom: 1504, flightPassable: true },
  { name: "water-054", left: 0, top: 1504, right: 544, bottom: 1536, flightPassable: true },
  { name: "water-055", left: 1024, top: 1504, right: 1248, bottom: 1536, flightPassable: true },
  { name: "water-056", left: 1824, top: 1504, right: 2400, bottom: 1536, flightPassable: true },
  { name: "water-057", left: 0, top: 1536, right: 608, bottom: 1568, flightPassable: true },
  { name: "water-058", left: 1056, top: 1536, right: 2400, bottom: 1568, flightPassable: true },
  { name: "water-059", left: 0, top: 1568, right: 832, bottom: 1600, flightPassable: true },
  { name: "water-060", left: 1056, top: 1568, right: 2400, bottom: 1600, flightPassable: true },
  { name: "water-061", left: 0, top: 1600, right: 2400, bottom: 1632, flightPassable: true },
  { name: "water-062", left: 0, top: 1632, right: 2400, bottom: 1664, flightPassable: true },
  { name: "water-063", left: 0, top: 1664, right: 2400, bottom: 1696, flightPassable: true },
  { name: "water-064", left: 0, top: 1696, right: 2400, bottom: 1728, flightPassable: true },
  { name: "water-065", left: 0, top: 1728, right: 2400, bottom: 1760, flightPassable: true },
  { name: "water-066", left: 0, top: 1760, right: 2400, bottom: 1792, flightPassable: true }
];
const LAB_BLOCKED_TERRAIN = [
  { name: "north-bench", left: 74, top: 66, right: 238, bottom: 154 },
  { name: "lab-core", left: 346, top: 66, right: 446, bottom: 178 },
  { name: "candlewick-tower", left: 560, top: 90, right: 626, bottom: 214 },
  { name: "candlewick-workstation", left: 620, top: 74, right: 786, bottom: 226 },
  { name: "empty-wizard-chair", left: 754, top: 212, right: 842, bottom: 326 },
  { name: "wing-master-cricket", left: 664, top: 306, right: 806, bottom: 424 }
];
const BEDROOM_BLOCKED_TERRAIN = [
  { name: "cage-back-wall", left: 52, top: 54, right: 222, bottom: 104 },
  { name: "wizard-bed", left: 554, top: 72, right: 812, bottom: 214 },
  { name: "nightstand", left: 490, top: 124, right: 556, bottom: 206 }
];
const DILLY_BLOCKED_TERRAIN = [
  { name: "kitchen", left: 48, top: 110, right: 232, bottom: 232 },
  { name: "old-dilly", left: 226, top: 142, right: 288, bottom: 222 },
  { name: "liz-art-corner", left: 618, top: 116, right: 826, bottom: 274 },
  { name: "liz", left: 560, top: 162, right: 624, bottom: 238 },
  { name: "greenhouse-sofa", left: 332, top: 354, right: 524, bottom: 464 },
  { name: "left-plant-wall", left: 8, top: 224, right: 108, bottom: 604 },
  { name: "right-plant-wall", left: 764, top: 430, right: 862, bottom: 604 },
  { name: "plant-cluster-one", left: 302, top: 108, right: 394, bottom: 214 },
  { name: "plant-cluster-two", left: 560, top: 382, right: 660, bottom: 488 },
  { name: "plant-cluster-three", left: 132, top: 432, right: 230, bottom: 536 }
];

const stage = document.getElementById("stage");
const world = document.getElementById("world");
const player = document.getElementById("player");
const targetEl = document.getElementById("target");
const labInterior = document.getElementById("lab-interior");
const interiorPlayer = document.getElementById("interior-player");
const interiorTarget = document.getElementById("interior-target");
const bedroomInterior = document.getElementById("bedroom-interior");
const bedroomPlayer = document.getElementById("bedroom-player");
const bedroomTarget = document.getElementById("bedroom-target");
const dillyInterior = document.getElementById("dilly-interior");
const dillyPlayer = document.getElementById("dilly-player");
const dillyTarget = document.getElementById("dilly-target");
const readout = document.getElementById("readout");
const quickNav = document.getElementById("quick-nav");
const zoomControls = document.getElementById("zoom-controls");
const flightControls = document.getElementById("flight-controls");
const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");
const flightToggle = document.getElementById("flight-toggle");

const AREAS = {
  outside: {
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    element: world,
    player,
    target: targetEl,
    blocked: BLOCKED_TERRAIN,
    transitions: [
      { left: 246, top: 206, right: 362, bottom: 346, to: "dilly", entryX: 748, entryY: 320 },
      { left: 1996, top: 724, right: 2106, bottom: 818, to: "lab", entryX: 460, entryY: 526 }
    ]
  },
  lab: {
    width: LAB_WIDTH,
    height: LAB_HEIGHT,
    element: labInterior,
    player: interiorPlayer,
    target: interiorTarget,
    blocked: LAB_BLOCKED_TERRAIN,
    transitions: [
      { left: 426, top: 534, right: 494, bottom: 610, to: "outside", entryX: 2052, entryY: 832 },
      { left: 92, top: 438, right: 224, bottom: 556, to: "bedroom", entryX: 548, entryY: 420 }
    ]
  },
  bedroom: {
    width: BEDROOM_WIDTH,
    height: BEDROOM_HEIGHT,
    element: bedroomInterior,
    player: bedroomPlayer,
    target: bedroomTarget,
    blocked: BEDROOM_BLOCKED_TERRAIN,
    transitions: [
      { left: 568, top: 392, right: 790, bottom: 552, to: "lab", entryX: 258, entryY: 430 }
    ]
  },
  dilly: {
    width: DILLY_WIDTH,
    height: DILLY_HEIGHT,
    element: dillyInterior,
    player: dillyPlayer,
    target: dillyTarget,
    blocked: DILLY_BLOCKED_TERRAIN,
    transitions: [
      { left: 792, top: 252, right: 874, bottom: 404, to: "outside", entryX: 304, entryY: 362 }
    ]
  }
};

const state = {
  area: "bedroom",
  x: 138,
  y: 162,
  targetX: 138,
  targetY: 162,
  path: [],
  speed: 260,
  zoom: DEFAULT_ZOOM,
  cameraX: 0,
  cameraY: 0,
  transitionCooldown: 0,
  flightMode: false,
  flightPhase: "ground",
  flightTimer: 0,
  lastTime: performance.now()
};

initializeAreaVisibility();
placePlayer();
placeTarget();
placeCamera();
syncPlayerAnimationState();
requestAnimationFrame(tick);

stage.addEventListener("pointerdown", setTarget);
stage.addEventListener("pointermove", (event) => {
  if (event.buttons === 1 && event.pointerType !== "mouse") {
    setTarget(event);
  }
});

[readout, quickNav, zoomControls, flightControls].filter(Boolean).forEach((element) => {
  element.addEventListener("pointerdown", stopUiMovement);
});

zoomIn.addEventListener("click", () => changeZoom(ZOOM_STEP));
zoomOut.addEventListener("click", () => changeZoom(-ZOOM_STEP));
if (flightToggle) {
  flightToggle.addEventListener("click", toggleFlightMode);
}

window.addEventListener("resize", () => {
  state.x = clampWorldX(state.x);
  state.y = clampWorldY(state.y);
  state.targetX = clampWorldX(state.targetX);
  state.targetY = clampWorldY(state.targetY);
  state.path = [];
  placePlayer();
  placeTarget();
  placeCamera();
});

function initializeAreaVisibility() {
  Object.values(AREAS).forEach((area) => {
    area.element.hidden = area !== getActiveArea();
  });
}

function stopUiMovement(event) {
  event.stopPropagation();
}

function isGamePausedForDialogue() {
  return typeof isDialogueActive === "function" && isDialogueActive();
}

function setTarget(event) {
  if (isGamePausedForDialogue()) {
    return;
  }
  if (event.target.closest(".readout, .quick-nav, .zoom-controls, .flight-controls, .start-menu")) {
    return;
  }

  const point = screenToWorld(event.clientX, event.clientY);
  const requested = {
    x: clampWorldX(point.x),
    y: clampWorldY(point.y)
  };
  const destination = findNearestWalkablePoint(requested.x, requested.y);

  if (!destination) {
    state.path = [];
    setPlayerMoving(false);
    return;
  }

  state.targetX = destination.x;
  state.targetY = destination.y;
  state.path = findPath(state.x, state.y, destination.x, destination.y);
  getActiveArea().target.classList.add("visible");
  placeTarget();
}

function changeZoom(amount) {
  state.zoom = clamp(roundZoom(state.zoom + amount), MIN_ZOOM, MAX_ZOOM);
  placeCamera();
}

function toggleFlightMode() {
  if (state.flightPhase === "taking-off" || state.flightPhase === "landing") {
    return;
  }

  if (state.flightMode) {
    startLanding();
  } else {
    startTakeoff();
  }
}

function startTakeoff() {
  state.flightMode = true;
  state.flightPhase = "taking-off";
  clearTimeout(state.flightTimer);
  syncPlayerAnimationState();

  state.flightTimer = setTimeout(() => {
    if (state.flightMode && state.flightPhase === "taking-off") {
      state.flightPhase = "flying";
      syncPlayerAnimationState();
    }
  }, FLIGHT_TAKEOFF_MS);
}

function startLanding() {
  state.flightMode = false;
  state.flightPhase = "landing";
  state.path = [];
  getActiveArea().target.classList.remove("visible");
  clearTimeout(state.flightTimer);
  syncPlayerAnimationState();

  state.flightTimer = setTimeout(() => {
    if (!state.flightMode && state.flightPhase === "landing") {
      state.flightPhase = "ground";
      syncPlayerAnimationState();
    }
  }, FLIGHT_LAND_MS);
}

function tick(now) {
  const delta = Math.min((now - state.lastTime) / 1000, 0.05);
  state.lastTime = now;
  state.transitionCooldown = Math.max(0, state.transitionCooldown - delta);

  
  if (isGamePausedForDialogue()) {
    state.path = [];
    getActiveArea().target.classList.remove("visible");
    setPlayerMoving(false);
    requestAnimationFrame(tick);
    return;
  }

  if (state.path.length > 0) {
    followPath(delta);
  } else {
    getActiveArea().target.classList.remove("visible");
  }

  setPlayerMoving(state.path.length > 0);
  requestAnimationFrame(tick);
}

function followPath(delta) {
  const waypoint = state.path[0];
  const dx = waypoint.x - state.x;
  const dy = waypoint.y - state.y;
  const distance = Math.hypot(dx, dy);
  const step = state.speed * delta;

  if (distance <= Math.max(1, step)) {
    state.x = waypoint.x;
    state.y = waypoint.y;
    state.path.shift();
    placePlayer();
    placeCamera();
    enterTransitionAtCurrentPosition();
    return;
  }

  const nextX = state.x + (dx / distance) * step;
  const nextY = state.y + (dy / distance) * step;
  const transition = getTransition(nextX, nextY);

  if (transition && state.transitionCooldown === 0) {
    enterArea(transition.to, transition.entryX, transition.entryY);
  } else if (isUiBlocked(nextX, nextY) || isTerrainBlocked(nextX, nextY)) {
    state.path = [];
    state.targetX = state.x;
    state.targetY = state.y;
    getActiveArea().target.classList.remove("visible");
  } else {
    getActiveArea().player.classList.toggle("facing-left", dx < -1);
    state.x = nextX;
    state.y = nextY;
    placePlayer();
    placeCamera();
  }
}

function enterTransitionAtCurrentPosition() {
  const transition = getTransition(state.x, state.y);

  if (transition && state.transitionCooldown === 0) {
    enterArea(transition.to, transition.entryX, transition.entryY);
  }
}

function placePlayer() {
  const area = getActiveArea();
  area.player.style.left = `${state.x}px`;
  area.player.style.top = `${state.y}px`;
  syncSurfaceState();
}

function syncSurfaceState() {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.toggle("on-sand", area === getActiveArea() && state.area === "outside" && isSandPoint(state.x, state.y));
  });
}

function isSandPoint(worldX, worldY) {
  if (state.area !== "outside") {
    return false;
  }

  const southBeach = worldY >= 1308;
  const riverBank = worldX >= 690 && worldX <= 1720 && worldY <= 1440;
  const riverMouth = worldX >= 560 && worldX <= 1160 && worldY >= 936;

  return southBeach || riverBank || riverMouth;
}

function setPlayerMoving(isMoving) {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.toggle("is-moving", area === getActiveArea() && isMoving);
  });
  syncPlayerAnimationState();
}

function syncPlayerAnimationState() {
  Object.values(AREAS).forEach((area) => {
    const isActive = area === getActiveArea();
    area.player.classList.toggle("is-taking-off", isActive && state.flightPhase === "taking-off");
    area.player.classList.toggle("is-flying", isActive && state.flightPhase === "flying");
    area.player.classList.toggle("is-landing", isActive && state.flightPhase === "landing");
  });

  if (flightToggle) {
    flightToggle.textContent = state.flightMode ? "Land" : "Fly";
    flightToggle.setAttribute("aria-label", state.flightMode ? "Land" : "Take flight");
    flightToggle.setAttribute("aria-pressed", String(state.flightMode));
  }
}

function placeTarget() {
  const area = getActiveArea();
  area.target.style.left = `${state.targetX}px`;
  area.target.style.top = `${state.targetY}px`;
}

function placeCamera() {
  const area = getActiveArea();
  const scaledWidth = area.width * state.zoom;
  const scaledHeight = area.height * state.zoom;
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  state.cameraX = scaledWidth <= viewWidth
    ? (viewWidth - scaledWidth) / 2
    : clamp(viewWidth / 2 - state.x * state.zoom, viewWidth - scaledWidth, 0);
  state.cameraY = scaledHeight <= viewHeight
    ? (viewHeight - scaledHeight) / 2
    : clamp(viewHeight / 2 - state.y * state.zoom, viewHeight - scaledHeight, 0);

  area.element.style.transform = `translate(${state.cameraX}px, ${state.cameraY}px) scale(${state.zoom})`;
}

function screenToWorld(screenX, screenY) {
  return {
    x: (screenX - state.cameraX) / state.zoom,
    y: (screenY - state.cameraY) / state.zoom
  };
}

function worldToScreen(worldX, worldY) {
  return {
    x: state.cameraX + worldX * state.zoom,
    y: state.cameraY + worldY * state.zoom
  };
}

function isUiBlocked(worldX, worldY) {
  const screenPoint = worldToScreen(worldX, worldY);
  return getBlockedRects().some((rect) => {
    return screenPoint.x >= rect.left && screenPoint.x <= rect.right && screenPoint.y >= rect.top && screenPoint.y <= rect.bottom;
  });
}

function isTerrainBlocked(worldX, worldY) {
  const radius = 18;
  return getActiveArea().blocked.some((rect) => {
    if (rect.flightPassable && state.flightMode) {
      return false;
    }
    return worldX >= rect.left - radius && worldX <= rect.right + radius && worldY >= rect.top - radius && worldY <= rect.bottom + radius;
  });
}

function isWalkablePoint(worldX, worldY) {
  return !isTerrainBlocked(worldX, worldY) && worldX >= 24 && worldX <= getActiveArea().width - 24 && worldY >= 24 && worldY <= getActiveArea().height - 24;
}

function getTransition(worldX, worldY) {
  return getActiveArea().transitions.find((rect) => {
    return worldX >= rect.left && worldX <= rect.right && worldY >= rect.top && worldY <= rect.bottom;
  });
}

function enterArea(areaName, x, y) {
  const currentArea = getActiveArea();
  currentArea.target.classList.remove("visible");
  currentArea.element.hidden = true;

  state.area = areaName;
  state.x = x;
  state.y = y;
  state.targetX = x;
  state.targetY = y;
  state.path = [];
  state.transitionCooldown = TRANSITION_COOLDOWN;

  const nextArea = getActiveArea();
  nextArea.element.hidden = false;
  Object.values(AREAS).forEach((area) => area.player.classList.remove("is-moving"));
  nextArea.player.classList.remove("facing-left");
  syncPlayerAnimationState();
  placePlayer();
  placeTarget();
  placeCamera();
}

function getActiveArea() {
  return AREAS[state.area];
}

function findPath(startX, startY, endX, endY) {
  const start = findNearestWalkableCell(worldToCell(startX), worldToCell(startY));
  const end = findNearestWalkableCell(worldToCell(endX), worldToCell(endY));

  if (!start || !end) {
    return [];
  }

  if (start.key === end.key) {
    return [{ x: endX, y: endY }];
  }

  const open = [makePathNode(start.x, start.y, null, 0, getCellDistance(start, end))];
  const best = new Map([[start.key, open[0]]]);
  const closed = new Set();
  let searched = 0;

  while (open.length > 0 && searched < PATH_SEARCH_LIMIT) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift();

    if (closed.has(current.key)) {
      continue;
    }

    if (current.key === end.key) {
      return simplifyPath(buildWaypointPath(current, endX, endY)).slice(1);
    }

    closed.add(current.key);
    searched += 1;

    getNeighbors(current).forEach((neighbor) => {
      if (closed.has(neighbor.key) || !isWalkableCell(neighbor.x, neighbor.y)) {
        return;
      }

      if (neighbor.diagonal && (!isWalkableCell(current.x + neighbor.dx, current.y) || !isWalkableCell(current.x, current.y + neighbor.dy))) {
        return;
      }

      const moveCost = neighbor.diagonal ? Math.SQRT2 : 1;
      const g = current.g + moveCost;
      const previous = best.get(neighbor.key);

      if (!previous || g < previous.g) {
        const node = makePathNode(neighbor.x, neighbor.y, current, g, getCellDistance(neighbor, end));
        best.set(neighbor.key, node);
        open.push(node);
      }
    });
  }

  return [];
}

function buildWaypointPath(node, exactEndX, exactEndY) {
  const path = [];
  let current = node;

  while (current) {
    path.unshift(cellToWorld(current.x, current.y));
    current = current.parent;
  }

  path.push({ x: exactEndX, y: exactEndY });
  return path;
}

function simplifyPath(path) {
  if (path.length <= 2) {
    return path;
  }

  const simplified = [path[0]];
  let anchorIndex = 0;

  for (let index = 2; index < path.length; index += 1) {
    if (!hasLineOfSight(path[anchorIndex], path[index])) {
      simplified.push(path[index - 1]);
      anchorIndex = index - 1;
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

function hasLineOfSight(from, to) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const samples = Math.max(1, Math.ceil(distance / (PATH_GRID_SIZE / 2)));

  for (let index = 1; index <= samples; index += 1) {
    const ratio = index / samples;
    const x = from.x + (to.x - from.x) * ratio;
    const y = from.y + (to.y - from.y) * ratio;

    if (!isWalkablePoint(x, y)) {
      return false;
    }
  }

  return true;
}

function findNearestWalkablePoint(worldX, worldY) {
  if (isWalkablePoint(worldX, worldY)) {
    return { x: worldX, y: worldY };
  }

  const cell = findNearestWalkableCell(worldToCell(worldX), worldToCell(worldY));
  return cell ? cellToWorld(cell.x, cell.y) : null;
}

function findNearestWalkableCell(startX, startY) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);
  const originX = clamp(startX, 0, maxColumns - 1);
  const originY = clamp(startY, 0, maxRows - 1);

  if (isWalkableCell(originX, originY)) {
    return makeCell(originX, originY);
  }

  const maxRadius = Math.max(maxColumns, maxRows);

  for (let radius = 1; radius <= maxRadius; radius += 1) {
    for (let y = originY - radius; y <= originY + radius; y += 1) {
      for (let x = originX - radius; x <= originX + radius; x += 1) {
        const onEdge = x === originX - radius || x === originX + radius || y === originY - radius || y === originY + radius;

        if (onEdge && isWalkableCell(x, y)) {
          return makeCell(x, y);
        }
      }
    }
  }

  return null;
}

function getNeighbors(cell) {
  const directions = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: -1, diagonal: true },
    { dx: 1, dy: 1, diagonal: true },
    { dx: -1, dy: 1, diagonal: true },
    { dx: -1, dy: -1, diagonal: true }
  ];

  return directions.map((direction) => ({
    x: cell.x + direction.dx,
    y: cell.y + direction.dy,
    dx: direction.dx,
    dy: direction.dy,
    diagonal: Boolean(direction.diagonal),
    key: getCellKey(cell.x + direction.dx, cell.y + direction.dy)
  }));
}

function isWalkableCell(cellX, cellY) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);

  if (cellX < 0 || cellX >= maxColumns || cellY < 0 || cellY >= maxRows) {
    return false;
  }

  const point = cellToWorld(cellX, cellY);
  return isWalkablePoint(point.x, point.y);
}

function makePathNode(x, y, parent, g, h) {
  return {
    x,
    y,
    parent,
    g,
    h,
    f: g + h,
    key: getCellKey(x, y)
  };
}

function makeCell(x, y) {
  return {
    x,
    y,
    key: getCellKey(x, y)
  };
}

function getCellDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function worldToCell(value) {
  return Math.floor(value / PATH_GRID_SIZE);
}

function cellToWorld(cellX, cellY) {
  return {
    x: clamp(cellX * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 24, getActiveArea().width - 24),
    y: clamp(cellY * PATH_GRID_SIZE + PATH_GRID_SIZE / 2, 24, getActiveArea().height - 24)
  };
}

function getCellKey(cellX, cellY) {
  return `${cellX},${cellY}`;
}

function getBlockedRects() {
  return [readout, quickNav, zoomControls, flightControls].filter(Boolean).map((element) => {
    const rect = element.getBoundingClientRect();
    const padding = getPlayerRadius() * state.zoom + 8;
    return {
      left: rect.left - padding,
      right: rect.right + padding,
      top: rect.top - padding,
      bottom: rect.bottom + padding
    };
  });
}

function getPlayerRadius() {
  return player.getBoundingClientRect().width / 2;
}

function clampWorldX(value) {
  return clamp(value, 24, getActiveArea().width - 24);
}

function clampWorldY(value) {
  return clamp(value, 24, getActiveArea().height - 24);
}

function roundZoom(value) {
  return Math.round(value * 100) / 100;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}



















