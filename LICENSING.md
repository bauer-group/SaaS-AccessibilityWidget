# Licensing

<a id="english"></a>

> How the dual license works — use the Accessibility Widget under GNU AGPL-3.0-only (open source) OR a commercial license.

**🇬🇧 English** · [🇩🇪 Deutsch](#-deutsch)

`Accessibility Widget` is **dual-licensed**. You may use it under exactly one of the two licenses below — you choose whichever fits your case.

## 1. Open source: GNU AGPL-3.0-only

Free to use, modify and redistribute under the terms of the **GNU Affero General Public License, version 3.0 only** (see `LICENSE`).

Core obligation: anyone who embeds, modifies, or offers the widget as a (hosted) service must make the **complete corresponding source code** — including their own changes — available to users under the AGPL-3.0. This applies explicitly even when users only interact with the software over a network (AGPL §13). Delivering the (even minified) JavaScript to the browser is already a "conveying" and triggers the disclosure obligation.

For most first-party embeds (e.g. a company using the widget for its own BFSG compliance on its website), the AGPL is entirely sufficient and free.

## 2. Commercial license

If you want to integrate the widget into a **proprietary / closed product**, **redistribute it as part of a paid product or service**, or otherwise **not** be subject to the AGPL disclosure obligations, you need a commercial license.

The commercial license lifts the AGPL's copyleft / disclosure obligations for you. It is paid and available directly from the rights holder.

**Inquiries:** `info@bauer-group.com`

---

## Why dual?

The AGPL makes _closed_ resale economically pointless: a reseller would have to hand every customer the complete source code under the AGPL, who may then redistribute it freely. Anyone who still wants to sell closed must acquire a commercial license **from the rights holder** — so the value flows to where the code is created, not to free riders.

## Attribution (AGPL §7b)

Per AGPL-3.0 §7(b), keeping the existing copyright and attribution notices is mandatory. Do not remove `SPDX-FileCopyrightText` lines or any existing "Powered by" notice in the shipped widget. These notices may not be removed under the AGPL — not even by resellers.

## SPDX / `package.json`

The shipped bundles carry the SPDX license banner; the header template for new source files is in `license-header.txt`:

```
SPDX-License-Identifier: AGPL-3.0-only
```

In `package.json`:

```json
{
  "license": "AGPL-3.0-only"
}
```

The commercial option cannot be expressed cleanly as an SPDX expression in npm; it is documented via this file (`LICENSING.md`). If you need the dual model to be machine-readable, you can use the expression `AGPL-3.0-only OR LicenseRef-Commercial` in the source headers (REUSE-compliant) while keeping `AGPL-3.0-only` in `package.json`.

---

## README block (to paste into the README)

> ## License
>
> `Accessibility Widget` is dual-licensed:
>
> - **GNU AGPL-3.0-only** for open-source use (see [`LICENSE`](./LICENSE)).
> - **Commercial license** for use in closed/proprietary products or without the AGPL disclosure obligations — available at `info@bauer-group.com`.
>
> Details: [`LICENSING.md`](./LICENSING.md). Contributions only with a signed [CLA](./CLA.md).
>
> **No conformance guarantee:** this widget is a technical aid. It does **not** establish legally binding conformance with the BFSG, EN 301 549 or WCAG 2.2 and is no substitute for a professional audit. Use at your own risk (see the disclaimer of the respective license).

---

<a id="-deutsch"></a>

## 🇩🇪 Deutsch

> So funktioniert die Dual-Lizenz — nutze das Accessibility Widget unter GNU AGPL-3.0-only (Open Source) ODER einer kommerziellen Lizenz.

[🇬🇧 English](#english) · **🇩🇪 Deutsch**

`Accessibility Widget` wird **dual lizenziert**. Du kannst es unter genau einer der beiden folgenden Lizenzen nutzen — du wählst, welche für deinen Fall passt.

### 1. Open Source: GNU AGPL-3.0-only

Frei nutzbar, veränderbar und weiterverteilbar unter den Bedingungen der **GNU Affero General Public License, Version 3.0 only** (siehe `LICENSE`).

Kernpflicht: Wer das Widget einbettet, verändert oder als (gehosteten) Dienst anbietet, muss den **vollständigen, entsprechenden Quellcode** — inklusive eigener Änderungen — den Nutzern unter der AGPL-3.0 zugänglich machen. Das gilt ausdrücklich auch dann, wenn die Nutzer nur über das Netzwerk mit der Software interagieren (AGPL §13). Auslieferung des (auch minifizierten) JavaScripts an den Browser ist bereits ein „conveying" und löst die Offenlegungspflicht aus.

Für die meisten Eigen-Einbindungen (z. B. ein Unternehmen, das das Widget zur eigenen BFSG-Konformität auf seiner Website nutzt) ist die AGPL völlig ausreichend und kostenlos.

### 2. Kommerzielle Lizenz

Wenn du das Widget in ein **proprietäres / geschlossenes Produkt** integrieren, es **als Teil eines kostenpflichtigen Produkts oder Dienstes weitergeben**, oder aus anderen Gründen **nicht** den AGPL-Offenlegungspflichten unterliegen willst, benötigst du eine kommerzielle Lizenz.

Die kommerzielle Lizenz hebt die Copyleft-/Offenlegungspflichten der AGPL für dich auf. Sie ist kostenpflichtig und direkt beim Rechteinhaber erhältlich.

**Anfrage:** `info@bauer-group.com`

### Warum dual?

Die AGPL macht das _geschlossene_ Weiterverkaufen ökonomisch sinnlos: Ein Reseller müsste jedem Kunden den kompletten Quellcode unter AGPL aushändigen, der ihn dann frei weitergeben darf. Wer trotzdem closed verkaufen will, muss eine kommerzielle Lizenz **beim Rechteinhaber** erwerben — damit fließt die Wertschöpfung dorthin, wo der Code entsteht, nicht an Trittbrettfahrer.

### Attribution / Namensnennung (AGPL §7b)

Gemäß AGPL-3.0 §7(b) ist die Beibehaltung der bestehenden Urheber- und Attributionshinweise verpflichtend. Entferne keine `SPDX-FileCopyrightText`-Zeilen und keinen vorhandenen „Powered by"-Hinweis im ausgelieferten Widget. Diese Hinweise dürfen unter der AGPL nicht entfernt werden — auch nicht von Resellern.

### SPDX / `package.json`

Die ausgelieferten Bundles tragen den SPDX-Lizenz-Banner; das Header-Template für neue Quelldateien steht in `license-header.txt`:

```
SPDX-License-Identifier: AGPL-3.0-only
```

In `package.json`:

```json
{
  "license": "AGPL-3.0-only"
}
```

Die kommerzielle Option lässt sich in npm nicht sauber als SPDX-Ausdruck abbilden; sie wird über diese Datei (`LICENSING.md`) dokumentiert. Wer die Maschinenlesbarkeit des dualen Modells braucht, kann in den Quell-Headern den Ausdruck `AGPL-3.0-only OR LicenseRef-Commercial` verwenden (REUSE-konform), in `package.json` aber bei `AGPL-3.0-only` bleiben.

### README-Block (zum Einfügen in die README)

> ## Lizenz
>
> `Accessibility Widget` ist dual lizenziert:
>
> - **GNU AGPL-3.0-only** für Open-Source-Nutzung (siehe [`LICENSE`](./LICENSE)).
> - **Kommerzielle Lizenz** für die Nutzung in geschlossenen/proprietären Produkten oder ohne AGPL-Offenlegungspflichten — erhältlich unter `info@bauer-group.com`.
>
> Details: [`LICENSING.md`](./LICENSING.md). Beiträge nur mit unterzeichnetem [CLA](./CLA.md).
>
> **Keine Zusicherung der Rechtskonformität:** Dieses Widget ist ein technisches Hilfsmittel. Es stellt **keine** rechtsverbindliche Konformität mit dem BFSG, der EN 301 549 oder den WCAG 2.2 her und ersetzt keine fachliche Prüfung. Nutzung auf eigenes Risiko (siehe Haftungsausschluss der jeweiligen Lizenz).

---

_Last revised / Letzte Überarbeitung: 2026-06-21_
