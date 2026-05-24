# vue-squaredle-solver

A Vue 3 + Vite application for solving Squaredle-style word puzzles using a local word list and in-browser solver logic.

## About

This project provides a small solver interface built with Vue and TypeScript. It uses a preprocessed `words.txt` word list and a solver algorithm to suggest possible solutions for the grid.

> Note: solver results may be slightly inaccurate in some edge cases. This project is intended to help narrow down possibilities, but it may not always return the exact intended answer.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Disable Vetur if it is installed

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Word List Updating

If you ever update `src/scripts/raw_words.txt` with a new raw word list, run the build script once to regenerate `src/data/words.txt` before using the solver:

```sh
node src/scripts/build-wordlist.js
```

This step is only required when the source raw word list changes.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint

```sh
npm run lint
```
