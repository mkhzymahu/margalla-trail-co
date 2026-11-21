// Business constants. Rules read from here so a single edit changes behaviour.
export const BUSINESS = {
  name: 'Margalla Trail Co.',
  tagline: 'Guided hikes in the Margalla Hills',
};

// R1: availability / capacity
export const GROUP_MIN = 1;
export const GROUP_MAX = 6;

// R3: pricing
export const GROUP_DISCOUNT_MIN_SIZE = 4;
export const GROUP_DISCOUNT_RATE = 0.1;

// R2: eligibility (ordered lowest to highest)
export const LEVELS = ['Beginner', 'Intermediate', 'Experienced'];

export const MEETING_POINTS = [
  { id: 'f6', label: 'F-6 Super Market, Islamabad', fee: 0 },
  { id: 'saidpur', label: 'Saidpur Village gate', fee: 0 },
  { id: 'faisal', label: 'Faisal Mosque east parking', fee: 0 },
  { id: 'saddar', label: 'Saddar Metro Station, Rawalpindi (shuttle)', fee: 400 },
];

export const STORAGE_KEYS = {
  plan: 'mtc.plan',
  level: 'mtc.level',
  demo: 'mtc.demo',
  booking: 'mtc.lastBooking',
};

export const LOAD_DELAY_MS = 600;