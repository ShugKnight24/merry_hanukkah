// TODO: Add error handling for potentially missing DOM elements
// Can create a single object to store all DOM elements, not really needed for DOM elements we "know" are always present
// DOM Elements
const modeToggle = document.getElementById("modeToggle");
const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const hanukkahSection = document.getElementById("hanukkahSection");
const christmasSection = document.getElementById("christmasSection");
const lightCandlesBtn = document.getElementById("lightCandles");
const lightCandlesText = document.getElementById("lightCandlesText");
const menorah = document.getElementById("menorah");
const stringLights = document.getElementById("stringLights");
const stringLightsToggle = document.getElementById("stringLightsToggle");
const treeContainer = document.getElementById("treeContainer");
const decorations = document.getElementById("decorations");
const treeTopper = document.getElementById("treeTopper");
const clearDecorationsBtn = document.getElementById("clearDecorations");
const miniMenorah = document.getElementById("miniMenorah");
const nightNumberDisplay = document.getElementById("nightNumber");
const nightProgressBar = document.getElementById("nightProgressBar");
const treeLayers = document.getElementById("treeLayers");

// Tree customization elements
const treeSizeSlider = document.getElementById("treeSize");
const treeFullnessSlider = document.getElementById("treeFullness");
const treeSizeValue = document.getElementById("treeSizeValue");
const treeFullnessValue = document.getElementById("treeFullnessValue");

// State
let currentMode = "hanukkah";
let selectedNight = 1;
let candlesLit = false;
let stringLightsOn = true;
let selectedDecoType = null;
let menorahStyle = "modern";
let treeConfig = {
  type: "classic",
  size: 100,
  fullness: 100,
};

// Tree types config
const treeTypes = {
  classic: {
    layers: 5,
    baseWidth: 320,
    topWidth: 60,
    layerHeight: 85,
    color1: "#1a4d1a",
    color2: "#2d6b2d",
    color3: "#3d8b3d",
  },
  pine: {
    layers: 7,
    baseWidth: 260,
    topWidth: 45,
    layerHeight: 62,
    color1: "#1a4d1a",
    color2: "#2d6b2d",
    color3: "#3d8b3d",
  },
  spruce: {
    layers: 5,
    baseWidth: 300,
    topWidth: 65,
    layerHeight: 80,
    color1: "#1a4a5a",
    color2: "#2a6a7a",
    color3: "#3a8a9a",
  },
  slim: {
    layers: 6,
    baseWidth: 180,
    topWidth: 35,
    layerHeight: 72,
    color1: "#1a4d1a",
    color2: "#2d6b2d",
    color3: "#3d8b3d",
  },
};

// String Lights
// TODO: Account for screen resizing
function initStringLights() {
  stringLights.innerHTML = "";
  const lightCount = Math.floor(window.innerWidth / 50);
  const spacing = window.innerWidth / lightCount;

  for (let i = 0; i < lightCount; i++) {
    const light = document.createElement("div");
    light.className = "light-bulb";
    light.style.left = `${spacing * i + spacing / 2}px`;
    light.style.animationDelay = `${(i * 0.15) % 2}s`;
    stringLights.appendChild(light);
  }

  // Update toggle button state
  updateStringLightsToggle();
}

function toggleStringLights() {
  stringLightsOn = !stringLightsOn;
  updateStringLightsToggle();
}

function updateStringLightsToggle() {
  if (stringLightsOn) {
    stringLights.classList.remove("lights-off");
    stringLightsToggle.classList.add("lights-on");
    stringLightsToggle.classList.remove("lights-off");
  } else {
    stringLights.classList.add("lights-off");
    stringLightsToggle.classList.remove("lights-on");
    stringLightsToggle.classList.add("lights-off");
  }
}

// Light dimmer functionality
function initLightDimmer() {
  const dimmer = document.getElementById("lightDimmer");
  if (dimmer) {
    dimmer.addEventListener("input", (e) => {
      const brightness = e.target.value / 100;
      const bulbs = document.querySelectorAll(".light-bulb");
      bulbs.forEach((bulb) => {
        bulb.style.opacity = brightness;
        bulb.style.filter = `brightness(${brightness})`;
      });
    });
  }
}

