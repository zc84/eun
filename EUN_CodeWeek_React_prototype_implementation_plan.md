# EU Code Week WP5 — план реализации standalone React-прототипа

## 1. Назначение документа

Этот документ предназначен для пошаговой реализации демонстрационного прототипа EU Code Week с помощью Codex.

Прототип должен быть:

- отдельным frontend-приложением на React;
- без собственного backend, базы данных и серверной бизнес-логики;
- развёрнут как Static Site на Render;
- доступен по публичной ссылке;
- пригоден для демонстрации клиенту в течение 2–3 минут;
- визуально и функционально похож на high-fidelity product prototype, а не на набор статичных макетов;
- явно помечен как концепт, работающий на mock data.

Рабочее название репозитория:

```text
eu-code-week-prototype
```

---

## 2. Контекст WP5

В рамках WP5 предполагается принять в эксплуатацию существующую платформу `codeweek.eu` и поддерживать её в течение четырёх лет.

Реальный будущий scope WP5 включает:

- поддержку существующего решения на Laravel/PHP и WordPress;
- исправление дефектов и эксплуатационную поддержку;
- развитие поиска, сортировки и фасетных фильтров;
- развитие карты активностей и процесса регистрации мероприятий;
- responsive-редизайн в соответствии с Europa Web Guide / Europa Component Library;
- accessibility improvements;
- геймификацию, бейджи и сертификаты;
- аналитику и reporting;
- миграцию на домен `europa.eu` и инфраструктуру Европейской комиссии под управлением DG DIGIT;
- переход на EU Login;
- возможное мобильное приложение или PWA.

Этот контекст должен отражаться в интерфейсе и демонстрационном narrative, но **не должен превращать прототип в имитацию production-архитектуры**.

---

## 3. Границы прототипа

### 3.1. В scope

Прототип реализует следующие пользовательские сценарии:

1. Просмотр активностей на карте Европы.
2. Просмотр синхронизированного списка активностей.
3. Поиск активностей по ключевым словам.
4. Фильтрация по нескольким фасетам.
5. Сортировка результатов.
6. Открытие страницы отдельной активности.
7. Демонстрационная регистрация участия.
8. Переключение в режим организатора.
9. Создание новой активности через многошаговую форму.
10. Mock moderation flow.
11. Появление созданной активности на карте и в списке.
12. Просмотр mock-профиля пользователя.
13. Просмотр бейджей, сертификатов и собственных активностей.
14. Демонстрация accessibility-функций.
15. Responsive-представление основных экранов.

### 3.2. Вне scope

Не реализовывать:

- Laravel/PHP;
- WordPress;
- REST или GraphQL API;
- отдельный Node.js-сервер;
- базу данных;
- реальную регистрацию и авторизацию;
- EU Login OAuth/OIDC flow;
- реальные роли и права доступа;
- реальное геокодирование адресов;
- реальную модерацию;
- отправку email, push-уведомлений или SMS;
- реальные загрузки файлов;
- Power BI;
- CMS/editorial workflow;
- интеграцию с текущим `codeweek.eu`;
- интеграцию с DG DIGIT;
- production security architecture;
- production analytics.

### 3.3. Важная формулировка в UI

На всех основных экранах должна быть ненавязчивая, но видимая маркировка:

```text
Interactive concept prototype — demonstration data only
```

Не использовать формулировки, создающие впечатление, что это новая production-версия Code Week.

---

## 4. Технический подход

### 4.1. Основной стек

Использовать:

- React;
- TypeScript;
- Vite;
- React Router;
- React Hook Form;
- Zod;
- Zustand или React Context + `useReducer` для общего состояния;
- `react-simple-maps` для SVG-карты Европы;
- локальный GeoJSON/TopoJSON-файл Европы;
- `date-fns` для работы с датами;
- Vitest;
- React Testing Library;
- `axe-core` или `jest-axe` для accessibility-проверок;
- Playwright для одного демонстрационного end-to-end flow.

### 4.2. Почему SVG-карта, а не внешний map API

