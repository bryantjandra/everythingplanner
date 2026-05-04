# everythingplanner.

A personal all-in-one daily planner: tracking todos, a yearly goal tracker, and a pomodoro timer all in one.

## Why did I build it?

I was tired of switching between Google Docs, Notion, & some random productivity app.

So I built one for myself. It's a minimalist-styled application for my daily todos, yearly goals, and for tracking my pomodoro work + rest sessions.

Every feature I made was designed and implemented deliberately according to what I would like in a all-in-one daily/yearly planner (0 vibe coding was done lol). This project has brought back the joy of coding manually for me, and it has helped me deeply understand the underlying mechanics of my code (e.g. state management, component architecture, data flow), instead of relying too heavily on AI to abstract those details away.

## ✦ Features

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