// TODO: Abstract candle creation and simplify
// Menorah
function createCandleSVG(height, color, isShemash = false, style = "modern") {
  const wrapper = document.createElement("div");
  wrapper.className = `candle-wrapper ${isShemash ? "shamash" : ""}`;

  // Different candle shapes based on style
  let candleBody = "";
  let wickY = 42;
  let flameY = 24;

  // Metal cup holder for all styles
  const metalCupHolder = `
    <!-- Metal cup holder -->
    <ellipse cx="20" cy="${50 + height + 5}" rx="14" ry="5" fill="#8a8a8a"/>
    <rect x="6" y="${
      50 + height - 8
    }" width="28" height="13" rx="2" fill="linear-gradient(180deg, #c0c0c0, #808080)"/>
    <ellipse cx="20" cy="${50 + height - 8}" rx="14" ry="5" fill="#b0b0b0"/>
    <ellipse cx="20" cy="${50 + height - 6}" rx="11" ry="4" fill="#4a4a4a"/>
  `;

  if (style === "oil") {
    // Oil lamp style - larger glass cup with golden oil and flat base
    candleBody = `
      <!-- Flat base -->
      <rect x="4" y="${
        50 + height + 5
      }" width="32" height="8" rx="2" fill="#8b4513"/>
      <ellipse cx="20" cy="${50 + height + 5}" rx="16" ry="5" fill="#a0522d"/>
      <!-- Large glass cup -->
      <path d="M6,${50 + height - 35} L4,${50 + height + 5} L36,${
      50 + height + 5
    } L34,${50 + height - 35}" 
            fill="rgba(200, 220, 255, 0.25)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1"/>
      <!-- Glass sides -->
      <path d="M8,${50 + height - 30} Q6,${50 + height - 10} 7,${50 + height}" 
            stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none"/>
      <path d="M32,${50 + height - 30} Q34,${50 + height - 10} 33,${
      50 + height
    }" 
            stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
      <!-- Oil inside - golden -->
      <path d="M8,${50 + height - 25} L7,${50 + height + 3} L33,${
      50 + height + 3
    } L32,${50 + height - 25}" 
            fill="#ffd700" opacity="0.85"/>
      <!-- Oil surface shine -->
      <ellipse cx="20" cy="${
        50 + height - 25
      }" rx="12" ry="4" fill="#ffec8b" opacity="0.7"/>
      <ellipse cx="15" cy="${
        50 + height - 23
      }" rx="4" ry="2" fill="#fff" opacity="0.4"/>
      <!-- Wick holder -->
      <rect x="17" y="${50 + height - 40}" width="6" height="18" fill="#333"/>
    `;
    wickY = 50 + height - 55;
    flameY = 50 + height - 73;
  } else if (style === "temple") {
    // Temple style - golden with metal cups
    candleBody = `
      ${metalCupHolder}
      <rect x="8" y="50" width="24" height="${height}" rx="2" fill="url(#candleGrad-${height})"/>
      <rect x="6" y="${
        50 + height - 5
      }" width="28" height="8" rx="2" fill="${adjustColor(color, -30)}"/>
      <rect x="10" y="50" width="20" height="6" rx="1" fill="${adjustColor(
        color,
        20
      )}"/>
      <!-- Decorative patterns -->
      <path d="M10,${50 + height / 4} L30,${
      50 + height / 4
    }" stroke="${adjustColor(
      color,
      -40
    )}" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M10,${50 + height / 2} L30,${
      50 + height / 2
    }" stroke="${adjustColor(
      color,
      -40
    )}" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M10,${50 + (height * 3) / 4} L30,${
      50 + (height * 3) / 4
    }" stroke="${adjustColor(
      color,
      -40
    )}" stroke-width="1.5" stroke-dasharray="3 2"/>
      <!-- Star of David small decoration -->
      <text x="20" y="${
        50 + height / 2 + 5
      }" text-anchor="middle" fill="${adjustColor(
      color,
      -50
    )}" font-size="10" opacity="0.5">✡</text>
    `;
  } else if (style === "traditional") {
    // Traditional style - metal cup holder
    candleBody = `
      ${metalCupHolder}
      <rect x="10" y="50" width="20" height="${height}" rx="4" fill="url(#candleGrad-${height})"/>
      <!-- Wax drip effect -->
      <ellipse cx="20" cy="50" rx="10" ry="4" fill="${adjustColor(color, 15)}"/>
      <path d="M12,52 Q10,60 12,65" stroke="${adjustColor(
        color,
        10
      )}" stroke-width="3" fill="none" opacity="0.7"/>
      <path d="M28,52 Q30,58 28,62" stroke="${adjustColor(
        color,
        10
      )}" stroke-width="2" fill="none" opacity="0.6"/>
    `;
  } else {
    // Modern - standard candle with metal cup
    candleBody = `
      ${metalCupHolder}
      <rect x="10" y="50" width="20" height="${height}" rx="3" fill="url(#candleGrad-${height})"/>
    `;
  }

  // TODO: Account for ID on 257 - currently generates duplicate IDs when candles have same height
  wrapper.innerHTML = `
    <svg class="candle-svg" viewBox="0 0 40 ${height + 75}" style="height: ${
    height + 75
  }px">
      <defs>
        <linearGradient id="candleGrad-${height}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${adjustColor(color, -20)}"/>
          <stop offset="50%" style="stop-color:${color}"/>
          <stop offset="100%" style="stop-color:${adjustColor(color, -20)}"/>
        </linearGradient>
        <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style="stop-color:#ff4500"/>
          <stop offset="50%" style="stop-color:#ff8c00"/>
          <stop offset="100%" style="stop-color:#ffd700"/>
        </linearGradient>
        <linearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" style="stop-color:#ffd700"/>
          <stop offset="100%" style="stop-color:#ffffcc"/>
        </linearGradient>
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Candle body -->
      ${candleBody}
      <!-- Wick -->
      ${
        style !== "oil"
          ? `<rect x="18" y="${wickY}" width="4" height="12" fill="#333"/>`
          : ""
      }
      <!-- Flame group (hidden by default) -->
      <g class="flame-group" opacity="0">
        <ellipse cx="20" cy="${flameY}" rx="10" ry="22" fill="url(#flameOuter)" filter="url(#flameGlow)" class="flame-outer"/>
        <ellipse cx="20" cy="${
          flameY + 3
        }" rx="5" ry="14" fill="url(#flameInner)" class="flame-inner"/>
        <ellipse cx="20" cy="${
          flameY + 7
        }" rx="2" ry="6" fill="#fff" opacity="0.9" class="flame-core"/>
      </g>
    </svg>
  `;

  return wrapper;
}

