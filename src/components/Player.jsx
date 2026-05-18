export default function Player({ position, alert = false }) {
  return (
    <div
      className={`player-sprite ${alert ? 'has-alert' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      aria-label="玩家"
    >
      <span className="player-shadow" />
      <span className="player-legs" />
      <span className="player-body" />
      <span className="player-scarf" />
      <span className="player-phone-glow" />
      <span className="player-head" />
      <span className="player-hair" />
      <span className="player-alert">!</span>
    </div>
  );
}
