const FOREST_WIDTH = 3000;
const FOREST_HEIGHT = 3000;
const DILLY_WIDTH = 880;
const DILLY_HEIGHT = 640;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM = 0.85;
const PATH_GRID_SIZE = 32;
const PATH_SEARCH_LIMIT = 14000;
const VERTICAL_DIRECTION_BIAS = 1.15;
const TRANSITION_COOLDOWN = 0.45;
const FLIGHT_TAKEOFF_MS = 380;
const FLIGHT_LAND_MS = 320;
const LITTLE_WING_V25_FRAME_SOURCES = [
  "assets/sprites/characters/LittlewingV2.5/Idle/idle2.png",
  "assets/sprites/characters/LittlewingV2.5/Idle/idle3.png",
  "assets/sprites/characters/LittlewingV2.5/Idle/idle5.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/walk1.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/walk2.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/walk3.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/walk4.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/Frontwalk1.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/Frontwalk2.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/Backwalk1.png",
  "assets/sprites/characters/LittlewingV2.5/Walk/Backwalk2.png",
  "assets/sprites/characters/LittlewingV2.5/Takeoff/takeoff1.png",
  "assets/sprites/characters/LittlewingV2.5/Takeoff/takeoff2.png",
  "assets/sprites/characters/LittlewingV2.5/Takeoff/takeoff3.png",
  "assets/sprites/characters/LittlewingV2.5/Takeoff/takeoff4.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/flight1.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/flight2.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/flight3.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/flight4.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/flight5.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/frontflight1.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/frontflight2.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/frontflight3.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/frontflight4.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/backflight1.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/backflight2.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/backflight3.png",
  "assets/sprites/characters/LittlewingV2.5/Flight/backflight4.png",
  "assets/sprites/characters/LittlewingV2.5/Landing/landing1.png",
  "assets/sprites/characters/LittlewingV2.5/Landing/landing2.png",
  "assets/sprites/characters/LittlewingV2.5/Landing/landing3.png",
  "assets/sprites/characters/LittlewingV2.5/Landing/landing4.png"
];
const littleWingV25Preloads = LITTLE_WING_V25_FRAME_SOURCES.map((source) => {
  const image = new Image();
  image.decoding = "async";
  image.src = source;
  return image;
});
const DILLY_BLOCKED_TERRAIN = [
  { name: "old-dilly", left: 90, top: 152, right: 213, bottom: 296 },
  { name: "liz", left: 267, top: 158, right: 432, bottom: 314 }
];
const FOREST_BLOCKED_TERRAIN = [
  { name: "majira", left: 1193, top: 925, right: 1262, bottom: 1045 },
  { name: "old-dilly-house", left: 2015, top: 61, right: 2785, bottom: 1042 }
];
const FOREST_CANOPY_ROWS = [
  [0, [[0, 93]]],
  [1, [[0, 93]]],
  [2, [[0, 93]]],
  [3, [[0, 93]]],
  [4, [[0, 93]]],
  [5, [[0, 93]]],
  [6, [[0, 93]]],
  [7, [[0, 93]]],
  [8, [[0, 93]]],
  [9, [[0, 93]]],
  [10, [[0, 93]]],
  [11, [[0, 93]]],
  [12, [[0, 93]]],
  [13, [[0, 93]]],
  [14, [[0, 93]]],
  [15, [[0, 93]]],
  [16, [[0, 93]]],
  [17, [[0, 93]]],
  [18, [[0, 93]]],
  [19, [[0, 93]]],
  [20, [[0, 93]]],
  [21, [[0, 93]]],
  [22, [[0, 93]]],
  [23, [[0, 93]]],
  [24, [[0, 93]]],
  [25, [[0, 93]]],
  [26, [[0, 93]]],
  [27, [[0, 34], [37, 37], [40, 93]]],
  [28, [[0, 33], [44, 93]]],
  [29, [[0, 33], [44, 93]]],
  [30, [[0, 33], [44, 93]]],
  [31, [[0, 33], [44, 93]]],
  [32, [[0, 33], [43, 93]]],
  [33, [[0, 34], [43, 93]]],
  [34, [[0, 34], [43, 93]]],
  [35, [[0, 35], [43, 93]]],
  [36, [[0, 35], [43, 93]]],
  [37, [[0, 35], [42, 93]]],
  [38, [[0, 35], [42, 93]]],
  [39, [[0, 35], [42, 93]]],
  [40, [[0, 35], [42, 93]]],
  [41, [[0, 36], [42, 93]]],
  [42, [[0, 36], [41, 93]]],
  [43, [[0, 36], [41, 93]]],
  [44, [[0, 36], [40, 93]]],
  [45, [[0, 37], [40, 93]]],
  [46, [[0, 37], [41, 93]]],
  [47, [[0, 37], [41, 93]]],
  [48, [[0, 36], [41, 93]]],
  [49, [[0, 35], [41, 93]]],
  [50, [[0, 34], [40, 93]]],
  [51, [[0, 34], [40, 93]]],
  [52, [[0, 35], [39, 93]]],
  [53, [[0, 35], [39, 93]]],
  [54, [[0, 35], [39, 93]]],
  [55, [[0, 35], [39, 52], [57, 93]]],
  [56, [[0, 35], [39, 52], [58, 93]]],
  [57, [[0, 35], [39, 52], [59, 93]]],
  [58, [[0, 33], [40, 44], [48, 52], [59, 93]]],
  [59, [[0, 33], [40, 43], [49, 50], [59, 93]]],
  [60, [[0, 33], [40, 42], [59, 93]]],
  [61, [[0, 31], [60, 93]]],
  [62, [[0, 29], [61, 93]]],
  [63, [[0, 29], [66, 93]]],
  [64, [[0, 30], [66, 93]]],
  [65, [[0, 30], [67, 93]]],
  [66, [[0, 29], [53, 58], [68, 70], [72, 72], [76, 93]]],
  [67, [[0, 30], [52, 59], [79, 93]]],
  [68, [[0, 30], [49, 59], [80, 93]]],
  [69, [[0, 36], [38, 60], [80, 93]]],
  [70, [[0, 60], [80, 93]]],
  [71, [[0, 61], [81, 93]]],
  [72, [[0, 61], [82, 93]]],
  [73, [[0, 61], [81, 93]]],
  [74, [[0, 61], [81, 93]]],
  [75, [[0, 61], [81, 93]]],
  [76, [[0, 62], [81, 93]]],
  [77, [[0, 62], [81, 93]]],
  [78, [[0, 62], [81, 93]]],
  [79, [[0, 63], [81, 93]]],
  [80, [[0, 64], [81, 93]]],
  [81, [[0, 64], [81, 93]]],
  [82, [[0, 64], [80, 93]]],
  [83, [[0, 64], [79, 93]]],
  [84, [[0, 64], [78, 93]]],
  [85, [[0, 63], [78, 93]]],
  [86, [[0, 63], [76, 93]]],
  [87, [[0, 62], [72, 72], [75, 93]]],
  [88, [[0, 61], [71, 72], [74, 93]]],
  [89, [[0, 61], [71, 93]]],
  [90, [[0, 62], [71, 93]]],
  [91, [[0, 61], [70, 93]]],
  [92, [[0, 61], [70, 93]]],
  [93, [[0, 60], [69, 93]]]
];
const FOREST_CANOPY_ROW_MAP = new Map(FOREST_CANOPY_ROWS);

