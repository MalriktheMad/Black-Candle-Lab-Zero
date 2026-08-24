const PLAYER_PROGRESS_STORAGE_KEY = "lab-zero-player-progress";
const BASE_PLAYER_HP = 100;
const HP_PER_LEVEL = 50;
let levelUpNoticeTimeout;

const STARTING_PLAYER_PROGRESS = {
  level: 1,
  hp: BASE_PLAYER_HP,
  completedQuests: []
};

function getPlayerProgress() {
  const savedProgress = sessionStorage.getItem(PLAYER_PROGRESS_STORAGE_KEY);

  if (!savedProgress) {
    return { ...STARTING_PLAYER_PROGRESS };
  }

  try {
    const progress = JSON.parse(savedProgress);
    const level = Math.max(1, progress.level || STARTING_PLAYER_PROGRESS.level);
    const maxHp = getMaxHpForLevel(level);
    const savedHp = Number.isFinite(progress.hp) ? progress.hp : maxHp;
    return {
      ...STARTING_PLAYER_PROGRESS,
      ...progress,
      level,
      hp: clampPlayerHp(savedHp, maxHp),
      completedQuests: Array.isArray(progress.completedQuests) ? progress.completedQuests : []
    };
  } catch (error) {
    sessionStorage.removeItem(PLAYER_PROGRESS_STORAGE_KEY);
    return { ...STARTING_PLAYER_PROGRESS };
  }
}

function savePlayerProgress(progress) {
  const level = Math.max(1, progress.level || STARTING_PLAYER_PROGRESS.level);
  const maxHp = getMaxHpForLevel(level);
  sessionStorage.setItem(PLAYER_PROGRESS_STORAGE_KEY, JSON.stringify({
    ...STARTING_PLAYER_PROGRESS,
    ...progress,
    level,
    hp: clampPlayerHp(progress.hp, maxHp)
  }));
}

function getMaxHpForLevel(level) {
  return BASE_PLAYER_HP + (Math.max(1, level) - 1) * HP_PER_LEVEL;
}

function clampPlayerHp(hp, maxHp) {
  const numericHp = Number.isFinite(hp) ? hp : maxHp;
  return Math.max(0, Math.min(maxHp, numericHp));
}

function getPlayerMaxHp() {
  return getMaxHpForLevel(getPlayerProgress().level);
}

function setPlayerHp(hp) {
  const progress = getPlayerProgress();
  progress.hp = clampPlayerHp(hp, getMaxHpForLevel(progress.level));
  savePlayerProgress(progress);
  syncPlayerProgressReadout();
  return progress.hp;
}

function damagePlayer(amount) {
  const damage = Math.max(0, Number(amount) || 0);
  return setPlayerHp(getPlayerProgress().hp - damage);
}

function healPlayer(amount) {
  const healing = Math.max(0, Number(amount) || 0);
  return setPlayerHp(getPlayerProgress().hp + healing);
}

function isPlayerDefeated() {
  return getPlayerProgress().hp <= 0;
}

function setPlayerLevel(level) {
  const progress = getPlayerProgress();
  progress.level = Math.max(1, level);
  progress.hp = getMaxHpForLevel(progress.level);
  savePlayerProgress(progress);
  syncPlayerProgressReadout();
}

function levelUpPlayer(amount = 1) {
  const progress = getPlayerProgress();
  setPlayerLevel(progress.level + amount);
  const updatedProgress = getPlayerProgress();
  showLevelUpNotice(updatedProgress.level, updatedProgress.hp);
}

function completeQuest(questId) {
  const progress = getPlayerProgress();

  if (!progress.completedQuests.includes(questId)) {
    progress.completedQuests.push(questId);
    savePlayerProgress(progress);
  }
}

function hasCompletedQuest(questId) {
  return getPlayerProgress().completedQuests.includes(questId);
}

function syncPlayerProgressReadout() {
  const progress = getPlayerProgress();
  const levelValue = findReadoutStat("level");
  const hpValue = findReadoutStat("hp");

  if (levelValue) {
    levelValue.textContent = progress.level;
  }

  if (hpValue) {
    hpValue.textContent = progress.hp;
  }
}

function findReadoutStat(statName) {
  const markedStat = document.querySelector(`[data-stat="${statName}"]`);

  if (markedStat) {
    return markedStat;
  }

  return Array.from(document.querySelectorAll(".readout .stat-row, .sheet .stat-row")).find((row) => {
    const label = row.querySelector("span");
    return label && label.textContent.trim().toLowerCase() === statName;
  })?.querySelector("strong") || null;
}

function showLevelUpNotice(level, hp) {
  if (typeof playLevelUpSound === "function") {
    playLevelUpSound();
  }

  let notice = document.querySelector(".level-up-notice");

  if (!notice) {
    notice = document.createElement("div");
    notice.className = "level-up-notice";
    document.body.append(notice);
  }

  notice.innerHTML = `
    <span>Level Up</span>
    <strong>Level ${level}</strong>
    <em>HP ${hp}</em>
  `;
  notice.hidden = false;
  notice.classList.remove("is-showing");
  void notice.offsetWidth;
  notice.classList.add("is-showing");

  const readout = document.getElementById("readout");

  if (readout) {
    readout.classList.remove("is-leveling-up");
    void readout.offsetWidth;
    readout.classList.add("is-leveling-up");
  }

  clearTimeout(levelUpNoticeTimeout);
  levelUpNoticeTimeout = setTimeout(() => {
    notice.hidden = true;
    notice.classList.remove("is-showing");

    if (readout) {
      readout.classList.remove("is-leveling-up");
    }
  }, 1800);
}

syncPlayerProgressReadout();
