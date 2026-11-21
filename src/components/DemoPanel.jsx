import { useBooking } from './../context/BookingContext.jsx';

export default function DemoPanel() {
  const { demo, setDemo } = useBooking();
  const toggle = (key) => (e) => {
    const checked = e.target.checked;
    setDemo((prev) => ({ ...prev, [key]: checked }));
  };
  return (
    <details className="demo-panel">
      <summary>Demo controls (for testing edge cases)</summary>
      <p className="muted">These switches simulate problems so they can be tested. They are not part of the shop.</p>
      <label className="checkbox">
        <input type="checkbox" checked={demo.fail} onChange={toggle('fail')} />
        <span>Simulate loading failure (use Retry to recover)</span>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={demo.empty} onChange={toggle('empty')} />
        <span>Simulate empty dataset (no hikes published)</span>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={demo.lowAvailability} onChange={toggle('lowAvailability')} />
        <span>Simulate changed availability (seats drop, one hike sells out)</span>
      </label>
    </details>
  );
}