export const npcs = [
  { id: 'xiaomeng', name: '小梦', locationId: 'river', visual: 'poet', tags: ['梦幻', '文艺'], profession: '滕王阁诗词社社长', roleTitle: '江边散步搭子', fragment: '一张晚风便签', dialogue: '今天不一定要牵手，吹吹晚风也算认真过完一天。', repeatDialogue: '江风还在，慢慢走就好。' },
  { id: 'hongjie', name: '红姐', locationId: 'river', visual: 'camera', tags: ['抓拍', '细节控'], profession: '赣江边首席摄影师', roleTitle: '晚风记录员', fragment: '一张没有发朋友圈的照片', dialogue: '一个人走也有画面感，群友的镜头会记得你今晚来过。', repeatDialogue: '别急，今晚的光线挺温柔。' },
  { id: 'jie', name: '洁小姐', locationId: 'river', visual: 'travel', tags: ['旅游', '自由'], profession: '南昌旅行生活方式博主', roleTitle: '城市漫游搭子', fragment: '一张城市漫游车票', dialogue: '不出远门也算旅行，今晚从江边开始就很好。', repeatDialogue: '南昌的小路会把人带到亮灯的地方。' },
  { id: 'sansan', name: '三三', locationId: 'wanshougong', visual: 'chef', tags: ['火热', '管饱'], profession: '万寿宫顶流爆炒大厨', roleTitle: '干饭回血搭子', fragment: '一口热乎的夜宵', dialogue: '爱情可以慢慢来，夜宵要趁热吃。', repeatDialogue: '先吃，别让情绪空腹上班。' },
  { id: 'baimao', name: '白猫', locationId: 'bbq', visual: 'bbq', tags: ['厨艺', '烟火气'], profession: '万寿宫夜市烧烤之王', roleTitle: '夜宵加载搭子', fragment: '一串刚好的烤肉', dialogue: '烤串翻面的时候，烦恼也可以跟着翻个面。', repeatDialogue: '爱情未匹配，夜宵已加载。' },
  { id: 'bob', name: 'Bob', locationId: 'wanshougong', visual: 'mic', tags: ['幽默', '神秘'], profession: '南昌脱口秀俱乐部首席段子手', roleTitle: '段子救场搭子', fragment: '一个忍不住的哈哈哈', dialogue: '能自嘲的人很强，但也别忘了群友是真在陪你笑。', repeatDialogue: '不是笑你，是今晚确实有点好笑。' },
  { id: 'aq', name: '阿Q', locationId: 'ktv', visual: 'guitar', tags: ['才艺', '乐观'], profession: '八一广场街头弹唱艺人', roleTitle: '合唱发泄搭子', fragment: '一首跑调的歌', dialogue: '有些话说不出口，那就唱跑调一点。', repeatDialogue: '跑调也算把心里话递出去了。' },
  { id: 'vjie', name: 'V姐', locationId: 'ktv', visual: 'drink', tags: ['豪爽', '酒馆'], profession: '绳金塔酒吧街女王', roleTitle: '微醺气氛搭子', fragment: '一杯有气泡的饮料', dialogue: '今晚不拼酒，拼的是谁先把心事放轻一点。', repeatDialogue: '别喝太急，到家说一声。' },
  { id: 'qingzhi', name: '青稚', locationId: 'ktv', visual: 'gamer', tags: ['宅系', '二次元'], profession: '红谷滩电竞馆女老板', roleTitle: '包厢回血搭子', fragment: '一局不急着赢的游戏', dialogue: '门可以少出，群消息可以照回。今晚有人在线。', repeatDialogue: '你只是暂时静音，不是离线。' },
  { id: 'taozhi', name: '桃汁', locationId: 'pool', visual: 'card', tags: ['逻辑', '烧脑'], profession: '红谷滩剧本桌店长', roleTitle: '再来一局搭子', fragment: '一局没说完的推理', dialogue: '今晚不问输赢，再来一局就算有人陪。', repeatDialogue: '你不是被剩下，是还没轮到你的回合。' },
  { id: 'laozhu', name: '老朱', locationId: 'pool', visual: 'dumbbell', tags: ['健身', '励志'], profession: '红谷滩健身房金牌私教', roleTitle: '轻运动搭子', fragment: '一局没打完的台球', dialogue: '不用上强度，走两步也算给今晚加了点火苗。', repeatDialogue: '先动起来，别让520拿你情绪一血。' },
  { id: 'chunxia', name: '春夏', locationId: 'camp', visual: 'badminton', tags: ['动感', '运动回血'], profession: '红谷滩体育馆羽球达人', roleTitle: '露营热身搭子', fragment: '一颗被捡回来的羽毛球', dialogue: '椅子多摆一把，总有人会坐下来。', repeatDialogue: '火还亮着，位置也还在。' },
  { id: 'gezi', name: '鸽子哥', locationId: 'camp', visual: 'shuttle', tags: ['运动', '放鸽子'], profession: '八一体育馆羽毛球教练', roleTitle: '准时到场搭子', fragment: '一个没说出口的邀约', dialogue: '今天不鸽。就算只是坐会儿，也算到场。', repeatDialogue: '今晚我真没鸽。' },
  { id: 'store-message', name: '群聊', locationId: 'store', visual: 'phone', tags: ['补给', '群聊'], profession: '深夜便利店置顶消息', roleTitle: '城市小灯', fragment: '一条群聊消息', dialogue: '便利店的灯亮着，群聊也还没睡。', repeatDialogue: '买瓶水吧，夜路慢慢走。' },
];

export const owenNpc = {
  id: 'owen',
  name: '欧文',
  locationId: 'owen-stall',
  visual: 'owen',
  tags: ['隐藏', '小摊'],
  profession: '今晚也营业的小摊摊主',
  roleTitle: '隐藏彩蛋 NPC',
};

export function getJudgementByMemoryCount(count) {
  if (count >= 5) return '你今晚不是一个人走完的。你拍过照、唱过歌、等过烤串，也被很多小事接住了。';
  if (count >= 3) return '今晚没有多盛大，但你和几个人认真地共享了一小段时间。';
  if (count >= 1) return '你只是走了一小会儿，但已经有人向你递来一点光。';
  return '你还没有和大家多聊，但南昌今晚的灯还亮着。';
}

export const judgementLines = [
  '你没有落单，南昌的灯和群聊都还在线。',
  '今晚没有约会，但你走过的每一步都有人回应。',
  '爱情未匹配，夜宵、江风和朋友已加载。',
  '一个人的520，也可以被很多小事接住。',
  '你只是暂时单排，队友一直在线。',
  '520只是日期，群聊才是安全屋。',
  '今晚适合慢慢走，也适合被这个城市轻轻接住。',
];

export const defaultReminder = '南昌精英搭子群一直在线。';
