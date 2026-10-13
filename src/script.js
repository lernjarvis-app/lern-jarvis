const notice = document.getElementById("notice");
let noticeTimeout = null;

const areaMessages = {
  belohnungen: "Sterne & Belohnungen folgen in einem späteren Schritt.",
  antolin: "Antolin & ANTON folgen in einem späteren Schritt.",
  gewohnheiten: "Tägliche Gewohnheiten folgen in einem späteren Schritt.",
  eltern: "Der Elternbereich folgt in einem späteren Schritt.",
  mathe: "Mathematik folgt in einem späteren Schritt.",
  rechtschreibung: "Rechtschreibung folgt in einem späteren Schritt.",
  wortarten: "Wortarten folgen in einem späteren Schritt.",
  satzbau: "Satzbau & Satzzeichen folgen in einem späteren Schritt.",
  lesen: "Leseverständnis folgt in einem späteren Schritt.",
  schreiben: "Texte schreiben folgt in einem späteren Schritt.",
};

document.querySelectorAll(".area-card, .hub-menu-item").forEach((card) => {
  card.addEventListener("click", () => {
    const nav = card.dataset.nav;
    if (nav) {
      showView(nav);
      return;
    }
    const area = card.dataset.area;
    showNotice(areaMessages[area] ?? "Dieser Bereich folgt in einem späteren Schritt.");
  });
});

document.querySelectorAll(".back-button").forEach((btn) => {
  btn.addEventListener("click", () => showView(btn.dataset.back));
});

function showNotice(text) {
  notice.textContent = text;
  notice.classList.add("visible");
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    notice.classList.remove("visible");
  }, 2600);
}

function showView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.hidden = view.id !== id;
  });
  if (id === "view-deutsch-grossklein") {
    startExercise();
  }
  if (id === "view-dashboard") {
    setzeHubOffen(false);
  }
}

/* ---------- Jarvis-Hub: Öffnen/Schließen der Menü-Leitungen ---------- */

const hubEl = document.getElementById("hub");
const jarvisCoreButton = document.getElementById("jarvis-core-button");
const hubHint = document.getElementById("hub-hint");
const hubMenuItems = document.querySelectorAll(".hub-menu-item");

let hubOffen = false;

function setzeHubOffen(offen) {
  hubOffen = offen;
  hubEl.classList.toggle("open", offen);
  jarvisCoreButton.setAttribute("aria-expanded", String(offen));
  jarvisCoreButton.setAttribute(
    "aria-label",
    offen ? "Jarvis-Menü schließen" : "Jarvis-Menü öffnen"
  );
  hubHint.textContent = offen ? "✕ Schließen" : "Tippe auf Jarvis";
  hubHint.classList.toggle("is-open", offen);
  hubMenuItems.forEach((item) => {
    item.tabIndex = offen ? 0 : -1;
  });
}

jarvisCoreButton.addEventListener("click", () => setzeHubOffen(!hubOffen));
hubHint.addEventListener("click", () => setzeHubOffen(!hubOffen));

setzeHubOffen(false);

/* ---------- Fortschritt: Laden, Kopfzeile, Warnhinweise ---------- */

const headerLevelEl = document.getElementById("header-level");
const headerXpEl = document.getElementById("header-xp");
const headerSterneEl = document.getElementById("header-sterne");
const dataWarningEl = document.getElementById("data-warning");

const hudLevelEl = document.getElementById("hud-level");
const hudLevelNameEl = document.getElementById("hud-level-name");
const hudXpEl = document.getElementById("hud-xp");
const hudXpBarEl = document.getElementById("hud-xp-bar");
const hudXpSubEl = document.getElementById("hud-xp-sub");
const hudSterneEl = document.getElementById("hud-sterne");

const ladeErgebnis = ladeFortschritt();
let fortschritt = ladeErgebnis.daten;

if (ladeErgebnis.status === "defekt") {
  zeigeDatenWarnung(
    "Deine gespeicherten Lerndaten konnten nicht gelesen werden. Sie wurden sicherheitshalber aufbewahrt, du startest jetzt mit einem neuen, leeren Stand."
  );
} else if (ladeErgebnis.status === "kein_speicher") {
  zeigeDatenWarnung(
    "Der lokale Speicher ist in diesem Browser nicht verfügbar. Der Fortschritt bleibt nur bis zum Schließen dieser Seite erhalten."
  );
}

function zeigeDatenWarnung(text) {
  if (!dataWarningEl) return;
  dataWarningEl.textContent = text;
  dataWarningEl.hidden = false;
}

