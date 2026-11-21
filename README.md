# Margalla Trail Co.

**Student:** Khuzaymah Umer · **Roll no.:** 24I-2079 · **Section:** BCY-C · **Course:** CS4032 Web Programming, Assignment 02

Fictional guided-hiking business in the Margalla Hills for students and young professionals in
Islamabad and Rawalpindi. Users browse hikes, search/filter/sort, open details, build a plan,
complete a validated booking form, review a calculated summary and reach a confirmation.
**All bookings are simulated.** No payment, credentials or personal data are collected.

- GitHub: https://github.com/mkhzymahu/margalla-trail-co/ · Deployment: https://margalla-trail-co.vercel.app/ · Final commit: 3b5a29ccb1c720bd42fda89d063715c78132a398

## Commands
    npm install
    npm run dev       # development server
    npm run build     # production build into dist/
    npm run preview   # serve the build locally
    npm test          # node --test (business-rule tests)

## Routes
| Route | Purpose |
|---|---|
| `/` | Home, business overview and rules |
| `/sessions` | Browse, search, filter, sort (state kept in the URL) |
| `/sessions/:id` | Hike details and booking panel (invalid id shows feedback) |
| `/plan` | Selected hikes, quantity changes, conflicts, summary |
| `/checkout` | Controlled, validated booking form with live summary |
| `/confirmation` | Simulated booking result |

## Operating rules
1. **R1 Availability:** 1 to 6 hikers per booking, never more than seats left. Shown beside the quantity control. Invalid values show a message and block adding. Boundary: 6 accepted, 7 rejected.
2. **R2 Eligibility:** your level must be at least the hike's required level. Shown on cards, details and checkout. Boundary: Intermediate on an Intermediate hike is allowed; Beginner is blocked.
3. **R3 Pricing:** 10% off per hike for 4+ hikers; PKR 400 shuttle fee once per booking at Saddar Metro. Boundary: 3 hikers no discount, 4 hikers discount.

## Reproducing edge cases
Open "Demo controls" in the footer.
- **Loading failure:** tick "Simulate loading failure", then press Retry on the error panel.
- **Empty dataset:** tick "Simulate empty dataset" and open `/sessions`.
- **No search matches:** search for `zzz` on `/sessions`.
- **Changed availability:** add 4+ hikers to a plan, then tick "Simulate changed availability". `/plan` shows conflicts with fix buttons. The saved plan is re-checked on every load.
- **Invalid URL / id:** open `/sessions/xyz` and `/nowhere`.
- **Long title / missing distance:** hike `s-11`.
- **Corrupted saved data:** run `localStorage.setItem('mtc.plan','oops')` in the console and refresh. The app falls back to an empty plan.

## Simulated operations and limitations
- Booking reference and confirmation are generated locally; seats are not reduced after a booking.
- The booking form is not saved if you leave the page (to avoid storing personal data).
- [Add anything else that is incomplete.]

## Concept map
| Concept | File | Component / function |
|---|---|---|
| Routing, params | `src/App.jsx`, `src/pages/SessionDetailsPage.jsx` | `Routes`, `useParams` |
| Shared state | `src/context/BookingContext.jsx` | `BookingProvider` |
| Functional updates, immutable arrays | `BookingContext.jsx` | `setGroupSize`, `removeFromPlan` |
| Effects and cleanup | `BookingContext.jsx` | load effect with `cancelled` flag |
| Async / failure handling | `src/services/mockLoader.js` | `loadSessions` |
| Local storage | `src/hooks/useLocalStorageState.js`, `src/utils/storage.js` | `useLocalStorageState`, `readJSON` |
| Controlled form, validation | `src/pages/CheckoutPage.jsx`, `src/rules/formRules.js` | `CheckoutPage`, `validateBooking` |
| Business rules | `src/rules/*.js` | `checkGroupSize`, `meetsLevel`, `priceLine` |
| Derived values | `SessionsPage.jsx`, `pricing.js` | `useMemo`, `summarisePlan` |
| Props / callback props | `QuantityStepper.jsx`, `FilterBar.jsx` | `onChange` |
| Search, filter, sort | `src/utils/sessionQuery.js` | `querySessions` |
| Conflict recovery | `src/rules/planChecks.js`, `PlanPage.jsx` | `findConflicts` |