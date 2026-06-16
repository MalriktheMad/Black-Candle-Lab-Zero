const BUTTON_MOVE_SOUND_SRC = new URL("../assets/audio/sfx/button-move.wav", document.currentScript.src).href;
const BUTTON_CONFIRM_RETURN_SOUND_SRC = BUTTON_MOVE_SOUND_SRC;
const GRASS_MOVEMENT_SOUND_SRC = new URL("../assets/audio/sfx/grass-movement.wav", document.currentScript.src).href;
const BIRD_RUN_SOUND_SRC = new URL("../assets/audio/sfx/bird-run.wav", document.currentScript.src).href;
const LEVEL_UP_SOUND_SRC = new URL("../assets/audio/sfx/level-up.wav", document.currentScript.src).href;
const TAKEOFF_SOUND_SRC = new URL("../assets/audio/sfx/takeoff.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const INTRO_STORM_SOUND_SRC = new URL("../assets/audio/ambience/intro-storm.wav", document.currentScript.src).href;
const INTRO_RAIN_END_SOUND_SRC = new URL("../assets/audio/ambience/rain-end.wav", document.currentScript.src).href;
const menuCampfireSound = new Audio(MENU_CAMPFIRE_SOUND_SRC);
const introStormSound = new Audio(INTRO_STORM_SOUND_SRC);
const introRainEndSound = new Audio(INTRO_RAIN_END_SOUND_SRC);
const grassMovementSound = new Audio(GRASS_MOVEMENT_SOUND_SRC);
const birdRunSound = new Audio(BIRD_RUN_SOUND_SRC);
const levelUpSound = new Audio(LEVEL_UP_SOUND_SRC);
const takeoffSound = new Audio(TAKEOFF_SOUND_SRC);
const INTRO_THUNDER_DURATION = 18.95;
const INTRO_STORM_VOLUME = 0.95;
const INTRO_RAIN_VOLUME = 0.32;
const buttonMoveSoundPool = makeSoundPool(BUTTON_MOVE_SOUND_SRC, 4, 0.55);
const buttonConfirmReturnSoundPool = makeSoundPool(BUTTON_CONFIRM_RETURN_SOUND_SRC, 4, 0.58);
let buttonMoveSoundIndex = 0;
let buttonConfirmReturnSoundIndex = 0;
let activeMovementSound = null;
menuCampfireSound.volume = 0.7;
menuCampfireSound.loop = true;
introStormSound.volume = INTRO_STORM_VOLUME;
introRainEndSound.volume = 0.58;
grassMovementSound.volume = 0.38;
grassMovementSound.loop = true;
birdRunSound.volume = 0.42;
birdRunSound.loop = true;
levelUpSound.volume = 0.72;
takeoffSound.volume = 0.72;
[
  ...buttonMoveSoundPool,
  ...buttonConfirmReturnSoundPool,
  menuCampfireSound,
  introStormSound,
  introRainEndSound,
  grassMovementSound,
  birdRunSound,
  levelUpSound,
  takeoffSound
].forEach((sound) => {
  sound.preload = "auto";
  sound.load();
});

document.addEventListener("pointerdown", playButtonSoundForControl, { capture: true });
document.addEventListener("pointerdown", unlockMenuCampfireSound, { capture: true });
window.addEventListener("pageshow", syncMenuCampfireSound);
watchStartMenuSoundState();
syncMenuCampfireSound();
introStormSound.addEventListener("ended", loopIntroStormRain);

function playButtonSoundForControl(event) {
  const control = event.target.closest("button, a");

  if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") {
    return;
  }

  if (control.id === "flight-toggle") {
    return;
  }

  playConfirmReturnSound();
}

function playMoveClickSound() {
  buttonMoveSoundIndex = playFromPool(buttonMoveSoundPool, buttonMoveSoundIndex);
}

function playConfirmReturnSound() {
  buttonConfirmReturnSoundIndex = playFromPool(buttonConfirmReturnSoundPool, buttonConfirmReturnSoundIndex);
}

function playLevelUpSound() {
  restartSound(levelUpSound);
}

function playTakeoffSound() {
  restartSound(takeoffSound);
}

function syncMovementSound(isMoving, areaName, surfaceName) {
  const nextSound = getMovementSound(isMoving, areaName, surfaceName);

  if (nextSound === activeMovementSound) {
    return;
  }

  stopMovementSound();

  if (!nextSound) {
    return;
  }

  activeMovementSound = nextSound;
  activeMovementSound.currentTime = 0;
  activeMovementSound.play().catch(() => {});
}

function stopMovementSound() {
  if (!activeMovementSound) {
    return;
  }

  activeMovementSound.pause();
  activeMovementSound.currentTime = 0;
  activeMovementSound = null;
}

function getMovementSound(isMoving, areaName, surfaceName) {
  if (!isMoving) {
    return null;
  }

  if (["lab", "bedroom", "dilly"].includes(areaName)) {
    return birdRunSound;
  }

  if ((areaName === "outside" || areaName === "forest") && surfaceName !== "sand") {
    return grassMovementSound;
  }

  return null;
}

function makeSoundPool(src, size, volume) {
  return Array.from({ length: size }, () => {
    const sound = new Audio(src);
    sound.volume = volume;
    return sound;
  });
}

function playFromPool(pool, index) {
  const sound = pool[index];
  sound.currentTime = 0;
  sound.play().catch(() => {});
  return (index + 1) % pool.length;
}

function watchStartMenuSoundState() {
  const startMenu = document.getElementById("start-menu");

  if (!startMenu) {
    return;
  }

  new MutationObserver(syncMenuCampfireSound).observe(startMenu, {
    attributes: true,
    attributeFilter: ["hidden"]
  });
}

function syncMenuCampfireSound() {
  const startMenu = document.getElementById("start-menu");
  const shouldPlay = startMenu && !startMenu.hidden;

  if (shouldPlay) {
    menuCampfireSound.play().catch(() => {});
    return;
  }

  stopMenuCampfireSound();
}

function stopMenuCampfireSound() {
  menuCampfireSound.pause();
  menuCampfireSound.currentTime = 0;
}

function playIntroStormSound() {
  introStormSound.volume = INTRO_STORM_VOLUME;
  restartSound(introStormSound);
}

function unlockMenuCampfireSound() {
  syncMenuCampfireSound();
}

function markIntroRainSection() {
  introStormSound.volume = INTRO_RAIN_VOLUME;
  introStormSound.currentTime = INTRO_THUNDER_DURATION;
}

function stopIntroStormSound() {
  introStormSound.pause();
  introStormSound.currentTime = 0;
  introStormSound.volume = INTRO_STORM_VOLUME;
}

function playIntroRainEndSound() {
  stopIntroStormSound();
  introRainEndSound.currentTime = 0;

  return new Promise((resolve) => {
    introRainEndSound.onended = resolve;
    introRainEndSound.play().catch(resolve);
  });
}

function restartSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function loopIntroStormRain() {
  introStormSound.volume = INTRO_RAIN_VOLUME;
  introStormSound.currentTime = INTRO_THUNDER_DURATION;
  introStormSound.play().catch(() => {});
}
