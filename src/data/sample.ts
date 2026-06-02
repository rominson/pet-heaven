export interface Pet {
  id: string
  name: string
  species: string
  breed: string
  gender: string
  birthday: string
  passAwayDate: string
  bio: string
  personality: string[]
  memories: Memory[]
}

export interface Memory {
  id: string
  petId: string
  petName: string
  title: string
  content: string
  imageUrl?: string
  emotion: "happy" | "sad" | "nostalgic" | "calm"
  isPublic: boolean
  createdAt: string
}

const emotionMap: Record<string, string> = {
  happy: "开心",
  sad: "感伤",
  nostalgic: "怀念",
  calm: "平静",
}

export function emotionLabel(emotion: string): string {
  return emotionMap[emotion] ?? emotion
}

export const samplePet: Pet = {
  id: "1",
  name: "乐乐",
  species: "狗",
  breed: "金毛",
  gender: "男孩",
  birthday: "2015年3月20日",
  passAwayDate: "2024年8月15日",
  bio: "乐乐是我生命中最好的伙伴。他最喜欢在草地上奔跑，永远带着灿烂的笑容。每一天，他都在用他的方式告诉我：要开心。即使到了最后的日子，他依然用尾巴轻轻拍打地面，安慰我不要难过。",
  personality: ["温柔", "活泼", "贪吃", "粘人"],
  memories: [],
}

const now = new Date()
const y = now.getFullYear()

export const sampleMemories: Memory[] = [
  {
    id: "m1",
    petId: "1",
    petName: "乐乐",
    title: "最后一次散步",
    content:
      "那天傍晚的夕阳特别美，金色的阳光洒在公园的草地上。乐乐走得很慢，但还是坚持要完成我们每天的那条路线。他在最喜欢的那棵大树下停下来，回头看着我，尾巴轻轻地摇了摇。我知道他在说：\"别难过，我很好。\"",
    emotion: "nostalgic",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    isPublic: true,
    createdAt: `${y - 1}-09-01`,
  },
  {
    id: "m2",
    petId: "1",
    petName: "乐乐",
    title: "偷吃蛋糕的小贼",
    content:
      "生日那天放在桌上的蛋糕，一转身就被乐乐偷吃了半个。他满脸奶油地看着我，尾巴摇得像直升机，那个表情让我笑了一整天。乐乐，你偷走的蛋糕，换来了我永远的记忆。",
    emotion: "happy",
    imageUrl:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    isPublic: true,
    createdAt: `${y - 1}-07-15`,
  },
  {
    id: "m3",
    petId: "1",
    petName: "乐乐",
    title: "你教会我的事",
    content:
      "乐乐教会了我什么是无条件的爱。无论我开心还是难过，他总会把头靠在我膝盖上，用湿漉漉的眼睛看着我。他让我明白，爱不是占有，而是珍惜在一起的每一刻。",
    emotion: "calm",
    imageUrl:
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
    isPublic: false,
    createdAt: `${y - 1}-10-20`,
  },
  {
    id: "m4",
    petId: "1",
    petName: "乐乐",
    title: "想你了",
    content:
      "今天路过宠物店，看到一只小金毛趴在橱窗里，那个眼神和当年的你一模一样。我站在外面看了很久，眼泪止不住地流。乐乐，你在天堂要好好的。",
    emotion: "sad",
    imageUrl:
      "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80",
    isPublic: true,
    createdAt: `${y}-01-10`,
  },
  {
    id: "m5",
    petId: "1",
    petName: "乐乐",
    title: "你的小窝我还留着",
    content:
      "你的小窝我还放在原来的位置，阳光每天还是会照到那里。有时候我还会习惯性地往那边看一眼，好像你还在那里打盹。我知道你不在身边了，但那个角落永远属于你。",
    emotion: "nostalgic",
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    isPublic: true,
    createdAt: `${y}-03-05`,
  },
]

// ─── 生成更多回忆，凑够 50 条 ───

const petNames = ["乐乐", "咪咪", "旺财", "小乖", "豆豆", "毛球", "团团", "布丁", "Lucky", "大橘"]
const petPhotos = [
  "photo-1544568100-847a948585b9",
  "photo-1514888286974-6c03e2ca1dba",
  "photo-1552053831-71594a27632d",
  "photo-1574158622682-e40e69881006",
  "photo-1583511655857-d19b40a7a54e",
  "photo-1518717758536-85ae29035b6d",
  "photo-1533743983669-94fa5c4338ec",
  "photo-1601758228041-f3b2795255f1",
  "photo-1478098711619-5ab0b478d6e6",
  "photo-1568571780765-9276ac8b75a2",
]

