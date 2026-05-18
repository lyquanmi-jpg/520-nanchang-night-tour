import { defaultReminder } from '../data/npcData.js';

function TextList({ items, fallback, limit }) {
  if (!items.length) return fallback;
  const visible = limit ? items.slice(0, limit) : items;
  const rest = limit && items.length > limit ? `。还有 ${items.length - limit} 件小事被今晚收好。` : '';
  return `${visible.join('、')}${rest}`;
}

function ReportSection({ icon, title, children }) {
  return (
    <div className="report-section">
      <dt><span>{icon}</span>{title}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function ResultCard({ result, onRestart, onCopy, copied }) {
  const showHidden = result.owenEasterEggFound || result.owenNoteTaken || result.owenBirthdayHintSeen;
  const showStallBirthday = result.foundEasterEggIds?.includes('owen_hidden_birthday');

  return (
    <section className="result-card type-in">
      <div className="save-card-lights" />
      <p className="eyebrow">夜游存档卡</p>
      <h2>520夜游报告</h2>
      {result.overallProgress && (
        <div className="report-progress-summary">
          <b>今晚探索度：主线 {result.overallProgress.mainProgressPercent}%</b>
          <span>发现彩蛋：{(result.foundEasterEggNames || []).length}/12</span>
          <span>点亮地点：{result.overallProgress.litScenes}/{result.overallProgress.sceneTotal}</span>
          <small>
            {result.overallProgress.mainProgressPercent >= 75
              ? '你今晚把这座小小的南昌走得很认真。'
              : '今晚还有几盏灯可以慢慢走过去。'}
            {(result.foundEasterEggNames || []).length >= 6 ? ' 你还发现了很多藏在角落里的小光。' : ''}
          </small>
        </div>
      )}
      <dl className="report-grid">
        <ReportSection icon="▣" title="你今晚走过">
          <TextList items={result.visitedLocationNames} fallback="还没走远，但今晚已经开始了。" />
        </ReportSection>
        <ReportSection icon="◆" title="你遇见的人">
          <TextList items={result.talkedNpcNames} fallback="暂时还没开口，但城市已经亮着。" />
        </ReportSection>
        <ReportSection icon="✦" title="你收集到">
          <TextList items={result.collectedFragments} fallback="一小段正在路上的夜风" />
        </ReportSection>
        <ReportSection icon="▥" title="你和大家做过的小事">
          <TextList items={result.collectedMemories} limit={5} fallback="还没有和大家多做什么，但今晚还有很多站可以慢慢走。" />
        </ReportSection>
        <ReportSection icon="✧" title="你发现的夜游彩蛋">
          <TextList items={result.foundEasterEggNames || []} limit={6} fallback="你还没发现隐藏彩蛋，但今晚已经走得很好。" />
        </ReportSection>
        <ReportSection icon="▤" title="你触发的五月记忆">
          <TextList items={result.triggeredEvents} fallback="还没翻到旧存档，下一条路也许会遇见。" />
        </ReportSection>
        <ReportSection icon="●" title="今晚判定">
          {result.judgement}
        </ReportSection>
        {showHidden && (
          <ReportSection icon="*" title="隐藏彩蛋">
            {showStallBirthday
              ? '藏在小摊后的生日。有人把生日藏得很轻，只留下一盏灯和一串热的。'
              : '你路过了今晚也营业的小摊。有人把生日藏得很轻，只留下一杯热的和一盏灯。'}
          </ReportSection>
        )}
      </dl>
      <p className="fixed-line">{defaultReminder}</p>
      <div className="action-row">
        <button className="primary-button pixel-press" type="button" onClick={onRestart}>
          再走一次
        </button>
        <button className="secondary-button pixel-press" type="button" onClick={onCopy}>
          {copied ? '已复制' : '复制夜游报告'}
        </button>
      </div>
    </section>
  );
}
