// script.js

// 🍌 Sample data for test alerts
const locations = [
  "Palayam Bus Stand", "Mananchira Square", "Kozhikode Railway Station",
  "SM Street", "Mughadar Beach", "Kuttichira Junction",
  "Medical College Campus", "Beypore Port Area", "NIT Calicut Grounds"
];
const times = [
  "in 5 minutes", "right now", "as you read this",
  "during lunch hour", "at sunset", "precisely at 3:15 PM",
  "when the mosque calls for prayer", "during your next phone call"
];
const warnings = [
  "Take cover immediately!", "Hard hats recommended!",
  "Avoid standing under palm trees!", "Coconut trajectory detected!",
  "Previous victim lost their umbrella!", "This is not a drill!",
  "Local authorities notified!", "Multiple falls detected in area!"
];

let audioCtx, analyser, microphone, dataArray, bufferLength;
let isMonitoring = false;

document.addEventListener("DOMContentLoaded", () => {
  const micBtn  = document.getElementById("mic-btn");
  const testBtn = document.getElementById("test-btn");
  micBtn.addEventListener("click", startMicrophone);
  testBtn.addEventListener("click", generateRandomAlert);

  initVisualizer();
  resetAlertBox();
});

function initVisualizer() {
  const viz = document.getElementById("visualizer");
  const barCount = 60;
  const barWidth = viz.clientWidth / barCount;
  for (let i = 0; i < barCount; i++) {
    const bar = document.createElement("div");
    bar.className = "visualizer-bar";
    bar.style.left = `${i * barWidth}px`;
    bar.style.width = `${barWidth - 2}px`;
    viz.appendChild(bar);
  }
}

function resetAlertBox() {
  const box = document.getElementById("alert-box");
  box.className = "safe";
  box.innerHTML = `<span class="coconut-icon">🌴</span> Monitoring for coconut falls…`;
}

/**
 * Test alert with randomized details
 */
function generateRandomAlert() {
  const box = document.getElementById("alert-box");
  box.className = "warning";
  box.innerHTML = `
    <span class="coconut-icon">⚠️</span>
    COCONUT ALERT: Expected at <strong>${sample(locations)}</strong>
    <em>${sample(times)}</em>. ${sample(warnings)}
  `;
  setTimeout(() => {
    if (!box.classList.contains("danger")) resetAlertBox();
  }, 5000);
}

/**
 * Starts microphone-based monitoring
 */
async function startMicrophone() {
  if (isMonitoring) return;
  const micBtn = document.getElementById("mic-btn");
  const alertBox = document.getElementById("alert-box");
  
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alertBox.className = "danger";
    alertBox.textContent = "❌ getUserMedia not supported (HTTPS or file:// context needed)";
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    microphone = audioCtx.createMediaStreamSource(stream);
    microphone.connect(analyser);

    isMonitoring = true;
    micBtn.textContent = "Acoustic Monitoring Active";
    micBtn.disabled = true;

    alertBox.className = "safe";
    alertBox.innerHTML = `<span class="coconut-icon">🔊</span> Listening for coconut impacts…`;

    animateLoop();
  } catch (err) {
    alertBox.className = "danger";
    alertBox.innerHTML = `
      <span class="coconut-icon">❌</span>
      Microphone access denied: ${err.message}
    `;
  }
}

/**
 * Continuous loop for audio-monitoring + visualization
 */
function animateLoop() {
  if (!isMonitoring) return;
  analyser.getByteFrequencyData(dataArray);
  updateVisualizer(dataArray);

  const avg = average(dataArray);
  const threshold = 60;
  if (avg > threshold) handleRealCoconutFall();

  requestAnimationFrame(animateLoop);
}

function updateVisualizer(data) {
  const bars = document.querySelectorAll(".visualizer-bar");
  bars.forEach((bar, i) => {
    const idx = Math.floor((i / bars.length) * data.length);
    const v = data[idx] || 0;
    const h = (v / 255) * document.getElementById("visualizer").clientHeight;
    bar.style.height = `${h}px`;
    bar.style.backgroundColor = `hsl(${120 - (v / 2.55)}, 70%, 50%)`;
  });
}

function handleRealCoconutFall() {
  const box = document.getElementById("alert-box");
  if (box.classList.contains("danger")) return;

  box.className = "danger";
  box.innerHTML = `
    <span class="coconut-icon">🚨</span>
    <strong>COCONUT IMPACT DETECTED!</strong><br>
    Near <strong>${sample(locations)}</strong>. ${sample(warnings)}
  `;

  flashVisualizer();
  setTimeout(resetAlertBox, 5000);
}

function flashVisualizeri() {
  document.querySelectorAll(".visualizer-bar").forEach(bar => {
    bar.style.transition = "background-color 0.05s";
    bar.style.backgroundColor = "#c62828";
    setTimeout(() => bar.style.backgroundColor = "", 200);
  });
}

function average(arr) {
  let sum = 0;
  arr.forEach(v => sum += v);
  return sum / arr.length;
}

function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
