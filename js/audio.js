const BUTTON_SOUND_SRC = new URL("../assets/audio/sfx/button.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const INTRO_STORM_SOUND_SRC = new URL("../assets/audio/ambience/intro-storm.wav", document.currentScript.src).href;
const INTRO_RAIN_END_SOUND_SRC = new URL("../assets/audio/ambience/rain-end.wav", document.currentScript.src).href;
const buttonSound = new Audio(BUTTON_SOUND_SRC);
const menuCampfireSound = new Audio(MENU_CAMPFIRE_SOUND_SRC);
const introStormSound = new Audio(INTRO_STORM_SOUND_SRC);
const introRainEndSound = new Audio(INTRO_RAIN_END_SOUND_SRC);
const INTRO_THUNDER_DURATION = 18.95;
const INTRO_STORM_VOLUME = 0.95;
const INTRO_RAIN_VOLUME = 0.32;
const buttonSoundPool = Array.from({ length: 4 }, () => new Audio(BUTTON_SOUND_SRC));
let buttonSoundIndex = 0;
buttonSound.volume = 0.55;
buttonSoundPool.forEach((sound) => {
  sound.volume = 0.55;
});
menuCampfireSound.volume = 0.7;
menuCampfireSound.loop = true;
introStormSound.volume = INTRO_STORM_VOLUME;
introRainEndSound.volume = 0.58;
[
  buttonSound,
  ...buttonSoundPool,
  menuCampfireSound,
  introStormSound,
  introRainEndSound
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

  playPooledButtonSound();
}

function playPooledButtonSound() {
  const sound = buttonSoundPool[buttonSoundIndex];
  buttonSoundIndex = (buttonSoundIndex + 1) % buttonSoundPool.length;
  sound.currentTime = 0;
  sound.play().catch(() => {});
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
