(function () {
  const TYPE_META = {
    code: { label: "代码演示", color: "#3b82f6" },
    talking_head: { label: "人物出镜", color: "#f97316" },
    slides: { label: "PPT / 文档", color: "#22c55e" },
    key_point: { label: "关键观点", color: "#a855f7" }
  };

  const state = {
    analysis: null,
    currentSegmentIndex: -1,
    localObjectUrl: null,
    timelineRect: null
  };

  const elements = {
    body: document.body,
    douyinForm: document.getElementById("douyinForm"),
    douyinUrl: document.getElementById("douyinUrl"),
    localVideo: document.getElementById("localVideo"),
    emptyState: document.getElementById("emptyState"),
    workbench: document.getElementById("workbench"),
    storyboardSection: document.getElementById("storyboardSection"),
    mainVideo: document.getElementById("mainVideo"),
    videoFallback: document.getElementById("videoFallback"),
    sourceLabel: document.getElementById("sourceLabel"),
    videoTitle: document.getElementById("videoTitle"),
    segmentCount: document.getElementById("segmentCount"),
    durationLabel: document.getElementById("durationLabel"),
    currentType: document.getElementById("currentType"),
    currentTitle: document.getElementById("currentTitle"),
    currentSummary: document.getElementById("currentSummary"),
    generateDescription: document.getElementById("generateDescription"),
    descriptionBox: document.getElementById("descriptionBox"),
    generatedDescription: document.getElementById("generatedDescription"),
    timelineLegend: document.getElementById("timelineLegend"),
    timelineCanvas: document.getElementById("xrayTimeline"),
    timelineTooltip: document.getElementById("timelineTooltip"),
    playhead: document.getElementById("playhead"),
    storyboardGrid: document.getElementById("storyboardGrid")
  };

  const ctx = elements.timelineCanvas.getContext("2d");

  function cloneAnalysis(source) {
    return JSON.parse(JSON.stringify(source));
  }

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const remainder = String(safeSeconds % 60).padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function getDuration() {
    if (!state.analysis) return 0;
    return elements.mainVideo.duration && Number.isFinite(elements.mainVideo.duration)
      ? elements.mainVideo.duration
      : state.analysis.duration;
  }

  function findSegmentAt(time) {
    if (!state.analysis) return null;
    return state.analysis.segments.find((segment) => time >= segment.start && time < segment.end)
      || state.analysis.segments[state.analysis.segments.length - 1];
  }

  function findSegmentIndexAt(time) {
    if (!state.analysis) return -1;
    const index = state.analysis.segments.findIndex(
      (segment) => time >= segment.start && time < segment.end
    );
    return index === -1 ? state.analysis.segments.length - 1 : index;
  }

  function sourceLoader() {
    elements.douyinForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const url = elements.douyinUrl.value.trim();
      if (!url) {
        elements.douyinUrl.focus();
        return;
      }

      const analysis = cloneAnalysis(window.MOCK_ANALYSIS.douyin);
      analysis.sourceLabel = "抖音演示导入";
      loadAnalysis(analysis, analysis.videoSrc);
    });

    elements.localVideo.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      if (state.localObjectUrl) {
        URL.revokeObjectURL(state.localObjectUrl);
      }

      state.localObjectUrl = URL.createObjectURL(file);
      const analysis = cloneAnalysis(window.MOCK_ANALYSIS.local);
      analysis.sourceLabel = file.name;
      analysis.videoTitle = file.name.replace(/\.[^.]+$/, "") || "本地视频分析 Demo";
      loadAnalysis(analysis, state.localObjectUrl);
    });
  }

  function loadAnalysis(analysis, videoSrc) {
    state.analysis = analysis;
    state.currentSegmentIndex = -1;

    elements.emptyState.hidden = true;
    elements.workbench.hidden = false;
    elements.storyboardSection.hidden = false;
    elements.videoFallback.classList.remove("is-hidden");
    elements.videoFallback.querySelector("span").textContent = "视频加载中";

    elements.mainVideo.src = videoSrc;
    elements.mainVideo.load();

    renderInsightPanel();
    renderLegend();
    renderStoryboard();
    resizeTimeline();
    updateCurrentSegment(0);
    updatePlayhead(0);
  }

  function renderInsightPanel() {
    const { analysis } = state;
    elements.sourceLabel.textContent = analysis.sourceLabel;
    elements.videoTitle.textContent = analysis.videoTitle;
    elements.segmentCount.textContent = analysis.segments.length;
    elements.durationLabel.textContent = formatTime(analysis.duration);
    elements.generatedDescription.textContent = "点击按钮后，摘要会汇聚成可复制的视频简介。";
  }

  function renderLegend() {
    elements.timelineLegend.innerHTML = Object.entries(TYPE_META)
      .map(
        ([type, meta]) =>
          `<span><i style="background:${meta.color}"></i>${meta.label}</span>`
      )
      .join("");
  }

  function resizeTimeline() {
    const canvas = elements.timelineCanvas;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.floor(128 * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawTimeline();
  }

  function drawTimeline() {
    const { analysis } = state;
    const canvas = elements.timelineCanvas;
    const width = canvas.getBoundingClientRect().width;
    const height = 128;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, width, height);

    if (!analysis) return;

    const duration = analysis.duration || 1;
    analysis.segments.forEach((segment, index) => {
      const meta = TYPE_META[segment.type] || TYPE_META.key_point;
      const x = (segment.start / duration) * width;
      const segmentWidth = Math.max(2, ((segment.end - segment.start) / duration) * width);
      const barHeight = 34 + segment.intensity * 62;
      const y = height - barHeight - 18;

      const gradient = ctx.createLinearGradient(x, y, x, height);
      gradient.addColorStop(0, meta.color);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.08)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, segmentWidth, barHeight);

      ctx.fillStyle = "rgba(255, 255, 255, 0.58)";
      for (let i = 0; i < 8; i += 1) {
        const waveX = x + (segmentWidth / 8) * i;
        const waveHeight = 8 + ((i + index) % 5) * 4 + segment.intensity * 18;
        ctx.fillRect(waveX, height - waveHeight - 4, Math.max(2, segmentWidth / 18), waveHeight);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
      ctx.font = "12px sans-serif";
      if (segmentWidth > 84) {
        ctx.fillText(formatTime(segment.start), x + 8, height - 12);
      }
    });
  }

  function updatePlayhead(time) {
    if (!state.analysis) return;
    const duration = getDuration() || state.analysis.duration || 1;
    const progress = Math.min(1, Math.max(0, time / duration));
    elements.playhead.style.left = `${progress * 100}%`;
  }

  function renderStoryboard() {
    const { analysis } = state;
    elements.storyboardGrid.innerHTML = analysis.segments
      .map((segment, index) => {
        const meta = TYPE_META[segment.type] || TYPE_META.key_point;
        const height = 220 + (index % 3) * 46 + Math.round(segment.intensity * 34);
        const tags = segment.keywords.map((keyword) => `<span class="tag">${keyword}</span>`).join("");

        return `
          <article
            class="story-card"
            style="--card-color:${meta.color}; --card-height:${height}px"
            data-index="${index}"
            data-start="${segment.start}"
            tabindex="0"
          >
            <span class="timecode">${formatTime(segment.start)}</span>
            <h3>${segment.title}</h3>
            <p>${segment.summary}</p>
            <div class="tag-list">${tags}</div>
          </article>
        `;
      })
      .join("");

    elements.storyboardGrid.querySelectorAll(".story-card").forEach((card) => {
      const jump = () => seekTo(Number(card.dataset.start));
      card.addEventListener("click", jump);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          jump();
        }
      });
    });
  }

  function updateCurrentSegment(time) {
    if (!state.analysis) return;
    const index = findSegmentIndexAt(time);
    if (index === state.currentSegmentIndex) return;

    state.currentSegmentIndex = index;
    const segment = state.analysis.segments[index];
    const meta = TYPE_META[segment.type] || TYPE_META.key_point;

    elements.body.dataset.theme = segment.type;
    elements.currentType.textContent = meta.label;
    elements.currentType.style.background = meta.color;
    elements.currentTitle.textContent = segment.title;
    elements.currentSummary.textContent = segment.summary;

    elements.storyboardGrid.querySelectorAll(".story-card").forEach((card) => {
      card.classList.toggle("is-active", Number(card.dataset.index) === index);
    });
  }

  function seekTo(time) {
    elements.mainVideo.currentTime = Math.max(0, time);
    updateCurrentSegment(time);
    updatePlayhead(time);
    elements.mainVideo.play().catch(() => {});
  }

  function videoController() {
    elements.mainVideo.addEventListener("loadedmetadata", () => {
      elements.videoFallback.classList.add("is-hidden");
      if (state.analysis && elements.mainVideo.duration && Number.isFinite(elements.mainVideo.duration)) {
        elements.durationLabel.textContent = formatTime(elements.mainVideo.duration);
      }
    });

    elements.mainVideo.addEventListener("error", () => {
      elements.videoFallback.classList.remove("is-hidden");
      elements.videoFallback.querySelector("span").textContent =
        "演示视频未能加载，请上传本地视频继续体验";
    });

    elements.mainVideo.addEventListener("timeupdate", () => {
      const time = elements.mainVideo.currentTime || 0;
      updateCurrentSegment(time);
      updatePlayhead(time);
    });
  }

  function timelineRenderer() {
    elements.timelineCanvas.addEventListener("click", (event) => {
      if (!state.analysis) return;
      const rect = elements.timelineCanvas.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      seekTo(ratio * getDuration());
    });

    elements.timelineCanvas.addEventListener("mousemove", (event) => {
      if (!state.analysis) return;
      const rect = elements.timelineCanvas.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const time = ratio * getDuration();
      const segment = findSegmentAt(time);
      const meta = TYPE_META[segment.type] || TYPE_META.key_point;

      elements.timelineTooltip.hidden = false;
      elements.timelineTooltip.style.left = `${ratio * 100}%`;
      elements.timelineTooltip.style.top = "0";
      elements.timelineTooltip.innerHTML = `
        <strong>${formatTime(time)} · ${segment.title}</strong>
        <span style="color:${meta.color}">${meta.label}</span>
        <div>${segment.keywords.join(" / ")}</div>
      `;
    });

    elements.timelineCanvas.addEventListener("mouseleave", () => {
      elements.timelineTooltip.hidden = true;
    });

    window.addEventListener("resize", resizeTimeline);
  }

  function interactionLayer() {
    elements.generateDescription.addEventListener("click", () => {
      if (!state.analysis) return;
      const startRect = elements.timelineCanvas.getBoundingClientRect();
      const endRect = elements.descriptionBox.getBoundingClientRect();
      const particles = 18;

      elements.descriptionBox.classList.add("is-generating");
      window.setTimeout(() => elements.descriptionBox.classList.remove("is-generating"), 900);

      for (let index = 0; index < particles; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.left = `${startRect.left + startRect.width * Math.random()}px`;
        particle.style.top = `${startRect.top + startRect.height * Math.random()}px`;
        document.body.appendChild(particle);

        particle.animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            {
              transform: `translate(${endRect.left - startRect.left + endRect.width / 2}px, ${
                endRect.top - startRect.top + endRect.height / 2
              }px) scale(0.35)`,
              opacity: 0
            }
          ],
          {
            duration: 650 + Math.random() * 360,
            easing: "cubic-bezier(.2,.8,.2,1)",
            delay: index * 18
          }
        ).addEventListener("finish", () => particle.remove());
      }

      window.setTimeout(() => {
        elements.generatedDescription.textContent = state.analysis.generatedDescription;
      }, 520);
    });
  }

  function init() {
    sourceLoader();
    videoController();
    timelineRenderer();
    interactionLayer();
    renderLegend();
    resizeTimeline();
  }

  init();
})();
