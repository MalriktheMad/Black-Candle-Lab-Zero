const PICKUP_STORAGE_KEY = "lab-zero-collected-pickups";

const PICKUPS = [
  makeSunflowerPickup("crickthicket-sunflower-1", 319, 816),
  makeSunflowerPickup("crickthicket-sunflower-2", 913, 420),
  makeSunflowerPickup("crickthicket-sunflower-3", 1021, 675),
  makeSunflowerPickup("crickthicket-sunflower-4", 1189, 525),
  makeSunflowerPickup("crickthicket-sunflower-5", 1477, 1182),
  makeSunflowerPickup("crickthicket-sunflower-6", 1882, 1119),
  makeSunflowerPickup("crickthicket-sunflower-7", 2008, 735),
  makeSunflowerPickup("crickthicket-sunflower-8", 2070, 516),
  makeMilletPickup("crickthicket-millet-1", 336, 1062),
  makeMilletPickup("crickthicket-millet-2", 386, 1164),
  makeMilletPickup("crickthicket-millet-3", 446, 1061),
  makeMilletPickup("crickthicket-millet-4", 509, 1139),
  makeMilletPickup("crickthicket-millet-5", 552, 1036),
  // This plant sits inside the enlarged Lab Zero footprint, so it is collected from the nearest walkable edge.
  makeMilletPickup("crickthicket-millet-6", 816, 744, 110)
];

const pickupElements = new Map();
let collectedPickupIds = new Set(getCollectedPickups());
let pickupToastTimeout;

installPickupStyles();
placePickups();
requestAnimationFrame(checkPickups);

function makeSunflowerPickup(id, x, y, collectRadius = 48) {
  return {
    id,
    area: "outside",
    x,
    y,
    itemId: "sunflowerSeeds",
    amount: 1,
    label: "Sunflower Seeds",
    collectRadius,
    className: "sunflower-pickup"
  };
}

function makeMilletPickup(id, x, y, collectRadius = 64) {
  return {
    id,
    area: "outside",
    x,
    y,
    itemId: "milletSeeds",
    amount: 1,
    label: "Millet Seeds",
    collectRadius,
    className: "millet-pickup"
  };
}

function installPickupStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .pickup {
      position: absolute;
      width: 64px;
      height: 64px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      image-rendering: auto;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 14;
    }

    .sunflower-pickup {
      background-image: url("assets/sprites/environment/plants/sunflower.png");
    }

    .millet-pickup {
      background-image: url("assets/sprites/environment/plants/millet.png");
    }

    .pickup.collected {
      display: none;
    }

    .pickup-toast {
      position: absolute;
      left: 50%;
      bottom: 122px;
      border: 2px solid rgba(247, 244, 255, 0.68);
      border-radius: 6px;
      padding: 8px 12px;
      background: rgba(5, 5, 8, 0.86);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.72), 0 0 18px rgba(124, 60, 255, 0.28);
      color: #f7f4ff;
      font-family: "Trebuchet MS", Arial, sans-serif;
      font-size: 0.72rem;
      font-weight: 900;
      text-align: center;
      text-transform: uppercase;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 20;
    }
  `;
  document.head.append(style);
}

function placePickups() {
  PICKUPS.forEach((pickup) => {
    const area = AREAS[pickup.area];

    if (!area || collectedPickupIds.has(pickup.id)) {
      return;
    }

    const element = document.createElement("div");
    element.className = `pickup ${pickup.className}`;
    element.style.left = `${pickup.x}px`;
    element.style.top = `${pickup.y}px`;
    element.setAttribute("aria-label", pickup.label);

    area.element.append(element);
    pickupElements.set(pickup.id, element);
  });
}

function checkPickups() {
  if (state.flightPhase !== "ground") {
    requestAnimationFrame(checkPickups);
    return;
  }

  PICKUPS.forEach((pickup) => {
    if (pickup.area !== state.area || collectedPickupIds.has(pickup.id)) {
      return;
    }

    const distance = Math.hypot(state.x - pickup.x, state.y - pickup.y);

    if (distance <= pickup.collectRadius) {
      collectPickup(pickup);
    }
  });

  requestAnimationFrame(checkPickups);
}

function collectPickup(pickup) {
  collectedPickupIds.add(pickup.id);
  sessionStorage.setItem(PICKUP_STORAGE_KEY, JSON.stringify([...collectedPickupIds]));

  const element = pickupElements.get(pickup.id);

  if (element) {
    element.remove();
    pickupElements.delete(pickup.id);
  }

  const itemTotal = addPickupItem(pickup.itemId, pickup.amount);
  showPickupToast(`Found ${pickup.label} x${itemTotal}`);
}

function isPickupCollected(pickupId) {
  return collectedPickupIds.has(pickupId);
}

function resetPickupState() {
  pickupElements.forEach((element) => element.remove());
  pickupElements.clear();
  collectedPickupIds = new Set();
  placePickups();
}

function addPickupItem(itemId, amount) {
  addInventoryItem(itemId, amount);
  return getInventoryItemCount(itemId);
}

function getCollectedPickups() {
  const savedPickups = sessionStorage.getItem(PICKUP_STORAGE_KEY);

  if (!savedPickups) {
    return [];
  }

  try {
    return JSON.parse(savedPickups);
  } catch (error) {
    sessionStorage.removeItem(PICKUP_STORAGE_KEY);
    return [];
  }
}

function showPickupToast(message) {
  let toast = document.querySelector(".pickup-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "pickup-toast";
    stage.append(toast);
  }

  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(pickupToastTimeout);
  pickupToastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 1600);
}
