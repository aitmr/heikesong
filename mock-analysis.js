(function () {
  const demoVideoSrc = "assets/imports/9be79787426ad958c6783310e86cd6ae-1778399410111.mp4";

  const segments = [
    {
      id: "seg-1",
      start: 0,
      end: 28,
      title: "矩阵概念与二维数组",
      type: "intro",
      shotType: "closeup",
      color: "#e2e8f0",
      intensity: 0.88,
      summary: "从矩阵的基本写法切入，把矩阵理解为按行列排列的数表。",
      keywords: ["矩阵", "行列", "二维数组"]
    },
    {
      id: "seg-2",
      start: 28,
      end: 63,
      title: "矩阵转置规则",
      type: "process",
      shotType: "closeup",
      color: "#fca5a5",
      intensity: 0.72,
      summary: "通过 A 的转置示例说明行列互换，以及转置后矩阵维度如何变化。",
      keywords: ["转置", "行列互换", "维度"]
    },
    {
      id: "seg-3",
      start: 63,
      end: 105,
      title: "线性运算与矩阵加法",
      type: "key_point",
      shotType: "closeup",
      color: "#93c5fd",
      intensity: 0.85,
      summary: "讲解矩阵加法、数乘等线性运算，强调同型矩阵才能相加。",
      keywords: ["线性运算", "加法", "同型矩阵"]
    },
    {
      id: "seg-4",
      start: 105,
      end: 157,
      title: "矩阵乘法定义",
      type: "process",
      shotType: "closeup",
      color: "#86efac",
      intensity: 0.82,
      summary: "用行乘列再求和的方式解释 AB 的元素计算，建立矩阵乘法的核心公式。",
      keywords: ["矩阵乘法", "行乘列", "求和"]
    },
    {
      id: "seg-5",
      start: 157,
      end: 205,
      title: "乘法性质与注意点",
      type: "conflict",
      shotType: "closeup",
      color: "#fde68a",
      intensity: 0.7,
      summary: "对比 AB 与 BA，提示矩阵乘法通常不满足交换律，并补充结合律等性质。",
      keywords: ["交换律", "结合律", "性质"]
    },
    {
      id: "seg-6",
      start: 205,
      end: 235,
      title: "公式收束与复习路径",
      type: "outro",
      shotType: "closeup",
      color: "#d8b4fe",
      intensity: 0.62,
      summary: "回到乘法公式和性质整理，把本节内容收束成可复习的知识链。",
      keywords: ["复习", "公式", "知识链"]
    }
  ];

  window.MOCK_ANALYSIS = {
    bricknote: {
      sourceType: "demo",
      sourceLabel: "本地课程视频",
      videoTitle: "矩阵基础与矩阵乘法教学拆解",
      videoSrc: demoVideoSrc,
      duration: 235,
      noteTitle: "矩阵知识点学习笔记",
      coreIdea:
        "这支视频围绕矩阵基础概念、转置、线性运算和矩阵乘法展开，适合拆成按知识依赖递进的学习积木。演示时可以通过时间戳回看公式，再在画布上拖拽形成“概念 -> 运算 -> 乘法 -> 性质”的复习路径。",
      actionItems: ["先理解行列与转置，再进入乘法公式", "把乘法定义和不满足交换律作为重点复习卡片"],
      segments
    },
    local: {
      sourceType: "local_upload",
      sourceLabel: "本地上传",
      videoTitle: "本地视频积木笔记",
      videoSrc: "",
      duration: 180,
      noteTitle: "本地视频逻辑拆解",
      coreIdea: "把视频片段拆成可重排的内容积木，先整理理解路径，再生成一份可复用总结。",
      actionItems: ["先找出最适合作为开头的情绪钩子", "把场景、产品、转化和 CTA 调整成更顺的阅读顺序"],
      segments
    }
  };
})();
