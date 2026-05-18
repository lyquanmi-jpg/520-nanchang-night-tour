export const SCENE_SIZE = {
  width: 390,
  height: 520,
};

export const scenes = [
  {
    id: 'river',
    name: '赣江边',
    subtitle: '晚风、栏杆和没发出去的朋友圈',
    cta: '去吹一阵晚风',
    mood: '江边吹风线',
    backgroundType: 'river',
    entryText: '你走到赣江边，风从水面吹过来。',
    npcs: [
      { id: 'xiaomeng', x: 92, y: 314 },
      { id: 'hongjie', x: 198, y: 286 },
      { id: 'jie', x: 300, y: 324 },
    ],
    events: [
      { id: '5.9 江边露营', x: 300, y: 170, fragment: '一阵江风', label: '江边露营记忆' },
      { id: '5.1 宁波舟山', x: 82, y: 178, fragment: '一张没有发出去的照片', label: '旅行记忆' },
    ],
  },
  {
    id: 'wanshougong',
    name: '万寿宫',
    subtitle: '灯笼、锅气和临时饭局',
    cta: '去吃一口热的',
    mood: '烟火夜宵线',
    backgroundType: 'wanshougong',
    entryText: '你走进万寿宫，热气从巷子里冒出来。',
    npcs: [
      { id: 'sansan', x: 94, y: 330 },
      { id: 'baimao', x: 204, y: 346 },
      { id: 'bob', x: 306, y: 322 },
    ],
    events: [
      { id: '5.2 万寿宫浪浪山', x: 292, y: 202, fragment: '一个临时饭局', label: '浪浪山记忆' },
      { id: '5.2 福旺财南京老鸭泡粉', x: 98, y: 214, fragment: '一碗热汤', label: '泡粉记忆' },
    ],
  },
  {
    id: 'ktv',
    name: 'KTV',
    subtitle: '霓虹、跑调和朋友的声音',
    cta: '去唱一首跑调的歌',
    mood: '唱歌发泄线',
    backgroundType: 'ktv',
    entryText: '你站在KTV门口，霓虹灯把夜色染得有点热闹。',
    npcs: [
      { id: 'aq', x: 94, y: 330 },
      { id: 'vjie', x: 210, y: 310 },
      { id: 'qingzhi', x: 304, y: 350 },
    ],
    events: [
      { id: '5.6 糖K', x: 92, y: 210, fragment: '一首跑调的歌', label: '糖K记忆' },
      { id: '5.17 糖K+阳阳生日', x: 292, y: 202, fragment: '一条群消息', label: '生日K歌记忆' },
    ],
  },
  {
    id: 'bbq',
    name: '烧烤摊',
    subtitle: '烤架、热气和等串的塑料凳',
    cta: '去等一串烤肉',
    mood: '夜宵回血线',
    backgroundType: 'bbq',
    entryText: '你在烧烤摊边停下，炭火把空气烤得热乎。',
    npcs: [
      { id: 'baimao', x: 132, y: 334 },
      { id: 'sansan', x: 264, y: 346 },
    ],
    events: [
      { id: '5.9 小马哥家烧烤', x: 196, y: 210, fragment: '一口夜宵摊的热气', label: '烧烤记忆' },
      { id: '5.6 干饭+酒馆', x: 304, y: 236, fragment: '一瓶常温快乐水', label: '干饭记忆' },
    ],
  },
  {
    id: 'pool',
    name: '台球厅',
    subtitle: '绿桌、球杆和再来一局',
    cta: '去再来一局',
    mood: '桌游社交线',
    backgroundType: 'pool',
    entryText: '你推开台球厅的门，吊灯照着一张空桌。',
    npcs: [
      { id: 'taozhi', x: 116, y: 340 },
      { id: 'laozhu', x: 278, y: 340 },
    ],
    events: [
      { id: '5.2 NC台球', x: 198, y: 220, fragment: '一局没打完的台球', label: 'NC台球记忆' },
      { id: '5.10 九龙湖桌游', x: 310, y: 234, fragment: '一张反转身份牌', label: '桌游记忆' },
    ],
  },
  {
    id: 'camp',
    name: '露营地',
    subtitle: '帐篷、火光和多摆的一把椅子',
    cta: '去坐一把空椅子',
    mood: '露营回血线',
    backgroundType: 'camp',
    entryText: '你走到露营地，篝火旁边还有空椅子。',
    npcs: [
      { id: 'chunxia', x: 120, y: 340 },
      { id: 'gezi', x: 282, y: 346 },
    ],
    events: [
      { id: '5.16 方家村露营', x: 92, y: 214, fragment: '一把空椅子', label: '方家村露营记忆' },
      { id: '5.1 萧峰鼎露营', x: 304, y: 214, fragment: '一个没说出口的邀约', label: '萧峰鼎露营记忆' },
    ],
  },
  {
    id: 'store',
    name: '便利店',
    subtitle: '冰柜、热饮和还没睡的群聊',
    cta: '去买一杯热饮',
    mood: '深夜补给线',
    backgroundType: 'store',
    entryText: '你走进便利店，玻璃门后面的灯一直亮着。',
    npcs: [
      { id: 'store-message', x: 190, y: 340 },
    ],
    events: [
      { id: '5.15 看电影', x: 94, y: 224, fragment: '一条“到家说一声”的消息', label: '城市记忆' },
      { id: '便利店补给', x: 294, y: 226, fragment: '一杯温热的饮料', label: '热饮柜' },
    ],
  },
  {
    id: 'owen_stall',
    name: 'Owen 的烧烤小摊',
    subtitle: '路过就坐一会儿，烤串还热着',
    cta: '去等一串刚好的烤肉',
    mood: '夜宵小摊线',
    backgroundType: 'stall',
    entryText: '你走到一盏暖黄色的小摊灯下面。烤架上有一点烟，旁边摆着几把小凳子。',
    npcs: [
      { id: 'owen_stall_owner', x: 178, y: 330 },
      { id: 'late_guest', x: 292, y: 350 },
    ],
    events: [
      { id: 'event_520_stall_night', x: 96, y: 330, fragment: '一把小凳子', label: '小摊边坐一会儿' },
      { id: 'event_stall_light', x: 288, y: 180, fragment: '一盏小摊灯', label: '小摊灯' },
    ],
  },
];