const stage = document.getElementById("stage");
const world = document.getElementById("world");
const player = document.getElementById("player");
const targetEl = document.getElementById("target");
const forestArea = document.getElementById("forest-area");
const forestPlayer = document.getElementById("forest-player");
const forestTarget = document.getElementById("forest-target");
const labInterior = document.getElementById("lab-interior");
const interiorPlayer = document.getElementById("interior-player");
const interiorTarget = document.getElementById("interior-target");
const bedroomInterior = document.getElementById("bedroom-interior");
const bedroomPlayer = document.getElementById("bedroom-player");
const bedroomTarget = document.getElementById("bedroom-target");
const basementInterior = document.getElementById("basement-interior");
const basementPlayer = document.getElementById("basement-player");
const basementTarget = document.getElementById("basement-target");
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
    width: OUTSIDE_LAYOUT.width,
    height: OUTSIDE_LAYOUT.height,
    element: world,
    player,
    target: targetEl,
    blocked: [],
    collisionGridSize: OUTSIDE_LAYOUT.collisionGridSize,
    collisionLayers: OUTSIDE_LAYOUT.collisionLayers,
    transitions: OUTSIDE_LAYOUT.transitions
  },
  forest: {
    width: FOREST_WIDTH,
    height: FOREST_HEIGHT,
    element: forestArea,
    player: forestPlayer,
    target: forestTarget,
    blocked: FOREST_BLOCKED_TERRAIN,
    canopyRows: FOREST_CANOPY_ROW_MAP,
    transitions: [
      { left: 0, top: 24, right: 97, bottom: 2929, to: "outside", entryX: 2570, preserveY: true, snapToWalkable: true },
      { left: 2310, top: 990, right: 2500, bottom: 1100, to: "dilly", entryX: 748, entryY: 320 }
    ]
  },
  lab: {
    width: INTERIOR_LAYOUTS.lab.width,
    height: INTERIOR_LAYOUTS.lab.height,
    element: labInterior,
    player: interiorPlayer,
    target: interiorTarget,
    blocked: INTERIOR_LAYOUTS.lab.blocked,
    transitions: INTERIOR_LAYOUTS.lab.transitions
  },
  bedroom: {
    width: INTERIOR_LAYOUTS.bedroom.width,
    height: INTERIOR_LAYOUTS.bedroom.height,
    element: bedroomInterior,
    player: bedroomPlayer,
    target: bedroomTarget,
    blocked: INTERIOR_LAYOUTS.bedroom.blocked,
    transitions: INTERIOR_LAYOUTS.bedroom.transitions
  },
  basement: {
    width: INTERIOR_LAYOUTS.basement.width,
    height: INTERIOR_LAYOUTS.basement.height,
    element: basementInterior,
    player: basementPlayer,
    target: basementTarget,
    blocked: INTERIOR_LAYOUTS.basement.blocked,
    collisionGridSize: INTERIOR_LAYOUTS.basement.collisionGridSize,
    collisionLayers: INTERIOR_LAYOUTS.basement.collisionLayers,
    transitions: INTERIOR_LAYOUTS.basement.transitions
  },
  dilly: {
    width: DILLY_WIDTH,
    height: DILLY_HEIGHT,
    element: dillyInterior,
    player: dillyPlayer,
    target: dillyTarget,
    blocked: DILLY_BLOCKED_TERRAIN,
    transitions: [
      { left: 792, top: 252, right: 874, bottom: 404, to: "forest", entryX: 2405, entryY: 1120 }
    ]
  }
};

