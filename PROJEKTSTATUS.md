# Projektstatus Lern-Jarvis

Stand: 2026-10-13. Erstellt auf Basis einer Code-Bestandsaufnahme sowie eigener
Tests (osascript-Funktionstests und Klicktests im Browser, inkl. Messung von
Bildschirmpositionen für Überlappungsprüfungen). Alle Angaben sind entweder als
geprüfte Tatsache oder ausdrücklich als ungeprüft gekennzeichnet.

## Projektziel

Eine Web-App „Lern-Jarvis" für ein Android-Tablet, für ein Kind der dritten
Klasse. Futuristisches, an die Iron-Man-KI-Assistenz angelehntes Design,
mit Lernmissionen in Mathematik und Deutsch, einem XP-/Level-System, Sternen und
Belohnungen, Nachweisen für Antolin/ANTON, täglichen Lern-/Lesegewohnheiten sowie
später optional einer echten KI-Anbindung. Erster Entwicklungsschritt bewusst ohne
kostenpflichtige Dienste, mit lokaler Speicherung statt eigenem Server.

## Aktueller funktionierender Stand (geprüft durch Code-Lektüre und eigene Tests)

Reine HTML/CSS/JavaScript-Anwendung ohne Build-Werkzeuge und ohne Abhängigkeiten
(`index.html`, `src/script.js`, `src/style.css`, `src/fortschritt.js`,
`manifest.webmanifest`, `sw.js`, drei Icon-Dateien unter `icons/`,
sowie **neu:** `src/einmaleins-generator.js` und der Ordner `inhalte/` mit
`katalog.js`, `deutsch-grossklein.js` und `mathe-einmaleins.js`). Enthält:

- **Neu:** Themenkatalog mit Ablauf „Erklären → Üben" statt einer festen
  Übung pro Fach. Inhalte (Erklärungsschritte, Aufgaben) sind strikt von der
  Programmlogik getrennt: Jedes Thema ist eine eigene Datei im Ordner
  `inhalte/`, die sich selbst in `window.LernJarvisThemen` einträgt. Ob ein
  Thema in der Oberfläche antippbar ist oder als „Bald verfügbar" erscheint,
  ergibt sich automatisch daraus, ob eine solche Datei für die betreffende
  Themen-id existiert – ein neues Thema lässt sich später allein durch eine
  neue Datei hinzufügen, ohne `src/script.js` zu verändern.
