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
`PROJEKTSTATUS.md`, sowie **neu:** `manifest.webmanifest`, `sw.js` und drei
Icon-Dateien unter `icons/`). Enthält:

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
- Funktionierende Navigation zwischen den weiteren Ansichten (Fächer →
  Deutsch-Themen → Übung) per JavaScript (`hidden`-Attribut-Umschaltung), inkl.
  Zurück-Buttons – unverändert gegenüber dem vorherigen Stand.
- Funktionsfähige Demo-Übung „Groß- & Kleinschreibung" (Deutsch, 3. Klasse) mit
  5 fest hinterlegten Multiple-Choice-Aufgaben – unverändert gegenüber dem
  vorherigen Stand, inklusive XP-Vergabe und -Anzeigen in der Übung selbst.
- Echte XP-Vergabe nach festen Regeln (10 XP bei erstem Versuch richtig, 5 XP
  bei richtig nach Korrektur, einmalig +10 XP Missionsbonus bei vollständigem
  Abschluss, Obergrenze 15 XP/Aufgabe im Code abgesichert, XP sinken nie).
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
- Fünf weitere Deutsch-Themen sowie „Mathematik" sind weiterhin nur als
  Platzhalter-Kacheln vorhanden (Hinweis „folgt in einem späteren Schritt").

Alle oben genannten neuen Punkte wurden in diesem Schritt selbst getestet:
Funktionstests der Berechnungs- und Migrationslogik mit
`osascript -l JavaScript` (alle Testfälle bestanden, inkl. Wiederholung der
Tests aus dem vorigen Schritt) sowie ausführliche Klicktests im Browser bei
1280×800, 1024×768 (beide Querformat) und 768×1024 (Hochformat): Menü
öffnen/schließen, alle 5 Menüpunkte, Deutsch-Demo spielen, XP-Anzeige live,
Neuladen, Migration eines alten Standes ohne `sterne`-Feld, sowie eine
programmatische Überlappungsprüfung aller HUD- und Menü-Elemente (keine
Überlappungen, alle Menüpunkte ≥ 64×64 px).

**Ungeprüft:** Verhalten auf einem echten Android-Tablet bzw. mit echter
Touch-Bedienung. Die Systemeinstellung „Bewegung reduzieren" konnte in der
verwendeten Testumgebung nicht als echte Browser-/Betriebssystem-Einstellung
aktiviert werden; stattdessen wurde die identische CSS-Regel isoliert
nachgebildet und geprüft, dass sie wie vorgesehen wirkt – das ist ein starkes,
aber kein vollständiges Äquivalent zum echten Einstellungstest.

Die tatsächliche **Service-Worker-Registrierung** ließ sich in den für diesen
Schritt verfügbaren Browser-Werkzeugen nicht live ausführen (die dort
verwendete Vorschau-Umgebung blockiert jede Service-Worker-Registrierung
grundsätzlich – bestätigt durch einen Kontrolltest mit einer leeren,
nachweislich fehlerfreien Testdatei, die denselben Fehler zeigte). Geprüft
wurde stattdessen dieselbe Cache-Logik direkt über die Cache-Storage-API:
Alle 9 Dateien der App laden mit Status 200 und lassen sich erfolgreich
zwischenspeichern (`caches.open` + `cache.addAll`, identisch zur
„install"-Behandlung in `sw.js`), und die Lösch-Logik für alte
Cache-Versionen wurde mit einem simulierten Versionswechsel (v1 → v2)
erfolgreich nachvollzogen, ohne dass dabei gespeicherte Werte in
`localStorage` verändert wurden. Die eigentliche Service-Worker-Aktivierung,
der Offline-Modus und das automatische Update müssen daher noch in einem
echten Browser (z. B. auf dem Tablet, siehe Testanleitung) bestätigt werden.

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
   Service Worker für Offline-Betrieb mit Versionierung.

## Derzeitiger Entwicklungsschritt

Installierbare App abgeschlossen (Manifest, Symbole, Offline-Betrieb).
Hauptmenü, Deutsch-Demo, XP-Regeln, Speicherlogik und Design wurden dabei
nicht verändert; der Speicherschlüssel `lernJarvis.v1` und sein Inhalt blieben
unangetastet.

## Offene Aufgaben (geprüft: im Code nicht vorhanden)

- Mathematik-Lernbereich (nur Platzhalter).
- XP- und Level-System für weitere Bereiche (bisher nur für die eine
  Deutsch-Demo umgesetzt, nicht für künftige Mathematik- oder weitere
  Deutsch-Übungen).
- Sterne-Vergabe selbst (Feld und Anzeige existieren jetzt, aber es gibt noch
  keine Stelle im Code, die Sterne tatsächlich vergibt; laut Planungsvorgabe
  sollen Sterne künftig nach Lernverhalten und Verständnis vergeben werden,
  nicht nach XP-Schwellenwert).
- Belohnungsladen (nur Platzhalter-Menüpunkt).
- Antolin/ANTON-Nachweise (nur Platzhalter-Menüpunkt).
- Tägliche Gewohnheiten und Lern-/Leseserien (nur Platzhalter-Menüpunkt).
- Elternbereich inkl. Zugriffsschutz (nur Platzhalter-Menüpunkt, bewusst noch
  ohne Sperre).
- Kein Zurücksetzen-Knopf in der Oberfläche (bewusst noch nicht eingebaut).
- Sprachausgabe und Mikrofoneingabe (keine `SpeechSynthesis`- oder
  `SpeechRecognition`-Nutzung im Code vorhanden, obwohl für den ersten
  Prototyp vorgesehen).
- Weitere Deutsch-Themen: Rechtschreibung, Wortarten, Satzbau & Satzzeichen,
  Leseverständnis, Texte schreiben (nur Platzhalter).
- Echte KI-Anbindung (bewusst noch nicht geplant/umgesetzt).
- **Datensicherung (Export/Import) fehlt noch – Löschen der Browserdaten löscht
  den Fortschritt.**
- Die App ist jetzt technisch installierbar (Manifest, Symbole, Offline-Cache);
  **wo sie dauerhaft gehostet wird, damit das Tablet sie überhaupt zum ersten
  Mal laden kann, ist weiterhin nicht geklärt** (lokales Netz, GitHub Pages
  oder etwas anderes).

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
- **Ungeprüft:** Verhalten auf einem echten Android-Tablet, echte
  Touch-Bedienung, echte Betriebssystem-Einstellung „Bewegung reduzieren",
  echte Service-Worker-Aktivierung/Offline-Modus/Update in einem echten
  Browser (siehe Hinweis oben).

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
- Multiple-Choice-Format für die Deutsch-Demo, damit Antworten ohne KI-Anbindung
  eindeutig und zuverlässig automatisch ausgewertet werden können.
- XP- und Level-Berechnung sowie Speicherlogik liegen in einer eigenen Datei
  `src/fortschritt.js`, getrennt von der Oberfläche (`src/script.js`), damit
  sie unabhängig testbar sind und künftig von weiteren Lernbereichen
  wiederverwendet werden können.
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

Dies ist eine fachliche Einschätzung, keine bereits getroffene Entscheidung.
Sinnvoll wäre als Nächstes entweder (a) ein Zurücksetzen-Mechanismus und eine
einfache Export-/Import-Funktion für den Lernstand, bevor mehr Lerninhalte vom
selben Datenverlust-Risiko betroffen sind, oder (b) die Übertragung des
XP-/Speicherkonzepts auf einen zweiten Lernbereich (z. B. ein weiteres
Deutsch-Thema oder ein erstes Mathematik-Thema), um die neue Struktur in
`src/fortschritt.js` als wiederverwendbare Grundlage zu bestätigen.
