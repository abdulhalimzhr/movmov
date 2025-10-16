# Movmov

A movie browsing app built with modern web technologies. Search for movies, save your favorites, and browse through a curated collection - all with a clean, responsive interface.

## What it does

- **Browse movies** - Pulls from a mock movie database with pagination support
- **Search** - Find movies by title with real-time search
- **Favorites** - Save movies you like and access them anytime (data sticks around in your browser)
- **Movie details** - Click any movie to see more information and IMDB links
- **Responsive** - Works on desktop and mobile devices

## How it's built

- **Nuxt 3** - Modern Vue framework for SSR and static sites
- **Vue 3** - Composition API for clean, reusable component logic
- **TypeScript** - Type safety throughout the project
- **Vuetify** - Material Design components for a polished UI
- **SCSS** - Styled with Sass preprocessor
- **Pinia** - Simple state management (favorites are stored in localStorage)
- **Vitest** - Unit tests for the core functionality

## API Source

Uses the Hackerrank Mock API:
```
https://jsonmock.hackerrank.com/api/movies/search/?Title=${title}&page=${page}
```

## Quick Start

```bash
# Install and run
npm install
npm run dev
```

Open http://localhost:3000 and start browsing!

### Project commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run typecheck    # Check TypeScript types
```

## How to use

1. **Search** - Type in the search bar to find movies by title
2. **Browse** - Use pagination to navigate through results (10 movies per page)
3. **Save favorites** - Click the heart icon on any movie
4. **View details** - Click a movie card to see more information
5. **Visit IMDB** - Click the link icon to go to the movie's IMDB page

## Project structure

```
movmov/
├── components/           # Vue components
├── composables/          # Reusable logic
├── pages/               # App pages
├── server/api/          # Backend API routes
├── stores/              # Pinia state management
├── types/               # TypeScript types
├── tests/               # Unit tests
└── assets/scss/         # Styles
```

## Tech highlights

- **Vue 3 Composition API** with TypeScript throughout
- **SCSS** for styling with a component-based approach
- **localStorage** integration for persisting favorites across sessions
- **Server-side API calls** for better performance and security
- **Unit tests** covering core functionality

## What's included

- Movie listing with pagination support
- Real-time search functionality
- Favorites system with browser storage
- Movie detail pages with IMDB integration
- Responsive design that works on all devices
- TypeScript for type safety
- Unit tests for reliability

## License

MIT License - feel free to use this however you'd like.