const genTitles = [
  "春天的午后",
  "窗台上的阳光",
  "最爱的玩具",
  "雨天的依偎",
  "清晨的散步",
  "第一次见面",
  "你最爱的小毯子",
  "夏天的蝉鸣",
  "生日的惊喜",
  "陪我看书的日子",
  "雪地里的脚印",
  "你学会的新把戏",
  "永远的空碗",
  "晚安前的拥抱",
  "藏在沙发下的宝藏",
  "阳台上晒太阳",
  "最爱的零食",
  "一起看过的日落",
  "调皮的早晨",
  "安静的时刻",
  "门口的等待",
  "最爱的那棵树",
  "雨后的彩虹",
  "你的小呼噜",
  "温暖的午后",
  "我们一起旅行",
  "晨跑伙伴",
  "窗外的鸟",
  "冬夜的暖炉",
  "你的小秘密",
  "周末的懒觉",
  "落叶堆里的你",
  "第一次洗澡",
  "生病时的陪伴",
  "开心到打滚",
  "你的专属座位",
  "偷走我的枕头",
  "守候的忠诚",
  "小跟屁虫",
  "淘气的眼神",
  "我们的暗号",
  "温暖的小太阳",
  "你教会我的事",
  "最后的拥抱",
  "想你的每一天",
  "永远的家人",
]

const genContents = [
  "那天的阳光特别温柔，你趴在窗台上眯着眼睛，尾巴轻轻摇晃。那一刻感觉时光都慢了下来。",
  "你总是喜欢把头靠在我膝盖上，用那双湿漉漉的眼睛看着我，仿佛在说「我一直都在哦」。",
  "每次拿出那个玩具，你都会兴奋地转圈圈，像个小孩子一样。现在那个玩具还在角落里，等你回来玩。",
  "你最爱在雨天的午后蜷在我身边，暖暖的一团，听着雨声打盹。那种安静，是最幸福的时光。",
  "每天清晨你都会用湿湿的鼻子蹭我的手，催我起床去散步。现在我每天还是会按时醒来，只是再也没有你的催促了。",
  "第一次在宠物店看到你，那么多小动物里，你唯独对我摇了尾巴。那一刻我就知道，我们注定是一家人。",
  "无论我去哪个房间，你总是默默地跟在后面，然后在角落里找个舒服的位置躺下。你的陪伴从不打扰，却从未缺席。",
  "那个夏天的午后，你追着蝉鸣跑了一整个院子，最后累得趴在我脚边大口喘气。你的快乐总是那么简单纯粹。",
  "生日那天你比我还兴奋，围着我转了一圈又一圈。你大概不知道什么是生日，但你懂得什么是爱。",
  "我看书的时候，你总喜欢趴在旁边，偶尔抬头看看我，然后又安心地睡去。有你陪伴的阅读时光，是最美好的。",
  "你在雪地里打滚的样子，像个没见过世面的孩子。每一个脚印都是快乐的印记，深深浅浅地印在我心里。",
  "教你握手的那天，你学了好久才学会。成功后你骄傲地抬起爪子，那个得意的表情我永远忘不了。",
  "你的碗我一直没舍得收走，放在原来的位置。有时候路过还是会习惯性地看一眼，好像你还在那里埋头吃饭。",
  "每天睡前你都要来蹭蹭我的手，然后才肯乖乖回窝。那个小小的仪式感，是我们之间最温暖的约定。",
  "你总是把最喜欢的玩具藏到沙发底下，然后再装模作样地到处找。你演戏的样子，可爱极了。",
  "你最喜欢在阳台的阳光下打盹，阳光暖暖地照在你的毛发上。我在旁边看着你，就觉得整个世界都安静了。",
  "每次打开零食袋的声音一响，无论你在哪个角落，都会瞬间出现在我面前。你的听力大概都用在这上面了吧。",
  "那年我们一起在海边看日落，你安静地坐在我身边，夕阳把我们的影子拉得很长很长。最好的时光，就是你在的时光。",
  "清晨你把我吵醒的方式越来越丰富了，从舔脸到扒被子，甚至学会了用鼻子顶门。你的聪明总是用在不该用的地方。",
  "你安静睡着的样子，像个天使。呼吸均匀，偶尔会动动爪子，大概在梦里追蝴蝶吧。",
  "每次我回家开门，你总是在门口等着，尾巴摇得像螺旋桨。你的等待，是我每天最温暖的期待。",
  "公园里那棵大榕树下，是我们最常休息的地方。你总喜欢在那棵树下闻来闻去，大概那里有你的秘密基地吧。",
  "雨后你最喜欢在积水里踩来踩去，把水花溅得到处都是。那个欢快的样子，让我都不忍心责怪你。",
  "你的呼噜声轻轻的，像小猫的咕噜声。每次听到这个声音，我就知道你很安心，很幸福。",
  "午后的阳光透过窗帘洒在地板上，你躺在那一小块光斑里，像个晒太阳的小老头。画面温暖极了。",
  "那次带你去旅行，你在车上一直看着窗外，好奇地观察每一个路过的风景。你的世界里，一切都是新的。",
  "你是最好的晨跑伙伴，永远精力充沛，跑在我前面，时不时回头看看我有没有跟上。你是我坚持运动的全部动力。",
  "你总是对着窗外的鸟叫，好像在和它们聊天。不知道你们在说什么，但你看起来很开心。",
  "冬夜里你最喜欢窝在暖炉旁边，烤得肚子暖烘烘的。还会时不时翻个身，让另一边也暖和一下。",
  "你有一个小秘密：其实你怕黑。每次晚上去阳台，你都会紧紧跟着我，一步都不敢落下。",
  "周末的早晨，你总是比我还享受赖床。把头埋在被子里，只露出一个尾巴尖，怎么叫都不肯起来。",
  "秋天的落叶堆是你最好的游乐场，你在里面钻来钻去，快乐得像个小疯子。",
  "第一次给你洗澡的时候，你那个委屈的表情让我笑了好久。水花溅得到处都是，你也变成了落汤鸡。",
  "我生病的时候，你一直守在床边，不吃不喝。你用你的方式告诉我：别怕，有我陪着你。",
  "你开心的时候会在地上打滚，四脚朝天地扭来扭去。那种毫无保留的快乐，是世界上最治愈的画面。",
  "沙发上那个位置已经成了你的专属座位，别人一坐你就在旁边眼巴巴地看着。好吧，让给你了。",
  "每天早上醒来，我的枕头总是被你霸占了一半。你睡得四仰八叉，我却在床边缩成一团。",
  "无论我去洗手间还是厨房，你都在门口守着。你的忠诚不需要言语，每一个眼神都在说「我等你」。",
  "你去哪我都跟着，我走哪你都跟着。我们是彼此的小跟屁虫，也是彼此的全部。",
  "你想做坏事的时候，会用那种特别无辜的眼神看着我。我每次都上当，因为那个眼神实在太有欺骗性了。",
  "我们之间有一个暗号：我拍拍大腿，你就会欢快地跑过来。这个暗号，只有我们两个知道。",
  "你就像一个小太阳，无论我多不开心，看到你的笑脸，所有的阴霾都会散去。你的温暖，照亮了我的整个世界。",
  "你教会了我什么是无条件的爱。无论我开心还是难过，你都在那里，用最纯粹的方式爱着我。",
  "最后那个晚上，你轻轻舔了舔我的手，然后安静地闭上了眼睛。你用尽最后的力气告诉我：别难过，我很好。",
  "你离开已经很久了，但我还是会在某个瞬间突然想起你。想起你的温度，你的气味，你的一切。你从未真正离开。",
  "从你来到这个家的第一天起，你就是我们的家人。不是宠物，是家人。无论过去多久，这个事实永远不会改变。你永远是我最爱的家人。",
]

