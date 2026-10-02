import React, { useEffect, useId, useMemo, useRef, useState } from "react";

const AREAS = [
  { name: ["Collaborate", "协同"], dates: "2020–2025", x: 0.14, y: 0.65, depth: 0.68, tilt: -0.42 },
  { name: ["Distribute", "分布"], dates: "2023–2025", x: 0.5, y: 0.29, depth: 0.84, tilt: 0.3 },
  { name: ["Compose", "组合"], dates: "2024–2025", x: 0.86, y: 0.65, depth: 1, tilt: -0.32 },
];

// A continuous illustrative loss function. Its isolines are extracted from
// sampled values, rather than drawn as decorative concentric ellipses.
function createLandscape(width, height) {
  const scale = width / 1120;
  const sx = 92 * scale;
  const sy = 64 * scale;
  const centers = AREAS.map((area) => [width * area.x, height * area.y]);
  const gaussian = (x, y, index) => {
    const dx = x - centers[index][0];
    const dy = y - centers[index][1];
    const { tilt } = AREAS[index];
    const u = dx * Math.cos(tilt) + dy * Math.sin(tilt);
    const v = dy * Math.cos(tilt) - dx * Math.sin(tilt);
    return Math.exp(-0.5 * ((u / sx) ** 2 + (v / sy) ** 2));
  };
  const loss = (x, y) =>
    0.22 * (1 - x / width) +
    0.06 * ((y - height / 2) / height) ** 2 -
    AREAS.reduce((sum, area, index) => sum + area.depth * gaussian(x, y, index), 0);
  const owner = (x, y) => {
    const weights = AREAS.map((_, index) => gaussian(x, y, index));
    const maximum = Math.max(...weights);
    return maximum < 0.028 ? -1 : weights.indexOf(maximum);
  };
  const cell = Math.max(3, 5 * scale);
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const samples = new Float32Array(cols * rows);
  let minimum = Infinity;
  let maximum = -Infinity;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = loss(col * cell, row * cell);
      samples[row * cols + col] = value;
      minimum = Math.min(minimum, value);
      maximum = Math.max(maximum, value);
    }
  }
  const paths = new Map();
  const levels = width < 600 ? 10 : 18;
  const connect = (a, b, level) => {
    const basin = owner((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    const key = `${basin}-${level}`;
    const entry = paths.get(key) || { basin, level, d: "" };
    entry.d += `M${a[0].toFixed(1)},${a[1].toFixed(1)}L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    paths.set(key, entry);
  };
  for (let level = 0; level < levels; level++) {
    const threshold = minimum + (maximum - minimum) * ((level + 0.75) / levels) ** 1.5;
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const values = [
          samples[row * cols + col],
          samples[row * cols + col + 1],
          samples[(row + 1) * cols + col + 1],
          samples[(row + 1) * cols + col],
        ];
        const corners = [
          [col * cell, row * cell],
          [(col + 1) * cell, row * cell],
          [(col + 1) * cell, (row + 1) * cell],
          [col * cell, (row + 1) * cell],
        ];
        const crossing = [];
        for (let edge = 0; edge < 4; edge++) {
          const next = (edge + 1) % 4;
          if (values[edge] >= threshold === values[next] >= threshold) continue;
          const t = (threshold - values[edge]) / (values[next] - values[edge]);
          crossing.push([corners[edge][0] + t * (corners[next][0] - corners[edge][0]), corners[edge][1] + t * (corners[next][1] - corners[edge][1])]);
        }
        if (crossing.length === 2) connect(crossing[0], crossing[1], level);
        else if (crossing.length === 4) {
          const centerHigh = values.reduce((sum, value) => sum + value, 0) / 4 >= threshold;
          const same = centerHigh === values[0] >= threshold;
          connect(crossing[0], crossing[same ? 1 : 3], level);
          connect(crossing[2], crossing[same ? 3 : 1], level);
        }
      }
    }
  }

  // Walk each basin's attraction field after leaving the preceding minimum.
  // A shallow quadratic potential lets the walker reach the next basin even
  // where a Gaussian's gradient is nearly zero. All geometry is illustrative.
  const routes = centers.slice(0, -1).map((start, leg) => {
    const target = centers[leg + 1];
    const potential = (x, y) => {
      const dx = (x - target[0]) / width;
      const dy = (y - target[1]) / width;
      return 0.5 * (dx * dx + 1.5 * dy * dy) - gaussian(x, y, leg + 1);
    };
    const points = [start];
    let [x, y] = start;
    for (let step = 0; step < 1600; step++) {
      const gx = potential(x + 0.5, y) - potential(x - 0.5, y);
      const gy = potential(x, y + 0.5) - potential(x, y - 0.5);
      const magnitude = Math.hypot(gx, gy);
      if (magnitude < 1e-12 || Math.hypot(x - target[0], y - target[1]) < 3) break;
      const distance = Math.max(1, 2.5 * scale);
      x -= (distance * gx) / magnitude;
      y -= (distance * gy) / magnitude;
      points.push([x, y]);
    }
    points.push(target);
    return points.map(([px, py], index) => `${index ? "L" : "M"}${px.toFixed(2)},${py.toFixed(2)}`).join("");
  });
  return { paths: [...paths.values()], centers, routes, levels };
}

const componentStyles = `
.loss-map{margin:0;position:relative;--loss-0:#72899b;--loss-1:#628d89;--loss-2:#547962}
[data-theme=dark] .loss-map{--loss-0:#b0c7d7;--loss-1:#a1ccc6;--loss-2:#a6cdb1}
.loss-map__stage{height:clamp(190px,22vw,246px);position:relative;overflow:hidden}
.loss-map__svg{display:block;width:100%;height:100%;overflow:visible}
.loss-map__contour{transition:opacity .5s;fill:none;stroke-width:1;vector-effect:non-scaling-stroke}
.loss-map__node{position:absolute;transform:translate(-50%,12px);padding:5px 10px 6px;border-radius:7px;text-align:center;white-space:nowrap;color:var(--secondary);background:color-mix(in srgb,var(--surface) 91%,transparent);line-height:1.35;border:1px solid transparent}
.loss-map__node:hover,.loss-map__node[aria-pressed=true]{color:var(--basin);background:var(--surface);border-color:color-mix(in srgb,var(--basin) 24%,transparent)}
.loss-map__node:active{transform:translate(-50%,13px)}
.loss-map__node span{display:block;font-size:16px;font-weight:550;letter-spacing:-.25px}
.loss-map__node small{display:block;font:10px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;margin-top:3px;color:var(--muted)}
.loss-map__caption{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:10px;line-height:1.6;padding:0 22px 17px;margin:0}
.loss-map__caption span:first-child{letter-spacing:.07em;text-transform:uppercase}
.loss-map__optimizer{pointer-events:none}
@media(max-width:600px){.loss-map__node{padding:5px 5px}.loss-map__node span{font-size:12px}.loss-map__node small{font-size:8px}.loss-map__caption{font-size:8px;gap:8px}.loss-map__stage{height:184px}}
@media(prefers-reduced-motion:reduce){.loss-map__contour{transition:none}}
`;

export default function LossLandscape({ active = 0, onSelect, lang = 0 }) {
  const container = useRef(null);
  const optimizer = useRef(null);
  const routeRefs = useRef([]);
  const manualSelection = useRef(false);
  const selectedCallback = useRef(onSelect);
  const [size, setSize] = useState({ width: 1120, height: 246 });
  const uniqueId = useId().replace(/:/g, "");
  const geometry = useMemo(() => createLandscape(size.width, size.height), [size]);
  selectedCallback.current = onSelect;

  useEffect(() => {
    const element = container.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize((previous) => (previous.width === width && previous.height === height ? previous : { width, height }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let current = -1;
    const segmentDuration = 3700;
    const cycleDuration = segmentDuration * 2 + 1800;
    const draw = (timestamp) => {
      frame = 0;
      if (!visible || document.hidden || motion.matches) return;
      // Reading and keyboard interaction must never lose their current panel.
      const manual = manualSelection.current || container.current.closest("section")?.contains(document.activeElement);
      if (previous) elapsed += Math.min(60, timestamp - previous);
      previous = timestamp;
      const cycle = elapsed % cycleDuration;
      const segment = Math.min(2, Math.floor(cycle / segmentDuration));
      if (segment !== current && !manual) {
        current = segment;
        selectedCallback.current?.(segment);
      }
      const dot = optimizer.current;
      if (dot) {
        const route = routeRefs.current[Math.min(segment, 1)];
        const fraction = segment === 2 ? 1 : (cycle % segmentDuration) / segmentDuration;
        const point = route?.getPointAtLength(route.getTotalLength() * fraction);
        if (point) dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
        dot.style.opacity = `${segment === 2 ? Math.max(0, 1 - (cycle - segmentDuration * 2) / 1800) : 1}`;
      }
      frame = requestAnimationFrame(draw);
    };
    const start = () => {
      previous = 0;
      if (!frame && visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
      if (motion.matches && optimizer.current) optimizer.current.style.opacity = "0";
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
        start();
      },
      { threshold: 0.05 }
    );
    observer.observe(container.current);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [geometry]);

  const select = (index) => {
    manualSelection.current = true;
    onSelect?.(index);
  };

  return (
    <figure className="loss-map" aria-label={lang ? "由三个研究方向组成的损失景观" : "A loss landscape of three research directions"}>
      <style>{componentStyles}</style>
      <div className="loss-map__stage" ref={container}>
        <svg className="loss-map__svg" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true">
          <defs>
            <radialGradient id={`${uniqueId}-glow`}>
              <stop stopColor="var(--accent)" stopOpacity=".6" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          {geometry.paths.map(({ basin, level, d }) => (
            <path
              key={`${basin}-${level}`}
              className="loss-map__contour"
              d={d}
              stroke={basin < 0 ? "var(--muted)" : `var(--loss-${basin})`}
              opacity={basin < 0 ? 0.11 : (basin === active ? 0.29 : 0.1) + (1 - level / geometry.levels) * (basin === active ? 0.48 : 0.17)}
            />
          ))}
          {geometry.routes.map((d, index) => (
            <path
              key={index}
              ref={(element) => {
                routeRefs.current[index] = element;
              }}
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.15"
              strokeDasharray="2 5"
              opacity=".42"
            />
          ))}
          {geometry.centers.map(([x, y], index) => (
            <g key={index} transform={`translate(${x} ${y})`}>
              <circle r={index === active ? 9 : 6} fill={`var(--loss-${index})`} opacity=".1" />
              <circle r={index === active ? 4 : 2.7} fill={`var(--loss-${index})`} />
            </g>
          ))}
          <g ref={optimizer} className="loss-map__optimizer" style={{ opacity: 0 }}>
            <circle r="12" fill={`url(#${uniqueId}-glow)`} />
            <circle r="3.2" fill="var(--accent-strong)" />
            <circle r="1.2" fill="var(--surface)" />
          </g>
        </svg>
        {AREAS.map((area, index) => (
          <button
            key={area.name[0]}
            id={`direction-${index}`}
            className="loss-map__node"
            type="button"
            aria-pressed={active === index}
            aria-controls="research-panel"
            style={{ left: `${area.x * 100}%`, top: `${area.y * 100}%`, "--basin": `var(--loss-${index})` }}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") select(index);
            }}
            onFocus={() => select(index)}
            onClick={() => select(index)}
          >
            <span>{area.name[lang]}</span>
            <small>{area.dates}</small>
          </button>
        ))}
      </div>
      <figcaption className="loss-map__caption">
        <span>{lang ? "损失景观 · 研究脉络的可视化表达" : "Loss landscape · an illustration of my research path"}</span>
        <span>{lang ? "悬停或点击，探索研究方向" : "Hover or select a direction to explore"}</span>
      </figcaption>
    </figure>
  );
}
