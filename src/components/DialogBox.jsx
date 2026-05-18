import { useEffect, useState } from 'react';

export default function DialogBox({ dialog, onClose, onOption, onStartGame }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [dialog]);

  if (!dialog) return null;

  const lines = dialog.lines || [];
  const currentLine = lines[index] || '';
  const hasNext = index < lines.length - 1;
  const canChoose = !hasNext && dialog.options?.length;
  const canStartGame = !hasNext && dialog.startGame;

  const next = () => {
    if (hasNext) {
      setIndex((value) => value + 1);
      return;
    }
    if (!canChoose && !canStartGame) onClose();
  };

  return (
    <section className="dialog-box">
      <div className="dialog-title">{dialog.speaker}</div>
      <div className="dialog-lines">
        <p>{currentLine}</p>
      </div>
      {canChoose && (
        <div className="dialog-options">
          {dialog.options.map((option) => (
            <button
              className="secondary-button pixel-press"
              key={option.id}
              type="button"
              onClick={() => onOption(option.id)}
            >
              {option.text || option.label}
            </button>
          ))}
        </div>
      )}
      {canStartGame && (
        <button className="primary-button pixel-press" type="button" onClick={onStartGame}>
          开始这件小事
        </button>
      )}
      {!canChoose && !canStartGame && (
        <button className="primary-button pixel-press" type="button" onClick={next}>
          {hasNext ? '继续' : '继续夜游'}
        </button>
      )}
    </section>
  );
}