const genEmotions: ("happy" | "sad" | "nostalgic" | "calm")[] = [
  "calm", "calm", "happy", "calm", "happy",
  "nostalgic", "nostalgic", "happy", "happy", "calm",
  "happy", "happy", "nostalgic", "calm", "happy",
  "calm", "happy", "nostalgic", "happy", "calm",
  "happy", "nostalgic", "happy", "calm", "calm",
  "nostalgic", "happy", "happy", "calm", "happy",
  "calm", "happy", "happy", "calm", "happy",
  "happy", "happy", "calm", "happy", "happy",
  "happy", "calm", "calm", "sad", "nostalgic",
]

function generateExtraMemories(): Memory[] {
  return Array.from({ length: 146 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (i + 1) * 7)
    return {
      id: `gen-${i}`,
      petId: "1",
      petName: petNames[i % petNames.length],
      title: genTitles[i % genTitles.length],
      content: genContents[i % genContents.length],
      emotion: genEmotions[i % genEmotions.length],
      imageUrl: `https://images.unsplash.com/${petPhotos[i % petPhotos.length]}?auto=format&fit=crop&w=800&q=80`,
      isPublic: true,
      createdAt: date.toISOString().slice(0, 10),
    }
  })
}

const extraMemories = generateExtraMemories()

export const communityMemories = [
  ...sampleMemories.filter((m) => m.isPublic),
  ...extraMemories,
]