const state = {
  area: "bedroom",
  x: 258,
  y: 292,
  targetX: 258,
  targetY: 292,
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

applyOutsideLayout();
applyInteriorLayouts();
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
  const dialogueActive = typeof isDialogueActive === "function" && isDialogueActive();
  const controlsTutorialActive = typeof isOpeningControlsTutorialActive === "function" && isOpeningControlsTutorialActive();
  const vacuumEncounterLocked = typeof isVacuumEncounterMovementLocked === "function" && isVacuumEncounterMovementLocked();
  return dialogueActive || controlsTutorialActive || vacuumEncounterLocked;
}

function isMovementLockedForBedroomCage() {
  return typeof isBedroomCageBreakoutPending === "function" && isBedroomCageBreakoutPending();
}

function setTarget(event) {
  if (isGamePausedForDialogue()) {
    return;
  }

  if (isMovementLockedForBedroomCage()) {
    return;
  }

  if (event.target.closest(".readout, .quick-nav, .zoom-controls, .flight-controls, .start-menu, .vacuum-escape-button")) {
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
  if (isGamePausedForDialogue() || isMovementLockedForBedroomCage()) {
    return;
  }

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
  if (typeof playTakeoffSound === "function") {
    playTakeoffSound();
  }
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

  if (typeof updateVacuumEncounter === "function") {
    updateVacuumEncounter(delta);
  }

  
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
    enterTransition(transition);
  } else if (isUiBlocked(nextX, nextY) || isTerrainBlocked(nextX, nextY)) {
    state.path = [];
    state.targetX = state.x;
    state.targetY = state.y;
    getActiveArea().target.classList.remove("visible");
  } else {
    updatePlayerMovementDirection(dx, dy);
    state.x = nextX;
    state.y = nextY;
    placePlayer();
    placeCamera();
  }
}

