# High-Volume Users Dashboard

This project is a high-performance React application designed to handle large datasets (10,000+ users) with optimized rendering and state management.

## Features

- **Performance**:
  - Virtualized list rendering (only visible rows are rendered).
  - Memoized heavy computations per row to demonstrate optimization.
  - Efficient filtering and sorting logic.

- **User Interaction**:
  - **Edit User**: Click on any row to open the details modal.
  - **Optimistic Updates**: Changes are reflected immediately in the UI.
  - **Simulated Backend**: Updates have a random chance to fail (simulated server error), triggering an automatic rollback of the state.

- **Filtering & Search**:
  - Real-time search by name/email (debounced).
  - Filter by Role and Status.
  - Multiple sorting options.

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at:
   [http://localhost:5173](http://localhost:5173)

## Technical Details

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (with darker mode support)
- **State Management**: React Hooks (useState, useMemo, custom hooks)
- **Virtualization**: `@tanstack/react-virtual`
- **Mock Data**: Generated client-side using `@faker-js/faker`
- **Icons**: `lucide-react`
