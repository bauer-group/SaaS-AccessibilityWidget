import type { Dict } from './index';

/**
 * German page-chrome dictionary. Declared `: Dict` so a missing or renamed key
 * fails `typecheck` — DE/EN parity is enforced against the canonical `en.ts`.
 */
export const de: Dict = {
  meta: {
    title: 'Accessibility Widget — eine Zeile Code · BFSG · WCAG 2.2 AA',
    description:
      'Ein lazy-loading Accessibility-Widget für BFSG / EN 301 549 / WCAG 2.2 AA. Eine Zeile Code, 28 Sprachen, ~6 KB Loader, kein Tracking, kein DOM/ARIA-Override der Host-Seite. Jetzt die Live-Demo ausprobieren.',
  },

  nav: {
    home: 'Startseite',
    features: 'Features',
    profiles: 'Profile',
    install: 'Integration',
    api: 'API',
    compliance: 'Compliance',
    faq: 'FAQ',
    github: 'GitHub',
    skip: 'Zum Hauptinhalt springen',
    configuration: 'Konfiguration',
    events: 'Events',
    playground: 'Playground',
    langLabel: 'Seitensprache',
    langDe: 'Seite auf Deutsch umschalten',
    langEn: 'Seite auf Englisch umschalten',
  },

  hero: {
    eyebrow: 'BFSG · EN 301 549 · WCAG 2.2 AA',
    title: 'Digitale Barrierefreiheit —',
    titleAccent: 'in einer Zeile Code',
    lede: 'Ein lazy-loading Accessibility-Widget: ~6 KB Loader, ~28 KB Core, <strong>28 Sprachen</strong>, keine Cookies, kein Tracking, kein DOM/ARIA-Override deiner Seite.',
    codeCaption: 'Diese eine Zeile einbauen — das war’s:',
    copy: 'Kopieren',
    copied: 'Kopiert ✓',
    openBtn: 'Widget öffnen',
    resetBtn: 'Einstellungen zurücksetzen',
    hint: 'Oder nutze das Tastaturkürzel <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>A</kbd> — oder den Button unten rechts.',
  },

  facts: {
    loaderT: 'Loader',
    loaderV: '≤ 6 KB',
    loaderU: 'gzip',
    coreT: 'Core',
    coreV: '≤ 30 KB',
    coreU: 'gzip',
    localesT: 'Sprachen',
    localesV: '28',
    localesU: 'Locales',
    depsT: 'Dependencies',
    depsV: '0',
    depsU: 'zero runtime',
  },

  features: {
    heading: 'Warum dieses Widget',
    lead: 'Eine ehrliche Präferenz-Ebene — kein magischer Compliance-Knopf. Gebaut, um Nutzer:innen echten Mehrwert zu geben, ohne dein Markup anzufassen.',
    onelineT: 'Eine Zeile zur Integration',
    onelineB:
      'Ein einziges <code>&lt;script&gt;</code>-Tag, deferred. Kein Build-Schritt, kein Framework-Lock-in. Der Core lädt erst, wenn jemand das Panel wirklich öffnet.',
    nodomT: 'Kein DOM/ARIA-Override',
    nodomB:
      'Das Widget schreibt dein Markup oder ARIA nie um. Es legt Nutzer-Präferenzen darüber — und kann so nie eine bereits barrierefreie Seite kaputtmachen.',
    privacyT: 'Kein Tracking, keine Cookies',
    privacyB:
      'Keine Analytics, keine Drittanbieter-Calls, keine Cookies. Alle Präferenzen liegen im <code>localStorage</code> auf dem Gerät der Besucher:innen.',
    i18nT: '28 Sprachen, RTL-fähig',
    i18nB:
      'Erkennt die Browsersprache automatisch und rendert das Panel entsprechend — inklusive vollständigem Rechts-nach-Links-Layout für Arabisch, Hebräisch, Persisch und Urdu.',
    profilesT: 'Kuratierte Profile',
    profilesB:
      'Sechs Ein-Klick-Presets (Sehen, Motorik, Kognition, anfallsicher, ADHS, Screenreader) bündeln die passenden Features für echte Bedürfnisse.',
    lightT: 'Leichtgewichtig per Design',
    lightB:
      'Ein ~6 KB Loader — kleiner als die meisten Analytics-Snippets. Der schwerere Core wird bei Bedarf nachgeladen und ist beim Build budget-gedeckelt.',
    explore:
      'Entdecke das Widget: <a href="/configuration.html">Konfiguration</a> · <a href="/api.html">API</a> · <a href="/events.html">Events</a> · <a href="/playground.html">Playground</a>.',
  },

  profiles: {
    heading: 'Profil ausprobieren',
    lead: 'Ein Klick aktiviert ein kuratiertes Set aus Features via <code>AccessibilityWidget.applyProfile()</code>. Änderungen sind <strong>sofort sichtbar</strong> auf dieser Seite und persistieren.',
    footnote:
      'Kein passendes Profil? <button type="button" class="link-btn" data-action="open">Alle Features einzeln wählen →</button>',
    visionLabel: 'Sehbehinderung',
    visionHint: 'Größere Schrift · Hoher Kontrast · Links hervorheben',
    motorLabel: 'Motorik',
    motorHint: 'Großer Cursor · Animationen pausiert · Dicker Fokus',
    cognitiveLabel: 'Kognition',
    cognitiveHint: 'Dyslexie-Schrift · Zeilenabstand · Leseführung',
    seizureLabel: 'Anfallsicher',
    seizureHint: 'Animationen pausiert · Graustufen',
    adhdLabel: 'ADHS',
    adhdHint: 'Lesemaske · Animationen pausiert · Fokusring',
    blindLabel: 'Blind (Screenreader)',
    blindHint: 'Strukturnavigation · Links hervorheben · Fokusring',
  },

  trial: {
    heading: 'Sprache & Zurücksetzen',
    lead: 'Alle Änderungen werden im <code>localStorage</code> persistiert und vor dem ersten Render angewendet — ohne FOUC.',
    localeKicker: 'Live, ohne Reload',
    localeTitle: 'Sprache wechseln',
    localeBody:
      '28 Sprachen verfügbar. Das Panel rerendert live via <code>AccessibilityWidget.setLocale()</code>, persistiert im Widget-State.',
    localeLabel: 'Widget-Sprache',
    resetKicker: 'Alles zurück',
    resetTitle: 'Präferenzen löschen',
    resetBody:
      'Löscht den <code>localStorage</code>-Key und lädt die Seite neu. Das Widget kommt zurück in den <em>niemals-konfigurierten</em>-Zustand.',
    resetBtn: 'Zurücksetzen & neu laden',
  },

  sample: {
    heading: 'Beispielinhalt',
    lead: 'Dieser Text reagiert auf alle Widget-Einstellungen. Aktiviere Schriftgröße, Kontrast oder Lesehilfen und beobachte die Veränderung hier.',
    legalTitle: 'Rechtlicher Hintergrund',
    legalBody1:
      'Seit dem 28. Juni 2025 verpflichtet das <a href="https://www.gesetze-im-internet.de/bfsg/" rel="noopener">Barrierefreiheitsstärkungsgesetz (BFSG)</a> fast alle B2C-Anbieter zu digitaler Barrierefreiheit. Grundlage ist die EU-Richtlinie (EU) 2019/882 (European Accessibility Act, EAA), technisch umgesetzt über EN 301 549 — die wiederum auf <a href="https://www.w3.org/TR/WCAG22/" rel="noopener">WCAG 2.2 AA</a> verweist.',
    legalBody2:
      'Ein Widget ersetzt keinen sauberen Code. Aber eine gut implementierte Präferenz-Ebene (Kontrast, Schriftgröße, Fokusrahmen, TTS) ist ein echter Gewinn für Nutzer:innen — und ein sichtbares Bekenntnis des Betreibers.',
    animTitle: 'Animations-Test',
    animBody:
      'Dieser Punkt pulsiert, bis du im Widget <em>Animationen pausieren</em> aktivierst. Das Widget respektiert zusätzlich <code>prefers-reduced-motion</code>.',
  },

  quickstart: {
    heading: 'Integration',
    lead: 'Ein Script-Tag deckt 95 % der Fälle ab. Für Build-Tools und 13 Framework-/CMS-/Shop-Integrationen siehe die Optionen unten.',
    cdnKicker: 'Empfohlen',
    cdnTitle: 'CDN — eine Zeile',
    cdnBody:
      'Der <code>v1</code>-Alias liefert immer das neueste Release im Major. Erkennt die Sprache automatisch, rendert den FAB unten rechts, persistiert Präferenzen.',
    prodTitle: 'Produktion: Version pinnen + SRI',
    prodBody:
      'Pinne einen unveränderlichen <code>…/&lt;version&gt;/…</code>-Pfad und sichere ihn mit Subresource Integrity. Per-Release-Hashes liegen unter <code>…/&lt;version&gt;/integrity.json</code>.',
    npmKicker: 'Bundler',
    npmTitle: 'npm',
    npmBody:
      'Installiere <code>@bauer-group/accessibility-widget</code> für typisierte Config und Asset-Pfade in deiner Build-Pipeline.',
    integrationsKicker: '13 Integrationen',
    integrationsTitle: 'Frameworks, CMS & Shops',
    integrationsBody:
      'React · Vue · Angular · Svelte · Next.js · Nuxt · Astro · WordPress · TYPO3 · Drupal · Shopify · Shopware · Magento — gepflegt im eigenen Repo.',
    integrationsLink: 'Integrations-Repo öffnen →',
    tabsLabel: 'Integrations-Beispiele',
    note: 'Ein einzelnes <code>&lt;script&gt;</code>-Tag reicht — die Wrapper unten sind Komfort, keine Voraussetzung.',
  },

  api: {
    heading: 'Runtime-API — live',
    lead: 'Jede Methode von <code>window.AccessibilityWidget</code> mit einem Klick. Das Ergebnis der letzten Aktion erscheint rechts.',
    controlHeading: 'Kontrolle',
    featuresHeading: 'Features & Profile',
    langHeading: 'Sprache',
    posHeading: 'FAB-Position',
    inspectHeading: 'Inspektion',
    resultHeading: 'Result',
    resultPlaceholder: 'Klicke links eine API-Methode, um Ergebnis & Rückgabewert zu sehen.',
    methodsTitle: 'Methoden',
    colMethod: 'Methode',
    colSignature: 'Signatur',
    colPurpose: 'Zweck',
    mOpen: 'Panel öffnen (lädt den Core bei Bedarf)',
    mClose: 'Panel schließen',
    mReset: 'Alle Präferenzen löschen + Seite neu laden',
    mSet: 'Einzelnes Feature umschalten',
    mApply: 'Profil-Preset anwenden (6 Profile)',
    mLocale: 'Sprache zur Laufzeit wechseln (persistent, Panel rerendert live)',
    mPosition: 'FAB auf { x, y } setzen oder mit null zum Anker zurück',
    mState: 'Den persistierten Zustand synchron lesen',
    mOn: 'Ein Event abonnieren, gibt eine Unsubscribe-Funktion zurück',
    eventsTitle: 'Events',
    colEvent: 'Event',
    colPayload: 'Payload',
    colFires: 'Feuert bei',
    eStateChange: 'Jeder Zustandsänderung (Feature, Profil, Locale, Reset)',
    eOpen: 'Öffnen des Panels',
    eClose: 'Schließen des Panels',
    eProfile: 'Anwenden eines Profil-Presets',
    eLocale: 'Wechsel der Sprache',
    eReset: 'Löschen aller Präferenzen',
  },

  events: {
    heading: 'Event-Stream',
    lead: 'Live-Log aller <code>AccessibilityWidget</code>-Events (CustomEvents auf <code>document</code> unter <code>accessibility-widget:*</code>). Privacy-friendly: die Payloads bleiben hier, werden nirgends gesendet.',
    clear: 'Log leeren',
    cleared: 'Log geleert. Neue Events erscheinen hier.',
    empty: 'Noch keine Events. Klicke im API-Explorer oder im Panel.',
    refLead:
      'Abonniere mit <code>AccessibilityWidget.on(name, cb)</code> — es gibt eine Unsubscribe-Funktion zurück.',
  },

  state: {
    heading: 'Live-State',
    hint: 'JSON-Dump des persistierten Widget-Zustands — aktualisiert sich live',
    note: 'Quelle: <code>window.AccessibilityWidget.getState()</code> — Poll-Intervall 500 ms.',
  },

  compliance: {
    heading: 'Compliance',
    lead: 'Das Widget orientiert sich an drei überlappenden Regelwerken:',
    bfsgBody:
      'Barrierefreiheitsstärkungsgesetz — nationale Umsetzung der EAA. Gilt in Deutschland ab 28.06.2025 für fast alle B2C-Anbieter.',
    bfsgLink: 'Gesetzestext →',
    enBody:
      'Europäische Norm für digitale Barrierefreiheit. Referenziert WCAG und fügt ICT-spezifische Anforderungen hinzu.',
    enLink: 'ETSI-Dokument →',
    wcagBody:
      'Web Content Accessibility Guidelines des W3C. De-facto globaler Standard für barrierefreies Web-Design.',
    wcagLink: 'W3C-Recommendation →',
  },

  faq: {
    heading: 'FAQ',
    q1: 'Macht das Widget meine Seite automatisch konform?',
    a1: 'Nein — und wer automatische Konformität verspricht, ist unseriös. Kein Widget kann fehlerhaftes Markup reparieren oder fehlende Semantik ergänzen. Was es hinzufügt, ist eine echte nutzerseitige Präferenz-Ebene — Kontrast, Schriftgröße, Abstände, Fokus, Lesehilfen und Vorlesefunktion — zusätzlich zu dem barrierefreien Code, der weiterhin in deiner Verantwortung liegt. Verstehe es als Ergänzung zur Konformitätsarbeit, niemals als Ersatz.',
    q2: 'Verändert es mein HTML oder ARIA?',
    a2: 'Nein. Das Widget schreibt weder deinen DOM noch deine ARIA-Attribute um. Jede Präferenz wird über eine eigene, isolierte Ebene angewendet — Daten-Attribute am Wurzelelement und ein gekapseltes Stylesheet. Eine bereits barrierefreie Seite kann es so nicht beschädigen und assistive Technologien nicht stören.',
    q3: 'Wie groß ist es wirklich?',
    a3: 'Der Loader ist ≤ 6 KB gzip — kleiner als die meisten Analytics-Snippets — und mehr wird beim ersten Laden nicht ausgeliefert. Der ≤ 30 KB große Core wird erst bei Bedarf nachgeladen, sobald jemand das Panel öffnet. Beide Budgets werden beim Build automatisch erzwungen und können nicht unbemerkt anwachsen.',
    q4: 'Gibt es Tracking oder Cookies?',
    a4: 'Keinerlei. Kein Tracking, keine Analytics, keine Drittanbieter-Requests, keine Cookies, kein Fingerprinting. Jede Präferenz wird lokal im Browser der Besucher:innen via localStorage gespeichert und verlässt das Gerät nie.',
    q5: 'Ist es DSGVO-konform? Brauche ich ein Consent-Banner?',
    a5: 'Ja, und ein Banner ist nicht erforderlich. Da das Widget keine personenbezogenen Daten verarbeitet und keine Cookies setzt, entstehen keine Einwilligungspflichten nach DSGVO. Präferenzen bleiben auf dem Gerät der Besucher:innen und werden weder an uns noch an Dritte übertragen.',
    q6: 'Was kostet es und wie ist es lizenziert?',
    a6: 'Dual-lizenziert: AGPL-3.0-only für Open-Source-Projekte oder eine kommerzielle Lizenz für Closed-Source- und proprietäre Deployments. Für kommerzielle Konditionen und Support-Optionen die BAUER GROUP kontaktieren.',
  },

  scanner: {
    heading: 'Scanner-Testzone',
    hint: 'Enthält <strong>bewusst</strong> WCAG-Violations',
    lead: 'Diese Seite dient automatisierten Scannern (axe-core, pa11y, Lighthouse, Playwright-AxE) als Ziel. In einem Produktivsystem wären diese Barrieren behoben — hier existieren sie als stabile Testfälle:',
    v1: '<code>&lt;img&gt;</code> ohne <code>alt</code>-Attribut',
    v2: 'Link-Text „hier klicken“ (nicht kontextbezogen)',
    v3: 'Button mit Kontrast &lt; 4.5:1',
    v4: 'Formular-<code>&lt;input&gt;</code> ohne Label',
    note: 'Preview-Port für den Scanner: <code>http://localhost:4173</code> (nach <code>pnpm demo:build &amp;&amp; pnpm demo:preview</code>).',
    imgMore: 'hier klicken',
    imgMoreSuffix: ' für mehr.',
    grayBtn: 'Graue Aktion',
    inputPh: 'Name',
    submit: 'Absenden',
  },

  footer: {
    license: 'AGPL-3.0-only / kommerziell',
    versionLabel: 'Version',
    sri: 'SRI-Hashes',
    npmLink: 'Quellcode (npm)',
    statement: 'Barrierefreiheitserklärung',
    impressum: 'Impressum',
  },

  statement: {
    title: 'Erklärung zur Barrierefreiheit',
    back: '← Zurück zur Demo',
    intro:
      'Die BAUER GROUP ist bemüht, die Website <strong>Accessibility Widget</strong> im Einklang mit dem Barrierefreiheitsstärkungsgesetz (BFSG) und der EN 301 549 / WCAG 2.2 AA barrierefrei zu gestalten.',
    conformanceTitle: 'Stand der Vereinbarkeit',
    conformanceBody:
      'Diese Website ist <strong>teilweise konform</strong>. Die auf der <a href="/">Demo-Seite</a> aufgeführten Barrieren sind <em>absichtlich</em> eingebaut und dienen als Scanner-Testziel. In einem echten Produktivsystem wären sie behoben.',
    contactTitle: 'Kontakt / Feedback (§ 14 BFSG)',
    contactBody:
      'BAUER GROUP<br />Web: <a href="https://www.bauer-group.com" rel="noopener">www.bauer-group.com</a>',
    enforcementTitle: 'Durchsetzungsverfahren',
    enforcementBody:
      'Erhältst du keine zufriedenstellende Antwort, kannst du dich an die Schlichtungsstelle des Bundes wenden:<br />Schlichtungsstelle des Bundes für Barrierefreiheit<br />Mauerstraße 53, 10117 Berlin<br />E-Mail: <a href="mailto:info@schlichtungsstelle-bfsg.de">info@schlichtungsstelle-bfsg.de</a>',
    createdTitle: 'Erstellung dieser Erklärung',
    createdBody: 'Erstellt am 21. April 2026. Letzte Bewertung: 21. April 2026.',
  },

  impressum: {
    title: 'Impressum',
    back: '← Zurück zur Demo',
    body: 'Dies ist eine Demo-Seite ohne produktiven Inhalt.',
    addressName: 'BAUER GROUP',
    addressLines: 'Demo-Adresse',
    web: 'Web',
  },

  config: {
    kicker: 'Referenz · interaktiv',
    heading: 'Konfiguration',
    lead: 'Jede Option von <code>window.AccessibilityWidgetConfig</code>, lückenlos. Ändere ein Steuerelement, um das Snippet live zu erzeugen, sieh dir Panel-relevante Optionen sofort an oder klicke <strong>Anwenden &amp; neu laden</strong>, damit auch Lade-Optionen greifen.',
    badgeLive: 'live',
    legendLive: '— wirkt sofort',
    badgeReload: 'neu laden',
    legendReload: '— wirkt nach „Anwenden & neu laden“',
    snippetTitle: 'Deine Konfiguration',
    snippetEmpty: 'Nur Standardwerte — ändere ein Steuerelement, um deine Konfiguration zu bauen.',
    preview: 'Im Panel ansehen',
    apply: 'Anwenden & neu laden',
    reset: 'Zurücksetzen',
    note: '„Anwenden & neu laden“ legt diese Konfiguration in sessionStorage ab und lädt neu, sodass auch Lade-Optionen in der gesamten Demo greifen.',
    grp: {
      assets: 'Asset-Laden',
      locale: 'Lokalisierung',
      branding: 'UI & Branding',
      persistence: 'Persistenz',
      features: 'Feature-Steuerung',
      legal: 'Recht & Compliance',
      behavior: 'Verhalten',
    },
    f: {
      corePath: { l: 'Core-Pfad', d: 'URL des On-Demand-Core-Bundles.' },
      cssPath: { l: 'CSS-Pfad', d: 'URL des Widget-Stylesheets.' },
      coreIntegrity: {
        l: 'Core-SRI-Hash',
        d: 'Subresource-Integrity-Hash für das Core-Bundle (sha384-…).',
      },
      cssIntegrity: {
        l: 'CSS-SRI-Hash',
        d: 'Subresource-Integrity-Hash für das Stylesheet.',
      },
      locale: {
        l: 'Widget-Sprache',
        d: 'Panel-Sprache. „auto“ erkennt anhand von Seite/Browser.',
      },
      position: { l: 'FAB-Position', d: 'Ankerecke des Buttons.' },
      offset: { l: 'Offset x / y (px)', d: 'Abstand zur Ankerecke.' },
      zIndex: {
        l: 'z-index',
        d: 'Stapelreihenfolge des FAB. Standard ist eins unter max int32.',
      },
      primaryColor: { l: 'Primärfarbe', d: 'Hintergrundfarbe des FAB.' },
      buttonLabel: {
        l: 'Button-Label',
        d: 'Überschreibt das aria-label des FAB. Leer → lokalisierter Standard.',
      },
      storageKey: { l: 'Storage-Key', d: 'localStorage-Schlüssel für Nutzereinstellungen.' },
      initialFeatures: {
        l: 'Initiale Features',
        d: 'Für Erstbesucher aktiviert (vor jedem gespeicherten Zustand).',
      },
      disabledFeatures: {
        l: 'Deaktivierte Features',
        d: 'Komplett aus dem Panel entfernt (auch in Profilen gesperrt).',
      },
      statementUrl: {
        l: 'Statement-URL',
        d: 'Link zu deiner Barrierefreiheitserklärung (im Footer gerendert). Standard: kein Link. javascript:/data: werden abgelehnt.',
      },
      disclaimer: { l: 'Disclaimer', d: 'Freier Footer-Text (reiner Text — kein HTML).' },
      hidePoweredBy: {
        l: '„Bereitgestellt von“ ausblenden',
        d: 'White-Label: blendet die Attributionszeile aus.',
      },
      draggableFab: {
        l: 'Verschiebbarer FAB',
        d: 'Endnutzer können den Button verschieben (Zeiger oder Shift+Pfeil).',
      },
      keyboardShortcut: {
        l: 'Tastenkürzel',
        d: 'Kombination zum Öffnen des Panels, z. B. ctrl+alt+a, f2. Leerer String deaktiviert es.',
      },
      respectReducedMotion: {
        l: 'Reduzierte Bewegung beachten',
        d: 'Berücksichtigt prefers-reduced-motion für Bewegungs-Features.',
      },
      hideOnPrint: { l: 'Im Druck ausblenden', d: 'Blendet den FAB in @media print aus.' },
      debug: { l: 'Debug', d: 'console.warn für sonst stille Fehler.' },
    },
  },
};
