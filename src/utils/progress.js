import { easterEggs } from '../data/easterEggs.js';
import { eventInteractions, npcInteractions } from '../data/npcInteractions.js';
import { sceneProgressMeta } from '../data/scenes.js';

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function percent(done, total) {
  if (!total) return 100;
  return Math.round((done / total) * 100);
}

function sceneNpcIds(scene) {
  const meta = sceneProgressMeta[scene.id] || {};
  return unique([...(scene.requiredNpcIds || meta.requiredNpcIds || []), ...(scene.optionalNpcIds || meta.optionalNpcIds || scene.npcs.map((npc) => npc.id))]);
}

function sceneEventIds(scene) {
  const meta = sceneProgressMeta[scene.id] || {};
  return scene.eventIds || meta.eventIds || scene.events.map((event) => event.id);
}

function sceneMainFragments(scene) {
  const meta = sceneProgressMeta[scene.id] || {};
  const npcFragments = sceneNpcIds(scene).map((id) => npcInteractions[id]?.reward.fragment);
  const eventFragments = scene.events.map((event) => eventInteractions[event.id]?.reward.fragment || event.fragment);
  return unique([...(scene.mainFragmentIds || meta.mainFragmentIds || []), ...npcFragments, ...eventFragments]);
}

export function getSceneProgress(scene, gameState) {
  const npcIds = sceneNpcIds(scene);
  const eventIds = sceneEventIds(scene);
  const fragmentIds = sceneMainFragments(scene);
  const meta = sceneProgressMeta[scene.id] || {};
  const eggIds = scene.easterEggIds || meta.easterEggIds || easterEggs.filter((egg) => egg.sceneId === scene.id).map((egg) => egg.id);

  const npcCompleted = npcIds.filter((id) => gameState.completedInteractionIds.includes(id)).length;
  const eventsCompleted = eventIds.filter((id) => gameState.triggeredEvents.includes(id)).length;
  const fragmentsCollected = fragmentIds.filter((fragment) => gameState.collectedFragments.includes(fragment)).length;
  const easterEggsFound = eggIds.filter((id) => gameState.foundEasterEggIds.includes(id)).length;

  const mainDone = npcCompleted + eventsCompleted + fragmentsCollected;
  const mainTotal = npcIds.length + eventIds.length + fragmentIds.length;
  const fullDone = mainDone + easterEggsFound;
  const fullTotal = mainTotal + eggIds.length;

  return {
    sceneId: scene.id,
    visited: gameState.visitedLocations.includes(scene.id),
    npcCompleted,
    npcTotal: npcIds.length,
    eventsCompleted,
    eventsTotal: eventIds.length,
    fragmentsCollected,
    fragmentsTotal: fragmentIds.length,
    easterEggsFound,
    easterEggsTotal: eggIds.length,
    mainDone,
    mainTotal,
    fullDone,
    fullTotal,
    mainProgressPercent: percent(mainDone, mainTotal),
    fullProgressPercent: percent(fullDone, fullTotal),
    mainComplete: mainDone >= mainTotal,
    fullComplete: fullDone >= fullTotal,
  };
}

export function getSceneMissingItems(scene, gameState) {
  const npcIds = sceneNpcIds(scene);
  const eventIds = sceneEventIds(scene);
  const fragments = sceneMainFragments(scene);
  const meta = sceneProgressMeta[scene.id] || {};
  const eggIds = scene.easterEggIds || meta.easterEggIds || easterEggs.filter((egg) => egg.sceneId === scene.id).map((egg) => egg.id);

  return {
    npcIds: npcIds.filter((id) => !gameState.completedInteractionIds.includes(id)),
    eventIds: eventIds.filter((id) => !gameState.triggeredEvents.includes(id)),
    fragments: fragments.filter((fragment) => !gameState.collectedFragments.includes(fragment)),
    easterEggIds: eggIds.filter((id) => !gameState.foundEasterEggIds.includes(id)),
  };
}

export function getOverallProgress(scenes, gameState) {
  const sceneProgress = scenes.map((scene) => getSceneProgress(scene, gameState));
  const mainDone = sceneProgress.reduce((sum, progress) => sum + progress.mainDone, 0);
  const mainTotal = sceneProgress.reduce((sum, progress) => sum + progress.mainTotal, 0);
  const fullDone = sceneProgress.reduce((sum, progress) => sum + progress.fullDone, 0);
  const fullTotal = sceneProgress.reduce((sum, progress) => sum + progress.fullTotal, 0);
  const litScenes = sceneProgress.filter((progress) => progress.mainComplete).length;

  return {
    mainDone,
    mainTotal,
    fullDone,
    fullTotal,
    litScenes,
    sceneTotal: scenes.length,
    mainProgressPercent: percent(mainDone, mainTotal),
    fullProgressPercent: percent(fullDone, fullTotal),
  };
}

export function getReportProgressHint(gameState) {
  const fragmentLeft = Math.max(0, 6 - gameState.collectedFragments.length);
  const locationLeft = Math.max(0, 4 - gameState.visitedLocations.length);

  if (fragmentLeft === 0 || locationLeft === 0) {
    return '你已经可以生成夜游报告了，也可以继续探索彩蛋。';
  }

  return `还差 ${fragmentLeft} 个陪伴碎片，或者再去 ${locationLeft} 个地点，就能生成夜游报告。`;
}

export function getNextRecommendedScene(scenes, gameState) {
  const progressList = scenes.map((scene) => ({
    scene,
    progress: getSceneProgress(scene, gameState),
    missing: getSceneMissingItems(scene, gameState),
  }));

  const reportReady = gameState.collectedFragments.length >= 6 || gameState.visitedLocations.length >= 4;
  if (reportReady) {
    const withEggs = progressList.find((item) => item.progress.mainComplete && item.progress.easterEggsFound < item.progress.easterEggsTotal);
    return {
      scene: withEggs?.scene || null,
      text: withEggs
        ? `你已经可以生成夜游报告了。如果还想多走走，${withEggs.scene.name}好像还有一点小光。`
        : '你已经可以生成夜游报告了，也可以继续慢慢走。'
    };
  }

  const unvisited = progressList.find((item) => !item.progress.visited && !item.progress.mainComplete);
  const target = unvisited || progressList
    .filter((item) => !item.progress.mainComplete)
    .sort((a, b) => a.progress.mainProgressPercent - b.progress.mainProgressPercent)[0];

  if (!target) {
    return { scene: null, text: '今晚的主要记忆已经收得差不多了，可以写下夜游报告。' };
  }

  const missingCount = target.missing.npcIds.length + target.missing.eventIds.length + target.missing.fragments.length;
  return {
    scene: target.scene,
    text: `先去${target.scene.name}看看，那里还有 ${missingCount || 1} 个夜晚小事没收好。`,
  };
}

export function getSceneNudge(scene, gameState) {
  const missing = getSceneMissingItems(scene, gameState);
  const progress = getSceneProgress(scene, gameState);

  if (missing.npcIds.length) return '这个地方好像还有人想和你说句话。';
  if (missing.eventIds.length) return '这里有一段五月的记忆，还没被你翻到。';
  if (progress.mainComplete && missing.easterEggIds.length) return '主要的事已经收好了，角落里也许还藏着一点小光。';
  if (progress.mainComplete) return '这个地方的主要记忆已经被你收好了，可以去下一站看看。';
  return scene.completionHint || sceneProgressMeta[scene.id]?.completionHint || '靠近亮着的人或物件，按互动键看看。';
}