Для демонстрационного приложения предпочтительна локальная SVG-карта Европы:

- не нужен API key;
- нет зависимости от Google Maps, Mapbox или другого коммерческого сервиса;
- нет риска блокировки tile server во время звонка;
- приложение остаётся frontend-only;
- карта быстро загружается;
- проще стилизовать под визуальный язык Europa;
- проще управлять доступностью;
- mock-пины можно размещать по координатам из локальных данных.

При необходимости можно добавить отдельный detail map preview, но он не должен быть критичен для основного demo flow.

### 4.3. Styling strategy

Не использовать тяжёлую generic UI-библиотеку вроде Material UI или Ant Design, поскольку она визуально конфликтует с Europa Component Library.

Предпочтительный подход:

1. Создать локальные CSS design tokens на основе Europa Component Library.
2. Реализовать небольшой набор собственных React-компонентов.
3. Повторять структуру, spacing, typography, states и patterns ECL.
4. Использовать Arial как основной шрифт.
5. Использовать семантический HTML.
6. Не копировать логотипы или официальные элементы в некорректном контексте.

Минимальный набор UI-компонентов:

- `Button`;
- `IconButton`;
- `TextField`;
- `TextArea`;
- `Select`;
- `CheckboxGroup`;
- `RadioGroup`;
- `DateField`;
- `Tag`;
- `Badge`;
- `Card`;
- `Alert`;
- `Modal`;
- `Drawer`;
- `Pagination`;
- `Breadcrumbs`;
- `Tabs`;
- `ProgressSteps`;
- `SkipLink`;
- `VisuallyHidden`;
- `EmptyState`;
- `Skeleton`.

---

## 5. Предлагаемая структура приложения

