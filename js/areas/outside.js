const OUTSIDE_LAYOUT = {
  selector: "#world",
  width: 2720,
  height: 1712,
  collisionGridSize: 32,
  riverFrameDurationMs: 300,
  elements: {
    base: { selector: ".cricket-thicket-base", left: 0, top: 0, width: 2720, height: 1712 },
    labZero: { selector: ".lab-zero-building", left: 0, top: 0, width: 1404, height: 1062 },
    river: { selector: ".cricket-thicket-river", left: 1560, top: 0, width: 972, height: 1712 }
  },
  collisionLayers: [
    {
      name: "lab-zero",
      rows: new Map([
        [0, [[19, 20]]], [1, [[19, 20], [23, 24]]], [2, [[19, 25], [27, 28]]],
        [3, [[8, 9], [19, 28]]], [4, [[3, 3], [8, 10], [13, 13], [18, 28], [36, 38]]],
        [5, [[3, 3], [8, 10], [13, 13], [18, 30], [36, 38]]],
        [6, [[3, 3], [8, 14], [16, 30], [33, 38]]], [7, [[2, 4], [7, 31], [33, 38]]],
        [8, [[2, 4], [6, 39]]], [9, [[3, 40]]], [10, [[2, 40]]], [11, [[1, 40]]],
        [12, [[1, 40]]], [13, [[0, 40]]], [14, [[1, 41]]], [15, [[1, 41]]],
        [16, [[0, 42]]], [17, [[1, 42]]], [18, [[0, 42]]], [19, [[1, 42]]],
        [20, [[0, 42]]], [21, [[0, 42]]], [22, [[0, 41]]], [23, [[0, 40]]],
        [24, [[0, 31], [36, 40]]], [25, [[0, 31], [37, 40]]], [26, [[1, 20], [27, 28]]],
        [27, [[6, 21]]], [28, [[6, 22]]], [29, [[7, 23]]], [30, [[8, 8], [10, 23]]],
        [31, [[10, 22]]], [32, [[15, 20]]]
      ])
    },
    {
      name: "terrain",
      flightPassable: true,
      walkableZone: "riverLogs",
      rows: new Map([
        [0, [[0, 21], [63, 84]]],
        [1, [[0, 22], [24, 25], [63, 84]]],
        [2, [[0, 29], [63, 84]]],
        [3, [[0, 29], [63, 84]]],
        [4, [[0, 30], [38, 40], [63, 84]]],
        [5, [[0, 32], [37, 40], [64, 84]]],
        [6, [[0, 32], [34, 40], [62, 84]]],
        [7, [[0, 40], [62, 84]]],
        [8, [[0, 41], [62, 84]]],
        [9, [[0, 42], [62, 84]]],
        [10, [[0, 42], [62, 84]]],
        [11, [[0, 42], [62, 84]]],
        [12, [[0, 42], [61, 84]]],
        [13, [[0, 42], [63, 84]]],
        [14, [[0, 42], [63, 77]]],
        [15, [[0, 43], [63, 77]]],
        [16, [[0, 44], [63, 77]]],
        [17, [[0, 44], [64, 76]]],
        [18, [[0, 44], [62, 76]]],
        [19, [[0, 44], [61, 76]]],
        [20, [[0, 44], [60, 76]]],
        [21, [[0, 44], [60, 75]]],
        [22, [[0, 43], [61, 74]]],
        [23, [[0, 42], [61, 74]]],
        [24, [[0, 33], [37, 42], [60, 75]]],
        [25, [[0, 33], [38, 42], [60, 75]]],
        [26, [[0, 23], [28, 34], [60, 74]]],
        [27, [[0, 5], [8, 23], [28, 34], [62, 74]]],
        [28, [[0, 4], [8, 24], [28, 33], [61, 73]]],
        [29, [[0, 4], [8, 24], [29, 33], [61, 73]]],
        [30, [[0, 5], [7, 8], [10, 24], [31, 31], [57, 59], [61, 73]]],
        [31, [[0, 10], [12, 24], [56, 73]]],
        [32, [[0, 11], [15, 22], [56, 73]]],
        [33, [[0, 11], [55, 72]]],
        [34, [[0, 12], [55, 72], [83, 84]]],
        [35, [[0, 12], [55, 71], [83, 84]]],
        [36, [[0, 12], [33, 33], [55, 71], [82, 84]]],
        [37, [[0, 12], [33, 33], [54, 71], [82, 84]]],
        [38, [[0, 11], [33, 33], [53, 70], [81, 84]]],
        [39, [[0, 10], [12, 13], [33, 33], [53, 69], [80, 84]]],
        [40, [[0, 2], [4, 9], [11, 13], [53, 69], [79, 84]]],
        [41, [[0, 6], [10, 18], [53, 69], [78, 84]]],
        [42, [[0, 7], [9, 18], [52, 69], [78, 84]]],
        [43, [[0, 7], [10, 18], [52, 69], [78, 84]]],
        [44, [[0, 8], [10, 19], [52, 67], [75, 84]]],
        [45, [[0, 9], [14, 20], [51, 67], [72, 84]]],
        [46, [[0, 10], [12, 24], [50, 67], [72, 84]]],
        [47, [[0, 24], [50, 67], [73, 74], [76, 84]]],
        [48, [[0, 25], [49, 67], [75, 84]]],
        [49, [[0, 25], [50, 67], [75, 84]]],
        [50, [[0, 26], [49, 67], [75, 84]]],
        [51, [[0, 26], [49, 66], [75, 84]]],
        [52, [[0, 25], [49, 66], [75, 84]]],
        [53, [[0, 25], [50, 66], [75, 84]]]
      ])
    }
  ],
  walkableZones: {
    riverLogs: {
      padding: 16,
      polygons: [
        [[2120, 425], [2475, 365], [2510, 420], [2160, 485]],
        [[1900, 655], [2165, 515], [2200, 565], [1940, 710]],
        [[1870, 1150], [2295, 1310], [2260, 1370], [1840, 1210]],
        [[1575, 1530], [1900, 1450], [1930, 1510], [1600, 1605]]
      ]
    }
  },
  transitions: [
    { left: 650, top: 580, right: 850, bottom: 880, to: "lab", entryX: 887, entryY: 360 },
    { left: 2630, top: 24, right: 2720, bottom: 1688, to: "forest", entryX: 145, preserveY: true, snapToWalkable: true }
  ],
  pickups: [
    { id: "crickthicket-sunflower-1", type: "sunflower", x: 1688, y: 456 },
    { id: "crickthicket-sunflower-2", type: "sunflower", x: 1602, y: 628 },
    { id: "crickthicket-sunflower-3", type: "sunflower", x: 504, y: 1268 },
    { id: "crickthicket-sunflower-4", type: "sunflower", x: 126, y: 1282 },
    { id: "crickthicket-sunflower-5", type: "sunflower", x: 652, y: 1390 },
    { id: "crickthicket-sunflower-6", type: "sunflower", x: 450, y: 1424 },
    { id: "crickthicket-sunflower-7", type: "sunflower", x: 352, y: 1466 },
    { id: "crickthicket-sunflower-8", type: "sunflower", x: 2194, y: 1482 },
    { id: "crickthicket-sunflower-9", type: "sunflower", x: 2308, y: 1612 },
    { id: "crickthicket-millet-1", type: "millet", x: 2562, y: 486 },
    { id: "crickthicket-millet-2", type: "millet", x: 2461, y: 894 },
    { id: "crickthicket-millet-3", type: "millet", x: 2458, y: 1058 },
    { id: "crickthicket-millet-4", type: "millet", x: 1234, y: 1124 },
    { id: "crickthicket-millet-5", type: "millet", x: 946, y: 1366 },
    { id: "crickthicket-millet-6", type: "millet", x: 1156, y: 1400 }
  ]
};

