export interface TipIllustration {
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  pattern?: 'dots' | 'stripes' | 'none';
}

export interface StepTip {
  id: string;
  titleI18nKey?: string;
  contentI18nKey?: string;
  title?: string;
  content?: string;
  image?: string;
  emoji?: string;
  illustration?: TipIllustration;
  importance: 'info' | 'important' | 'critical';
}

export interface CommonMistake {
  id: string;
  titleI18nKey?: string;
  mistakeI18nKey?: string;
  consequenceI18nKey?: string;
  solutionI18nKey?: string;
  title?: string;
  mistake?: string;
  consequence?: string;
  solution?: string;
  image?: string;
  emoji?: string;
  illustration?: TipIllustration;
}

export interface PrepGuide {
  titleI18nKey?: string;
  itemI18nKeys?: string[];
  title?: string;
  items?: string[];
}

export interface DishTutorial {
  dishId: string;
  stepTips: Record<number, StepTip[]>;
  commonMistakes: CommonMistake[];
  prepGuide?: PrepGuide;
  proTips?: StepTip[];
}

export const dishTutorials: DishTutorial[] = [
  {
    dishId: 'tomato-egg',
    prepGuide: {
      titleI18nKey: 'tutorial.tomato-egg.prep.title',
      itemI18nKeys: [
        'tutorial.tomato-egg.prep.items.0',
        'tutorial.tomato-egg.prep.items.1',
        'tutorial.tomato-egg.prep.items.2',
        'tutorial.tomato-egg.prep.items.3',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'te-wash-1',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.0.te-wash-1.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.0.te-wash-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20peeling%20in%20boiling%20water%20cooking%20tips&image_size=square',
          emoji: '🍅',
          importance: 'important',
          illustration: {
            emoji: '🍅',
            gradientFrom: '#FF6B6B',
            gradientTo: '#FF8E8E',
            pattern: 'dots',
          },
        },
        {
          id: 'te-wash-2',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.0.te-wash-2.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.0.te-wash-2.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beating%20eggs%20in%20bowl%20with%20vinegar%20cooking&image_size=square',
          emoji: '🥚',
          importance: 'info',
          illustration: {
            emoji: '🥚',
            gradientFrom: '#FFF5BA',
            gradientTo: '#FFE66D',
          },
        },
      ],
      1: [
        {
          id: 'te-cut-1',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.1.te-cut-1.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.1.te-cut-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cutting%20tomatoes%20on%20cutting%20board%20kitchen&image_size=square',
          emoji: '🔪',
          importance: 'info',
          illustration: {
            emoji: '🔪',
            gradientFrom: '#A8E6CF',
            gradientTo: '#88D8B0',
          },
        },
      ],
      2: [
        {
          id: 'te-season-1',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.2.te-season-1.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.2.te-season-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=seasoning%20eggs%20with%20salt%20and%20sugar%20cooking&image_size=square',
          emoji: '🧂',
          importance: 'critical',
          illustration: {
            emoji: '⚖️',
            gradientFrom: '#FFD93D',
            gradientTo: '#FFC107',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'te-bake-1',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-1.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scrambling%20eggs%20in%20wok%20chinese%20cooking&image_size=square',
          emoji: '🔥',
          importance: 'critical',
          illustration: {
            emoji: '🍳',
            gradientFrom: '#FF9A56',
            gradientTo: '#FF6B35',
            pattern: 'dots',
          },
        },
        {
          id: 'te-bake-2',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-2.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-2.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomatoes%20cooking%20in%20pan%20saucy%20red&image_size=square',
          emoji: '🍳',
          importance: 'important',
          illustration: {
            emoji: '🥫',
            gradientFrom: '#E63946',
            gradientTo: '#C1121F',
          },
        },
        {
          id: 'te-bake-3',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-3.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.3.te-bake-3.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=adding%20eggs%20to%20tomatoes%20in%20wok&image_size=square',
          emoji: '🔥',
          importance: 'important',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF7043',
            gradientTo: '#E64A19',
            pattern: 'dots',
          },
        },
      ],
      4: [
        {
          id: 'te-plate-1',
          titleI18nKey: 'tutorial.tomato-egg.stepTips.4.te-plate-1.title',
          contentI18nKey: 'tutorial.tomato-egg.stepTips.4.te-plate-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20egg%20dish%20garnished%20with%20scallions&image_size=square',
          emoji: '✨',
          importance: 'info',
          illustration: {
            emoji: '🍽️',
            gradientFrom: '#6BCB77',
            gradientTo: '#4CAF50',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'tm-mistake-1',
        titleI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-1.title',
        mistakeI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-1.mistake',
        consequenceI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-1.consequence',
        solutionI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-1.solution',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=overcooked%20rubbery%20eggs%20in%20pan&image_size=square',
        emoji: '🥚',
        illustration: {
          emoji: '😵',
          gradientFrom: '#E63946',
          gradientTo: '#C1121F',
          pattern: 'dots',
        },
      },
      {
        id: 'tm-mistake-2',
        titleI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-2.title',
        mistakeI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-2.mistake',
        consequenceI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-2.consequence',
        solutionI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-2.solution',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=watery%20tomatoes%20not%20saucy%20cooking&image_size=square',
        emoji: '🍅',
        illustration: {
          emoji: '💧',
          gradientFrom: '#42A5F5',
          gradientTo: '#1E88E5',
        },
      },
      {
        id: 'tm-mistake-3',
        titleI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-3.title',
        mistakeI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-3.mistake',
        consequenceI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-3.consequence',
        solutionI18nKey: 'tutorial.tomato-egg.mistakes.te-mistake-3.solution',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tasting%20food%20with%20sour%20face%20expression&image_size=square',
        emoji: '🧂',
        illustration: {
          emoji: '😝',
          gradientFrom: '#FFD54F',
          gradientTo: '#FFB300',
          pattern: 'stripes',
        },
      },
    ],
    proTips: [
      {
        id: 'te-pro-1',
        titleI18nKey: 'tutorial.tomato-egg.proTips.te-pro-1.title',
        contentI18nKey: 'tutorial.tomato-egg.proTips.te-pro-1.content',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=adding%20ketchup%20to%20tomatoes%20cooking%20tip&image_size=square',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '💫',
          gradientFrom: '#FFD54F',
          gradientTo: '#FFB300',
          pattern: 'dots',
        },
      },
    ],
  },
  {
    dishId: 'miso-salmon',
    prepGuide: {
      titleI18nKey: 'tutorial.miso-salmon.prep.title',
      itemI18nKeys: [
        'tutorial.miso-salmon.prep.items.0',
        'tutorial.miso-salmon.prep.items.1',
        'tutorial.miso-salmon.prep.items.2',
        'tutorial.miso-salmon.prep.items.3',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'ms-wash-1',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.0.ms-wash-1.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.0.ms-wash-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=patting%20salmon%20dry%20with%20paper%20towel&image_size=square',
          emoji: '🐟',
          importance: 'critical',
          illustration: {
            emoji: '🐟',
            gradientFrom: '#FF8A65',
            gradientTo: '#FF5722',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'ms-cut-1',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.1.ms-cut-1.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.1.ms-cut-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=salmon%20fillet%20with%20crispy%20skin%20on%20plate&image_size=square',
          emoji: '🔪',
          importance: 'info',
          illustration: {
            emoji: '✨',
            gradientFrom: '#81C784',
            gradientTo: '#4CAF50',
          },
        },
      ],
      2: [
        {
          id: 'ms-season-1',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.2.ms-season-1.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.2.ms-season-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mixing%20miso%20paste%20with%20sake%20and%20honey&image_size=square',
          emoji: '🥣',
          importance: 'important',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#BA68C8',
            gradientTo: '#9C27B0',
            pattern: 'stripes',
          },
        },
        {
          id: 'ms-season-2',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.2.ms-season-2.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.2.ms-season-2.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marinating%20salmon%20with%20miso%20glaze&image_size=square',
          emoji: '⏱️',
          importance: 'info',
          illustration: {
            emoji: '⏱️',
            gradientFrom: '#64B5F6',
            gradientTo: '#1976D2',
          },
        },
      ],
      3: [
        {
          id: 'ms-bake-1',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.3.ms-bake-1.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.3.ms-bake-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=searing%20salmon%20skin%20side%20down%20in%20pan&image_size=square',
          emoji: '🔥',
          importance: 'important',
          illustration: {
            emoji: '🍳',
            gradientFrom: '#FF8A65',
            gradientTo: '#F4511E',
            pattern: 'dots',
          },
        },
        {
          id: 'ms-bake-2',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.3.ms-bake-2.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.3.ms-bake-2.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=perfectly%20cooked%20salmon%20pink%20center&image_size=square',
          emoji: '♨️',
          importance: 'critical',
          illustration: {
            emoji: '👌',
            gradientFrom: '#FFD54F',
            gradientTo: '#FF9800',
            pattern: 'stripes',
          },
        },
      ],
      4: [
        {
          id: 'ms-plate-1',
          titleI18nKey: 'tutorial.miso-salmon.stepTips.4.ms-plate-1.title',
          contentI18nKey: 'tutorial.miso-salmon.stepTips.4.ms-plate-1.content',
          image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautifully%20plated%20miso%20salmon%20with%20rice%20and%20salad&image_size=square',
          emoji: '🍽️',
          importance: 'info',
          illustration: {
            emoji: '🌟',
            gradientFrom: '#81D4FA',
            gradientTo: '#29B6F6',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'ms-mistake-1',
        titleI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-1.title',
        mistakeI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-1.mistake',
        consequenceI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-1.consequence',
        solutionI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-1.solution',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=salmon%20skin%20stuck%20to%20pan%20broken&image_size=square',
        emoji: '🫠',
        illustration: {
          emoji: '💔',
          gradientFrom: '#E57373',
          gradientTo: '#E53935',
          pattern: 'dots',
        },
      },
      {
        id: 'ms-mistake-2',
        titleI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-2.title',
        mistakeI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-2.mistake',
        consequenceI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-2.consequence',
        solutionI18nKey: 'tutorial.miso-salmon.mistakes.ms-mistake-2.solution',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dry%20overcooked%20salmon%20on%20plate&image_size=square',
        emoji: '🥩',
        illustration: {
          emoji: '😫',
          gradientFrom: '#FFB74D',
          gradientTo: '#F57C00',
          pattern: 'stripes',
        },
      },
    ],
    proTips: [
      {
        id: 'ms-pro-1',
        titleI18nKey: 'tutorial.miso-salmon.proTips.ms-pro-1.title',
        contentI18nKey: 'tutorial.miso-salmon.proTips.ms-pro-1.content',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cooking%20salmon%20in%20pan%20with%20lid%20no%20oven&image_size=square',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🍳',
          gradientFrom: '#FFF9C4',
          gradientTo: '#FFF59D',
          pattern: 'dots',
        },
      },
    ],
  },
  {
    dishId: 'veggie-pasta',
    prepGuide: {
      title: '备料清单',
      items: [
        '意大利面 100g（一人份）',
        '西兰花 1/3 颗，切小朵',
        '小番茄 8-10 颗，对半切',
        '蒜末 2 瓣，橄榄油 2 大勺',
        '盐、黑胡椒、帕玛森芝士碎 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'vp-wash-1',
          title: '西兰花洗法',
          content: '西兰花容易藏小虫子，切小朵后用淡盐水泡 10 分钟，虫子就会自己跑出来啦。',
          emoji: '🥦',
          importance: 'important',
          illustration: {
            emoji: '🥦',
            gradientFrom: '#A7C957',
            gradientTo: '#6BCB77',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'vp-cut-1',
          title: '蔬菜大小均匀',
          content: '西兰花和小番茄切的大小要差不多，这样炒的时候受热均匀，不会一个烂了一个还生。',
          emoji: '✂️',
          importance: 'info',
          illustration: {
            emoji: '✂️',
            gradientFrom: '#74B9FF',
            gradientTo: '#0984E3',
          },
        },
      ],
      2: [
        {
          id: 'vp-season-1',
          title: '煮面水要加盐',
          content: '煮面水要像海水一样咸！1 升水加 10g 盐，面条本身才有味道，不要依赖后面的调味。',
          emoji: '🧂',
          importance: 'critical',
          illustration: {
            emoji: '🧂',
            gradientFrom: '#DFE6E9',
            gradientTo: '#B2BEC3',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'vp-bake-1',
          title: '煮面时间减 1 分钟',
          content: '包装上写 10 分钟就煮 9 分钟，因为后面还要和蔬菜一起翻炒，留一点硬芯刚刚好（al dente）。',
          emoji: '⏱️',
          importance: 'critical',
          illustration: {
            emoji: '⏱️',
            gradientFrom: '#FDCB6E',
            gradientTo: '#F39C12',
          },
        },
        {
          id: 'vp-bake-2',
          title: '留一碗煮面水',
          content: '关火前盛出 1/2 碗煮面水，后面调酱汁用。面水里的淀粉是天然的乳化剂，能让酱汁浓稠挂面。',
          emoji: '💧',
          importance: 'important',
          illustration: {
            emoji: '💧',
            gradientFrom: '#81ECEC',
            gradientTo: '#00CEC9',
            pattern: 'dots',
          },
        },
        {
          id: 'vp-bake-3',
          title: '炒蔬菜顺序',
          content: '先爆香蒜末（小火，别糊），下西兰花炒 1 分钟，再下小番茄炒到出汁，最后加面条和煮面水翻匀。',
          emoji: '🔥',
          importance: 'info',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF7675',
            gradientTo: '#D63031',
          },
        },
      ],
      4: [
        {
          id: 'vp-plate-1',
          title: '芝士是灵魂',
          content: '装盘后趁热撒上帕玛森芝士碎和现磨黑胡椒，还可以点缀几片罗勒叶或小番茄，仪式感拉满。',
          emoji: '🧀',
          importance: 'important',
          illustration: {
            emoji: '🧀',
            gradientFrom: '#FFEAA7',
            gradientTo: '#FDCB6E',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'vp-mistake-1',
        title: '面条过凉水',
        mistake: '煮好的意面过凉水降温。',
        consequence: '表面淀粉被冲掉，酱汁挂不住，吃起来面条和酱汁是分家的。',
        solution: '煮好直接捞出来拌一点橄榄油防粘，或者直接下锅和蔬菜炒，千万别过凉水！',
        emoji: '🚫',
      },
      {
        id: 'vp-mistake-2',
        title: '蔬菜炒太久',
        mistake: '西兰花炒到发黄软烂。',
        consequence: '颜色难看，维生素流失，口感软塌塌的没有脆劲。',
        solution: '保持中大火快炒，颜色变深绿就关火，保持翠绿和脆嫩才是时蔬意面的精髓。',
        emoji: '🟢',
      },
    ],
    proTips: [
      {
        id: 'vp-pro-1',
        title: '让味道更上一层',
        content: '可以加一点干辣椒碎和柠檬汁，辣味和酸味让整道菜更有层次，不会腻。',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🌶️',
          gradientFrom: '#FF7675',
          gradientTo: '#D63031',
        },
      },
    ],
  },
  {
    dishId: 'teriyaki-chicken',
    prepGuide: {
      title: '备料清单',
      items: [
        '去骨鸡腿肉 2 只（约 400g）',
        '酱油 3 大勺，味醂 2 大勺',
        '清酒 1 大勺，白糖 1 小勺',
        '姜片 3 片，白芝麻、葱花 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'tc-wash-1',
          title: '鸡腿肉扎孔',
          content: '用叉子在鸡皮上扎密密麻麻的小孔，煎的时候油脂能逼出来，鸡皮更脆，也更容易入味。',
          emoji: '🍗',
          importance: 'important',
          illustration: {
            emoji: '🍗',
            gradientFrom: '#C97B3C',
            gradientTo: '#A0522D',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'tc-cut-1',
          title: '去筋断膜',
          content: '鸡腿肉内侧有白色的筋，用刀划断。不然煎的时候肉会卷起来，受热不均匀。',
          emoji: '🔪',
          importance: 'important',
          illustration: {
            emoji: '🔪',
            gradientFrom: '#FF9FF3',
            gradientTo: '#F368E0',
          },
        },
      ],
      2: [
        {
          id: 'tc-season-1',
          title: '照烧汁黄金比例',
          content: '酱油:味醂:清酒 = 3:2:1，加一小勺糖调匀。没有味醂就用米酒+少许白糖代替。',
          emoji: '🥣',
          importance: 'critical',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FDCB6E',
            gradientTo: '#E17055',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'tc-bake-1',
          title: '鸡皮朝下干煎',
          content: '冷锅冷油（油一点点就好），鸡皮朝下中小火煎 5-7 分钟，不要翻！煎到金黄出油再翻面。',
          emoji: '🔥',
          importance: 'critical',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF7675',
            gradientTo: '#D63031',
            pattern: 'dots',
          },
        },
        {
          id: 'tc-bake-2',
          title: '收汁要不停翻',
          content: '两面都煎好后倒照烧汁，转中小火，边煮边用勺子把汁浇在鸡肉上，直到酱汁浓稠挂壁。',
          emoji: '🍯',
          importance: 'important',
          illustration: {
            emoji: '🍯',
            gradientFrom: '#F39C12',
            gradientTo: '#D68910',
          },
        },
      ],
      4: [
        {
          id: 'tc-plate-1',
          title: '先切再浇汁',
          content: '鸡肉盛出来切成块，再把锅里剩下的照烧汁浇上去，撒白芝麻和葱花，配米饭绝配！',
          emoji: '🍚',
          importance: 'info',
          illustration: {
            emoji: '🍚',
            gradientFrom: '#F1C40F',
            gradientTo: '#F39C12',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'tc-mistake-1',
        title: '一开始就大火煎',
        mistake: '锅烧冒烟了才下鸡肉，火开到最大。',
        consequence: '鸡皮外面糊了里面还没熟，还会溅油到怀疑人生。',
        solution: '冷锅下油中小火慢煎，让油脂慢慢逼出来，这是脆皮的秘诀。急不得！',
        emoji: '🧨',
      },
      {
        id: 'tc-mistake-2',
        title: '照烧汁烧糊了',
        mistake: '倒了照烧汁就去玩手机，汁烧干了才想起。',
        consequence: '锅底一层黑焦，发苦的酱汁毁了一锅肉。',
        solution: '倒汁后转中小火守在锅边，不停翻动和浇汁，看到酱汁变浓稠能挂在勺子上就关火。',
        emoji: '💀',
      },
    ],
    proTips: [
      {
        id: 'tc-pro-1',
        title: '隔夜更入味',
        content: '如果第二天要带便当，晚上做好后连汁一起泡着冷藏，第二天加热后鸡肉吸满照烧汁，超好吃！',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '💼',
          gradientFrom: '#A29BFE',
          gradientTo: '#6C5CE7',
        },
      },
    ],
  },
  {
    dishId: 'mushroom-soup',
    prepGuide: {
      title: '备料清单',
      items: [
        '口蘑 200g，切片',
        '洋葱 1/4 个，切小丁',
        '蒜末 1 瓣，黄油 20g',
        '淡奶油 100ml，面粉 1 大勺',
        '黑胡椒、盐、百里香 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'mu-wash-1',
          title: '蘑菇别水洗',
          content: '蘑菇像海绵一样会吸水！用厨房纸或软毛刷把表面泥土擦掉就好，水洗会让蘑菇出水，香气淡一半。',
          emoji: '🍄',
          importance: 'critical',
          illustration: {
            emoji: '🍄',
            gradientFrom: '#D4A373',
            gradientTo: '#B8860B',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'mu-cut-1',
          title: '蘑菇切均匀',
          content: '蘑菇切成厚度 5mm 左右的片，大小一致煎的时候才会同时上色。留几片完整的最后做装饰。',
          emoji: '✂️',
          importance: 'info',
          illustration: {
            emoji: '✂️',
            gradientFrom: '#74B9FF',
            gradientTo: '#0984E3',
          },
        },
      ],
      2: [
        {
          id: 'mu-season-1',
          title: '面糊的作用',
          content: '黄油炒面粉是这道汤浓稠丝滑的秘诀（roux 面糊），小火炒到金黄色，不要有生粉味。',
          emoji: '🧈',
          importance: 'critical',
          illustration: {
            emoji: '🧈',
            gradientFrom: '#F9CA24',
            gradientTo: '#F39C12',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'mu-bake-1',
          title: '蘑菇要炒香',
          content: '黄油融化后下蘑菇，中大火炒到蘑菇出水、水分收干、变成金棕色，这一步是汤鲜美的关键。',
          emoji: '🍳',
          importance: 'critical',
          illustration: {
            emoji: '🍳',
            gradientFrom: '#FFBE76',
            gradientTo: '#F39C12',
            pattern: 'dots',
          },
        },
        {
          id: 'mu-bake-2',
          title: '分两次加液体',
          content: '炒好面糊后先加一半淡奶油搅拌均匀，再加清水或鸡汤，这样不会结块，口感更顺滑。',
          emoji: '🥛',
          importance: 'important',
          illustration: {
            emoji: '🥛',
            gradientFrom: '#DFE6E9',
            gradientTo: '#B2BEC3',
          },
        },
        {
          id: 'mu-bake-3',
          title: '想要更细腻',
          content: '煮好后可以用料理棒打一下，变成丝绒般的口感。保留一点蘑菇颗粒也很好，有层次感。',
          emoji: '🌀',
          importance: 'info',
          illustration: {
            emoji: '🌀',
            gradientFrom: '#A29BFE',
            gradientTo: '#6C5CE7',
          },
        },
      ],
      4: [
        {
          id: 'mu-plate-1',
          title: '点缀小技巧',
          content: '淋一圈淡奶油画花纹，撒几片煎得金黄的蘑菇片、黑胡椒碎和百里香叶，立刻像餐厅出品。',
          emoji: '🎨',
          importance: 'info',
          illustration: {
            emoji: '🍲',
            gradientFrom: '#E17055',
            gradientTo: '#D63031',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'mu-mistake-1',
        title: '蘑菇没炒干',
        mistake: '蘑菇下锅翻炒几下就加洋葱和液体。',
        consequence: '蘑菇的水分析出在汤里，味道寡淡，还有一股生蘑菇味。',
        solution: '耐心炒！等到蘑菇的汁水全部收干，蘑菇开始变成焦黄色，香气满屋的时候再进行下一步。',
        emoji: '💧',
      },
      {
        id: 'mu-mistake-2',
        title: '面糊结块',
        mistake: '加了面粉一下子把牛奶全倒进去。',
        consequence: '汤里都是面疙瘩，口感粗糙像浆糊。',
        solution: '面粉炒好后离火稍凉，分次少量加液体，边加边快速搅拌，保证每次完全融合再继续。',
        emoji: '🥶',
      },
    ],
    proTips: [
      {
        id: 'mu-pro-1',
        title: '混合蘑菇更香',
        content: '口蘑+香菇+杏鲍菇各一点，三种蘑菇混合炒，鲜味层次直接翻倍！',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '🍄',
          gradientFrom: '#00B894',
          gradientTo: '#00A085',
        },
      },
    ],
  },
  {
    dishId: 'avocado-toast',
    prepGuide: {
      title: '备料清单',
      items: [
        '吐司 2 片（建议厚切）',
        '熟透牛油果 1 个',
        '溏心蛋 1 个（可选）',
        '黑胡椒、海盐、橄榄油、柠檬汁 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'av-wash-1',
          title: '牛油果怎么挑',
          content: '外皮深绿带点黑，捏起来微软有弹性就是刚好。太硬不熟，太软过熟有黑丝。',
          emoji: '🥑',
          importance: 'important',
          illustration: {
            emoji: '🥑',
            gradientFrom: '#88B04B',
            gradientTo: '#556B2F',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'av-cut-1',
          title: '安全切牛油果',
          content: '沿果核对半切开，用刀轻敲核卡住后转动取出。果肉用勺子挖出，保持完整可以切片，想压泥就直接挖。',
          emoji: '🔪',
          importance: 'important',
          illustration: {
            emoji: '🔪',
            gradientFrom: '#74B9FF',
            gradientTo: '#0984E3',
          },
        },
      ],
      2: [
        {
          id: 'av-season-1',
          title: '防氧化变黑',
          content: '牛油果切开后滴几滴柠檬汁拌匀，维C 能防止氧化变黑，同时增加清新的酸味。',
          emoji: '🍋',
          importance: 'important',
          illustration: {
            emoji: '🍋',
            gradientFrom: '#FFF176',
            gradientTo: '#FFEB3B',
            pattern: 'stripes',
          },
        },
        {
          id: 'av-season-2',
          title: '压泥别太细',
          content: '牛油果压成带点颗粒的粗泥口感最好，不要完全打成泥糊糊，那样像婴儿辅食。',
          emoji: '🥣',
          importance: 'info',
          illustration: {
            emoji: '🥄',
            gradientFrom: '#81ECEC',
            gradientTo: '#00CEC9',
          },
        },
      ],
      3: [
        {
          id: 'av-bake-1',
          title: '吐司要烤脆',
          content: '吐司机烤到表面金黄酥脆，或平底锅小火烘 2 分钟。这是牛油果吐司的灵魂，软塌塌的面包直接失败。',
          emoji: '🍞',
          importance: 'critical',
          illustration: {
            emoji: '🍞',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFA726',
            pattern: 'dots',
          },
        },
        {
          id: 'av-bake-2',
          title: '溏心蛋秘诀',
          content: '水沸后加鸡蛋，中火煮 6 分钟，捞出立刻泡冰水。这样蛋白凝固、蛋黄刚好流心，切开会拉丝。',
          emoji: '🥚',
          importance: 'info',
          illustration: {
            emoji: '🥚',
            gradientFrom: '#FFF59D',
            gradientTo: '#FFEE58',
          },
        },
      ],
      4: [
        {
          id: 'av-plate-1',
          title: '组装顺序',
          content: '烤脆的吐司 → 厚厚的牛油果泥 → 溏心蛋（对半切开）→ 撒海盐、黑胡椒、淋橄榄油，完成！',
          emoji: '🎨',
          importance: 'important',
          illustration: {
            emoji: '🥑',
            gradientFrom: '#A5D6A7',
            gradientTo: '#66BB6A',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'av-mistake-1',
        title: '牛油果没熟',
        mistake: '买回来的牛油果还是硬邦邦的就直接用。',
        consequence: '口感像啃塑料，完全没有香浓的味道。',
        solution: '硬的牛油果和苹果、香蕉放在一个纸袋里密封 1-2 天，乙烯气体能加速它成熟。',
        emoji: '🪨',
      },
      {
        id: 'av-mistake-2',
        title: '吐司软塌塌',
        mistake: '不烤吐司，直接用常温的面包片。',
        consequence: '牛油果的水分把吐司浸湿，咬下去又软又湿，像受潮的饼干。',
        solution: '吐司一定要烤到酥脆！厚切吐司更好，能扛住牛油果的重量。',
        emoji: '🍞',
      },
    ],
    proTips: [
      {
        id: 'av-pro-1',
        title: '升级加料清单',
        content: '可以加烟熏三文鱼、小番茄片、辣椒碎、芝士粉、鹰嘴豆泥...随意组合，每天都不重样！',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🎉',
          gradientFrom: '#FDCB6E',
          gradientTo: '#E17055',
        },
      },
    ],
  },
  {
    dishId: 'spring-roll',
    prepGuide: {
      title: '备料清单',
      items: [
        '春卷皮 10 张（约 200g）',
        '豆芽 200g，去根洗净',
        '胡萝卜 1/2 根，擦丝',
        '干香菇 4 朵，泡发后切丝',
        '盐、生抽、香油、白胡椒粉 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'sr-wash-1',
          title: '豆芽去根更爽口',
          content: '豆芽掐掉根部，口感更嫩更干净。用淡盐水泡 5 分钟再冲洗，去除残留杂质。',
          emoji: '🌱',
          importance: 'info',
          illustration: {
            emoji: '🌱',
            gradientFrom: '#C5E063',
            gradientTo: '#9CCC65',
            pattern: 'dots',
          },
        },
        {
          id: 'sr-wash-2',
          title: '香菇泡发技巧',
          content: '干香菇用温水泡 20 分钟，加一勺糖能更快泡发。泡香菇的水别倒掉，滤干净后调馅超鲜。',
          emoji: '🍄',
          importance: 'important',
          illustration: {
            emoji: '🍄',
            gradientFrom: '#BCAAA4',
            gradientTo: '#8D6E63',
          },
        },
      ],
      1: [
        {
          id: 'sr-cut-1',
          title: '蔬菜要切细丝',
          content: '胡萝卜、香菇都切成粗细均匀的细丝，和豆芽粗细差不多，卷出来的春卷口感才协调。',
          emoji: '🥕',
          importance: 'info',
          illustration: {
            emoji: '🥕',
            gradientFrom: '#FF8A65',
            gradientTo: '#FF5722',
            pattern: 'stripes',
          },
        },
        {
          id: 'sr-cut-2',
          title: '蔬菜先焯水',
          content: '豆芽和胡萝卜丝沸水焯 30 秒捞出过凉水，挤干水分。生蔬菜直接包会出水，炸的时候容易破。',
          emoji: '💧',
          importance: 'critical',
          illustration: {
            emoji: '♨️',
            gradientFrom: '#81D4FA',
            gradientTo: '#29B6F6',
          },
        },
      ],
      2: [
        {
          id: 'sr-season-1',
          title: '馅料调味',
          content: '蔬菜挤干水分后加盐、生抽、白胡椒、香油拌匀。香油一定要放，是春卷香气的灵魂。',
          emoji: '🥣',
          importance: 'important',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFE082',
            gradientTo: '#FFC107',
            pattern: 'dots',
          },
        },
      ],
      3: [
        {
          id: 'sr-bake-1',
          title: '卷春卷手法',
          content: '春卷皮对角放，馅料放中间，先折起靠近你的一角，两边折进来，再往前卷，最后用面糊封口。',
          emoji: '🌯',
          importance: 'important',
          illustration: {
            emoji: '🌯',
            gradientFrom: '#FFCC80',
            gradientTo: '#FF8A65',
          },
        },
        {
          id: 'sr-bake-2',
          title: '油温要控制',
          content: '油温五成热（约 150°C）下春卷，中小火慢炸 4-5 分钟至金黄。火太大外皮糊了里面还没热。',
          emoji: '🔥',
          importance: 'critical',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF8A65',
            gradientTo: '#E64A19',
            pattern: 'dots',
          },
        },
        {
          id: 'sr-bake-3',
          title: '复炸更酥脆',
          content: '第一次炸到浅黄捞出，升高油温到七成热再复炸 30 秒，外皮会更酥脆，还能逼出多余油分。',
          emoji: '✨',
          importance: 'info',
          illustration: {
            emoji: '⚡',
            gradientFrom: '#FFD54F',
            gradientTo: '#FFC107',
          },
        },
      ],
      4: [
        {
          id: 'sr-plate-1',
          title: '搭配蘸料',
          content: '配醋碟（香醋+蒜末+少许糖）或甜辣酱，解腻又提味。摆盘时垫吸油纸，保持酥脆。',
          emoji: '🥢',
          importance: 'info',
          illustration: {
            emoji: '🍽️',
            gradientFrom: '#A5D6A7',
            gradientTo: '#66BB6A',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'sr-mistake-1',
        title: '馅料出水',
        mistake: '蔬菜不焯水不挤水，直接包进春卷。',
        consequence: '炸的时候内部水蒸气冲出来，春卷破皮漏油，还会溅油伤人。',
        solution: '蔬菜焯水后一定要挤干水分，越干越好！这是春卷酥脆不漏水的关键。',
        emoji: '💦',
      },
      {
        id: 'sr-mistake-2',
        title: '油温太高',
        mistake: '油锅烧冒烟了才下春卷。',
        consequence: '外皮瞬间发黑发苦，里面馅料还冰凉的。',
        solution: '五成油温下锅，中小火慢炸，让热量慢慢传到里面。想更脆就复炸一次。',
        emoji: '🌋',
      },
      {
        id: 'sr-mistake-3',
        title: '封口不牢',
        mistake: '春卷皮封口没粘紧，随便卷一下就下锅。',
        consequence: '炸到一半皮散开了，馅料全掉出来，变成一锅蔬菜油渣。',
        solution: '封口处用面粉糊或蛋液粘牢，卷的时候压紧实，别留空气在里面。',
        emoji: '📦',
      },
    ],
    proTips: [
      {
        id: 'sr-pro-1',
        title: '加粉丝更好吃',
        content: '泡软的粉丝切碎拌进馅里，能吸收蔬菜汁水，还增加口感层次，咬起来QQ的。',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '🍜',
          gradientFrom: '#FFE082',
          gradientTo: '#FFB300',
        },
      },
    ],
  },
  {
    dishId: 'strawberry-dessert',
    prepGuide: {
      title: '备料清单',
      items: [
        '草莓 200g，选新鲜饱满的',
        '牛奶 200ml，淡奶油 150ml',
        '吉利丁片 10g（约 2 片）',
        '细砂糖 30g，柠檬汁 几滴',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'sd-wash-1',
          title: '草莓正确洗法',
          content: '草莓先冲掉表面浮尘，用淡盐水泡 5 分钟，再用流动水冲净。不要去蒂洗，会进水影响口感。',
          emoji: '🍓',
          importance: 'important',
          illustration: {
            emoji: '🍓',
            gradientFrom: '#FF6F91',
            gradientTo: '#E91E63',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'sd-cut-1',
          title: '留几颗完整的',
          content: '选 4-5 颗形状好看的草莓留着最后装饰，其他的切成小丁。一部分打泥，一部分保留果肉颗粒。',
          emoji: '🔪',
          importance: 'info',
          illustration: {
            emoji: '🔪',
            gradientFrom: '#F48FB1',
            gradientTo: '#EC407A',
          },
        },
      ],
      2: [
        {
          id: 'sd-season-1',
          title: '吉利丁片泡法',
          content: '吉利丁片用冰水泡软，大概 5-10 分钟。泡软后挤干水分再用，水温不能太高，会提前融化失效。',
          emoji: '🧊',
          importance: 'critical',
          illustration: {
            emoji: '🧊',
            gradientFrom: '#B2EBF2',
            gradientTo: '#4DD0E1',
            pattern: 'stripes',
          },
        },
        {
          id: 'sd-season-2',
          title: '甜度调整',
          content: '糖量根据草莓甜度调整，草莓甜就少放糖，草莓酸就多放一点。加几滴柠檬汁提鲜解腻。',
          emoji: '🍬',
          importance: 'info',
          illustration: {
            emoji: '🍬',
            gradientFrom: '#FFF59D',
            gradientTo: '#FFF176',
          },
        },
      ],
      3: [
        {
          id: 'sd-bake-1',
          title: '加热别煮沸',
          content: '牛奶加糖小火加热到砂糖融化、锅边微微冒泡就关火，千万别煮沸，不然吉利丁会失效。',
          emoji: '🍼',
          importance: 'critical',
          illustration: {
            emoji: '🍼',
            gradientFrom: '#FFF9C4',
            gradientTo: '#FFF59D',
            pattern: 'dots',
          },
        },
        {
          id: 'sd-bake-2',
          title: '混合要均匀',
          content: '融化的吉利丁液先倒一点到温牛奶里搅匀，再倒回草莓泥中。温度要控制在 50°C 左右。',
          emoji: '🥣',
          importance: 'important',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#F8BBD0',
            gradientTo: '#F48FB1',
          },
        },
        {
          id: 'sd-bake-3',
          title: '冷藏别冷冻',
          content: '做好的奶冻放入冰箱冷藏室（2-8°C），3-4 小时就凝固了。千万别放冷冻，会结冰渣。',
          emoji: '❄️',
          importance: 'info',
          illustration: {
            emoji: '❄️',
            gradientFrom: '#B3E5FC',
            gradientTo: '#4FC3F7',
            pattern: 'stripes',
          },
        },
      ],
      4: [
        {
          id: 'sd-plate-1',
          title: '脱模小技巧',
          content: '吃之前用热毛巾敷一下模具外侧，或者用吹风机吹 10 秒，就能轻松脱模。摆上草莓和薄荷叶装饰。',
          emoji: '✨',
          importance: 'info',
          illustration: {
            emoji: '🍰',
            gradientFrom: '#F48FB1',
            gradientTo: '#EC407A',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'sd-mistake-1',
        title: '吉利丁失效',
        mistake: '吉利丁用热水泡，或者加入后煮沸了。',
        consequence: '奶冻半天不凝固，变成稀稀的草莓糖水。',
        solution: '冰水泡软，50°C 左右的温液中融化，温度太高会让吉利丁失去凝固力。',
        emoji: '💧',
      },
      {
        id: 'sd-mistake-2',
        title: '有颗粒结块',
        mistake: '吉利丁液一股脑倒进牛奶里。',
        consequence: '奶冻里有很多小颗粒，口感不丝滑。',
        solution: '先把少量温液和吉利丁混合均匀，再倒回大部队，边倒边快速搅拌。',
        emoji: '🌰',
      },
    ],
    proTips: [
      {
        id: 'sd-pro-1',
        title: '分层更好看',
          content: '先倒一半白色奶冻冷藏凝固，再倒粉色草莓层，做出渐变分层效果，颜值爆表。',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '🌈',
          gradientFrom: '#CE93D8',
          gradientTo: '#AB47BC',
        },
      },
    ],
  },
  {
    dishId: 'mung-bean-soup',
    prepGuide: {
      title: '备料清单',
      items: [
        '绿豆 150g，挑出坏豆子',
        '冰糖 50-80g，根据甜度调整',
        '清水 1.5-2L',
        '可加：莲子、百合、薏米',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'mb-wash-1',
          title: '提前泡发',
          content: '绿豆提前用清水泡 2 小时以上，泡过的绿豆更容易煮烂出沙。夏天放冰箱泡，防止发芽。',
          emoji: '🫘',
          importance: 'important',
          illustration: {
            emoji: '🫘',
            gradientFrom: '#9BC53D',
            gradientTo: '#7CB342',
            pattern: 'dots',
          },
        },
        {
          id: 'mb-wash-2',
          title: '挑去坏豆',
          content: '绿豆里常混有干瘪、发黑的坏豆子，要挑出来，不然煮出来有苦味，影响整锅汤。',
          emoji: '🔍',
          importance: 'info',
          illustration: {
            emoji: '🔍',
            gradientFrom: '#81D4FA',
            gradientTo: '#29B6F6',
          },
        },
      ],
      1: [
        {
          id: 'mb-cut-1',
          title: '冰冻出沙法',
          content: '泡好的绿豆沥干水，装袋子里放冰箱冷冻层冻一晚。冻过的绿豆煮 20 分钟就全开花出沙了！',
          emoji: '🧊',
          importance: 'important',
          illustration: {
            emoji: '🧊',
            gradientFrom: '#B2EBF2',
            gradientTo: '#4DD0E1',
            pattern: 'stripes',
          },
        },
      ],
      2: [
        {
          id: 'mb-season-1',
          title: '冰糖后放',
          content: '冰糖不要一开始就放，等绿豆煮开花后再放。早放糖的话，糖分会让绿豆皮不容易煮烂。',
          emoji: '🍬',
          importance: 'critical',
          illustration: {
            emoji: '🍬',
            gradientFrom: '#FFF176',
            gradientTo: '#FFEB3B',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'mb-bake-1',
          title: '加水要一次性加够',
          content: '一次性加足水，中途不要加冷水。如果实在要加，就加开水。不然温度骤降绿豆会发硬。',
          emoji: '💧',
          importance: 'important',
          illustration: {
            emoji: '💧',
            gradientFrom: '#81ECEC',
            gradientTo: '#00CEC9',
            pattern: 'dots',
          },
        },
        {
          id: 'mb-bake-2',
          title: '火候掌握',
          content: '大火煮沸后转小火慢炖 40-60 分钟。盖子留条缝，防止溢锅。中间搅动几次防止粘底。',
          emoji: '🔥',
          importance: 'info',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF8A65',
            gradientTo: '#FF5722',
          },
        },
      ],
      4: [
        {
          id: 'mb-plate-1',
          title: '冰镇更好喝',
          content: '煮好的绿豆汤放凉后入冰箱冷藏 2 小时，夏天喝一碗清热解暑。还可以加一勺桂花蜜增香。',
          emoji: '🥤',
          importance: 'info',
          illustration: {
            emoji: '🥤',
            gradientFrom: '#A5D6A7',
            gradientTo: '#66BB6A',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'mb-mistake-1',
        title: '绿豆汤变红',
        mistake: '用铁锅煮绿豆汤，或者煮的时间太长。',
        consequence: '碧绿的绿豆汤变成红褐色，看起来没食欲。',
        solution: '用砂锅或不锈钢锅煮，不要用铁锅。煮好后尽快离火，开盖煮颜色会更绿。',
        emoji: '🔴',
      },
      {
        id: 'mb-mistake-2',
        title: '绿豆不烂',
        mistake: '绿豆没泡直接煮，煮了半小时还是硬邦邦的。',
        consequence: '汤是汤，豆是豆，口感分离，没有绵密的沙感。',
        solution: '提前泡发或冷冻一晚，冻过的绿豆最容易煮烂。高压锅也可以，上汽后 15 分钟就好。',
        emoji: '🪨',
      },
    ],
    proTips: [
      {
        id: 'mb-pro-1',
        title: '加陈皮更香醇',
        content: '煮的时候加一小块陈皮，汤会更甘香醇厚，还能理气开胃。但别加多，一小块就够了。',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🍊',
          gradientFrom: '#FFB74D',
          gradientTo: '#FF9800',
        },
      },
    ],
  },
  {
    dishId: 'cold-noodles',
    prepGuide: {
      title: '备料清单',
      items: [
        '鲜面条 200g（或挂面 150g）',
        '黄瓜 1/2 根，擦丝',
        '花生碎 2 大勺，熟的',
        '蒜末、葱花、香菜 适量',
        '调味汁：生抽 2 勺、醋 3 勺、糖 1 勺、辣椒油 1 勺、香油几滴',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'cn-wash-1',
          title: '黄瓜要冰镇',
          content: '黄瓜提前放冰箱冷藏 1 小时，擦丝后冰爽脆嫩，是凉面好吃的关键之一。',
          emoji: '🥒',
          importance: 'info',
          illustration: {
            emoji: '🥒',
            gradientFrom: '#AED581',
            gradientTo: '#8BC34A',
            pattern: 'stripes',
          },
        },
      ],
      1: [
        {
          id: 'cn-cut-1',
          title: '配菜切法',
          content: '黄瓜擦细丝，香菜切段，蒜切末。配菜品种可以根据喜好加：胡萝卜丝、豆芽、鸡丝都很搭。',
          emoji: '🥒',
          importance: 'info',
          illustration: {
            emoji: '🥗',
            gradientFrom: '#81C784',
            gradientTo: '#4CAF50',
          },
        },
      ],
      2: [
        {
          id: 'cn-season-1',
          title: '料汁黄金比例',
          content: '生抽:醋:糖 = 2:3:1，是经典的酸辣口基础。辣椒油和香油根据吃辣程度增减。',
          emoji: '🥣',
          importance: 'critical',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFB74D',
            gradientTo: '#FF8A65',
            pattern: 'dots',
          },
        },
        {
          id: 'cn-season-2',
          title: '花生要现压',
          content: '熟花生用刀背压碎或装袋子里擀碎，现压的花生最香。不要用现成花生粉，香气差很多。',
          emoji: '🥜',
          importance: 'info',
          illustration: {
            emoji: '🥜',
            gradientFrom: '#BCAAA4',
            gradientTo: '#8D6E63',
          },
        },
      ],
      3: [
        {
          id: 'cn-bake-1',
          title: '煮面加凉水',
          content: '水沸后下面条，再沸时点一次凉水，反复两次，面条煮到八分熟就捞，过凉水后更筋道。',
          emoji: '🍜',
          importance: 'important',
          illustration: {
            emoji: '🍜',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFA726',
            pattern: 'dots',
          },
        },
        {
          id: 'cn-bake-2',
          title: '过冰水更 Q 弹',
          content: '煮好的面条立刻捞进冰水里激一下，面条会收缩变紧实，口感更筋道有嚼劲。',
          emoji: '🧊',
          importance: 'important',
          illustration: {
            emoji: '🧊',
            gradientFrom: '#81D4FA',
            gradientTo: '#29B6F6',
            pattern: 'stripes',
          },
        },
        {
          id: 'cn-bake-3',
          title: '沥干再拌',
          content: '过了凉水的面条要彻底沥干水分再拌调料，不然面汤会稀释酱汁，味道就淡了。',
          emoji: '💧',
          importance: 'critical',
          illustration: {
            emoji: '🕳️',
            gradientFrom: '#90CAF9',
            gradientTo: '#42A5F5',
          },
        },
      ],
      4: [
        {
          id: 'cn-plate-1',
          title: '上桌前再拌',
          content: '面条和酱汁分开装，吃之前再拌。提前拌好的话，面条会吸汁变软坨掉，影响口感。',
          emoji: '🥢',
          importance: 'info',
          illustration: {
            emoji: '🍽️',
            gradientFrom: '#F8BBD0',
            gradientTo: '#F48FB1',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'cn-mistake-1',
        title: '面条煮太软',
        mistake: '面条煮到全熟才捞出来。',
        consequence: '过凉水后面条还是软塌塌的，没有嚼劲，拌完容易坨。',
        solution: '煮到中间还有一点点白芯（八分熟）就捞，过凉水后余温会让它刚好熟透。',
        emoji: '🫠',
      },
      {
        id: 'cn-mistake-2',
        title: '醋放少了',
        mistake: '只放一点点醋，酸味不够。',
        consequence: '整碗面只有咸味和辣味，不清爽不开胃。',
        solution: '凉面的灵魂就是酸！醋要比你想象得多一点，吃起来酸香开胃才对。',
        emoji: '🍋',
      },
    ],
    proTips: [
      {
        id: 'cn-pro-1',
        title: '加麻酱更香',
        content: '加 1 勺调稀的芝麻酱，变成麻酱凉面，浓郁的花生酱香配酸辣，层次更丰富。',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '🌰',
          gradientFrom: '#D7CCC8',
          gradientTo: '#A1887F',
        },
      },
    ],
  },
  {
    dishId: 'mooncake',
    prepGuide: {
      title: '备料清单',
      items: [
        '月饼皮（中筋面粉 100g，糖浆 75g，花生油 25g，碱水 2g）',
        '莲蓉馅 200g，咸蛋黄 4 个',
        '蛋黄水（蛋黄 1 个 + 水 1 勺）刷表面用',
        '熟糯米粉（手粉）适量防粘',
      ],
    },
    stepTips: {
  0: [
        {
          id: 'mk-wash-1',
          title: '咸蛋黄处理',
          content: '咸蛋黄喷少许白酒去腥，烤箱 150°C 烤 5 分钟至出油。放凉后包进莲蓉馅里，搓圆。',
          emoji: '🥚',
          importance: 'important',
          illustration: {
            emoji: '🥚',
            gradientFrom: '#FFD54F',
            gradientTo: '#FFC107',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'mk-cut-1',
          title: '皮馅比例',
          content: '新手建议皮:馅 = 3:7，皮薄馅大更好吃，但难度高。熟练了可以试 2:8。总重 50g 模具用 15g 皮 + 35g 馅。',
          emoji: '⚖️',
          importance: 'important',
          illustration: {
            emoji: '⚖️',
            gradientFrom: '#A5D6A7',
            gradientTo: '#66BB6A',
            pattern: 'stripes',
          },
        },
      ],
      2: [
        {
          id: 'mk-season-1',
          title: '饼皮要醒',
          content: '糖浆、油、碱水混匀后加面粉，揉成面团，盖保鲜膜醒 2 小时。醒过的面团更柔软好包，不容易裂。',
          emoji: '🥖',
          importance: 'critical',
          illustration: {
            emoji: '🥖',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFB74D',
          },
        },
      ],
      3: [
        {
          id: 'mk-bake-1',
          title: '包月饼手法',
          content: '饼皮按扁，馅放中间，用虎口慢慢往上推饼皮，收口捏紧。全程用手粉防粘，别太用力压。',
          emoji: '🥮',
          importance: 'important',
          illustration: {
            emoji: '🥮',
            gradientFrom: '#FFB74D',
            gradientTo: '#FF9800',
            pattern: 'dots',
          },
        },
        {
          id: 'mk-bake-2',
          title: '压模要均匀',
          content: '月饼球滚一层薄粉，放入模具，按在烤盘上用力压一下，轻轻提起。花纹要清晰才好看。',
          emoji: '🔲',
          importance: 'info',
          illustration: {
            emoji: '🔲',
            gradientFrom: '#BCAAA4',
            gradientTo: '#8D6E63',
          },
        },
        {
          id: 'mk-bake-3',
          title: '两次烘烤+刷蛋液',
          content: '200°C 先烤 5 分钟定型，取出刷一层蛋黄水（只刷表面），再烤 8-10 分钟至金黄。',
          emoji: '🔥',
          importance: 'critical',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF8A65',
            gradientTo: '#F4511E',
            pattern: 'stripes',
          },
        },
      ],
      4: [
        {
          id: 'mk-plate-1',
          title: '回油更美味',
          content: '刚烤好的月饼皮是硬的，放密封盒里 2-3 天回油后，饼皮会变得油润柔软，颜色也更漂亮。',
          emoji: '⏳',
          importance: 'info',
          illustration: {
            emoji: '✨',
            gradientFrom: '#FFD54F',
            gradientTo: '#FFB300',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'mk-mistake-1',
        title: '月饼塌腰',
        mistake: '饼皮太薄、馅料太软、或者烤的温度太低。',
        consequence: '月饼烤着烤着就塌了，变成扁扁的一坨，花纹全没了。',
        solution: '馅料要炒干一点，皮别太薄，烤温用 200°C 高温快烤定型。',
        emoji: '🫠',
      },
      {
        id: 'mk-mistake-2',
        title: '月饼开裂',
        mistake: '饼皮太干、或者刷蛋液刷太厚了。',
        consequence: '月饼表面裂开一道道口子，像张着嘴，卖相难看。',
        solution: '面团别太硬，刷蛋液要薄而匀，用毛刷轻轻扫，蛋液里加一勺水稀释。',
        emoji: '💔',
      },
      {
        id: 'mk-mistake-3',
        title: '花纹不清晰',
        mistake: '手粉太多、或者压模没压到位。',
        consequence: '烤出来的月饼花纹模模糊糊的，看不清图案。',
        solution: '手粉薄薄一层就好，压模时用力均匀，烤前喷一层水防止干裂。',
        emoji: '🌫️',
      },
    ],
    proTips: [
      {
        id: 'mk-pro-1',
        title: '花纹清晰秘诀',
        content: '月饼压好模后，入炉前用喷壶在表面喷一层水雾，烤出来的花纹会特别清晰立体。',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '💫',
          gradientFrom: '#FFD54F',
          gradientTo: '#FFB300',
          pattern: 'dots',
        },
      },
    ],
  },
  {
    dishId: 'osmanthus-cake',
    prepGuide: {
      title: '备料清单',
      items: [
        '糯米粉 200g，粘米粉 50g',
        '糖桂花 2 大勺，蜂蜜 1 大勺',
        '温水 250ml，干桂花 适量',
        '玉米油 1 大勺，红枣几颗装饰用',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'oc-wash-1',
          title: '桂花别久泡',
          content: '干桂花用温水泡 5 分钟就好，泡太久香气会散掉。泡桂花的水可以直接用来和面，香气更浓。',
          emoji: '🌸',
          importance: 'info',
          illustration: {
            emoji: '🌸',
            gradientFrom: '#FFE082',
            gradientTo: '#FFD54F',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'oc-cut-1',
          title: '过筛更细腻',
          content: '糯米粉和粘米粉混合后过一次筛，去除结块的粉粒，蒸出来的糕口感更细腻顺滑。',
          emoji: '🥄',
          importance: 'important',
          illustration: {
            emoji: '🥄',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFB74D',
            pattern: 'stripes',
          },
        },
      ],
      2: [
        {
          id: 'oc-season-1',
          title: '米浆浓度',
          content: '粉和水调成浓稠的酸奶状就刚好，太稀蒸出来不成形，太稠口感扎实不Q弹。',
          emoji: '🥣',
          importance: 'critical',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFF59D',
            gradientTo: '#FFF176',
          },
        },
      ],
      3: [
        {
          id: 'oc-bake-1',
          title: '蒸糕火候',
          content: '水沸后放入模具，中火蒸 25-30 分钟。中途别开盖，不然会塌。用牙签插进去不粘粉就是熟了。',
          emoji: '♨️',
          importance: 'important',
          illustration: {
            emoji: '♨️',
            gradientFrom: '#90CAF9',
            gradientTo: '#42A5F5',
            pattern: 'dots',
          },
        },
        {
          id: 'oc-bake-2',
          title: '模具刷油',
          content: '蒸之前模具内壁刷一层薄油，方便脱模。也可以铺油纸，底部放一颗红枣装饰。',
          emoji: '🧴',
          importance: 'info',
          illustration: {
            emoji: '🧴',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFA726',
          },
        },
      ],
      4: [
        {
          id: 'oc-plate-1',
          title: '放凉再切',
          content: '蒸好的桂花糕放凉后再切块，热的时候切会粘刀。表面撒一层干桂花，香飘满屋。',
          emoji: '🍰',
          importance: 'info',
          illustration: {
            emoji: '🍰',
            gradientFrom: '#FFE082',
            gradientTo: '#FFCA28',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'oc-mistake-1',
        title: '蒸糕塌陷',
        mistake: '蒸的过程中开盖偷看，或者火太大了。',
        consequence: '糕体塌陷，变成扁扁的一坨，口感发黏不松软。',
        solution: '中火慢蒸，全程别开盖，时间到了关火焖 5 分钟再开。',
        emoji: '📉',
      },
      {
        id: 'oc-mistake-2',
        title: '口感太黏',
        mistake: '只用糯米粉放太多，或者蒸的时间不够。',
        consequence: '糕粘牙糊嘴，像吃糯米糍一样太黏。',
        solution: '加 1/4 的粘米粉（大米粉），增加清爽的口感，不会太黏。',
        emoji: '🍡',
      },
    ],
    proTips: [
      {
        id: 'oc-pro-1',
        title: '加枸杞红枣更养生',
        content: '面糊里加枸杞和红枣碎，不仅好看，还有养生的感觉，秋天吃最适合。',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🌿',
          gradientFrom: '#FFE082',
          gradientTo: '#FFB74D',
        },
      },
    ],
  },
  {
    dishId: 'hot-pot',
    prepGuide: {
      title: '备料清单',
      items: [
        '火锅底料 1 块（麻辣/清汤任选',
        '肥牛卷 200g，白菜 4-5 片',
        '嫩豆腐 1 盒，切小块',
        '蘑菇 100g，其他喜欢的菜',
        '蘸料：芝麻酱、生抽、香菜、蒜末',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'hp-wash-1',
          title: '蔬菜清洗顺序',
          content: '先洗干净的菜，最后洗肉类。叶菜类多泡 10 分钟，去除农药残留。蘑菇用流水冲洗就好，别泡太久。',
          emoji: '🥬',
          importance: 'info',
          illustration: {
            emoji: '🥬',
            gradientFrom: '#AED581',
            gradientTo: '#8BC34A',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'hp-cut-1',
          title: '食材切配',
          content: '土豆、萝卜切薄片易熟；豆腐切小块；肥牛卷提前拿出来稍微化冻，别全化软了。',
          emoji: '🥔',
          importance: 'info',
          illustration: {
            emoji: '🔪',
            gradientFrom: '#FF8A65',
            gradientTo: '#FF5722',
          },
        },
      ],
      2: [
        {
          id: 'hp-season-1',
          title: '底汤怎么调',
          content: '麻辣底料加葱段、姜片、几颗红枣和枸杞。清汤可以加一勺醪糟，汤更鲜香。',
          emoji: '🍲',
          importance: 'important',
          illustration: {
            emoji: '🍲',
            gradientFrom: '#EF5350',
            gradientTo: '#E53935',
            pattern: 'stripes',
          },
        },
        {
          id: 'hp-season-2',
          title: '蘸料灵魂搭配',
          content: '芝麻酱+腐乳+韭菜花+蒜末+香菜+少许糖+生抽，经典北方麻酱料。南方人加醋加小米辣，各有风味。',
          emoji: '🥣',
          importance: 'info',
          illustration: {
            emoji: '🥜',
            gradientFrom: '#D7CCC8',
            gradientTo: '#A1887F',
            pattern: 'dots',
          },
        },
      ],
      3: [
        {
          id: 'hp-bake-1',
          title: '涮菜顺序',
          content: '先荤后素，先肉后菜。肉类涮完汤更香浓，汤才不会全是菜味。肥牛油锅先煮难熟的菜，最后放叶菜。',
          emoji: '🔥',
          importance: 'important',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FF7043',
            gradientTo: '#E64A19',
            pattern: 'dots',
          },
        },
        {
          id: 'hp-bake-2',
          title: '火候掌握',
          content: '大火烧开转小火保持微沸状态就好，一直大沸肉会老，蔬菜煮过了。',
          emoji: '♨️',
          importance: 'info',
          illustration: {
            emoji: '♨️',
            gradientFrom: '#FFAB91',
            gradientTo: '#FF8A65',
          },
        },
      ],
      4: [
        {
          id: 'hp-plate-1',
          title: '吃完煮面条收尾',
          content: '最后下点面条或者粉丝，吸满汤汁超好吃。配一碗米饭，碳水化合物使人快乐。',
          emoji: '🍜',
          importance: 'info',
          illustration: {
            emoji: '🍜',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFA726',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'hp-mistake-1',
        title: '肉煮老了',
        mistake: '肉片扔进去就去玩手机，想起来的时候肉已经煮了。',
        consequence: '老得像橡皮筋，咬不动。',
        solution: '肥牛卷变色就可以捞了，大概 10-15 秒。边涮边，享受过程。',
        emoji: '🥩',
      },
      {
        id: 'hp-mistake-2',
        title: '汤太咸了',
        mistake: '底料全放，或者盐加多了。',
        consequence: '越煮越咸，最后根本喝不下。',
        solution: '底料先放一半，不够再加咸了加开水或番茄、豆腐都可以加开水，越煮越有味。',
        emoji: '🧂',
      },
      {
        id: 'hp-mistake-3',
        title: '食材乱放',
        mistake: '所有菜一股脑全倒进去。',
        consequence: '有的菜烂了有的还生，汤也浑汤。',
        solution: '按易熟后放的顺序：块根类先放，叶菜最后放。',
        emoji: '🥗',
      },
    ],
    proTips: [
      {
        id: 'hp-pro-1',
        title: '加牛奶更香浓',
        content: '麻辣火锅加半盒纯牛奶，汤底会变得浓稠香醇，和店里的味道一模一样！',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '🥛',
          gradientFrom: '#FFF9C4',
          gradientTo: '#FFF59D',
        },
      },
    ],
  },
  {
    dishId: 'tangyuan',
    prepGuide: {
      title: '备料清单',
      items: [
        '糯米粉 200g，温水 160ml',
        '黑芝麻馅 150g，猪油 30g',
        '糖粉 30g，生姜片 3 片',
        '可加：桂花、枸杞、枸杞点缀',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'ty-wash-1',
          title: '芝麻要选糯米粉',
          content: '糯米粉选水磨糯米粉口感更细腻。如果是干粉用的汤圆，口感更 Q 弹，也不容易裂。',
          emoji: '🫘',
          importance: 'important',
          illustration: {
            emoji: '🫘',
            gradientFrom: '#E0E0E0',
            gradientTo: '#BDBDBD',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'ty-cut-1',
          title: '馅分剂子',
          content: '面团分成每个 15g 左右的小剂子，大小均匀，煮的时候才会同时熟。',
          emoji: '⚖️',
          importance: 'info',
          illustration: {
            emoji: '⚖️',
            gradientFrom: '#FFE0B2',
            gradientTo: '#FFCC80',
            pattern: 'stripes',
          },
        },
      ],
      2: [
        {
          id: 'ty-season-1',
          title: '面团温度',
          content: '温水和面，软硬适中。温度大概 40°C 左右，摸起来温温的。面团太软，容易裂；太硬，包的时候。',
          emoji: '🥣',
          importance: 'critical',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFF9C4',
            gradientTo: '#FFF59D',
          },
        },
      ],
      3: [
        {
          id: 'ty-bake-1',
          title: '煮汤圆',
          content: '水沸后下汤圆，用勺背轻轻推动防粘。浮起来后加半碗凉水，反复两次，浮起再煮 2 分钟就熟了。',
          emoji: '♨️',
          importance: 'important',
          illustration: {
            emoji: '♨️',
            gradientFrom: '#90CAF9',
            gradientTo: '#42A5F5',
            pattern: 'dots',
          },
        },
        {
          id: 'ty-bake-2',
          title: '包汤圆手法',
          content: '汤圆放中间，用虎口慢慢收口捏合，收口处捏紧。别露馅。搓圆。手法，皮薄馅大才好吃。',
          emoji: '🍡',
          importance: 'info',
          illustration: {
            emoji: '🍡',
            gradientFrom: '#FFE0B2',
            gradientTo: '#FFCC80',
          },
        },
      ],
      4: [
        {
          id: 'ty-plate-1',
          title: '汤里加什么',
          content: '汤圆汤里加几片生姜片和少许糖，就是经典姜茶。可以加一勺糖桂花，更香。女生生理期喝一碗，暖到心里。',
          emoji: '🍵',
          importance: 'info',
          illustration: {
            emoji: '🍵',
            gradientFrom: '#FFE082',
            gradientTo: '#FFD54F',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'ty-mistake-1',
        title: '汤圆开裂',
        mistake: '面团太干、或者煮的时候火太大。',
        consequence: '煮着煮着就裂了，黑芝麻流出来，变成一锅黑芝麻汤。',
        solution: '面团要和得软硬适中，包的时候收口捏紧。温水下锅，中小火慢煮。',
        emoji: '💔',
      },
      {
        id: 'ty-mistake-2',
        title: '汤圆塌了',
        mistake: '煮太久了，以为不熟。',
        consequence: '中间的面团塌塌的，咬一口全是汤。',
        solution: '漂起来就是熟了，再煮两分钟。煮了，就软塌塌软。',
        emoji: '🫠',
      },
    ],
    proTips: [
      {
        id: 'ty-pro-1',
        title: '冷冻更省心',
        content: '做多了的汤圆，摆盘子里冻硬，装袋子冷冻保存。吃的时候直接拿出来煮，不用解冻，方便。',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '❄️',
          gradientFrom: '#B3E5FC',
          gradientTo: '#4FC3F7',
          pattern: 'stripes',
        },
      },
    ],
  },
  {
    dishId: 'laba-porridge',
    prepGuide: {
      title: '备料清单',
      items: [
        '大米 50g，糯米 30g',
        '红豆 30g，花生 20g',
        '红枣 5 颗，莲子 10 颗',
        '花生 20g，冰糖 适量',
        '可加：桂圆、枸杞、各类豆子',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'lp-wash-1',
          title: '豆类提前泡',
          content: '红豆、花生、莲子这些难煮的豆子，提前泡 4 小时以上。泡过夜更好煮，节省时间，更容易煮烂。',
          emoji: '🫘',
          importance: 'important',
          illustration: {
            emoji: '🫘',
            gradientFrom: '#BCAAA4',
            gradientTo: '#8D6E63',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'lp-cut-1',
          title: '红枣去核',
          content: '红枣去核切小块，枣核燥，容易上火。莲子也去芯，不然会发苦。',
          emoji: '🍒',
          importance: 'info',
          illustration: {
            emoji: '🍒',
            gradientFrom: '#EF9A9A',
            gradientTo: '#E57373',
          },
        },
      ],
      2: [
        {
          id: 'lp-season-1',
          title: '比例搭配',
          content: '各种米和豆的比例大概 1:1，口感更丰富。大米增加，口感更绵密。',
          emoji: '🥣',
          importance: 'info',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFE0B2',
            gradientTo: '#FFCC80',
            pattern: 'stripes',
          },
        },
      ],
      3: [
        {
          id: 'lp-bake-1',
          title: '火候是关键',
          content: '大火煮开转最小火慢炖 1 个半小时到软烂。期间时不时搅动，防止粘底。想要更浓稠好喝。',
          emoji: '🔥',
          importance: 'critical',
          illustration: {
            emoji: '🔥',
            gradientFrom: '#FFAB91',
            gradientTo: '#FF8A65',
            pattern: 'dots',
          },
        },
        {
          id: 'lp-bake-2',
          title: '冰糖后放',
          content: '快熟了再放冰糖，早放的话容易糊底，而且豆子不容易烂。最后放了甜度刚刚好。',
          emoji: '🍬',
          importance: 'important',
          illustration: {
            emoji: '🍬',
            gradientFrom: '#FFF59D',
            gradientTo: '#FFF176',
          },
        },
        {
          id: 'lp-bake-3',
          title: '一次性加够水',
          content: '水要一次加足，中途别加凉水。水和米的比例大概 10:1，喜欢稀的稠的可以多加点水。',
          emoji: '💧',
          importance: 'info',
          illustration: {
            emoji: '💧',
            gradientFrom: '#81D4FA',
            gradientTo: '#29B6F6',
            pattern: 'stripes',
          },
        },
      ],
      4: [
        {
          id: 'lp-plate-1',
          title: '盛粥更出',
          content: '盛到碗里，撒几颗枸杞和桂花，又香又好看。配点小咸菜，咸甜搭配，喝着舒服。',
          emoji: '🥣',
          importance: 'info',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFA726',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'lp-mistake-1',
        title: '豆子不烂',
        mistake: '豆子没泡直接煮，煮了半小时还是硬的。',
        consequence: '粥是粥，豆是豆，口感分离。',
        solution: '提前泡发。想要更快煮，或者用高压锅，上汽后 20 分钟就软烂了。',
        emoji: '🪨',
      },
      {
        id: 'lp-mistake-2',
        title: '粥糊底了',
        mistake: '火太大，又没搅动，锅底糊了。',
        consequence: '整锅粥都有糊味，没法喝了。',
        solution: '最小火慢炖，中途搅一两次底，或者用电饭煲的话就不会糊底问题了。',
        emoji: '🔥',
      },
    ],
    proTips: [
      {
        id: 'lp-pro-1',
        title: '放更好喝',
        content: '煮好后焖一会儿再焖半小时再焖半小时，粥会变得更浓稠绵密，口感更好喝。这是粥店的小秘密哦。',
        emoji: '⭐',
        importance: 'important',
        illustration: {
          emoji: '💫',
          gradientFrom: '#FFE082',
          gradientTo: '#FFD54F',
        },
      },
    ],
  },
  {
    dishId: 'rice-cake',
    prepGuide: {
      title: '备料清单',
      items: [
        '糯米粉 200g，红糖 60g',
        '温水 150ml，红枣几颗',
        '食用油 1 大勺',
        '熟白芝麻 少许',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'rc-wash-1',
          title: '红枣泡软',
          content: '红枣温水泡软去核切小块。枣去核，吃的时候更出味。',
          emoji: '🍒',
          importance: 'info',
          illustration: {
            emoji: '🍒',
            gradientFrom: '#EF9A9A',
            gradientTo: '#E57373',
            pattern: 'dots',
          },
        },
      ],
      1: [
        {
          id: 'rc-cut-1',
          title: '红糖化开',
          content: '红糖用温水化开，搅匀。有红糖块不容易化，可以用勺子背压碎。',
          emoji: '🍬',
          importance: 'info',
          illustration: {
            emoji: '🍬',
            gradientFrom: '#BCAAA4',
            gradientTo: '#8D6E63',
            pattern: 'stripes',
          },
        },
      ],
      2: [
        {
          id: 'rc-season-1',
          title: '面糊稠度',
          content: '糯米粉倒入红糖，浓稠的酸奶状，提起滴落，纹路不会很快消失。太稀不成形，太硬口感扎实。',
          emoji: '🥣',
          importance: 'critical',
          illustration: {
            emoji: '🥣',
            gradientFrom: '#FFCC80',
            gradientTo: '#FFB74D',
          },
        },
      ],
      3: [
        {
          id: 'rc-bake-1',
          title: '蒸糕火候',
          content: '水沸后中火蒸 25-30 分钟。牙签插进去不粘粉就是熟了。焖 5 分钟再开盖，别焖回缩。',
          emoji: '♨️',
          importance: 'important',
          illustration: {
            emoji: '♨️',
            gradientFrom: '#90CAF9',
            gradientTo: '#42A5F5',
            pattern: 'dots',
          },
        },
        {
          id: 'rc-bake-2',
          title: '模具防粘',
          content: '模具内壁刷油，底部铺油纸。蒸好放凉再切块，热的时候切会粘刀。',
          emoji: '🧴',
          importance: 'info',
          illustration: {
            emoji: '🧴',
            gradientFrom: '#FFE0B2',
            gradientTo: '#FFCC80',
          },
        },
      ],
      4: [
        {
          id: 'rc-plate-1',
          title: '煎一下更香',
          content: '吃不完的年糕切片，平底锅小火煎到两面金黄，外脆里糯，蘸点白糖，好吃到停不下来。',
          emoji: '🍳',
          importance: 'info',
          illustration: {
            emoji: '🍳',
            gradientFrom: '#FFAB91',
            gradientTo: '#FF8A65',
            pattern: 'dots',
          },
        },
      ],
    },
    commonMistakes: [
      {
        id: 'rc-mistake-1',
        title: '年糕塌了',
        mistake: '蒸的时间不够，或者糯米粉太稀了。',
        consequence: '中间塌塌的，粘牙，不Q弹。',
        solution: '糯米粉选好的糯米粉，模具刷油防粘。中火蒸，时间别太短。',
        emoji: '🫠',
      },
      {
        id: 'rc-mistake-2',
        title: '太甜了',
        mistake: '红糖放太多，或者蒸太稠。',
        consequence: '腻得慌，甜到齁。',
        solution: '红糖别加多了，甜度自己调整。红糖本身甜度高，比白糖更甜，减量。',
        emoji: '🍬',
      },
    ],
    proTips: [
      {
        id: 'rc-pro-1',
        title: '加黄豆粉更香糯',
        content: '加 1/4 的粘米粉（大米粉），口感不会太糯叽叽的口感更清新，不会太黏。',
        emoji: '⭐',
        importance: 'info',
        illustration: {
          emoji: '🌾',
          gradientFrom: '#FFE082',
          gradientTo: '#FFD54F',
        },
      },
    ],
  },
];

const defaultTutorial: Omit<DishTutorial, 'dishId'> = {
  stepTips: {},
  commonMistakes: [],
};

export function getTutorialByDishId(dishId: string): DishTutorial {
  const found = dishTutorials.find((t) => t.dishId === dishId);
  return found ? found : { dishId, ...defaultTutorial };
}

export function getStepTips(dishId: string, stepIndex: number): StepTip[] {
  const tutorial = getTutorialByDishId(dishId);
  return tutorial.stepTips[stepIndex] ?? [];
}
