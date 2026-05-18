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

function metaFor(scene) {
  return sceneProgressMeta[scene.id] || {};
}

export function getRequiredNpcIds(scene) {
  const meta = metaFor(scene);
  return unique(scene.requiredNpcIds || meta.requiredNpcIds || scene.npcs.map((npc) => npc.id));
}

export function getOptionalNpcIds(scene) {
  const meta = metaFor(scene);
  return unique(scene.optionalNpcIds || meta.optionalNpcIds || []);
}

export function getAllSceneNpcIds(scene) {
  return unique([...getRequiredNpcIds(scene), ...getOptionalNpcIds(scene)]);
}

function getSceneEventIds(scene) {
  const meta = metaFor(scene);
  return scene.eventIds || meta.eventIds || scene.events.map((event) => event.id);
}

function getSceneMainFragments(scene) {
  const meta = metaFor(scene);
  const npcFragments = getRequiredNpcIds(scene).map((id) => npcInteractions[id]?.reward.fragment);
  const eventFragments = scene.events.map((event) => eventInteractions[event.id]?.reward.fragment || event.fragment);
  return unique([...(scene.mainFragmentIds || meta.mainFragmentIds || []), ...npcFragments, ...eventFragments]);
}

function getSceneEasterEggIds(scene) {
  const meta = metaFor(scene);
  return scene.easterEggIds || meta.easterEggIds || easterEggs.filter((egg) => egg.sceneId === scene.id).map((egg) => egg.id);
}

export function getSceneProgress(scene, gameState) {
  const requiredNpcIds = getRequiredNpcIds(scene);
  const optionalNpcIds = getOptionalNpcIds(scene);
  const allNpcIds = getAllSceneNpcIds(scene);
  const eventIds = getSceneEventIds(scene);
  const fragmentIds = getSceneMainFragments(scene);
  const eggIds = getSceneEasterEggIds(scene);

  const npcCompleted = requiredNpcIds.filter((id) => gameState.completedInteractionIds.includes(id)).length;
  const optionalNpcCompleted = optionalNpcIds.filter((id) => gameState.completedInteractionIds.includes(id)).length;
  const allNpcCompleted = allNpcIds.filter((id) => gameState.completedInteractionIds.includes(id)).length;
  const eventsCompleted = eventIds.filter((id) => gameState.triggeredEvents.includes(id)).length;
  const fragmentsCollected = fragmentIds.filter((fragment) => gameState.collectedFragments.includes(fragment)).length;
  const easterEggsFound = eggIds.filter((id) => gameState.foundEasterEggIds.includes(id)).length;

  const mainDone = npcCompleted + eventsCompleted + fragmentsCollected;
  const mainTotal = requiredNpcIds.length + eventIds.length + fragmentIds.length;
  const optionalDone = optionalNpcCompleted;
  const optionalTotal = optionalNpcIds.length;
  const fullDone = mainDone + optionalDone + easterEggsFound;
  const fullTotal = mainTotal + optionalTotal + eggIds.length;

  return {
    sceneId: scene.id,
    visited: gameState.visitedLocations.includes(scene.id),
    npcCompleted,
    npcTotal: requiredNpcIds.length,
    optionalNpcCompleted,
    optionalNpcTotal: optionalNpcIds.length,
    allNpcCompleted,
    allNpcTotal: allNpcIds.length,
    eventsCompleted,
    eventsTotal: eventIds.length,
    fragmentsCollected,
    fragmentsTotal: fragmentIds.length,
    easterEggsFound,
    easterEggsTotal: eggIds.length,
    mainDone,
    mainTotal,
    optionalDone,
    optionalTotal,
    fullDone,
    fullTotal,
    mainProgressPercent: percent(mainDone, mainTotal),
    fullProgressPercent: percent(fullDone, fullTotal),
    mainComplete: mainDone >= mainTotal,
    fullComplete: fullDone >= fullTotal,
  };
}

export function getSceneMissingItems(scene, gameState) {
  const requiredNpcIds = getRequiredNpcIds(scene);
  const optionalNpcIds = getOptionalNpcIds(scene);
  const eventIds = getSceneEventIds(scene);
  const fragmentIds = getSceneMainFragments(scene);
  const eggIds = getSceneEasterEggIds(scene);

  return {
    npcIds: requiredNpcIds.filter((id) => !gameState.completedInteractionIds.includes(id)),
    optionalNpcIds: optionalNpcIds.filter((id) => !gameState.completedInteractionIds.includes(id)),
    eventIds: eventIds.filter((id) => !gameState.triggeredEvents.includes(id)),
    fragments: fragmentIds.filter((fragment) => !gameState.collectedFragments.includes(fragment)),
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
        ? `你已经可以生成夜游报告了。如果还想多走走，${withEggs.scene.name}还有彩蛋可以找。`
        : '你已经可以生成夜游报告了，也可以继续慢慢走。',
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
    text: `先去${target.scene.name}看看，那里还有 ${missingCount || 1} 个主流程小事没收好。`,
  };
}

export function getSceneNudge(scene, gameState) {
  const missing = getSceneMissingItems(scene, gameState);
  const progress = getSceneProgress(scene, gameState);

  if (missing.npcIds.length) return `这里还有 ${missing.npcIds.length} 位主线群友没聊完。`;
  if (missing.eventIds.length) return `这里还有 ${missing.eventIds.length} 段五月记忆没翻到。`;
  if (progress.mainComplete && missing.easterEggIds.length) return `主流程已完成，可退出地图。当前仍有 ${missing.easterEggIds.length} 个彩蛋未发现，可继续探索。`;
  if (progress.mainComplete) return '主流程已完成，可退出地图。这盏灯已经被你点亮。';
  return scene.completionHint || metaFor(scene).completionHint || '靠近亮着的人或物件，按互动键看看。';
}