function updatePlayerMovementDirection(deltaX, deltaY) {
  const activePlayer = getActiveArea().player;
  const isVertical = Math.abs(deltaY) > Math.abs(deltaX) * VERTICAL_DIRECTION_BIAS;
  const isFacingUp = isVertical && deltaY < 0;
  const isFacingDown = isVertical && deltaY > 0;

  activePlayer.classList.toggle("facing-up", isFacingUp);
  activePlayer.classList.toggle("facing-down", isFacingDown);

  if (isVertical) {
    activePlayer.classList.remove("facing-left");
  } else if (Math.abs(deltaX) > 1) {
    activePlayer.classList.toggle("facing-left", deltaX > 0);
  }
}

function enterTransitionAtCurrentPosition() {
  const transition = getTransition(state.x, state.y);

  if (transition && state.transitionCooldown === 0) {
    enterTransition(transition);
  }
}

function placePlayer() {
  const area = getActiveArea();
  area.player.style.left = `${state.x}px`;
  area.player.style.top = `${state.y}px`;
}

function setPlayerMoving(isMoving) {
  Object.values(AREAS).forEach((area) => {
    area.player.classList.toggle("is-moving", area === getActiveArea() && isMoving);
  });
  syncPlayerAnimationState();
}

function syncPlayerAnimationState() {
  document.body.classList.toggle("flight-animation-active", state.flightPhase !== "ground");

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
  if (!state.flightMode && isAreaCanopyBlocked(worldX, worldY)) {
    return true;
  }

  if (isAreaCollisionLayerBlocked(worldX, worldY)) {
    return true;
  }

  return getActiveArea().blocked.some((rect) => {
    if (rect.pickupId && typeof isPickupCollected === "function" && isPickupCollected(rect.pickupId)) {
      return false;
    }
    if (rect.flightPassable && state.flightMode) {
      return false;
    }
    return worldX >= rect.left - radius && worldX <= rect.right + radius && worldY >= rect.top - radius && worldY <= rect.bottom + radius;
  });
}

function isAreaCollisionLayerBlocked(worldX, worldY) {
  const area = getActiveArea();
  if (!area.collisionLayers) {
    return false;
  }

  const gridSize = area.collisionGridSize || PATH_GRID_SIZE;
  const cellX = Math.floor(worldX / gridSize);
  const cellY = Math.floor(worldY / gridSize);

  return area.collisionLayers.some((layer) => {
    if (layer.flightPassable && state.flightMode) {
      return false;
    }
    const ranges = layer.rows.get(cellY);
    return Boolean(ranges && ranges.some(([left, right]) => cellX >= left && cellX <= right));
  });
}

function isAreaCanopyBlocked(worldX, worldY) {
  const canopyRows = getActiveArea().canopyRows;
  if (!canopyRows) {
    return false;
  }

  const cellX = Math.floor(worldX / PATH_GRID_SIZE);
  const cellY = Math.floor(worldY / PATH_GRID_SIZE);
  const ranges = canopyRows.get(cellY);
  return Boolean(ranges && ranges.some(([left, right]) => cellX >= left && cellX <= right));
}

