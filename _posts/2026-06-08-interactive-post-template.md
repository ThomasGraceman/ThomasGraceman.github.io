---
title: "Your Post Title Here"
date: 2026-06-08
permalink: /posts/2026/06/your-post-slug/
tags:
  - math
  - visualization
  - tutorial
excerpt: "A short description of your post shown in listings and previews."
mathjax: true
---

<!-- ═══════════════════════════════════════════════════════════════
     TEMPLATE — AcademicPages / Minimal Mistakes + Jekyll
     ▸ Drop into _posts/ as YYYY-MM-DD-your-slug.md
     ▸ Requires: mathjax: true in front matter (already set above)
     ▸ D3 v7 loaded inline below — no _config.yml changes needed
     ═══════════════════════════════════════════════════════════════ -->

<!-- ── 1. INTRODUCTION ───────────────────────────────────────────── -->

Write your introduction here. Use standard Markdown — headings, bold,
lists, links — all work normally alongside MathJax and D3.

---

## 1. Math with MathJax

### Inline math

Wrap inline expressions in single dollar signs: the loss function
$\mathcal{L}(\theta) = -\frac{1}{N}\sum_{i=1}^{N} y_i \log \hat{y}_i$
appears inside a sentence.

### Display math

Use double dollar signs on their own lines for centred, numbered-style blocks:

$$
\nabla_\theta \mathcal{L} = \frac{\partial \mathcal{L}}{\partial \theta}
$$

### Aligned equations

$$
\begin{aligned}
  x_{t+1} &= x_t - \eta \, \nabla f(x_t) \\
  \eta     &= \frac{\eta_0}{\sqrt{t + 1}}
\end{aligned}
$$

### Inline inside a list

- Gradient step size: $\eta \in (0, 1)$
- Convergence rate: $\mathcal{O}(1/\sqrt{T})$
- Loss at step $t$: $\mathcal{L}_t = f(x_t)$

---

## 2. First Interactive Chart — Bar Chart

Replace the placeholder data array and axis labels with your own values.

<!-- Load D3 once per page — place before your first visualisation -->
<script src="https://d3js.org/d3.v7.min.js"></script>

<div id="bar-chart" style="width:100%; max-width:680px; margin:2rem auto;"></div>

