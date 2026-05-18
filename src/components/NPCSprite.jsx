export default function NPCSprite({ npc, talked = false, completed = false, hidden = false }) {
  if (hidden) return null;

  return (
    <div
      className={`npc-sprite npc-${npc.visual || 'default'} ${talked ? 'talked' : ''} ${completed ? 'completed' : ''} ${npc.id === 'owen' ? 'owen-sprite' : ''}`}
      style={{ left: `${npc.x}px`, top: `${npc.y}px` }}
      title={npc.name}
    >
      <span className="npc-state-dot">{completed ? '✓' : '...'}</span>
      <span className="npc-shadow" />
      <span className="npc-legs" />
      <span className="npc-body" />
      <span className="npc-head" />
      <span className="npc-hair" />
      <span className="npc-face" />
      <span className="npc-accessory" />
      <b className="npc-nameplate">{npc.name}</b>
    </div>
  );
}
