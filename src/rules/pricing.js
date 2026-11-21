import { GROUP_DISCOUNT_MIN_SIZE, GROUP_DISCOUNT_RATE } from '../data/config.js';

/** R3: groups of GROUP_DISCOUNT_MIN_SIZE or more on one hike get the discount. */
export function qualifiesForGroupDiscount(size) {
  return size >= GROUP_DISCOUNT_MIN_SIZE;
}

export function priceLine(pricePerPerson, size) {
  const subtotal = pricePerPerson * size;
  const discount = qualifiesForGroupDiscount(size) ? Math.round(subtotal * GROUP_DISCOUNT_RATE) : 0;
  return { subtotal, discount, total: subtotal - discount };
}

/** lines: [{ groupSize, session }]. shuttleFee is charged once per booking. */
export function summarisePlan(lines, shuttleFee = 0) {
  let seats = 0;
  let hours = 0;
  let subtotal = 0;
  let discount = 0;
  for (const { groupSize, session } of lines) {
    const line = priceLine(session.pricePerPerson, groupSize);
    seats += groupSize;
    hours += session.durationHours;
    subtotal += line.subtotal;
    discount += line.discount;
  }
  const fee = lines.length > 0 ? shuttleFee : 0;
  return { sessions: lines.length, seats, hours, subtotal, discount, fee, total: subtotal - discount + fee };
}