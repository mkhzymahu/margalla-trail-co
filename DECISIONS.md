# Frontend decisions

## 1. Fees and discounts shown before adding (information hierarchy / mobile layout)
- **Problem:** https://hikencyc.com/ no clear sighting as to where to apply to book or any kind of pricing details.
- **Decision:** The details page shows the price, group discount rule, shuttle fee, seats left and your level check beside the quantity control, with a live total, before "Add to plan". On mobile the booking panel appears right after the key facts, above the long description.
- **Alternative:** Show a full price breakdown only on the cart/checkout page.
- **Reason:** Customers can judge the real cost and eligibility before investing effort, which reduces abandoned bookings.
- **Tradeoff:** The panel is denser and the page is longer on small screens.
- **Code location:** `src/pages/SessionDetailsPage.jsx` (`SessionDetails`), `src/components/PriceBreakdown.jsx`, `src/rules/pricing.js` (`priceLine`), `src/styles/responsive.css`.

## 2. Search and filters kept in the URL (interaction / state)
- **Problem:** https://vistatravelling.com/mhc/index.html observed: filters/search reset after opening an item and going Back.
- **Decision:** Search, level, availability and sort are stored in the query string. Details links carry a "Back to hikes" target, so Back/Forward and shared links restore the same results. Planned hikes hidden by filters are listed in a notice.
- **Alternative:** Keep filters in component or context state.
- **Reason:** Customers comparing hikes keep their place, and URLs are shareable.
- **Tradeoff:** More URL handling code; typing uses `replace` so history is not filled with every keystroke.
- **Code location:** `src/pages/SessionsPage.jsx` (`updateParam`, `hiddenPlanned`), `src/components/SessionCard.jsx` (`backTo`).

## 3. Helpful empty and full states (information hierarchy)
- **Problem:** https://primeengineeringservices.com/prime-tourism/ observed: zero results with no next step, or "sold out" only discovered on the details page.
- **Decision:** Every card shows seats left as text; a no-match result explains which filters caused it, offers "Clear search and filters" and up to three hikes that can still be booked. An empty dataset has its own message.
- **Alternative:** A generic "No results found" message.
- **Reason:** Customers always have a way forward, and unavailable options are visible early.
- **Tradeoff:** More logic to choose alternatives; more text per card.
- **Code location:** `src/pages/SessionsPage.jsx` (`alternatives`), `src/components/EmptyState.jsx`, `src/utils/format.js` (`availability`).