import { useMemo, useRef, useState } from 'react';

function TimingGame({ game, onFinish }) {
  const startRef = useRef(Date.now());

  const shoot = () => {
    const elapsed = (Date.now() - startRef.current) % 1800;
    const progress = elapsed / 1800;
    const success = progress >= 0.42 && progress <= 0.58;
    onFinish(success);
  };

  return (
    <div className="mini-game-body">
      <div className="timing-track">
        <span className="timing-zone" />
        <span className="timing-dot" />
      </div>
      <button className="primary-button pixel-press" type="button" onClick={shoot}>
        {game.actionLabel || '点击'}
      </button>
    </div>
  );
}

function ChoiceGame({ game, onFinish }) {
  return (
    <div className="mini-game-options">
      {game.options.map((option, index) => (
        <button
          className="secondary-button pixel-press"
          type="button"
          key={option}
          onClick={() => onFinish(game.correctIndex == null || index === game.correctIndex)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TapRhythmGame({ game, onFinish }) {
  const [step, setStep] = useState(0);
  const [missed, setMissed] = useState(false);

  const tap = (label) => {
    if (label !== game.sequence[step]) {
      setMissed(true);
      return;
    }
    const next = step + 1;
    if (next >= game.sequence.length) {
      onFinish(!missed);
    } else {
      setStep(next);
    }
  };

  return (
    <div className="mini-game-body">
      <p className="rhythm-next">下一步：{game.sequence[step]}</p>
      <div className="mini-game-options compact">
        {game.sequence.map((label) => (
          <button className="secondary-button pixel-press" type="button" key={label} onClick={() => tap(label)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ServeGame({ game, onFinish }) {
  const [selected, setSelected] = useState([]);
  const maxSelect = game.maxSelect || 1;
  const minSelect = game.minSelect || 1;

  const toggle = (option) => {
    setSelected((current) => {
      if (current.includes(option)) return current.filter((item) => item !== option);
      if (current.length >= maxSelect) return [...current.slice(1), option];
      return [...current, option];
    });
  };

  return (
    <div className="mini-game-body">
      <div className="mini-game-options compact">
        {game.options.map((option) => (
          <button
            className={`secondary-button pixel-press ${selected.includes(option) ? 'selected' : ''}`}
            type="button"
            key={option}
            onClick={() => toggle(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button className="primary-button pixel-press" type="button" disabled={selected.length < minSelect} onClick={() => onFinish(true)}>
        递过去
      </button>
    </div>
  );
}

export default function MiniGameModal({ interaction, onComplete, onSkip }) {
  const [result, setResult] = useState(null);
  const game = interaction.miniGame;

  const resultText = useMemo(() => {
    if (!result) return '';
    if (result.skipped) return interaction.skipText || '你先把这件小事放下了。对方说：没关系，能走到这里就很好。';
    return result.success ? (game.successText || interaction.reward.memory) : (game.failText || game.successText || interaction.reward.memory);
  }, [game, interaction, result]);

  const finish = (success) => {
    setResult({ success });
  };

  const complete = () => {
    onComplete({
      success: result?.success ?? true,
      skipped: result?.skipped ?? false,
      text: resultText,
      fragment: interaction.reward.fragment,
      memory: interaction.reward.memory,
    });
  };

  const skip = () => {
    setResult({ success: false, skipped: true });
  };

  return (
    <section className="mini-game-modal">
      <div className="mini-game-card">
        <p className="eyebrow">{interaction.title}</p>
        <h2>{game.title}</h2>
        <p className="mini-instruction">{game.instruction}</p>
        {!result && game.type === 'timing' && <TimingGame game={game} onFinish={finish} />}
        {!result && (game.type === 'choice' || game.type === 'memoryPick') && <ChoiceGame game={game} onFinish={finish} />}
        {!result && game.type === 'tapRhythm' && <TapRhythmGame game={game} onFinish={finish} />}
        {!result && game.type === 'serve' && <ServeGame game={game} onFinish={finish} />}
        {!result && game.type === 'warmText' && (
          <button className="primary-button pixel-press" type="button" onClick={() => finish(true)}>
            继续听他说
          </button>
        )}
        {result && (
          <div className="mini-result">
            <p>{resultText}</p>
            <p className="dialog-reward">获得陪伴碎片：{interaction.reward.fragment}</p>
            <button className="primary-button pixel-press" type="button" onClick={complete}>
              收进今晚
            </button>
          </div>
        )}
        {!result && (
          <button className="mini-skip pixel-press" type="button" onClick={skip}>
            先跳过，也没关系
          </button>
        )}
      </div>
    </section>
  );
}
