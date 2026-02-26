# Flutter Kanban App Architecture & Implementation Guide

This document is meant for an AI Agent or a Flutter Developer to build the dedicated companion Kanban app for the Web Dashboard.

## 1. Overview
The goal is to build a Flutter application that strictly serves as the Kanban Board for the user's startup. It syncs with the existing Next.js + MongoDB backend via the same REST APIs that the web app uses, allowing the founder to manage and interact with tasks directly from their mobile phone.

## 2. API Integration
The app should communicate with the Next.js web application using the following API endpoints.

**Authentication:** 
Since the web application uses NextAuth, the mobile app should implement a compatible standard. (Recommended: Token-based authentication or passing JWT/Session tokens as headers).

> For the purpose of this Kanban implementation, construct an API client (e.g., `Dio` or `http`) that passes the authenticated user's data or `startupId` appropriately.

**Endpoints (Base URL: `https://your-server-domain/api/kanban`)**:

1. **`GET /columns?startupId={id}`**
   - Retrieves a list of columns. Each column contains a nested list of `tasks`.
   - Both columns and tasks are ordered by their `order` integer parameter ascending.

2. **`POST /columns`**
   - Body: `{ startupId: string, title: string, order: number }`
   - Creates a new column.

3. **`PUT /columns`**
   - Body: `{ columns: [{ id: string, title: string, order: number }] }`
   - Mass updates columns (used mostly for reordering or renaming).

4. **`DELETE /columns?id={id}`**
   - Deletes a column and cascades deletion of its tasks.

5. **`POST /tasks`**
   - Body: `{ columnId: string, content: string, order: number }`
   - Creates a new task.

6. **`PUT /tasks`**
   - Body (Single): `{ id: string, content?: string, isCompleted?: boolean, columnId?: string, order?: number }`
   - Body (Bulk Reorder): `{ tasks: [{ id: string, columnId: string, order: number }] }`
   - Updates a task (text, completion status) or moves it.

7. **`DELETE /tasks?id={id}`**
   - Deletes a task.

---

## 3. UI/UX Design Guidelines

The web application uses a beautiful Dark Theme with Orange accents (`#f97316` or `Colors.orange[500]`). The UI should reflect this premium styling.

### Typography & Colors
* **Background Color**: Very dark grey/black (`#0a0a0a` or `Color(0xFF0A0A0A)`).
* **Card Background**: Slightly lighter grey (`#1a1a1a` or `Color(0xFF1A1A1A)` for columns, `#242424` for tasks).
* **Accent Color**: Orange (`#f97316` or `Colors.orange[500]`).
* **Success Color**: Green (`#22c55e` or `Colors.green[500]`) for completed tasks.
* **Text**: White/Off-white for primary, Grey for secondary.

### Kanban Board Layout
For a mobile app, rendering horizontal columns can be done via a horizontally scrolling `ListView` or `PageView`.
* Each Column matches the screen width minus some padding (`MediaQuery.of(context).size.width * 0.85`).
* Inside each column, present a vertically scrolling `ListView` of Task Cards.

### Drag and Drop
* **Flutter Library**: Use a package like [appflowy_board](https://pub.dev/packages/appflowy_board) or [boardview](https://pub.dev/packages/boardview) which provides native-feeling Trello-like drag and drop.
* **Alternative**: Use standard Flutter `DragTarget` and `LongPressDraggable` widgets inside a horizontal list of vertical lists, though a dedicated package is strongly recommended.

---

## 4. Flutter Data Models

Create data models that mirror the Prisma schema:

```dart
class KanbanColumn {
  final String id;
  final String title;
  final int order;
  final List<KanbanTask> tasks;

  // Implement fromJson and toJson...
}

class KanbanTask {
  final String id;
  final String columnId;
  final String content;
  final int order;
  final bool isCompleted;

  // Implement fromJson and toJson...
}
```

---

## 5. Implementation Steps for the AI

1. **Setup Project**: Run `flutter create kanban_app`.
2. **Dependencies**: Add `http`, `shared_preferences`, and `appflowy_board` to `pubspec.yaml`.
3. **State Management**: Use `Provider`, `Riverpod`, or `Bloc` to handle remote API calls and caching the board state.
4. **Theme Configuration**: Add the dark theme specs (Scaffold color `#0a0a0a`, app bar `#141414`, orange seed color).
5. **Services**: Create `KanbanApiService` mapped to the endpoints defined in Section 2.
6. **Main View (`BoardScreen`)**:
   - Show a loading indicator.
   - Fetch the board from the API.
   - Render the `AppFlowyBoard` or equivalent.
   - Implement handlers for:
     - Reordering tasks (dispatch `PUT /api/kanban/tasks` with bulk array).
     - Moving tasks between columns.
     - Tapping a task to edit (shows a dialog to rename or mark `isCompleted`).
     - "Add Task" button at the bottom of each column.
     - "Add Column" horizontal suffix card.

---

## 6. Real-Time Syncing vs HTTP Polling

For MVP, every drag-and-drop end action should update the local state immediately (Optimistic UI update) and fire the HTTP request in the background. If the request fails, show an error `SnackBar` and revert the local state. 

*Optional*: If you wish to implement WebSocket or Server-Sent Events later, the architecture can be updated, but HTTP REST calls are perfectly adequate for the first version.