function adjustColor(color, amount) {
  const hex = color.replace("#", "");
  const r = Math.max(
    0,
    Math.min(255, parseInt(hex.substring(0, 2), 16) + amount)
  );
  const g = Math.max(
    0,
    Math.min(255, parseInt(hex.substring(2, 4), 16) + amount)
  );
  const b = Math.max(
    0,
    Math.min(255, parseInt(hex.substring(4, 6), 16) + amount)
  );
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// TODO: Create templates of the menorah candles as opposed to generating them dynamically each time
function initMenorah() {
  menorah.innerHTML = "";
  const style = menorahStyles[menorahStyle];
  const heights = [90, 85, 95, 88, 120, 92, 86, 94, 89];

  for (let i = 0; i < 9; i++) {
    const candle = createCandleSVG(
      heights[i],
      style.candleColors[i],
      i === 4,
      menorahStyle
    );
    candle.dataset.index = i;
    menorah.appendChild(candle);
  }

  // Update menorah base style
  menorah.className = `menorah menorah-style-${menorahStyle}`;
  candlesLit = false;
  updateLightButtonState();
}

function updateLightButtonState() {
  if (candlesLit) {
    lightCandlesBtn.classList.add("lit");
    lightCandlesText.textContent = "Extinguish Candles";
  } else {
    lightCandlesBtn.classList.remove("lit");
    lightCandlesText.textContent = "Light the Menorah";
  }
}

function toggleMenorahLighting() {
  if (candlesLit) {
    // Extinguish candles
    extinguishCandles();
  } else {
    // Light candles
    initMenorah();
    setTimeout(() => lightCandles(selectedNight), 100);
  }
}

function extinguishCandles() {
  const candles = menorah.querySelectorAll(".candle-wrapper");

  candles.forEach((candle, index) => {
    // TODO: Clean up timeouts
    setTimeout(() => {
      const flame = candle.querySelector(".flame-group");
      if (flame) {
        flame.style.opacity = "0";
      }
      candle.classList.remove("lit");
    }, index * 100);
  });

  candlesLit = false;
  updateLightButtonState();
}

function lightCandles(night) {
  const candles = menorah.querySelectorAll(".candle-wrapper");

  // First, hide all flames
  candles.forEach((c) => {
    const flame = c.querySelector(".flame-group");
    if (flame) flame.style.opacity = "0";
    c.classList.remove("lit");
  });

  // Always light the shamash (center candle) first
  setTimeout(() => {
    const shamash = candles[4];
    const flame = shamash.querySelector(".flame-group");
    if (flame) flame.style.opacity = "1";
    shamash.classList.add("lit");
  }, 300);

  // Light the appropriate number of candles from right to left
  const lightOrder = [8, 7, 6, 5, 3, 2, 1, 0];

  for (let i = 0; i < night; i++) {
    const candleIndex = lightOrder[i];
    // TODO: Clean up timeouts
    setTimeout(() => {
      const candle = candles[candleIndex];
      const flame = candle.querySelector(".flame-group");
      if (flame) flame.style.opacity = "1";
      candle.classList.add("lit");
    }, 600 + i * 300);
  }

  candlesLit = true;
  updateLightButtonState();
}

// Mini Menorah Selector
function initMiniMenorah() {
  const miniCandles = miniMenorah.querySelectorAll(".mini-candle");

  miniCandles.forEach((candle) => {
    candle.addEventListener("click", () => {
      const night = parseInt(candle.dataset.night);
      if (night === 0) return; // Shamash is not clickable

      selectedNight = night;
      nightNumberDisplay.textContent = night;

      // Update progress bar
      if (nightProgressBar) {
        nightProgressBar.style.width = `${(night / 8) * 100}%`;
      }

      updateMiniMenorahDisplay();
    });
  });

  updateMiniMenorahDisplay();
}

function updateMiniMenorahDisplay() {
  const miniCandles = miniMenorah.querySelectorAll(".mini-candle");

  miniCandles.forEach((candle) => {
    const night = parseInt(candle.dataset.night);
    if (night === 0) {
      // Shamash is always "lit" in preview
      candle.classList.add("preview-lit");
    } else if (night <= selectedNight) {
      candle.classList.add("preview-lit");
    } else {
      candle.classList.remove("preview-lit");
    }
  });

  // Update the menorah preview SVG
  updateMenorahPreviewFlames();
}

// Update the preview menorah flames based on selected night
function updateMenorahPreviewFlames() {
  const previewFlames = document.querySelectorAll(
    ".menorah-preview-svg .preview-flame[data-night]"
  );

  previewFlames.forEach((flame) => {
    const night = parseInt(flame.dataset.night);
    if (night <= selectedNight) {
      flame.setAttribute("opacity", "1");
      flame.classList.add("lit");
    } else {
      flame.setAttribute("opacity", "0");
      flame.classList.remove("lit");
    }
  });
}

// Menorah Styles
const menorahStyles = {
  modern: {
    candleColors: [
      "#4169E1",
      "#6495ED",
      "#4682B4",
      "#5F9EA0",
      "#E8E8E8",
      "#87CEEB",
      "#4169E1",
      "#6495ED",
      "#5F9EA0",
    ],
    baseColor: "#c0c0c0",
    baseStyle: "sleek",
  },
  traditional: {
    candleColors: [
      "#4da6ff",
      "#4da6ff",
      "#4da6ff",
      "#4da6ff",
      "#ffd700",
      "#4da6ff",
      "#4da6ff",
      "#4da6ff",
      "#4da6ff",
    ],
    baseColor: "#ffd700",
    baseStyle: "curved",
  },
  oil: {
    candleColors: [
      "#daa520",
      "#daa520",
      "#daa520",
      "#daa520",
      "#ffd700",
      "#daa520",
      "#daa520",
      "#daa520",
      "#daa520",
    ],
    baseColor: "#8b4513",
    baseStyle: "cups",
  },
  temple: {
    candleColors: [
      "#ffd700",
      "#ffd700",
      "#ffd700",
      "#ffd700",
      "#fff8dc",
      "#ffd700",
      "#ffd700",
      "#ffd700",
      "#ffd700",
    ],
    baseColor: "#ffd700",
    baseStyle: "branches",
  },
};

function initMenorahStyleSelector() {
  const styleButtons = document.querySelectorAll(".style-btn");

  styleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      styleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      menorahStyle = btn.dataset.style;
      initMenorah();

      // Re-light if candles were lit
      if (candlesLit) {
        setTimeout(() => lightCandles(selectedNight), 100);
      }
    });
  });
}

