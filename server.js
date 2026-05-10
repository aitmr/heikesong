const { createWriteStream, existsSync, mkdirSync, readFileSync, statSync, unlinkSync } = require("fs");
const { execFile } = require("child_process");
const { createServer } = require("http");
const { extname, join, normalize, relative } = require("path");
const { pipeline } = require("stream/promises");
const { Readable } = require("stream");
const { promisify } = require("util");
const { URL } = require("url");

const rootDir = __dirname;
const importsDir = join(rootDir, "assets", "imports");
const port = Number(process.env.PORT || 4287);
const maxDownloadBytes = 300 * 1024 * 1024;
const maxUploadBytes = 500 * 1024 * 1024;
const maxAnalysisVideoBytes = 25 * 1024 * 1024;
const maxJsonBodyBytes = 40 * 1024 * 1024;
const qwenApiKey = process.env.QWEN_API_KEY || process.env.DASHSCOPE_API_KEY || process.env.VITE_QWEN_API_KEY || "";
const qwenBaseUrl =
  process.env.QWEN_BASE_URL || process.env.DASHSCOPE_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1";
const qwenAnalyzeModel = process.env.QWEN_ANALYZE_MODEL || "qwen3.5-plus";
const qwenSummaryModel = process.env.QWEN_SUMMARY_MODEL || qwenAnalyzeModel;
const segmentColors = ["#e2e8f0", "#fca5a5", "#93c5fd", "#d8b4fe", "#86efac", "#fde68a", "#c4b5fd", "#67e8f9"];
const segmentTypeColors = {
  intro: "#e2e8f0",
  scene: "#fca5a5",
  process: "#86efac",
  key_point: "#93c5fd",
  product: "#67e8f9",
  conflict: "#fde68a",
  conversion: "#c4b5fd",
  outro: "#d8b4fe"
};
const execFileAsync = promisify(execFile);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function isDirectVideoPath(url) {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url.pathname + url.search);
}

function isDouyinUrl(url) {
  return /(^|\.)douyin\.com$/i.test(url.hostname) || /(^|\.)iesdouyin\.com$/i.test(url.hostname);
}

function extensionFromContentType(contentType) {
  if (!contentType) return ".mp4";
  if (contentType.includes("webm")) return ".webm";
  if (contentType.includes("quicktime")) return ".mov";
  return ".mp4";
}

function safeFileStem(fileName) {
  return String(fileName || "video")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "video";
}

function extensionFromFileName(fileName, contentType) {
  const ext = extname(String(fileName || "")).toLowerCase();
  if (/\.(mp4|webm|mov|m4v)$/i.test(ext)) return ext;
  return extensionFromContentType(contentType || "");
}

function contentTypeFromExtension(ext) {
  return mimeTypes[String(ext || "").toLowerCase()] || "video/mp4";
}

async function readJsonBody(request, maxBytes = 1024 * 1024) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > maxBytes) {
      throw new Error("Request body is too large.");
    }
  }
  return JSON.parse(body || "{}");
}

async function getVideoDuration(filePath) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath
    ]);
    const duration = Number(String(stdout || "").trim());
    return Number.isFinite(duration) && duration > 0 ? duration : 180;
  } catch (error) {
    return 180;
  }
}

async function compressForAnalysis(sourcePath) {
  if (statSync(sourcePath).size <= maxAnalysisVideoBytes) {
    return sourcePath;
  }

  const profiles = [
    { scale: "720:-2", crf: "34", audio: "48k" },
    { scale: "540:-2", crf: "36", audio: "40k" },
    { scale: "432:-2", crf: "38", audio: "32k" }
  ];

  let lastOutput = "";
  for (const profile of profiles) {
    const outputPath = join(importsDir, `analysis-${Date.now()}-${profile.scale.split(":")[0]}.mp4`);
    lastOutput = outputPath;
    await execFileAsync("ffmpeg", [
      "-y",
      "-i",
      sourcePath,
      "-vf",
      `scale=${profile.scale}`,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      profile.crf,
      "-c:a",
      "aac",
      "-b:a",
      profile.audio,
      "-movflags",
      "+faststart",
      outputPath
    ]);

    if (statSync(outputPath).size <= maxAnalysisVideoBytes) {
      return outputPath;
    }
  }

  throw new Error(
    `视频压缩后仍超过 ${Math.round(maxAnalysisVideoBytes / 1024 / 1024)}MB，最后文件：${lastOutput}`
  );
}

