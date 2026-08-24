const BUTTON_PUSH_SOUND_SRC = new URL("../assets/audio/sfx/button-push.wav", document.currentScript.src).href;
const LEVEL_UP_SOUND_SRC = new URL("../assets/audio/sfx/level-up.wav", document.currentScript.src).href;
const LITTLE_WING_MEEP_SOUND_SRC = new URL("../assets/audio/sfx/Meep.wav", document.currentScript.src).href;
const TAKEOFF_SOUND_SRC = new URL("../assets/audio/sfx/Takeoff.wav", document.currentScript.src).href;
const LOCK_TAP_SOUND_SRC = new URL("../assets/audio/sfx/LockTap.wav", document.currentScript.src).href;
const MENU_CAMPFIRE_SOUND_SRC = new URL("../assets/audio/sfx/campfire.wav", document.currentScript.src).href;
const INTRO_THUNDER_SOUND_SRC = new URL("../assets/audio/ambience/intro-thunder.wav", document.currentScript.src).href;
const INTRO_THUNDER_VOLUME = 0.95;
const CAMPFIRE_VOLUME = 0.7;
const CAMPFIRE_FADE_MS = 1400;
const GameAudioContext = window.AudioContext || window.webkitAudioContext;
const GAME_SOUNDS = {
  buttonPush: { src: BUTTON_PUSH_SOUND_SRC, volume: 0.55, maxVoices: 6 },
  levelUp: { src: LEVEL_UP_SOUND_SRC, volume: 0.72, maxVoices: 1 },
  littleWingMeep: { src: LITTLE_WING_MEEP_SOUND_SRC, volume: 0.62, maxVoices: 3 },
  takeoff: { src: TAKEOFF_SOUND_SRC, volume: 0.72, maxVoices: 1 },
  lockTap: { src: LOCK_TAP_SOUND_SRC, volume: 0.72, maxVoices: 4 },
  campfire: { src: MENU_CAMPFIRE_SOUND_SRC, volume: CAMPFIRE_VOLUME, maxVoices: 1 },
  introThunder: { src: INTRO_THUNDER_SOUND_SRC, volume: INTRO_THUNDER_VOLUME, maxVoices: 1, fadeOutSeconds: 2.25 }
};
const rawSoundPromises = new Map();
const decodedSoundPromises = new Map();
const activeSoundVoices = new Map();
let gameAudioContext = null;
let gameAudioPrimed = false;
let campfireSource = null;
let campfireGain = null;
let campfireStartPromise = null;
let campfireRequested = false;
let campfireFadeTimer = 0;
let campfireFadeResolve = null;

preloadRawSounds();
document.addEventListener("pointerdown", unlockGameAudio, { capture: true });
document.addEventListener("touchend", unlockGameAudio, { capture: true, passive: true });
document.addEventListener("pointerdown", playButtonSoundForControl, { capture: true });
window.addEventListener("pageshow", syncMenuCampfireSound);
watchStartMenuSoundState();
syncMenuCampfireSound();

