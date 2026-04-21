# Security Policy

## Supported Versions

Die jeweils letzte Minor-Version der `1.x`-Linie erhält Security-Fixes.

## Vulnerability melden

**Nicht** als öffentliches Issue posten. Bitte per E-Mail an **security@bauer-group.com** mit:

- Betroffenes Paket / App
- Reproduktion (minimal)
- Erwartetes vs. tatsächliches Verhalten
- Angriffsvektor / Impact

Antwort innerhalb 5 Werktagen. Public Disclosure nach Fix-Deployment + 7 Tage.

## Grundsätze

- Widget: keine externen Netzanfragen, kein Tracking, nur `localStorage`.
- API: Bearer-Token (ENV-basiert in v1, DB-gestützt ab v1.1), Rate-Limiting, CORS strikt.
- Scanner: Playwright sandboxed, keine User-Data-Persistenz ohne Opt-in.
- Keine Secrets in Commits — `.env` gitignored, `.env.example` dokumentiert alle Variablen.
