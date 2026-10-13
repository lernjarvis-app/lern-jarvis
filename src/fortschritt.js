/*
 * Reine Berechnungs- und Speicherlogik für den Lernfortschritt (XP, Level).
 * Enthält bewusst keine DOM-Zugriffe, damit die Funktionen unabhängig von
 * der Oberfläche getestet werden können (z. B. mit "osascript -l JavaScript").
 * localStorage wird nur innerhalb von Funktionen verwendet, nie beim Laden
 * dieser Datei selbst.
 */

const FORTSCHRITT_STORAGE_KEY = "lernJarvis.v1";
const FORTSCHRITT_STORAGE_KEY_DEFEKT = "lernJarvis.v1.defekt";

const XP_ERSTER_VERSUCH_RICHTIG = 10;
const XP_SPAETER_RICHTIG = 5;
const XP_MISSIONSBONUS = 10;
const XP_MAX_PRO_AUFGABE = 15;

const LEVEL_NAMEN = {
  1: "Lernentdecker",
  2: "Schlaukopf",
  3: "Wissensheld",
  4: "Aufgabenprofi",
  5: "Meisterdenker",
  6: "Lernchampion",
  7: "Superhirn",
  8: "Jarvis-Legende",
};

/* ---------- Reine Berechnung (ohne Speicher, ohne DOM) ---------- */

function berechneAufgabenXP(ersterVersuchRichtig) {
  const xp = ersterVersuchRichtig ? XP_ERSTER_VERSUCH_RICHTIG : XP_SPAETER_RICHTIG;
  return Math.min(xp, XP_MAX_PRO_AUFGABE);
}

function berechneMissionsbonus(missionAbgeschlossen) {
  return missionAbgeschlossen ? XP_MISSIONSBONUS : 0;
}

function summiereMissionsXP(aufgabenXPListe, missionAbgeschlossen) {
  const summe = aufgabenXPListe.reduce((gesamt, xp) => gesamt + Math.max(0, Number(xp) || 0), 0);
  return summe + berechneMissionsbonus(missionAbgeschlossen);
}

function addiereXP(aktuellerGesamtXP, zusatzXP) {
  const sichererZusatz = Math.max(0, Number(zusatzXP) || 0);
  const basis = Math.max(0, Number(aktuellerGesamtXP) || 0);
  return basis + sichererZusatz;
}

function berechneLevel(gesamtXP) {
  const xp = Math.max(0, Number(gesamtXP) || 0);
  return Math.floor(xp / 100) + 1;
}

function holeLevelName(level) {
  return LEVEL_NAMEN[level] ?? `Level ${level}`;
}

function berechneLevelInfo(gesamtXP) {
  const level = berechneLevel(gesamtXP);
  return { level, name: holeLevelName(level) };
}

/* ---------- Speicherung (localStorage, mit Robustheit) ---------- */

function istSpeicherVerfuegbar() {
  try {
    const testKey = "__lernJarvisSpeichertest__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

function erstelleLeerenFortschritt() {
  return { version: 1, gesamtXP: 0, missionen: [], sterne: 0 };
}

/**
 * Ergänzt fehlende Felder in bereits gespeicherten (älteren) Daten, ohne
 * vorhandene Werte zu verändern oder zu löschen. Aktuell betrifft das nur
 * das Feld "sterne" (Startwert 0), das erst nachträglich eingeführt wurde.
 */
function ergaenzeFehlendeFelder(daten) {
  const hatGueltigeSterne =
    typeof daten.sterne === "number" && Number.isFinite(daten.sterne) && daten.sterne >= 0;
  if (hatGueltigeSterne) {
    return { daten, wurdeGeaendert: false };
  }
  return { daten: { ...daten, sterne: 0 }, wurdeGeaendert: true };
}

function istFortschrittGueltig(daten) {
  return (
    daten !== null &&
    typeof daten === "object" &&
    typeof daten.gesamtXP === "number" &&
    Number.isFinite(daten.gesamtXP) &&
    daten.gesamtXP >= 0 &&
    Array.isArray(daten.missionen)
  );
}

function sichereDefekteDaten(rohtext) {
  try {
    // Nur einmal sichern: Ein erneuter Ladevorgang soll die ursprünglich
    // defekten Daten nicht wieder überschreiben.
    if (localStorage.getItem(FORTSCHRITT_STORAGE_KEY_DEFEKT) === null) {
      localStorage.setItem(FORTSCHRITT_STORAGE_KEY_DEFEKT, rohtext);
    }
  } catch (e) {
    // Wenn selbst das Sichern fehlschlägt, bleibt die App trotzdem nutzbar.
  }
}

/**
 * Lädt den gespeicherten Fortschritt.
 * Gibt immer { daten, status } zurück und wirft nie einen Fehler.
 * status ist eines von: "geladen", "neu", "defekt", "kein_speicher".
 */
function ladeFortschritt() {
  if (!istSpeicherVerfuegbar()) {
    return { daten: erstelleLeerenFortschritt(), status: "kein_speicher" };
  }

  const roh = localStorage.getItem(FORTSCHRITT_STORAGE_KEY);
  if (roh === null) {
    return { daten: erstelleLeerenFortschritt(), status: "neu" };
  }

  try {
    const geparst = JSON.parse(roh);
    if (!istFortschrittGueltig(geparst)) {
      sichereDefekteDaten(roh);
      return { daten: erstelleLeerenFortschritt(), status: "defekt" };
    }
    const { daten, wurdeGeaendert } = ergaenzeFehlendeFelder(geparst);
    if (wurdeGeaendert) {
      speichereFortschritt(daten);
    }
    return { daten, status: "geladen" };
  } catch (e) {
    sichereDefekteDaten(roh);
    return { daten: erstelleLeerenFortschritt(), status: "defekt" };
  }
}

/**
 * Speichert den Fortschritt. Gibt true/false zurück, wirft nie einen Fehler.
 */
function speichereFortschritt(daten) {
  if (!istSpeicherVerfuegbar()) return false;
  try {
    localStorage.setItem(FORTSCHRITT_STORAGE_KEY, JSON.stringify(daten));
    return true;
  } catch (e) {
    return false;
  }
}
