const PICKUP_STORAGE_KEY = "lab-zero-collected-pickups";
const PICKUP_INVENTORY_KEY = "lab-zero-inventory";
const DEFAULT_PICKUP_INVENTORY = {
  sunflowerSeeds: 0,
  milletSeeds: 0,
  cig: 1
};

const PICKUPS = [
  makeSunflowerPickup("dilly-sunflower-1", 180, 360),
  makeSunflowerPickup("dilly-sunflower-2", 170, 276),
  makeSunflowerPickup("dilly-sunflower-3", 450, 350),
  makeSunflowerPickup("dilly-sunflower-4", 470, 270),
  makeSunflowerPickup("forest-sunflower-1", 895, 400),
  makeSunflowerPickup("forest-sunflower-2", 678, 738),
  makeSunflowerPickup("forest-sunflower-3", 292, 1032),
  makeSunflowerPickup("forest-sunflower-4", 656, 1184),
  makeSunflowerPickup("east-sunflower-1", 1654, 814),
  makeSunflowerPickup("east-sunflower-2", 1834, 374),
  makeSunflowerPickup("northeast-sunflower-1", 1804, 38),
  makeMilletPickup("northeast-millet-1", 2012, 140),
  makeMilletPickup("northeast-millet-2", 2072, 260),
  makeMilletPickup("crickthicket-millet-1", 240, 890),
  makeMilletPickup("crickthicket-millet-2", 550, 968),
  makeMilletPickup("crickthicket-millet-3", 1856, 398),
  makeMilletPickup("crickthicket-millet-4", 812, 596),
  makeMilletPickup("crickthicket-millet-5", 2086, 1152),
  makeMilletPickup("crickthicket-millet-6", 936, 442),
  makeMilletPickup("crickthicket-millet-7", 158, 1186),
  makeMilletPickup("crickthicket-millet-8", 316, 574),
  makeMilletPickup("crickthicket-millet-9", 1586, 1160)
];

const pickupElements = new Map();
let pickupToastTimeout;

installPickupStyles();
placePickups();
requestAnimationFrame(checkPickups);

function makeSunflowerPickup(id, x, y) {
  return {
    id,
    area: "outside",
    x,
    y,
    itemId: "sunflowerSeeds",
    amount: 1,
    label: "Sunflower Seeds",
    collectRadius: 34,
    className: "sunflower-pickup"
  };
}

function makeMilletPickup(id, x, y) {
  return {
    id,
    area: "outside",
    x,
    y,
    itemId: "milletSeeds",
    amount: 1,
    label: "Millet Seeds",
    collectRadius: 58,
    className: "millet-pickup"
  };
}

function installPickupStyles() {
  const style = document.createElement("style");
  style.textContent = `
    .pickup {
      position: absolute;
      width: 42px;
      height: 42px;
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
  const collected = getCollectedPickups();

  PICKUPS.forEach((pickup) => {
    const area = AREAS[pickup.area];

    if (!area) {
      return;
    }

    const element = document.createElement("div");
    element.className = `pickup ${pickup.className}`;
    element.style.left = `${pickup.x}px`;
    element.style.top = `${pickup.y}px`;
    element.setAttribute("aria-label", pickup.label);

    if (collected.includes(pickup.id)) {
      element.classList.add("collected");
    }

    area.element.append(element);
    pickupElements.set(pickup.id, element);
  });
}

function checkPickups() {
  const collected = getCollectedPickups();

  if (state.flightPhase !== "ground") {
    requestAnimationFrame(checkPickups);
    return;
  }

  PICKUPS.forEach((pickup) => {
    if (pickup.area !== state.area || collected.includes(pickup.id)) {
      return;
    }

    const distance = Math.hypot(state.x - pickup.x, state.y - pickup.y);

    if (distance <= pickup.collectRadius) {
      collectPickup(pickup, collected);
    }
  });

  requestAnimationFrame(checkPickups);
}

function collectPickup(pickup, collected) {
  collected.push(pickup.id);
  sessionStorage.setItem(PICKUP_STORAGE_KEY, JSON.stringify(collected));

  const element = pickupElements.get(pickup.id);

  if (element) {
    element.classList.add("collected");
  }

  addPickupItem(pickup.itemId, pickup.amount);
  showPickupToast(`Found ${pickup.label} x${pickup.amount}`);
}

function addPickupItem(itemId, amount) {
  if (typeof addInventoryItem === "function") {
    addInventoryItem(itemId, amount);
    return;
  }

  const inventory = getPickupInventory();
  inventory[itemId] = Math.max(0, (inventory[itemId] || 0) + amount);
  sessionStorage.setItem(PICKUP_INVENTORY_KEY, JSON.stringify(inventory));
}

function getPickupInventory() {
  const savedInventory = sessionStorage.getItem(PICKUP_INVENTORY_KEY);

  if (!savedInventory) {
    return { ...DEFAULT_PICKUP_INVENTORY };
  }

  try {
    return {
      ...DEFAULT_PICKUP_INVENTORY,
      ...JSON.parse(savedInventory)
    };
  } catch (error) {
    return { ...DEFAULT_PICKUP_INVENTORY };
  }
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
