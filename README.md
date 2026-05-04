# everythingplanner ✍🏻

A personal all-in-one planner: tracking daily todos, yearly goals, and a pomodoro timer all in one app.

## Why did I build it?

I was tired of switching between Google Docs, Notion, & some random productivity app.

So I built one for myself. It's a minimalist-styled application for my daily todos, yearly goals, and for tracking my pomodoro work + rest sessions.

Having my todos, goals, and pomodoro sessions in one place makes planning feel more focused, less scattered, and much easier to maintain consistently! I've now felt much more organized and intentional with how I structure my days and my goals for the year.

Beyond just being useful, this project also reinvigorated my joy for hands-on coding. Building it manually (0 vibe coding) helped me deeply understand the underlying mechanics of my code (e.g. state management, component architecture, data flow) instead of relying too heavily on AI to abstract those details away.

Feel free to try [everythingplanner](https://everythingplanner.vercel.app/) — hopefully it helps you plan your days/years a little more intentionally too!

## Core Features!

### ✓ Daily todos — [src/components/TodoCard/](src/components/TodoCard/)

- Add a todo by pressing **Enter** in the input
- Edit a todo by **double-clicking** it; **Escape** cancels, **Enter** saves
- Toggle complete with the checkbox
- Delete individual todos

### ◐ Calendar view — [src/components/Calendar/](src/components/Calendar/)

- Date picker for navigating to any day's todo list
- Visual indicator dots on the picker:
  - **green** when every todo for that date is completed
  - **gray** when there are todos in progress

### ⏱ Pomodoro timer — [src/components/Pomodoro/](src/components/Pomodoro/)

- 60-minute **work** sessions and 15-minute **rest** sessions
- Play / pause / reset, plus a Work ↔ Rest mode switch
- Per-day session count **and** lifetime total shown in the navbar
- Audio cue on session completion (`pomodoroSparkle.mp3`)
- Active countdown rendered in the **document title** so it's visible from any browser tab

### ◇ Goal tracker — [src/components/GoalTracker/](src/components/GoalTracker/)

- Year-scoped goals across 4 tabbed categories: **Work**, **Fitness**, **Learning**, **Personal**
- Goal status states: not started / in progress / completed (status dot UI)
- Up to 3 **subgoals** per goal, each independently checkable
- Year selector in the sidebar; the next year auto-surfaces once December rolls around

## ❖ Tech stack

- **React 19** + **TypeScript 5.9** + **Vite 8** (build / dev server)
- **React Router 7** for client-side routing
- **CSS Modules** for component-scoped styling
- **@douyinfe/semi-ui** for the date picker and tabs
- **react-icons** for iconography
- **State management:** plain React hooks.
- **Persistence:** `localStorage`.
