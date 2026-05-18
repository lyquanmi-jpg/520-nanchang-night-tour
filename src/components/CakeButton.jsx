export default function CakeButton({ count, onClick }) {
  return (
    <button
      className="cake-button pixel-press"
      type="button"
      onClick={onClick}
      aria-label={`隐藏生日蛋糕，已点击 ${count} 次`}
    >
      <span className="cake-top" />
      <span className="cake-body" />
      <span className="cake-light" />
    </button>
  );
}
