import { useCallback, useEffect, useMemo, useState } from 'react';
import DialogBox from './components/DialogBox.jsx';
import FragmentToast from './components/FragmentToast.jsx';
import GameMap from './components/GameMap.jsx';
import MiniGameModal from './components/MiniGameModal.jsx';
import MobileControls from './components/MobileControls.jsx';
import PixelScene from './components/PixelScene.jsx';
import ResultCard from './components/ResultCard.jsx';
import RouteMap from './components/RouteMap.jsx';
import ScreenShell from './components/ScreenShell.jsx';
import { npcs, owenNpc } from './data/npcData.js';
import { EASTER_EGG_TOTAL, easterEggById, easterEggs } from './data/easterEggs.js';
import { eventInteractions, npcInteractions } from './data/npcInteractions.js';
import { SCENE_SIZE, sceneById, scenes } from './data/scenes.js';

const STEP = 22;
const INTERACT_DISTANCE = 48;
const START_POSITION = { x: 194, y: 418 };
const npcById = Object.fromEntries(npcs.map((npc) => [npc.id, npc]));

const introLines = [
  '今天是520。',
  '街上好像每个人都有安排。',
  '你打开手机，发现这个5月其实一直很热闹。',
  '有人露营，有人唱歌，有人吃饭，有人过生日。',
  '你只是暂时单排，队友一直在线。',
];

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function addUnique(list, item) {
  return list.includes(item) ? list : [...list, item];
}

function buildCopyText(result) {
  const lines = [
    '《520南昌搭子夜游》',
    '520夜游报告',
    `你今晚走过：${result.visitedLocationNames.join('、') || '还没走远，但今晚已经开始了。'}`,
    `你遇见的人：${result.talkedNpcNames.join('、') || '暂时还没开口，但城市已经亮着。'}`,
    `你收集到：${result.collectedFragments.join('、') || '一小段正在路上的夜风'}`,
    `你和大家做过的小事：${result.collectedMemories.join('、') || '还没有和大家多做什么，但今晚还有很多站可以慢慢走。'}`,
    `你发现的夜游彩蛋：${result.foundEasterEggNames.join('、') || '你还没发现隐藏彩蛋，但今晚已经走得很好。'}`,
    `你触发的五月记忆：${result.triggeredEvents.join('、') || '还没翻到旧存档，下一条路也许会遇见。'}`,
    `今晚判定：${result.judgement}`,
  ];

  if (result.owenEasterEggFound) {
    lines.push('隐藏彩蛋：你路过了“今晚也营业的小摊”。有人把生日藏得很轻，只留下一杯热的和一盏灯。');
  }

  lines.push('南昌精英搭子群一直在线。');
  return lines.join('\n');
}

function getFinalJudgement(memoryCount, eggCount) {
  if (memoryCount >= 5 && eggCount >= 6) {
    return '你今晚认真走过，也认真发现过。那些人、灯、椅子、小票和没发出去的话，都把你轻轻接了一下。';
  }
  if (memoryCount >= 5) {
    return '你今晚不是一个人走完的。你拍过照、唱过歌、等过烤串，也被很多小事接住了。';
  }
  if (eggCount >= 6) {
    return '你很会发现那些不起眼的小光。520这天，很多温柔都藏在角落里。';
  }
  if (memoryCount >= 1) {
    return '今晚没有多盛大，但你和几个人认真共享了一小段时间。';
  }
  return '你还没有和大家多聊，但南昌今晚的灯还亮着。';
}

function getGuideText({ currentSceneId, talkedNpcIds, collectedMemories, foundEasterEggIds, collectedFragments, visitedLocations }) {
  if (collectedFragments.length >= 6) return '你已经可以生成夜游报告，也可以继续找找彩蛋。';
  if (currentSceneId === 'store') return '便利店角落有一盏很小的灯，亮得有点认真。';
  if (foundEasterEggIds.length < 3 && visitedLocations.length >= 3) return '有些彩蛋藏在二次对话和不起眼的物件里。';
  if (foundEasterEggIds.length > 0) return '角落里的灯、椅子和小票，也可能藏着今晚的碎片。';
  if (collectedMemories.length > 0) return '再聊一次，也许会有新的话。';
  if (talkedNpcIds.length > 0) return '有些人会陪你做一件小事。';
  return '慢慢走，靠近亮着的地方，按互动键看看。';
}