<script>
(function () {
  // ── TODO: replace with your data ──────────────────────────────
  const data = [
    { label: "Method A", value: 72 },
    { label: "Method B", value: 85 },
    { label: "Method C", value: 63 },
    { label: "Method D", value: 91 },
    { label: "Method E", value: 78 },
  ];
  // ─────────────────────────────────────────────────────────────

  const margin = { top: 24, right: 20, bottom: 48, left: 50 };
  const container = document.getElementById("bar-chart");
  const totalW = container.clientWidth || 680;
  const W = totalW - margin.left - margin.right;
  const H = 300 - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("width",  totalW)
      .attr("height", H + margin.top + margin.bottom)
      .attr("role",   "img")
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, W])
    .padding(0.35);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) * 1.15])
    .nice()
    .range([H, 0]);

  // Gridlines
  svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(y).tickSize(-W).tickFormat(""))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line")
      .style("stroke", "#e0e0e0")
      .style("stroke-dasharray", "3,3"));

  // Bars
  svg.selectAll(".bar")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x",      d => x(d.label))
      .attr("y",      d => y(d.value))
      .attr("width",  x.bandwidth())
      .attr("height", d => H - y(d.value))
      .attr("rx", 3)
      .attr("fill", "#2a6496")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#1a3f5e");
        tooltip.style("opacity", 1).html(`<strong>${d.label}</strong>: ${d.value}`);
      })
      .on("mousemove", event => {
        tooltip
          .style("left", (event.pageX + 12) + "px")
          .style("top",  (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#2a6496");
        tooltip.style("opacity", 0);
      });

  // Value labels on top
  svg.selectAll(".bar-label")
    .data(data)
    .join("text")
      .attr("x", d => x(d.label) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#444")
      .text(d => d.value);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${H})`)
    .call(d3.axisBottom(x))
    .call(g => g.select(".domain").style("stroke", "#aaa"))
    .call(g => g.selectAll("text").style("font-size", "13px"));

  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("text").style("font-size", "12px"));

  // Y-axis label — TODO: change this
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 12)
    .attr("x", -H / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#555")
    .text("Accuracy (%)");   // ← TODO: your label

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("position",      "absolute")
    .style("background",    "rgba(0,0,0,.75)")
    .style("color",         "#fff")
    .style("padding",       "6px 10px")
    .style("border-radius", "4px")
    .style("font-size",     "13px")
    .style("pointer-events","none")
    .style("opacity",       0);
})();
</script>

*Figure 1 — Replace the caption with a description of your chart.*

---

## 3. Second Interactive Chart — Line Chart with Brush

Useful for time-series data, training curves, or any sequential metric.

<div id="line-chart" style="width:100%; max-width:680px; margin:2rem auto;"></div>

<script>
(function () {
  // ── TODO: replace with your data ──────────────────────────────
  // Each object needs { x: <number or Date>, y: <number> }
  const rawData = Array.from({ length: 50 }, (_, i) => ({
    x: i,
    y: Math.exp(-i / 15) + (Math.random() - 0.5) * 0.08,
  }));
  const xLabel = "Epoch";          // ← TODO
  const yLabel = "Validation Loss"; // ← TODO
  // ─────────────────────────────────────────────────────────────

  const margin = { top: 24, right: 30, bottom: 52, left: 55 };
  const container = document.getElementById("line-chart");
  const totalW = container.clientWidth || 680;
  const W = totalW - margin.left - margin.right;
  const H = 300 - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("width",  totalW)
      .attr("height", H + margin.top + margin.bottom + 30) // extra for brush
      .attr("role",   "img");

  const focus = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xExt = d3.extent(rawData, d => d.x);
  const yExt = [0, d3.max(rawData, d => d.y) * 1.1];

  const x = d3.scaleLinear().domain(xExt).range([0, W]);
  const y = d3.scaleLinear().domain(yExt).nice().range([H, 0]);

  // Clip path
  focus.append("defs").append("clipPath")
    .attr("id", "clip-line")
    .append("rect")
      .attr("width", W)
      .attr("height", H);

  // Gridlines
  focus.append("g")
    .call(d3.axisLeft(y).tickSize(-W).tickFormat(""))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line")
      .style("stroke", "#e8e8e8")
      .style("stroke-dasharray", "4,3"));

  // Area fill
  const area = d3.area()
    .x(d => x(d.x))
    .y0(H)
    .y1(d => y(d.y))
    .curve(d3.curveCatmullRom.alpha(0.5));

  focus.append("path")
    .datum(rawData)
    .attr("clip-path", "url(#clip-line)")
    .attr("fill", "rgba(42,100,150,.12)")
    .attr("d", area);

  // Line
  const line = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .curve(d3.curveCatmullRom.alpha(0.5));

  const linePath = focus.append("path")
    .datum(rawData)
    .attr("clip-path", "url(#clip-line)")
    .attr("fill",   "none")
    .attr("stroke", "#2a6496")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Axes
  const xAxis = focus.append("g")
    .attr("transform", `translate(0,${H})`)
    .call(d3.axisBottom(x).ticks(8))
    .call(g => g.select(".domain").style("stroke","#aaa"))
    .call(g => g.selectAll("text").style("font-size","12px"));

  focus.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("text").style("font-size","12px"));

  // Axis labels
  focus.append("text")
    .attr("x", W / 2).attr("y", H + 38)
    .attr("text-anchor","middle")
    .style("font-size","12px").style("fill","#555")
    .text(xLabel);

  focus.append("text")
    .attr("transform","rotate(-90)")
    .attr("y", -margin.left + 14).attr("x", -H / 2)
    .attr("text-anchor","middle")
    .style("font-size","12px").style("fill","#555")
    .text(yLabel);

  // Hover dot + crosshair
  const dot  = focus.append("circle").attr("r", 5)
    .attr("fill","#2a6496").attr("stroke","#fff")
    .attr("stroke-width", 2).style("opacity",0);

  const vLine = focus.append("line")
    .attr("y1",0).attr("y2",H)
    .attr("stroke","#aaa").attr("stroke-dasharray","4,3")
    .style("opacity",0);

  const tip = d3.select("body").append("div")
    .style("position","absolute").style("background","rgba(0,0,0,.75)")
    .style("color","#fff").style("padding","6px 10px")
    .style("border-radius","4px").style("font-size","13px")
    .style("pointer-events","none").style("opacity",0);

  const bisect = d3.bisector(d => d.x).left;

  focus.append("rect")
    .attr("width", W).attr("height", H)
    .attr("fill","none").attr("pointer-events","all")
    .on("mousemove", function(event) {
      const [mx] = d3.pointer(event);
      const x0 = x.invert(mx);
      const i  = bisect(rawData, x0, 1);
      const d  = x0 - rawData[i-1].x > rawData[i].x - x0 ? rawData[i] : rawData[i-1];
      dot.attr("cx", x(d.x)).attr("cy", y(d.y)).style("opacity",1);
      vLine.attr("x1", x(d.x)).attr("x2", x(d.x)).style("opacity",1);
      tip.style("opacity",1)
         .html(`${xLabel}: <strong>${d.x}</strong><br>${yLabel}: <strong>${d.y.toFixed(4)}</strong>`)
         .style("left",(event.pageX+14)+"px").style("top",(event.pageY-32)+"px");
    })
    .on("mouseleave", () => {
      dot.style("opacity",0); vLine.style("opacity",0); tip.style("opacity",0);
    });
})();
</script>

*Figure 2 — Hover over the chart to read exact values.*

---

## 4. Writing Tips for This Template

### Callout boxes (plain HTML works in Markdown)

<div style="background:#f0f7fb; border-left:4px solid #2a6496;
            padding:1rem 1.2rem; border-radius:4px; margin:1.2rem 0;">
  <strong>💡 Tip</strong> — Use this pattern for key takeaways,
  definitions, or warnings. Change the border colour to
  <code>#c0392b</code> for a red alert box.
</div>

### Code blocks

```python
# TODO: replace with your own snippet
import numpy as np

def gradient_descent(f_grad, x0, eta=0.01, steps=500):
    x = x0.copy()
    for _ in range(steps):
        x -= eta * f_grad(x)
    return x
```

### Tables

| Method     | Accuracy | Runtime (s) |
|:-----------|:--------:|------------:|
| Baseline   | 72 %     | 0.4         |
| Proposed   | **91 %** | 1.2         |

---

## 5. Checklist Before Publishing

<!-- Remove this section from your actual post -->

- [ ] Update `title`, `date`, `permalink`, `tags`, `excerpt` in the front matter
- [ ] Replace all placeholder data arrays in the D3 blocks
- [ ] Update axis labels and figure captions
- [ ] Test MathJax renders correctly on your local Jekyll server
- [ ] Rename the file to `YYYY-MM-DD-your-slug.md`
- [ ] Delete this checklist section

---

*Thanks for reading. Comments and corrections welcome.*
