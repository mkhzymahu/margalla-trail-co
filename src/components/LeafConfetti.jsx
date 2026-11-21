const COLORS = ['#2f694c', '#56885b', '#a2a84e', '#c8873a'];
const LEAVES = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 47 + 11) % 100}%`,
  delay: `${(index % 8) * 55}ms`,
  duration: `${2300 + (index % 5) * 160}ms`,
  drift: `${(index * 37) % 150 - 75}px`,
  rotation: `${(index * 83) % 520 - 260}deg`,
  size: `${14 + (index % 4) * 3}px`,
  color: COLORS[index % COLORS.length],
}));

export default function LeafConfetti() {
  return (
    <div className="leaf-confetti" aria-hidden="true">
      {LEAVES.map((leaf, index) => (
        <span
          key={index}
          className="leaf-confetti__leaf"
          style={{
            '--leaf-left': leaf.left,
            '--leaf-delay': leaf.delay,
            '--leaf-duration': leaf.duration,
            '--leaf-drift': leaf.drift,
            '--leaf-rotation': leaf.rotation,
            '--leaf-size': leaf.size,
            '--leaf-color': leaf.color,
          }}
        >
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M20.5 3.5C10 3.4 4.2 7.7 4.3 13.3c.1 3.4 3.5 5.4 6.3 3.8 5.1-3 7.2-8.5 9.9-13.6Z" fill="currentColor" />
            <path d="M2.8 21c3.7-5.4 7.2-8.8 12.5-11.9" fill="none" stroke="#f7f3ea" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}
