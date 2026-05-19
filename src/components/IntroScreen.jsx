import PixelScene from './PixelScene.jsx';
import ScreenShell from './ScreenShell.jsx';

const introLines = [
  '今天是520。',
  '街上好像每个人都有安排。',
  '你打开手机，发现这个5月其实一直很热闹。',
  '有人露营，有人唱歌，有人吃饭，有人过生日。',
  '如果今晚暂时单排，',
  '那就从这里出门走走。',
];

export default function IntroScreen({ leaving = false, onStart }) {
  return (
    <ScreenShell className={`title-screen cover-night ${leaving ? 'leaving' : ''}`}>
      <PixelScene />
      <section className="hero-panel cover-panel">
        <p className="eyebrow">南昌精英搭子群 520 夜游存档</p>
        <h1>520南昌搭子夜游</h1>
        <p className="subtitle">一个人的520，也可以在南昌慢慢走</p>
        <div className="intro-copy">
          {introLines.map((line, index) => (
            <p className={index === 1 || index === 4 ? 'soft-break' : ''} key={line}>{line}</p>
          ))}
        </div>
        <button className="primary-button start-button pixel-press" type="button" onClick={onStart}>
          出门走走
        </button>
        <small className="sound-tip">建议打开声音，今晚会更像一场夜游。</small>
      </section>
    </ScreenShell>
  );
}