export default function App() {
  const [screen, setScreen] = useState('title');
  const [currentSceneId, setCurrentSceneId] = useState('river');
  const [playerPosition, setPlayerPosition] = useState(START_POSITION);
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [talkedNpcIds, setTalkedNpcIds] = useState([]);
  const [completedInteractionIds, setCompletedInteractionIds] = useState([]);
  const [collectedFragments, setCollectedFragments] = useState([]);
  const [collectedMemories, setCollectedMemories] = useState([]);
  const [foundEasterEggIds, setFoundEasterEggIds] = useState([]);
  const [triggeredEvents, setTriggeredEvents] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [pendingInteractionId, setPendingInteractionId] = useState('');
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [endingGenerated, setEndingGenerated] = useState(false);
  const [lampClickCount, setLampClickCount] = useState(0);
  const [owenEasterEggFound, setOwenEasterEggFound] = useState(false);
  const [owenStallVisible, setOwenStallVisible] = useState(false);
  const [owenNoteTaken, setOwenNoteTaken] = useState(false);
  const [owenBirthdayHintSeen, setOwenBirthdayHintSeen] = useState(false);

  const currentScene = sceneById[currentSceneId];
  const sceneEasterEggs = useMemo(() => easterEggs.filter((egg) => {
    if (egg.sceneId !== currentSceneId) return false;
    if (egg.requiredInteractionId && !completedInteractionIds.includes(egg.requiredInteractionId)) return false;
    return true;
  }), [completedInteractionIds, currentSceneId]);
  const sceneNpcs = useMemo(() => currentScene.npcs.map((placement) => ({
    ...npcById[placement.id],
    x: placement.x,
    y: placement.y,
  })).filter(Boolean), [currentScene]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(''), 1800);
  }, []);

  const addFragment = useCallback((fragment) => {
    setCollectedFragments((current) => {
      if (current.includes(fragment)) return current;
      const next = [...current, fragment];
      showToast(`获得陪伴碎片：${fragment}`);
      if (next.length === 3) {
        window.setTimeout(() => showToast('今晚好像没有想象中那么冷清。'), 420);
      }
      return next;
    });
  }, [showToast]);

  const addMemory = useCallback((memory) => {
    setCollectedMemories((current) => addUnique(current, memory));
  }, []);

  const findEasterEgg = useCallback((eggId) => {
    const egg = easterEggById[eggId];
    if (!egg) return;
    setFoundEasterEggIds((current) => {
      if (current.includes(eggId)) return current;
      const next = [...current, eggId];
      showToast(`发现夜游彩蛋：${egg.name}`);
      window.setTimeout(() => {
        if (next.length === 1) showToast('你发现了一个夜游彩蛋。南昌今晚好像还藏着更多小东西。');
        if (next.length === 3) showToast('你开始注意到，那些不起眼的角落也在发光。');
        if (next.length === 6) showToast('今晚被你收好的小事，已经不止一点点了。');
        if (next.length === 10) showToast('你几乎把这座夜晚的小心意都找到了。');
      }, 600);
      setDialog({ speaker: egg.name, lines: [egg.text] });
      return next;
    });
  }, [showToast]);

  const enterScene = (sceneId) => {
    const scene = sceneById[sceneId];
    setCurrentSceneId(sceneId);
    setPlayerPosition(START_POSITION);
    setDialog({
      speaker: scene.name,
      lines: [scene.entryText, '慢慢走，靠近亮着的地方，按互动键看看。'],
    });
    setVisitedLocations((current) => addUnique(current, sceneId));
    setScreen('scene');
  };

  const returnToRoute = () => {
    setDialog(null);
    setActiveInteraction(null);
    setToast('');
    setScreen('route');
  };

  const movePlayer = useCallback((direction) => {
    if (screen !== 'scene' || dialog || activeInteraction) return;
    setPlayerPosition((position) => {
      const next = { ...position };
      if (direction === 'up') next.y -= STEP;
      if (direction === 'down') next.y += STEP;
      if (direction === 'left') next.x -= STEP;
      if (direction === 'right') next.x += STEP;
      return {
        x: clamp(next.x, 26, SCENE_SIZE.width - 26),
        y: clamp(next.y, 86, SCENE_SIZE.height - 42),
      };
    });
  }, [activeInteraction, dialog, screen]);

  const nearbyTarget = useMemo(() => {
    if (screen !== 'scene') return null;
    const npcTarget = sceneNpcs
      .map((npc) => ({ type: 'npc', npc, label: '按空格互动 / 点击互动', d: distance(playerPosition, npc) }))
      .filter((target) => target.d <= INTERACT_DISTANCE)
      .sort((a, b) => a.d - b.d)[0];
    if (npcTarget) return npcTarget;
    if (currentScene.id === 'store' && owenStallVisible && distance(playerPosition, { x: 320, y: 408 }) <= INTERACT_DISTANCE) {
      return { type: 'owen', npc: { ...owenNpc, x: 320, y: 408 }, label: '按空格互动 / 点击互动' };
    }
    if (currentScene.id === 'store' && !owenStallVisible && distance(playerPosition, { x: 348, y: 442 }) <= 52) {
      return { type: 'lamp', label: `点击互动：不起眼的小灯 ${lampClickCount}/5` };
    }
    const eggTarget = sceneEasterEggs
      .map((egg) => ({ type: 'easter', egg, label: `可互动：${egg.label}`, d: distance(playerPosition, egg) }))
      .filter((target) => target.d <= INTERACT_DISTANCE)
      .sort((a, b) => a.d - b.d)[0];
    if (eggTarget) return eggTarget;
    return currentScene.events
      .map((event) => ({ type: 'event', event, label: `可互动：${event.label}`, d: distance(playerPosition, event) }))
      .filter((target) => target.d <= INTERACT_DISTANCE)
      .sort((a, b) => a.d - b.d)[0] || null;
  }, [currentScene, lampClickCount, owenStallVisible, playerPosition, sceneEasterEggs, sceneNpcs, screen]);

  const sceneDone = useMemo(() => {
    const npcDone = currentScene.npcs.every((npc) => completedInteractionIds.includes(npc.id) || !npcInteractions[npc.id]);
    const eventDone = currentScene.events.every((event) => triggeredEvents.includes(event.id));
    return npcDone && eventDone;
  }, [completedInteractionIds, currentScene, triggeredEvents]);

  useEffect(() => {
    if (screen === 'scene' && sceneDone) {
      showToast('这个地方的灯已经被你点亮了，可以去下一站看看。');
    }
  }, [sceneDone, screen, showToast]);

  const openInteraction = (interactionId, interaction, speaker) => {
    setPendingInteractionId(interactionId);
    setDialog({
      speaker,
      lines: interaction.intro,
      options: interaction.choices,
    });
  };

  const interactWithNpc = useCallback((npc) => {
    setTalkedNpcIds((current) => addUnique(current, npc.id));
    const interaction = npcInteractions[npc.id];
    if (!interaction) {
      setDialog({ speaker: `${npc.name} · ${npc.roleTitle}`, lines: [npc.dialogue] });
      return;
    }
    if (completedInteractionIds.includes(npc.id)) {
      const repeatEgg = easterEggs.find((egg) => egg.type === 'npc-repeat' && egg.npcId === npc.id);
      if (repeatEgg && !foundEasterEggIds.includes(repeatEgg.id)) {
        findEasterEgg(repeatEgg.id);
        return;
      }
      setDialog({ speaker: `${npc.name} · ${npc.roleTitle}`, lines: [interaction.afterComplete || '还在这儿呢，想再坐会儿也行。'] });
      return;
    }
    openInteraction(npc.id, interaction, `${npc.name} · ${npc.roleTitle}`);
  }, [completedInteractionIds, findEasterEgg, foundEasterEggIds]);

  const interactWithEvent = useCallback((event) => {
    const interaction = eventInteractions[event.id];
    if (interaction && !completedInteractionIds.includes(`event:${event.id}`)) {
      openInteraction(`event:${event.id}`, interaction, event.label);
      return;
    }
    const triggered = triggeredEvents.includes(event.id);
    if (!triggered) {
      setTriggeredEvents((current) => addUnique(current, event.id));
      addFragment(event.fragment);
    }
    setDialog({
      speaker: event.label,
      lines: [
        triggered ? '这段五月记忆已经被你收进今晚了。' : `五月记忆被点亮：${event.id}`,
        triggered ? '它还在这里，像一盏小灯。' : `获得陪伴碎片：${event.fragment}`,
      ],
    });
  }, [addFragment, completedInteractionIds, triggeredEvents]);

  const interactWithLamp = useCallback(() => {
    if (owenStallVisible) return;
    setLampClickCount((count) => {
      const next = count + 1;
      if (next >= 5) {
        setOwenStallVisible(true);
        setOwenEasterEggFound(true);
        showToast('角落亮起了：今晚也营业的小摊');
        return 0;
      }
      showToast(`小灯轻轻闪了一下：${next}/5`);
      return next;
    });
  }, [owenStallVisible, showToast]);

  const openOwenDialog = useCallback(() => {
    setOwenEasterEggFound(true);
    setDialog({
      speaker: '今晚也营业的小摊',
      lines: ['路过就坐一会儿吧。', '今天没安排也没关系，灯还亮着。', '想喝点什么？这杯算小摊请你。'],
      options: [
        { id: 'milk-tea', text: '要一杯奶茶' },
        { id: 'note', text: '拿一张便签' },
        { id: 'birthday', text: '问他今天为什么摆摊' },
        { id: 'leave', text: '继续夜游' },
      ],
    });
  }, []);

  const interact = useCallback(() => {
    if (dialog || activeInteraction || !nearbyTarget) return;
    if (nearbyTarget.type === 'npc') interactWithNpc(nearbyTarget.npc);
    if (nearbyTarget.type === 'event') interactWithEvent(nearbyTarget.event);
    if (nearbyTarget.type === 'lamp') interactWithLamp();
    if (nearbyTarget.type === 'easter') findEasterEgg(nearbyTarget.egg.id);
    if (nearbyTarget.type === 'owen') openOwenDialog();
  }, [activeInteraction, dialog, findEasterEgg, interactWithEvent, interactWithLamp, interactWithNpc, nearbyTarget, openOwenDialog]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') { event.preventDefault(); movePlayer('up'); }
      if (event.key === 'ArrowDown') { event.preventDefault(); movePlayer('down'); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); movePlayer('left'); }
      if (event.key === 'ArrowRight') { event.preventDefault(); movePlayer('right'); }
      if (event.code === 'Space') { event.preventDefault(); interact(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interact, movePlayer]);

  const handleDialogOption = (optionId) => {
    if (pendingInteractionId) {
      const interaction = pendingInteractionId.startsWith('event:')
        ? eventInteractions[pendingInteractionId.replace('event:', '')]
        : npcInteractions[pendingInteractionId];
      setDialog({
        speaker: interaction.title,
        lines: ['好，那就一起做完这件小事。'],
        startGame: true,
      });
      return;
    }
    setOwenEasterEggFound(true);
    if (optionId === 'milk-tea') {
      setDialog({ speaker: '今晚也营业的小摊', lines: ['你拿到了一杯温热的奶茶。', '杯套上写着：今晚也要好好回家。', '隐藏记录：路过一间小摊'] });
    }
    if (optionId === 'note') {
      setOwenNoteTaken(true);
      setDialog({ speaker: '今晚也营业的小摊', lines: ['便签上写着：如果今天没有人约你，也没关系。', '你仍然可以把今晚过得很认真。', '隐藏记录：拿到一张便签'] });
    }
    if (optionId === 'birthday') {
      setOwenBirthdayHintSeen(true);
      findEasterEgg('owen-birthday');
      setDialog({ speaker: '奶茶鼠欧文', lines: ['其实今天也是我的生日。', '但我只是顺手把小摊开着。', '520这天，路过的人很多。', '总有人需要一盏灯，或者一杯热的。', '隐藏记录：发现一个很小的生日彩蛋'] });
    }
    if (optionId === 'leave') {
      setDialog({ speaker: '今晚也营业的小摊', lines: ['那就继续走走吧。', '南昌今晚还有很多灯。'] });
    }
  };

  const startMiniGame = () => {
    const interaction = pendingInteractionId.startsWith('event:')
      ? eventInteractions[pendingInteractionId.replace('event:', '')]
      : npcInteractions[pendingInteractionId];
    setDialog(null);
    setActiveInteraction(interaction);
  };

  const completeMiniGame = (result) => {
    addFragment(result.fragment);
    addMemory(result.memory);
    if (pendingInteractionId.startsWith('event:')) {
      const eventId = pendingInteractionId.replace('event:', '');
      setTriggeredEvents((current) => addUnique(current, eventId));
    } else {
      setCompletedInteractionIds((current) => addUnique(current, pendingInteractionId));
      setTalkedNpcIds((current) => addUnique(current, pendingInteractionId));
      if (pendingInteractionId === 'store-message') findEasterEgg('group-99');
    }
    setCompletedInteractionIds((current) => addUnique(current, pendingInteractionId));
    setActiveInteraction(null);
    setDialog({
      speaker: activeInteraction.title,
      lines: [result.text, `共同记忆：${result.memory}`, `获得陪伴碎片：${result.fragment}`],
    });
    setPendingInteractionId('');
  };

  const canGenerateReport = collectedFragments.length >= 6 || visitedLocations.length >= 4;
  const result = useMemo(() => {
    const visitedLocationNames = visitedLocations.map((id) => sceneById[id]?.name).filter(Boolean);
    const talkedNpcNames = talkedNpcIds.map((id) => npcById[id]?.name).filter(Boolean);
    const foundEasterEggNames = foundEasterEggIds.map((id) => easterEggById[id]?.name).filter(Boolean);
    return {
      visitedLocationNames,
      talkedNpcNames,
      collectedFragments,
      collectedMemories,
      foundEasterEggIds,
      foundEasterEggNames,
      triggeredEvents,
      judgement: getFinalJudgement(collectedMemories.length, foundEasterEggIds.length),
      owenEasterEggFound,
      owenNoteTaken,
      owenBirthdayHintSeen,
    };
  }, [collectedFragments, collectedMemories, foundEasterEggIds, owenBirthdayHintSeen, owenEasterEggFound, owenNoteTaken, talkedNpcIds, triggeredEvents, visitedLocations]);

  const sceneProgress = (scene) => {
    const npcFragments = scene.npcs.map((placement) => npcInteractions[placement.id]?.reward.fragment || npcById[placement.id]?.fragment).filter(Boolean);
    const eventFragments = scene.events.map((event) => eventInteractions[event.id]?.reward.fragment || event.fragment);
    const uniqueFragments = [...new Set([...npcFragments, ...eventFragments])];
    return { total: uniqueFragments.length, collected: uniqueFragments.filter((fragment) => collectedFragments.includes(fragment)).length };
  };

  const resetGame = () => {
    setScreen('title');
    setCurrentSceneId('river');
    setPlayerPosition(START_POSITION);
    setVisitedLocations([]);
    setTalkedNpcIds([]);
    setCompletedInteractionIds([]);
    setCollectedFragments([]);
    setCollectedMemories([]);
    setFoundEasterEggIds([]);
    setTriggeredEvents([]);
    setDialog(null);
    setActiveInteraction(null);
    setPendingInteractionId('');
    setToast('');
    setCopied(false);
    setEndingGenerated(false);
    setLampClickCount(0);
    setOwenEasterEggFound(false);
    setOwenStallVisible(false);
    setOwenNoteTaken(false);
    setOwenBirthdayHintSeen(false);
  };

  const copyResult = async () => {
    const text = buildCopyText(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      setCopied(true);
    }
  };

  return (
    <div className="app">
      {screen === 'title' && (
        <ScreenShell className="title-screen">
          <PixelScene />
          <section className="hero-panel">
            <p className="eyebrow">南昌精英搭子群 520 夜游存档</p>
            <h1>520南昌搭子夜游</h1>
            <p className="subtitle">一个人的520，也可以在南昌慢慢走</p>
            <div className="intro-copy">{introLines.map((line) => <p key={line}>{line}</p>)}</div>
            <button className="primary-button pixel-press" type="button" onClick={() => setScreen('route')}>出门走走</button>
          </section>
        </ScreenShell>
      )}

      {screen === 'route' && (
        <RouteMap
          scenes={scenes}
          visitedLocations={visitedLocations}
          collectedFragments={collectedFragments}
          canGenerateReport={canGenerateReport}
          onEnterScene={enterScene}
          onGenerateReport={() => { setEndingGenerated(true); setScreen('result'); }}
          sceneProgress={sceneProgress}
        />
      )}

      {screen === 'scene' && (
        <main className="game-screen scene-screen">
          <header className="game-hud">
            <div className="hud-title"><p>520南昌搭子夜游</p><strong>当前地点：{currentScene.name}</strong></div>
            <div className="hud-progress">
              <span>碎片 {Math.min(collectedFragments.length, 6)}/6</span>
              <span>地点 {Math.min(visitedLocations.length, 4)}/4</span>
              <span>彩蛋 {foundEasterEggIds.length}/{EASTER_EGG_TOTAL}</span>
              <button className="hud-report-button return-button pixel-press" type="button" onClick={returnToRoute}>返回路线图</button>
              {canGenerateReport && <button className="hud-report-button pixel-press" type="button" onClick={() => { setEndingGenerated(true); setScreen('result'); }}>生成夜游报告</button>}
            </div>
          </header>
          <GameMap
            scene={currentScene}
            sceneNpcs={sceneNpcs}
            sceneEasterEggs={sceneEasterEggs}
            owenNpc={{ ...owenNpc, x: 320, y: 408 }}
            owenStallVisible={owenStallVisible}
            playerPosition={playerPosition}
            talkedNpcIds={talkedNpcIds}
            triggeredEvents={triggeredEvents}
            nearbyTarget={nearbyTarget}
            lampClickCount={lampClickCount}
            onLampClick={interactWithLamp}
          />
          <div className="map-status"><p>{nearbyTarget ? nearbyTarget.label : getGuideText({
            currentSceneId,
            talkedNpcIds,
            collectedMemories,
            foundEasterEggIds,
            collectedFragments,
            visitedLocations,
          })}</p></div>
          <MobileControls onMove={movePlayer} onInteract={interact} canInteract={Boolean(nearbyTarget)} />
          <DialogBox dialog={dialog} onClose={() => setDialog(null)} onOption={handleDialogOption} onStartGame={startMiniGame} />
          {activeInteraction && <MiniGameModal interaction={activeInteraction} onComplete={completeMiniGame} onSkip={() => {}} />}
          <FragmentToast message={toast} />
        </main>
      )}

      {screen === 'result' && endingGenerated && (
        <ScreenShell className="result-screen">
          <ResultCard result={result} onRestart={resetGame} onCopy={copyResult} copied={copied} />
        </ScreenShell>
      )}
    </div>
  );
}
