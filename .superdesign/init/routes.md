# Routes

This is a **single-page application** with no routing. There is one page/view.

## Single Page: Seating Planner

- URL: `/`
- Entry: `src/main.jsx` → `src/App.jsx`
- Layout: Full-screen split: left sidebar (w-72) + right main canvas (flex-1)
- Description: Interactive U-shaped seating chart planner with drag-and-drop

### App Entry
```jsx
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### App Component
- File: `src/App.jsx`
- Manages state: `seats`, `people`, `activeDragId`, `eventName`
- Renders: `<Sidebar>` + `<UTable>` wrapped in `<DndContext>`
- Drag-drop library: `@dnd-kit/core`
