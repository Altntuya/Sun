# `edulab_ui` Plugin Guide

## Identity

- **Plugin:** `edulab`
- **Project:** `edulab_ui`
- **Layer:** `Frontend UI`
- **Path:** `frontend/plugins/edulab_ui`
- **Last synchronized:** `2026-10-24`

## Scope

### Owns

- EduLab routes under `edulab/*`: assignments, classrooms, teachers and
  students.
- The virtual lab simulations and the lab registry.
- The student submission form and the teacher review sheet.

### Does not own

- Persistence, validation and AI grading (`edulab_api`).
- erxes users and Contacts; teachers are picked with `SelectMember`, Contacts
  with `SelectCustomer` from `ui-modules`.

## Current Capabilities

- Runs as the `edulab_ui` Module Federation remote on port 3012.
- Classrooms, teachers and students pages with create/edit sheets (Zod),
  delete with confirmation, and a classroom filter on students.
- Assignments: create a lab or written assignment, optionally for one
  classroom, with lab options taken from the registry.
- Submission form: student (limited to the assignment's classroom),
  hypothesis, the lab's simulation, conclusion.
- Labs: Ohm's law (U and R sliders, ammeter with ±2% noise, I against U/R
  chart) and pendulum (L and m sliders, bob swinging at the true period,
  stopwatch timing ten swings with reaction-time noise, T against √L chart)
  and acid–base titration (hidden random HCl 0.08–0.16 М per session, 0.1 М
  NaOH set by dragging two sliders — coarse 0–50 ml in 0.5 ml steps and
  fine ±1 ml in one-drop (0.05 ml) steps, both reversible — with a hint
  telling which slider to move next, real strong acid/base pH, flask
  colour from phenolphthalein, live pH curve, per-trial C(HCl) chart with
  overshot trials in red).
- Review sheet: measurements table and the lab's chart, AI suggestion with a
  per-criterion list (name, "score / max" badge, wrapping comment — a list,
  because erxes `Table.Cell` is `whitespace-nowrap`), "Ашиглах" copies the AI score and feedback into the
  form, "Дахин шалгах" re-runs the AI check. The submissions list polls every
  3 s while any AI check is pending.

## Architecture

| Area              | Path                               | Responsibility                                          |
| ----------------- | ---------------------------------- | ------------------------------------------------------- |
| Federation config | `module-federation.config.ts`      | Exposes `./config` and `./edulab`                       |
| Plugin config     | `src/config.tsx`                   | Navigation group and modules                            |
| Routes            | `src/modules/EdulabMain.tsx`       | `AppLayout` and all routes                              |
| Shared UI         | `src/components/`                  | `EdulabSheet`, `EdulabTable`, `ListState`, `RowActions` |
| Mutations helper  | `src/utils/useEdulabMutation.ts`   | Toasts and cache eviction for every create/update/delete |
| People            | `src/modules/{classroom,teacher,student}/` | GraphQL, hooks, lists, sheets, selects          |
| Assignment        | `src/modules/assignment/`          | GraphQL, hooks, list, create sheet                      |
| Submission        | `src/modules/submission/`          | Form, list, review sheet, AI suggestion                 |
| Lab registry      | `src/modules/lab/`                 | `registry.ts`, `LabWorkbench`, `MeasurementTable`, labs |
| Pages             | `src/pages/{assignment,people}/`   | Route-level pages                                       |

## Contracts

### Provides

- Module Federation exposes `./config` and `./edulab` (named exports).
- Routes `edulab/assignments`, `edulab/assignments/:id`,
  `edulab/assignments/:id/submit`, `edulab/classrooms`, `edulab/teachers`,
  `edulab/students`.

### Consumes

- The `edulab_api` GraphQL operations listed in its guide.
- `erxes-ui` components; `ui-modules` `PageHeader`, `SelectMember`,
  `SelectCustomer`.

## Data and State

- Apollo Client holds server state. Mutations evict every cached variant of
  the root query fields they affect (`evictQueryFields`), not just refetch
  the lists on screen: a student list cached for another classroom would
  otherwise stay stale. Lists use `fetchPolicy: 'cache-and-network'`. Review
  and AI check update the normalized `EdulabSubmission` in the cache.
- Lab measurements live in the submission form state until submitted.

## Local Invariants

- A lab is a folder under `src/modules/lab/` exporting an `ILabDefinition`
  (variables, `Simulation`, `Chart`, hint) registered in `LABS`; its `key`
  and variable keys must match the backend lab registry.
- Simulations build on `LabWorkbench` so every lab shows the same table and
  chart frame.
- A new mutation lists in `evictFields` every root query field whose data it
  changes, including counts and names shown on other pages.
- Tables use `EdulabTable`, never bare `Table`: erxes `Table` is `table-fixed`
  with `whitespace-nowrap p-0` cells, so long text overlaps the next column.
  Give long text cells a `title` and the main column a width.
- The titration records `overshoot` against the true equivalence volume, so
  a single large addition past it is caught; the hidden acid concentration
  never leaves the component.
- Flask colour, its label, the hint and the endpoint grading all use
  `overshoot ≤ ENDPOINT_TOLERANCE_ML`, never pH alone: one drop past
  equivalence gives pH 10.2–10.7 depending on the volumes, so a pH threshold
  would call a trial "faint pink" that grading counts as overshot.
- The fine slider steps must stay at one drop (0.05 ml) or less, or the
  faint-pink window (≤ 0.1 ml past equivalence) can become unreachable for
  some acid volumes and concentrations.

## Validation

- `pnpm nx lint edulab_ui`
- `pnpm nx build edulab_ui`
- Smoke: add a classroom, register a teacher, add a student, create a
  pendulum assignment for the classroom, record readings at two lengths and
  two masses, submit, then review with the AI suggestion.
