export default function RouteMap({
  scenes,
  visitedLocations,
  collectedFragments,
  canGenerateReport,
  onEnterScene,
  onGenerateReport,
  sceneProgress,
  nextRecommendation,
  reportProgressHint,
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

      <section className="route-guidance">
        <strong>今晚建议</strong>
        <p>{nextRecommendation.text}</p>
        <small>{reportProgressHint}</small>
      </section>

      <section className="route-line">
        {scenes.map((scene, index) => {
          const visited = visitedLocations.includes(scene.id);
          const progress = sceneProgress(scene);
          const status = !visited
            ? '未开始'
            : progress.fullComplete
              ? '这盏灯已经被你点亮'
              : progress.mainComplete
                ? '主线完成，还有角落没看完'
                : '探索中';

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
              <small>探索 {progress.mainDone}/{progress.mainTotal}</small>
              <small>彩蛋 {progress.easterEggsFound}/{progress.easterEggsTotal}</small>
              <small className={`route-status ${progress.mainComplete ? 'complete' : ''}`}>{status}</small>
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
