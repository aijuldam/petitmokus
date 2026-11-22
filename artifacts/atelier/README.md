# Petit Mokus Atelier

The Petit Mokus shop runs on Fourthwall at https://atelier.petitmokus.com. Fourthwall has no API for its theme or menus, so this folder holds the brand and the menu as generated files, built from the same sources as petitmokus.com:

- `artifacts/site/src/styles/tokens.css`: colours, radius, font.
- `artifacts/site/src/data/products.json`: the product registry (Atelier is the `atelier` entry).

| Command (from `artifacts/site`) | What it does                                                    |
| ------------------------------- | --------------------------------------------------------------- |
| `pnpm atelier:theme`            | Rewrites `generated/` from the tokens and the registry          |
| `pnpm build`                    | Fails if `generated/` is out of date (the build runs the check) |
| `pnpm atelier:live`             | Compares the colours and font set in Fourthwall with the tokens |

After any token or registry change: run `pnpm atelier:theme`, commit, then apply `generated/theme.md`, `generated/header-code.html` and `generated/menu.md` in the Fourthwall dashboard, and run `pnpm atelier:live`.
