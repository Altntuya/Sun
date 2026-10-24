# `edulab_api` Plugin Guide

## Identity

- **Plugin:** `edulab`
- **Project:** `edulab_api`
- **Layer:** `Backend API`
- **Path:** `backend/plugins/edulab_api`
- **Last synchronized:** `2026-10-24`

## Scope

### Owns

- Classrooms, teachers and students of the school using EduLab.
- Assignments a teacher sets: written (`text`) or a virtual lab (`lab`) that
  names one simulation by `labKey`, optionally for one classroom, with a
  rubric, max score and due date.
- Student submissions: hypothesis, answer or lab conclusion, the lab
  measurements, the teacher's score and comment, and the AI suggestion.
- The lab registry: each simulation's variables and the facts computed from
  its measurements for AI grading.

### Does not own

- erxes users and authentication. A teacher's `userId` references a core
  User; teachers sign in to erxes as that user.
- Contacts. A student's optional `customerId` references a core Customer.
- The simulations' UI, which lives in `edulab_ui`.

## Current Capabilities

- CRUD for classrooms (name, grade, description, `teacherIds`), teachers
  (`userId` unique, subject, phone) and students (name, `classroomId`,
  code, parent name and phone, optional `customerId`).
- A classroom with students cannot be deleted; deleting one clears it from
  assignments. Deleting a teacher removes them from classrooms. A student
  with submissions cannot be deleted.
- Assignments CRUD; deleting an assignment deletes its submissions.
- Submitting work for a student. When the assignment has a classroom the
  student must belong to it. The student's `customerId` is copied onto the
  submission. Lab submissions need at least one measurement whose every lab
  variable is a positive number; unknown keys are dropped.
- Teacher review: a score from 0 to `maxScore` plus a comment.
- AI grading with Gemma 4 through the Google AI Studio API: an overall score,
  a per-criterion breakdown (`aiCriteria`) and feedback addressed to the
  student. It is a suggestion only and never changes `score` or `status`.
- Three labs: `ohmsLaw` (voltage, resistance, current), `pendulum`
  (length, mass, period) and `titration` (acidVolume, baseConcentration,
  baseVolume, overshoot, finalPh). Titration facts compute C(HCl) per trial,
  classify each as not reached (pH < 8.2), at endpoint (overshoot ≤ 0.1 мл)
  or overshot, and give the mean and spread of the good trials.

## Architecture

| Area             | Path                         | Responsibility                                            |
| ---------------- | ---------------------------- | --------------------------------------------------------- |
| Plugin entry     | `src/main.ts`                | `startPlugin` on port 3306, GraphQL, permissions meta     |
| Models           | `src/connectionResolvers.ts` | Tenant-scoped models for all five collections             |
| Classroom        | `src/modules/classroom/`     | Classrooms and their teacher list                         |
| Teacher          | `src/modules/teacher/`       | Teachers linked to erxes users (`User` federation)        |
| Student          | `src/modules/student/`       | Students, classroom membership, optional Contact link     |
| Assignment       | `src/modules/assignment/`    | Assignments, validation                                   |
| Submission       | `src/modules/submission/`    | Submissions, review, background AI check                  |
| Lab registry     | `src/modules/lab/`           | One file per lab: variables and `describeFacts`           |
| AI grading       | `src/modules/ai/`            | Gemma client, prompt, tolerant grade parsing              |
| Permissions meta | `src/meta/permissions.ts`    | classroom, teacher, student, assignment, submission       |

## Contracts

### Provides

- Queries: `edulabClassroomList`, `edulabClassroomDetail`,
  `edulabTeacherList`, `edulabStudentList(classroomId, searchValue)`,
  `edulabAssignmentList(classroomId, type, searchValue, cursor)`,
  `edulabAssignmentDetail`, `edulabSubmissionList(assignmentId, studentId,
  customerId, status, cursor)`, `edulabSubmissionDetail`.
- Mutations: `edulab{Classroom,Teacher,Student,Assignment}{Create,Update,Remove}`,
  `edulabSubmissionCreate(studentId, measurements: [JSON], ...)`,
  `edulabSubmissionReview`, `edulabSubmissionAiCheck`.
- Permission actions: `edulab{Classroom,Teacher,Student,Assignment,Submission}Read`
  (always), `edulab{Classroom,Teacher,Student,Assignment}Manage`,
  `edulabSubmissionCreate`, `edulabSubmissionReview` (also gates the AI check).

### Consumes

- `erxes-api-shared` `startPlugin`, `createGenerateModels`, `cursorPaginate`.
- Core `User` and `Customer` federation entities.
- Google AI Studio `generativelanguage.googleapis.com/v1beta`. Env:
  `GOOGLE_AI_API_KEY` (required for AI grading) and optional `GEMMA_MODEL`.
  Without `GEMMA_MODEL` every `gemma-4` model the key can call is tried in
  order (mixture-of-experts such as `gemma-4-26b-a4b-it` first, then larger
  before smaller), moving on after a 5xx, 429 or timeout; the model that last
  answered is tried first next time. `gemma-4-31b-it` has returned 500s.

## Data and State

- `edulab_classrooms`, `edulab_teachers`, `edulab_students`,
  `edulab_assignments`, `edulab_submissions`, per tenant through
  `generateModels(subdomain)`.
- `measurements` is an array of `{ [lab variable key]: number }` (Mixed).
  Submissions made before students existed have `customerId` but no
  `studentId`.
- No migrations yet.

## Local Invariants

- Every resolver calls `checkPermission` with an `edulab*` action first.
- Validation lives in the model classes, not the resolvers.
- A new lab is one file in `src/modules/lab/` added to `LABS` in
  `registry.ts`, with the same `key` and variable keys as its `edulab_ui`
  counterpart. Lab variables must be positive unless marked `allowZero`.
- Titration endpoints are judged by `overshoot` (base past equivalence,
  computed by the simulation from its hidden acid concentration), never by
  pH: a strong acid/strong base jumps from pH ~4 to ~10 within one drop.
- Grading never runs inside a request: `aiCheckSubmission` marks the
  submission pending with `aiRequestedAt` and grades in the background. Only
  the run whose `aiRequestedAt` still matches may write its result.
- Gemma requests use `thinkingLevel: minimal` (about 5–10 s per grade instead
  of ~30 s with the same scores on misconception cases); a model that rejects
  the setting is retried without it. Calls time out after 90 s and a check
  pending for 120 s is reported as `failed`, so it can be retried.
- The grader receives server-computed facts per lab and must treat a wrong
  hypothesis as allowed, judging only whether the conclusion matches the data.
- Criterion names and points come from the rubric (`src/modules/ai/rubric.ts`
  reads lines carrying "<n> оноо"), never from the model, which rewords them
  and breaks vowel harmony. When the model returns one entry per rubric line
  they are aligned by position and the total is their sum; otherwise the
  model's own breakdown and total are kept. Free-text comments and feedback
  are model-written and may still need the teacher's edit.

## Validation

- `pnpm nx build edulab_api`
- Smoke: create a classroom, teacher and student; create a pendulum
  assignment for the classroom; submit for a student of another classroom
  (rejected) and of that classroom (accepted, AI grade arrives in ~10 s).
