# CaldasGO

A mobile-first, map-based creature-collecting game experiment built with React, TypeScript, MapLibre, browser geolocation, local persistence, and PWA support.

## What it explores

- map-based exploration and spawning;
- location-aware game mechanics with a mock-location fallback;
- creature encounters, collection, inventory and progression;
- PokéStop-style interaction experiments;
- browser-local persistence through LocalForage;
- installable PWA behavior;
- mobile UI and motion design.

The current creature set intentionally mixes parody/fan-game ideas and original "fakemon" concepts.

## Privacy and location

CaldasGO requests browser geolocation only after the user passes the splash and safety flow.

Location is held in React state for gameplay. The project should not persist precise GPS history, upload it to analytics, or expose it through logs by default.

If geolocation is unavailable or denied, the game falls back to a mock location so the application remains testable.

## Fan-project / asset boundary

This is a personal learning experiment and is not affiliated with Niantic, Nintendo, Game Freak, or The Pokémon Company.

Some terminology and external/reference assets are inspired by the broader Pokémon / location-game ecosystem. Third-party asset provenance and licensing should be reviewed before treating the project as a polished portfolio release or commercial product. Original project assets and parody/fakemon content should be preferred where practical.

## Technology

- React 19
- TypeScript
- Vite
- MapLibre GL
- react-map-gl
- LocalForage
- Framer Motion
- Tailwind CSS

## Development

```bash
npm ci
npm run build
npm run lint
```

## Project context

This is a personal, self-directed learning project by João Caldas. I use projects like this to learn geospatial UI, game systems, browser privacy boundaries, React/TypeScript, PWA design, testing, and AI-assisted development through hands-on experimentation.

AI tools are used extensively during research, design, coding, debugging, testing, asset ideation, and documentation. AI-generated suggestions are treated as inputs to review, not proof of correctness. Location/privacy behavior, gameplay mechanics, external data/assets, and technical claims should be validated.

## Status

**LAB / FLAGSHIP CANDIDATE.** Active map-game experiment.
