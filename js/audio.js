const BUTTON_SOUND_SRC = new URL("../assets/audio/sfx/button.wav", document.currentScript.src).href;
const buttonSound = new Audio(BUTTON_SOUND_SRC);
buttonSound.volume = 0.55;

document.addEventListener("pointerdown", playButtonSoundForControl, { capture: true });

function playButtonSoundForControl(event) {
  const control = event.target.closest("button, a");

  if (!control || control.disabled || control.getAttribute("aria-disabled") === "true") {
    return;
  }

  buttonSound.currentTime = 0;
  buttonSound.play().catch(() => {});
}