function preloadRawSounds() {
  Object.entries(GAME_SOUNDS).forEach(([soundId, sound]) => {
    const request = fetch(sound.src)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load ${soundId}: ${response.status}`);
        }

        return response.arrayBuffer();
      })
      .catch((error) => {
        console.warn(error);
        return null;
      });

    rawSoundPromises.set(soundId, request);
  });
}

function unlockGameAudio() {
  const context = getGameAudioContext();

  if (!context) {
    return;
  }

  primeGameAudioContext(context);

  const resume = context.state === "running"
    ? Promise.resolve()
    : context.resume().catch(() => {});

  resume.then(() => {
    preloadDecodedSounds();
    syncMenuCampfireSound();
  });
}

function primeGameAudioContext(context) {
  if (gameAudioPrimed) {
    return;
  }

  try {
    const silentBuffer = context.createBuffer(1, 1, context.sampleRate);
    const silentSource = context.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(context.destination);
    silentSource.addEventListener("ended", () => silentSource.disconnect(), { once: true });
    silentSource.start();
    gameAudioPrimed = true;
  } catch (error) {
    // A later user gesture can retry if this browser has not unlocked yet.
  }
}

function getGameAudioContext() {
  if (!gameAudioContext && GameAudioContext) {
    gameAudioContext = new GameAudioContext();
  }

  return gameAudioContext;
}

function preloadDecodedSounds() {
  Object.keys(GAME_SOUNDS).forEach((soundId) => {
    getDecodedSound(soundId).catch(() => {});
  });
}

function getDecodedSound(soundId) {
  if (decodedSoundPromises.has(soundId)) {
    return decodedSoundPromises.get(soundId);
  }

  const context = gameAudioContext;
  const rawSound = rawSoundPromises.get(soundId);

  if (!context || !rawSound) {
    return Promise.resolve(null);
  }

  const decodedSound = rawSound.then((audioData) => {
    if (!audioData) {
      return null;
    }

    return decodeSoundData(context, audioData.slice(0));
  }).catch((error) => {
    console.warn(error);
    return null;
  });

  decodedSoundPromises.set(soundId, decodedSound);
  return decodedSound;
}

function decodeSoundData(context, audioData) {
  return new Promise((resolve, reject) => {
    context.decodeAudioData(audioData, resolve, reject);
  });
}

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
  playBufferedSound("buttonPush");
}

function playConfirmReturnSound() {
  playButtonPushSound();
}

function playLevelUpSound() {
  playBufferedSound("levelUp", { restart: true });
}

function playTakeoffSound() {
  playBufferedSound("takeoff", { restart: true });
}

function playLittleWingMeepSound() {
  playBufferedSound("littleWingMeep");
}

function playLockTapSound() {
  playBufferedSound("lockTap");
}

function playIntroThunderSound() {
  playBufferedSound("introThunder", { restart: true });
}

function prepareIntroThunderSound() {
  if (gameAudioContext) {
    getDecodedSound("introThunder").catch(() => {});
  }
}

async function playBufferedSound(soundId, options = {}) {
  const context = gameAudioContext;
  const sound = GAME_SOUNDS[soundId];

  if (!context || !sound) {
    return;
  }

  if (context.state !== "running") {
    await context.resume().catch(() => {});
  }

  const buffer = await getDecodedSound(soundId);

  if (!buffer || context.state !== "running") {
    return;
  }

  if (options.restart) {
    stopSoundVoices(soundId);
  }

  const voices = getSoundVoices(soundId);

  while (voices.size >= sound.maxVoices) {
    const oldestVoice = voices.values().next().value;
    stopVoice(soundId, oldestVoice);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  const voice = { source, gain, cleaned: false };
  source.buffer = buffer;
  const startTime = context.currentTime;
  gain.gain.setValueAtTime(sound.volume, startTime);

  if (sound.fadeOutSeconds) {
    const fadeDuration = Math.min(sound.fadeOutSeconds, buffer.duration);
    const fadeStartTime = startTime + buffer.duration - fadeDuration;
    gain.gain.setValueAtTime(sound.volume, fadeStartTime);
    gain.gain.linearRampToValueAtTime(0, startTime + buffer.duration);
  }

  source.connect(gain);
  gain.connect(context.destination);
  voices.add(voice);
  source.addEventListener("ended", () => removeVoice(soundId, voice), { once: true });
  source.start();
}

function getSoundVoices(soundId) {
  if (!activeSoundVoices.has(soundId)) {
    activeSoundVoices.set(soundId, new Set());
  }

  return activeSoundVoices.get(soundId);
}

function stopSoundVoices(soundId) {
  const voices = activeSoundVoices.get(soundId);

  if (!voices) {
    return;
  }

  Array.from(voices).forEach((voice) => stopVoice(soundId, voice));
}

function stopVoice(soundId, voice) {
  if (!voice) {
    return;
  }

  removeVoice(soundId, voice);

  try {
    voice.source.stop();
  } catch (error) {
    // The source may already have ended.
  }

}

function removeVoice(soundId, voice) {
  if (voice.cleaned) {
    return;
  }

  voice.cleaned = true;
  const voices = activeSoundVoices.get(soundId);

  if (voices) {
    voices.delete(voice);
  }

  voice.source.disconnect();
  voice.gain.disconnect();
}

function watchStartMenuSoundState() {
  const startMenu = document.getElementById("start-menu");
  const introCard = document.getElementById("intro-card");

  if (!startMenu && !introCard) {
    return;
  }

  const campfireObserver = new MutationObserver(syncMenuCampfireSound);
  const observerOptions = {
    attributes: true,
    attributeFilter: ["hidden"]
  };

  if (startMenu) {
    campfireObserver.observe(startMenu, observerOptions);
  }

  if (introCard) {
    campfireObserver.observe(introCard, observerOptions);
  }
}

function syncMenuCampfireSound() {
  const startMenu = document.getElementById("start-menu");
  const introCard = document.getElementById("intro-card");
  const shouldPlay = (startMenu && !startMenu.hidden) || (introCard && !introCard.hidden);

  if (shouldPlay) {
    startMenuCampfireSound();
    return;
  }

  stopMenuCampfireSound();
}

function startMenuCampfireSound() {
  campfireRequested = true;
  restoreCampfireSound();

  if (!gameAudioContext || campfireSource || campfireStartPromise) {
    return;
  }

  campfireStartPromise = startMenuCampfireWhenReady().finally(() => {
    campfireStartPromise = null;
  });
}

async function startMenuCampfireWhenReady() {
  const context = gameAudioContext;

  if (context.state !== "running") {
    await context.resume().catch(() => {});
  }

  const buffer = await getDecodedSound("campfire");

  if (!buffer || !campfireRequested || context.state !== "running" || campfireSource) {
    return;
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.value = CAMPFIRE_VOLUME;
  source.connect(gain);
  gain.connect(context.destination);
  campfireSource = source;
  campfireGain = gain;
  source.addEventListener("ended", () => {
    if (campfireSource === source) {
      campfireSource = null;
      campfireGain = null;
    }

    source.disconnect();
    gain.disconnect();
  }, { once: true });
  source.start();
}

function stopMenuCampfireSound() {
  campfireRequested = false;
  cancelCampfireFade();

  if (!campfireSource) {
    return;
  }

  const source = campfireSource;
  campfireSource = null;
  campfireGain = null;

  try {
    source.stop();
  } catch (error) {
    // The source may already have ended.
  }
}

function restoreCampfireSound() {
  cancelCampfireFade();

  if (campfireGain && gameAudioContext) {
    campfireGain.gain.cancelScheduledValues(gameAudioContext.currentTime);
    campfireGain.gain.setValueAtTime(CAMPFIRE_VOLUME, gameAudioContext.currentTime);
  }
}

function fadeOutCampfireSound(duration = CAMPFIRE_FADE_MS) {
  cancelCampfireFade();

  if (!campfireSource || !campfireGain || !gameAudioContext) {
    stopMenuCampfireSound();
    return Promise.resolve();
  }

  const now = gameAudioContext.currentTime;
  campfireGain.gain.cancelScheduledValues(now);
  campfireGain.gain.setValueAtTime(CAMPFIRE_VOLUME, now);
  campfireGain.gain.linearRampToValueAtTime(0, now + duration / 1000);

  return new Promise((resolve) => {
    campfireFadeResolve = resolve;
    campfireFadeTimer = window.setTimeout(() => {
      const finishFade = campfireFadeResolve;
      campfireFadeTimer = 0;
      campfireFadeResolve = null;
      stopMenuCampfireSound();

      if (finishFade) {
        finishFade();
      }
    }, duration);
  });
}

function cancelCampfireFade() {
  if (campfireFadeTimer) {
    window.clearTimeout(campfireFadeTimer);
    campfireFadeTimer = 0;
  }

  if (campfireGain && gameAudioContext) {
    campfireGain.gain.cancelScheduledValues(gameAudioContext.currentTime);
  }

  if (campfireFadeResolve) {
    const resolve = campfireFadeResolve;
    campfireFadeResolve = null;
    resolve();
  }
}

function finishIntroSound() {
  return fadeOutCampfireSound();
}
