const BUTTON_PUSH_SOUND_SRC = new URL("../assets/audio/sfx/button-push.wav", document.currentScript.src).href;
const LEVEL_UP_SOUND_SRC = new URL("../assets/audio/sfx/level-up.wav", document.currentScript.src).href;
const LITTLE_WING_MEEP_SOUND_SRC = new URL("../assets/audio/sfx/Meep.wav", document.currentScript.src).href;
const TAKEOFF_SOUND_SRC = new URL("../assets/audio/sfx/takeoff.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const INTRO_STORM_SOUND_SRC = new URL("../assets/audio/ambience/intro-thunder.wav", document.currentScript.src).href;
const menuCampfireSound = new Audio(MENU_CAMPFIRE_SOUND_SRC);
const introStormSound = new Audio(INTRO_STORM_SOUND_SRC);
const levelUpSound = new Audio(LEVEL_UP_SOUND_SRC);
const takeoffSound = new Audio(TAKEOFF_SOUND_SRC);
const INTRO_STORM_VOLUME = 0.95;
const CAMPFIRE_VOLUME = 0.7;
const CAMPFIRE_FADE_MS = 1400;
const buttonPushSoundPool = makeSoundPool(BUTTON_PUSH_SOUND_SRC, 6, 0.55);
const littleWingMeepSoundPool = makeSoundPool(LITTLE_WING_MEEP_SOUND_SRC, 3, 0.62);
let buttonPushSoundIndex = 0;
let littleWingMeepSoundIndex = 0;
let campfireFadeFrame = 0;
menuCampfireSound.volume = CAMPFIRE_VOLUME;
menuCampfireSound.loop = true;
introStormSound.volume = INTRO_STORM_VOLUME;
levelUpSound.volume = 0.72;
takeoffSound.volume = 0.72;
[
  ...buttonPushSoundPool,
  ...littleWingMeepSoundPool,
  levelUpSound,
  takeoffSound
].forEach((sound) => {
  sound.preload = "auto";
  sound.load();
});

[
  menuCampfireSound,
  introStormSound
].forEach((sound) => {
  sound.preload = "metadata";
});

document.addEventListener("pointerdown", playButtonSoundForControl, { capture: true });
document.addEventListener("pointerdown", unlockMenuCampfireSound, { capture: true });
window.addEventListener("pageshow", syncMenuCampfireSound);
watchStartMenuSoundState();
syncMenuCampfireSound();
introStormSound.addEventListener("ended", stopIntroStormSound);

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

function playButtonPushSound() {
  buttonPushSoundIndex = playFromPool(buttonPushSoundPool, buttonPushSoundIndex);
}

function playConfirmReturnSound() {
  playButtonPushSound();
}

function playLevelUpSound() {
  restartSound(levelUpSound);
}

function playTakeoffSound() {
  restartSound(takeoffSound);
}

function playLittleWingMeepSound() {
  littleWingMeepSoundIndex = playFromPool(littleWingMeepSoundPool, littleWingMeepSoundIndex);
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
  const introCard = document.getElementById("intro-card");
  const shouldPlay = (startMenu && !startMenu.hidden) || (introCard && !introCard.hidden);

  if (shouldPlay) {
    restoreCampfireSound();
    menuCampfireSound.play().catch(() => {});
    return;
  }

  stopMenuCampfireSound();
}

function stopMenuCampfireSound() {
  cancelCampfireFade();
  menuCampfireSound.pause();
  menuCampfireSound.currentTime = 0;
  menuCampfireSound.volume = CAMPFIRE_VOLUME;
}

function restoreCampfireSound() {
  cancelCampfireFade();
  menuCampfireSound.volume = CAMPFIRE_VOLUME;
}

function fadeOutCampfireSound(duration = CAMPFIRE_FADE_MS) {
  cancelCampfireFade();

  if (menuCampfireSound.paused) {
    stopMenuCampfireSound();
    return Promise.resolve();
  }

  const startVolume = menuCampfireSound.volume;
  const startTime = performance.now();

  return new Promise((resolve) => {
    function step(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      menuCampfireSound.volume = startVolume * (1 - progress);

      if (progress < 1) {
        campfireFadeFrame = requestAnimationFrame(step);
        return;
      }

      campfireFadeFrame = 0;
      stopMenuCampfireSound();
      resolve();
    }

    campfireFadeFrame = requestAnimationFrame(step);
  });
}

function cancelCampfireFade() {
  if (!campfireFadeFrame) {
    return;
  }

  cancelAnimationFrame(campfireFadeFrame);
  campfireFadeFrame = 0;
}

function playIntroStormSound() {
  introStormSound.volume = INTRO_STORM_VOLUME;
  restartSound(introStormSound);
}

function prepareIntroStormSound() {
  introStormSound.load();
}

function unlockMenuCampfireSound() {
  syncMenuCampfireSound();
}

function endIntroThunderSound() {
  stopIntroStormSound();
}

function stopIntroStormSound() {
  introStormSound.pause();
  introStormSound.currentTime = 0;
  introStormSound.volume = INTRO_STORM_VOLUME;
}

function finishIntroSound() {
  stopIntroStormSound();
  return fadeOutCampfireSound();
}

function restartSound(sound) {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}
