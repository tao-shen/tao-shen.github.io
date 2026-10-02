# Tao Shen / 沈弢

The source for Tao Shen's personal homepage: academic research, publications, and entrepreneurship at Democra AI.

## Local development

```sh
cd homepage
npm ci
npm run build
npm run dev
```

Open `http://localhost:4178`. The server binds only to `127.0.0.1`. Rebuild after editing.

## Content

- `src/content.js`: English and Chinese biography, project descriptions, links, and interface text.
- `src/publications.js`: 23 publication records, six selected papers, authorship, BibTeX, and education.
- `src/App.jsx`: responsive layout, language/theme controls, publication search, filters, and citation copy.
- `src/styles.css`: typography, sage palette, responsive rules, and accessibility states.
- `public/images/`: original product illustrations and the public Google Scholar portrait.

The current portrait is 128×128. Replace `public/images/tao-shen-scholar.jpg` with a higher-resolution original to improve the desktop image.

## Sources

Biography and education were adapted from the earlier homepage and CV, updated to reflect PhD completion in 2025. Publications were reconciled against [Google Scholar](https://scholar.google.com/citations?user=MeaDj20AAAAJ&hl=en), publisher records, arXiv, OpenReview, and PMLR. Duplicate versions and an authorship mismatch in the Scholar profile were excluded. Ongoing research collaborations may have publication dates after the PhD.

Current projects follow the public [Democra AI website](https://democra.ai/), [Candy](https://github.com/democra-ai/candy-shop), [AIR](https://air.democra.ai/), and [Nativize](https://democra.ai/ai-native). Planned capabilities are not presented as completed work.

The layout takes visual inspiration from [Didi Zhu's homepage](https://didizhu-judy.github.io/). The implementation and product illustrations are original. Fonts and all page assets are bundled locally.

## Publishing and rollback

Pull requests run a static build without publishing. Changes merged to `main` under `homepage/` trigger the deployment workflow. The output is overlaid on `gh-pages`, retaining existing deep links and deployment history without a force push. Older Jekyll source remains in the repository for reference and is no longer used by the active deployment workflow.

The previous live homepage commit is `d73838347142b510d74f89594fe2f0313b7391a4`. Its files remain recoverable through Git history. To roll back a deployed homepage, revert the corresponding deployment commit on `gh-pages`, and revert the source change on `main` before a subsequent build. Do not reset or force-push either branch.

Deploy only the contents of `dist/`; local research notes and proposal documents are not part of this source tree or deployment.
