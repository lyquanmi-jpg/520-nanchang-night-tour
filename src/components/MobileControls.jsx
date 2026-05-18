export default function MobileControls({ onMove, onInteract, canInteract }) {
  return (
    <div className="mobile-controls" aria-label="移动控制">
      <div className="dpad-shell">
        <div className="dpad">
          <button className="pixel-press up" type="button" onClick={() => onMove('up')} aria-label="向上">▲</button>
          <button className="pixel-press left" type="button" onClick={() => onMove('left')} aria-label="向左">◀</button>
          <button className="pixel-press right" type="button" onClick={() => onMove('right')} aria-label="向右">▶</button>
          <button className="pixel-press down" type="button" onClick={() => onMove('down')} aria-label="向下">▼</button>
        </div>
      </div>
      <button
        className={`interact-control pixel-press ${canInteract ? 'ready' : ''}`}
        type="button"
        onClick={onInteract}
      >
        互动
      </button>
    </div>
  );
}
