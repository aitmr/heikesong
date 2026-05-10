(function () {
  const demoVideoSrc = "assets/demo-video.mp4";

  const segments = [
    {
      id: "seg-1",
      start: 0,
      end: 15,
      title: "开场黄金 3 秒钩子",
      type: "intro",
      color: "#e2e8f0",
      intensity: 0.9,
      summary: "利用视觉反差快速吸引注意力，提出本期核心利益点。",
      keywords: ["钩子", "反差", "留存"]
    },
    {
      id: "seg-2",
      start: 15,
      end: 45,
      title: "文和友场景构建",
      type: "scene",
      color: "#fca5a5",
      intensity: 0.6,
      summary: "复古怀旧风格的布景，营造出 80 年代长沙的沉浸感。",
      keywords: ["场景化", "布景", "怀旧"]
    },
    {
      id: "seg-3",
      start: 45,
      end: 85,
      title: "核心产品深度解析",
      type: "product",
      color: "#93c5fd",
      intensity: 0.85,
      summary: "通过特写镜头和声音采样（ASMR）展示产品质感。",
      keywords: ["产品力", "特写", "ASMR"]
    },
    {
      id: "seg-4",
      start: 85,
      end: 120,
      title: "黑色经典转化逻辑",
      type: "conversion",
      color: "#fca5a5",
      intensity: 0.75,
      summary: "展示排队盛况和用户好评，建立社交信任感。",
      keywords: ["从众心理", "信任", "转化"]
    },
    {
      id: "seg-5",
      start: 120,
      end: 180,
      title: "结尾呼吁行动",
      type: "outro",
      color: "#d8b4fe",
      intensity: 0.5,
      summary: "引导用户点赞评论，并预告下一期探店城市。",
      keywords: ["CTA", "留存", "下期预告"]
    }
  ];

  window.MOCK_ANALYSIS = {
    bricknote: {
      sourceType: "demo",
      sourceLabel: "抖音演示导入",
      videoTitle: "长沙探店短视频结构拆解",
      videoSrc: demoVideoSrc,
      duration: 180,
      noteTitle: "长沙探店视频逻辑拆解",
      coreIdea:
        "通过场景化叙事结合强视觉符号（红色调、复古场景），成功将流量转化为对单一品牌（文和友）的深度认知。",
      actionItems: ["尝试在视频第10秒加入情绪钩子", "参考文和友的打光方案进行复刻"],
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