// Christmas Tree
function generateTree() {
  const config = treeTypes[treeConfig.type];
  const scale = treeConfig.size / 100;
  const fullness = treeConfig.fullness / 100;

  treeLayers.innerHTML = "";

  const baseY = 410;
  const x = 200;

  // Build tree from bottom to top - widest layer at bottom, smallest at top
  // Each layer overlaps the one below it
  const layers = [];

  for (let i = 0; i < config.layers; i++) {
    // i=0 is bottom (widest), i=config.layers-1 is top (narrowest)
    const progress = i / (config.layers - 1);

    // Width decreases as we go up
    const width =
      (config.baseWidth - (config.baseWidth - config.topWidth) * progress) *
      fullness;
    const height = config.layerHeight * scale;

    // Calculate Y position - layers stack upward with overlap
    const layerY = baseY - i * height * 0.55;

    // Choose color based on layer position (lighter at top)
    let color;
    if (progress < 0.33) color = config.color1; // Bottom - darkest
    else if (progress < 0.66) color = config.color2; // Middle
    else color = config.color3; // Top - lightest

    layers.push({
      width,
      height,
      y: layerY,
      color,
      index: i,
    });
  }

  // Update trunk first - render before tree layers so it appears behind
  const trunk = document.getElementById("treeTrunk");
  if (!trunk) return;
  if (trunk) {
    trunk.setAttribute("y", baseY + 5);
    trunk.setAttribute("height", "55");
    trunk.setAttribute("width", "44");
    trunk.setAttribute("x", "178");
  }

  // Render layers from bottom to top so upper layers appear on top (and on top of trunk)
  layers.forEach((layer) => {
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );

    // Triangle points: top center, bottom left, bottom right
    const points = `${x},${layer.y - layer.height} ${x - layer.width / 2},${
      layer.y + 15
    } ${x + layer.width / 2},${layer.y + 15}`;

    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", layer.color);
    polygon.setAttribute("class", "tree-layer-svg");
    polygon.style.filter = "drop-shadow(0 5px 10px rgba(0,0,0,0.3))";

    treeLayers.appendChild(polygon);
  });

  // Update topper position at the very top
  const topLayer = layers[layers.length - 1];
  const topperY = (topLayer.y - topLayer.height - 25) * scale;
  treeTopper.style.top = `${Math.max(topperY, 10)}px`;
}