function isWalkablePoint(worldX, worldY, allowTransitions = true) {
  const isInsideArea = worldX >= 24 && worldX <= getActiveArea().width - 24 && worldY >= 24 && worldY <= getActiveArea().height - 24;
  const isTransition = allowTransitions && Boolean(getTransition(worldX, worldY));
  return isInsideArea && (isTransition || !isTerrainBlocked(worldX, worldY));
}

function getTransition(worldX, worldY) {
  return getActiveArea().transitions.find((rect) => {
    return worldX >= rect.left && worldX <= rect.right && worldY >= rect.top && worldY <= rect.bottom;
  });
}

function enterTransition(transition) {
  const destination = AREAS[transition.to];
  const entryY = transition.preserveY
    ? clamp((state.y / getActiveArea().height) * destination.height, 24, destination.height - 24)
    : transition.entryY;
  enterArea(transition.to, transition.entryX, entryY, transition.snapToWalkable);
}

function enterArea(areaName, x, y, snapToWalkable = false) {
  const currentArea = getActiveArea();
  const previousAreaName = state.area;
  currentArea.target.classList.remove("visible");
  currentArea.element.hidden = true;

  state.area = areaName;
  if (snapToWalkable) {
    const entryCell = findNearestWalkableCell(worldToCell(x), worldToCell(y), false);
    const safeEntry = entryCell && cellToWorld(entryCell.x, entryCell.y);
    x = safeEntry ? safeEntry.x : x;
    y = safeEntry ? safeEntry.y : y;
  }
  state.x = x;
  state.y = y;
  state.targetX = x;
  state.targetY = y;
  state.path = [];
  state.transitionCooldown = TRANSITION_COOLDOWN;

  const nextArea = getActiveArea();
  nextArea.element.hidden = false;
  Object.values(AREAS).forEach((area) => area.player.classList.remove("is-moving"));
  nextArea.player.classList.remove("facing-left", "facing-up", "facing-down");
  syncPlayerAnimationState();
  placePlayer();
  placeTarget();
  placeCamera();

  if (typeof handleVacuumAreaEntered === "function") {
    handleVacuumAreaEntered(areaName, previousAreaName);
  }
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

function findNearestWalkableCell(startX, startY, allowTransitions = true) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);
  const originX = clamp(startX, 0, maxColumns - 1);
  const originY = clamp(startY, 0, maxRows - 1);

  if (isWalkableCell(originX, originY, allowTransitions)) {
    return makeCell(originX, originY);
  }

  const maxRadius = Math.max(maxColumns, maxRows);

  for (let radius = 1; radius <= maxRadius; radius += 1) {
    for (let y = originY - radius; y <= originY + radius; y += 1) {
      for (let x = originX - radius; x <= originX + radius; x += 1) {
        const onEdge = x === originX - radius || x === originX + radius || y === originY - radius || y === originY + radius;

        if (onEdge && isWalkableCell(x, y, allowTransitions)) {
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

function isWalkableCell(cellX, cellY, allowTransitions = true) {
  const maxColumns = Math.ceil(getActiveArea().width / PATH_GRID_SIZE);
  const maxRows = Math.ceil(getActiveArea().height / PATH_GRID_SIZE);

  if (cellX < 0 || cellX >= maxColumns || cellY < 0 || cellY >= maxRows) {
    return false;
  }

  const point = cellToWorld(cellX, cellY);
  return isWalkablePoint(point.x, point.y, allowTransitions);
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
    const padding = window.innerWidth <= 620 ? 2 : getPlayerRadius() * state.zoom + 8;
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
  return clamp(value, 32, getActiveArea().width - 32);
}

function clampWorldY(value) {
  return clamp(value, 32, getActiveArea().height - 32);
}

function roundZoom(value) {
  return Math.round(value * 100) / 100;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}



















