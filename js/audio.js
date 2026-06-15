const BUTTON_SOUND_SRC = new URL("../assets/audio/sfx/button.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const buttonSound = new Audio(BUTTON_SOUND_SRC);
const menuCampfireSound = new Audio(MENU_CAMPFIRE_SOUND_SRC);
buttonSound.volume = 0.55;
menuCampfireSound.volume = 0.32;
menuCampfireSound.loop = true;

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
