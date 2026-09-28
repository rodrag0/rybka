(function () {
  "use strict";

  const terminal = document.querySelector("#terminal");
  const cursor = document.querySelector("#terminal-cursor");
  const terminalStatus = document.querySelector("#terminal-status");
  const screenReaderStatus = document.querySelector("#screen-reader-status");
  const portraitSection = document.querySelector("#portrait-section");
  const messages = document.querySelector("#messages");
  const choices = document.querySelector("#choices");
  const choiceArena = document.querySelector("#choice-arena");
  const yesButton = document.querySelector("#yes-button");
  const wrongButton = document.querySelector("#wrong-button");
  const ending = document.querySelector("#ending");
  const skipButton = document.querySelector("#skip-button");
  const skipLink = document.querySelector(".skip-link");
  const motionButton = document.querySelector("#motion-button");
  const replayButton = document.querySelector("#replay-button");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const matrix = new window.MatrixReveal({
    viewport: document.querySelector("#portrait-viewport"),
    scaleLayer: document.querySelector("#portrait-scale"),
    mask: document.querySelector("#portrait-mask"),
    frame: document.querySelector("#portrait-frame"),
    canvas: document.querySelector("#matrix-canvas"),
    signal: document.querySelector("#signal-value"),
    error: document.querySelector("#portrait-error")
  });

  let runId = 0;
  let portraitLoaded = false;
  let evasionCount = 0;
  let choiceBusy = false;
  let digitsPaused = false;
  let suppressWrongClick = false;
  let suppressWrongClickTimer = 0;

  const mainCopy = [
    ["baby", 360],
    ["I miss you", 620],
    ["yes I know you're literally\nin the building next to me", 760],
    ["shut up", 380],
    ["I still miss you 😭", 920],
    ["like actually what did you do to me hahaha", 720],
    ["I see you all the fucking time\nand somehow I'm here missing you again", 920],
    ["so yeah", 520],
   ["I made you a fucking website\ninstead of walking to the next building but tbf you are in a boring workshop", 920],
    ["very normal 👍🏽", 0]
  ];

  function wait(milliseconds) {
    const duration = reducedMotion ? Math.min(milliseconds, 45) : milliseconds;
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function announce(text) {
    screenReaderStatus.textContent = text;
  }

  function clearTerminal() {
    terminal.querySelectorAll(".terminal-line").forEach((line) => line.remove());
  }

  function addTerminalLineInstant(text, alert = false) {
    const line = document.createElement("p");
    line.className = `terminal-line${alert ? " terminal-line--alert" : ""}`;
    line.textContent = text || "\u00a0";
    terminal.insertBefore(line, cursor);
    return line;
  }

  async function typeTerminalLine(text, id, options = {}) {
    if (id !== runId) return false;

    const line = addTerminalLineInstant("", options.alert);
    if (reducedMotion || options.instant) {
      line.textContent = text || "\u00a0";
      return id === runId;
    }

    line.textContent = "";
    const speed = options.speed || 28;
    for (const character of text) {
      if (id !== runId) return false;
      line.textContent += character;
      await wait(speed + Math.random() * 18);
    }
    return id === runId;
  }

  function appendMessage(container, text, modifier = "") {
    const message = document.createElement("p");
    message.className = `message${modifier ? ` message--${modifier}` : ""}`;
    message.textContent = text;
    container.append(message);
    return message;
  }

  async function showMainMessages(id, instant = false) {
    for (const [text, delayAfter] of mainCopy) {
      if (id !== runId) return false;
      appendMessage(messages, text);
      if (!instant) await wait(delayAfter);
    }
    return id === runId;
  }

  function resetWrongButton() {
    evasionCount = 0;
    suppressWrongClick = false;
    window.clearTimeout(suppressWrongClickTimer);
    wrongButton.textContent = "sounds like a you problem";
    wrongButton.classList.remove("is-escaping");
    wrongButton.style.removeProperty("--escape-x");
    wrongButton.style.removeProperty("--escape-y");
  }

  function resetExperience() {
    clearTerminal();
    messages.replaceChildren();
    ending.replaceChildren();
    choices.hidden = true;
    replayButton.hidden = true;
    skipButton.hidden = false;
    portraitSection.classList.remove("is-visible");
    terminalStatus.textContent = "running";
    choiceBusy = false;
    digitsPaused = false;
    motionButton.textContent = "pause digits";
    motionButton.setAttribute("aria-pressed", "false");
    resetWrongButton();
    matrix.reset();
  }

  async function ensurePortrait() {
    if (portraitLoaded) return true;
    portraitLoaded = await matrix.loadPortrait("assets/binary-portrait.html");
    return portraitLoaded;
  }

  async function runSequence() {
    runId += 1;
    const id = runId;
    resetExperience();
    await ensurePortrait();
    if (id !== runId) return;

    announce("Locating Rybka and calculating the unacceptable one-building distance.");

    if (!(await typeTerminalLine("> locating rybka...", id))) return;
    await wait(460);
    if (!(await typeTerminalLine("> found.", id))) return;
    addTerminalLineInstant("");
    await wait(520);

    if (!(await typeTerminalLine("> calculating distance...", id))) return;
    await wait(460);
    if (!(await typeTerminalLine("> ...", id))) return;
    await wait(620);
    if (!(await typeTerminalLine("> one building away.", id))) return;
    addTerminalLineInstant("");
    await wait(680);

    if (!(await typeTerminalLine("> acceptable distance?", id))) return;
    await wait(520);
    if (!(await typeTerminalLine("> no.", id, { alert: true }))) return;
    addTerminalLineInstant("");
    await wait(620);

    if (!(await typeTerminalLine("> problem detected.", id, { alert: true }))) return;
    await wait(420);
    if (!(await typeTerminalLine("> i miss you.", id, { alert: true }))) return;
    await wait(700);
    if (!(await typeTerminalLine("> attempting fix...", id))) return;
    await wait(420);
    if (!(await typeTerminalLine("> loading rybka...", id))) return;

    terminalStatus.textContent = "reconstructing";
    portraitSection.classList.add("is-visible");
    await wait(240);
    await matrix.reveal(3800);
    if (id !== runId) return;

    terminalStatus.textContent = "rybka found";
    skipButton.hidden = true;
    announce("Lisa's binary portrait has formed. I miss you, even though you are literally in the next building.");
    await wait(650);

    if (!(await showMainMessages(id))) return;
    showChoices();
  }

  function showChoices() {
    choices.hidden = false;
    choiceBusy = false;
    resetWrongButton();
    const targetTop = choices.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.28;
    window.scrollTo({ left: 0, top: Math.max(0, targetTop), behavior: reducedMotion ? "auto" : "smooth" });
    window.setTimeout(() => yesButton.focus({ preventScroll: true }), reducedMotion ? 0 : 450);
  }

  async function skipIntro(event) {
    if (event) event.preventDefault();
    runId += 1;
    const id = runId;
    resetExperience();
    await ensurePortrait();
    if (id !== runId) return;

    addTerminalLineInstant("> rybka found.");
    addTerminalLineInstant("> distance: one building.");
    addTerminalLineInstant("> still unacceptable.", true);
    terminalStatus.textContent = "skipped the dramatic bit";
    portraitSection.classList.add("is-visible");
    matrix.finishReveal();
    skipButton.hidden = true;
    await showMainMessages(id, true);
    showChoices();
  }

  function moveWrongButton() {
    if (reducedMotion || choiceBusy || choices.hidden) return;

    evasionCount += 1;
    wrongButton.classList.add("is-escaping");
    if (evasionCount >= 3) {
      wrongButton.textContent = "bitch 😒";
    }

    const arenaRect = choiceArena.getBoundingClientRect();
    const buttonRect = wrongButton.getBoundingClientRect();
    const maxX = Math.max(0, arenaRect.width - buttonRect.width);
    const maxY = Math.max(0, arenaRect.height - buttonRect.height);
    const x = Math.round(Math.random() * maxX);
    const y = Math.round(Math.random() * maxY);
    wrongButton.style.setProperty("--escape-x", `${x}px`);
    wrongButton.style.setProperty("--escape-y", `${y}px`);
  }

  async function chooseWrong() {
    if (choiceBusy) return;
    choiceBusy = true;
    choices.hidden = true;
    ending.replaceChildren();
    appendMessage(ending, "wow");
    await wait(620);
    appendMessage(ending, "fuck you too then");
    await wait(760);
    appendMessage(ending, "I still love you tho", "sincere");
    await wait(650);

    const tryAgain = document.createElement("button");
    tryAgain.type = "button";
    tryAgain.className = "important-button";
    tryAgain.textContent = "try again";
    tryAgain.addEventListener("click", () => {
      ending.replaceChildren();
      showChoices();
    }, { once: true });
    ending.append(tryAgain);
    replayButton.hidden = false;
    tryAgain.focus();
  }

  async function chooseYes() {
    if (choiceBusy) return;
    choiceBusy = true;
    const id = runId;
    choices.hidden = true;
    ending.replaceChildren();

    appendMessage(ending, "hehe");
    await wait(420);
    if (id !== runId) return;
    appendMessage(ending, "knew it");
    await wait(620);
    appendMessage(ending, "come say hi then 😌");
    await wait(520);
    appendMessage(ending, "distance: still unacceptable", "small");
    await wait(1000);
    appendMessage(ending, "also");
    await wait(520);
    appendMessage(ending, "I love you", "sincere");
    await wait(650);
    appendMessage(ending, "a lot", "sincere");
    await wait(650);
    appendMessage(ending, "come here 🫶🏽", "sincere");
    replayButton.hidden = false;
    announce("I love you a lot. Come here.");

    await wait(2600);
    if (id !== runId) return;
    const important = document.createElement("button");
    important.type = "button";
    important.className = "important-button";
    important.textContent = "important";
    important.addEventListener("click", async () => {
      important.disabled = true;
      important.hidden = true;
      appendMessage(ending, "send selfie please?");
      await wait(620);
      appendMessage(ending, "I miss you thanks");
    }, { once: true });
    ending.append(important);
  }

  yesButton.addEventListener("click", chooseYes);
  wrongButton.addEventListener("click", (event) => {
    if (suppressWrongClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressWrongClick = false;
      window.clearTimeout(suppressWrongClickTimer);
      return;
    }

    chooseWrong();
  });

  wrongButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") moveWrongButton();
  });

  wrongButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" && !reducedMotion && evasionCount < 3) {
      event.preventDefault();
      event.stopPropagation();
      suppressWrongClick = true;
      window.clearTimeout(suppressWrongClickTimer);
      suppressWrongClickTimer = window.setTimeout(() => {
        suppressWrongClick = false;
      }, 500);
      moveWrongButton();
    }
  });

  skipButton.addEventListener("click", skipIntro);
  skipLink.addEventListener("click", skipIntro);

  motionButton.addEventListener("click", () => {
    digitsPaused = !digitsPaused;
    matrix.setPaused(digitsPaused);
    motionButton.setAttribute("aria-pressed", String(digitsPaused));
    motionButton.textContent = digitsPaused ? "resume digits" : "pause digits";
  });

  replayButton.addEventListener("click", () => {
    window.scrollTo({ left: 0, top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    runSequence();
  });

  runSequence();
}());