// Decorations
// TODO: IDs will cause issues if multiple decorations of the same type are added
const decorationSVGs = {
  lights: `
    <svg viewBox="0 0 30 30" width="25" height="25">
      <circle cx="15" cy="18" r="8" fill="#ffd700" class="light-glow"/>
      <rect x="13" y="6" width="4" height="8" fill="#666"/>
      <circle cx="15" cy="18" r="6" fill="#fff8dc"/>
    </svg>
  `,
  "string-lights": `
    <svg viewBox="0 0 60 30" width="50" height="25">
      <path d="M5,8 Q30,18 55,8" stroke="#333" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="5" fill="#ff4444" class="light-glow"/>
      <circle cx="30" cy="16" r="5" fill="#44ff44" class="light-glow"/>
      <circle cx="48" cy="12" r="5" fill="#4444ff" class="light-glow"/>
      <rect x="10" y="5" width="4" height="4" fill="#666"/>
      <rect x="28" y="9" width="4" height="4" fill="#666"/>
      <rect x="46" y="5" width="4" height="4" fill="#666"/>
    </svg>
  `,
  "ornament-red": `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <defs>
        <radialGradient id="redOrn" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#ff6b6b"/>
          <stop offset="100%" style="stop-color:#c0392b"/>
        </radialGradient>
      </defs>
      <rect x="12" y="2" width="6" height="6" rx="1" fill="#ffd700"/>
      <circle cx="15" cy="20" r="12" fill="url(#redOrn)"/>
      <ellipse cx="11" cy="15" rx="3" ry="4" fill="#fff" opacity="0.3"/>
    </svg>
  `,
  "ornament-gold": `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <defs>
        <radialGradient id="goldOrn" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#ffd700"/>
          <stop offset="100%" style="stop-color:#b8860b"/>
        </radialGradient>
      </defs>
      <rect x="12" y="2" width="6" height="6" rx="1" fill="#c0392b"/>
      <circle cx="15" cy="20" r="12" fill="url(#goldOrn)"/>
      <ellipse cx="11" cy="15" rx="3" ry="4" fill="#fff" opacity="0.3"/>
    </svg>
  `,
  "ornament-blue": `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <defs>
        <radialGradient id="blueOrn" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#5dade2"/>
          <stop offset="100%" style="stop-color:#2874a6"/>
        </radialGradient>
      </defs>
      <rect x="12" y="2" width="6" height="6" rx="1" fill="#ffd700"/>
      <circle cx="15" cy="20" r="12" fill="url(#blueOrn)"/>
      <ellipse cx="11" cy="15" rx="3" ry="4" fill="#fff" opacity="0.3"/>
    </svg>
  `,
  "ornament-silver": `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <defs>
        <radialGradient id="silverOrn" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#ecf0f1"/>
          <stop offset="100%" style="stop-color:#95a5a6"/>
        </radialGradient>
      </defs>
      <rect x="12" y="2" width="6" height="6" rx="1" fill="#c0392b"/>
      <circle cx="15" cy="20" r="12" fill="url(#silverOrn)"/>
      <ellipse cx="11" cy="15" rx="3" ry="4" fill="#fff" opacity="0.4"/>
    </svg>
  `,
  "ornament-green": `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <defs>
        <radialGradient id="greenOrn" cx="30%" cy="30%">
          <stop offset="0%" style="stop-color:#66bb6a"/>
          <stop offset="100%" style="stop-color:#2e7d32"/>
        </radialGradient>
      </defs>
      <rect x="12" y="2" width="6" height="6" rx="1" fill="#ffd700"/>
      <circle cx="15" cy="20" r="12" fill="url(#greenOrn)"/>
      <ellipse cx="11" cy="15" rx="3" ry="4" fill="#fff" opacity="0.3"/>
    </svg>
  `,
  tinsel: `
    <svg viewBox="0 0 40 20" width="35" height="18">
      <path d="M2,10 Q12,2 22,10 Q32,18 40,10" stroke="#c0c0c0" stroke-width="3" fill="none" opacity="0.8"/>
      <path d="M2,12 Q12,4 22,12 Q32,20 40,12" stroke="#ffd700" stroke-width="2" fill="none" opacity="0.6"/>
    </svg>
  `,
  "candy-cane": `
    <svg viewBox="0 0 25 40" width="20" height="32">
      <path d="M18,38 L18,15 Q18,5 10,5 Q2,5 2,12" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M18,38 L18,15 Q18,5 10,5 Q2,5 2,12" stroke="#c0392b" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="5 5"/>
    </svg>
  `,
  snowflake: `
    <svg viewBox="0 0 30 30" width="26" height="26">
      <line x1="15" y1="2" x2="15" y2="28" stroke="#fff" stroke-width="2"/>
      <line x1="2" y1="15" x2="28" y2="15" stroke="#fff" stroke-width="2"/>
      <line x1="6" y1="6" x2="24" y2="24" stroke="#fff" stroke-width="1.5"/>
      <line x1="24" y1="6" x2="6" y2="24" stroke="#fff" stroke-width="1.5"/>
      <circle cx="15" cy="15" r="3" fill="#fff"/>
      <circle cx="15" cy="5" r="2" fill="#e8f4ff"/>
      <circle cx="15" cy="25" r="2" fill="#e8f4ff"/>
      <circle cx="5" cy="15" r="2" fill="#e8f4ff"/>
      <circle cx="25" cy="15" r="2" fill="#e8f4ff"/>
    </svg>
  `,
  present: `
    <svg viewBox="0 0 30 34" width="26" height="30">
      <defs>
        <linearGradient id="presentRedDeco" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#e53935"/>
          <stop offset="100%" style="stop-color:#b71c1c"/>
        </linearGradient>
      </defs>
      <rect x="3" y="12" width="24" height="19" rx="2" fill="url(#presentRedDeco)"/>
      <rect x="3" y="8" width="24" height="6" rx="2" fill="#ef5350"/>
      <rect x="13" y="8" width="4" height="23" fill="#ffd700"/>
      <rect x="3" y="17" width="24" height="4" fill="#ffd700"/>
      <ellipse cx="15" cy="6" rx="5" ry="3" fill="#ffd700"/>
    </svg>
  `,
  bell: `
    <svg viewBox="0 0 30 34" width="24" height="28">
      <path d="M15,3 L15,6" stroke="#ffd700" stroke-width="2"/>
      <path d="M8,24 Q8,14 15,11 Q22,14 22,24" fill="#ffd700"/>
      <ellipse cx="15" cy="24" rx="8" ry="3" fill="#daa520"/>
      <circle cx="15" cy="28" r="3" fill="#ffd700"/>
      <path d="M10,6 Q15,3 20,6 Q18,10 15,10 Q12,10 10,6" fill="#c62828"/>
    </svg>
  `,
};