function aktualisiereKopfzeile() {
  const { level, name } = berechneLevelInfo(fortschritt.gesamtXP);
  const sterne = fortschritt.sterne ?? 0;

  headerLevelEl.textContent = `${level} – ${name}`;
  headerXpEl.textContent = String(fortschritt.gesamtXP);
  headerSterneEl.textContent = String(sterne);

  const xpImLevel = fortschritt.gesamtXP % 100;
  hudLevelEl.textContent = String(level);
  hudLevelNameEl.textContent = name;
  hudXpEl.textContent = String(fortschritt.gesamtXP);
  hudXpBarEl.style.width = `${xpImLevel}%`;
  hudXpSubEl.textContent = `${xpImLevel} / 100 bis Level ${level + 1}`;
  hudSterneEl.textContent = String(sterne);
}

aktualisiereKopfzeile();

/* ---------- Demo-Übung: Groß- & Kleinschreibung (ohne KI) ---------- */

const grossKleinTasks = [
  {
    prompt: "Welcher Satz ist richtig geschrieben?",
    options: [
      "die katze schläft auf dem sofa.",
      "Die katze schläft auf dem sofa.",
      "Die Katze schläft auf dem Sofa.",
    ],
    correct: 2,
    explanation:
      "Jeder Satz beginnt groß. „Katze“ und „Sofa“ sind Nomen – Nomen schreibt man immer groß.",
  },
  {
    prompt: "Welches Wort passt richtig geschrieben in die Lücke?\n„Am Morgen geht Max zur ___.“",
    options: ["schule", "Schule", "SchulE"],
    correct: 1,
    explanation: "„Schule“ ist ein Nomen. Nomen schreibt man immer mit großem Anfangsbuchstaben.",
  },
  {
    prompt: "Welcher Satzanfang ist richtig?",
    options: ["heute scheint die Sonne.", "Heute scheint die Sonne."],
    correct: 1,
    explanation: "Jeder neue Satz beginnt groß – auch wenn das erste Wort kein Nomen ist.",
  },
  {
    prompt: "Welcher Satz ist richtig geschrieben?",
    options: ["Der Ball ist Rot.", "Der Ball ist rot."],
    correct: 1,
    explanation:
      "„rot“ ist hier ein Eigenschaftswort (Adjektiv). Adjektive schreibt man klein, außer am Satzanfang.",
  },
  {
    prompt: "Welches Wort passt richtig geschrieben in die Lücke?\n„Max füttert seinen ___.“ (Haustier: Hund)",
    options: ["hund", "Hund"],
    correct: 1,
    explanation:
      "„Hund“ ist ein Nomen und wird großgeschrieben – egal an welcher Stelle im Satz es steht.",
  },
];

const exerciseContent = document.getElementById("exercise-content");

let currentTaskIndex = 0;
let currentTaskSolved = false;
let currentTaskWrongAttempt = false;
let aktuelleMissionXP = [];
let missionStartGesamtXP = 0;

function startExercise() {
  currentTaskIndex = 0;
  aktuelleMissionXP = [];
  missionStartGesamtXP = fortschritt.gesamtXP;
  renderTask();
}

function renderTask() {
  if (currentTaskIndex >= grossKleinTasks.length) {
    renderCompletion();
    return;
  }

  const task = grossKleinTasks[currentTaskIndex];
  currentTaskSolved = false;
  currentTaskWrongAttempt = false;

  exerciseContent.innerHTML = "";

  const progress = document.createElement("p");
  progress.className = "exercise-progress";
  progress.textContent = `Aufgabe ${currentTaskIndex + 1} von ${grossKleinTasks.length}`;

  const prompt = document.createElement("p");
  prompt.className = "exercise-prompt";
  prompt.textContent = task.prompt;

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "option-grid";

  task.options.forEach((optionText, index) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "option-button";
    optionBtn.textContent = optionText;
    optionBtn.addEventListener("click", () => handleAnswer(index, optionBtn));
    optionsWrap.appendChild(optionBtn);
  });

  const feedback = document.createElement("p");
  feedback.className = "exercise-feedback";
  feedback.id = "exercise-feedback";

  const xpFeedback = document.createElement("p");
  xpFeedback.className = "xp-feedback";
  xpFeedback.id = "xp-feedback";

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "next-button";
  nextBtn.id = "next-task-button";
  nextBtn.textContent =
    currentTaskIndex === grossKleinTasks.length - 1 ? "Fertig" : "Nächste Aufgabe";
  nextBtn.hidden = true;
  nextBtn.addEventListener("click", () => {
    currentTaskIndex += 1;
    renderTask();
  });

  exerciseContent.append(progress, prompt, optionsWrap, feedback, xpFeedback, nextBtn);
}

