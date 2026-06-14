const OPENING_BEDROOM_DIALOGUE_KEY = "lab-zero-opening-bedroom-dialogue";
const OPENING_BEDROOM_INTRO_KEY = "lab-zero-opening-bedroom-intro";
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
  "One more good peck.",
  "Almost out."
];
let bedroomCageBreakoutTaps = 0;

function playOpeningBedroomDialogue() {
  if (dialogueState.active || state.area !== "bedroom" || sessionStorage.getItem(OPENING_BEDROOM_DIALOGUE_KEY)) {
    return;
  }

  placeLittleWingInBedroomCage();

  if (!sessionStorage.getItem(OPENING_BEDROOM_INTRO_KEY)) {
    sessionStorage.setItem(OPENING_BEDROOM_INTRO_KEY, "true");
    startDialogue(getOpeningBedroomIntroLines());
  }
}

function getOpeningBedroomIntroLines() {
  const lines = [
    littleWingLine("Oh, I must have slept in..."),
    littleWingLine("Where is the wizard? He usually gets me up."),
    littleWingLine("The cage latch is loose. If I pull it just right, I can get out."),
  ];

  lines.onComplete = showBedroomCagePrompt;
  return lines;
}

function getBedroomCageBreakoutLines() {
  return [
    {
      ...littleWingLine("Tap tap... tap."),
      onShow: openBedroomCageDoor
    },
    {
      ...littleWingLine("Yes! Freedom!"),
      onShow: moveLittleWingOutOfBedroomCage
    },
    littleWingLine("I bet Wing-Master Cricket knows where the wizard went.")
  ];
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