function formatSeconds(seconds) {
  const safeValue = Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
  const hours = Math.floor(safeValue / 3600);
  const minutes = Math.floor((safeValue % 3600) / 60);
  const secs = safeValue % 60;

  if (hours > 0) {
    return [hours, minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
  }

  return [minutes, secs].map((part) => String(part).padStart(2, "0")).join(":");
}

function buildSegmentPrompt(duration) {
  return [
    "你是一个视频内容分析助手。",
    "请完整理解用户上传的视频内容，并只输出严格合法的 JSON。",
    "不要输出 Markdown、不要输出解释、不要输出多余前后缀。",
    "返回 JSON 顶层必须只有两个字段：summary 和 segments。",
    "summary 是对整支视频的中文概括，控制在 2 到 4 句话。",
    "segments 是按时间顺序排列的数组，每项必须包含 id、startTime、endTime、title、summary、keywords、type、shotType。",
    "startTime 和 endTime 必须是数字，单位为秒。",
    "title 是每段的简短标题，summary 是该段的中文大意，keywords 是 2 到 4 个中文关键词。",
    "type 是这一段的内容分类，只能从 intro、scene、process、key_point、product、conflict、conversion、outro 中选择。",
    "shotType 是这一段的镜头形态，只能从 talking、closeup、broll 中选择；talking 表示人物口播/采访/对话，closeup 表示产品/手部/细节特写，broll 表示环境空镜/转场/建立镜头。",
    `视频时长约为 ${Math.max(1, Math.round(duration || 180))} 秒，请尽量覆盖完整视频并切分为 3 到 8 个关键片段。`,
    '输出示例：{"summary":"...","segments":[{"id":"seg-001","startTime":0,"endTime":32,"title":"开场","summary":"...","keywords":["钩子","场景"],"type":"intro","shotType":"talking"}]}'
  ].join("\n");
}

function buildSummaryPrompt() {
  return [
    "你是一个视频总结助手。",
    "请根据用户挑选并排列的视频片段，输出严格合法 JSON。",
    "返回 JSON 顶层必须只有四个字段：title、core、steps、action。",
    "title 是 12 字以内的中文标题。",
    "core 是一句核心观点。",
    "steps 是 3 到 6 条中文步骤，每条对应内容链路中的一个关键判断。",
    "action 是一句可执行建议。",
    "不要输出 Markdown、解释或多余前后缀。"
  ].join("\n");
}

function extractJsonString(rawText) {
  const trimmed = String(rawText || "").trim();

  if (trimmed.startsWith("```")) {
    const withoutFenceStart = trimmed.replace(/^```(?:json)?\s*/i, "");
    return withoutFenceStart.replace(/\s*```$/, "").trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function extractMessageText(response) {
  if (typeof response === "string") return response.trim();
  const content = response && response.choices && response.choices[0] && response.choices[0].message
    ? response.choices[0].message.content
    : "";

  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((item) => (item && item.text ? String(item.text).trim() : ""))
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
}

function dataUrlSize(dataUrl) {
  const value = String(dataUrl || "");
  const comma = value.indexOf(",");
  const base64 = comma >= 0 ? value.slice(comma + 1) : value;
  return Math.floor((base64.length * 3) / 4);
}

function keywordFallback(text) {
  const cleaned = String(text || "")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ")
    .split(/\s+/)
    .filter((item) => item && item.length >= 2);
  return [...new Set(cleaned)].slice(0, 3);
}

function normalizeShotType(value, segment) {
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

  const text = [
    segment && segment.type,
    segment && segment.title,
    segment && segment.summary,
    ...((segment && Array.isArray(segment.keywords)) ? segment.keywords : [])
  ].join(" ").toLowerCase();

  if (/特写|细节|质感|产品|菜品|手部|asmr|close|macro|detail/.test(text)) return "closeup";
  if (/场景|环境|空镜|布景|街景|夜景|城市|转场|氛围|broll|b-roll|establishing/.test(text)) return "broll";
  return "talking";
}

function normalizeSegment(segment, index, duration) {
  const start = Math.max(0, Number(segment.startTime ?? segment.start ?? 0));
  const fallbackEnd = Math.min(Math.max(start + 20, start + Math.floor((duration || 180) / 5)), duration || start + 30);
  const end = Math.max(start + 1, Number(segment.endTime ?? segment.end ?? fallbackEnd));
  const title = String(segment.title || `片段 ${index + 1}`).trim();
  const summary = String(segment.summary || "暂无概括").trim();
  const type = String(segment.type || `topic-${index + 1}`).trim();
  const keywords = Array.isArray(segment.keywords) && segment.keywords.length
    ? segment.keywords.map((item) => String(item).trim()).filter(Boolean).slice(0, 4)
    : keywordFallback(`${title} ${summary}`);

  return {
    id: segment.id || `seg-${String(index + 1).padStart(3, "0")}`,
    start,
    end,
    timeLabel: `${formatSeconds(start)} - ${formatSeconds(end)}`,
    title,
    type,
    shotType: normalizeShotType(segment.shotType || segment.shotTheme || segment.shotCategory || segment.visualType, {
      ...segment,
      title,
      summary,
      type,
      keywords
    }),
    color: segment.color || segmentTypeColors[type] || segmentColors[index % segmentColors.length],
    intensity: Math.min(0.95, Math.max(0.45, Number(segment.intensity || 0.56 + ((index * 13) % 36) / 100))),
    summary,
    keywords: keywords.length ? keywords : ["重点"]
  };
}

function parseAnalysisPayload(payload, duration) {
  const rawPayload = typeof payload === "string" ? JSON.parse(extractJsonString(payload)) : payload;
  const segments = Array.isArray(rawPayload.segments)
    ? rawPayload.segments.map((segment, index) => normalizeSegment(segment, index, duration))
    : [];

  return {
    summary: String(rawPayload.summary || "暂未返回视频总结。").trim(),
    segments,
    rawText: typeof payload === "string" ? payload : JSON.stringify(payload),
    source: "endpoint",
    duration
  };
}

function buildMockSegments(duration) {
  const safeDuration = Math.max(1, Math.round(duration || 180));
  const chunk = Math.max(1, Math.floor(safeDuration / 4));
  const blueprints = [
    { title: "开场引入", type: "intro", shotType: "talking", summary: "交代视频主题、场景背景与接下来要看的重点。", keywords: ["开场", "主题", "钩子"] },
    { title: "核心过程", type: "process", shotType: "broll", summary: "展示主要内容推进，给出关键步骤或事件展开。", keywords: ["过程", "步骤", "推进"] },
    { title: "重点信息", type: "key_point", shotType: "closeup", summary: "汇总中段最值得关注的信息、结论或变化。", keywords: ["重点", "信息", "变化"] },
    { title: "收束总结", type: "outro", shotType: "talking", summary: "对前文进行收束，形成整体结论与下一步提示。", keywords: ["总结", "结论", "行动"] }
  ];

  return blueprints.map((blueprint, index) => {
    const start = Math.min(index * chunk, safeDuration - 1);
    const end = index === blueprints.length - 1
      ? safeDuration
      : Math.min(safeDuration, Math.max(start + 1, (index + 1) * chunk));
    return normalizeSegment({ ...blueprint, start, end }, index, safeDuration);
  });
}

function buildMockAnalysis(fileName, duration) {
  const segments = buildMockSegments(duration);
  return {
    summary: `${fileName || "当前视频"} 已被整理为 ${segments.length} 个关键片段。当前未配置 QWEN_API_KEY，页面使用本地演示分析结果。`,
    segments,
    source: "mock",
    duration: Math.max(1, Math.round(duration || 180))
  };
}

function buildFallbackNote(fileName, segments, relations) {
  const sortedSegments = Array.isArray(segments) ? segments : [];
  return {
    title: "视频结构拆解",
    core: `${fileName || "当前视频"} 的内容可以按“${sortedSegments.map((item) => item.title).slice(0, 3).join("、") || "关键片段"}”这条链路理解。`,
    steps: sortedSegments.slice(0, 6).map((item) => item.summary || item.title || "整理一个关键片段。"),
    action:
      (Array.isArray(relations) && relations[0]
        ? `${relations[0]} `
        : "继续调整积木位置，明确并列、递进、从属或条件关系。") + "再把最强观点前置，形成一版可直接复用的笔记。"
  };
}

async function postQwenChat(payload, model) {
  const response = await fetch(`${qwenBaseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${qwenApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ model, ...payload })
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    data = text;
  }

  if (!response.ok) {
    const message = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`;
    throw new Error(`接口调用失败：${message}`);
  }

  return data;
}

async function handleImportUrl(request, response) {
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendJson(response, 400, { error: "请求格式不正确。" });
    return;
  }

  let sourceUrl;
  try {
    sourceUrl = new URL(String(payload.url || "").trim());
  } catch (error) {
    sendJson(response, 400, { error: "请输入有效的 http/https 链接。" });
    return;
  }

  if (!["http:", "https:"].includes(sourceUrl.protocol)) {
    sendJson(response, 400, { error: "只支持 http/https 链接。" });
    return;
  }

  if (isDouyinUrl(sourceUrl)) {
    sendJson(response, 422, {
      error:
        "抖音分享页不是视频直链。当前本地服务仅支持下载 mp4/webm/mov 直链；抖音解析需要接入后端解析器或第三方服务。"
    });
    return;
  }

  if (!existsSync(importsDir)) {
    mkdirSync(importsDir, { recursive: true });
  }

  let upstream;
  try {
    upstream = await fetch(sourceUrl, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"
      }
    });
  } catch (error) {
    sendJson(response, 502, { error: "无法连接到这个视频链接。" });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    sendJson(response, 502, { error: `视频链接下载失败：HTTP ${upstream.status}` });
    return;
  }

  const contentType = upstream.headers.get("content-type") || "";
  const contentLength = Number(upstream.headers.get("content-length") || 0);
  const looksLikeVideo = contentType.startsWith("video/") || isDirectVideoPath(sourceUrl);

  if (!looksLikeVideo) {
    sendJson(response, 415, { error: "这个链接不像可下载的视频文件，请使用 mp4/webm/mov 直链。" });
    return;
  }

  if (contentLength > maxDownloadBytes) {
    sendJson(response, 413, { error: "视频文件太大，请使用 300MB 以内的视频。" });
    return;
  }

  const ext = extname(sourceUrl.pathname).match(/\.(mp4|webm|mov|m4v)$/i)
    ? extname(sourceUrl.pathname)
    : extensionFromContentType(contentType);
  const fileName = `import-${Date.now()}${ext.toLowerCase()}`;
  const filePath = join(importsDir, fileName);

  try {
    await pipeline(Readable.fromWeb(upstream.body), createWriteStream(filePath));
  } catch (error) {
    sendJson(response, 500, { error: "视频保存失败。" });
    return;
  }

  sendJson(response, 200, {
    videoSrc: `assets/imports/${fileName}`,
    sourceType: "downloaded_url",
    sourceLabel: "链接下载导入",
    videoTitle: sourceUrl.hostname,
    status: "链接视频已下载到本地，可以播放并生成积木笔记。"
  });
}

