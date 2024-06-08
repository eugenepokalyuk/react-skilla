# Call Management System

This project is a call management system built using React and TypeScript. It provides an interface to display, filter and interact with call records.

## Features

- **Data Filtering**:
  - Filtering calls by incoming, outgoing and all types.
  - Filtering by different time periods: 3 days, week, month, year, and the ability to specify custom dates.
- **Call Tables**:
  - Display calls for selected periods sorted by time and duration.
  - Display call information including type, time, employee, contact information, source, and rating.
- **Audio Player**:
  - Playback of call recordings.
  - The audio player remains visible until the user manually closes it.
- **User Interface**:
  - Interactive elements to enhance the user experience.

## Technologies Used

- React
- TypeScript
- Redux
- Date-fns
- SCSS

<img src="https://skillicons.dev/icons?i=react,ts,redux,sass" />

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/eugenepokalyuk/react-skilla.git
   cd react-skilla
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open the application**:

   Open your browser and navigate to `http://localhost:5173`.

## Project Structure

```
src/
├── assets/
│   └── icons/
├── components/
│   ├── App/
│   │   ├── App.tsx
│   │   └── App.scss
│   ├── CallList/
│   │   ├── CallList.tsx
│   │   └── CallList.scss
│   ├── CellTable/
│   │   ├── CellTable.tsx
│   │   └── CellTable.scss
│   ├── CustomAudioPlayer/
│   │   ├── CustomAudioPlayer.tsx
│   │   └── CustomAudioPlayer.scss
├── store/
│   ├── callsSlice.ts
│   └── index.ts
├── utils/
│   └── consts.ts
├── api/
│   └── callsApi.ts
└── main.tsx
```

### Explanation of Key Files

- **`src/components/CallList/CallList.tsx`**: Основной компонент для отображения списка звонков и фильтрации.
- **`src/components/CellTable/CellTable.tsx`**: Компонент таблицы, отображающий звонки.
- **`src/components/CustomAudioPlayer/CustomAudioPlayer.tsx`**: Кастомный аудиоплеер для воспроизведения записей звонков.

## Comments

- The application uses Redux for status management and Date-fns to handle dates.
- Filters allow users to easily find and view desired calls.
- The audio player provides playback of call recordings with easy-to-use controls.

## Deployment

To build the application for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory, which can be deployed to any static hosting service.