const topperSVGs = {
  none: ``,
  star: `
    <svg viewBox="0 0 50 50" width="50" height="50" class="star-topper">
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fff8dc"/>
          <stop offset="50%" style="stop-color:#ffd700"/>
          <stop offset="100%" style="stop-color:#daa520"/>
        </linearGradient>
        <filter id="starGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <polygon points="25,2 30,18 47,18 33,28 38,45 25,35 12,45 17,28 3,18 20,18" fill="url(#starGrad)" filter="url(#starGlow)"/>
    </svg>
  `,
  angel: `
    <svg viewBox="0 0 50 60" width="45" height="55" class="angel-topper">
      <defs>
        <radialGradient id="haloGrad" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#fff8dc"/>
          <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0"/>
        </radialGradient>
        <linearGradient id="dressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff"/>
          <stop offset="100%" style="stop-color:#d0d0e0"/>
        </linearGradient>
      </defs>
      <!-- Halo glow -->
      <ellipse cx="25" cy="8" rx="10" ry="3" fill="url(#haloGrad)"/>
      <ellipse cx="25" cy="8" rx="6" ry="2" fill="#ffd700" opacity="0.6"/>
      <!-- Wings (behind body) -->
      <path d="M5,32 C0,24 2,18 10,20 C14,22 12,30 8,34 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="0.5"/>
      <path d="M45,32 C50,24 48,18 40,20 C36,22 38,30 42,34 Z" fill="#ffffff" stroke="#e0e0e0" stroke-width="0.5"/>
      <!-- Body/Dress - bell shape -->
      <path d="M25,24 C18,24 14,30 12,40 C10,50 12,56 14,58 L36,58 C38,56 40,50 38,40 C36,30 32,24 25,24 Z" fill="url(#dressGrad)" stroke="#c0c0c0" stroke-width="0.5"/>
      <!-- Dress fold details -->
      <path d="M18,35 Q25,32 32,35" stroke="#d0d0d0" stroke-width="1" fill="none"/>
      <path d="M16,45 Q25,42 34,45" stroke="#d0d0d0" stroke-width="1" fill="none"/>
      <path d="M14,55 Q25,52 36,55" stroke="#d0d0d0" stroke-width="1" fill="none"/>
      <!-- Arms connected to body -->
      <path d="M18,28 C14,30 10,32 8,30 C6,28 8,26 12,26 C14,26 16,27 18,28" fill="#fce4d6" stroke="#e8c8b8" stroke-width="0.5"/>
      <path d="M32,28 C36,30 40,32 42,30 C44,28 42,26 38,26 C36,26 34,27 32,28" fill="#fce4d6" stroke="#e8c8b8" stroke-width="0.5"/>
      <!-- Hands -->
      <circle cx="8" cy="29" r="2.5" fill="#fce4d6"/>
      <circle cx="42" cy="29" r="2.5" fill="#fce4d6"/>
      <!-- Neck -->
      <rect x="22" y="20" width="6" height="5" fill="#fce4d6"/>
      <!-- Head -->
      <circle cx="25" cy="16" r="7" fill="#fce4d6"/>
      <!-- Hair -->
      <ellipse cx="25" cy="12" rx="6" ry="4" fill="#f4d03f"/>
      <path d="M19,13 Q21,17 19,19" stroke="#daa520" stroke-width="1" fill="none"/>
      <path d="M31,13 Q29,17 31,19" stroke="#daa520" stroke-width="1" fill="none"/>
      <!-- Face -->
      <circle cx="22" cy="15" r="1" fill="#333"/>
      <circle cx="28" cy="15" r="1" fill="#333"/>
      <path d="M23,19 Q25,20 27,19" stroke="#d4a5a5" stroke-width="1" fill="none"/>
      <!-- Rosy cheeks -->
      <circle cx="19" cy="17" r="1.5" fill="#ffcccc" opacity="0.5"/>
      <circle cx="31" cy="17" r="1.5" fill="#ffcccc" opacity="0.5"/>
    </svg>
  `,
};

// Preview element for decoration placement
// TODO: Look into this setup and simplify
let decorationPreview = null;

function createDecorationPreview() {
  if (decorationPreview) {
    decorationPreview.remove();
  }
  decorationPreview = document.createElement("div");
  decorationPreview.className = "decoration-preview";
  decorationPreview.style.cssText = `
    position: absolute;
    pointer-events: none;
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.1);
    z-index: 10;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
    display: none;
  `;
  decorations.appendChild(decorationPreview);
}

function updateDecorationPreview(e) {
  if (!selectedDecoType || !decorationPreview) return;

  const rect = treeContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check bounds
  if (y < 50 || y > rect.height - 50) {
    decorationPreview.style.display = "none";
    return;
  }

  decorationPreview.innerHTML = decorationSVGs[selectedDecoType] || "";
  decorationPreview.style.left = `${x}px`;
  decorationPreview.style.top = `${y}px`;
  decorationPreview.style.display = "block";
}

function hideDecorationPreview() {
  if (decorationPreview) {
    decorationPreview.style.display = "none";
  }
}

