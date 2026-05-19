export default function MusicToggle({ enabled, onToggle }) {
  return (
    <button
      className={`music-toggle pixel-press ${enabled ? 'on' : 'off'}`}
      type="button"
      onClick={onToggle}
      aria-label={enabled ? '关闭音乐' : '打开音乐'}
    >
      <span>{enabled ? '♫' : '×♫'}</span>
      <b>{enabled ? '开' : '关'}</b>
    </button>
  );
}
