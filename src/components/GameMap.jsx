import { SCENE_SIZE } from '../data/scenes.js';
import NPCSprite from './NPCSprite.jsx';
import Player from './Player.jsx';

function SceneDecor({ type }) {
  return (
    <div className={`scene-decor scene-${type}`}>
      <div className="scene-stars" />
      {type === 'river' && (
        <>
          <div className="scene-water"><span /><span /><span /></div>
          <div className="scene-railing" />
          <div className="scene-lamp lamp-left" />
          <div className="scene-lamp lamp-right" />
          <div className="scene-bench" />
        </>
      )}
      {type === 'wanshougong' && (
        <>
          <div className="scene-arch" />
          <div className="scene-lantern lantern-left" />
          <div className="scene-lantern lantern-right" />
          <div className="scene-table table-left" />
          <div className="scene-steam steam-left" />
          <div className="scene-steam steam-right" />
        </>
      )}
      {type === 'ktv' && (
        <>
          <div className="scene-neon">KTV</div>
          <div className="scene-speaker speaker-left" />
          <div className="scene-speaker speaker-right" />
          <div className="scene-sofa" />
          <div className="scene-note note-left" />
          <div className="scene-note note-right" />
        </>
      )}
      {type === 'bbq' && (
        <>
          <div className="scene-bbq-cart" />
          <div className="scene-grill" />
          <div className="scene-smoke smoke-left" />
          <div className="scene-smoke smoke-right" />
          <div className="scene-crate" />
          <div className="scene-stool stool-left" />
          <div className="scene-stool stool-right" />
        </>
      )}
      {type === 'pool' && (
        <>
          <div className="scene-pool-light" />
          <div className="scene-pool-table" />
          <div className="scene-cue cue-left" />
          <div className="scene-cue cue-right" />
          <div className="scene-scoreboard">8</div>
        </>
      )}
      {type === 'camp' && (
        <>
          <div className="scene-grass" />
          <div className="scene-tent tent-left" />
          <div className="scene-tent tent-right" />
          <div className="scene-fire" />
          <div className="scene-chair chair-left" />
          <div className="scene-chair chair-right" />
        </>
      )}
      {type === 'store' && (
        <>
          <div className="scene-storefront" />
          <div className="scene-store-door" />
          <div className="scene-fridge" />
          <div className="scene-register" />
          <div className="scene-vending" />
        </>
      )}
    </div>
  );
}

function EventPoint({ event, triggered, active }) {
  return (
    <div
      className={`event-point ${triggered ? 'triggered' : ''} ${active ? 'active' : ''}`}
      style={{ left: `${event.x}px`, top: `${event.y}px` }}
    >
      <span />
      <b>{event.label}</b>
    </div>
  );
}

export default function GameMap({
  scene,
  sceneNpcs,
  sceneEasterEggs,
  owenNpc,
  owenStallVisible,
  playerPosition,
  talkedNpcIds,
  triggeredEvents,
  nearbyTarget,
  lampClickCount,
  onLampClick,
}) {
  return (
    <div className="scene-viewport">
      <div
        className="scene-map"
        style={{ width: `${SCENE_SIZE.width}px`, height: `${SCENE_SIZE.height}px` }}
      >
        <SceneDecor type={scene.backgroundType} />
        <div className="scene-title-card">
          <strong>{scene.name}</strong>
          <span>{scene.subtitle}</span>
        </div>
        {scene.events.map((event) => (
          <EventPoint
            key={event.id}
            event={event}
            triggered={triggeredEvents.includes(event.id)}
            active={nearbyTarget?.type === 'event' && nearbyTarget.event.id === event.id}
          />
        ))}
        {sceneEasterEggs.map((egg) => (
          <div
            className={`easter-point ${nearbyTarget?.type === 'easter' && nearbyTarget.egg.id === egg.id ? 'active' : ''}`}
            style={{ left: `${egg.x}px`, top: `${egg.y}px` }}
            key={egg.id}
          >
            <span />
            <b>{egg.label}</b>
          </div>
        ))}
        {sceneNpcs.map((npc) => (
          <NPCSprite key={npc.id} npc={npc} talked={talkedNpcIds.includes(npc.id)} />
        ))}
        {scene.id === 'store' && (
          <button
            className={`hidden-lamp scene-hidden-lamp pixel-press ${lampClickCount > 0 ? 'awake' : ''}`}
            type="button"
            style={{ left: 348, top: 442 }}
            onClick={onLampClick}
            aria-label={`不起眼的小灯，已点击 ${lampClickCount} 次`}
          />
        )}
        {scene.id === 'store' && owenStallVisible && (
          <div className="scene-owen-stall" style={{ left: 272, top: 392 }}>
            <span className="stall-light" />
            <span className="stall-counter" />
            <span className="stall-cup" />
            <span className="stall-cake" />
            <b>今晚也营业的小摊</b>
          </div>
        )}
        {scene.id === 'store' && owenStallVisible && <NPCSprite npc={owenNpc} talked={false} />}
        <Player position={playerPosition} alert={Boolean(nearbyTarget)} />
        {nearbyTarget && (
          <div className="nearby-hint">
            {nearbyTarget.type === 'npc' || nearbyTarget.type === 'owen'
              ? '按空格互动 / 点击互动'
              : nearbyTarget.label}
          </div>
        )}
      </div>
    </div>
  );
}
