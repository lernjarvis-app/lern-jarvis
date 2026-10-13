/*
 * Thema: Einmaleins (Mathematik, 3. Klasse)
 * Die eigentliche Aufgaben-Erzeugung steckt in src/einmaleins-generator.js
 * (reine Logik, unabhängig testbar). Diese Datei liefert nur die Erklärung
 * und verweist über "generatorId" auf diese Logik.
 */
window.LernJarvisThemen = window.LernJarvisThemen || [];
window.LernJarvisThemen.push({
  id: "mathe-einmaleins",
  fach: "mathe",
  titel: "Einmaleins",

  erklaerung: [
    {
      text: "Malnehmen bedeutet: du zählst eine Zahl mehrmals zusammen. „3 · 4“ heißt: drei Vierer zusammenzählen.",
      beispiel: "3 · 4 = 4 + 4 + 4 = 12",
    },
    {
      text: "Bei Tauschaufgaben kannst du die beiden Zahlen vertauschen – das Ergebnis bleibt gleich.",
      beispiel: "3 · 4 ist genauso viel wie 4 · 3, nämlich 12.",
    },
    {
      text: "Mal sehen, ob der Trick schon klappt.",
      frage: {
        text: "Wie viel ist 2 · 6?",
        optionen: ["8", "12", "10"],
        richtig: 1,
        rueckmeldungRichtig: "Richtig, 12! Zwei Sechser zusammen sind 12.",
        rueckmeldungFalsch: "Nicht ganz – 2 · 6 sind 12, also zwei Sechser zusammen.",
      },
    },
    {
      text: "Verdoppeln hilft oft weiter: „mal 2“ heißt einfach, die Zahl noch einmal dazuzuzählen.",
      beispiel: "2 · 7 = 7 + 7 = 14",
    },
    {
      text: "Noch zwei Tricks: Die 5er-Reihe endet immer auf 0 oder 5, und bei der 10er-Reihe hängst du einfach eine Null an die Zahl.",
      beispiel: "6 · 5 = 30, und 6 · 10 = 60",
    },
  ],

  uebung: {
    typ: "generator",
    generatorId: "einmaleins",
  },
});
