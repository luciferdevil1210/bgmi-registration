const yearEl = document.getElementById("year");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("main-nav");
const startGestureBtn = document.getElementById("startGestureBtn");
const stopGestureBtn = document.getElementById("stopGestureBtn");
const gestureVideo = document.getElementById("gestureVideo");
const gestureCanvas = document.getElementById("gestureCanvas");
const permissionCard = document.getElementById("permissionCard");
const gestureStatus = document.getElementById("gestureStatus");
const currentGesture = document.getElementById("currentGesture");
const currentAction = document.getElementById("currentAction");
const gestureConfidence = document.getElementById("gestureConfidence");
const commandLog = document.getElementById("commandLog");
const virtualCursor = document.getElementById("virtualCursor");
const fileBrowser = document.getElementById("fileBrowser");
const gestureText = document.getElementById("gestureText");
const quickActions = document.getElementById("quickActions");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
}

const gestureState = {
  camera: null,
  hands: null,
  isRunning: false,
  lastClickAt: 0,
  lastCommandAt: 0,
  lastScrollY: null,
  cursorX: window.innerWidth / 2,
  cursorY: window.innerHeight / 2,
  selectedFile: "Projects folder",
};

const fingerTips = [8, 12, 16, 20];
const fingerPips = [6, 10, 14, 18];

const addLog = (message) => {
  if (!commandLog) {
    return;
  }

  const item = document.createElement("li");
  item.textContent = `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · ${message}`;
  commandLog.prepend(item);

  while (commandLog.children.length > 6) {
    commandLog.lastElementChild.remove();
  }
};

const updateDashboard = (gesture, action, confidence = 0) => {
  if (currentGesture) currentGesture.textContent = gesture;
  if (currentAction) currentAction.textContent = action;
  if (gestureConfidence) gestureConfidence.textContent = `${Math.round(confidence * 100)}%`;
};

const setStatus = (message) => {
  if (gestureStatus) {
    gestureStatus.textContent = message;
  }
};

const selectFile = (button) => {
  if (!button || !fileBrowser) {
    return;
  }

  fileBrowser.querySelectorAll(".file-item").forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
  gestureState.selectedFile = button.dataset.file || button.textContent.trim();
  addLog(`Selected ${gestureState.selectedFile}.`);
};

if (fileBrowser) {
  fileBrowser.querySelectorAll(".file-item").forEach((button, index) => {
    if (index === 0) {
      button.classList.add("is-selected");
    }

    button.addEventListener("click", () => selectFile(button));
  });
}

const runCommand = (command) => {
  const selected = gestureState.selectedFile || "selected item";
  const commandMessages = {
    open: `Opened ${selected}.`,
    rename: `Rename mode started for ${selected}.`,
    copy: `Copied ${selected}.`,
    delete: `Moved ${selected} to trash in the demo workspace.`,
    type: "Inserted gesture-controlled text.",
    selectAll: "Selected all text in the gesture text pad.",
  };

  if (command === "type" && gestureText) {
    gestureText.value += `${gestureText.value ? "\n" : ""}Typed by hand gesture control.`;
    gestureText.focus();
  }

  if (command === "selectAll" && gestureText) {
    gestureText.focus();
    gestureText.select();
  }

  addLog(commandMessages[command] || "Ran gesture command.");
};

if (quickActions) {
  quickActions.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-command]");
    if (button) {
      runCommand(button.dataset.command);
    }
  });
}

const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

const getRaisedFingers = (landmarks) => {
  const raised = fingerTips.map((tip, index) => landmarks[tip].y < landmarks[fingerPips[index]].y);
  const thumbRaised = landmarks[4].x < landmarks[3].x;
  return [thumbRaised, ...raised];
};

const classifyGesture = (landmarks) => {
  const raised = getRaisedFingers(landmarks);
  const raisedCount = raised.filter(Boolean).length;
  const pinchDistance = getDistance(landmarks[4], landmarks[8]);

  if (pinchDistance < 0.055) return { name: "Pinch", action: "Click", confidence: 0.92 };
  if (raisedCount === 0) return { name: "Fist", action: "Open quick launcher", confidence: 0.86 };
  if (raised[1] && raised[2] && !raised[3] && !raised[4]) return { name: "Two fingers", action: "Scroll", confidence: 0.9 };
  if (raised[1] && raised[2] && raised[3] && !raised[4]) return { name: "Three fingers", action: "Run selected command", confidence: 0.88 };
  if (raisedCount >= 4) return { name: "Open palm", action: "Safe hover", confidence: 0.84 };
  if (raised[1]) return { name: "Point", action: "Move cursor", confidence: 0.89 };

  return { name: "Hand detected", action: "Analyzing", confidence: 0.7 };
};