// TODO: Add accessibility features via keyboard controls
function addDecoration(e) {
  if (!selectedDecoType) return;

  // Don't add if clicking on existing decoration
  if (
    e.target.closest(".decoration") &&
    !e.target.closest(".decoration-preview")
  ) {
    return;
  }

  const rect = treeContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Check bounds
  if (y < 50 || y > rect.height - 50) return;

  const deco = document.createElement("div");
  deco.className = `decoration ${selectedDecoType}`;
  deco.style.left = `${x}px`;
  deco.style.top = `${y}px`;
  deco.innerHTML = decorationSVGs[selectedDecoType] || "";

  // Add animation on place
  deco.style.animation = "decoration-place 0.3s ease-out";

  // TODO: Delegate event listeners to parent container instead of individual decorations
  // Right-click to remove (not regular click to prevent accidental removal)
  deco.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    deco.style.animation = "decoration-remove 0.3s ease-in forwards";
    setTimeout(() => deco.remove(), 300);
  });

  // Double-click to remove
  deco.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    deco.style.animation = "decoration-remove 0.3s ease-in forwards";
    setTimeout(() => deco.remove(), 300);
  });

  decorations.appendChild(deco);
}

function setTopper(type) {
  treeTopper.innerHTML = topperSVGs[type] || "";
  treeTopper.className = `tree-topper ${type}`;
}

// mode toggle
function toggleMode() {
  currentMode = modeToggle.checked ? "christmas" : "hanukkah";
  document.body.dataset.mode = currentMode;

  if (currentMode === "christmas") {
    mainTitle.textContent = "Merry Christmas";
    mainSubtitle.textContent = "Create your perfect holiday tree";
    hanukkahSection.classList.add("hidden");
    christmasSection.classList.remove("hidden");
    generateTree();
  } else {
    mainTitle.textContent = "Happy Hanukkah";
    mainSubtitle.textContent = "Celebrate the Festival of Lights";
    hanukkahSection.classList.remove("hidden");
    christmasSection.classList.add("hidden");
  }
}

// Event listeners
// Mode toggle
modeToggle.addEventListener("change", toggleMode);

// Clicking the toggle options
document.querySelectorAll(".toggle-option").forEach((opt) => {
  opt.addEventListener("click", () => {
    const mode = opt.dataset.mode;
    modeToggle.checked = mode === "christmas";
    toggleMode();
  });
});

// String lights toggle
stringLightsToggle.addEventListener("click", toggleStringLights);

// Light candles button - Toggle
lightCandlesBtn.addEventListener("click", toggleMenorahLighting);

// Decoration buttons
document.querySelectorAll(".deco-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".deco-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedDecoType = btn.dataset.type;
  });
});

// Topper buttons
document.querySelectorAll(".topper-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".topper-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    setTopper(btn.dataset.topper);
  });
});

// Tree container click
treeContainer.addEventListener("click", addDecoration);
treeContainer.addEventListener("mousemove", updateDecorationPreview);
treeContainer.addEventListener("mouseleave", hideDecorationPreview);

// Clear decorations
clearDecorationsBtn.addEventListener("click", () => {
  decorations.innerHTML = "";
  treeTopper.innerHTML = "";
  treeTopper.className = "tree-topper";
  document
    .querySelectorAll(".deco-btn, .topper-btn")
    .forEach((b) => b.classList.remove("active"));
  selectedDecoType = null;
});

// Tree customization - style buttons
document.querySelectorAll(".tree-style-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tree-style-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    treeConfig.type = btn.dataset.tree;
    generateTree();
  });
});

treeSizeSlider.addEventListener("input", (e) => {
  treeConfig.size = parseInt(e.target.value);
  treeSizeValue.textContent = `${treeConfig.size}%`;
  generateTree();
});

treeFullnessSlider.addEventListener("input", (e) => {
  treeConfig.fullness = parseInt(e.target.value);
  treeFullnessValue.textContent = `${treeConfig.fullness}%`;
  generateTree();
});

// Window resize handler for string lights
window.addEventListener("resize", () => {
  initStringLights();
});

// Snowfall scene
let currentSnowIntensity = "light";

const snowIntensities = {
  light: { count: 9, speeds: ["small", "medium"] },
  moderate: { count: 36, speeds: ["small", "medium", "large"] },
  flurry: { count: 72, speeds: ["small", "medium", "large"] },
  blizzard: { count: 180, speeds: ["small", "medium", "large"] },
};

