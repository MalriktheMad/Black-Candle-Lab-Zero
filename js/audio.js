const BUTTON_SOUND_SRC = new URL("../assets/audio/sfx/button.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const INTRO_THUNDER_SOUND_SRC = new URL("../assets/audio/ambience/intro-thunder.wav", document.currentScript.src).href;
const INTRO_RAIN_SOUND_SRC = new URL("../assets/audio/ambience/rain.wav", document.currentScript.src).href;
const INTRO_RAIN_END_SOUND_SRC = new URL("../assets/audio/ambience/rain-end.wav", document.currentScript.src).href;
const buttonSound = new Audio(BUTTON_SOUND_SRC);
const menuCampfireSound = new Audio(MENU_CAMPFIRE_SOUND_SRC);
const introThunderSound = new Audio(INTRO_THUNDER_SOUND_SRC);
const introRainSound = new Audio(INTRO_RAIN_SOUND_SRC);
const introRainEndSound = new Audio(INTRO_RAIN_END_SOUND_SRC);
buttonSound.volume = 0.55;
menuCampfireSound.volume = 0.32;
menuCampfireSound.loop = true;
introThunderSound.volume = 0.82;
introRainSound.volume = 0.46;
introRainSound.loop = true;
introRainEndSound.volume = 0.58;

document.addEventListener("pointerdown", playButtonSoundForControl, { capture: true });
document.addEventListener("pointerdown", syncMenuCampfireSound, { once: true });
window.addEventListener("pageshow", syncMenuCampfireSound);
watchStartMenuSoundState();
syncMenuCampfireSound();

function playButtonSoundForControl(event) {
  const control = event.target.closest("button, a");

  if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") {
    return;
  }

  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
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

  menuCampfireSound.pause();
  menuCampfireSound.currentTime = 0;
}

function playIntroThunderSound() {
  restartSound(introThunderSound);
}

function playIntroRainSound() {
  introRainSound.currentTime = 0;
  introRainSound.play().catch(() => {});
}

function stopIntroRainSound() {
  introRainSound.pause();
  introRainSound.currentTime = 0;
}

function playIntroRainEndSound() {
  stopIntroRainSound();
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