async function handleAnalyzeVideo(request, response) {
  let payload;
  try {
    payload = await readJsonBody(request, maxJsonBodyBytes);
  } catch (error) {
    sendJson(response, 400, { error: "请求格式不正确，或视频数据过大。" });
    return;
  }

  const videoDataUrl = String(payload.videoDataUrl || "");
  const fileName = String(payload.fileName || "导入视频");
  const duration = Math.max(1, Math.round(Number(payload.duration || 180)));

  if (!videoDataUrl.startsWith("data:video/")) {
    sendJson(response, 400, { error: "请上传有效的视频文件。" });
    return;
  }

  if (dataUrlSize(videoDataUrl) > maxAnalysisVideoBytes) {
    sendJson(response, 413, {
      error: `当前后端直传识别上限为 ${Math.round(maxAnalysisVideoBytes / 1024 / 1024)}MB，请压缩视频后重试。`
    });
    return;
  }

  if (!qwenApiKey) {
    sendJson(response, 200, buildMockAnalysis(fileName, duration));
    return;
  }

  try {
    const result = await postQwenChat(
      {
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: "你是一个严谨的视频分析助手，必须严格按照用户要求输出内容。"
          },
          {
            role: "user",
            content: [
              {
                type: "video_url",
                video_url: {
                  url: videoDataUrl
                }
              },
              {
                type: "text",
                text: `${buildSegmentPrompt(duration)}\n\n请基于整段视频本身进行时间定位，不要仅根据局部画面猜测时间段。`
              }
            ]
          }
        ]
      },
      qwenAnalyzeModel
    );

    const analysis = parseAnalysisPayload(extractMessageText(result), duration);
    if (!analysis.segments.length) {
      throw new Error("接口没有返回有效分段。");
    }
    sendJson(response, 200, analysis);
  } catch (error) {
    sendJson(response, 502, { error: error.message || "视频识别失败，请稍后重试。" });
  }
}