function applyOutsideLayout(root = document) {
  applyOutsideRect(root.querySelector(OUTSIDE_LAYOUT.selector), OUTSIDE_LAYOUT, false);

  Object.values(OUTSIDE_LAYOUT.elements).forEach((elementLayout) => {
    applyOutsideRect(root.querySelector(elementLayout.selector), elementLayout);
  });

  const river = root.querySelector(OUTSIDE_LAYOUT.elements.river.selector);
  if (river) {
    river.style.animationDuration = `${OUTSIDE_LAYOUT.riverFrameDurationMs * 3}ms`;
  }
}

function applyOutsideRect(element, rect, includePosition = true) {
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

function isPointInWalkableZone(worldX, worldY, zone) {
  const polygons = Array.isArray(zone) ? zone : zone?.polygons || [];
  const padding = Array.isArray(zone) ? 0 : zone?.padding || 0;

  return polygons.some((polygon) => {
    return isPointInPolygon(worldX, worldY, polygon)
      || (padding > 0 && getDistanceToPolygon(worldX, worldY, polygon) <= padding);
  });
}

function isPointInPolygon(worldX, worldY, polygon) {
  let inside = false;

  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const [currentX, currentY] = polygon[current];
    const [previousX, previousY] = polygon[previous];
    const crossesRay = (currentY > worldY) !== (previousY > worldY)
      && worldX < ((previousX - currentX) * (worldY - currentY)) / (previousY - currentY) + currentX;
    if (crossesRay) {
      inside = !inside;
    }
  }

  return inside;
}

function getDistanceToPolygon(worldX, worldY, polygon) {
  let shortestDistance = Infinity;

  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    shortestDistance = Math.min(
      shortestDistance,
      getDistanceToSegment(worldX, worldY, polygon[previous], polygon[current])
    );
  }

  return shortestDistance;
}

function getDistanceToSegment(worldX, worldY, start, end) {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const lengthSquared = deltaX * deltaX + deltaY * deltaY;
  const unclampedProjection = lengthSquared === 0
    ? 0
    : ((worldX - start[0]) * deltaX + (worldY - start[1]) * deltaY) / lengthSquared;
  const projection = Math.max(0, Math.min(1, unclampedProjection));
  const nearestX = start[0] + projection * deltaX;
  const nearestY = start[1] + projection * deltaY;
  return Math.hypot(worldX - nearestX, worldY - nearestY);
}
