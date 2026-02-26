# Flutter Kanban Board App - Architecture & Implementation Guide

This document is the absolute source of truth for generating a production-ready Flutter companion app serving as a Kanban Board for a founder's startup.

## 1. Core Architecture & Backend
The mobile app does not need its own backend. It directly mirrors, integrates, and communicates with the already deployed Next.js web application.

- **Primary Deployed Server:** `https://eazstart.vercel.app/`
- **Database:** MongoDB (via Prisma on the backend API routes).

Your AI Agent building this Flutter app should NOT create any new tables, servers, or web hooks. It strictly consumes the below REST APIs.

---

## 2. Authentication & DB Fetching

The web app uses standard `NextAuth` with Credentials mapping to the MongoDB `User` collection.
To allow seamless login from the Flutter app without deploying an extra OAuth server:

1. Create a `auth.dart` service in Flutter that performs a standard `POST` to an Authentication Endpoint (or directly hits a custom sign-in route the web app can expose handling the hashed password).
2. Given the existing architecture, assume the user will input `email` and `password`. Use Flutter's `http` package to securely pass this payload back to the remote server.
3. Upon successful login, the app must store the returned `userId` (MongoDB ObjectId format: `64a7c8...`) and session token inside `SharedPreferences` or `FlutterSecureStorage`.
4. Then immediately fetch the user's active `Startup` ID, as all Kanban items belong to a Startup.

---

## 3. Remote API Endpoints (Base URL: `https://eazstart.vercel.app/api`)

*Important:* The `Content-Type: application/json` header is required for all `POST`/`PUT` requests. Include the user's Session/Bearer token in the `Authorization` header on all requests if required by the Next.js API.

### Columns
Columns contain the horizontal phases (e.g., "To Do", "Done").

**GET `/kanban/columns?startupId={startupId}`**
- Returns: `List<KanbanColumn>`. Each column object intrinsically contains a populated array of `tasks` mapped to it.

**POST `/kanban/columns`**
- Body: `{ startupId: string, title: string, order: number }`
- Note: Use `1024` increments for `order` to allow drag-and-drop insertions without math collisions.

**PUT `/kanban/columns`**
- Body: `{ columns: [{ id: string, title: string, order: number }] }`
- Required for updating column names or saving new sorted order after a horizontal drag.

**DELETE `/kanban/columns?id={colId}`**
- Deletes a column and cascades deleting its child tasks.

### Tasks
Tasks are the individual cards.

**POST `/kanban/tasks`**
- Body: `{ columnId: string, content: string, order: number }`

**PUT `/kanban/tasks`**
- Body: `{ id: string, content?: string, isCompleted?: boolean, columnId?: string, order?: number }`
- Used for checking off a task, modifying text, OR moving a task to a different column/swapping orders.
- Accepts bulk array payloads if multiple tasks are reordered simultaneously.

**DELETE `/kanban/tasks?id={taskId}`**
- Deletes a single task.

---

## 4. UI/UX Aesthetics & Design Tokens

The Web Dashboard was recently completely overhauled into a highly premium "glassmorphism" Dark Theme. The Flutter app MUST replicate this exact feeling. It should not look like standard Material Design.

**Color Palette:**
- **Backgrounds:** `Color(0xFF0A0A0A)` to `Color(0xFF111111)`. Use subtle vertical linear gradients on Scaffold backgrounds.
- **Glass Cards:** Create a specialized `GlassContainer` widget mapping to `Color(0x0AFFFFFF)` with a subtle frosted `BackdropFilter(blurX: 10, blurY: 10)`.
- **Primary Brand (Accent/Buttons):** Orange Gradient: `LinearGradient(colors: [Color(0xFFF97316), Color(0xFFEA580C)])`.
- **Success Color:** Green `Color(0xFF22C55E)` (Used when `isCompleted: true`).
- **Borders:** Thin, barely visible stroke mapping to `Color(0x0DFFFFFF)` (`white/5`).

**Typography:**
- Use **Inter** or **Outfit** fonts (via `google_fonts` package).
- Weights: 400 for task text, 600 for column headers, 700 for page titles.
- Color: `#F3F4F6` (off-white) for readable contrast. Muted text is `#9CA3AF`.

**Micro-Interactions (Mandatory):**
- When a user enters the drag state on a task card, slightly scale up `Transform.scale(scale: 1.03)`, slightly reduce opacity, and add a deep shadow `BoxShadow(color: Color(0x33000000), blurRadius: 20)`.
- Tasks that are `isCompleted = true` should have a green-tinted left border and cross out the text inside.

---

## 5. Architectural Map for the Flutter Agent

1. **Project Setup**:
   - `flutter create --org com.eazstart kanban_mobile`
   - Use `flutter_riverpod` or `provider` for State Management.
   - Use `http` or `dio` for Network calls.
   - Use `appflowy_board` for out-of-the-box Trello/Kanban drag-and-drop mechanics.

2. **Models Configuration (`lib/models/`)**:
   ```dart
   class KanbanTask {
     final String id, columnId, content;
     final int order;
     final bool isCompleted;
     // ... json serializers
   }
   
   class KanbanColumn {
     final String id, startupId, title;
     final int order;
     final List<KanbanTask> tasks;
     // ... json serializers
   }
   ```

3. **Optimistic State Navigation (`lib/providers/board_provider.dart`)**:
   - The user expects the app to feel instant.
   - When a user drags a task or taps "Complete", update the local Riverpod/Provider state *first*, immediately reflecting the change visually.
   - Run the HTTP `PUT` request in an async background isolated call. If `res.statusCode != 200`, show a red `SnackBar` ("Sync failed") and roll back the local change securely.

4. **Screen Flow**:
   - `LoginScreen` -> Posts to eazstart.vercel.app.
   - `StartupSelectorScreen` -> Discovers linked Startups on this user profile. (Bypass if there is exactly 1).
   - `BoardScreen` -> The main event. Fetches columns via `GET`, mounts the `AppFlowyBoard`, handles `onDragEnd` math (using the 1024 offset index rule), and pushes `POST/PUT` payloads dynamically back to the server.