async function analyzeVideoFile(filePath, fileName, duration) {
  if (!qwenApiKey) {
    return buildMockAnalysis(fileName, duration);
  }

  const analysisPath = await compressForAnalysis(filePath);
  const videoDataUrl = `data:video/mp4;base64,${readFileSync(analysisPath).toString("base64")}`;

  const result = await postQwenChat(
    {
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "你是一个严谨的视频分析助手，必须严格按照用户要求输出内容。"
        },
        {
          role: "user",
          content: [
            {
              type: "video_url",
              video_url: {
                url: videoDataUrl
              }
            },
            {
              type: "text",
              text: `${buildSegmentPrompt(duration)}\n\n请基于整段视频本身进行时间定位，不要仅根据局部画面猜测时间段。`
            }
          ]
        }
      ]
    },
    qwenAnalyzeModel
  );

  const analysis = parseAnalysisPayload(extractMessageText(result), duration);
  if (!analysis.segments.length) {
    throw new Error("接口没有返回有效分段。");
  }

  return analysis;
}

async function handleUploadVideo(request, response) {
  const contentLength = Number(request.headers["content-length"] || 0);
  const contentType = String(request.headers["content-type"] || "video/mp4");
  const headerFileName = request.headers["x-file-name"]
    ? decodeURIComponent(String(request.headers["x-file-name"]))
    : "local-video.mp4";

  if (!contentType.startsWith("video/") && contentType !== "application/octet-stream") {
    sendJson(response, 415, { error: "请上传视频文件。" });
    return;
  }

  if (contentLength > maxUploadBytes) {
    sendJson(response, 413, { error: "视频文件太大，请使用 500MB 以内的视频。" });
    return;
  }

  if (!existsSync(importsDir)) {
    mkdirSync(importsDir, { recursive: true });
  }

  const ext = extensionFromFileName(headerFileName, contentType);
  const fileStem = safeFileStem(headerFileName);
  const fileName = `${fileStem}-${Date.now()}${ext}`;
  const filePath = join(importsDir, fileName);

  try {
    await pipeline(request, createWriteStream(filePath));
  } catch (error) {
    sendJson(response, 500, { error: "视频上传保存失败。" });
    return;
  }

  const duration = Math.max(1, Math.round(await getVideoDuration(filePath)));

  try {
    const analysis = await analyzeVideoFile(filePath, headerFileName, duration);
    sendJson(response, 200, {
      ...analysis,
      videoSrc: `assets/imports/${fileName}`,
      sourceType: "local_upload",
      sourceLabel: headerFileName,
      videoTitle: safeFileStem(headerFileName),
      duration,
      status:
        analysis.source === "endpoint"
          ? "后端视频分析完成，积木片段已更新。"
          : "视频已上传；未配置 QWEN_API_KEY，已使用后端 mock 分析结果。"
    });
  } catch (error) {
    sendJson(response, 502, {
      videoSrc: `assets/imports/${fileName}`,
      sourceType: "local_upload",
      sourceLabel: headerFileName,
      videoTitle: safeFileStem(headerFileName),
      duration,
      error: error.message || "视频识别失败，请稍后重试。"
    });
  }
}

