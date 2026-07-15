const OPENING_BEDROOM_DIALOGUE_KEY = "lab-zero-opening-bedroom-dialogue";
const OPENING_BEDROOM_INTRO_KEY = "lab-zero-opening-bedroom-intro";
const OPENING_CONTROLS_TUTORIAL_KEY = "lab-zero-opening-controls-tutorial";
const BEDROOM_CAGE_ZOOM = 1.35;
const OPENING_WAKE_DARK_HOLD = 300;
const OPENING_WAKE_FADE_DURATION = 2600;
const BEDROOM_CAGE_START_X = 138;
const BEDROOM_CAGE_START_Y = 162;
const BEDROOM_CAGE_EXIT_X = 270;
const BEDROOM_CAGE_EXIT_Y = 258;
const BEDROOM_CAGE_BREAKOUT_ZONE = {
  left: 112,
  top: 118,
  right: 224,
  bottom: 248
};
const BEDROOM_CAGE_BREAKOUT_TAPS = 4;
const BEDROOM_CAGE_BREAKOUT_PROMPTS = [
  "Tap the cage to break free",
  "Again. The latch rattles.",
  "Almost out."
];
let bedroomCageBreakoutTaps = 0;
let openingControlsTutorialActive = false;

function playOpeningBedroomDialogue() {
  if (dialogueState.active || state.area !== "bedroom" || sessionStorage.getItem(OPENING_BEDROOM_DIALOGUE_KEY)) {
    return;
  }

  placeLittleWingInBedroomCage();

  if (!sessionStorage.getItem(OPENING_BEDROOM_INTRO_KEY)) {
    sessionStorage.setItem(OPENING_BEDROOM_INTRO_KEY, "true");
    revealOpeningWakeFade(() => startDialogue(getOpeningBedroomIntroLines()));
  }
}

function prepareOpeningWakeFade() {
  const fade = getOpeningWakeFade();
  fade.classList.remove("is-revealing");
  fade.hidden = false;
}

function revealOpeningWakeFade(onComplete) {
  const fade = getOpeningWakeFade();

  window.setTimeout(() => {
    window.requestAnimationFrame(() => {
      fade.classList.add("is-revealing");
    });
  }, OPENING_WAKE_DARK_HOLD);

  window.setTimeout(() => {
    fade.hidden = true;
    fade.classList.remove("is-revealing");

    if (onComplete) {
      onComplete();
    }
  }, OPENING_WAKE_DARK_HOLD + OPENING_WAKE_FADE_DURATION);
}

function getOpeningWakeFade() {
  let fade = document.getElementById("opening-wake-fade");

  if (!fade) {
    fade = document.createElement("div");
    fade.id = "opening-wake-fade";
    fade.className = "opening-wake-fade";
    fade.hidden = true;
    fade.setAttribute("aria-hidden", "true");
    stage.append(fade);
  }

  return fade;
}

function getOpeningBedroomIntroLines() {
  const lines = [
    littleWingLine("Oh, I must have slept in..."),
    littleWingLine("Where is everyone? They usually get me up."),
    littleWingLine("The cage latch is loose. If I pull it just right, I can get out."),
  ];

  lines.onComplete = showBedroomCagePrompt;
  return lines;
}

function getBedroomCageBreakoutLines() {
  const lines = [
    {
      ...littleWingLine("Tap tap... tap."),
      onShow: openBedroomCageDoor
    },
    {
      ...littleWingLine("Yes! Freedom!"),
      onShow: moveLittleWingOutOfBedroomCage
    },
    littleWingLine("I wonder if everyone is downstairs?")
  ];

  lines.onComplete = finishBedroomCageBreakout;
  return lines;
}

function finishBedroomCageBreakout() {
  state.zoom = DEFAULT_ZOOM;
  placeCamera();
  showOpeningControlsTutorial();
}

function isOpeningControlsTutorialActive() {
  return openingControlsTutorialActive;
}

function showOpeningControlsTutorial() {
  if (sessionStorage.getItem(OPENING_CONTROLS_TUTORIAL_KEY)) {
    return;
  }

  const tutorial = getOpeningControlsTutorial();
  const area = getActiveArea();
  state.path = [];
  state.targetX = state.x;
  state.targetY = state.y;
  area.target.classList.remove("visible");
  openingControlsTutorialActive = true;
  sessionStorage.setItem(OPENING_CONTROLS_TUTORIAL_KEY, "true");
  document.body.classList.add("controls-tutorial-open");
  tutorial.hidden = false;
  tutorial.querySelector("button").focus();
}

