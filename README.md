# tablout

Free, open-source drag-and-drop seating planner for weddings, events, and parties.

**[tablout.com](https://tablout.com)**

## Features

- **7 table shapes** — round, rectangle, square, oval, U-shape, L-shape, banquet
- **Drag-and-drop** guest assignment — drag guests onto seats, swap between seats
- **Guest groups** — organize by Family, Friends, Colleagues, Plus Ones, or custom groups
- **Auto-seating** — automatically assign unassigned guests keeping groups together
- **Table controls** — resize, rotate, duplicate, rename, change shape
- **PNG export** — download your floor plan as a high-resolution image
- **Mobile responsive** — full touch support with pinch-to-zoom
- **Persistent** — your layout saves to localStorage automatically
- **No sign-up required** — works entirely in the browser

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **Zustand** for state management
- **html-to-image** for PNG export
- **Vitest** + **Playwright** for testing

## Development

```bash
npm install
npm run dev       # Start dev server
npm run test      # Run unit tests
npm run test:e2e  # Run end-to-end tests
npm run build     # Production build
npm run lint      # Lint
```

## Deployment

Configured for Vercel — push to main and it deploys automatically.

## Support

If you find tablout useful, consider [buying me a coffee](https://buymeacoffee.com/henmar28) ☕

## License

MIT
