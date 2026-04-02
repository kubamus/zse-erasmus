# Plan pracy projektu Plannero (5 osob)

## 1. Cel projektu
Plannero to aplikacja webowa do organizowania pracy zespolowej, podobna do Jira/Trello.

MVP (pierwsza wersja) ma umozliwiac:
- logowanie i rejestracje,
- tworzenie workspace/project,
- tablice Kanban (kolumny + karty),
- przypisywanie osob do zadan,
- komentarze do kart,
- podstawowe filtry i wyszukiwanie,
- panel glownej strony (home/dashboard) z podsumowaniem pracy.

Backend: MySQL + Drizzle ORM.

---

## 2. Role w zespole (2x backend, 3x frontend)

### Backend 1 (BE1)
Odpowiada za:
- architekture bazy danych MySQL,
- migracje i modele Drizzle,
- auth (register/login/logout, sesje/JWT),
- uprawnienia (owner/admin/member).

### Backend 2 (BE2)
Odpowiada za:
- API dla board/list/card/comment,
- API dla przypisywania userow i statusow,
- paginacje, filtrowanie, sortowanie,
- logike powiadomien (wersja MVP: in-app).

### Frontend 1 (FE1)
Odpowiada za:
- layout aplikacji,
- home/dashboard,
- widoki auth (login/register),
- podstawowy design system (komponenty UI + formularze).

### Frontend 2 (FE2)
Odpowiada za:
- widok tablicy Kanban,
- kolumny i karty,
- drag and drop,
- szczegoly karty (modal/panel).

### Frontend 3 (FE3)
Odpowiada za:
- integracje z API (fetch/client state),
- filtry, wyszukiwarka, przypisania,
- obsluga bledow i loading states,
- testy e2e krytycznych flow + QA frontu.

---

## 3. Git Flow - zasady branchy

### Branche stale
- `main` - produkcja (tylko stabilne releasy)
- `develop` - branch integracyjny calego zespolu

### Branche tymczasowe
- `feature/<obszar>/<nazwa>`
- `release/<wersja>`
- `hotfix/<nazwa>`

Przyklady:
- `feature/frontend/home-page`
- `feature/frontend/auth-pages`
- `feature/frontend/kanban-board`
- `feature/frontend/task-modal`
- `feature/backend/drizzle-schema`
- `feature/backend/auth-jwt`
- `feature/backend/boards-api`
- `feature/backend/cards-comments-api`
- `release/0.1.0`
- `hotfix/fix-login-redirect`

### Reguly pracy
1. Kazdy task = osobny branch feature.
2. Feature branch zawsze tworzony z `develop`.
3. Merge przez PR do `develop` (bez pushowania bezposrednio).
4. Minimum 1 review od innej osoby.
5. Po merge usuwamy branch feature.
6. Co sprint robimy branch `release/x.y.z` z `develop`, testujemy, potem merge do `main` i z powrotem do `develop`.

---

## 4. Podzial funkcji na osoby + branche

## Backend

### BE1
1. Schemat DB + relacje
- branch: `feature/backend/drizzle-schema`

2. Migracje i seed podstawowych danych
- branch: `feature/backend/migrations-seed`

3. Auth API (register/login/me/logout)
- branch: `feature/backend/auth-jwt`

4. Role i autoryzacja endpointow
- branch: `feature/backend/roles-permissions`

### BE2
1. API workspace/project/board/list
- branch: `feature/backend/boards-api`

2. API card CRUD + status + assignee
- branch: `feature/backend/cards-api`

3. API comments + activity log
- branch: `feature/backend/comments-activity`

4. API filtrow i wyszukiwania
- branch: `feature/backend/search-filters`

## Frontend

### FE1
1. App shell (sidebar/topbar/layout)
- branch: `feature/frontend/app-shell`

2. Home/Dashboard
- branch: `feature/frontend/home-page`

3. Login/Register + walidacje
- branch: `feature/frontend/auth-pages`

4. UI kit (button/input/modal/tag)
- branch: `feature/frontend/ui-kit`

### FE2
1. Widok tablicy Kanban
- branch: `feature/frontend/kanban-board`

2. Drag and drop kart i kolumn
- branch: `feature/frontend/drag-drop`

3. Szczegoly taska (modal/panel)
- branch: `feature/frontend/task-modal`

4. Edycja taska + status + priorytet
- branch: `feature/frontend/task-edit`

### FE3
1. Integracja API i warstwa danych
- branch: `feature/frontend/api-integration`

2. Filtry, search i assigned-to-me
- branch: `feature/frontend/filters-search`

3. Error/loading/empty states
- branch: `feature/frontend/state-handling`

4. Testy e2e kluczowych flow
- branch: `feature/frontend/e2e-tests`

---

## 5. Sprint plan (propozycja 4 sprintow)

## Sprint 1 (fundamenty)
Zakres:
- setup projektu, env, lint, format,
- schema DB + migracje,
- auth backend + auth frontend,
- app shell + home skeleton.

Done kiedy:
- user moze sie zarejestrowac i zalogowac,
- baza jest gotowa pod board/list/card,
- frontend ma podstawowy layout po zalogowaniu.

## Sprint 2 (core board)
Zakres:
- API board/list/card,
- UI Kanban board,
- tworzenie i edycja kart,
- drag and drop.

Done kiedy:
- user tworzy board, listy i karty,
- mozna przenosic karty miedzy listami,
- dane zapisuja sie w DB.

## Sprint 3 (wspolpraca)
Zakres:
- przypisywanie osob,
- komentarze i activity,
- filtry i search,
- dopracowanie dashboardu.

Done kiedy:
- task ma assignee i komentarze,
- dziala filtrowanie i wyszukiwanie,
- dashboard pokazuje sensowne podsumowanie.

## Sprint 4 (stabilizacja + release)
Zakres:
- testy integracyjne i e2e,
- poprawki UX/UI,
- poprawki wydajnosci i bledow,
- release `0.1.0`.

Done kiedy:
- kluczowe flow przechodza testy,
- brak blocker bugow,
- merge `release/0.1.0` do `main`.

---

## 6. Minimalny model danych (MVP)
Tabele:
- users
- workspaces
- workspace_members
- projects
- boards
- lists
- cards
- card_assignees
- comments
- activity_logs

Relacje (skrot):
- workspace ma wielu memberow,
- project nalezy do workspace,
- board nalezy do project,
- list nalezy do board,
- card nalezy do list,
- card moze miec wielu assignee,
- comment nalezy do card i user.

---

## 7. Definicja ukonczenia (Definition of Done)
Task jest zakonczony, gdy:
1. Kod jest na branchu feature i przeszedl lint/testy lokalne.
2. Jest PR do `develop` z opisem co zostalo zrobione.
3. PR ma review i poprawki po review.
4. Dziala end-to-end (frontend + backend + DB).
5. Zostala zaktualizowana dokumentacja (krotko, ale konkretnie).

---

## 8. Proponowana kolejnosc startowa (pierwsze 3 dni)
1. BE1: `feature/backend/drizzle-schema`
2. BE2: `feature/backend/boards-api` (na mocku lub prostym schema, potem podmiana)
3. FE1: `feature/frontend/app-shell`
4. FE2: `feature/frontend/kanban-board` (najpierw na mock data)
5. FE3: `feature/frontend/api-integration` (warstwa klienta + kontrakty)

Po 2-3 dniach szybka synchronizacja kontraktow API i update taskow.