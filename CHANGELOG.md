# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-28

### Added

- **Blondie**, a light version of Brownie
- Two new flavors, **Berries & Cream** and **Pistachio & Cherry**, each as a Brownie and a Blondie (six themes in total)
- Semantic highlighting support
- Themed terminal, diff and merge editors, bracket pair colors and guides, sticky scroll, inlay hints, peek view, suggest and hover widgets, quick input, notifications, minimap and scrollbars
- Color checks in the build: syntax colors reach at least 4.5:1 contrast, and colors that look too alike are rejected
- A landing page and README images rendered from the real themes (`npm run docs`)
- Refreshed icon: the same bitten B brownie with a caramel drip, redrawn on a milk chocolate plate with sprinkles in the flavor colors (`npm run icon`)
- New and rewritten examples: HTML, CSS, SCSS, JavaScript, TypeScript, Vue, JSON, Markdown, Python and YAML

### Changed

- Kept the original identity: `#fff8f1` text, caramel keywords, burnt orange functions, toffee properties and the brown butter status bar
- The dark background moved from neutral charcoal `#222222` to a warm milk chocolate `#261f1b`, with warm borders and line numbers like in 2022
- Keywords and functions are now easy to tell apart
- Strings, numbers, types, parameters and regular expressions each have their own color in every language
- Punctuation and operators are muted so they no longer compete with keywords
- Comments, line numbers and CodeLens are more readable
- Find matches are translucent and keep the text color visible
- Themes are generated from a single palette (`src/palette.js`)
- Rewrote README

### Removed

- Leftover colors borrowed from Material Theme
- Old screenshots

### Fixed

- Fenced code in Markdown was rendered black and invisible
- Duplicate and conflicting scope rules
- Invalid Markdown heading selector

## [0.2.1] - 2022-02-04

### Changed

- Changed selected text background color in inputs
- Changed matched text background color in list/tree

### Fixed

- Fixed overall foreground color

## [0.2.0] - 2022-02-03

### Added

- Themed colors for Markdown and JSON

### Changed

- Slightly darkened color for functions and special methods
- More suitable size of icon picture
- Improved README

### Fixed

- Fixed input selection background and foreground colors for better visibility (_e.g._ editor search widget)

## [0.1.1] - 2022-01-30

### Fixed

- Fixed missing screenshots and emojis in README.

## [0.1.0] - 2022-01-30

- Initial release

[Unreleased]: https://github.com/gregadro/brownie-theme/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/gregadro/brownie-theme/compare/v0.2.1...v1.0.0
[0.2.1]: https://github.com/gregadro/brownie-theme/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/gregadro/brownie-theme/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/gregadro/brownie-theme/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/gregadro/brownie-theme/releases/tag/v0.1.0