function handleAnswer(selectedIndex, buttonEl) {
  if (currentTaskSolved) return;

  const task = grossKleinTasks[currentTaskIndex];
  const feedback = document.getElementById("exercise-feedback");
  const xpFeedback = document.getElementById("xp-feedback");
  const nextBtn = document.getElementById("next-task-button");

  if (selectedIndex === task.correct) {
    currentTaskSolved = true;
    buttonEl.classList.add("correct");
    feedback.textContent = `Richtig! ${task.explanation}`;
    feedback.className = "exercise-feedback feedback-correct";
    exerciseContent.querySelectorAll(".option-button").forEach((b) => {
      b.disabled = true;
    });

    const ersterVersuchRichtig = !currentTaskWrongAttempt;
    const xp = berechneAufgabenXP(ersterVersuchRichtig);
    aktuelleMissionXP.push(xp);
    fortschritt.gesamtXP = addiereXP(fortschritt.gesamtXP, xp);
    speichereFortschritt(fortschritt);
    aktualisiereKopfzeile();

    xpFeedback.textContent = ersterVersuchRichtig
      ? `+${xp} XP – beim ersten Versuch richtig`
      : `+${xp} XP – richtig nach einer Korrektur`;

    nextBtn.hidden = false;
  } else {
    currentTaskWrongAttempt = true;
    buttonEl.classList.add("incorrect");
    buttonEl.disabled = true;
    feedback.textContent = "Das ist noch nicht ganz richtig. Versuch es gern noch einmal.";
    feedback.className = "exercise-feedback feedback-incorrect";
  }
}

function renderCompletion() {
  const missionsbonus = berechneMissionsbonus(true);
  fortschritt.gesamtXP = addiereXP(fortschritt.gesamtXP, missionsbonus);
  fortschritt.missionen.push({
    datum: new Date().toISOString().slice(0, 10),
    fach: "Deutsch",
    thema: "Groß- & Kleinschreibung",
    aufgabenXP: [...aktuelleMissionXP],
    missionsbonus,
  });
  speichereFortschritt(fortschritt);

  const levelVorher = berechneLevel(missionStartGesamtXP);
  const levelInfoNachher = berechneLevelInfo(fortschritt.gesamtXP);
  aktualisiereKopfzeile();

  exerciseContent.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "exercise-complete";

  const heading = document.createElement("p");
  heading.className = "exercise-complete-heading";
  heading.textContent = "Super gemacht!";

  const sub = document.createElement("p");
  sub.className = "exercise-complete-sub";
  sub.textContent = "Du hast alle Aufgaben zur Groß- und Kleinschreibung geschafft.";

  const summaryList = document.createElement("ul");
  summaryList.className = "mission-summary";

  aktuelleMissionXP.forEach((xp, index) => {
    const item = document.createElement("li");
    item.innerHTML = `Aufgabe ${index + 1}: <strong>+${xp} XP</strong>`;
    summaryList.appendChild(item);
  });

  const bonusItem = document.createElement("li");
  bonusItem.innerHTML = `Missionsbonus: <strong>+${missionsbonus} XP</strong>`;
  summaryList.appendChild(bonusItem);

  const totalItem = document.createElement("li");
  totalItem.className = "summary-highlight";
  totalItem.innerHTML = `Gesamt-XP: <strong>${fortschritt.gesamtXP}</strong>`;
  summaryList.appendChild(totalItem);

  const levelItem = document.createElement("li");
  levelItem.className = "summary-highlight";
  levelItem.innerHTML = `Level: <strong>${levelInfoNachher.level} – ${levelInfoNachher.name}</strong>`;
  summaryList.appendChild(levelItem);

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.className = "next-button";
  backBtn.textContent = "Zurück zu den Themen";
  backBtn.addEventListener("click", () => showView("view-deutsch-themen"));

  wrap.append(heading, sub, summaryList);

  if (levelInfoNachher.level > levelVorher) {
    const levelUp = document.createElement("p");
    levelUp.className = "level-up-message";
    levelUp.textContent = `Herzlichen Glückwunsch – du bist jetzt Level ${levelInfoNachher.level}: ${levelInfoNachher.name}!`;
    wrap.appendChild(levelUp);
  }

  wrap.appendChild(backBtn);
  exerciseContent.appendChild(wrap);
}
