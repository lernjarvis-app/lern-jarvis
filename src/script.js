const notice = document.getElementById("notice");
let noticeTimeout = null;

const areaMessages = {
  belohnungen: "Sterne & Belohnungen folgen in einem späteren Schritt.",
  antolin: "Antolin & ANTON folgen in einem späteren Schritt.",
  gewohnheiten: "Tägliche Gewohnheiten folgen in einem späteren Schritt.",
  eltern: "Der Elternbereich folgt in einem späteren Schritt.",
};

function showNotice(text) {
  notice.textContent = text;
  notice.classList.add("visible");
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    notice.classList.remove("visible");
  }, 2600);
}

/* ---------- Navigation: Ansichten mit Verlaufs-Stapel ---------- */

let navStack = ["view-dashboard"];
let aktuellesThema = null;

function renderView(id) {
  document.querySelectorAll(".view").forEach((view) => {
    view.hidden = view.id !== id;
  });
  if (id === "view-dashboard") {
    setzeHubOffen(false);
  } else if (id === "view-mathe-themen") {
    themenListeRendern("mathe", document.getElementById("mathe-themen-liste"));
  } else if (id === "view-deutsch-themen") {
    themenListeRendern("deutsch", document.getElementById("deutsch-themen-liste"));
  } else if (id === "view-thema") {
    themaAnsichtAktualisieren();
  }
}

function navigateTo(id) {
  navStack.push(id);
  renderView(id);
}

function navigateBack() {
  if (navStack.length > 1) {
    navStack.pop();
  }
  renderView(navStack[navStack.length - 1]);
}

function zurueckZumThema() {
  const idx = navStack.lastIndexOf("view-thema");
  if (idx !== -1) {
    navStack = navStack.slice(0, idx + 1);
  }
  renderView("view-thema");
}

document.querySelectorAll(".area-card, .hub-menu-item").forEach((card) => {
  card.addEventListener("click", () => {
    const nav = card.dataset.nav;
    if (nav) {
      navigateTo(nav);
      return;
    }
    const area = card.dataset.area;
    showNotice(areaMessages[area] ?? "Dieser Bereich folgt in einem späteren Schritt.");
  });
});

document.querySelectorAll(".back-button").forEach((btn) => {
  btn.addEventListener("click", () => navigateBack());
});

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

/* ---------- Themenkatalog: Kacheln, Themen-Startseite ---------- */

// Für Themen, die es schon vor der Themen-id in den gespeicherten Daten gab,
// damit frühere Übungsdurchläufe weiterhin mitgezählt werden.
const LEGACY_THEMA_TITEL = {
  "deutsch-grossklein": "Groß- & Kleinschreibung",
};

function zaehleUebungen(thema) {
  const legacyTitel = LEGACY_THEMA_TITEL[thema.id];
  return fortschritt.missionen.filter((m) => {
    if (m.themaId) return m.themaId === thema.id;
    return m.thema === thema.titel || (legacyTitel && m.thema === legacyTitel);
  }).length;
}

function themenListeRendern(fach, container) {
  if (!container) return;
  container.innerHTML = "";
  const katalog = (window.LernJarvisKatalog || []).filter((k) => k.fach === fach);
  katalog.forEach((eintrag) => {
    container.appendChild(erzeugeThemenKachel(eintrag));
  });
}

function erzeugeThemenKachel(katalogEintrag) {
  const inhalt = (window.LernJarvisThemen || []).find((t) => t.id === katalogEintrag.id);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "area-card thema-kachel";

  const label = document.createElement("span");
  label.className = "area-label";
  label.textContent = katalogEintrag.titel;

  const sub = document.createElement("span");
  sub.className = "area-sub";

  if (inhalt) {
    const anzahl = zaehleUebungen(inhalt);
    sub.textContent = anzahl > 0 ? `${anzahl}× geübt` : "Antippen zum Start";
    btn.addEventListener("click", () => themaOeffnen(inhalt));
  } else {
    btn.classList.add("thema-kachel-bald");
    btn.disabled = true;
    sub.textContent = "Bald verfügbar";
  }

  btn.append(label, sub);
  return btn;
}

function themaOeffnen(inhalt) {
  aktuellesThema = inhalt;
  navigateTo("view-thema");
}

function themaAnsichtAktualisieren() {
  if (!aktuellesThema) return;
  document.getElementById("thema-titel").textContent = aktuellesThema.titel;
  const anzahl = zaehleUebungen(aktuellesThema);
  document.getElementById("thema-geuebt").textContent =
    anzahl > 0 ? `${anzahl}× geübt` : "Noch nicht geübt";
}