const moveCursor = (landmark) => {
  const targetX = (1 - landmark.x) * window.innerWidth;
  const targetY = landmark.y * window.innerHeight;
  gestureState.cursorX += (targetX - gestureState.cursorX) * 0.35;
  gestureState.cursorY += (targetY - gestureState.cursorY) * 0.35;

  if (virtualCursor) {
    virtualCursor.style.transform = `translate(${gestureState.cursorX}px, ${gestureState.cursorY}px)`;
  }
};

const clickAtCursor = () => {
  const now = Date.now();
  if (now - gestureState.lastClickAt < 900) {
    return;
  }

  gestureState.lastClickAt = now;
  const target = document.elementFromPoint(gestureState.cursorX, gestureState.cursorY);
  const clickable = target?.closest("button, a, textarea, input, .file-item");

  if (clickable) {
    clickable.click();
    addLog(`Gesture click on ${clickable.textContent?.trim() || clickable.getAttribute("aria-label") || "screen item"}.`);
  } else {
    addLog("Gesture click on empty screen area.");
  }
};

const handleGestureAction = (gesture, landmarks) => {
  if (gesture.name === "Pinch") {
    clickAtCursor();
  }

  if (gesture.name === "Two fingers") {
    const y = landmarks[8].y;
    if (gestureState.lastScrollY !== null) {
      window.scrollBy({ top: (y - gestureState.lastScrollY) * 900, behavior: "smooth" });
    }
    gestureState.lastScrollY = y;
  } else {
    gestureState.lastScrollY = null;
  }

  if (gesture.name === "Fist") {
    document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (gesture.name === "Three fingers" && Date.now() - gestureState.lastCommandAt > 1200) {
    gestureState.lastCommandAt = Date.now();
    runCommand("type");
  }
};

const drawResults = (results) => {
  if (!gestureCanvas || !gestureVideo) {
    return;
  }

  const context = gestureCanvas.getContext("2d");
  gestureCanvas.width = gestureVideo.videoWidth || gestureCanvas.clientWidth;
  gestureCanvas.height = gestureVideo.videoHeight || gestureCanvas.clientHeight;
  context.clearRect(0, 0, gestureCanvas.width, gestureCanvas.height);

  if (window.drawConnectors && window.drawLandmarks && window.HAND_CONNECTIONS) {
    results.multiHandLandmarks?.forEach((landmarks) => {
      window.drawConnectors(context, landmarks, window.HAND_CONNECTIONS, { color: "#38bdf8", lineWidth: 3 });
      window.drawLandmarks(context, landmarks, { color: "#f97316", lineWidth: 1, radius: 3 });
    });
  }
};

const onHandResults = (results) => {
  drawResults(results);
  const landmarks = results.multiHandLandmarks?.[0];

  if (!landmarks) {
    updateDashboard("No hand", "Show your hand", 0);
    return;
  }

  moveCursor(landmarks[8]);
  const gesture = classifyGesture(landmarks);
  updateDashboard(gesture.name, gesture.action, gesture.confidence);
  handleGestureAction(gesture, landmarks);
};

const startGestureControl = async () => {
  if (!gestureVideo || !gestureCanvas || !window.Hands || !window.Camera) {
    setStatus("Gesture libraries are still loading. Try again in a moment.");
    return;
  }

  try {
    gestureState.hands = new window.Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    gestureState.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });
    gestureState.hands.onResults(onHandResults);

    gestureState.camera = new window.Camera(gestureVideo, {
      onFrame: async () => gestureState.hands.send({ image: gestureVideo }),
      width: 960,
      height: 540,
    });

    await gestureState.camera.start();
    gestureState.isRunning = true;
    startGestureBtn.disabled = true;
    stopGestureBtn.disabled = false;
    permissionCard?.classList.add("is-hidden");
    virtualCursor?.classList.add("is-active");
    setStatus("Tracking started. Point with your index finger to move the cursor.");
    addLog("Camera tracking started.");
  } catch (error) {
    setStatus("Camera could not start. Check browser permissions and HTTPS/localhost access.");
    addLog(`Camera error: ${error.message}`);
  }
};

const stopGestureControl = () => {
  gestureState.camera?.stop();
  gestureState.hands?.close();
  gestureState.camera = null;
  gestureState.hands = null;
  gestureState.isRunning = false;
  startGestureBtn.disabled = false;
  stopGestureBtn.disabled = true;
  permissionCard?.classList.remove("is-hidden");
  virtualCursor?.classList.remove("is-active");
  updateDashboard("Idle", "Stopped", 0);
  setStatus("Tracking stopped.");
  addLog("Camera tracking stopped.");
};

startGestureBtn?.addEventListener("click", startGestureControl);
stopGestureBtn?.addEventListener("click", stopGestureControl);