- **Neu:** Vollständiger Themenkatalog für die 3. Klasse: 13 Mathematik- und
  11 Deutsch-Themen (siehe Abschnitt „Wichtige technische Entscheidungen"
  für die genaue Liste), erreichbar über „Lernbereich" im Hauptmenü. Fertige
  Themen sind antippbar und zeigen, wie oft sie geübt wurden (z. B.
  „2× geübt"); die übrigen sind sichtbar, aber als „Bald verfügbar"
  gekennzeichnet (gestrichelter Rand, cyanfarbener Hinweistext – bewusst
  nicht grau-traurig). Nirgends wird ein Thema als „beherrscht" oder „fertig
  gelernt" dargestellt.
- **Neu:** Jedes fertige Thema hat eine Themen-Startseite mit „Erklären" und
  „Üben". „Erklären" zeigt 3–5 kurze Schritte (je 1–3 Sätze, oft mit
  Beispiel) im ruhigen, freundlichen Jarvis-Ton, mit mindestens einer
  Zwischenfrage zum Mitdenken (ohne XP) und Weiter-/Zurück-Navigation; der
  letzte Schritt führt über „Jetzt üben" direkt in die Übung. Alle Texte
  sind so formuliert, dass sie sich später gut vorlesen lassen.
- **Neu:** Zweites fertiges Thema „Einmaleins" (Mathematik): Auswahl einer
  einzelnen Reihe (1er–10er) oder „Gemischt", danach eine vom Programm
  erzeugte Mission mit 5 verschiedenen Aufgaben (keine Wiederholung,
  Tauschaufgaben wie 3·4/4·3 zählen als dieselbe Aufgabe). Eingabe über ein
  großes Zahlenfeld auf dem Bildschirm (eigene Ziffern-Tasten, „Löschen",
  „Fertig") statt der System-Tastatur. Bei einer falschen Antwort gibt es
  einen freundlichen Rechenweg-Tipp (nicht die Lösung); nach dem dritten
  Fehlversuch zeigt Jarvis die Lösung mit kurzer Erklärung, und es geht
  weiter. Die Aufgaben-Erzeugung und die Tipp-Texte stecken in der eigenen,
  unabhängig testbaren Datei `src/einmaleins-generator.js` (keine
  DOM-Zugriffe).
- **Neu:** Die bestehende Demo „Groß- und Kleinschreibung" ist jetzt ein
  Thema im Katalog; die 5 Übungsaufgaben, ihre Erklärtexte und das
  XP-Verhalten sind dabei unverändert aus dem vorherigen Schritt übernommen,
  nur eine neue Erklärung mit Zwischenfrage wurde davorgesetzt.
- **Neu:** Gespeicherte Missionen enthalten jetzt zusätzlich die Themen-id
  (`themaId`); bestehende Einträge ohne dieses Feld bleiben vollständig
  erhalten und funktionieren weiter (sie zählen über den alten Themennamen
  weiterhin für die Deutsch-Demo als „geübt" mit).
- **Neu:** Die App ist installierbar (Web-App-Manifest: Name „Lern-Jarvis",
  Kurzname „Jarvis", Start im Vollbild `fullscreen` und Querformat
  `landscape`, dunkle Hintergrund-/Theme-Farbe passend zum Design). Drei
  eigene App-Symbole (192×192, 512×512, plus eine „maskable"-Variante für
  Android) zeigen einen schlichten Jarvis-Kern in Cyan auf dunklem Grund –
  erzeugt als reine PNG-Dateien ganz ohne Installation, nur mit der
  Python-Standardbibliothek (`zlib`, `struct`), keine fremden Bilder.
- **Neu:** Ein Service Worker (`sw.js`) speichert alle App-Dateien beim
  ersten Laden zwischen (Cache-Name `lernjarvis-v1`), sodass die App danach
  auch ohne Internetverbindung vollständig lädt. Bei einer neuen
  Cache-Version werden alte Caches automatisch gelöscht; dank
  `skipWaiting()`/`clients.claim()` übernimmt der Browser eine neue Version
  spätestens beim nächsten Öffnen der App, ohne dass dafür etwas manuell
  getan werden muss. Der Service Worker verwaltet ausschließlich die Cache
  Storage API und fasst `localStorage` (den Lernfortschritt) nie an – beide
  Speicherarten sind im Browser vollständig getrennt.
- **Neu gestaltet:** Das Dashboard ist jetzt eine „Jarvis-Zentrale": ein großer,
  detailreicher Jarvis-Kern (SVG, mehrere gegenläufig rotierende Ringe,
  Skalenstriche, segmentierte Bögen, sanftes Pulsieren) in der Mitte. Tippt man
  auf den Kern, wachsen cyanfarbene „Leitungen" mit Knotenpunkten und
  Markierungen nach außen und öffnen 5 Menüpunkte; ein erneuter Tipp auf den
  Kern oder auf das Element „✕ Schließen" zieht sie wieder zurück. Gesamtdauer
  der Öffnen-Animation ca. 0,6 Sekunden.
- **Neu:** HUD-Statusanzeigen (Level mit Namen, XP mit Fortschrittsbalken zum
  nächsten Level, Sterne-Anzahl) sind im Dashboard immer sichtbar, per Leitung
  mit dem Kern verbunden, und unabhängig vom Menü-Öffnen/Schließen.
- **Neu:** Dekorative HUD-Details („SYSTEM ONLINE"-Schriftzug, Eckwinkel am
  Rand) ohne erfundene Lerndaten (keine Prozentwerte, Noten oder Statistiken).
- **Neu:** Bei der Systemeinstellung „Bewegung reduzieren"
  (`prefers-reduced-motion: reduce`) sind alle Animationen deaktiviert, das
  Menü erscheint sofort im Endzustand (per CSS-Logik isoliert geprüft, siehe
  Testabschnitt unten).
- Die 5 Menüpunkte (Lernbereich, Sterne & Belohnungen, Antolin & ANTON,
  Gewohnheiten, Elternbereich) führen zu exakt denselben Zielen bzw.
  Hinweismeldungen wie zuvor die Dashboard-Kacheln.
- **Neu:** Navigation mit Verlaufs-Stapel (`navStack`) statt fester
  Zurück-Ziele: Fächer → Mathe-/Deutsch-Themen → Themen-Startseite →
  Erklärung/Übung, „Zurück" geht immer zur tatsächlich zuletzt besuchten
  Ansicht. Das bestehende Hauptmenü (Jarvis-Kern, Leitungen,
  Statusanzeigen, die 5 Menüpunkte) ist davon unberührt.
- Echte XP-Vergabe nach festen Regeln, für alle Themen gleich (10 XP bei
  erstem Versuch richtig, 5 XP bei richtig nach Korrektur, **0 XP, wenn
  nach dem dritten Fehlversuch die Lösung gezeigt wird** – nachträglich auf
  Wunsch angepasst, ursprünglich waren hier 5 XP vorgesehen –, einmalig
  +10 XP Missionsbonus bei vollständigem Abschluss, Obergrenze 15 XP/Aufgabe
  im Code abgesichert, XP sinken nie).
  Reine Berechnungslogik in `src/fortschritt.js`, getrennt von der Oberfläche.
- Level-Berechnung (Level = Gesamt-XP ganzzahlig durch 100, plus 1) mit festen
  Namen für Level 1–8, ab Level 9 nur „Level 9" usw.
- Dauerhafte Speicherung in `localStorage` unter dem Schlüssel `lernJarvis.v1`
  (Gesamt-XP, Liste abgeschlossener Missionen, und **neu:** Feld `sterne`,
  Startwert 0). Speicherung erfolgt nach jeder einzelnen gelösten Aufgabe.
- **Neu:** Bereits gespeicherte Stände ohne das Feld `sterne` (aus dem vorigen
  Schritt) werden beim Laden automatisch ergänzt (`sterne: 0`), ohne dass
  Gesamt-XP oder Missionshistorie verändert oder gelöscht werden. Sterne werden
  in diesem Schritt an keiner Stelle vergeben – nur das Datenfeld existiert
  und wird anzeigt.
- Robustheit gegen fehlenden/defekten Speicher unverändert: Bei nicht
  verfügbarem `localStorage` oder beschädigten Daten stürzt die App nicht ab,
  zeigt einen gut sichtbaren Hinweisbanner, und beschädigte Rohdaten werden
  unter dem Schlüssel `lernJarvis.v1.defekt` aufbewahrt statt gelöscht.
**Inzwischen auf dem echten Tablet bestätigt:** Installation über Chrome,
Start als eigenständige App, Service-Worker-Aktivierung und Offline-Betrieb
funktionieren auf dem Android-Tablet des Kindes (Rückmeldung nach dem
vorherigen Schritt). Die zuvor offene Frage zur echten
Service-Worker-Aktivierung ist damit geklärt.

Für diesen Schritt (Themenkatalog, Erklären/Üben, Einmaleins) selbst
getestet: Funktionstests mit `osascript -l JavaScript` – alle bisherigen
Tests erneut bestanden, plus neue Tests für den Einmaleins-Aufgaben-Generator
(für jede Reihe 1–10 und für „Gemischt" je 5 verschiedene, korrekte
Aufgaben; keine Wiederholung auch bei Tauschaufgaben) und für die XP-Regel
„Lösung nach drei Fehlversuchen = 5 XP". Außerdem ausführliche Klicktests im
Browser: beide Themenkataloge (13 Mathe-, 11 Deutsch-Themen) mit korrektem
Antippbar-/„Bald verfügbar"-Status, Erklärung inkl. Zwischenfrage (ohne XP)
für beide fertigen Themen, vollständiger Einmaleins-Durchlauf (3 Fehlversuche
mit Hinweisen und Lösungsanzeige, ein Fehlversuch mit späterer richtiger
Antwort, mehrere Aufgaben sofort richtig), „geübt"-Zähler aktualisiert sich
sofort nach einer Mission, Groß- und Kleinschreibung weiterhin unverändert
(gleiche 5 Aufgaben, gleiche XP-Werte wie zuvor), sowie ein alter
Speicherstand ohne `themaId`: XP blieb erhalten, keine Fehler, die alte
Großschreibung-Mission zählt über den früheren Themennamen weiterhin als
„geübt" mit.

**Korrektur nach Rückmeldung:** Die ursprünglich vorgesehenen 5 XP für eine
nach drei Fehlversuchen gezeigte Lösung wurden auf Wunsch wieder entfernt
(jetzt 0 XP) – 5 XP für drei falsche Antworten wurden als nicht angemessen
empfunden. Im Browser erneut getestet: nach drei Fehlversuchen „+0 XP",
Gesamt-XP unverändert; der Fall „einmal falsch, dann richtig" (weiterhin
5 XP) sowie der Missionsabschluss inkl. Bonus bei einer Mission mit einer
0-XP-Aufgabe wurden ebenfalls erneut bestätigt.

**Ungeprüft:** Verhalten der neuen Themenkatalog-Oberfläche und der
Einmaleins-Übung auf einem echten Android-Tablet mit echter Touch-Bedienung
(nur der vorherige Schritt – Installation/Offline-Betrieb – wurde dort
bereits bestätigt, siehe oben). Die Systemeinstellung „Bewegung reduzieren"
konnte weiterhin nicht als echte Betriebssystem-Einstellung aktiviert werden
(wie in einem früheren Schritt beschrieben); das betrifft aber nur den
Hauptmenü-Kern, nicht die neuen Inhalte dieses Schritts.

## Veröffentlichung

- Remote-Repository: `origin` → `https://github.com/lernjarvis-app/lern-jarvis.git`
  (anonyme Identität, kein echter Name).
- Öffentliche Adresse der App: `https://lernjarvis-app.github.io/lern-jarvis/`
  (GitHub Pages).
- Ablauf für eine neue Version: lokal `git commit`, danach `git push` –
  GitHub Pages aktualisiert die veröffentlichte Seite danach automatisch,
  ohne weiteren manuellen Schritt. Wichtig: Für installierte Geräte wird die
  neue Version erst nach einem Cache-Versionssprung in `sw.js` zuverlässig
  übernommen (siehe Regel unter „Wichtige technische Entscheidungen").

## Abgeschlossene Schritte

1. Projekt-Grundgerüst mit futuristischem Dashboard-Design.
2. Navigation zwischen Dashboard, Fächer-Auswahl, Deutsch-Themenübersicht und
   Übungsansicht.
3. Demo-Lernbereich Deutsch: Groß- & Kleinschreibung (5 Aufgaben, Auswertung,
   Feedback, Abschlussbildschirm).
4. Sicherungsgrundlage: Backup-Kopie, lokales Git-Repository mit erstem Commit,
   Status-Datei.
5. XP-Vergabe und dauerhafte Speicherung für die Deutsch-Demo (Level, Kopfzeile,
   Missionshistorie, Robustheit bei defekten/fehlenden Daten).
6. Neues Jarvis-Hauptmenü: Dashboard als Jarvis-Zentrale mit Leitungen,
   HUD-Statusanzeigen (Level, XP-Fortschrittsbalken, Sterne) und
   Sterne-Datenfeld (Startwert 0, Migration bestehender Stände).
7. Installierbare App: Web-App-Manifest, drei eigene App-Symbole und ein
   Service Worker für Offline-Betrieb mit Versionierung. Auf dem echten
   Tablet bestätigt.
8. Themenkatalog mit Ablauf „Erklären → Üben": vollständiger Katalog für
   13 Mathematik- und 11 Deutsch-Themen, Inhalte getrennt von der
   Programmlogik im Ordner `inhalte/`. Zwei fertige Themen: Groß- und
   Kleinschreibung (übernommen) und neu Einmaleins (Reihen-Auswahl,
   generierte Missionen, Zahlenfeld-Eingabe, Hinweise statt Lösung,
   Lösungsanzeige nach drei Fehlversuchen).

## Derzeitiger Entwicklungsschritt

Themenkatalog mit Erklären/Üben und Einmaleins abgeschlossen. Hauptmenü
(Jarvis-Kern, Leitungen, Statusanzeige), Speicherschlüssel `lernJarvis.v1`
und vorhandener Fortschritt, Offline-Funktion und Manifest wurden dabei nicht
verändert. Keine Sterne-Vergabe, kein Belohnungsladen, kein Elternbereich.

## Offene Aufgaben (geprüft: im Code nicht vorhanden)

- 12 der 13 Mathematik-Themen sind noch ohne Inhalt (nur Einmaleins ist
  fertig) – siehe vollständige Liste unter „Wichtige technische
  Entscheidungen".
- 10 der 11 Deutsch-Themen sind noch ohne Inhalt (nur Groß- und
  Kleinschreibung ist fertig).
- **Sprachausgabe folgt im nächsten Entwicklungsschritt** (bewusste
  Entscheidung, siehe unten) – noch keine `SpeechSynthesis`-Nutzung im Code.
  Spracheingabe (Mikrofon) ist vorerst nicht geplant.
- Sterne-Vergabe selbst (Feld und Anzeige existieren, aber es gibt noch
  keine Stelle im Code, die Sterne tatsächlich vergibt; laut Planungsvorgabe
  sollen Sterne künftig nach Lernverhalten und Verständnis vergeben werden,
  nicht nach XP-Schwellenwert).
- Belohnungsladen (nur Platzhalter-Menüpunkt).
- Antolin/ANTON-Nachweise (nur Platzhalter-Menüpunkt).
- Tägliche Gewohnheiten und Lern-/Leseserien (nur Platzhalter-Menüpunkt).
- Elternbereich inkl. Zugriffsschutz (nur Platzhalter-Menüpunkt, bewusst noch
  ohne Sperre).
- Kein Zurücksetzen-Knopf in der Oberfläche (bewusst noch nicht eingebaut).
- Echte KI-Anbindung (bewusst noch nicht geplant/umgesetzt; feste,
  selbst geschriebene Erklärungen und Aufgaben ohne KI, siehe unten).
- **Datensicherung (Export/Import) fehlt noch – Löschen der Browserdaten löscht
  den Fortschritt.**

## Bekannte Fehler und Einschränkungen

- Der Lernfortschritt ist ausschließlich im `localStorage` dieses einen
  Browsers auf diesem einen Gerät gespeichert. Löschen der Browserdaten,
  ein anderer Browser oder ein anderes Gerät bedeuten Verlust bzw.
  Nichtverfügbarkeit des Fortschritts. Es gibt noch keine Export-/
  Import-Funktion.
- Wiederholen der Demo-Übung vergibt erneut XP (bewusste Entscheidung aus
  einem früheren Auftrag), es gibt also noch keine Begrenzung, wie oft XP für
  dieselbe Übung verdient werden kann.
- Das Dashboard setzt das Menü bei jedem Zurückkehren zur Startansicht auf
  „geschlossen" zurück (bewusste, einfache Standardentscheidung für
  vorhersehbares Verhalten).
- Keine automatisierten Tests im Projekt selbst vorhanden (keine Testdateien,
  kein Test-Framework, kein `package.json`); die Prüfungen in diesem Schritt
  wurden extern mit `osascript -l JavaScript` durchgeführt und sind nicht
  Teil des Projektordners.
- Node.js und npm sind auf dem Entwicklungsrechner nicht installiert (geprüft).
  Python 3.9.6 ist vorhanden und wurde bisher nur zum lokalen Testen per
  `python3 -m http.server` verwendet, ist aber kein Teil der App selbst.
- **Ungeprüft:** Der neue Themenkatalog und die Einmaleins-Übung wurden noch
  nicht mit echter Touch-Bedienung auf dem Tablet getestet (Installation und
  Offline-Betrieb selbst sind dort bereits bestätigt). Die Systemeinstellung
  „Bewegung reduzieren" konnte weiterhin nicht als echte
  Betriebssystem-Einstellung getestet werden.

## Wichtige technische Entscheidungen

- Reines HTML/CSS/JavaScript ohne Framework und ohne Build-Werkzeuge, da auf
  dem Entwicklungsrechner kein Node.js/npm installiert ist und die App bewusst
  einfach und wartbar gehalten werden soll.
- Der Jarvis-Kern und die Leitungen sind reines SVG/CSS (viewBox 0–100, damit
  alle Positionen als einfache Prozentwerte funktionieren) – keine Bilddateien,
  keine externen Schriften, keine externen Bibliotheken.
- Die 5 Menüpunkte und die 3 HUD-Statusanzeigen sind echte HTML-Elemente
  (Buttons bzw. `div`s), die über denselben Prozent-Koordinatenraum wie das
  SVG positioniert werden – das SVG liefert nur die Leitungen/den Kern als
  Dekoration, die eigentliche Bedienung bleibt zugänglich (Tastatur,
  Screenreader) statt interaktive SVG-Elemente zu verwenden.
- Animationen nutzen ausschließlich `transform`, `opacity` und
  `stroke-dashoffset` (keine Animation von `width`/`height`/`box-shadow`), wie
  für flüssige Performance gefordert; bei `prefers-reduced-motion: reduce`
  werden alle Übergänge und Animationen per `!important` deaktiviert.
- Single-Page-Navigation per JavaScript (`hidden`-Attribut), keine echten
  URLs/Routen pro Unterseite.
- Multiple-Choice- bzw. Zahlenfeld-Format für die Übungen, damit Antworten
  ohne KI-Anbindung eindeutig und zuverlässig automatisch ausgewertet werden
  können.
- XP- und Level-Berechnung sowie Speicherlogik liegen in einer eigenen Datei
  `src/fortschritt.js`, getrennt von der Oberfläche (`src/script.js`), damit
  sie unabhängig testbar sind und künftig von weiteren Lernbereichen
  wiederverwendet werden können.
- **Themenkatalog Klasse 3 (vollständige Liste, Stand dieses Schritts):**
  Mathematik – Zahlen bis 1000; Plus und Minus bis 1000 im Kopf; Schriftliche
  Addition; Schriftliche Subtraktion; Einmaleins ✅; Geteilt-Aufgaben;
  Malnehmen mit größeren Zahlen; Geld; Längen; Gewichte; Uhrzeit und
  Zeitspannen; Sachaufgaben; Geometrie. Deutsch – Groß- und Kleinschreibung ✅;
  Nomen; Verben; Adjektive; Satzarten und Satzzeichen; Wörtliche Rede;
  Rechtschreibtricks (Verlängern, Ableiten); Doppelte Mitlaute, ie, ck/tz;
  Alphabet und Wörterbuch; Wortfamilien und zusammengesetzte Nomen;
  Leseverständnis. (✅ = in diesem Schritt fertiggestellt.)
- Inhalte (Erklärung, Aufgaben) und Programmlogik sind strikt getrennt:
  jedes fertige Thema ist eine eigene Datei im Ordner `inhalte/`, die sich
  selbst registriert; der Katalog (`inhalte/katalog.js`) listet nur
  id/Fach/Titel aller Themen. Ein Thema gilt automatisch als verfügbar,
  sobald eine passende Inhaltsdatei existiert – neue Themen erfordern also
  nur eine neue Datei plus deren Einbindung in `index.html` und `sw.js`,
  keine Änderung an `src/script.js`.
- Feste, selbst geschriebene Erklärungen und Aufgaben statt einer echten
  KI-Anbindung (bewusste Entscheidung für diesen und den vorherigen Schritt;
  keine laufenden Kosten, vorhersehbare und geprüfte Inhalte).
  Spracheingabe (Mikrofon) ist vorerst nicht geplant. Sprachausgabe ist
  bewusst noch nicht umgesetzt und folgt als eigener, nächster
  Entwicklungsschritt – alle Erklärungs- und Aufgabentexte sind schon jetzt
  so formuliert, dass sie sich gut vorlesen lassen.
- Fehlende Felder in bereits gespeicherten Daten (aktuell: `sterne`) werden
  beim Laden automatisch und verlustfrei ergänzt, statt den Stand als defekt
  zu behandeln – nur tatsächlich unlesbare/beschädigte Daten gelten als
  „defekt" und werden gesondert aufbewahrt.
- Keine externen Ressourcen (keine CDNs, keine Google Fonts, keine API-Aufrufe) –
  die App ist vollständig offlinefähig.
- Elternbereich im Prototyp bewusst noch ohne Zugriffsschutz (Entscheidung aus
  einer früheren Planungsrunde).
- Keine echten Namen im Code. Ein persönlicher Name kann später ausschließlich
  lokal auf dem Gerät gespeichert werden.
- **Bei jeder Änderung an App-Dateien die Cache-Version in `sw.js` erhöhen**
  (z. B. `lernjarvis-v1` → `lernjarvis-v2`), sonst erhalten installierte
  Geräte die Änderung nicht zuverlässig.
- App-Symbole als reine, selbst erzeugte PNG-Dateien (eigener Jarvis-Kern,
  keine fremden Bilder/Logos), damit keine Installation zusätzlicher
  Bildbearbeitungswerkzeuge nötig ist.
- Service Worker mit „Cache-Storage-first, Netzwerk-Fallback"-Strategie:
  bereits zwischengespeicherte Dateien werden sofort ausgeliefert (Offline-
  und Geschwindigkeitsvorteil), gleichzeitig wird im Hintergrund versucht,
  neuere Versionen nachzuladen und den Cache zu aktualisieren.

## Nächster empfohlener Schritt

Sprachausgabe ist der festgelegte nächste Schritt (siehe „Wichtige technische
Entscheidungen"). Darüber hinaus wäre – als fachliche Einschätzung, keine
bereits getroffene Entscheidung – auch ein Zurücksetzen-Mechanismus mit
einfacher Export-/Import-Funktion für den Lernstand sinnvoll, bevor noch mehr
Themen vom selben Datenverlust-Risiko betroffen sind.
