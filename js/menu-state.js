const GAME_STATE_STORAGE_KEY = "lab-zero-game-state";
const RETURN_TO_GAME_STORAGE_KEY = "lab-zero-return-to-game";
const START_MENU_NEW_GAME_KEYS = [
  GAME_STATE_STORAGE_KEY,
  "lab-zero-opening-bedroom-dialogue",
  "lab-zero-opening-bedroom-intro",
  "lab-zero-opening-controls-tutorial",
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
const warmFireButton = document.getElementById("warm-fire");
const newGameButton = document.getElementById("new-game");
const continueGameButton = document.getElementById("continue-game");
const clearSaveButton = document.getElementById("clear-save");
const INTRO_SLIDES = [
  { title: "Black Candle Labs", credit: "Lead Developer,Writer,Animator Kevin Klinkert", subtitle: "presents" },
  { title: "Lab Zero", credit: "", subtitle: "" },
  { title: "A Budgie RPG", credit: "", subtitle: "" }
];
const INTRO_MENU_ZOOM_DURATION = 6635;
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
  if (!startMenu || !introCard || !introTitle || !introCredit || !introSubtitle || !introStartButton || !warmFireButton || !newGameButton || !continueGameButton || !clearSaveButton) {
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
  startMenu.classList.remove("is-warmed");

  warmFireButton.addEventListener("pointerdown", warmFireAndShowMenu);
  warmFireButton.addEventListener("click", warmFireAndShowMenu);
  newGameButton.addEventListener("pointerdown", beginNewGameIntro);
  newGameButton.addEventListener("click", beginNewGameIntro);

  continueGameButton.addEventListener("click", () => startGame({ playOpening: false }));

  introCard.addEventListener("click", advanceIntroCard);
  introStartButton.addEventListener("click", advanceIntroCard);

  clearSaveButton.addEventListener("pointerup", handleClearSave);
  clearSaveButton.addEventListener("click", handleClearSave);
}

function warmFireAndShowMenu(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  startMenu.classList.add("is-warmed");
  syncMenuCampfireSound();
  prepareIntroThunderSound();

  const firstButton = hasSavedGame() ? continueGameButton : newGameButton;
  firstButton.focus();
}

function beginNewGameIntro(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  if (introStarting) {
    return;
  }

  introStarting = true;
  clearSavedGame();
  movePlayerToStart();
  startMenu.classList.remove("is-warmed");
  restoreCampfireSound();
  playIntroThunderSound();
  startMenu.classList.add("is-zooming-out");

  window.setTimeout(() => {
    showIntroCard();
    startMenu.classList.remove("is-zooming-out");
    introStarting = false;
  }, INTRO_MENU_ZOOM_DURATION);
}

function showIntroCard() {
  startMenu.hidden = true;
  introSlideIndex = 0;
  introEnding = false;
  introCard.classList.remove("is-ending", "is-thunder-zoom");
  renderIntroCard();
  introCard.hidden = false;
  window.setTimeout(() => introCard.classList.add("is-thunder-zoom"), 20);
  endIntroThunderSound();
  introStartButton.focus();
}

async function advanceIntroCard(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (introCard.hidden || introEnding) {
    return;
  }

  if (introSlideIndex < INTRO_SLIDES.length - 1) {
    introSlideIndex += 1;
    renderIntroCard();
    return;
  }

  if (!event || event.target !== introStartButton) {
    return;
  }

  introEnding = true;
  introStartButton.disabled = true;

  if (typeof prepareOpeningWakeFade === "function") {
    prepareOpeningWakeFade();
  }

  introCard.classList.add("is-ending");
  await finishIntroSound();
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
  startMenu.classList.remove("is-warmed");
}

function clearSavedGame() {
  START_MENU_NEW_GAME_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

function startGame(options = {}) {
  const shouldPlayOpening = options.playOpening !== false;

  if (shouldPlayOpening && typeof prepareOpeningWakeFade === "function") {
    prepareOpeningWakeFade();
  }

  if (startMenu) {
    startMenu.hidden = true;
    startMenu.classList.remove("is-zooming-out");
  }

  if (introCard) {
    introCard.hidden = true;
    introCard.classList.remove("is-ending", "is-thunder-zoom");
  }

  if (typeof stopIntroThunderSound === "function") {
    stopIntroThunderSound();
  }

  if (typeof stopMenuCampfireSound === "function") {
    stopMenuCampfireSound();
  }

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

