export interface StepTip {
  id: string;
  title: string;
  content: string;
  image?: string;
  emoji?: string;
  importance: 'info' | 'important' | 'critical';
}

export interface CommonMistake {
  id: string;
  title: string;
  mistake: string;
  consequence: string;
  solution: string;
  emoji?: string;
}

export interface DishTutorial {
  dishId: string;
  stepTips: Record<number, StepTip[]>;
  commonMistakes: CommonMistake[];
  prepGuide?: {
    title: string;
    items: string[];
  };
  proTips?: StepTip[];
}

export const dishTutorials: DishTutorial[] = [
  {
    dishId: 'tomato-egg',
    prepGuide: {
      title: '备料清单',
      items: [
        '番茄 2 个（约 300g），顶部划十字刀',
        '鸡蛋 3 个，加少许盐打散',
        '葱花 适量，分葱白和葱绿',
        '盐 1/4 小勺，糖 1 小勺',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'te-wash-1',
          title: '番茄去皮小技巧',
          content: '番茄顶部划十字后，放入沸水中烫 30 秒，捞出过冷水，皮就能轻松撕下来。带皮炒会影响口感哦。',
          emoji: '🍅',
          importance: 'important',
        },
        {
          id: 'te-wash-2',
          title: '鸡蛋去腥',
          content: '打散鸡蛋时滴 2 滴白醋或料酒，可以有效去除蛋腥味，炒出来更嫩滑。',
          emoji: '🥚',
          importance: 'info',
        },
      ],
      1: [
        {
          id: 'te-cut-1',
          title: '番茄切法有讲究',
          content: '去皮番茄切成月牙块，大小约 3cm。不要切太碎，炒出沙后能保留一些颗粒感更好吃。',
          emoji: '🔪',
          importance: 'info',
        },
      ],
      2: [
        {
          id: 'te-season-1',
          title: '黄金调味比例',
          content: '盐和糖的比例建议 1:3，糖多一点能中和番茄的酸味，调出经典酸甜口味。可以边尝边调。',
          emoji: '🧂',
          importance: 'critical',
        },
      ],
      3: [
        {
          id: 'te-bake-1',
          title: '炒蛋火候是关键',
          content: '油温六成热（筷子插进去有小气泡）倒入蛋液，底部定型后快速划散，表面还有些湿润时盛出，这样鸡蛋最嫩。',
          emoji: '🔥',
          importance: 'critical',
        },
        {
          id: 'te-bake-2',
          title: '番茄要炒出沙',
          content: '炒番茄时用铲子背压一压，中火炒 2-3 分钟至出红油和汤汁，这道菜的灵魂就在这锅番茄酱汁里。',
          emoji: '🍳',
          importance: 'important',
        },
      ],
      4: [
        {
          id: 'te-plate-1',
          title: '装盘提亮',
          content: '最后撒上一把葱绿碎，既提香又增色，红白绿三色搭配，视觉和味觉双丰收。',
          emoji: '✨',
          importance: 'info',
        },
      ],
    },
    commonMistakes: [
      {
        id: 'tm-mistake-1',
        title: '鸡蛋炒老了',
        mistake: '鸡蛋下锅后一直翻炒到完全凝固才盛出。',
        consequence: '鸡蛋变得又干又柴，像橡皮一样难嚼。',
        solution: '蛋液底部定型、表面还有流动感时就划散盛出，后续还要回锅，余温会把它焖熟的。',
        emoji: '😫',
      },
      {
        id: 'tm-mistake-2',
        title: '番茄没出汁',
        mistake: '番茄切太大块，下锅翻炒几下就加鸡蛋。',
        consequence: '番茄汤汁不足，整道菜干巴巴的，没有拌饭的灵魂。',
        solution: '番茄切小块后耐心炒 2-3 分钟，边炒边按压出沙，看到红油出来就对了。',
        emoji: '💧',
      },
      {
        id: 'tm-mistake-3',
        title: '调味失衡',
        mistake: '只加盐不加糖，或糖加得太少。',
        consequence: '整道菜只有酸味，难以下咽，或者咸得发苦。',
        solution: '记住盐糖比 1:3 的黄金法则，出锅前尝一口，根据口味微调。',
        emoji: '⚖️',
      },
    ],
    proTips: [
      {
        id: 'tm-pro-1',
        title: '米饭杀手升级',
        content: '出锅前勾一层薄芡（淀粉+水），汤汁会浓稠地裹在每一块番茄和鸡蛋上，拌饭绝了。',
        emoji: '⭐',
        importance: 'important',
      },
    ],
  },
  {
    dishId: 'miso-salmon',
    prepGuide: {
      title: '备料清单',
      items: [
        '三文鱼 1 块（约 200g），去皮或带皮均可',
        '白味噌 2 大勺，清酒 1 大勺',
        '蜂蜜 1 小勺，姜末 少许',
        '黑胡椒、海盐 适量',
      ],
    },
    stepTips: {
      0: [
        {
          id: 'ms-wash-1',
          title: '三文鱼擦干是关键',
          content: '用厨房纸把三文鱼表面的水分彻底吸干，腌的时候才能入味，烤的时候也不会出水变腥。',
          emoji: '🐟',
          importance: 'critical',
        },
      ],
      1: [
        {
          id: 'ms-cut-1',
          title: '检查鱼刺',
          content: '用手摸一摸鱼肉表面，如果摸到硬硬的小刺，用镊子夹出来。超市切好的鱼排也可能有残留的哦。',
          emoji: '🔍',
          importance: 'important',
        },
      ],
      2: [
        {
          id: 'ms-season-1',
          title: '味噌酱调法',
          content: '味噌+清酒+蜂蜜混合均匀，不要有结块。清酒可以用米酒或白葡萄酒代替，蜂蜜可用白糖替代。',
          emoji: '🥣',
          importance: 'info',
        },
        {
          id: 'ms-season-2',
          title: '腌制时间',
          content: '味噌酱均匀抹在鱼肉上，腌 15-20 分钟就够了。味噌本身有咸味，腌太久会咸。',
          emoji: '⏰',
          importance: 'important',
        },
      ],
      3: [
        {
          id: 'ms-bake-1',
          title: '烤箱预热',
          content: '烤箱提前预热到 200°C，烤 12-15 分钟。看到表面微焦、鱼肉用叉子能轻松分开就是熟了。',
          emoji: '🔥',
          importance: 'important',
        },
        {
          id: 'ms-bake-2',
          title: '没有烤箱怎么办',
          content: '用平底锅也可以！小火慢煎，皮朝下煎 4 分钟，翻面再煎 2 分钟，刷上剩余味噌酱即可。',
          emoji: '🍳',
          importance: 'info',
        },
      ],
      4: [
        {
          id: 'ms-plate-1',
          title: '经典搭配',
          content: '配一碗白米饭、一碟腌黄瓜和味噌汤，就是标准的日式定食套餐啦，摆盘时淋上烤盘里的酱汁。',
          emoji: '🍱',
          importance: 'info',
        },
      ],
    },
    commonMistakes: [
      {
        id: 'ms-mistake-1',
        title: '三文鱼烤过头',
        mistake: '怕不熟，烤了 20 分钟以上。',
        consequence: '鱼肉变干发柴，像啃木屑，Omega-3 也流失了。',
        solution: '200°C 烤 12 分钟就够了，或者用温度计测中心温度到 50°C 就关火，余温会继续加热。',
        emoji: '🥵',
      },
      {
        id: 'ms-mistake-2',
        title: '没擦干就腌',
        mistake: '三文鱼洗干净直接抹酱，表面还带着水珠。',
        consequence: '水把味噌酱稀释了，入味不均匀，烤的时候还会出水，鱼皮不脆。',
        solution: '一定要用厨房纸反复按压，把表面水分吸干，这是外焦里嫩的第一步。',
        emoji: '💧',
      },
    ],
    proTips: [
      {
        id: 'ms-pro-1',
        title: '鱼皮脆到掉渣',
        content: '带皮烤的话，先在皮上划几刀（不要切到肉），用盐腌 10 分钟出水后擦干再烤，皮会脆脆的。',
        emoji: '⭐',
        importance: 'important',
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
        },
      ],
      1: [
        {
          id: 'vp-cut-1',
          title: '蔬菜大小均匀',
          content: '西兰花和小番茄切的大小要差不多，这样炒的时候受热均匀，不会一个烂了一个还生。',
          emoji: '✂️',
          importance: 'info',
        },
      ],
      2: [
        {
          id: 'vp-season-1',
          title: '煮面水要加盐',
          content: '煮面水要像海水一样咸！1 升水加 10g 盐，面条本身才有味道，不要依赖后面的调味。',
          emoji: '🧂',
          importance: 'critical',
        },
      ],
      3: [
        {
          id: 'vp-bake-1',
          title: '煮面时间减 1 分钟',
          content: '包装上写 10 分钟就煮 9 分钟，因为后面还要和蔬菜一起翻炒，留一点硬芯刚刚好（al dente）。',
          emoji: '⏱️',
          importance: 'critical',
        },
        {
          id: 'vp-bake-2',
          title: '留一碗煮面水',
          content: '关火前盛出 1/2 碗煮面水，后面调酱汁用。面水里的淀粉是天然的乳化剂，能让酱汁浓稠挂面。',
          emoji: '💧',
          importance: 'important',
        },
        {
          id: 'vp-bake-3',
          title: '炒蔬菜顺序',
          content: '先爆香蒜末（小火，别糊），下西兰花炒 1 分钟，再下小番茄炒到出汁，最后加面条和煮面水翻匀。',
          emoji: '🔥',
          importance: 'info',
        },
      ],
      4: [
        {
          id: 'vp-plate-1',
          title: '芝士是灵魂',
          content: '装盘后趁热撒上帕玛森芝士碎和现磨黑胡椒，还可以点缀几片罗勒叶或小番茄，仪式感拉满。',
          emoji: '🧀',
          importance: 'important',
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
        },
      ],
      1: [
        {
          id: 'tc-cut-1',
          title: '去筋断膜',
          content: '鸡腿肉内侧有白色的筋，用刀划断。不然煎的时候肉会卷起来，受热不均匀。',
          emoji: '🔪',
          importance: 'important',
        },
      ],
      2: [
        {
          id: 'tc-season-1',
          title: '照烧汁黄金比例',
          content: '酱油:味醂:清酒 = 3:2:1，加一小勺糖调匀。没有味醂就用米酒+少许白糖代替。',
          emoji: '🥣',
          importance: 'critical',
        },
      ],
      3: [
        {
          id: 'tc-bake-1',
          title: '鸡皮朝下干煎',
          content: '冷锅冷油（油一点点就好），鸡皮朝下中小火煎 5-7 分钟，不要翻！煎到金黄出油再翻面。',
          emoji: '🔥',
          importance: 'critical',
        },
        {
          id: 'tc-bake-2',
          title: '收汁要不停翻',
          content: '两面都煎好后倒照烧汁，转中小火，边煮边用勺子把汁浇在鸡肉上，直到酱汁浓稠挂壁。',
          emoji: '🍯',
          importance: 'important',
        },
      ],
      4: [
        {
          id: 'tc-plate-1',
          title: '先切再浇汁',
          content: '鸡肉盛出来切成块，再把锅里剩下的照烧汁浇上去，撒白芝麻和葱花，配米饭绝配！',
          emoji: '🍚',
          importance: 'info',
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
        },
      ],
      1: [
        {
          id: 'mu-cut-1',
          title: '蘑菇切均匀',
          content: '蘑菇切成厚度 5mm 左右的片，大小一致煎的时候才会同时上色。留几片完整的最后做装饰。',
          emoji: '✂️',
          importance: 'info',
        },
      ],
      2: [
        {
          id: 'mu-season-1',
          title: '面糊的作用',
          content: '黄油炒面粉是这道汤浓稠丝滑的秘诀（roux 面糊），小火炒到金黄色，不要有生粉味。',
          emoji: '🧈',
          importance: 'critical',
        },
      ],
      3: [
        {
          id: 'mu-bake-1',
          title: '蘑菇要炒香',
          content: '黄油融化后下蘑菇，中大火炒到蘑菇出水、水分收干、变成金棕色，这一步是汤鲜美的关键。',
          emoji: '🍳',
          importance: 'critical',
        },
        {
          id: 'mu-bake-2',
          title: '分两次加液体',
          content: '炒好面糊后先加一半淡奶油搅拌均匀，再加清水或鸡汤，这样不会结块，口感更顺滑。',
          emoji: '🥛',
          importance: 'important',
        },
        {
          id: 'mu-bake-3',
          title: '想要更细腻',
          content: '煮好后可以用料理棒打一下，变成丝绒般的口感。保留一点蘑菇颗粒也很好，有层次感。',
          emoji: '🌀',
          importance: 'info',
        },
      ],
      4: [
        {
          id: 'mu-plate-1',
          title: '点缀小技巧',
          content: '淋一圈淡奶油画花纹，撒几片煎得金黄的蘑菇片、黑胡椒碎和百里香叶，立刻像餐厅出品。',
          emoji: '🎨',
          importance: 'info',
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
        },
      ],
      1: [
        {
          id: 'av-cut-1',
          title: '安全切牛油果',
          content: '沿果核对半切开，用刀轻敲核卡住后转动取出。果肉用勺子挖出，保持完整可以切片，想压泥就直接挖。',
          emoji: '🔪',
          importance: 'important',
        },
      ],
      2: [
        {
          id: 'av-season-1',
          title: '防氧化变黑',
          content: '牛油果切开后滴几滴柠檬汁拌匀，维C 能防止氧化变黑，同时增加清新的酸味。',
          emoji: '🍋',
          importance: 'important',
        },
        {
          id: 'av-season-2',
          title: '压泥别太细',
          content: '牛油果压成带点颗粒的粗泥口感最好，不要完全打成泥糊糊，那样像婴儿辅食。',
          emoji: '🥣',
          importance: 'info',
        },
      ],
      3: [
        {
          id: 'av-bake-1',
          title: '吐司要烤脆',
          content: '吐司机烤到表面金黄酥脆，或平底锅小火烘 2 分钟。这是牛油果吐司的灵魂，软塌塌的面包直接失败。',
          emoji: '🍞',
          importance: 'critical',
        },
        {
          id: 'av-bake-2',
          title: '溏心蛋秘诀',
          content: '水沸后加鸡蛋，中火煮 6 分钟，捞出立刻泡冰水。这样蛋白凝固、蛋黄刚好流心，切开会拉丝。',
          emoji: '🥚',
          importance: 'info',
        },
      ],
      4: [
        {
          id: 'av-plate-1',
          title: '组装顺序',
          content: '烤脆的吐司 → 厚厚的牛油果泥 → 溏心蛋（对半切开）→ 撒海盐、黑胡椒、淋橄榄油，完成！',
          emoji: '🎨',
          importance: 'important',
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
