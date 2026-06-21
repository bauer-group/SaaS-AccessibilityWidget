# Security Policy

<a id="english"></a>

> How to report a vulnerability in the BAUER GROUP Accessibility Widget, which versions are supported, and the security principles behind the widget, API and scanner.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

## Supported Versions

The latest minor version of the `1.x` line receives security fixes.

## Reporting a vulnerability

Do **not** post it as a public issue. Please email **security@bauer-group.com** with:

- Affected package / app
- Reproduction (minimal)
- Expected vs. actual behavior
- Attack vector / impact

Response within 5 business days. Public disclosure after fix deployment + 7 days.

## Principles

- Widget: no external network requests, no tracking, only `localStorage`.
- API: bearer token (ENV-based in v1, DB-backed from v1.1), rate limiting, strict CORS.
- Scanner: Playwright sandboxed, no user-data persistence without opt-in.
- No secrets in commits — `.env` gitignored, `.env.example` documents all variables.

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> Wie Sie eine Sicherheitslücke im BAUER GROUP Accessibility Widget melden, welche Versionen unterstützt werden und die Sicherheitsgrundsätze hinter Widget, API und Scanner.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

### Supported Versions

Die jeweils letzte Minor-Version der `1.x`-Linie erhält Security-Fixes.

### Vulnerability melden

**Nicht** als öffentliches Issue posten. Bitte per E-Mail an **security@bauer-group.com** mit:

- Betroffenes Paket / App
- Reproduktion (minimal)
- Erwartetes vs. tatsächliches Verhalten
- Angriffsvektor / Impact

Antwort innerhalb 5 Werktagen. Public Disclosure nach Fix-Deployment + 7 Tage.

### Grundsätze

- Widget: keine externen Netzanfragen, kein Tracking, nur `localStorage`.
- API: Bearer-Token (ENV-basiert in v1, DB-gestützt ab v1.1), Rate-Limiting, CORS strikt.
- Scanner: Playwright sandboxed, keine User-Data-Persistenz ohne Opt-in.
- Keine Secrets in Commits — `.env` gitignored, `.env.example` dokumentiert alle Variablen.
