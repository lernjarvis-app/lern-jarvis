/*
 * Reine Aufgaben- und Tipp-Erzeugung für die Einmaleins-Übung.
 * Enthält bewusst keine DOM-Zugriffe, damit die Funktionen unabhängig von
 * der Oberfläche getestet werden können (z. B. mit "osascript -l JavaScript").
 */

/**
 * Erzeugt 5 verschiedene Einmaleins-Aufgaben.
 * auswahl: "1".."10" für eine einzelne Reihe, oder "gemischt" für alle Reihen 1–10.
 * zufall: austauschbare Zufallsfunktion (0 <= x < 1), Standard Math.random –
 * nur für Tests mit vorhersagbarem Ergebnis gedacht.
 * Jede Aufgabe hat { faktor1, faktor2, ergebnis }. Tauschaufgaben (z. B. 3·4
 * und 4·3) gelten als dieselbe Aufgabe und werden nicht beide gezogen.
 */
function erzeugeEinmaleinsAufgaben(auswahl, zufall) {
  const zufallsfunktion = typeof zufall === "function" ? zufall : Math.random;
  const paare = [];

  if (auswahl === "gemischt") {
    for (let a = 1; a <= 10; a++) {
      for (let b = a; b <= 10; b++) {
        paare.push([a, b]);
      }
    }
  } else {
    const reihe = Number(auswahl);
    for (let b = 1; b <= 10; b++) {
      paare.push([reihe, b]);
    }
  }

  // Fisher-Yates-Mischung
  for (let i = paare.length - 1; i > 0; i--) {
    const j = Math.floor(zufallsfunktion() * (i + 1));
    const tausch = paare[i];
    paare[i] = paare[j];
    paare[j] = tausch;
  }

  return paare.slice(0, 5).map(([a, b]) => {
    const vertauscht = zufallsfunktion() < 0.5;
    const faktor1 = vertauscht ? b : a;
    const faktor2 = vertauscht ? a : b;
    return { faktor1, faktor2, ergebnis: faktor1 * faktor2 };
  });
}

/**
 * Erzeugt einen freundlichen Rechenweg-Tipp (keine Lösung!) für a · b.
 */
function erzeugeEinmaleinsTipp(a, b) {
  if (b === 1) {
    return `Bei „mal 1“ bleibt eine Zahl immer gleich.`;
  }
  if (b === 10) {
    return `Bei „mal 10“ hängst du einfach eine Null an die Zahl.`;
  }
  if (b === 2) {
    return `${a} · 2 ist das Doppelte von ${a}, also ${a} + ${a}.`;
  }
  if (b > 5) {
    const rest = b - 5;
    return `${a} · ${b} ist ${a} · 5 plus ${a} · ${rest}.`;
  }
  const rest = b - 2;
  return `${a} · ${b} ist ${a} · 2 plus ${a} · ${rest}.`;
}