function createSnowflake(size = "small") {
  const flake = document.createElementNS("http://www.w3.org/2000/svg", "g");
  flake.classList.add("snowflake-particle", size);

  const x = Math.random() * 200; // Full width of viewBox
  const delay = Math.random() * 5;
  const scale = size === "large" ? 1.2 : size === "medium" ? 0.8 : 0.5;

  // Use CSS custom property for horizontal position so animation doesn't override it
  flake.style.setProperty("--snow-x", `${x}px`);
  flake.style.animationDelay = `${delay}s`;

  // Create snowflake shape
  const shapes = [
    // Simple dot
    `<circle cx="${x}" cy="0" r="${3 * scale}" fill="#fff" opacity="0.9"/>`,
    // Star shape
    `<g transform="translate(${x}, 0)">
      <line x1="0" y1="${-5 * scale}" x2="0" y2="${
      5 * scale
    }" stroke="#fff" stroke-width="${1.5 * scale}"/>
      <line x1="${-5 * scale}" y1="0" x2="${
      5 * scale
    }" y2="0" stroke="#fff" stroke-width="${1.5 * scale}"/>
      <line x1="${-3.5 * scale}" y1="${-3.5 * scale}" x2="${3.5 * scale}" y2="${
      3.5 * scale
    }" stroke="#fff" stroke-width="${scale}"/>
      <line x1="${3.5 * scale}" y1="${-3.5 * scale}" x2="${-3.5 * scale}" y2="${
      3.5 * scale
    }" stroke="#fff" stroke-width="${scale}"/>
    </g>`,
    // Detailed flake
    `<g transform="translate(${x}, 0)">
      <circle cx="0" cy="0" r="${2 * scale}" fill="#fff"/>
      <line x1="0" y1="${-6 * scale}" x2="0" y2="${
      6 * scale
    }" stroke="#fff" stroke-width="${scale}"/>
      <line x1="${-6 * scale}" y1="0" x2="${
      6 * scale
    }" y2="0" stroke="#fff" stroke-width="${scale}"/>
      <circle cx="0" cy="${-5 * scale}" r="${1.5 * scale}" fill="#fff"/>
      <circle cx="0" cy="${5 * scale}" r="${1.5 * scale}" fill="#fff"/>
      <circle cx="${-5 * scale}" cy="0" r="${1.5 * scale}" fill="#fff"/>
      <circle cx="${5 * scale}" cy="0" r="${1.5 * scale}" fill="#fff"/>
    </g>`,
  ];

  const shapeIndex = Math.floor(Math.random() * shapes.length);
  // TODO: build snowflake geometry in a non innerHTML way... DOM methods or another approach?
  flake.innerHTML = shapes[shapeIndex];

  return flake;
}

// TODO: Resets each time, reapproach
function generateSnowflakes(intensity) {
  const snowGroup = document.getElementById("snowflakesGroup");
  const snowScene = document.getElementById("snowScene");

  if (!snowGroup || !snowScene) return;

  // Clear existing snowflakes
  snowGroup.innerHTML = "";

  // Update scene class for blizzard mode
  snowScene.classList.remove("blizzard");
  if (intensity === "blizzard") {
    snowScene.classList.add("blizzard");
  }

  const config = snowIntensities[intensity];

  for (let i = 0; i < config.count; i++) {
    const sizeIndex = Math.floor(Math.random() * config.speeds.length);
    const flake = createSnowflake(config.speeds[sizeIndex]);
    snowGroup.appendChild(flake);
  }
}

function initSnowfall() {
  const snowBtns = document.querySelectorAll(".snow-btn");

  snowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      snowBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSnowIntensity = btn.dataset.intensity;
      generateSnowflakes(currentSnowIntensity);
    });
  });

  // Generate initial snowflakes
  generateSnowflakes("light");
}

// Stocking scene
let stockingGiftsVisible = 0;

const giftSvgIcon =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><rect x="3" y="8" width="18" height="13" rx="2"/><rect x="6" y="4" width="12" height="4"/><rect x="10" y="8" width="4" height="13" fill="currentColor" opacity="0.6"/><path d="M8,4 Q12,1 16,4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
const starSvgIcon =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M12,1L9,9H2L7,14L5,22L12,17L19,22L17,14L22,9H15Z"/></svg>';

function initStocking() {
  const stuffBtn = document.getElementById("stuffStockingBtn");
  const gifts = document.querySelectorAll(".stocking-gifts .gift");

  if (!stuffBtn) return;

  // Initially empty stock with reset button
  stockingGiftsVisible = 0;
  gifts.forEach((gift) => {
    gift.classList.add("hidden");
    gift.classList.remove("visible");
  });
  stuffBtn.innerHTML = giftSvgIcon + " Stuff!";
  stuffBtn.style.background = "linear-gradient(135deg, #43a047, #2e7d32)";

  stuffBtn.addEventListener("click", () => {
    if (stockingGiftsVisible < gifts.length) {
      // Show next gift with animation
      const nextGift = gifts[stockingGiftsVisible];
      nextGift.classList.remove("hidden");
      nextGift.classList.add("visible");
      stockingGiftsVisible++;

      // Update button text with SVG present icon
      if (stockingGiftsVisible >= gifts.length) {
        stuffBtn.innerHTML = starSvgIcon + " Full!";
        stuffBtn.style.background = "linear-gradient(135deg, #c62828, #b71c1c)";
      }
    } else {
      // Reset - empty the stocking
      gifts.forEach((gift) => {
        gift.classList.remove("visible");
        gift.classList.add("hidden");
      });
      stockingGiftsVisible = 0;
      stuffBtn.innerHTML = giftSvgIcon + " Stuff!";
      stuffBtn.style.background = "linear-gradient(135deg, #43a047, #2e7d32)";
    }
  });
}

// Initialization
initStringLights();
initLightDimmer();
initMenorah();
initMiniMenorah();
initMenorahStyleSelector();
createDecorationPreview();
initSnowfall();
initStocking();
updateMenorahPreviewFlames();
document.body.dataset.mode = "hanukkah";
