# Leben in Deutschland – Practice App

A React/Vite practice app for the German **Leben in Deutschland** question catalogue.

## Current features

- Select any of the 16 Bundesländer.
- **Lernmodus:** 300 general + 10 state-specific questions.
- **Prüfungssimulation:** 30 random general + 3 random state questions, 60-minute timer.
- Previous/next navigation, direct question overview, unanswered tracking and an explicit **Test beenden** flow.
- Result review for correct, incorrect and unanswered questions.
- Local browser history under **Mein Fortschritt** (last 30 completed attempts).
- Responsive UI for desktop and mobile.
- Monthly GitHub Actions workflow for refreshing the BAMF catalogue.

## Question data

The frontend first reads:

```text
/public/data/bamf/questions.json
/public/data/bamf/images/*
```

The repository includes a monthly workflow in `.github/workflows/update-bamf.yml`. It runs on the first day of each month and can also be started manually from GitHub Actions.

The workflow uses the open-source `bamf-lid-dataset` build tooling to rebuild the catalogue from the official BAMF **Gesamtfragenkatalog PDF** and **Online-Testcenter**, validates the result, and opens a pull request when the snapshot changes.

### Important first-time step

After pushing this code to GitHub, run **Actions → Update BAMF question catalogue → Run workflow** once and merge the generated PR. That vendors the current 460-question dataset and images into your repository.

Before that first local snapshot exists, the development app falls back to the published `bamf-lid-dataset` endpoint.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Validate a generated local BAMF snapshot:

```bash
node scripts/validate-bamf-data.mjs
```

## User accounts

Completed attempts are currently stored locally in the browser. The app is structured so this result-history layer can later be swapped for Firebase Authentication + Firestore without changing the quiz flow.

The next account milestone is:

- guest access remains available;
- optional Google/email sign-in;
- sync attempt history across devices;
- Firestore security rules so users can access only their own data.

Firebase credentials are intentionally not hardcoded into this repository.

## Disclaimer

This is an independent learning aid and not an official BAMF website. Verify authoritative information against the current BAMF sources before publication.