function getOpeningControlsTutorial() {
  let tutorial = document.getElementById("opening-controls-tutorial");

  if (tutorial) {
    return tutorial;
  }

  tutorial = document.createElement("div");
  tutorial.id = "opening-controls-tutorial";
  tutorial.className = "controls-tutorial";
  tutorial.hidden = true;
  tutorial.setAttribute("role", "dialog");
  tutorial.setAttribute("aria-modal", "true");
  tutorial.setAttribute("aria-labelledby", "controls-tutorial-title");
  tutorial.innerHTML = `
    <div class="controls-tutorial-panel">
      <h2 id="controls-tutorial-title">Quick controls</h2>
      <p>Use <strong>-</strong> and <strong>+</strong> at the top right to zoom.</p>
      <p>Tap <strong>Fly</strong> at the bottom right to take off or land.</p>
      <button type="button">Got it</button>
    </div>
  `;
  tutorial.querySelector("button").addEventListener("click", closeOpeningControlsTutorial);
  stage.append(tutorial);
  return tutorial;
}

function closeOpeningControlsTutorial(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const tutorial = document.getElementById("opening-controls-tutorial");
  openingControlsTutorialActive = false;
  document.body.classList.remove("controls-tutorial-open");

  if (tutorial) {
    tutorial.hidden = true;
  }
}

function isBedroomCageBreakoutPending() {
  return state.area === "bedroom" && !sessionStorage.getItem(OPENING_BEDROOM_DIALOGUE_KEY);
}

function handleBedroomCageBreakoutPointer(event) {
  if (state.area !== "bedroom" || sessionStorage.getItem(OPENING_BEDROOM_DIALOGUE_KEY)) {
    return false;
  }

  if (!isBedroomCageBreakoutPoint(event)) {
    return false;
  }

  bedroomCageBreakoutTaps += 1;

  if (bedroomCageBreakoutTaps < BEDROOM_CAGE_BREAKOUT_TAPS) {
    updateBedroomCagePrompt();
    return true;
  }

  sessionStorage.setItem(OPENING_BEDROOM_DIALOGUE_KEY, "true");
  hideBedroomCagePrompt();
  startDialogue(getBedroomCageBreakoutLines());
  return true;
}

function isBedroomCageBreakoutPoint(event) {
  const point = screenToWorld(event.clientX, event.clientY);

  return point.x >= BEDROOM_CAGE_BREAKOUT_ZONE.left
    && point.x <= BEDROOM_CAGE_BREAKOUT_ZONE.right
    && point.y >= BEDROOM_CAGE_BREAKOUT_ZONE.top
    && point.y <= BEDROOM_CAGE_BREAKOUT_ZONE.bottom;
}

function placeLittleWingInBedroomCage() {
  state.area = "bedroom";
  state.x = BEDROOM_CAGE_START_X;
  state.y = BEDROOM_CAGE_START_Y;
  state.targetX = BEDROOM_CAGE_START_X;
  state.targetY = BEDROOM_CAGE_START_Y;
  state.path = [];
  state.zoom = BEDROOM_CAGE_ZOOM;
  bedroomCageBreakoutTaps = 0;
  closeBedroomCageDoor();

  initializeAreaVisibility();
  placePlayer();
  placeTarget();
  placeCamera();
}

function closeBedroomCageDoor() {
  const cage = document.querySelector(".bedroom-cage-art");

  if (cage) {
    cage.classList.remove("is-open");
  }
}

function openBedroomCageDoor() {
  const cage = document.querySelector(".bedroom-cage-art");

  if (cage) {
    cage.classList.add("is-open");
  }
}

function moveLittleWingOutOfBedroomCage() {
  state.x = BEDROOM_CAGE_EXIT_X;
  state.y = BEDROOM_CAGE_EXIT_Y;
  state.targetX = BEDROOM_CAGE_EXIT_X;
  state.targetY = BEDROOM_CAGE_EXIT_Y;
  state.path = [];

  placePlayer();
  placeTarget();
  placeCamera();
}
function showBedroomCagePrompt() {
  const prompt = getBedroomCagePrompt();
  bedroomCageBreakoutTaps = 0;
  updateBedroomCagePrompt();
  prompt.hidden = false;
}

function hideBedroomCagePrompt() {
  const prompt = document.querySelector(".bedroom-cage-prompt");

  if (prompt) {
    prompt.hidden = true;
  }
}

function getBedroomCagePrompt() {
  let prompt = document.querySelector(".bedroom-cage-prompt");

  if (!prompt) {
    prompt = document.createElement("div");
    prompt.className = "bedroom-cage-prompt";
    prompt.textContent = "Tap the cage to break free";
    stage.append(prompt);
  }

  return prompt;
}

function updateBedroomCagePrompt() {
  const prompt = getBedroomCagePrompt();
  prompt.textContent = BEDROOM_CAGE_BREAKOUT_PROMPTS[Math.min(bedroomCageBreakoutTaps, BEDROOM_CAGE_BREAKOUT_PROMPTS.length - 1)];
}
