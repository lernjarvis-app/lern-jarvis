/*
 * Themenkatalog: die vollständige Liste aller Themen der 3. Klasse mit
 * id, Fach und Titel – unabhängig davon, ob für ein Thema bereits Inhalte
 * (Erklärung + Übung) vorhanden sind.
 *
 * Ein Thema gilt in der Oberfläche automatisch als "verfügbar", sobald eine
 * Datei in diesem Ordner einen Eintrag mit passender id in
 * window.LernJarvisThemen registriert (siehe z. B. mathe-einmaleins.js).
 * Um ein neues Thema freizuschalten, reicht also eine neue Inhaltsdatei –
 * die Programmlogik in src/script.js muss dafür nicht verändert werden.
 */
window.LernJarvisKatalog = [
  // Mathematik
  { id: "mathe-zahlen-bis-1000", fach: "mathe", titel: "Zahlen bis 1000" },
  { id: "mathe-plus-minus-kopf", fach: "mathe", titel: "Plus und Minus bis 1000 im Kopf" },
  { id: "mathe-schriftliche-addition", fach: "mathe", titel: "Schriftliche Addition" },
  { id: "mathe-schriftliche-subtraktion", fach: "mathe", titel: "Schriftliche Subtraktion" },
  { id: "mathe-einmaleins", fach: "mathe", titel: "Einmaleins" },
  { id: "mathe-geteilt", fach: "mathe", titel: "Geteilt-Aufgaben" },
  { id: "mathe-malnehmen-groessere-zahlen", fach: "mathe", titel: "Malnehmen mit größeren Zahlen" },
  { id: "mathe-geld", fach: "mathe", titel: "Geld" },
  { id: "mathe-laengen", fach: "mathe", titel: "Längen" },
  { id: "mathe-gewichte", fach: "mathe", titel: "Gewichte" },
  { id: "mathe-uhrzeit", fach: "mathe", titel: "Uhrzeit und Zeitspannen" },
  { id: "mathe-sachaufgaben", fach: "mathe", titel: "Sachaufgaben" },
  { id: "mathe-geometrie", fach: "mathe", titel: "Geometrie" },

  // Deutsch
  { id: "deutsch-grossklein", fach: "deutsch", titel: "Groß- und Kleinschreibung" },
  { id: "deutsch-nomen", fach: "deutsch", titel: "Nomen" },
  { id: "deutsch-verben", fach: "deutsch", titel: "Verben" },
  { id: "deutsch-adjektive", fach: "deutsch", titel: "Adjektive" },
  { id: "deutsch-satzarten", fach: "deutsch", titel: "Satzarten und Satzzeichen" },
  { id: "deutsch-woertliche-rede", fach: "deutsch", titel: "Wörtliche Rede" },
  { id: "deutsch-rechtschreibtricks", fach: "deutsch", titel: "Rechtschreibtricks (Verlängern, Ableiten)" },
  { id: "deutsch-doppelte-mitlaute", fach: "deutsch", titel: "Doppelte Mitlaute, ie, ck/tz" },
  { id: "deutsch-alphabet", fach: "deutsch", titel: "Alphabet und Wörterbuch" },
  { id: "deutsch-wortfamilien", fach: "deutsch", titel: "Wortfamilien und zusammengesetzte Nomen" },
  { id: "deutsch-leseverstaendnis", fach: "deutsch", titel: "Leseverständnis" },
];
