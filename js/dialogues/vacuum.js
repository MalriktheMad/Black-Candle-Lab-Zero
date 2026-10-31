function getVacuumDarkThreatLines() {
  return [vacuumLine("Bird don't belong in the dark.", 1)];
}

function getVacuumBootLine() {
  return vacuumLine("", 2, { speaker: "", lockAdvance: true });
}

function getVacuumCleaningLines() {
  return [vacuumLine("Time to clean.", 3)];
}

function vacuumLine(text, portraitIndex, options = {}) {
  return {
    speaker: options.speaker ?? "Vacuum",
    portrait: `assets/sprites/characters/Vacuum/Portraits/vacuum-portrait${portraitIndex}.png`,
    text,
    lockAdvance: Boolean(options.lockAdvance)
  };
}