```text
eu-code-week-prototype/
├── public/
│   ├── favicon.svg
│   ├── images/
│   └── mock-certificates/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   └── routes.ts
│   ├── assets/
│   │   ├── icons/
│   │   ├── illustrations/
│   │   └── maps/
│   │       └── europe.topo.json
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── activities/
│   │   ├── filters/
│   │   ├── map/
│   │   ├── profile/
│   │   └── accessibility/
│   ├── data/
│   │   ├── activities.ts
│   │   ├── countries.ts
│   │   ├── filters.ts
│   │   ├── achievements.ts
│   │   ├── addressSuggestions.ts
│   │   └── currentUser.ts
│   ├── features/
│   │   ├── activity-search/
│   │   ├── activity-details/
│   │   ├── activity-registration/
│   │   ├── activity-creation/
│   │   ├── profile/
│   │   └── demo-controls/
│   ├── hooks/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ActivityDetailsPage.tsx
│   │   ├── CreateActivityPage.tsx
│   │   ├── SubmissionResultPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── MobileFeedPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── store/
│   │   ├── appStore.ts
│   │   ├── selectors.ts
│   │   └── persistence.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── global.css
│   │   ├── utilities.css
│   │   └── accessibility.css
│   ├── types/
│   │   ├── activity.ts
│   │   ├── filters.ts
│   │   ├── user.ts
│   │   └── achievement.ts
│   ├── utils/
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   └── e2e/
│       └── demo-flow.spec.ts
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── render.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 6. Маршруты

Использовать client-side routing.

```text
/                         карта + поиск + список
/activities/:activityId   карточка активности
/activities/new           регистрация новой активности
/activities/submitted     результат mock submission
/profile                   профиль, бейджи, сертификаты
/mobile-feed               optional PWA/mobile concept
/accessibility             optional accessibility showcase
/*                         404
```

В header можно использовать role/demo switch:

```text
Explore activities | Organiser mode | My profile
```

Это не реальная авторизация. Переключатель только изменяет доступные UI-действия.

---

## 7. Модель данных

### 7.1. Activity

```ts
export type ActivityMode = 'online' | 'onsite' | 'hybrid';
export type ActivityStatus = 'published' | 'pending' | 'draft';

export interface Activity {
  id: string;
  title: string;
  summary: string;
  description: string;
  countryCode: string;
  countryName: string;
  city: string;
  address?: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  mode: ActivityMode;
  activityType: string;
  ageGroups: string[];
  languages: string[];
  topics: string[];
  organiser: {
    name: string;
    organisation: string;
    verified: boolean;
  };
  imageUrl?: string;
  registrationUrl?: string;
  status: ActivityStatus;
  participantCount: number;
  capacity?: number;
  featured?: boolean;
  createdByCurrentUser?: boolean;
}
```

### 7.2. ActivityFilters

```ts
export interface ActivityFilters {
  query: string;
  countryCodes: string[];
  activityTypes: string[];
  ageGroups: string[];
  languages: string[];
  modes: ActivityMode[];
  dateFrom?: string;
  dateTo?: string;
  topics: string[];
  sortBy: 'relevance' | 'dateAscending' | 'dateDescending';
}
```

### 7.3. UserProfile

```ts
export interface UserProfile {
  id: string;
  displayName: string;
  organisation: string;
  countryCode: string;
  roleLabel: string;
  avatarUrl?: string;
  earnedBadgeIds: string[];
  certificateIds: string[];
  joinedActivityIds: string[];
  createdActivityIds: string[];
}
```

---

## 8. Mock data strategy

### 8.1. Начальный набор

Подготовить 25–40 активностей, распределённых по Европе.

Данные должны покрывать:

- минимум 12 стран;
- online, onsite и hybrid;
- разные возрастные группы;
- разные языки;
- разные типы активностей;
- прошедшие, текущие и будущие даты;
- 3–5 featured activities;
- несколько активностей текущего пользователя.

### 8.2. Локальное состояние

Использовать in-memory state плюс `localStorage`.

В `localStorage` сохранять только:

- созданные в демо активности;
- выбранную demo role;
- mock registrations;
- настройку high contrast mode;
- закрытие onboarding/notice.

Добавить кнопку:

```text
Reset demo data
```

Она должна очищать созданные пользователем mock-данные и восстанавливать исходное состояние.

### 8.3. Симуляция запросов

Для ощущения реального приложения создать mock repository functions:

```ts
getActivities(filters): Promise<Activity[]>
getActivityById(id): Promise<Activity | null>
createActivity(input): Promise<Activity>
registerForActivity(id): Promise<void>
getCurrentUser(): Promise<UserProfile>
```

Функции должны возвращать локальные данные с искусственной задержкой 150–400 ms.

Не использовать MSW, если это заметно увеличит объём настройки. Для данного прототипа достаточно локального service/repository слоя.

---

## 9. Экран 1 — карта, поиск и список

### 9.1. Desktop layout

Основной layout:

```text
Header
Page title + prototype notice
Search bar
Filter summary / result count
------------------------------------------------
Filter sidebar | Map
               | Activity list
------------------------------------------------
Footer
```

Рекомендуемое соотношение:

- filter sidebar: 280–320 px;
- content area: остальная ширина;
- map: верхняя часть content area;
- list: ниже карты или рядом с ней на очень широком экране.

### 9.2. Mobile layout

На мобильном:

- search остаётся наверху;
- фильтры открываются в drawer;
- переключатель `Map / List`;
- карточки идут одной колонкой;
- sticky bottom action для открытия фильтров допустим;
- карта не должна блокировать прокрутку страницы.

### 9.3. Поиск

Поиск должен работать по:

- title;
- summary;
- city;
- country;
- organiser;
- topics.

Добавить debounce 250–350 ms.

### 9.4. Фасетные фильтры

Обязательные фасеты:

- country;
- activity type;
- age group;
- language;
- date range;
- online / onsite / hybrid;
- topic.

Поведение:

- результаты обновляются без отдельной кнопки `Search`;
- выбранные фильтры показываются chips/tags;
- каждый tag можно удалить;
- есть `Clear all`;
- result count обновляется;
- карта и список используют один и тот же derived dataset;
- пустой результат показывает понятный empty state.

### 9.5. Карта

Карта должна:

- показывать Европу;
- отображать пины активностей;
- поддерживать hover и keyboard focus для пинов;
- подсвечивать выбранную карточку;
- открывать компактный popover по клику;
- позволять перейти в activity details;
- визуально группировать несколько близких активностей, если это не усложняет реализацию;
- иметь текстовую альтернативу через activity list.

Не делать карту единственным способом доступа к активности.

### 9.6. Activity card

Карточка содержит:

- title;
- date;
- country/city;
- online/onsite/hybrid label;
- age group;
- language;
- short summary;
- organiser;
- participants/capacity, если применимо;
- `View activity`.

---

## 10. Экран 2 — карточка активности

Секции:

1. Breadcrumbs.
2. Title и status labels.
3. Date, location, mode.
4. Main image/illustration.
5. Description.
6. Who it is for.
7. Topics and languages.
8. Organiser information.
9. Small map/location block.
10. Registration call-to-action.
11. Similar activities.

Registration flow:

- пользователь нажимает `Join activity`;
- открывается accessible confirmation modal;
- после подтверждения показывается success alert;
- activity id добавляется в mock profile;
- participant count увеличивается локально;
- повторное нажатие не должно повторно регистрировать пользователя.

---

## 11. Экран 3 — регистрация новой активности

### 11.1. Формат

Использовать многошаговую форму с четырьмя шагами:

1. Basic information.
2. Date and location.
3. Audience and participation.
4. Review and submit.

### 11.2. Шаг 1 — Basic information

Поля:

- title;
- short summary;
- full description;
- activity type;
- topics;
- primary language;
- additional languages.

### 11.3. Шаг 2 — Date and location

Поля:

- start date/time;
- end date/time;
- mode;
- country;
- city;
- address;
- mock address suggestion;
- coordinates preview.

Mock geocoding:

- пользователь вводит адрес;
- приложение ищет совпадения в локальном `addressSuggestions.ts`;
- выбор suggestion заполняет latitude/longitude;
- pin появляется на preview map.

Не вызывать внешний geocoding API.

### 11.4. Шаг 3 — Audience and participation

Поля:

- age groups;
- participant capacity;
- registration required;
- contact/registration URL;
- accessibility information;
- equipment requirements.

### 11.5. Шаг 4 — Review and submit

Показать:

- summary всех введённых данных;
- warning, что данные являются демонстрационными;
- возможность вернуться к любому шагу;
- checkbox подтверждения;
- `Submit for moderation`.

### 11.6. Результат submission

После submission:

1. Создать activity со статусом `pending`.
2. Показать экран `Submitted for moderation`.
3. Через demo control позволить выполнить `Approve activity`.
4. После approve сменить статус на `published`.
5. Показать ссылку `View on activity map`.
6. При переходе карта должна центрироваться или визуально выделять новую активность.

Это демонстрирует workflow, но не имитирует полноценную moderation platform.

---

## 12. Экран 4 — профиль и геймификация

Профиль содержит:

- данные пользователя;
- вкладки `My activities`, `Joined activities`, `Achievements`, `Certificates`;
- progress indicator;
- earned badges;
- locked badges;
- mock certificates;
- CTA для создания новой активности.

Примеры бейджей:

- First activity joined;
- First activity organised;
- Code Week Contributor;
- Inclusive Learning Champion;
- Cross-border Collaborator;
- Community Builder.

Геймификация должна выглядеть как product concept, а не как полностью определённая award model.

Добавить подпись:

```text
Illustrative achievement model — subject to validation with the European Commission.
```

---

## 13. Optional screen — mobile feed / PWA concept

Этот экран реализовывать только после завершения основных flows.

Он может включать:

- mobile-first feed;
- активности рядом;
- saved filters;
- upcoming activity reminder;
- mock notification banner;
- add-to-home-screen informational card;
- offline-ready concept label.

Не обязательно конфигурировать реальный service worker. Если PWA-функциональность добавляется, использовать Vite PWA plugin только после завершения основного прототипа.

---

## 14. Accessibility requirements

Прототип должен демонстрировать accessibility by design.

### 14.1. Обязательные требования

- WCAG 2.2 AA как целевой уровень прототипа;
- корректная heading hierarchy;
- landmarks: `header`, `nav`, `main`, `aside`, `footer`;
- skip link;
- keyboard navigation;
- видимый focus state;
- form labels;
- field descriptions;
- понятные error messages;
- `aria-live` для изменения количества результатов;
- `aria-live` для success/error notifications;
- modal focus trap;
- возврат focus после закрытия modal/drawer;
- отсутствие информации, передаваемой только цветом;
- достаточный contrast;
- minimum touch target;
- support `prefers-reduced-motion`;
- альтернативный список для данных карты;
- корректные accessible names для map pins и icon buttons.

### 14.2. Demo accessibility controls

Добавить в header или demo toolbar:

- `High contrast` toggle;
- `Reduce motion` toggle или respect system setting;
- `Accessibility notes` modal.

Accessibility modal кратко объясняет, что можно показать на звонке:

- Tab navigation;
- focus states;
- live result updates;
- semantic form errors;
- map/list equivalence.

### 14.3. Проверки

Минимум:

- axe scan Home Page;
- axe scan Activity Details;
- axe scan Create Activity Step 1;
- manual keyboard pass;
- Lighthouse accessibility check;
- zoom 200%;
- mobile viewport 390 px;
- desktop viewport 1440 px.

---

## 15. Responsive behaviour

Breakpoints можно реализовать локальными CSS variables:

```css
--breakpoint-sm: 36rem;
--breakpoint-md: 48rem;
--breakpoint-lg: 64rem;
--breakpoint-xl: 80rem;
```

Проверить:

- 390 × 844;
- 768 × 1024;
- 1366 × 768;
- 1440 × 900;
- 1920 × 1080.

На 1366 × 768 основной demo flow должен помещаться без ощущения перегруженности.

---

## 16. State management

Рекомендуемый store:

```ts
interface AppState {
  role: 'participant' | 'organiser';
  activities: Activity[];
  filters: ActivityFilters;
  selectedActivityId?: string;
  joinedActivityIds: string[];
  createdActivityIds: string[];
  highContrast: boolean;

  setRole(role): void;
  setFilters(filters): void;
  resetFilters(): void;
  selectActivity(id): void;
  joinActivity(id): void;
  createActivity(activity): void;
  approveActivity(id): void;
  resetDemo(): void;
}
```

Derived data, например filtered activities, не хранить отдельно. Вычислять через selectors.

---

## 17. Demo controls

Добавить компактный `Demo controls` popover, доступный только как часть прототипа.

Функции:

- switch participant/organiser;
- reset data;
- approve latest pending activity;
- turn high contrast on/off;
- open demo script;
- jump to key screen.

Этот блок ускорит проведение звонка и позволит восстановить состояние после неудачного клика.

Не размещать control panel слишком заметно, чтобы приложение не выглядело как developer sandbox.

---

## 18. Error, loading и empty states

Даже без backend показать реалистичные состояния:

### Loading

- skeleton для списка;
- loading indicator для submit;
- disabled submit во время mock request.

### Empty

- no matching activities;
- no joined activities;
- no certificates yet.

### Error

Добавить dev/demo query parameter:

```text
?simulateError=activities
```

Он может показывать один контролируемый error state. Это необязательно для основного demo, но полезно для демонстрации зрелости UX.

---

## 19. Analytics concept

Не подключать реальную analytics platform.

Создать локальную функцию:

```ts
trackDemoEvent(name, payload)
```

В development она пишет события в console.

Примеры событий:

- `activity_search_used`;
- `filter_applied`;
- `activity_opened`;
- `activity_joined`;
- `activity_creation_started`;
- `activity_submitted`;
- `activity_approved`;
- `badge_viewed`.

Это позволит показать, что интерфейс подготовлен к future analytics, не создавая ложного впечатления о production tracking.

---

## 20. Implementation phases for Codex

### Progress update (implemented)

- [x] Initial prototype feature completed: project bootstrap + app shell + Home discovery concept screen in English (header, prototype notice, search/filter/map/list preview, placeholder routes, build passes).

## Phase 0 — repository bootstrap

### Tasks

1. Создать Vite React TypeScript application.
2. Настроить ESLint и TypeScript strict mode.
3. Добавить React Router.
4. Добавить базовые directories.
5. Добавить global styles и design tokens.
6. Добавить базовый app shell.
7. Добавить placeholder routes.
8. Добавить `render.yaml`.
9. Добавить README с командами запуска.

### Acceptance criteria

- `npm install` выполняется без ошибок;
- `npm run dev` запускает приложение;
- `npm run build` создаёт `dist`;
- все routes открываются;
- direct route refresh будет поддержан Render rewrite rule;
- нет TypeScript errors.

---

## Phase 1 — design foundation

### Tasks

1. Реализовать tokens.
2. Реализовать typography.
3. Реализовать header/footer.
4. Реализовать prototype notice.
5. Реализовать базовые buttons, fields, cards, tags, alerts.
6. Реализовать focus styles.
7. Реализовать responsive container/grid.
8. Добавить skip link.

### Acceptance criteria

- визуальный язык соответствует Europa/ECL direction;
- нет generic Material-like appearance;
- все controls доступны с клавиатуры;
- focus visible;
- mobile и desktop layouts работают.

---

## Phase 2 — mock domain and state

### Tasks

1. Создать TypeScript models.
2. Создать 25–40 mock activities.
3. Создать current user.
4. Создать achievements/certificates.
5. Реализовать repository/service layer.
6. Реализовать store.
7. Реализовать localStorage persistence.
8. Реализовать reset demo.

### Acceptance criteria

- mock data типизированы;
- created/joined state сохраняется после refresh;
- reset возвращает приложение в исходное состояние;
- UI не импортирует mock arrays напрямую, а использует repository/store.

---

## Phase 3 — activity discovery

### Tasks

1. Реализовать search.
2. Реализовать filters.
3. Реализовать sorting.
4. Реализовать active filter tags.
5. Реализовать result count.
6. Реализовать activity cards.
7. Реализовать map.
8. Синхронизировать map selection и list selection.
9. Реализовать empty state.
10. Реализовать mobile drawer и map/list switch.

### Acceptance criteria

- изменение любого фильтра синхронно обновляет карту и список;
- result count объявляется screen reader;
- selected activity подсвечивается в обоих представлениях;
- карта не является единственным способом навигации;
- фильтры можно полностью очистить.

---

## Phase 4 — activity details and participation

### Tasks

1. Реализовать details route.
2. Реализовать activity detail layout.
3. Реализовать join modal.
4. Реализовать success state.
5. Обновлять profile и participant count.
6. Реализовать similar activities.

### Acceptance criteria

- activity открывается по прямой ссылке;
- refresh details page не даёт 404 после настройки Render;
- регистрация сохраняется в localStorage;
- повторная регистрация невозможна;
- modal корректно управляет focus.

---

## Phase 5 — organiser creation flow

### Tasks

1. Реализовать role switch.
2. Реализовать four-step form.
3. Добавить Zod validation.
4. Добавить mock address suggestions.
5. Добавить map preview.
6. Добавить review step.
7. Добавить pending submission result.
8. Добавить demo approval.
9. Добавить переход к созданной активности на карте.

### Acceptance criteria

- нельзя перейти дальше при невалидных обязательных полях;
- ошибки связаны с соответствующими полями;
- введённые данные сохраняются между шагами;
- после approve активность появляется среди published results;
- новая активность видна после refresh;
- flow можно пройти только клавиатурой.

---

## Phase 6 — profile and gamification

### Tasks

1. Реализовать profile summary.
2. Реализовать tabs.
3. Реализовать joined/created activities.
4. Реализовать badge grid.
5. Реализовать certificate cards.
6. Реализовать progress indicator.

### Acceptance criteria

- профиль отражает действия пользователя в текущем demo state;
- earned и locked badges визуально различимы не только цветом;
- certificate mock открывается или скачивается как статичный пример;
- вкладки доступны с клавиатуры.

---

## Phase 7 — accessibility and polish

### Tasks

1. Добавить high contrast mode.
2. Добавить reduced motion handling.
3. Добавить accessibility notes modal.
4. Выполнить axe checks.
5. Исправить keyboard/focus issues.
6. Добавить loading/skeleton states.
7. Добавить final responsive polish.
8. Оптимизировать изображения и bundle.

### Acceptance criteria

- нет критических axe violations на основных экранах;
- demo flow полностью проходим клавиатурой;
- 200% zoom не ломает основные действия;
- mobile layout не имеет horizontal scroll;
- анимации отключаются при `prefers-reduced-motion`.

---

## Phase 8 — tests and deployment

### Tasks

1. Unit tests для filtering selectors.
2. Component test для filters.
3. Component test для join modal.
4. Component test для validation errors.
5. Playwright demo flow.
6. Production build.
7. Render deployment.
8. Smoke test deployed URL.
9. Проверить direct links.
10. Подготовить demo data reset перед звонком.

### Acceptance criteria

- `npm run test` проходит;
- `npm run build` проходит;
- deployed URL открывается;
- прямой переход на `/activities/:id` работает;
- refresh на nested route работает;
- demo flow проходит на deployed environment.

---

## 21. Render configuration

Приложение разворачивается как **Static Site**, не как Web Service.

Основные настройки:

```text
Build command: npm install && npm run build
Publish directory: dist
```

Для React Router требуется rewrite:

```text
Source: /*
Destination: /index.html
Action: Rewrite
```

Пример `render.yaml`:

```yaml
services:
  - type: web
    name: eu-code-week-prototype
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

Перед использованием Codex должен сверить `render.yaml` с текущей схемой Render Blueprint и при необходимости скорректировать только deployment syntax, не меняя архитектуру приложения.

Не добавлять server start command.

---

## 22. Suggested scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm run test && npm run build"
  }
}
```

---

## 23. Codex execution rules

Codex должен соблюдать следующие правила:

1. Работать по одной фазе за раз.
2. Перед изменениями кратко перечислять затрагиваемые файлы.
3. Не добавлять backend.
4. Не добавлять serverless functions.
5. Не добавлять database-as-a-service.
6. Не подключать EU Login.
7. Не подключать реальные map/geocoding API.
8. Не использовать секреты или API keys.
9. Не заменять React на Next.js.
10. Не использовать SSR.
11. Не добавлять Docker без отдельной необходимости.
12. Не добавлять сложную domain architecture для демонстрационного приложения.
13. Не использовать `any` без обоснования.
14. Сохранять TypeScript strict mode.
15. Переиспользовать компоненты, но не создавать абстракции до появления повторения.
16. После каждой фазы запускать lint, tests и build.
17. Не переходить к optional mobile/PWA scope, пока основной demo flow не завершён.
18. Все видимые тексты интерфейса писать на английском.
19. README и code comments писать на английском.
20. Implementation plan и внутренние заметки можно вести на русском.

---

## 24. Рекомендуемый порядок запросов к Codex

### Prompt 1 — bootstrap

```text
Implement Phase 0 from EUN_CodeWeek_React_prototype_implementation_plan.md.
Create a standalone React + TypeScript + Vite application. Do not add a backend,
SSR, serverless functions, external APIs, authentication, or a database.
After implementation, run lint and production build and fix all issues.
```

### Prompt 2 — design foundation

```text
Implement Phase 1 from the implementation plan. Build an accessible Europa/ECL-
inspired design foundation using local CSS tokens and reusable React components.
Do not introduce Material UI, Ant Design, or another generic component framework.
Run lint, tests, and build after the changes.
```

### Prompt 3 — domain and mock state

```text
Implement Phase 2. Add typed mock domain models, realistic European Code Week
activity data, a repository abstraction, state management, localStorage persistence,
and a reset-demo action. Keep all data local and frontend-only.
```

### Prompt 4 — discovery experience

```text
Implement Phase 3. Build the activity search, faceted filters, sorting, active filter
tags, result count, responsive activity list, and local SVG Europe map. The map and
list must use the same filtered dataset and be keyboard accessible.
```

### Prompt 5 — details and participation

```text
Implement Phase 4. Add activity details, direct routing, an accessible join flow,
local participant state, success feedback, and similar activities. Preserve the
frontend-only architecture.
```

### Prompt 6 — activity creation

```text
Implement Phase 5. Add the accessible four-step organiser activity creation flow,
Zod validation, local mock address suggestions, map preview, pending moderation,
demo approval, and publication into the existing activity dataset.
```

### Prompt 7 — profile

```text
Implement Phase 6. Add the user profile, created and joined activities, illustrative
badges, certificates, and progress. Keep gamification explicitly labelled as a
concept subject to validation.
```

### Prompt 8 — accessibility and deployment

```text
Implement Phases 7 and 8. Complete accessibility checks, keyboard behaviour,
responsive polish, tests, production build, and Render Static Site configuration.
Verify that React Router direct links work through an index.html rewrite.
```

---

## 25. Demo flow acceptance scenario

Финальный прототип считается готовым, если следующий сценарий проходит без перезагрузки и ошибок:

1. Открыть home page.
2. Увидеть карту Европы и список активностей.
3. Ввести `robotics` в search.
4. Выбрать страну и возрастную группу.
5. Увидеть синхронное изменение карты, списка и result count.
6. Открыть activity details.
7. Зарегистрироваться на activity.
8. Открыть профиль и увидеть activity в `Joined activities`.
9. Переключиться в Organiser mode.
10. Создать новую onsite activity через четыре шага.
11. Отправить её на mock moderation.
12. Выполнить demo approval.
13. Вернуться на карту.
14. Увидеть новую activity как опубликованную.
15. Включить high contrast mode.
16. Пройти основные controls клавишей Tab.
17. Обновить страницу и убедиться, что demo state сохранился.
18. Нажать `Reset demo data` и вернуть исходное состояние.

---

## 26. Definition of Done

Прототип готов к показу, когда:

- приложение полностью frontend-only;
- production build стабилен;
- приложение опубликовано на Render;
- основные routes поддерживают прямое открытие и refresh;
- карта, поиск, фильтры и список синхронизированы;
- activity details работают;
- join flow работает;
- organiser creation flow работает;
- mock moderation и publication работают;
- profile отражает пользовательские действия;
- accessibility demo работает;
- нет критических ошибок в консоли;
- нет критических accessibility violations;
- интерфейс выглядит как целостный продукт;
- интерфейс не создаёт ложного впечатления, что production-интеграции уже реализованы;
- весь основной сценарий укладывается в 2–3 минуты демонстрации.

---

## 27. Приоритеты при ограниченном времени

Если времени недостаточно, выполнять в следующем порядке:

### P0 — обязательно

1. App shell в стиле Europa.
2. Карта Европы.
3. Activity list.
4. Search.
5. Основные фильтры.
6. Activity details.
7. Activity creation flow.
8. Mock moderation/publication.
9. Responsive desktop/mobile.
10. Keyboard focus и базовая accessibility.
11. Render deployment.

### P1 — желательно

1. Join flow.
2. Profile.
3. Badges.
4. Certificates.
5. Demo controls.
6. High contrast mode.
7. Playwright demo test.

### P2 — только после завершения P0/P1

1. Mobile feed.
2. Real PWA configuration.
3. Advanced map clustering.
4. Simulated error states.
5. Rich animations.
6. Extended analytics concept.

---

## 28. Основной архитектурный принцип

Прототип должен показывать **будущий пользовательский опыт WP5**, но не пытаться заранее воспроизвести production-решение.

Правильная формула:

```text
High-fidelity frontend concept
+ realistic user interactions
+ mock state and data
+ Europa visual direction
+ accessibility by design
- backend
- integrations
- production infrastructure assumptions
```