async function handleGenerateSummary(request, response) {
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendJson(response, 400, { error: "请求格式不正确。" });
    return;
  }

  const fileName = String(payload.fileName || "当前视频");
  const segments = Array.isArray(payload.segments) ? payload.segments : [];
  const relations = Array.isArray(payload.relations) ? payload.relations : [];

  if (!segments.length) {
    sendJson(response, 400, { error: "请先添加至少一个积木片段。" });
    return;
  }

  if (!qwenApiKey) {
    sendJson(response, 200, { note: buildFallbackNote(fileName, segments, relations), source: "mock" });
    return;
  }

  try {
    const result = await postQwenChat(
      {
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "你是一个视频总结助手，请输出自然、准确、可直接展示的中文总结。"
          },
          {
            role: "user",
            content: [
              buildSummaryPrompt(),
              "",
              `视频标题：${fileName}`,
              `积木片段：${JSON.stringify(segments, null, 2)}`,
              `识别到的关系：${JSON.stringify(relations, null, 2)}`
            ].join("\n")
          }
        ]
      },
      qwenSummaryModel
    );

    const rawNote = JSON.parse(extractJsonString(extractMessageText(result)));
    const note = {
      title: String(rawNote.title || "视频结构拆解").trim(),
      core: String(rawNote.core || "").trim(),
      steps: Array.isArray(rawNote.steps) ? rawNote.steps.map((item) => String(item).trim()).filter(Boolean) : [],
      action: String(rawNote.action || "").trim()
    };

    if (!note.core || !note.steps.length || !note.action) {
      throw new Error("接口没有返回有效总结。");
    }

    sendJson(response, 200, { note, source: "endpoint" });
  } catch (error) {
    sendJson(response, 502, { error: error.message || "总结生成失败，请稍后重试。" });
  }
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = normalize(join(rootDir, decodeURIComponent(pathname)));

  if (relative(rootDir, filePath).startsWith("..")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream"
  });
  require("fs").createReadStream(filePath).pipe(response);
}

const server = createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/import-url") {
    handleImportUrl(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/analyze-video") {
    handleAnalyzeVideo(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/upload-video") {
    handleUploadVideo(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/generate-summary") {
    handleGenerateSummary(request, response);
    return;
  }

  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`BrickNote running at http://localhost:${port}`);
});
