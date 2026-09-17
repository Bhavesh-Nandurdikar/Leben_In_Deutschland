# BAMF data snapshot

The production app prefers a local snapshot at `public/data/bamf/questions.json` and `public/data/bamf/images/`.

After pushing this repository to GitHub, run the **Update BAMF question catalogue** workflow once from the Actions tab. It will build a fresh validated dataset from the official BAMF PDF and Online-Testcenter and open a pull request containing the snapshot.

Until that first snapshot is merged, the frontend temporarily falls back to the published `bamf-lid-dataset` endpoint so development continues to work.