document.getElementById("thema-erklaeren-button").addEventListener("click", () => {
  erklaerungStarten();
});
document.getElementById("thema-ueben-button").addEventListener("click", () => {
  starteUebung(aktuellesThema);
});

/* ---------- Erklärung: Schritt für Schritt mit Zwischenfrage ---------- */

let erklaerungSchrittIndex = 0;

document.getElementById("erklaerung-zurueck-button").addEventListener("click", () => {
  erklaerungZurueck();
});

function erklaerungStarten() {
  erklaerungSchrittIndex = 0;
  navigateTo("view-erklaerung");
  erklaerungSchrittRendern();
}

function erklaerungZurueck() {
  if (erklaerungSchrittIndex > 0) {
    erklaerungSchrittIndex -= 1;
    erklaerungSchrittRendern();
  } else {
    navigateBack();
  }
}

function erklaerungSchrittRendern() {
  const schritte = aktuellesThema.erklaerung;
  const schritt = schritte[erklaerungSchrittIndex];
  const container = document.getElementById("erklaerung-inhalt");

  document.getElementById("erklaerung-fortschritt").textContent =
    `Schritt ${erklaerungSchrittIndex + 1} von ${schritte.length}`;

  container.innerHTML = "";

  const text = document.createElement("p");
  text.className = "erklaerung-text";
  text.textContent = schritt.text;
  container.appendChild(text);

  if (schritt.beispiel) {
    const beispiel = document.createElement("p");
    beispiel.className = "erklaerung-beispiel";
    beispiel.textContent = "Beispiel: " + schritt.beispiel;
    container.appendChild(beispiel);
  }

  if (schritt.frage) {
    const frageEl = document.createElement("p");
    frageEl.className = "erklaerung-frage";
    frageEl.textContent = schritt.frage.text;
    container.appendChild(frageEl);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "option-grid";

    const rueckmeldung = document.createElement("p");
    rueckmeldung.className = "exercise-feedback";

    schritt.frage.optionen.forEach((optionText, index) => {
      const optBtn = document.createElement("button");
      optBtn.type = "button";
      optBtn.className = "option-button";
      optBtn.textContent = optionText;
      optBtn.addEventListener("click", () => {
        optionsWrap.querySelectorAll(".option-button").forEach((b) => {
          b.disabled = true;
        });
        const istRichtig = index === schritt.frage.richtig;
        optBtn.classList.add(istRichtig ? "correct" : "incorrect");
        rueckmeldung.textContent = istRichtig
          ? schritt.frage.rueckmeldungRichtig
          : schritt.frage.rueckmeldungFalsch;
        rueckmeldung.className =
          "exercise-feedback " + (istRichtig ? "feedback-correct" : "feedback-incorrect");
      });
      optionsWrap.appendChild(optBtn);
    });

    container.appendChild(optionsWrap);
    container.appendChild(rueckmeldung);
  }

  const nav = document.createElement("div");
  nav.className = "erklaerung-nav";

  const istLetzterSchritt = erklaerungSchrittIndex === schritte.length - 1;
  const weiterBtn = document.createElement("button");
  weiterBtn.type = "button";
  weiterBtn.className = "next-button";
  weiterBtn.textContent = istLetzterSchritt ? "Jetzt üben" : "Weiter";
  weiterBtn.addEventListener("click", () => {
    if (istLetzterSchritt) {
      starteUebung(aktuellesThema);
    } else {
      erklaerungSchrittIndex += 1;
      erklaerungSchrittRendern();
    }
  });
  nav.appendChild(weiterBtn);
  container.appendChild(nav);
}

/* ---------- Übung: gemeinsamer Zustand und Abschluss ---------- */

let missionXP = [];
let missionStartXP = 0;

function starteUebung(thema) {
  if (!thema) return;
  if (thema.uebung.typ === "liste") {
    starteListenUebung(thema);
  } else if (thema.uebung.typ === "generator" && thema.uebung.generatorId === "einmaleins") {
    navigateTo("view-einmaleins-auswahl");
  }
}

