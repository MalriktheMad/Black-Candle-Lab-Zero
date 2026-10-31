const BASEMENT_TERRAIN_ROWS = new Map([
  [0, [[0, 47]]],
  [1, [[0, 47]]],
  [2, [[0, 47]]],
  [3, [[0, 47]]],
  [4, [[0, 47]]],
  [5, [[0, 47]]],
  [6, [[0, 47]]],
  [7, [[0, 47]]],
  [8, [[0, 47]]],
  [9, [[0, 18], [24, 47]]],
  [10, [[0, 8], [35, 47]]],
  [11, [[0, 12], [35, 47]]],
  [12, [[0, 12], [35, 47]]],
  [13, [[0, 12], [35, 47]]],
  [14, [[0, 15], [40, 47]]],
  [15, [[0, 15], [40, 47]]],
  [16, [[0, 15], [35, 47]]],
  [17, [[0, 15], [35, 47]]],
  [18, [[0, 12], [35, 47]]],
  [19, [[0, 12], [35, 47]]],
  [20, [[0, 10], [35, 47]]],
  [21, [[0, 12], [32, 47]]],
  [22, [[0, 13], [32, 47]]],
  [23, [[0, 13], [33, 47]]],
  [24, [[0, 18], [33, 47]]],
  [25, [[0, 20], [28, 47]]],
  [26, [[0, 47]]],
  [27, [[0, 47]]],
  [28, [[0, 47]]],
  [29, [[0, 47]]],
  [30, [[0, 47]]],
  [31, [[0, 47]]]
]);

const INTERIOR_LAYOUTS = {
  lab: {
    selector: ".lab-interior",
    width: 1517,
    height: 1037,
    elements: {
      desk: { selector: ".lab-desk", left: 327, top: 464, width: 380, height: 264 },
      cricket: { selector: ".wing-master-cricket", left: 706, top: 750, width: 104, height: 72 },
      candlewick: { selector: ".candlewick-terminal", left: 1092, top: 559, width: 200, height: 190 },
      labCore: { selector: ".lab-pc-monitor", left: 1245, top: 613, width: 200, height: 140 },
      bedroomStairs: { selector: ".lab-stairs-up", left: 183, top: 66, width: 178, height: 211 },
      outsideDoor: { selector: ".lab-exit-door", left: 789, top: 102, width: 196, height: 211 }
    },
    blocked: [
      { name: "lab-left-wall", left: 0, top: 0, right: 52, bottom: 1037 },
      { name: "lab-right-wall", left: 1465, top: 0, right: 1517, bottom: 1037 },
      { name: "lab-bottom-wall", left: 0, top: 968, right: 1517, bottom: 1037 },
      { name: "lab-top-wall-left", left: 52, top: 0, right: 183, bottom: 350 },
      { name: "lab-top-wall-middle", left: 361, top: 0, right: 789, bottom: 350 },
      { name: "lab-top-wall-right", left: 985, top: 0, right: 1465, bottom: 350 },
      { name: "lab-desk", left: 327, top: 464, right: 707, bottom: 728, flightPassable: true },
      { name: "wing-master-cricket", left: 716, top: 761, right: 801, bottom: 815 },
      { name: "candlewick-workstation", left: 1092, top: 559, right: 1292, bottom: 749 },
      { name: "lab-core", left: 1292, top: 644, right: 1408, bottom: 753 }
    ],
    transitions: [
      { left: 789, top: 102, right: 985, bottom: 313, to: "outside", entryX: 800, entryY: 930 },
      { left: 183, top: 66, right: 361, bottom: 277, to: "bedroom", entryX: 1190, entryY: 840 },
      { left: 52, top: 840, right: 220, bottom: 1037, to: "basement", entryX: 704, entryY: 350 }
    ],
    talkZones: {
      cricket: { left: 686, top: 730, right: 830, bottom: 842 },
      candlewick: { left: 1072, top: 539, right: 1291, bottom: 769 },
      labCore: { left: 1292, top: 593, right: 1428, bottom: 773 }
    }
  },
  bedroom: {
    selector: ".bedroom-interior",
    width: 1517,
    height: 1037,
    elements: {
      cage: { selector: ".bedroom-cage-art", left: 104, top: 24, width: 326, height: 392 },
      labStairs: { selector: ".bedroom-ladder", left: 1244, top: 708, width: 273, height: 329 }
    },
    blocked: [
      { name: "bedroom-top-wall", left: 0, top: 0, right: 1517, bottom: 184 },
      { name: "bedroom-left-wall", left: 0, top: 0, right: 66, bottom: 1037 },
      { name: "bedroom-right-wall", left: 1452, top: 0, right: 1517, bottom: 1037 },
      { name: "bedroom-bottom-wall", left: 0, top: 980, right: 1517, bottom: 1037 },
      { name: "bedroom-cage", left: 104, top: 24, right: 430, bottom: 416, flightPassable: true },
      { name: "bedroom-bed", left: 105, top: 585, right: 350, bottom: 970, flightPassable: true },
      { name: "bedroom-table", left: 900, top: 126, right: 1418, bottom: 410, flightPassable: true }
    ],
    transitions: [
      { left: 1244, top: 708, right: 1493, bottom: 1013, to: "lab", entryX: 270, entryY: 330 }
    ]
  },
  basement: {
    selector: ".basement-interior",
    width: 1536,
    height: 1024,
    elements: {
      vacuum: { selector: ".basement-vacuum", left: 598, top: 340, width: 340, height: 258 }
    },
    blocked: [],
    collisionGridSize: 32,
    collisionPadding: 22,
    collisionLayers: [
      { name: "basement-terrain", rows: BASEMENT_TERRAIN_ROWS }
    ],
    transitions: [
      { left: 608, top: 0, right: 800, bottom: 340, to: "lab", entryX: 140, entryY: 820 }
    ]
  }
};

function applyInteriorLayouts(root = document) {
  Object.values(INTERIOR_LAYOUTS).forEach((layout) => {
    applyInteriorRect(root.querySelector(layout.selector), layout, false);
    Object.values(layout.elements).forEach((elementLayout) => {
      applyInteriorRect(root.querySelector(elementLayout.selector), elementLayout);
    });
  });
}

function applyInteriorRect(element, rect, includePosition = true) {
  if (!element) {
    return;
  }

  if (includePosition) {
    element.style.left = `${rect.left}px`;
    element.style.top = `${rect.top}px`;
  }

  element.style.width = `${rect.width}px`;
  element.style.height = `${rect.height}px`;
}
