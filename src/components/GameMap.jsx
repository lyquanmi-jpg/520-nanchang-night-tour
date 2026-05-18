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
      {type === 'stall' && (
        <>
          <div className="scene-bbq-cart" />
          <div className="scene-grill" />
          <div className="scene-smoke smoke-left" />
          <div className="scene-smoke smoke-right" />
          <div className="scene-stool stool-left" />
          <div className="scene-stool stool-right" />
          <div className="scene-lamp lamp-right" />
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
  currentSceneProgress,
  playerPosition,
  talkedNpcIds,
  completedInteractionIds,
  triggeredEvents,
  foundEasterEggIds,
  nearbyTarget,
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
        {currentSceneProgress && (
          <div className="scene-progress-card">
            <b>本地点 {currentSceneProgress.mainDone}/{currentSceneProgress.mainTotal}</b>
            <span>彩蛋 {currentSceneProgress.easterEggsFound}/{currentSceneProgress.easterEggsTotal}</span>
          </div>
        )}
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
            className={`easter-point ${foundEasterEggIds.includes(egg.id) ? 'found' : ''} ${nearbyTarget?.type === 'easter' && nearbyTarget.egg.id === egg.id ? 'active' : ''}`}
            style={{ left: `${egg.x}px`, top: `${egg.y}px` }}
            key={egg.id}
          >
            <span />
            <b>{egg.label}</b>
          </div>
        ))}
        {sceneNpcs.map((npc) => (
          <NPCSprite key={npc.id} npc={npc} talked={talkedNpcIds.includes(npc.id)} completed={completedInteractionIds.includes(npc.id)} />
        ))}
        <Player position={playerPosition} alert={Boolean(nearbyTarget)} />
        {nearbyTarget && (
          <div className="nearby-hint">
            {nearbyTarget.type === 'npc'
              ? '按空格互动 / 点击互动'
              : nearbyTarget.label}
          </div>
        )}
      </div>
    </div>
  );
}
