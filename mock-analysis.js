(function () {
  const demoVideoSrc =
    "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

  window.MOCK_ANALYSIS = {
    demoVideoSrc,
    douyin: {
      sourceType: "douyin_url",
      sourceLabel: "抖音演示链接",
      videoTitle: "3 分钟拆解爆款短视频脚本",
      duration: 86,
      videoSrc: demoVideoSrc,
      generatedDescription:
        "这条视频用开场钩子、痛点拆解和行动建议完成一次高密度内容表达，适合作为短视频选题和脚本复盘案例。",
      segments: [
        {
          start: 0,
          end: 10,
          type: "talking_head",
          title: "开场钩子",
          summary: "用一个强问题把观众拉进来，快速交代视频收益。",
          keywords: ["钩子", "收益点", "短视频"],
          intensity: 0.72
        },
        {
          start: 10,
          end: 24,
          type: "key_point",
          title: "核心结论先行",
          summary: "先给结论，再解释原因，降低观众理解成本。",
          keywords: ["结论", "信息密度", "留存"],
          intensity: 0.9
        },
        {
          start: 24,
          end: 42,
          type: "slides",
          title: "结构拆解",
          summary: "把视频拆成开场、论证、案例和行动建议四个部分。",
          keywords: ["结构", "章节", "脚本"],
          intensity: 0.66
        },
        {
          start: 42,
          end: 62,
          type: "code",
          title: "模板演示",
          summary: "用可复用的脚本模板快速生成下一条视频大纲。",
          keywords: ["模板", "复用", "创作效率"],
          intensity: 0.82
        },
        {
          start: 62,
          end: 76,
          type: "talking_head",
          title: "创作者备忘",
          summary: "提醒 UP 主保留口语感，不要让脚本变成说明书。",
          keywords: ["备忘", "表达", "人味"],
          intensity: 0.58
        },
        {
          start: 76,
          end: 86,
          type: "key_point",
          title: "收束 CTA",
          summary: "用一句行动建议结束，让观众知道下一步做什么。",
          keywords: ["CTA", "行动", "转化"],
          intensity: 0.76
        }
      ]
    },
    local: {
      sourceType: "local_upload",
      sourceLabel: "本地上传",
      videoTitle: "本地视频分析 Demo",
      duration: 86,
      videoSrc: "",
      generatedDescription:
        "本地上传视频已套用演示分析结果：你可以通过 X-Ray Timeline 快速定位重点，并用卡片积木整理章节摘要。",
      segments: [
        {
          start: 0,
          end: 12,
          type: "talking_head",
          title: "开场说明",
          summary: "视频开头建立主题和观看预期。",
          keywords: ["开场", "主题", "预期"],
          intensity: 0.68
        },
        {
          start: 12,
          end: 28,
          type: "slides",
          title: "背景信息",
          summary: "补充上下文，让观众理解问题为什么重要。",
          keywords: ["背景", "上下文", "问题"],
          intensity: 0.62
        },
        {
          start: 28,
          end: 46,
          type: "key_point",
          title: "关键观点",
          summary: "提出整段内容最值得记住的结论。",
          keywords: ["观点", "结论", "重点"],
          intensity: 0.88
        },
        {
          start: 46,
          end: 64,
          type: "code",
          title: "过程演示",
          summary: "展示操作过程或案例步骤。",
          keywords: ["演示", "步骤", "案例"],
          intensity: 0.78
        },
        {
          start: 64,
          end: 86,
          type: "key_point",
          title: "总结与行动",
          summary: "收束内容并给出下一步建议。",
          keywords: ["总结", "建议", "行动"],
          intensity: 0.74
        }
      ]
    }
  };
})();