export const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene]));

export const sceneProgressMeta = {
  river: {
    requiredNpcIds: ['xiaomeng', 'hongjie'],
    optionalNpcIds: ['jie'],
    eventIds: ['5.9 江边露营', '5.1 宁波舟山'],
    mainFragmentIds: [],
    easterEggIds: ['river-bench', 'river-railing', 'xiaomeng-unsent', 'hongjie-photo'],
    completionHint: '江边的晚风、长椅和栏杆，都值得再靠近看看。',
  },
  wanshougong: {
    requiredNpcIds: ['sansan', 'baimao'],
    optionalNpcIds: ['bob'],
    eventIds: ['5.2 万寿宫浪浪山', '5.2 福旺财南京老鸭泡粉'],
    mainFragmentIds: [],
    easterEggIds: ['wsg-lantern', 'baimao-good-skewer'],
    completionHint: '万寿宫的灯笼和热气还亮着，慢慢靠近看看。',
  },
  ktv: {
    requiredNpcIds: ['aq', 'vjie'],
    optionalNpcIds: ['qingzhi'],
    eventIds: ['5.6 糖K', '5.17 糖K+阳阳生日'],
    mainFragmentIds: [],
    easterEggIds: ['ktv-poster'],
    completionHint: 'KTV门口还有声音，海报和灯箱都可以多看一眼。',
  },
  bbq: {
    requiredNpcIds: ['baimao'],
    optionalNpcIds: ['sansan'],
    eventIds: ['5.9 小马哥家烧烤', '5.6 干饭+酒馆'],
    mainFragmentIds: [],
    easterEggIds: ['baimao-good-skewer'],
    completionHint: '烤架旁还有热气，等一等也许刚好出炉。',
  },
  pool: {
    requiredNpcIds: ['taozhi', 'laozhu'],
    optionalNpcIds: [],
    eventIds: ['5.2 NC台球', '5.10 九龙湖桌游'],
    mainFragmentIds: [],
    easterEggIds: ['pool-last-ball'],
    completionHint: '台球厅的灯还照着桌面，最后一颗球可以再看一眼。',
  },
  camp: {
    requiredNpcIds: ['chunxia', 'gezi'],
    optionalNpcIds: [],
    eventIds: ['5.16 方家村露营', '5.1 萧峰鼎露营'],
    mainFragmentIds: [],
    easterEggIds: ['camp-empty-chair'],
    completionHint: '露营地的火还没灭，那把空椅子也还在。',
  },
  store: {
    requiredNpcIds: ['store-message'],
    optionalNpcIds: [],
    eventIds: ['5.15 看电影', '便利店补给'],
    mainFragmentIds: [],
    easterEggIds: ['store-receipt', 'group-99', 'store-small-lamp'],
    completionHint: '便利店的收银台、小票和角落小灯，都亮得很认真。',
  },
  owen_stall: {
    requiredNpcIds: ['owen_stall_owner'],
    optionalNpcIds: ['late_guest'],
    eventIds: ['event_520_stall_night', 'event_stall_light'],
    mainFragmentIds: ['一串刚好的烤肉', '一把小凳子', '一盏小摊灯'],
    easterEggIds: ['owen_hidden_birthday', 'stall_note', 'extra_chair'],
    completionHint: '小摊的灯、凳子和便签，都可以再靠近看看。',
  },
};
