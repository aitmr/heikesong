(function () {
  const iconPaths = {
    play: "M5 3l14 9-14 9V3z",
    pause: "M6 4h4v16H6zM14 4h4v16h-4z",
    list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    fileText: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    search: "M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM16 16l5 5",
    share: "M18 8a3 3 0 10-2.83-4H15a3 3 0 00.17 1L8.9 8.2a3 3 0 100 3.6l6.27 3.2A3 3 0 1016 14",
    plus: "M12 5v14M5 12h14",
    download: "M12 3v12M7 10l5 5 5-5M5 21h14",
    sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM5 15l.9 2.1L8 18l-2.1.9L5 21l-.9-2.1L2 18l2.1-.9L5 15zM19 14l.7 1.7L21 16l-1.3.3L19 18l-.7-1.7L17 16l1.3-.3L19 14z",
    grip: "M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01",
    trash: "M3 6h18M8 6V4h8v2M6 6l1 16h10l1-16M10 11v6M14 11v6",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    layout: "M3 3h18v18H3zM9 3v18",
    clock: "M12 8v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    hash: "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
    chevronRight: "M9 18l6-6-6-6",
    chevronDown: "M6 9l6 6 6-6",
    wand: "M15 4l5 5M14.5 9.5L4 20l-1-1L13.5 8.5M17 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3zM5 3l.7 1.6L7 5l-1.3.4L5 7l-.7-1.6L3 5l1.3-.4L5 3z",
    map: "M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3zM9 3v15M15 6v15",
    network: "M12 5a3 3 0 100-6 3 3 0 000 6zM6 21a3 3 0 100-6 3 3 0 000 6zM18 21a3 3 0 100-6 3 3 0 000 6zM10.6 6.8L7.4 14.2M13.4 6.8l3.2 7.4",
    gitBranch: "M6 3v12M6 15a3 3 0 100 6 3 3 0 000-6zM18 3a3 3 0 100 6 3 3 0 000-6zM18 9a9 9 0 01-9 9",
    folder: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z",
    folderOpen: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v2M3 11h18l-2 8H5z",
    settings: "M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.8 1.8 0 00.36 1.98l.04.05-2 3.46-.06-.02a1.8 1.8 0 00-2.02.28 1.8 1.8 0 00-.58 1.25V22h-4v-.08a1.8 1.8 0 00-2.6-1.53l-.06.03-2-3.46.05-.04A1.8 1.8 0 005 15a1.8 1.8 0 00-1.44-1.77L3.5 13.2v-4l.06-.02A1.8 1.8 0 005 7a1.8 1.8 0 00-.36-1.98L4.6 4.97l2-3.46.06.02a1.8 1.8 0 002.02-.28A1.8 1.8 0 009.26 0h4v.08a1.8 1.8 0 002.6 1.53l.06-.03 2 3.46-.05.04A1.8 1.8 0 0019 7a1.8 1.8 0 001.44 1.77l.06.02v4l-.06.02A1.8 1.8 0 0019.4 15z",
    star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1L12 2z",
    upload: "M12 3v12M7 8l5-5 5 5M5 21h14",
    more: "M12 13a1 1 0 100-2 1 1 0 000 2zM19 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 100-2 1 1 0 000 2z",
    x: "M18 6L6 18M6 6l12 12"
  };

  const NODE_WIDTH = 220;
  const NODE_HEIGHT = 154;
  const ROW_TOLERANCE = 42;
  const COL_TOLERANCE = 42;
  const ADJACENT_Y = NODE_HEIGHT + 28;
  const ADJACENT_TOLERANCE = 48;
  const SIDEBAR_MIN_WIDTH = 216;
  const SIDEBAR_MAX_WIDTH = 420;
  const MAX_ANALYSIS_UPLOAD_BYTES = 25 * 1024 * 1024;
  const TYPE_LABELS = {
    intro: "开场",
    scene: "场景",
    process: "过程",
    key_point: "重点",
    product: "产品",
    conflict: "冲突",
    conversion: "转化",
    outro: "收束"
  };
  const SUMMARY_MODES = {
    mind_map: { label: "思维导图", shortLabel: "Mind Map", icon: "network" },
    temporal_map: { label: "时空地图", shortLabel: "Temporal Map", icon: "map" },
    flowchart: { label: "逻辑流程图", shortLabel: "Flowchart", icon: "gitBranch" }
  };
  const SUMMARY_MODE_ORDER = ["mind_map", "temporal_map", "flowchart"];
  const SHOT_THEME_META = {
    talking: { label: "谈话", color: "#2563eb", axis: { x: 100, y: 18 } },
    closeup: { label: "特写", color: "#f97316", axis: { x: 28, y: 138 } },
    broll: { label: "空镜头", color: "#16a34a", axis: { x: 172, y: 138 } }
  };
  const SHOT_THEME_ORDER = ["talking", "closeup", "broll"];

  const state = {
    analysis: clone(window.MOCK_ANALYSIS.bricknote),
    currentTime: 0,
    duration: window.MOCK_ANALYSIS.bricknote.duration,
    isPlaying: false,
    isSidebarOpen: !window.matchMedia("(max-width: 980px)").matches,
    sidebarWidth: 264,
    folders: [
      {
        id: "f1",
        name: "美食探店系列",
        isOpen: true,
        pages: [
          { id: "p1", title: "长沙文和友拆解" },
          { id: "p3", title: "重庆洪崖洞拆解" }
        ]
      },
      { id: "f2", name: "短视频脚本公式", isOpen: false, pages: [{ id: "p2", title: "黄金3秒钩子法则" }] },
      { id: "f3", name: "个人收藏", isOpen: false, pages: [] }
    ],
    activePageId: "p1",
    notesByPage: {
      p1: "长沙文和友拆解\n\n- 开头先用城市记忆和排队场景建立情绪钩子。\n- 中段用菜品特写、环境声和人物反应补足可信度。\n- 结尾把体验总结成可复用的探店脚本结构。",
      p2: "黄金3秒钩子法则\n\n先给冲突、结果或强画面，再补背景。每条短视频只承载一个明确承诺。",
      p3: "重庆洪崖洞拆解\n\n- 山城夜景、吊脚楼和市井招牌共同制造复古场景。\n- 通过层叠空间和人流密度，把旅游地标拍成沉浸式故事入口。\n- 与长沙文和友一样，核心都在于把消费空间转化成可传播的城市记忆。"
    },
    workspacesByPage: {
      p1: [],
      p2: [],
      p3: [
        {
          id: "nebula-hongyadong-scene",
          segmentId: "nebula-hongyadong-scene",
          originSegmentId: "nebula-hongyadong-scene",
          instanceId: 3001,
          sourcePageId: "p3",
          sourcePageTitle: "重庆洪崖洞拆解",
          copiedFromInstanceId: null,
          start: 22,
          end: 58,
          title: "洪崖洞复古场景营造",
          type: "scene",
          color: "#fda4af",
          intensity: 0.78,
          summary: "用吊脚楼、霓虹招牌和山城夜景叠出复古场景，让空间本身成为短视频记忆点。",
          keywords: ["场景化", "复古", "怀旧", "城市记忆"]
        }
      ]
    },
    generatedNote: null,
    summaryViewMode: "",
    isGenerating: false,
    isImporting: false,
    dragging: null,
    prerequisiteSegmentId: "",
    relationSignatures: new Set(),
    nodePulseUntil: {},
    importStatus: "演示视频已就绪",
    importError: "",
    localObjectUrl: null,
    analysisSummary: window.MOCK_ANALYSIS.bricknote.coreIdea,
    backendSource: "mock"
  };

  const app = document.getElementById("app");

  function clone(source) {
    return JSON.parse(JSON.stringify(source));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name, size) {
    return `
      <svg class="icon" width="${size || 16}" height="${size || 16}" viewBox="0 0 24 24" aria-hidden="true">
        <path d="${iconPaths[name]}" fill="${name === "play" || name === "pause" ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function activePageTitle() {
    const page = activePage();
    return page ? page.title : "未命名笔记";
  }

  function pageTitleById(pageId) {
    for (const folder of state.folders) {
      const page = folder.pages.find((item) => item.id === pageId);
      if (page) return page.title;
    }
    return "未命名笔记";
  }

  function activePage() {
    for (const folder of state.folders) {
      const page = folder.pages.find((item) => item.id === state.activePageId);
      if (page) return page;
    }
    return null;
  }

  function activeNoteText() {
    if (!Object.prototype.hasOwnProperty.call(state.notesByPage, state.activePageId)) {
      state.notesByPage[state.activePageId] = "";
    }
    return state.notesByPage[state.activePageId];
  }

  function activeWorkspace() {
    if (!Array.isArray(state.workspacesByPage[state.activePageId])) {
      state.workspacesByPage[state.activePageId] = [];
    }
    return state.workspacesByPage[state.activePageId];
  }

  function setActiveWorkspace(nextWorkspace) {
    state.workspacesByPage[state.activePageId] = nextWorkspace;
  }

  function allWorkspaceBricks() {
    return Object.entries(state.workspacesByPage).flatMap(([pageId, workspace]) =>
      (workspace || []).map((brick) => ({
        ...brick,
        pageId,
        pageTitle: pageTitleById(pageId)
      }))
    );
  }

  function generatedNoteMarkdown(note, mode) {
    const normalized = normalizeGeneratedNote(note);
    if (!normalized) return "";
    const selectedMode = normalizeSummaryMode(mode || normalized.mode);
    const modeMeta = SUMMARY_MODES[selectedMode];
    const lines = [
      `# ${normalized.title}`,
      "",
      `推荐视图：${modeMeta.label}`,
      `推荐理由：${normalized.modeReason}`,
      "",
      `核心观点：${normalized.core}`,
      ""
    ];

    if (selectedMode === "mind_map") {
      const view = normalized.views.mind_map;
      lines.push(`## ${view.center || "思维导图"}`);
      (view.branches || []).forEach((branch) => {
        lines.push(`- ${branch.title}`);
        (branch.children || []).forEach((child) => lines.push(`  - ${child}`));
      });
    } else if (selectedMode === "temporal_map") {
      const view = normalized.views.temporal_map;
      lines.push(`## ${view.routeTitle || "时空地图"}`);
      (view.stations || []).forEach((station, index) => {
        lines.push(`${index + 1}. ${station.time || ""} ${station.label || station.place || "站点"}`);
        lines.push(`   - 地点/地标：${station.place || "未标注"}`);
        lines.push(`   - 美食/记忆点：${station.food || "未标注"}`);
        lines.push(`   - 摘要：${station.description || ""}`);
      });
    } else {
      const view = normalized.views.flowchart;
      lines.push("## 逻辑流程图");
      (view.nodes || []).forEach((node) => {
        lines.push(`- [${node.type || "step"}] ${node.label}: ${node.description || ""}`);
      });
      if ((view.edges || []).length) {
        lines.push("");
        lines.push("### 分支");
        view.edges.forEach((edge) => lines.push(`- ${edge.from} --${edge.label || "继续"}--> ${edge.to}`));
      }
    }

    lines.push("");
    lines.push("## 行动建议");
    lines.push(normalized.action);
    return lines.join("\n");
  }

  function generatedNoteText(note) {
    return generatedNoteMarkdown(note, state.summaryViewMode || (note && note.mode));
  }

  function normalizeSummaryMode(value) {
    return SUMMARY_MODES[value] ? value : "mind_map";
  }

  function compactText(value, fallback, maxLength) {
    const text = String(value || fallback || "").trim();
    const limit = maxLength || 36;
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  }

  function segmentSearchText(segment) {
    return [
      segment && segment.type,
      segment && segment.title,
      segment && segment.summary,
      ...((segment && Array.isArray(segment.keywords)) ? segment.keywords : [])
    ].join(" ").toLowerCase();
  }

  function inferSummaryMode(analysis, segments) {
    const text = [
      analysis && analysis.videoTitle,
      analysis && analysis.noteTitle,
      analysis && analysis.coreIdea,
      ...(Array.isArray(segments) ? segments.map(segmentSearchText) : [])
    ].join(" ").toLowerCase();

    if (/教学|教程|步骤|方法|流程|判断|选择|决策|操作|怎么|如何|lesson|tutorial|how to|guide/.test(text)) {
      return "flowchart";
    }
    if (/美食|探店|餐厅|小吃|菜品|吃|旅行|旅游|地标|景点|城市|街区|路线|打卡|food|travel|restaurant|landmark/.test(text)) {
      return "temporal_map";
    }
    return "mind_map";
  }

  function summaryModeReason(mode) {
    if (mode === "flowchart") return "内容包含步骤、教学或判断路径，适合用流程图呈现。";
    if (mode === "temporal_map") return "内容围绕地点、美食或旅行路径展开，适合用时空地图呈现。";
    return "内容更偏观点归纳和结构拆解，适合用思维导图呈现。";
  }

  function buildMindMapView(fileName, segments) {
    const items = (Array.isArray(segments) ? segments : []).slice(0, 6);
    return {
      center: compactText(fileName, "视频结构拆解", 18),
      branches: items.length
        ? items.map((segment) => ({
            title: compactText(segment.title, "关键片段", 18),
            children: [
              compactText(segment.summary, "提炼该片段的核心信息。", 36),
              ...((Array.isArray(segment.keywords) ? segment.keywords : []).slice(0, 2).map((keyword) => `#${keyword}`))
            ].filter(Boolean)
          }))
        : [
            { title: "核心观点", children: ["整理视频主线", "提炼可复用结论"] },
            { title: "内容结构", children: ["按片段顺序展开", "保留关键关系"] }
          ]
    };
  }

  function buildTemporalMapView(fileName, segments) {
    const items = (Array.isArray(segments) ? segments : []).slice(0, 6);
    return {
      routeTitle: compactText(fileName, "视频路线", 18),
      stations: items.length
        ? items.map((segment, index) => ({
            time: segment.timeLabel || formatTime(segment.start || 0),
            label: compactText(segment.title, `站点 ${index + 1}`, 16),
            place: compactText((Array.isArray(segment.keywords) && segment.keywords[0]) || segment.title, "地点", 12),
            food: compactText((Array.isArray(segment.keywords) && segment.keywords[1]) || "体验", "体验", 12),
            description: compactText(segment.summary, "记录这一站的场景和内容重点。", 42)
          }))
        : [
            { time: "00:00", label: "起点", place: "入口", food: "体验", description: "从视频开头建立路线和主题。" },
            { time: "继续", label: "重点站", place: "场景", food: "记忆点", description: "用地点、美食或地标串联内容。" }
          ]
    };
  }

  function buildFlowchartView(segments) {
    const items = (Array.isArray(segments) ? segments : []).slice(0, 5);
    const nodes = [{ id: "start", type: "start", label: "开始", description: "进入视频主题" }];
    const edges = [];

    items.forEach((segment, index) => {
      const id = `node-${index + 1}`;
      const isDecision = index === 1 || /判断|是否|选择|条件|如果|能否|要不要/.test(segmentSearchText(segment));
      nodes.push({
        id,
        type: isDecision ? "decision" : "step",
        label: compactText(segment.title, `步骤 ${index + 1}`, 18),
        description: compactText(segment.summary, "执行这一关键步骤。", 42)
      });
      edges.push({
        from: index === 0 ? "start" : `node-${index}`,
        to: id,
        label: index === 0 ? "开始" : (isDecision ? "是" : "继续")
      });
    });

    nodes.push({ id: "result", type: "result", label: "形成总结", description: "得到可复用的视频笔记结构。" });
    edges.push({ from: items.length ? `node-${items.length}` : "start", to: "result", label: "然后" });
    if (items.length >= 2) edges.push({ from: "node-2", to: "result", label: "否" });
    return { nodes, edges };
  }

  function buildFallbackStructuredNote(mode) {
    const segments = getSpatialWorkspace();
    const selectedMode = normalizeSummaryMode(mode || inferSummaryMode(state.analysis, segments));
    const firstTitles = segments.map((item) => item.title).slice(0, 3).join("、") || "关键片段";
    return {
      title: "视频结构拆解",
      core: state.analysisSummary || `${state.analysis.videoTitle || "当前视频"} 的内容可以按“${firstTitles}”这条链路理解。`,
      steps: segments.slice(0, 6).map((brick) => brick.summary || brick.title || "整理一个关键片段。"),
      action: computeRelations().relations[0] || "继续调整积木位置，明确并列、递进、从属或条件关系。",
      mode: selectedMode,
      modeReason: summaryModeReason(selectedMode),
      views: {
        mind_map: buildMindMapView(state.analysis.videoTitle, segments),
        temporal_map: buildTemporalMapView(state.analysis.videoTitle, segments),
        flowchart: buildFlowchartView(segments)
      }
    };
  }

  function normalizeGeneratedNote(rawNote) {
    if (!rawNote) return null;
    const fallback = buildFallbackStructuredNote(rawNote.mode);
    const note = typeof rawNote === "object" ? rawNote : {};
    const views = note.views && typeof note.views === "object" ? note.views : {};
    const mode = normalizeSummaryMode(note.mode || fallback.mode);

    return {
      title: compactText(note.title, fallback.title, 18),
      core: String(note.core || fallback.core).trim(),
      steps: Array.isArray(note.steps) && note.steps.length ? note.steps.map((item) => String(item).trim()).filter(Boolean) : fallback.steps,
      action: String(note.action || fallback.action).trim(),
      mode,
      modeReason: String(note.modeReason || summaryModeReason(mode)).trim(),
      views: {
        mind_map: normalizeMindMapView(views.mind_map || note.mind_map || fallback.views.mind_map, fallback.views.mind_map),
        temporal_map: normalizeTemporalMapView(
          views.temporal_map || note.temporal_map || fallback.views.temporal_map,
          fallback.views.temporal_map
        ),
        flowchart: normalizeFlowchartView(views.flowchart || note.flowchart || fallback.views.flowchart, fallback.views.flowchart)
      }
    };
  }

  function normalizeMindMapView(view, fallback) {
    const source = view && typeof view === "object" ? view : fallback;
    return {
      center: compactText(source.center, fallback.center, 18),
      branches: (Array.isArray(source.branches) ? source.branches : fallback.branches).slice(0, 6).map((branch) => ({
        title: compactText(branch.title, "分支", 18),
        children: (Array.isArray(branch.children) ? branch.children : []).map((item) => compactText(item, "要点", 38)).slice(0, 4)
      }))
    };
  }

  function normalizeTemporalMapView(view, fallback) {
    const source = view && typeof view === "object" ? view : fallback;
    return {
      routeTitle: compactText(source.routeTitle, fallback.routeTitle, 18),
      stations: (Array.isArray(source.stations) ? source.stations : fallback.stations).slice(0, 6).map((station, index) => ({
        time: compactText(station.time, formatTime(index * 30), 10),
        label: compactText(station.label, `站点 ${index + 1}`, 16),
        place: compactText(station.place, "地点", 12),
        food: compactText(station.food, "体验", 12),
        description: compactText(station.description, "记录这一站的内容重点。", 44)
      }))
    };
  }

  function normalizeFlowchartView(view, fallback) {
    const source = view && typeof view === "object" ? view : fallback;
    const nodes = (Array.isArray(source.nodes) ? source.nodes : fallback.nodes).slice(0, 8).map((node, index) => ({
      id: String(node.id || `node-${index}`),
      type: ["start", "decision", "step", "result"].includes(node.type) ? node.type : "step",
      label: compactText(node.label, `节点 ${index + 1}`, 18),
      description: compactText(node.description, "", 44)
    }));
    const nodeIds = new Set(nodes.map((node) => node.id));
    const edges = (Array.isArray(source.edges) ? source.edges : fallback.edges)
      .filter((edge) => nodeIds.has(String(edge.from)) && nodeIds.has(String(edge.to)))
      .slice(0, 10)
      .map((edge) => ({
        from: String(edge.from),
        to: String(edge.to),
        label: compactText(edge.label, "继续", 8)
      }));
    return { nodes, edges };
  }

  function activeSegment() {
    return (
      state.analysis.segments.find(
        (segment) => state.currentTime >= segment.start && state.currentTime < segment.end
      ) || state.analysis.segments[state.analysis.segments.length - 1]
    );
  }

  function getVideoDuration() {
    const video = document.getElementById("mainVideo");
    return video && video.duration && Number.isFinite(video.duration) ? video.duration : state.duration;
  }

  function toVideoTime(analysisTime) {
    const videoDuration = getVideoDuration();
    if (!videoDuration || !state.duration) return analysisTime;
    return (analysisTime / state.duration) * videoDuration;
  }

  function toAnalysisTime(videoTime) {
    const videoDuration = getVideoDuration();
    if (!videoDuration || !state.duration) return videoTime;
    return (videoTime / videoDuration) * state.duration;
  }

  function workspaceHas(segmentId) {
    return activeWorkspace().some((item) => item.segmentId === segmentId);
  }

  function libraryItems() {
    return state.analysis.segments.map((segment) => ({
      ...segment,
      isUsed: workspaceHas(segment.id)
    }));
  }

  function normalizeShotTheme(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (["talking", "talk", "dialogue", "dialog", "interview", "speech", "口播", "对话", "谈话", "采访"].includes(normalized)) {
      return "talking";
    }
    if (["closeup", "close_up", "close-up", "detail", "macro", "特写", "细节", "近景"].includes(normalized)) {
      return "closeup";
    }
    if (["broll", "b-roll", "empty", "establishing", "cutaway", "空镜", "空镜头", "环境", "转场"].includes(normalized)) {
      return "broll";
    }
    return "";
  }

  function inferShotTheme(segment) {
    const explicitTheme = normalizeShotTheme(
      segment.shotType || segment.shotTheme || segment.shotCategory || segment.visualType
    );
    if (explicitTheme) return explicitTheme;

    const text = [
      segment.type,
      segment.title,
      segment.summary,
      ...(Array.isArray(segment.keywords) ? segment.keywords : [])
    ].join(" ").toLowerCase();

    if (/特写|细节|质感|产品|菜品|手部|asmr|close|macro|detail/.test(text)) return "closeup";
    if (/场景|环境|空镜|布景|街景|夜景|城市|转场|氛围|broll|b-roll|establishing/.test(text)) return "broll";
    return "talking";
  }

  function computeShotThemeAnalytics() {
    const totals = SHOT_THEME_ORDER.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const segments = Array.isArray(state.analysis.segments) ? state.analysis.segments : [];
    segments.forEach((segment) => {
      const duration = Math.max(0, Number(segment.end || 0) - Number(segment.start || 0));
      totals[inferShotTheme(segment)] += duration;
    });

    const totalDuration = SHOT_THEME_ORDER.reduce((sum, key) => sum + totals[key], 0) || state.duration || 1;
    const items = SHOT_THEME_ORDER.map((key) => ({
      key,
      ...SHOT_THEME_META[key],
      seconds: totals[key],
      percent: Math.round((totals[key] / totalDuration) * 100)
    }));
    const dominant = items.reduce((max, item) => (item.percent > max.percent ? item : max), items[0]);

    return { items, dominant };
  }

  function captureScrollState() {
    const main = document.querySelector(".main");
    const sidebar = document.querySelector(".sidebar-scroll");
    return {
      mainTop: main ? main.scrollTop : 0,
      sidebarTop: sidebar ? sidebar.scrollTop : 0
    };
  }

  function restoreScrollState(scrollState) {
    if (!scrollState) return;

    const main = document.querySelector(".main");
    const sidebar = document.querySelector(".sidebar-scroll");
    if (main) main.scrollTop = scrollState.mainTop;
    if (sidebar) sidebar.scrollTop = scrollState.sidebarTop;
  }

  function render(options) {
    const renderOptions = options || {};
    const scrollState = renderOptions.preserveScroll === false ? null : captureScrollState();
    const active = activeSegment();
    const progress = Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100));

    app.innerHTML = `
      <div class="app-shell ${state.isSidebarOpen ? "" : "sidebar-collapsed"}">
        ${renderSidebar()}

        <div class="surface">
          <nav class="topbar">
            <div class="nav-left">
              <button class="icon-button ghost" id="toggleSidebar" type="button" aria-label="切换侧边栏">
                ${icon("layout", 18)}
              </button>
              <span class="nav-separator"></span>
              <h1>当前编辑：${escapeHtml(activePageTitle())}</h1>
            </div>

            <div class="nav-actions">
              <button class="generate-button" id="generateNote" type="button" ${activeWorkspace().length === 0 || state.isGenerating ? "disabled" : ""}>
                ${state.isGenerating ? '<span class="spinner"></span>' : icon("sparkles", 14)}
                <span>${state.isGenerating ? "正在生成..." : "生成深度总结"}</span>
              </button>
              <button class="icon-button ghost" type="button" aria-label="收藏">${icon("star", 18)}</button>
              <button class="icon-button ghost" type="button" aria-label="分享">${icon("share", 18)}</button>
            </div>
          </nav>

          <main class="main">
            <div class="workspace-grid">
              ${renderNotePanel()}
              <div class="content-wrap video-module">
                <section class="video-stage" aria-label="视频播放器">
                  <video
                    id="mainVideo"
                    src="${state.analysis.videoSrc}"
                    playsinline
                    preload="metadata"
                  ></video>
                  <button class="play-fab" id="playToggle" type="button" aria-label="${state.isPlaying ? "暂停" : "播放"}">
                    ${state.isPlaying ? icon("pause", 22) : icon("play", 22)}
                  </button>
                  <div class="video-meta">
                    <span>${escapeHtml(state.analysis.sourceLabel)}</span>
                    <strong>${escapeHtml(state.analysis.videoTitle)}</strong>
                  </div>
                  <div class="video-controls">
                    <div class="hud-head">
                      <span class="time-label">${formatTime(state.currentTime)} / ${formatTime(state.duration)}</span>
                      <span class="active-pill" style="--pill-color:${active.color}">${escapeHtml(active.title)}</span>
                    </div>
                    <div class="wave-timeline" id="timeline" style="--progress:${progress}">
                      ${renderTimelineBars()}
                      <span class="playhead" style="left:${progress}%"></span>
                    </div>
                    <div class="progress-track" id="progressTrack">
                      <span style="width:${progress}%"></span>
                    </div>
                  </div>
                </section>

                <section class="import-card" aria-label="导入视频">
                  <form id="demoForm" class="import-form">
                    <input id="douyinUrl" type="text" placeholder="粘贴视频直链 / 抖音链接，或留空载入演示" autocomplete="off">
                    <button type="submit" ${state.isImporting ? "disabled" : ""}>
                      ${state.isImporting ? "正在导入..." : "导入链接"}
                    </button>
                  </form>
                  <label class="upload-button">
                    ${icon("upload", 14)}
                    <span>上传本地视频</span>
                    <input id="localVideo" type="file" accept="video/mp4,video/webm,video/quicktime,video/*">
                  </label>
                  <p class="import-status ${state.importError ? "is-error" : ""}" role="status">${escapeHtml(state.importError || state.importStatus)}</p>
                </section>

                <div class="builder-layout">
                  <section class="library-card">
                    <h2 class="eyebrow">${icon("hash", 12)} 知识积木库</h2>
                    ${renderThemeAnalytics()}
                    <div class="brick-library">
                      ${libraryItems().map(renderLibraryBrick).join("")}
                    </div>
                  </section>

                  <section class="workbench ${activeWorkspace().length === 0 ? "is-empty" : ""}" id="workbench">
                    <div class="workbench-head">
                      <h2>知识星团 (Knowledge Nebula)</h2>
                      <span>${activeWorkspace().length} BLOCKS</span>
                    </div>

                    ${renderRelationCanvas()}
                    ${activeWorkspace().length ? renderRelationSummary() : ""}
                    ${activeWorkspace().length ? renderGeneratedNote() : ""}
                  </section>
                </div>
              </div>
            </div>
          </main>

          <div class="ai-bar">
            <input type="text" placeholder="问问 AI 视频细节或调整笔记格式...">
            <button class="send-button" type="button" aria-label="发送">${icon("send", 16)}</button>
          </div>
        </div>
      </div>
    `;

    bindEvents();
    restoreScrollState(scrollState);
    window.requestAnimationFrame(() => restoreScrollState(scrollState));
  }

  function renderSidebar() {
    return `
      <aside class="sidebar" style="--sidebar-width:${state.sidebarWidth}px">
        <div class="space-switcher">
          <div class="space-mark">BN</div>
          <span>积木视频笔记空间</span>
          <button class="sidebar-close" id="closeSidebar" type="button" aria-label="关闭侧边栏">
            ${icon("x", 16)}
          </button>
        </div>

        <div class="sidebar-scroll">
          <button class="side-action" type="button">${icon("search", 16)} <span>搜索</span></button>
          <button class="side-action" type="button">${icon("settings", 16)} <span>设置</span></button>

          <div class="notebook-section">
            <div class="notebook-title">
              <span>笔记夹 (Notebooks)</span>
              <button type="button" aria-label="新建笔记夹">${icon("plus", 14)}</button>
            </div>

            ${state.folders.map(renderFolder).join("")}
          </div>
        </div>
        <div class="sidebar-resizer" id="sidebarResizer" role="separator" aria-orientation="vertical" aria-label="调整侧栏宽度"></div>
      </aside>
    `;
  }

  function renderNotePanel() {
    const noteText = activeNoteText();
    return `
      <section class="note-panel" aria-label="可编辑笔记">
        <div class="note-panel-head">
          <span>NOTE</span>
          <input id="noteTitleInput" type="text" value="${escapeHtml(activePageTitle())}" aria-label="笔记标题">
        </div>
        <textarea id="noteEditor" spellcheck="false" aria-label="笔记内容">${escapeHtml(noteText)}</textarea>
        <div class="note-panel-foot">
          <span id="noteSaveState">自动保存</span>
          <span id="noteCharCount">${noteText.length} 字</span>
        </div>
      </section>
    `;
  }

  function renderFolder(folder) {
    return `
      <div class="folder">
        <button class="folder-row" type="button" data-folder="${folder.id}">
          <span class="folder-caret ${folder.isOpen ? "is-open" : ""}">${icon("chevronRight", 14)}</span>
          ${folder.isOpen ? icon("folderOpen", 16) : icon("folder", 16)}
          <span>${escapeHtml(folder.name)}</span>
        </button>

        ${
          folder.isOpen
            ? `
              <div class="page-list">
                ${folder.pages.map(renderPage).join("")}
                <button class="new-page" type="button" data-new-page="${folder.id}">
                  ${icon("plus", 12)} <span>新建页面</span>
                </button>
              </div>
            `
            : ""
        }
      </div>
    `;
  }

  function renderPage(page) {
    const isActive = page.id === state.activePageId;
    const blockCount = (state.workspacesByPage[page.id] || []).length;
    return `
      <button class="page-row ${isActive ? "is-active" : ""}" type="button" data-page="${page.id}" data-page-drop="${page.id}" title="${isActive ? "当前页面" : "可将积木拖到此页面"}">
        ${icon("fileText", 14)}
        <span>${escapeHtml(page.title)}</span>
        ${blockCount ? `<small>${blockCount}</small>` : ""}
      </button>
    `;
  }

  function renderLibraryBrick(segment) {
    return `
      <button
        class="library-brick ${segment.isUsed ? "is-used" : ""}"
        type="button"
        draggable="true"
        data-library-id="${segment.id}"
        style="--brick-color:${segment.color}"
        title="${segment.isUsed ? "已加入积木墙" : "拖动或点击加入积木墙"}"
      >
        <span>${formatTime(segment.start)}</span>
        <em>${escapeHtml(TYPE_LABELS[segment.type] || segment.type || "片段")}</em>
        <strong>${escapeHtml(segment.title)}</strong>
      </button>
    `;
  }

  function renderThemeAnalytics() {
    const { items, dominant } = computeShotThemeAnalytics();
    const pointString = items
      .map((item) => {
        const axis = SHOT_THEME_META[item.key].axis;
        const ratio = Math.max(0.08, item.percent / 100);
        const x = 100 + (axis.x - 100) * ratio;
        const y = 100 + (axis.y - 100) * ratio;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    return `
      <section class="theme-radar" aria-label="积木色彩雷达">
        <div class="theme-radar-head">
          <div>
            <strong>积木色彩雷达</strong>
            <span>Theme Analytics</span>
          </div>
          <em>${escapeHtml(dominant.label)} ${dominant.percent}%</em>
        </div>

        <div class="theme-radar-visual">
          <svg class="radar-chart" viewBox="0 0 200 160" role="img" aria-label="谈话、特写、空镜头占比雷达图">
            <polygon class="radar-grid outer" points="100,18 28,138 172,138"></polygon>
            <polygon class="radar-grid middle" points="100,59 64,119 136,119"></polygon>
            <polygon class="radar-grid inner" points="100,79 82,110 118,110"></polygon>
            <line x1="100" y1="100" x2="100" y2="18"></line>
            <line x1="100" y1="100" x2="28" y2="138"></line>
            <line x1="100" y1="100" x2="172" y2="138"></line>
            <polygon class="radar-area" points="${pointString}"></polygon>
            ${items
              .map((item) => {
                const axis = SHOT_THEME_META[item.key].axis;
                return `<circle class="radar-dot" style="--dot-color:${item.color}" cx="${axis.x}" cy="${axis.y}" r="4"></circle>`;
              })
              .join("")}
          </svg>

          <div class="theme-stack" aria-hidden="true">
            ${items
              .map(
                (item) => `
                  <span
                    style="--theme-color:${item.color}; --theme-percent:${item.percent}%"
                    title="${escapeHtml(item.label)} ${item.percent}%"
                  ></span>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="theme-metrics">
          ${items
            .map(
              (item) => `
                <div class="theme-metric">
                  <span style="--theme-color:${item.color}"></span>
                  <strong>${item.percent}%</strong>
                  <em>${escapeHtml(item.label)}</em>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderEmptyWorkbench() {
    return `
      <div class="empty-state">
        <div>${icon("plus", 20)}</div>
        <p>将积木拖入此处开始构建你的笔记结构</p>
      </div>
    `;
  }

  function renderRelationCanvas() {
    if (!activeWorkspace().length) {
      state.relationSignatures = new Set();
      state.nodePulseUntil = {};
      return `
        <div class="relation-canvas" id="relationCanvas">
          ${renderEmptyWorkbench()}
        </div>
      `;
    }

    const relationResult = computeRelations();
    updateRelationAnimationState(relationResult.relationItems);
    const roleMap = relationRoleMap(relationResult.relationItems);
    const nodesHtml = getSpatialWorkspace()
      .map((brick, index) => renderCanvasBlock(brick, index, roleMap[brick.instanceId] || {}))
      .join("");

    return `
      <div class="relation-canvas" id="relationCanvas">
        ${drawRelationLayer(relationResult.edges)}
        ${nodesHtml}
      </div>
    `;
  }

  function renderCanvasBlock(brick, index, role) {
    const magnetic = (state.nodePulseUntil[brick.instanceId] || 0) > Date.now() ? "is-magnetic" : "";
    const relationClass = [
      role.subParent ? "is-sub-parent" : "",
      role.subChild ? "is-sub-child" : "",
      role.parallel ? "is-parallel" : "",
      role.progressive ? "is-progressive" : "",
      role.conditional ? "is-conditional" : "",
      role.nebula ? "is-nebula" : ""
    ].filter(Boolean).join(" ");
    const premiseClass = state.prerequisiteSegmentId === brick.segmentId ? "is-premise" : "";
    const backlinks = computeBacklinks(brick);
    const backlinkTitles = backlinks.map((item) => item.pageTitle).join("、");

    return `
      <div
        class="canvas-node ${relationClass} ${premiseClass} ${magnetic}"
        data-workspace-id="${brick.instanceId}"
        style="left:${brick.x}px; top:${brick.y}px;"
      >
        <article
          class="workspace-block canvas-block ${relationClass} ${premiseClass} ${magnetic}"
          draggable="true"
          data-workspace-id="${brick.instanceId}"
          data-segment-id="${brick.segmentId}"
          data-start="${brick.start}"
        >
          <div class="block-index">
            <span>${String(index + 1).padStart(2, "0")}</span>
            ${icon("grip", 14)}
          </div>
          <div class="block-body">
            <div class="block-heading">
              <button type="button" data-seek="${brick.start}">
                ${icon("clock", 10)} ${formatTime(brick.start)}
              </button>
              <em>${escapeHtml(TYPE_LABELS[brick.type] || brick.type || "片段")}</em>
              <h3>${escapeHtml(brick.title)}</h3>
            </div>
            <p>${escapeHtml(brick.summary)}</p>
            <div class="tag-row">
              ${brick.keywords.map((keyword) => `<em>#${escapeHtml(keyword)}</em>`).join("")}
            </div>
            ${
              backlinks.length
                ? `<div class="backlink-row" title="${escapeHtml(backlinkTitles)}">该知识点也在其他 ${backlinks.length} 篇笔记中被引用</div>`
                : ""
            }
          </div>
          <button class="delete-button" type="button" data-delete="${brick.instanceId}" aria-label="删除 ${brick.title}">
            ${icon("trash", 16)}
          </button>
        </article>
      </div>
    `;
  }

  function renderRelationSummary() {
    const { relations } = computeRelations();
    const lines = relations.length
      ? relations.slice(0, 6)
      : ["提示：把积木摆成同行、同列上下相邻、重叠嵌入，或双击设为前提后放到下方，可生成关系。"];

    return `
      <div class="relation-summary">
        <div class="relation-summary-head">
          <strong>关系识别</strong>
          <span>双击积木设为条件前提，拖动位置会实时重算</span>
        </div>
        <div class="relation-list">
          ${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}
        </div>
      </div>
    `;
  }

  function getSpatialWorkspace() {
    return [...activeWorkspace()].sort((a, b) => (a.y - b.y) || (a.x - b.x));
  }

  function getCanvasSize() {
    const canvas = document.getElementById("relationCanvas");
    return {
      width: canvas ? canvas.clientWidth : 760,
      height: canvas ? canvas.clientHeight : 440
    };
  }

  function clampNodePosition(x, y) {
    const size = getCanvasSize();
    return {
      x: Math.max(10, Math.min(x, Math.max(10, size.width - NODE_WIDTH - 10))),
      y: Math.max(10, Math.min(y, Math.max(10, size.height - NODE_HEIGHT - 10)))
    };
  }

  function nextAutoPosition() {
    const index = activeWorkspace().length;
    const columns = Math.max(1, Math.floor((getCanvasSize().width - 20) / (NODE_WIDTH + 28)));
    const col = index % columns;
    const row = Math.floor(index / columns);
    return clampNodePosition(18 + col * (NODE_WIDTH + 28), 18 + row * (NODE_HEIGHT + 28));
  }

  function isNodeInside(parentNode, childNode) {
    const childCenterX = childNode.x + NODE_WIDTH / 2;
    const childCenterY = childNode.y + NODE_HEIGHT / 2;
    const margin = 18;
    return (
      childCenterX > parentNode.x + margin
      && childCenterX < parentNode.x + NODE_WIDTH - margin
      && childCenterY > parentNode.y + margin
      && childCenterY < parentNode.y + NODE_HEIGHT - margin
    );
  }

  function isConditionalPair(premiseNode, targetNode) {
    const sameColumn = Math.abs(premiseNode.x - targetNode.x) <= COL_TOLERANCE;
    const verticalGap = targetNode.y - premiseNode.y;
    return sameColumn && Math.abs(verticalGap - ADJACENT_Y) <= ADJACENT_TOLERANCE;
  }

  function relationSignature(item) {
    return `${item.type}:${item.sourceNodeId}->${item.targetNodeId}`;
  }

  function updateRelationAnimationState(relationItems) {
    const now = Date.now();
    const nextSignatures = new Set(relationItems.map((item) => relationSignature(item)));
    relationItems.forEach((item) => {
      const signature = relationSignature(item);
      if (!state.relationSignatures.has(signature)) {
        state.nodePulseUntil[item.sourceNodeId] = now + 820;
        state.nodePulseUntil[item.targetNodeId] = now + 820;
      }
    });
    state.relationSignatures = nextSignatures;
  }

  function relationRoleMap(relationItems) {
    const map = {};
    relationItems.forEach((item) => {
      map[item.sourceNodeId] = map[item.sourceNodeId] || {};
      map[item.targetNodeId] = map[item.targetNodeId] || {};
      if (item.type === "subordinate") {
        map[item.sourceNodeId].subChild = true;
        map[item.targetNodeId].subParent = true;
      }
      if (item.type === "parallel") {
        map[item.sourceNodeId].parallel = true;
        map[item.targetNodeId].parallel = true;
      }
      if (item.type === "progressive") {
        map[item.sourceNodeId].progressive = true;
        map[item.targetNodeId].progressive = true;
      }
      if (item.type === "conditional") {
        map[item.sourceNodeId].conditional = true;
        map[item.targetNodeId].conditional = true;
      }
      if (item.type === "nebula") {
        map[item.sourceNodeId].nebula = true;
      }
    });
    return map;
  }

  function drawRelationLayer(edges) {
    const lines = edges
      .map((edge) => {
        const dash = edge.strong ? "" : 'stroke-dasharray="7 6"';
        const relationClass = edge.type ? `relation-${edge.type}` : "";
        const label = edge.label
          ? `<text class="relation-label ${relationClass}" x="${(edge.x1 + edge.x2) / 2}" y="${((edge.y1 + edge.y2) / 2) - 8}">${escapeHtml(edge.label)}</text>`
          : "";
        return `<line class="${relationClass}" x1="${edge.x1}" y1="${edge.y1}" x2="${edge.x2}" y2="${edge.y2}" stroke-width="2" ${dash} />${label}`;
      })
      .join("");
    return `<svg class="relation-layer" width="100%" height="100%">${lines}</svg>`;
  }

  function normalizeTerm(value) {
    return String(value || "").trim().toLowerCase();
  }

  function searchableTerms(brick) {
    const source = [
      ...(Array.isArray(brick.keywords) ? brick.keywords : []),
      brick.title,
      brick.summary
    ].join(" ");
    return new Set(
      source
        .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, " ")
        .split(/\s+/)
        .map(normalizeTerm)
        .filter((item) => item.length >= 2)
    );
  }

  function semanticTagsForTerms(terms) {
    const hasAny = (values) => values.some((value) => terms.has(normalizeTerm(value)));
    const tags = [];
    if (hasAny(["场景化", "场景", "布景", "复古", "怀旧", "城市记忆"])) tags.push("场景复古");
    if (hasAny(["钩子", "黄金3秒", "反差", "留存"])) tags.push("开场钩子");
    if (hasAny(["产品力", "特写", "asmr", "质感"])) tags.push("产品质感");
    if (hasAny(["从众心理", "信任", "转化", "好评"])) tags.push("信任转化");
    if (hasAny(["cta", "行动", "下期预告", "总结"])) tags.push("行动收束");
    return tags;
  }

  function matchBrickTerms(a, b) {
    const aTerms = searchableTerms(a);
    const bTerms = searchableTerms(b);
    const shared = [...aTerms].filter((term) => bTerms.has(term));
    const semanticShared = semanticTagsForTerms(aTerms).filter((tag) => semanticTagsForTerms(bTerms).includes(tag));
    return [...new Set([...semanticShared, ...shared])].slice(0, 4);
  }

  function computeNebulaLinks(activeBrick) {
    return allWorkspaceBricks()
      .filter((candidate) => candidate.pageId !== state.activePageId)
      .map((candidate) => {
        const matches = matchBrickTerms(activeBrick, candidate);
        const sameOrigin =
          (activeBrick.originSegmentId || activeBrick.segmentId)
          && (activeBrick.originSegmentId || activeBrick.segmentId) === (candidate.originSegmentId || candidate.segmentId);
        const labels = sameOrigin ? ["同源积木", ...matches] : matches;
        return {
          ...candidate,
          labels: [...new Set(labels)].slice(0, 4),
          score: labels.length + (sameOrigin ? 2 : 0)
        };
      })
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => (b.score - a.score) || a.pageTitle.localeCompare(b.pageTitle, "zh-CN"))
      .slice(0, 3);
  }

  function computeBacklinks(brick) {
    const byPage = new Map();
    computeNebulaLinks(brick).forEach((link) => {
      if (!byPage.has(link.pageId)) {
        byPage.set(link.pageId, {
          pageId: link.pageId,
          pageTitle: link.pageTitle,
          labels: link.labels
        });
      }
    });
    return [...byPage.values()];
  }

  function computeRelations() {
    const relations = [];
    const relationItems = [];
    const edges = [];
    const nodes = activeWorkspace();
    const canvasSize = getCanvasSize();

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const sharedKeywords = a.keywords.filter((keyword) => b.keywords.includes(keyword));
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const sameRow = Math.abs(dy) <= ROW_TOLERANCE;
        const sameColumn = Math.abs(dx) <= COL_TOLERANCE;
        const adjacentVertical = sameColumn && Math.abs(Math.abs(dy) - ADJACENT_Y) <= ADJACENT_TOLERANCE;
        const aContainsB = isNodeInside(a, b);
        const bContainsA = isNodeInside(b, a);
        const premiseNode = state.prerequisiteSegmentId === a.segmentId ? a : (
          state.prerequisiteSegmentId === b.segmentId ? b : null
        );
        const targetNode = premiseNode === a ? b : a;
        let edgeType = "";
        let strong = false;

        if (premiseNode && isConditionalPair(premiseNode, targetNode)) {
          const text = `条件关系：前提「${premiseNode.title}」-> 后续「${targetNode.title}」`
            + `（${sharedKeywords.length ? `关键词：${sharedKeywords.join(" / ")}` : "按前置路径排列"}）。`;
          relations.push(text);
          relationItems.push({
            type: "conditional",
            sourceNodeId: premiseNode.instanceId,
            targetNodeId: targetNode.instanceId
          });
          edgeType = "conditional";
          strong = true;
        } else if (aContainsB || bContainsA) {
          const parent = aContainsB ? a : b;
          const child = aContainsB ? b : a;
          const text = `从属关系：${child.title} 从属于 ${parent.title}（积木嵌入）。`;
          relations.push(text);
          relationItems.push({
            type: "subordinate",
            sourceNodeId: child.instanceId,
            targetNodeId: parent.instanceId
          });
          edgeType = "subordinate";
          strong = true;
        } else if (adjacentVertical) {
          const top = a.y <= b.y ? a : b;
          const bottom = top === a ? b : a;
          const text = `递进关系：${top.title} -> ${bottom.title}`
            + `（同列上下相邻${sharedKeywords.length ? `，关键词：${sharedKeywords.join(" / ")}` : ""}）。`;
          relations.push(text);
          relationItems.push({
            type: "progressive",
            sourceNodeId: top.instanceId,
            targetNodeId: bottom.instanceId
          });
          edgeType = "progressive";
          strong = true;
        } else if (sameRow) {
          const text = `并列关系：${a.title} 与 ${b.title} 位于同行`
            + `${sharedKeywords.length ? `（共享关键词：${sharedKeywords.join(" / ")}）` : ""}。`;
          relations.push(text);
          relationItems.push({
            type: "parallel",
            sourceNodeId: a.instanceId,
            targetNodeId: b.instanceId
          });
          edgeType = "parallel";
        }

        edges.push({
          x1: a.x + NODE_WIDTH / 2,
          y1: a.y + NODE_HEIGHT / 2,
          x2: b.x + NODE_WIDTH / 2,
          y2: b.y + NODE_HEIGHT / 2,
          type: edgeType,
          strong
        });
      }
    }

    nodes.forEach((node, index) => {
      computeNebulaLinks(node).forEach((link, linkIndex) => {
        const labels = link.labels.length ? link.labels.join(" / ") : "语义相近";
        relations.push(`知识星团：${node.title} 与「${link.pageTitle}」共享：${labels}。`);
        relationItems.push({
          type: "nebula",
          sourceNodeId: node.instanceId,
          targetNodeId: `nebula:${link.pageId}:${link.instanceId}`
        });
        edges.push({
          x1: node.x + NODE_WIDTH / 2,
          y1: node.y + NODE_HEIGHT / 2,
          x2: Math.min(canvasSize.width - 18, node.x + NODE_WIDTH + 96 + (linkIndex * 18)),
          y2: Math.max(22, Math.min(canvasSize.height - 22, node.y + 24 + (linkIndex * 24))),
          type: "nebula",
          strong: false,
          label: `与「${link.pageTitle}」共享：${labels}`
        });
      });
    });

    return { relations, relationItems, edges };
  }

  function renderGeneratedNote() {
    if (!state.generatedNote) return "";
    const note = normalizeGeneratedNote(state.generatedNote);
    const selectedMode = normalizeSummaryMode(state.summaryViewMode || note.mode);
    const modeMeta = SUMMARY_MODES[selectedMode];

    return `
      <section class="generated-note" id="generatedNoteSection">
        <div class="note-glow" aria-hidden="true"></div>
        <div class="note-header">
          <div>
            ${icon("wand", 20)}
            <h2>${escapeHtml(note.title)}</h2>
          </div>
          <button class="save-note-button" type="button" id="saveNote">
            ${icon("download", 12)}
            <span>保存至笔记页</span>
          </button>
        </div>

        <div class="summary-mode-meta">
          <span>${icon(modeMeta.icon, 14)} AI 推荐：${escapeHtml(modeMeta.label)}</span>
          <p>${escapeHtml(note.modeReason)}</p>
        </div>

        <div class="summary-mode-switch" role="group" aria-label="切换总结视图">
          ${SUMMARY_MODE_ORDER.map((mode) => `
            <button class="${selectedMode === mode ? "is-active" : ""}" type="button" data-summary-mode="${mode}">
              ${icon(SUMMARY_MODES[mode].icon, 14)}
              <span>${escapeHtml(SUMMARY_MODES[mode].label)}</span>
            </button>
          `).join("")}
        </div>

        <p class="core-quote">"${escapeHtml(note.core)}"</p>

        ${renderGeneratedNoteView(note, selectedMode)}

        <div class="action-line">
          <span>行动建议：${escapeHtml(note.action)}</span>
        </div>
      </section>
    `;
  }

  function renderGeneratedNoteView(note, mode) {
    if (mode === "temporal_map") return renderTemporalMap(note.views.temporal_map);
    if (mode === "flowchart") return renderFlowchart(note.views.flowchart);
    return renderMindMap(note.views.mind_map);
  }

  function renderMindMap(view) {
    const branches = view.branches || [];
    const branchCount = Math.max(1, branches.length);
    return `
      <div class="mind-map-view summary-visual">
        <svg class="mind-map-lines" viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
          ${branches.map((_, index) => {
            const left = index % 2 === 0;
            const row = Math.floor(index / 2);
            const x2 = left ? 150 : 490;
            const y2 = branchCount <= 2 ? 180 + (index - 0.5) * 112 : 84 + row * 92;
            return `<path d="M320 180 C${left ? 250 : 390} 180 ${left ? 230 : 410} ${y2} ${x2} ${y2}"></path>`;
          }).join("")}
        </svg>
        <div class="mind-map-center">${escapeHtml(view.center || "视频结构")}</div>
        <div class="mind-map-branches">
          ${branches.map((branch, index) => `
            <article class="mind-branch ${index % 2 === 0 ? "is-left" : "is-right"}">
              <strong>${escapeHtml(branch.title)}</strong>
              <ul>
                ${(branch.children || []).map((child) => `<li>${escapeHtml(child)}</li>`).join("")}
              </ul>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderTemporalMap(view) {
    const stations = view.stations || [];
    return `
      <div class="temporal-map-view summary-visual">
        <div class="route-title">${icon("map", 14)} <span>${escapeHtml(view.routeTitle || "视频路线")}</span></div>
        <svg class="route-line" viewBox="0 0 700 140" preserveAspectRatio="none" aria-hidden="true">
          <path d="M28 102 C120 18 210 120 306 54 S510 20 672 92"></path>
        </svg>
        <div class="route-stations" style="--station-count:${Math.max(1, stations.length)}">
          ${stations.map((station, index) => `
            <article class="route-station" style="--station-index:${index}">
              <span class="station-pin">${index + 1}</span>
              <em>${escapeHtml(station.time)}</em>
              <strong>${escapeHtml(station.label)}</strong>
              <div class="station-tags">
                <span>${escapeHtml(station.place)}</span>
                <span>${escapeHtml(station.food)}</span>
              </div>
              <p>${escapeHtml(station.description)}</p>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderFlowchart(view) {
    const nodes = view.nodes || [];
    const edges = view.edges || [];
    const edgeByTarget = edges.reduce((acc, edge) => {
      acc[edge.to] = acc[edge.to] || [];
      acc[edge.to].push(edge.label || "继续");
      return acc;
    }, {});

    return `
      <div class="flowchart-view summary-visual">
        <div class="flowchart-nodes">
          ${nodes.map((node, index) => `
            <article class="flow-node is-${escapeHtml(node.type)}">
              ${index > 0 ? `<span class="flow-edge-label">${escapeHtml((edgeByTarget[node.id] || ["继续"]).join(" / "))}</span>` : ""}
              <strong>${escapeHtml(node.label)}</strong>
              <p>${escapeHtml(node.description)}</p>
            </article>
          `).join("")}
        </div>
        <div class="flow-edge-list">
          ${edges.map((edge) => `<span>${escapeHtml(edge.from)} → ${escapeHtml(edge.to)} · ${escapeHtml(edge.label || "继续")}</span>`).join("")}
        </div>
      </div>
    `;
  }

  function renderTimelineBars() {
    return Array.from({ length: 60 })
      .map((_, index) => {
        const ratio = index / 60;
        const segment = state.analysis.segments.find(
          (item) => (item.start / state.duration) <= ratio && (item.end / state.duration) > ratio
        );
        const height = Math.max(16, Math.round(((segment ? segment.intensity : 0.25) * 66) + ((index * 17) % 22)));
        const isActive = ratio < state.currentTime / state.duration;
        const color = segment ? (isActive ? segment.color : "rgba(255,255,255,0.22)") : "rgba(255,255,255,0.16)";
        return `<button class="wave-bar" type="button" data-ratio="${ratio}" style="height:${height}%;background:${color}" aria-label="跳转到 ${formatTime(ratio * state.duration)}"></button>`;
      })
      .join("");
  }

  function bindEvents() {
    const video = document.getElementById("mainVideo");
    const playToggle = document.getElementById("playToggle");
    const timeline = document.getElementById("timeline");
    const progressTrack = document.getElementById("progressTrack");
    const generateButton = document.getElementById("generateNote");
    const demoForm = document.getElementById("demoForm");
    const localVideo = document.getElementById("localVideo");
    const workbench = document.getElementById("workbench");
    const relationCanvas = document.getElementById("relationCanvas");
    const saveButton = document.getElementById("saveNote");
    const noteEditor = document.getElementById("noteEditor");
    const noteTitleInput = document.getElementById("noteTitleInput");

    video.loop = state.analysis.sourceType === "demo";
    video.currentTime = toVideoTime(state.currentTime);
    if (state.isPlaying) {
      video.play().catch(() => {
        state.isPlaying = false;
        syncChrome();
      });
    }

    video.addEventListener("click", togglePlayback);
    video.addEventListener("play", () => {
      state.isPlaying = true;
      syncChrome();
    });
    video.addEventListener("pause", () => {
      state.isPlaying = false;
      syncChrome();
    });
    video.addEventListener("loadedmetadata", () => {
      state.importStatus =
        state.analysis.sourceType === "link_video" || state.analysis.sourceType === "downloaded_url"
          ? "链接视频已载入，可播放并拖动积木生成笔记。"
          : state.analysis.importedUrl
            ? "链接已导入演示工作流，视频与积木笔记可播放。"
            : "视频已载入，可播放并拖动积木生成笔记。";
      state.importError = "";
      syncStatusOnly();
    });
    video.addEventListener("timeupdate", () => {
      state.currentTime = Math.min(state.duration, toAnalysisTime(video.currentTime || 0));
      syncChrome();
    });
    video.addEventListener("ended", () => {
      state.currentTime = state.duration;
      state.isPlaying = false;
      syncChrome();
    });
    video.addEventListener("error", () => {
      if (state.analysis.videoSrc !== window.MOCK_ANALYSIS.bricknote.videoSrc) {
        const fallback = clone(window.MOCK_ANALYSIS.bricknote);
        fallback.sourceLabel = state.analysis.sourceLabel || "链接演示";
        fallback.videoTitle = state.analysis.videoTitle || fallback.videoTitle;
        fallback.importedUrl = state.analysis.importedUrl || "";
        loadAnalysis(fallback, {
          status: "视频源不可直连，已切换为本地演示视频，积木笔记可继续使用。",
          keepCurrentTime: true
        });
        return;
      }

      state.importError = "本地演示视频加载失败，请改用“上传本地视频”。";
      syncStatusOnly();
    });

    playToggle.addEventListener("click", togglePlayback);
    timeline.addEventListener("click", (event) => {
      const rect = timeline.getBoundingClientRect();
      jumpTo(((event.clientX - rect.left) / rect.width) * state.duration);
    });
    progressTrack.addEventListener("click", (event) => {
      const rect = progressTrack.getBoundingClientRect();
      jumpTo(((event.clientX - rect.left) / rect.width) * state.duration);
    });

    generateButton.addEventListener("click", generateNote);
    demoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleDouyinImport();
    });
    localVideo.addEventListener("change", handleLocalVideo);
    if (saveButton) saveButton.addEventListener("click", saveToSidebar);
    document.querySelectorAll("[data-summary-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.summaryViewMode = normalizeSummaryMode(button.dataset.summaryMode);
        render();
        document.getElementById("generatedNoteSection")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
    bindNoteEditor(noteEditor, noteTitleInput);
    bindSidebarResize();

    document.getElementById("toggleSidebar").addEventListener("click", () => {
      state.isSidebarOpen = !state.isSidebarOpen;
      render();
    });

    document.getElementById("closeSidebar").addEventListener("click", () => {
      state.isSidebarOpen = false;
      render();
    });

    document.querySelectorAll("[data-folder]").forEach((button) => {
      button.addEventListener("click", () => {
        state.folders = state.folders.map((folder) =>
          folder.id === button.dataset.folder ? { ...folder, isOpen: !folder.isOpen } : folder
        );
        render();
      });
    });

    document.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activePageId = button.dataset.page;
        state.generatedNote = null;
        state.prerequisiteSegmentId = "";
        state.relationSignatures = new Set();
        render();
      });

      button.addEventListener("dragover", (event) => {
        if (!state.dragging || state.dragging.type !== "workspace" || button.dataset.page === state.activePageId) return;
        event.preventDefault();
        button.classList.add("is-drop-target");
        if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
      });

      button.addEventListener("dragleave", () => {
        button.classList.remove("is-drop-target");
      });

      button.addEventListener("drop", (event) => {
        event.preventDefault();
        button.classList.remove("is-drop-target");
        let payload = state.dragging;
        try {
          payload = JSON.parse(event.dataTransfer.getData("text/plain")) || payload;
        } catch (error) {
          payload = state.dragging;
        }
        copyBrickToPage(Number(payload && (payload.instanceId || payload.id)), button.dataset.page);
      });
    });

    document.querySelectorAll("[data-new-page]").forEach((button) => {
      button.addEventListener("click", () => {
        const page = { id: String(Date.now()), title: "未命名笔记" };
        state.folders = state.folders.map((folder) =>
          folder.id === button.dataset.newPage ? { ...folder, isOpen: true, pages: [page, ...folder.pages] } : folder
        );
        state.activePageId = page.id;
        state.notesByPage[page.id] = "";
        state.workspacesByPage[page.id] = [];
        state.generatedNote = null;
        state.prerequisiteSegmentId = "";
        render();
      });
    });

    document.querySelectorAll("[data-seek]").forEach((button) => {
      button.addEventListener("click", () => jumpTo(Number(button.dataset.seek)));
    });

    document.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        const removed = activeWorkspace().find((item) => item.instanceId === Number(button.dataset.delete));
        setActiveWorkspace(activeWorkspace().filter((item) => item.instanceId !== Number(button.dataset.delete)));
        if (removed && removed.segmentId === state.prerequisiteSegmentId) {
          state.prerequisiteSegmentId = "";
        }
        state.generatedNote = null;
        render();
      });
    });

    document.querySelectorAll("[data-library-id]").forEach((brick) => {
      brick.addEventListener("click", () => addBrickToWorkspace(brick.dataset.libraryId));
      brick.addEventListener("dragstart", (event) => {
        state.dragging = { type: "library", segmentId: brick.dataset.libraryId };
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("text/plain", JSON.stringify({ origin: "library", segmentId: brick.dataset.libraryId }));
      });
      brick.addEventListener("dragend", () => {
        state.dragging = null;
      });
    });

    relationCanvas.addEventListener("dragover", (event) => {
      if (state.dragging) {
        event.preventDefault();
        workbench.classList.add("is-hovered");
        relationCanvas.classList.add("is-over");
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = state.dragging.type === "workspace" ? "move" : "copy";
        }
      }
    });
    relationCanvas.addEventListener("dragleave", (event) => {
      if (event.currentTarget.contains(event.relatedTarget)) return;
      workbench.classList.remove("is-hovered");
      relationCanvas.classList.remove("is-over");
    });
    relationCanvas.addEventListener("drop", (event) => {
      event.preventDefault();
      workbench.classList.remove("is-hovered");
      relationCanvas.classList.remove("is-over");
      const rect = relationCanvas.getBoundingClientRect();
      const dropX = event.clientX - rect.left;
      const dropY = event.clientY - rect.top;
      handleCanvasDrop(event, dropX, dropY);
    });

    bindWorkspaceDrag();
  }

  function bindWorkspaceDrag() {
    document.querySelectorAll(".canvas-block").forEach((block) => {
      block.addEventListener("dragstart", (event) => {
        state.dragging = { type: "workspace", id: Number(block.dataset.workspaceId), pageId: state.activePageId };
        block.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "copyMove";
        event.dataTransfer.setData("text/plain", JSON.stringify({
          origin: "workspace",
          instanceId: Number(block.dataset.workspaceId),
          segmentId: block.dataset.segmentId,
          pageId: state.activePageId
        }));
      });

      block.addEventListener("dragend", () => {
        state.dragging = null;
        block.classList.remove("is-dragging");
      });

      block.addEventListener("dblclick", () => {
        const segmentId = block.dataset.segmentId;
        state.prerequisiteSegmentId = state.prerequisiteSegmentId === segmentId ? "" : segmentId;
        state.generatedNote = null;
        render();
      });
    });
  }

  function bindNoteEditor(noteEditor, noteTitleInput) {
    if (noteEditor) {
      noteEditor.addEventListener("input", () => {
        state.notesByPage[state.activePageId] = noteEditor.value;
        const charCount = document.getElementById("noteCharCount");
        const saveState = document.getElementById("noteSaveState");
        if (charCount) charCount.textContent = `${noteEditor.value.length} 字`;
        if (saveState) saveState.textContent = "已保存";
      });
    }

    if (noteTitleInput) {
      noteTitleInput.addEventListener("input", () => {
        const nextTitle = noteTitleInput.value.trim() || "未命名笔记";
        state.folders = state.folders.map((folder) => ({
          ...folder,
          pages: folder.pages.map((page) =>
            page.id === state.activePageId ? { ...page, title: nextTitle } : page
          )
        }));
        setActiveWorkspace(activeWorkspace().map((brick) => ({ ...brick, sourcePageTitle: nextTitle })));
        const title = document.querySelector(".nav-left h1");
        const activePageLabel = document.querySelector(".page-row.is-active span");
        if (title) title.textContent = `当前编辑：${nextTitle}`;
        if (activePageLabel) activePageLabel.textContent = nextTitle;
      });
    }
  }

  function bindSidebarResize() {
    const handle = document.getElementById("sidebarResizer");
    const sidebar = document.querySelector(".sidebar");
    if (!handle || !sidebar) return;

    handle.addEventListener("pointerdown", (event) => {
      if (!state.isSidebarOpen) return;
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      document.body.classList.add("is-resizing-sidebar");

      const onMove = (moveEvent) => {
        const nextWidth = Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, moveEvent.clientX));
        state.sidebarWidth = nextWidth;
        sidebar.style.setProperty("--sidebar-width", `${nextWidth}px`);
      };

      const onEnd = () => {
        document.body.classList.remove("is-resizing-sidebar");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    });
  }

  function handleCanvasDrop(event, dropX, dropY) {
    let payload = state.dragging || null;
    try {
      payload = JSON.parse(event.dataTransfer.getData("text/plain")) || payload;
    } catch (error) {
      payload = state.dragging || null;
    }

    if (!payload) return;
    const instanceId = Number(payload.instanceId || payload.id);
    const segmentId = payload.segmentId;
    const clamped = clampNodePosition(dropX - NODE_WIDTH / 2, dropY - NODE_HEIGHT / 2);

    if ((payload.origin === "workspace" || payload.type === "workspace") && instanceId) {
      setActiveWorkspace(activeWorkspace().map((item) =>
        item.instanceId === instanceId ? { ...item, x: clamped.x, y: clamped.y } : item
      ));
    } else {
      addBrickToWorkspace(segmentId, clamped.x, clamped.y);
      return;
    }

    state.generatedNote = null;
    render();
  }

  function addBrickToWorkspace(segmentId, x, y) {
    if (!segmentId || workspaceHas(segmentId)) return;
    const segment = state.analysis.segments.find((item) => item.id === segmentId);
    if (!segment) return;
    const position = typeof x === "number" && typeof y === "number" ? clampNodePosition(x, y) : nextAutoPosition();
    setActiveWorkspace([...activeWorkspace(), {
      ...segment,
      segmentId: segment.id,
      originSegmentId: segment.id,
      sourcePageId: state.activePageId,
      sourcePageTitle: activePageTitle(),
      copiedFromInstanceId: null,
      instanceId: Date.now() + Math.floor(Math.random() * 1000),
      x: position.x,
      y: position.y
    }]);
    state.generatedNote = null;
    render();
  }

  function copyBrickToPage(instanceId, targetPageId) {
    if (!instanceId || !targetPageId || targetPageId === state.activePageId) return;
    const sourceBrick = activeWorkspace().find((item) => item.instanceId === instanceId);
    if (!sourceBrick) return;

    const targetWorkspace = state.workspacesByPage[targetPageId] || [];
    const originId = sourceBrick.originSegmentId || sourceBrick.segmentId;
    if (targetWorkspace.some((item) => (item.originSegmentId || item.segmentId) === originId)) return;

    const index = targetWorkspace.length;
    const columns = 3;
    const position = {
      x: 18 + (index % columns) * (NODE_WIDTH + 28),
      y: 18 + Math.floor(index / columns) * (NODE_HEIGHT + 28)
    };

    state.workspacesByPage[targetPageId] = [
      ...targetWorkspace,
      {
        ...sourceBrick,
        instanceId: Date.now() + Math.floor(Math.random() * 1000),
        copiedFromInstanceId: sourceBrick.instanceId,
        sourcePageId: targetPageId,
        sourcePageTitle: pageTitleById(targetPageId),
        x: position.x,
        y: position.y
      }
    ];
    render();
  }

  function reorderWorkspace(draggedId, targetId, placement) {
    if (!draggedId || !targetId || draggedId === targetId) return;
    const dragged = activeWorkspace().find((item) => item.instanceId === draggedId);
    if (!dragged) return;

    const next = activeWorkspace().filter((item) => item.instanceId !== draggedId);
    const targetIndex = next.findIndex((item) => item.instanceId === targetId);
    const insertIndex = placement === "after" ? targetIndex + 1 : targetIndex;
    next.splice(insertIndex, 0, dragged);
    setActiveWorkspace(next);
    state.generatedNote = null;
    render();
  }

  function togglePlayback() {
    const video = document.getElementById("mainVideo");
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  async function handleDouyinImport() {
    const input = document.getElementById("douyinUrl");
    const rawUrl = input ? input.value.trim() : "";
    const analysis = clone(window.MOCK_ANALYSIS.bricknote);
    const isDouyinLike = /douyin\.com|iesdouyin\.com|v\.douyin\.com/i.test(rawUrl);
    const isDirectVideo = isDirectVideoUrl(rawUrl);

    if (!rawUrl) {
      loadAnalysis(analysis, {
        status: "已进入演示模式：使用本地视频和 mock 分析结果。"
      });
      return;
    }

    if (canUseImportApi()) {
      state.isImporting = true;
      state.importError = "";
      state.importStatus = isDouyinLike ? "正在请求后端解析抖音链接..." : "正在下载链接视频到本地...";
      render();

      try {
        const result = await importUrlThroughBackend(rawUrl);
        const importedAnalysis = clone(window.MOCK_ANALYSIS.bricknote);
        importedAnalysis.sourceType = result.sourceType;
        importedAnalysis.sourceLabel = result.sourceLabel;
        importedAnalysis.videoTitle = result.videoTitle || "链接视频积木笔记";
        importedAnalysis.videoSrc = result.videoSrc;
        importedAnalysis.importedUrl = rawUrl;
        loadAnalysis(importedAnalysis, {
          status: result.status || "链接视频已导入，正在请求后端分析。"
        });

        try {
          state.isImporting = true;
          state.importStatus = "链接视频已导入，正在请求后端分析内容...";
          syncStatusOnly();
          const analyzed = await analyzeVideoSrcThroughBackend(result.videoSrc, importedAnalysis.videoTitle);
          loadAnalysis({ ...importedAnalysis, ...analyzed }, {
            status:
              analyzed.backendSource === "endpoint"
                ? "后端视频分析完成，积木片段已更新。"
                : "未配置 QWEN_API_KEY，已使用后端 mock 分析结果。"
          });
        } catch (analysisError) {
          state.isImporting = false;
          state.importStatus = `链接视频已导入，但后端分析未完成：${analysisError.message} 已保留演示积木。`;
          syncStatusOnly();
        }
      } catch (error) {
        state.isImporting = false;
        state.importError = error.message;
        state.importStatus = "";
        render();
      }
      return;
    }

    if (isDirectVideo) {
      analysis.sourceType = "link_video";
      analysis.sourceLabel = "视频直链导入";
      analysis.videoTitle = "链接视频积木笔记";
      analysis.videoSrc = rawUrl;
      analysis.importedUrl = rawUrl;
      loadAnalysis(analysis, {
        status: "已使用视频直链作为播放器源，正在套用积木分析结果。"
      });
      return;
    }

    analysis.sourceLabel = rawUrl
      ? isDouyinLike
        ? "抖音链接演示"
        : "链接演示导入"
      : "抖音演示导入";
    analysis.importedUrl = rawUrl;

    loadAnalysis(analysis, {
      status: rawUrl
        ? isDouyinLike
          ? "请用本地服务打开页面后再导入抖音链接，或先下载视频后点“上传本地视频”。"
          : "这个链接不是可直连视频文件；用本地服务打开页面后可尝试后端下载。"
        : "已进入抖音演示模式：使用本地视频和 mock 分析结果。"
    });
  }

  function canUseImportApi() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }

  async function importUrlThroughBackend(url) {
    const response = await fetch("/api/import-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "链接导入失败。");
    }

    return payload;
  }

  function isDirectVideoUrl(url) {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(parsed.pathname + parsed.search);
    } catch (error) {
      return false;
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }
        reject(new Error("视频文件读取失败。"));
      };
      reader.onerror = () => reject(new Error("视频文件读取失败。"));
      reader.readAsDataURL(file);
    });
  }

  function readVideoDurationFromSrc(src) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.onloadedmetadata = () => {
        resolve(video.duration && Number.isFinite(video.duration) ? video.duration : 180);
      };
      video.onerror = () => resolve(180);
      video.src = src;
    });
  }

  async function postJson(endpoint, body) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "后端请求失败。");
    }

    return payload;
  }

  function normalizeBackendSegment(segment, index, duration) {
    const start = Math.max(0, Number(segment.start ?? segment.startTime ?? 0));
    const end = Math.max(start + 1, Number(segment.end ?? segment.endTime ?? Math.min(duration, start + 30)));
    const fallbackKeywords = String(`${segment.title || ""} ${segment.summary || ""}`)
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ")
      .split(/\s+/)
      .filter((item) => item.length >= 2)
      .slice(0, 3);

    return {
      id: segment.id || `seg-${String(index + 1).padStart(3, "0")}`,
      start,
      end,
      title: segment.title || `片段 ${index + 1}`,
      type: segment.type || `topic-${index + 1}`,
      shotType: normalizeShotTheme(segment.shotType || segment.shotTheme || segment.shotCategory || segment.visualType)
        || inferShotTheme(segment),
      color: segment.color || ["#e2e8f0", "#fca5a5", "#93c5fd", "#d8b4fe", "#86efac", "#fde68a"][index % 6],
      intensity: Math.min(0.95, Math.max(0.45, Number(segment.intensity || 0.62))),
      summary: segment.summary || "暂无概括",
      keywords: Array.isArray(segment.keywords) && segment.keywords.length ? segment.keywords : (fallbackKeywords.length ? fallbackKeywords : ["重点"])
    };
  }

  function buildAnalysisFromBackend(payload, baseAnalysis, options) {
    const nextOptions = options || {};
    const duration = Math.max(1, Math.round(Number(payload.duration || nextOptions.duration || baseAnalysis.duration || 180)));
    const segments = Array.isArray(payload.segments)
      ? payload.segments.map((segment, index) => normalizeBackendSegment(segment, index, duration))
      : [];

    return {
      ...baseAnalysis,
      videoSrc: payload.videoSrc || baseAnalysis.videoSrc,
      sourceType: payload.sourceType || baseAnalysis.sourceType,
      sourceLabel: payload.sourceLabel || baseAnalysis.sourceLabel,
      videoTitle: payload.videoTitle || baseAnalysis.videoTitle,
      duration,
      segments: segments.length ? segments : baseAnalysis.segments,
      coreIdea: payload.summary || baseAnalysis.coreIdea,
      backendSource: payload.source || "mock"
    };
  }

  async function analyzeVideoDataUrlThroughBackend(fileName, videoDataUrl, duration, baseAnalysis) {
    if (dataUrlByteSize(videoDataUrl) > MAX_ANALYSIS_UPLOAD_BYTES) {
      throw new Error("当前后端直传识别上限为 25MB，请压缩视频后重试。");
    }

    const result = await postJson("/api/analyze-video", {
      fileName,
      duration,
      videoDataUrl
    });

    return buildAnalysisFromBackend(result, baseAnalysis, { duration });
  }

  function dataUrlByteSize(dataUrl) {
    const value = String(dataUrl || "");
    const comma = value.indexOf(",");
    const base64 = comma >= 0 ? value.slice(comma + 1) : value;
    return Math.floor((base64.length * 3) / 4);
  }

  async function analyzeFileThroughBackend(file, objectUrl, baseAnalysis) {
    if (file.size > MAX_ANALYSIS_UPLOAD_BYTES) {
      throw new Error("当前后端直传识别上限为 25MB，请压缩视频后重试。");
    }

    const duration = await readVideoDurationFromSrc(objectUrl);
    const videoDataUrl = await fileToDataUrl(file);
    return analyzeVideoDataUrlThroughBackend(file.name, videoDataUrl, duration, baseAnalysis);
  }

  async function uploadLocalVideoThroughBackend(file, baseAnalysis) {
    const response = await fetch("/api/upload-video", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-File-Name": encodeURIComponent(file.name)
      },
      body: file
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || "后端上传分析失败。");
    }

    return buildAnalysisFromBackend(payload, baseAnalysis, { duration: payload.duration });
  }

  async function analyzeVideoSrcThroughBackend(videoSrc, fileName) {
    const response = await fetch(videoSrc);
    if (!response.ok) {
      throw new Error(`无法读取导入视频：HTTP ${response.status}`);
    }

    const blob = await response.blob();
    if (blob.size > MAX_ANALYSIS_UPLOAD_BYTES) {
      throw new Error("视频超过 25MB，当前仅完成导入播放，未做后端识别。");
    }

    const dataUrl = await fileToDataUrl(blob);
    const duration = await readVideoDurationFromSrc(videoSrc);
    const baseAnalysis = clone(window.MOCK_ANALYSIS.bricknote);
    baseAnalysis.videoSrc = videoSrc;
    baseAnalysis.videoTitle = fileName;
    return analyzeVideoDataUrlThroughBackend(fileName, dataUrl, duration, baseAnalysis);
  }

  function jumpTo(time) {
    const video = document.getElementById("mainVideo");
    state.currentTime = Math.min(state.duration, Math.max(0, time));
    if (video) {
      video.currentTime = toVideoTime(state.currentTime);
      video.play().catch(() => {});
    }
    state.isPlaying = true;
    syncChrome();
  }

  async function generateNote() {
    if (activeWorkspace().length === 0) return;
    state.isGenerating = true;
    render();

    try {
      const relationResult = computeRelations();
      const result = await postJson("/api/generate-summary", {
        fileName: state.analysis.videoTitle,
        summary: state.analysisSummary,
        segments: getSpatialWorkspace(),
        relations: relationResult.relations
      });

      state.generatedNote = normalizeGeneratedNote(result.note || buildFallbackStructuredNote());
      state.summaryViewMode = state.generatedNote.mode;
    } catch (error) {
      const fallback = buildFallbackStructuredNote();
      fallback.action = `${fallback.action} 后端总结暂不可用：${error.message}`;
      state.generatedNote = normalizeGeneratedNote(fallback);
      state.summaryViewMode = state.generatedNote.mode;
    } finally {
      state.isGenerating = false;
      render();
      document.getElementById("generatedNoteSection")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function buildFallbackGeneratedNote() {
    return buildFallbackStructuredNote();
  }

  function saveToSidebar() {
    if (!state.generatedNote) return;
    const note = normalizeGeneratedNote(state.generatedNote);
    const newPage = { id: String(Date.now()), title: note.title };
    state.folders = state.folders.map((folder, index) =>
      index === 0 ? { ...folder, isOpen: true, pages: [newPage, ...folder.pages] } : folder
    );
    state.activePageId = newPage.id;
    state.notesByPage[newPage.id] = generatedNoteMarkdown(note, state.summaryViewMode || note.mode);
    state.workspacesByPage[newPage.id] = [];
    state.summaryViewMode = "";
    render();
  }

  async function handleLocalVideo(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (state.localObjectUrl) {
      URL.revokeObjectURL(state.localObjectUrl);
    }

    state.localObjectUrl = URL.createObjectURL(file);
    const analysis = clone(window.MOCK_ANALYSIS.local);
    const localDuration = await readVideoDurationFromSrc(state.localObjectUrl);
    analysis.videoSrc = state.localObjectUrl;
    analysis.sourceLabel = file.name;
    analysis.videoTitle = file.name.replace(/\.[^.]+$/, "") || "本地视频积木笔记";
    analysis.duration = Math.max(1, Math.round(localDuration));
    analysis.segments = [
      {
        id: "pending-analysis",
        start: 0,
        end: analysis.duration,
        title: "等待后端分析",
        type: "process",
        shotType: "talking",
        color: "#86efac",
        intensity: 0.5,
        summary: "视频已进入后端分析队列，完成后会替换为真实时间戳积木。",
        keywords: ["分析中", "后端", "时间戳"]
      }
    ];
    loadAnalysis(analysis, { status: "本地视频已载入，正在上传到后端分析内容。" });

    try {
      state.isImporting = true;
      const analyzed = await uploadLocalVideoThroughBackend(file, analysis);
      loadAnalysis({ ...analysis, ...analyzed }, {
        status:
          analyzed.backendSource === "endpoint"
            ? "后端视频分析完成，已按真实时间戳生成积木。"
            : "未配置 QWEN_API_KEY，已使用后端 mock 分析结果。"
      });
    } catch (error) {
      state.isImporting = false;
      state.importStatus = `本地视频已载入，但后端分析未完成：${error.message} 已保留本地播放。`;
      syncStatusOnly();
    }
  }

  function loadAnalysis(analysis, options) {
    const nextOptions = options || {};
    state.analysis = analysis;
    state.duration = analysis.duration;
    state.currentTime = nextOptions.keepCurrentTime ? state.currentTime : 0;
    state.isPlaying = false;
    setActiveWorkspace([]);
    state.prerequisiteSegmentId = "";
    state.relationSignatures = new Set();
    state.nodePulseUntil = {};
    state.generatedNote = null;
    state.isImporting = false;
    state.analysisSummary = analysis.coreIdea || state.analysisSummary || "";
    state.backendSource = analysis.backendSource || "mock";
    state.importStatus = nextOptions.status || "视频与积木笔记已载入。";
    state.importError = "";
    render();
  }

  function syncStatusOnly() {
    const status = document.querySelector(".import-status");
    if (!status) return;
    status.textContent = state.importError || state.importStatus;
    status.classList.toggle("is-error", Boolean(state.importError));
  }

  function syncChrome() {
    const active = activeSegment();
    const progress = Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100));
    const playToggle = document.getElementById("playToggle");
    const timeLabel = document.querySelector(".time-label");
    const activePill = document.querySelector(".active-pill");
    const playhead = document.querySelector(".playhead");
    const progressFill = document.querySelector(".progress-track span");

    if (playToggle) {
      playToggle.innerHTML = state.isPlaying ? icon("pause", 22) : icon("play", 22);
      playToggle.setAttribute("aria-label", state.isPlaying ? "暂停" : "播放");
    }

    if (timeLabel) timeLabel.textContent = `${formatTime(state.currentTime)} / ${formatTime(state.duration)}`;
    if (activePill) {
      activePill.textContent = active.title;
      activePill.style.setProperty("--pill-color", active.color);
    }
    if (playhead) playhead.style.left = `${progress}%`;
    if (progressFill) progressFill.style.width = `${progress}%`;

    document.querySelectorAll(".wave-bar").forEach((bar, index) => {
      const ratio = index / 60;
      const segment = state.analysis.segments.find(
        (item) => (item.start / state.duration) <= ratio && (item.end / state.duration) > ratio
      );
      const isActive = ratio < state.currentTime / state.duration;
      bar.style.background = segment
        ? isActive
          ? segment.color
          : "rgba(255,255,255,0.22)"
        : "rgba(255,255,255,0.16)";
    });
  }

  render({ preserveScroll: false });
})();
