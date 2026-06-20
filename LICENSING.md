# Lizenzierung

`Accessibility Widget` wird **dual lizenziert**. Du kannst es unter genau einer der beiden
folgenden Lizenzen nutzen — du wählst, welche für deinen Fall passt:

## 1. Open Source: GNU AGPL-3.0-only

Frei nutzbar, veränderbar und weiterverteilbar unter den Bedingungen der
**GNU Affero General Public License, Version 3.0 only** (siehe `LICENSE`).

Kernpflicht: Wer das Widget einbettet, verändert oder als (gehosteten) Dienst
anbietet, muss den **vollständigen, entsprechenden Quellcode** — inklusive eigener
Änderungen — den Nutzern unter der AGPL-3.0 zugänglich machen. Das gilt ausdrücklich
auch dann, wenn die Nutzer nur über das Netzwerk mit der Software interagieren
(AGPL §13). Auslieferung des (auch minifizierten) JavaScripts an den Browser ist
bereits ein „conveying" und löst die Offenlegungspflicht aus.

Für die meisten Eigen-Einbindungen (z. B. ein Unternehmen, das das Widget zur
eigenen BFSG-Konformität auf seiner Website nutzt) ist die AGPL völlig ausreichend
und kostenlos.

## 2. Kommerzielle Lizenz

Wenn du das Widget in ein **proprietäres / geschlossenes Produkt** integrieren,
es **als Teil eines kostenpflichtigen Produkts oder Dienstes weitergeben**, oder
aus anderen Gründen **nicht** den AGPL-Offenlegungspflichten unterliegen willst,
benötigst du eine kommerzielle Lizenz.

Die kommerzielle Lizenz hebt die Copyleft-/Offenlegungspflichten der AGPL für dich
auf. Sie ist kostenpflichtig und direkt beim Rechteinhaber erhältlich.

**Anfrage:** `info@bauer-group.com`

---

## Warum dual?

Die AGPL macht das _geschlossene_ Weiterverkaufen ökonomisch sinnlos: Ein Reseller
müsste jedem Kunden den kompletten Quellcode unter AGPL aushändigen, der ihn dann
frei weitergeben darf. Wer trotzdem closed verkaufen will, muss eine kommerzielle
Lizenz **beim Rechteinhaber** erwerben — damit fließt die Wertschöpfung dorthin,
wo der Code entsteht, nicht an Trittbrettfahrer.

## Attribution / Namensnennung (AGPL §7b)

Gemäß AGPL-3.0 §7(b) ist die Beibehaltung der bestehenden Urheber- und
Attributionshinweise verpflichtend. Entferne keine `SPDX-FileCopyrightText`-Zeilen
und keinen vorhandenen „Powered by"-Hinweis im ausgelieferten Widget. Diese
Hinweise dürfen unter der AGPL nicht entfernt werden — auch nicht von Resellern.

## SPDX / `package.json`

In jeder Quelldatei steht der Kurz-Header (siehe `license-header.txt`):

```
SPDX-License-Identifier: AGPL-3.0-only
```

In `package.json`:

```json
{
  "license": "AGPL-3.0-only"
}
```

Die kommerzielle Option lässt sich in npm nicht sauber als SPDX-Ausdruck abbilden;
sie wird über diese Datei (`LICENSING.md`) dokumentiert. Wer die Maschinenlesbarkeit
des dualen Modells braucht, kann in den Quell-Headern den Ausdruck
`AGPL-3.0-only OR LicenseRef-Commercial` verwenden (REUSE-konform), in
`package.json` aber bei `AGPL-3.0-only` bleiben.

---

## README-Block (zum Einfügen in die README)

> ## Lizenz
>
> `Accessibility Widget` ist dual lizenziert:
>
> - **GNU AGPL-3.0-only** für Open-Source-Nutzung (siehe [`LICENSE`](./LICENSE)).
> - **Kommerzielle Lizenz** für die Nutzung in geschlossenen/proprietären Produkten
>   oder ohne AGPL-Offenlegungspflichten — erhältlich unter `info@bauer-group.com`.
>
> Details: [`LICENSING.md`](./LICENSING.md). Beiträge nur mit unterzeichnetem
> [CLA](./CLA.md).
>
> **Keine Zusicherung der Rechtskonformität:** Dieses Widget ist ein technisches
> Hilfsmittel. Es stellt **keine** rechtsverbindliche Konformität mit dem BFSG,
> der EN 301 549 oder den WCAG 2.2 her und ersetzt keine fachliche Prüfung.
> Nutzung auf eigenes Risiko (siehe Haftungsausschluss der jeweiligen Lizenz).

---

_Letzte Überarbeitung: 20.06.2026_
