const PALETTES = {
  Sunrise: ['#f2b980', '#4f7a5f'],
  Sunset: ['#e4876a', '#4a5f6d'],
  Night: ['#1d2b4f', '#3a566f'],
  Day: ['#9ccfb8', '#3f6f5a'],
  Culture: ['#d9b77e', '#6d5a43'],
  Photography: ['#b7c7e6', '#556b7d'],
};

export default function TrailArt({ category }) {
  const [sky, hill] = PALETTES[category] ?? PALETTES.Day;
  return (
    <svg className="trail-art" viewBox="0 0 320 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="320" height="110" fill={sky} />
      <circle cx="255" cy="32" r="15" fill="#fff" opacity="0.85" />
      <path d="M0 110 L70 46 L120 84 L190 26 L262 90 L320 58 L320 110Z" fill={hill} />
    </svg>
  );
}