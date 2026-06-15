const GAME_STATE_STORAGE_KEY = "lab-zero-game-state";
const RETURN_TO_GAME_STORAGE_KEY = "lab-zero-return-to-game";
const START_MENU_NEW_GAME_KEYS = [
  GAME_STATE_STORAGE_KEY,
  "lab-zero-opening-bedroom-dialogue",
  "lab-zero-opening-bedroom-intro",
  "lab-zero-inventory",
  "lab-zero-player-progress",
  "lab-zero-collected-pickups",
  "lab-zero-old-dilly-treat"
];
const START_AREA = "bedroom";
const START_X = 138;
const START_Y = 162;

const startMenu = document.getElementById("start-menu");
const introCard = document.getElementById("intro-card");
const introTitle = document.getElementById("intro-title");
const introCredit = document.getElementById("intro-credit");
const introSubtitle = document.getElementById("intro-subtitle");
const introStartButton = document.getElementById("intro-start");
const newGameButton = document.getElementById("new-game");
const continueGameButton = document.getElementById("continue-game");
const clearSaveButton = document.getElementById("clear-save");
const INTRO_SLIDES = [
  { title: "Black Candle Labs", credit: "Lead Developer,Writer,Animator Kevin Klinkert", subtitle: "presents" },
  { title: "Lab Zero", credit: "", subtitle: "" },
  { title: "A Budgie RPG", credit: "", subtitle: "" }
];
const INTRO_MENU_ZOOM_DURATION = 920;
let introSlideIndex = 0;
let introEnding = false;
let introStarting = false;

restoreGameState();
setupStartMenu();

if (quickNav) {
  quickNav.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    saveGameState();
  });
}

window.addEventListener("pagehide", saveGameState);

function setupStartMenu() {
  if (!startMenu || !introCard || !introTitle || !introCredit || !introSubtitle || !introStartButton || !newGameButton || !continueGameButton || !clearSaveButton) {
    startGame();
    return;
  }

  if (sessionStorage.getItem(RETURN_TO_GAME_STORAGE_KEY)) {
    sessionStorage.removeItem(RETURN_TO_GAME_STORAGE_KEY);
    startGame({ playOpening: false });
    return;
  }

  continueGameButton.hidden = !hasSavedGame();
  startMenu.hidden = false;

  newGameButton.addEventListener("click", beginNewGameIntro);

  continueGameButton.addEventListener("click", () => startGame({ playOpening: false }));

  introCard.addEventListener("click", advanceIntroCard);

  clearSaveButton.addEventListener("pointerup", handleClearSave);
  clearSaveButton.addEventListener("click", handleClearSave);
}

function beginNewGameIntro() {
  if (introStarting) {
    return;
  }

  introStarting = true;
  clearSavedGame();
  movePlayerToStart();
  playIntroThunderSound();
  startMenu.classList.add("is-zooming-out");

  window.setTimeout(() => {
    showIntroCard({ playThunder: false });
    startMenu.classList.remove("is-zooming-out");
    introStarting = false;
  }, INTRO_MENU_ZOOM_DURATION);
}

function showIntroCard(options = {}) {
  startMenu.hidden = true;
  introSlideIndex = 0;
  introEnding = false;
  introCard.classList.remove("is-ending", "is-thunder-zoom");
  renderIntroCard();
  introCard.hidden = false;
  window.setTimeout(() => introCard.classList.add("is-thunder-zoom"), 20);
  if (options.playThunder !== false) {
    playIntroThunderSound();
  }
  playIntroRainSound();
  introStartButton.focus();
}

async function advanceIntroCard() {
  if (introCard.hidden || introEnding) {
    return;
  }

  if (introSlideIndex < INTRO_SLIDES.length - 1) {
    introSlideIndex += 1;
    renderIntroCard();
    return;
  }

  introEnding = true;
  introStartButton.disabled = true;
  introCard.classList.add("is-ending");
  await playIntroRainEndSound();
  introStartButton.disabled = false;
  startGame();
}

function renderIntroCard() {
  const slide = INTRO_SLIDES[introSlideIndex];
  introTitle.textContent = slide.title;
  introCredit.textContent = slide.credit;
  introSubtitle.textContent = slide.subtitle;
  introStartButton.hidden = introSlideIndex < INTRO_SLIDES.length - 1;
  introStartButton.textContent = "Start";
}

function hasSavedGame() {
  return Boolean(sessionStorage.getItem(GAME_STATE_STORAGE_KEY) || localStorage.getItem(GAME_STATE_STORAGE_KEY));
}

function handleClearSave(event) {
  event.preventDefault();
  event.stopPropagation();
  clearSavedGame();
  movePlayerToStart();
  continueGameButton.hidden = true;
  startMenu.hidden = false;
}

function clearSavedGame() {
  START_MENU_NEW_GAME_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

function startGame(options = {}) {
  if (startMenu) {
    startMenu.hidden = true;
    startMenu.classList.remove("is-zooming-out");
  }

  if (introCard) {
    introCard.hidden = true;
    introCard.classList.remove("is-ending", "is-thunder-zoom");
  }

  if (typeof stopIntroRainSound === "function") {
    stopIntroRainSound();
  }

  const shouldPlayOpening = options.playOpening !== false;

  if (shouldPlayOpening && typeof playOpeningBedroomDialogue === "function") {
    window.setTimeout(playOpeningBedroomDialogue, 80);
  }
}

function movePlayerToStart() {
  getActiveArea().element.hidden = true;

  state.area = START_AREA;
  state.x = START_X;
  state.y = START_Y;
  state.targetX = START_X;
  state.targetY = START_Y;
  state.path = [];
  state.zoom = DEFAULT_ZOOM;
  state.transitionCooldown = 0;

  const area = getActiveArea();
  area.element.hidden = false;
  area.player.classList.remove("facing-left");
  area.target.classList.remove("visible");

  placePlayer();
  placeTarget();
  placeCamera();
}

function saveGameState() {
  if ((startMenu && !startMenu.hidden) || (introCard && !introCard.hidden)) {
    return;
  }

  const area = getActiveArea();
  const snapshot = {
    area: state.area,
    x: state.x,
    y: state.y,
    zoom: state.zoom,
    facingLeft: area.player.classList.contains("facing-left")
  };

  sessionStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(snapshot));
}

function restoreGameState() {
  const savedState = sessionStorage.getItem(GAME_STATE_STORAGE_KEY);

  if (!savedState) {
    return;
  }

  let snapshot;

  try {
    snapshot = JSON.parse(savedState);
  } catch (error) {
    sessionStorage.removeItem(GAME_STATE_STORAGE_KEY);
    return;
  }

  if (!snapshot || !AREAS[snapshot.area]) {
    sessionStorage.removeItem(GAME_STATE_STORAGE_KEY);
    return;
  }

  getActiveArea().element.hidden = true;

  state.area = snapshot.area;
  state.x = clamp(snapshot.x, 24, getActiveArea().width - 24);
  state.y = clamp(snapshot.y, 24, getActiveArea().height - 24);
  state.targetX = state.x;
  state.targetY = state.y;
  state.path = [];
  state.zoom = clamp(snapshot.zoom || DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM);
  state.transitionCooldown = 0;

  const area = getActiveArea();
  area.element.hidden = false;
  area.player.classList.toggle("facing-left", Boolean(snapshot.facingLeft));
  area.target.classList.remove("visible");

  placePlayer();
  placeTarget();
  placeCamera();
}