function missionAbschliessen(thema) {
  const missionsbonus = berechneMissionsbonus(true);
  fortschritt.gesamtXP = addiereXP(fortschritt.gesamtXP, missionsbonus);
  fortschritt.missionen.push({
    datum: new Date().toISOString().slice(0, 10),
    fach: thema.fach,
    thema: thema.titel,
    themaId: thema.id,
    aufgabenXP: [...missionXP],
    missionsbonus,
  });
  speichereFortschritt(fortschritt);

  const levelVorher = berechneLevel(missionStartXP);
  const levelInfoNachher = berechneLevelInfo(fortschritt.gesamtXP);
  aktualisiereKopfzeile();

  return { missionsbonus, levelVorher, levelInfoNachher };
}

function renderAbschluss(container, ueberschrift, unterzeile, zurueckAktion) {
  const { missionsbonus, levelVorher, levelInfoNachher } = missionAbschliessen(aktuellesThema);

  container.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "exercise-complete";

  const heading = document.createElement("p");
  heading.className = "exercise-complete-heading";
  heading.textContent = ueberschrift;

  const sub = document.createElement("p");
  sub.className = "exercise-complete-sub";
  sub.textContent = unterzeile;

  const summaryList = document.createElement("ul");
  summaryList.className = "mission-summary";

  missionXP.forEach((xp, index) => {
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
  backBtn.textContent = "Zurück zum Thema";
  backBtn.addEventListener("click", zurueckAktion);

  wrap.append(heading, sub, summaryList);

  if (levelInfoNachher.level > levelVorher) {
    const levelUp = document.createElement("p");
    levelUp.className = "level-up-message";
    levelUp.textContent = `Herzlichen Glückwunsch – du bist jetzt Level ${levelInfoNachher.level}: ${levelInfoNachher.name}!`;
    wrap.appendChild(levelUp);
  }

  wrap.appendChild(backBtn);
  container.appendChild(wrap);
}

/* ---------- Übung (Typ "liste"): Multiple-Choice-Aufgaben ---------- */

let aktuelleUebungAufgaben = [];
let aktuellerAufgabenIndex = 0;
let aufgabeGeloest = false;
let aufgabeFalschVersucht = false;

function starteListenUebung(thema) {
  document.getElementById("uebung-titel").textContent = thema.titel;
  aktuelleUebungAufgaben = thema.uebung.aufgaben;
  aktuellerAufgabenIndex = 0;
  missionXP = [];
  missionStartXP = fortschritt.gesamtXP;
  navigateTo("view-uebung");
  listenAufgabeRendern();
}

function listenAufgabeRendern() {
  const container = document.getElementById("uebung-exercise-content");

  if (aktuellerAufgabenIndex >= aktuelleUebungAufgaben.length) {
    renderAbschluss(
      container,
      "Super gemacht!",
      `Du hast alle Aufgaben zu „${aktuellesThema.titel}“ geschafft.`,
      zurueckZumThema
    );
    return;
  }

  const aufgabe = aktuelleUebungAufgaben[aktuellerAufgabenIndex];
  aufgabeGeloest = false;
  aufgabeFalschVersucht = false;

  container.innerHTML = "";

  const progress = document.createElement("p");
  progress.className = "exercise-progress";
  progress.textContent = `Aufgabe ${aktuellerAufgabenIndex + 1} von ${aktuelleUebungAufgaben.length}`;

  const prompt = document.createElement("p");
  prompt.className = "exercise-prompt";
  prompt.textContent = aufgabe.prompt;

  const optionsWrap = document.createElement("div");
  optionsWrap.className = "option-grid";

  aufgabe.options.forEach((optionText, index) => {
    const optionBtn = document.createElement("button");
    optionBtn.type = "button";
    optionBtn.className = "option-button";
    optionBtn.textContent = optionText;
    optionBtn.addEventListener("click", () => listenAntwortPruefen(index, optionBtn));
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
    aktuellerAufgabenIndex === aktuelleUebungAufgaben.length - 1 ? "Fertig" : "Nächste Aufgabe";
  nextBtn.hidden = true;
  nextBtn.addEventListener("click", () => {
    aktuellerAufgabenIndex += 1;
    listenAufgabeRendern();
  });

  container.append(progress, prompt, optionsWrap, feedback, xpFeedback, nextBtn);
}

function listenAntwortPruefen(selectedIndex, buttonEl) {
  if (aufgabeGeloest) return;

  const aufgabe = aktuelleUebungAufgaben[aktuellerAufgabenIndex];
  const feedback = document.getElementById("exercise-feedback");
  const xpFeedback = document.getElementById("xp-feedback");
  const nextBtn = document.getElementById("next-task-button");

  if (selectedIndex === aufgabe.correct) {
    aufgabeGeloest = true;
    buttonEl.classList.add("correct");
    feedback.textContent = `Richtig! ${aufgabe.explanation}`;
    feedback.className = "exercise-feedback feedback-correct";
    document
      .querySelectorAll("#uebung-exercise-content .option-button")
      .forEach((b) => (b.disabled = true));

    const ersterVersuchRichtig = !aufgabeFalschVersucht;
    const xp = berechneAufgabenXP(ersterVersuchRichtig);
    missionXP.push(xp);
    fortschritt.gesamtXP = addiereXP(fortschritt.gesamtXP, xp);
    speichereFortschritt(fortschritt);
    aktualisiereKopfzeile();

    xpFeedback.textContent = ersterVersuchRichtig
      ? `+${xp} XP – beim ersten Versuch richtig`
      : `+${xp} XP – richtig nach einer Korrektur`;

    nextBtn.hidden = false;
  } else {
    aufgabeFalschVersucht = true;
    buttonEl.classList.add("incorrect");
    buttonEl.disabled = true;
    feedback.textContent = "Das ist noch nicht ganz richtig. Versuch es gern noch einmal.";
    feedback.className = "exercise-feedback feedback-incorrect";
  }
}

/* ---------- Übung (Typ "generator"): Einmaleins ---------- */

const reihenGrid = document.getElementById("reihen-grid");

function reihenAuswahlRendern() {
  if (!reihenGrid) return;
  reihenGrid.innerHTML = "";
  for (let r = 1; r <= 10; r++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "reihe-button";
    btn.textContent = `${r}er`;
    btn.addEventListener("click", () => einmaleinsStarten(String(r)));
    reihenGrid.appendChild(btn);
  }
  const gemischtBtn = document.createElement("button");
  gemischtBtn.type = "button";
  gemischtBtn.className = "reihe-button reihe-button-gemischt";
  gemischtBtn.textContent = "Gemischt";
  gemischtBtn.addEventListener("click", () => einmaleinsStarten("gemischt"));
  reihenGrid.appendChild(gemischtBtn);
}
reihenAuswahlRendern();

let einmaleinsAufgaben = [];
let einmaleinsIndex = 0;
let einmaleinsEingabe = "";
let einmaleinsFalscheVersuche = 0;
let einmaleinsGeloest = false;

function einmaleinsStarten(auswahl) {
  einmaleinsAufgaben = erzeugeEinmaleinsAufgaben(auswahl);
  einmaleinsIndex = 0;
  missionXP = [];
  missionStartXP = fortschritt.gesamtXP;
  navigateTo("view-einmaleins-uebung");
  einmaleinsAufgabeRendern();
}

function einmaleinsAufgabeRendern() {
  const container = document.getElementById("einmaleins-exercise-content");

  if (einmaleinsIndex >= einmaleinsAufgaben.length) {
    renderAbschluss(
      container,
      "Super gemacht!",
      "Du hast die Einmaleins-Mission geschafft.",
      zurueckZumThema
    );
    return;
  }

  const aufgabe = einmaleinsAufgaben[einmaleinsIndex];
  einmaleinsEingabe = "";
  einmaleinsFalscheVersuche = 0;
  einmaleinsGeloest = false;

  container.innerHTML = "";

  const progress = document.createElement("p");
  progress.className = "exercise-progress";
  progress.textContent = `Aufgabe ${einmaleinsIndex + 1} von ${einmaleinsAufgaben.length}`;

  const prompt = document.createElement("p");
  prompt.className = "exercise-prompt";
  prompt.textContent = `${aufgabe.faktor1} · ${aufgabe.faktor2} = ?`;

  const anzeige = document.createElement("div");
  anzeige.className = "pad-display";
  anzeige.id = "pad-display";
  anzeige.textContent = "_";

  const padGrid = document.createElement("div");
  padGrid.className = "pad-grid";

  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((ziffer) => {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "pad-key";
    key.textContent = String(ziffer);
    key.addEventListener("click", () => padZifferEingeben(ziffer));
    padGrid.appendChild(key);
  });

  const loeschenBtn = document.createElement("button");
  loeschenBtn.type = "button";
  loeschenBtn.className = "pad-key pad-key-aktion";
  loeschenBtn.textContent = "Löschen";
  loeschenBtn.addEventListener("click", padLoeschen);
  padGrid.appendChild(loeschenBtn);

  const nullKey = document.createElement("button");
  nullKey.type = "button";
  nullKey.className = "pad-key";
  nullKey.textContent = "0";
  nullKey.addEventListener("click", () => padZifferEingeben(0));
  padGrid.appendChild(nullKey);

  const fertigBtn = document.createElement("button");
  fertigBtn.type = "button";
  fertigBtn.className = "pad-key pad-key-aktion pad-key-fertig";
  fertigBtn.textContent = "Fertig";
  fertigBtn.addEventListener("click", padFertig);
  padGrid.appendChild(fertigBtn);

  const feedback = document.createElement("p");
  feedback.className = "exercise-feedback";
  feedback.id = "einmaleins-feedback";

  const xpFeedback = document.createElement("p");
  xpFeedback.className = "xp-feedback";
  xpFeedback.id = "einmaleins-xp-feedback";

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "next-button";
  nextBtn.id = "einmaleins-next-button";
  nextBtn.textContent =
    einmaleinsIndex === einmaleinsAufgaben.length - 1 ? "Zur Auswertung" : "Weiter";
  nextBtn.hidden = true;
  nextBtn.addEventListener("click", () => {
    einmaleinsIndex += 1;
    einmaleinsAufgabeRendern();
  });

  container.append(progress, prompt, anzeige, padGrid, feedback, xpFeedback, nextBtn);
}

function padAnzeigeAktualisieren() {
  const anzeige = document.getElementById("pad-display");
  if (!anzeige) return;
  anzeige.textContent = einmaleinsEingabe.length > 0 ? einmaleinsEingabe : "_";
}

function padZifferEingeben(ziffer) {
  if (einmaleinsGeloest) return;
  if (einmaleinsEingabe.length >= 3) return;
  einmaleinsEingabe += String(ziffer);
  padAnzeigeAktualisieren();
}

function padLoeschen() {
  if (einmaleinsGeloest) return;
  einmaleinsEingabe = einmaleinsEingabe.slice(0, -1);
  padAnzeigeAktualisieren();
}

function padTastenSperren() {
  document.querySelectorAll(".pad-key").forEach((k) => (k.disabled = true));
}

function padFertig() {
  if (einmaleinsGeloest) return;
  if (einmaleinsEingabe.length === 0) return;

  const aufgabe = einmaleinsAufgaben[einmaleinsIndex];
  const eingegebeneZahl = Number(einmaleinsEingabe);
  const feedback = document.getElementById("einmaleins-feedback");
  const xpFeedback = document.getElementById("einmaleins-xp-feedback");
  const nextBtn = document.getElementById("einmaleins-next-button");

  if (eingegebeneZahl === aufgabe.ergebnis) {
    einmaleinsGeloest = true;
    const ersterVersuchRichtig = einmaleinsFalscheVersuche === 0;
    const xp = berechneAufgabenXP(ersterVersuchRichtig);
    missionXP.push(xp);
    fortschritt.gesamtXP = addiereXP(fortschritt.gesamtXP, xp);
    speichereFortschritt(fortschritt);
    aktualisiereKopfzeile();

    feedback.textContent = "Richtig!";
    feedback.className = "exercise-feedback feedback-correct";
    xpFeedback.textContent = ersterVersuchRichtig
      ? `+${xp} XP – beim ersten Versuch richtig`
      : `+${xp} XP – richtig nach einer Korrektur`;
    padTastenSperren();
    nextBtn.hidden = false;
    return;
  }

  einmaleinsFalscheVersuche += 1;

  if (einmaleinsFalscheVersuche >= 3) {
    einmaleinsGeloest = true;
    // Keine XP, wenn die Lösung nach 3 Fehlversuchen gezeigt wird.
    missionXP.push(0);

    feedback.textContent = `Kein Problem – die Lösung ist ${aufgabe.ergebnis}. ${aufgabe.faktor1} · ${aufgabe.faktor2} bedeutet ${aufgabe.faktor1} Gruppen mit je ${aufgabe.faktor2}, zusammen ${aufgabe.ergebnis}.`;
    feedback.className = "exercise-feedback feedback-incorrect";
    xpFeedback.textContent = "+0 XP – kein Problem, auf zur nächsten Aufgabe!";
    padTastenSperren();
    nextBtn.hidden = false;
  } else {
    feedback.textContent = erzeugeEinmaleinsTipp(aufgabe.faktor1, aufgabe.faktor2);
    feedback.className = "exercise-feedback feedback-incorrect";
    einmaleinsEingabe = "";
    padAnzeigeAktualisieren();
  }
}
