function getLabCoreDialogueLines() {
  return [
    labCoreLine("The Lab Core hums quietly. Its interface is waiting for a proper menu.", [
      {
        label: "Back",
        action: closeDialogue
      }
    ])
  ];
}
