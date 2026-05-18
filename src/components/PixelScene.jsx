export default function PixelScene({ compact = false }) {
  return (
    <div className={`pixel-scene ${compact ? 'compact' : ''}`} aria-hidden="true">
      <div className="moon" />
      <div className="stars s1" />
      <div className="stars s2" />
      <div className="skyline">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="river">
        <i />
        <i />
        <i />
      </div>
      <div className="street">
        <div className="lamp"><b /></div>
        <div className="person"><b /></div>
        <div className="phone">
          <span />
          <span />
          <span />
        </div>
        <div className="noodle-bowl"><b /></div>
      </div>
    </div>
  );
}
