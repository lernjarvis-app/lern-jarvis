/*
 * Thema: Groß- und Kleinschreibung (Deutsch, 3. Klasse)
 * Die 5 Übungsaufgaben und ihre Erklärtexte sind unverändert aus dem
 * vorherigen Entwicklungsschritt übernommen.
 */
window.LernJarvisThemen = window.LernJarvisThemen || [];
window.LernJarvisThemen.push({
  id: "deutsch-grossklein",
  fach: "deutsch",
  titel: "Groß- und Kleinschreibung",

  erklaerung: [
    {
      text: "Jeder Satz beginnt mit einem großen Buchstaben – ganz am Anfang, egal um welches Wort es geht.",
      beispiel: "Der Hund bellt. (nicht: der Hund bellt.)",
    },
    {
      text: "Nomen schreibst du immer groß. Das sind Wörter für Menschen, Tiere, Dinge oder Ideen. Meistens kannst du „der“, „die“ oder „das“ davorsetzen.",
      beispiel: "der Baum, die Schule, das Buch",
    },
    {
      text: "Mal sehen, ob du ein Nomen erkennst.",
      frage: {
        text: "Welches Wort ist in diesem Satz ein Nomen: „Mein Hund läuft schnell.“?",
        optionen: ["Hund", "läuft", "schnell"],
        richtig: 0,
        rueckmeldungRichtig: "Genau, „Hund“ ist das Nomen – gut erkannt!",
        rueckmeldungFalsch: "Fast! Das Nomen in diesem Satz ist „Hund“.",
      },
    },
    {
      text: "Adjektive und Verben bleiben dagegen meistens klein – außer sie stehen ganz am Satzanfang.",
      beispiel: "Der Ball ist rot. (nicht: Der Ball ist Rot.)",
    },
    {
      text: "Mit diesen Regeln kommst du schon sehr weit. Bereit, es auszuprobieren?",
    },
  ],

  uebung: {
    typ: "liste",
    aufgaben: [
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
    ],
  },
});
