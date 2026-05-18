export default function RouteMap({
  scenes,
  visitedLocations,
  collectedFragments,
  canGenerateReport,
  onEnterScene,
  onGenerateReport,
  sceneProgress,
}) {
  return (
    <main className="route-screen">
      <header className="route-header">
        <div>
          <p className="eyebrow">夜游路线图</p>
          <h1>520南昌搭子夜游</h1>
          <span>选一站慢慢走。今晚不用赶路。</span>
        </div>
        <div className="route-stats">
          <b>碎片 {Math.min(collectedFragments.length, 6)}/6</b>
          <b>地点 {Math.min(visitedLocations.length, 4)}/4</b>
        </div>
      </header>
      <section className="route-line">
        {scenes.map((scene, index) => {
          const visited = visitedLocations.includes(scene.id);
          const progress = sceneProgress(scene);
          return (
            <button
              className={`route-card pixel-press ${visited ? 'visited' : ''}`}
              type="button"
              key={scene.id}
              onClick={() => onEnterScene(scene.id)}
            >
              <span className="route-node">{index + 1}</span>
              <span className={`route-icon route-icon-${scene.backgroundType}`} />
              <strong>{scene.name}</strong>
              <em>{scene.cta}</em>
              <small>已收集 {progress.collected}/{progress.total}</small>
            </button>
          );
        })}
      </section>
      {canGenerateReport && (
        <button className="primary-button pixel-press route-report" type="button" onClick={onGenerateReport}>
          生成520夜游报告
        </button>
      )}
    </main>
  );
}
