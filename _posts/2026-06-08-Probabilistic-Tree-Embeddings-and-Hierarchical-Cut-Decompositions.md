---
title: "Probabilistic Tree Embeddings and Hierarchical Cut Decompositions"
date: 2026-06-08
permalink: /posts/tree-embeddings-hierarchical-cut-decompositions/
redirect_from:
  - /Probabilistic-Tree-Embeddings/
---

As part of my effort to understand the broader literature surrounding the areas I hope to work on in the future, I am studying both foundational papers and contemporary developments. Alongside my primary focus on the work of James R. Lee, I plan to read a number of folklore and classical papers that have shaped the modern theory of metric embeddings.

One of the central themes I am exploring is tree embeddings as an algorithmic tool. A recurring paradigm in approximation algorithms is to replace a complicated metric space with a distribution over tree metrics. Since many optimization problems become significantly easier on trees, one can design an algorithm in the tree setting and then transfer the guarantee back to the original metric, often losing only a logarithmic factor in approximation quality.

A canonical example of this philosophy is the probabilistic partition framework of Yuri Bartal and the subsequent CKR decomposition of Moses Charikar, Chandra Chekuri, and Anupam Gupta. These techniques form a cornerstone of modern metric embedding theory and have influenced approximation algorithms, online algorithms, routing, clustering, and network design.

What makes this area particularly exciting is that even these classical constructions continue to inspire new advances. For example, the recent paper *Tree Embedding in High Dimensions: Dynamic and Massively Parallel* by Gramoz Goranci, Shaofeng H.-C. Jiang, Peter Kiss, Qihao Kong, Yi Qian, and Eva Szilagyi extends the tree-embedding paradigm to dynamic and massively parallel settings, obtaining efficient algorithms for high-dimensional Euclidean data and applications such as k-median and earth mover distance. The paper first appeared as an arXiv preprint in October 2025 and was later published at the 2026 ACM-SIAM Symposium on Discrete Algorithms (SODA 2026).

---

## Probabilistic Metric Approximation

We now consider the following idea: if we cannot construct an exact object, we instead build a collection of objects that approximate it, and place a probability distribution over them. By sampling from this distribution, we can reason about the expected quality of the constructed object over time.

Let $\mathcal{S}$ be a family of metrics over $V$, and let $\mathcal{D}$ be a distribution over $\mathcal{S}$. We say that $(\mathcal{S}, \mathcal{D})$ $\alpha$-probabilistically approximates a metric $(V, d)$ if every metric in $\mathcal{S}$ dominates $d$, and for every pair of vertices $u, v \in V$, it holds that

$$
\mathbb{E}_{d' \sim \mathcal{D}}[d'(u, v)] \le \alpha \cdot d(u, v).
$$

## Hierarchical Cut Decomposition

Let $(V,d)$ be a finite metric space. For a parameter $r > 0$, an $r$-cut decomposition is a partition of $V$ into clusters such that:
- Each cluster is associated with a center vertex,
- Every vertex in a cluster lies within distance at most $r$ from its center.

Thus, every cluster has diameter at most $2r$.

A **hierarchical cut decomposition** is a sequence of nested partitions:

$$
D_0, D_1, \dots, D_\delta
$$

such that:
- $D_\delta = \{V\}$ (the trivial partition),
- $D_i$ is a $2^i$-cut decomposition,
- $D_i$ refines $D_{i+1}$ for all $i$ (i.e., every cluster in $D_i$ is contained in some cluster of $D_{i+1}$).

At the finest level, $D_0$ consists of singleton clusters.

### Intuition

This construction organizes the metric space in a top-down manner. At large scale, points are grouped into coarse clusters, and as the scale decreases, these clusters are recursively refined into smaller ones. This yields a multiscale representation of the metric that can be viewed as a tree-like structure.

### Example

Consider a metric space $(V,d)$ where:

$$
V = \{a,b,c,d,e\}
$$

Suppose the distances are such that:
- $\{a,b\}$ are very close,
- $\{c,d\}$ are very close,
- $e$ is far from all others.

We construct a hierarchical cut decomposition:

#### Level $D_0$ (radius $1$)
Each vertex is a singleton:

$$
D_0 = \big\{ \{a\}, \{b\}, \{c\}, \{d\}, \{e\} \big\}
$$

#### Level $D_1$ (radius $2$)
Close points are grouped:

$$
D_1 = \big\{ \{a,b\}, \{c,d\}, \{e\} \big\}
$$

#### Level $D_2$ (radius $4$)
Further merging:

$$
D_2 = \big\{ \{a,b,c,d,e\} \big\}
$$

Notice the refinement property:

$$
D_0 \prec D_1 \prec D_2
$$

Each level coarsens the metric, while preserving local structure at smaller scales.

<style>
  .viz-card {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px 20px 10px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    margin: 30px 0;
  }
  .viz-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .level-btn {
    padding: 7px 18px;
    border: 2px solid #d0d0d0;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: 'Courier New', monospace;
    transition: all 0.2s ease;
    letter-spacing: 0.3px;
  }
  .level-btn:hover {
    background: #f0f4f8;
    border-color: #bbb;
  }
  .level-btn.active {
    border-color: #2b8cbe;
    background: #e8f4fd;
    color: #045a8d;
    font-weight: 700;
    box-shadow: 0 1px 3px rgba(43,140,190,0.2);
  }
  .viz-info {
    margin-left: auto;
    font-size: 13px;
    color: #555;
    background: #f0f0f0;
    padding: 6px 14px;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
  }
  .viz-tooltip {
    position: fixed;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    pointer-events: none;
    opacity: 0;
    z-index: 1000;
    transition: opacity 0.15s ease;
  }
  .algo-viz-card {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    margin: 30px 0;
  }
  .algo-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    align-items: center;
    flex-wrap: wrap;
  }
  .algo-btn {
    padding: 7px 16px;
    border: 2px solid #d0d0d0;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: 'Courier New', monospace;
    transition: all 0.2s ease;
  }
  .algo-btn:hover { background: #f0f4f8; border-color: #bbb; }
  .algo-btn.primary {
    border-color: #2b8cbe;
    background: #e8f4fd;
    color: #045a8d;
    font-weight: 700;
  }
  .algo-status {
    flex: 1 1 260px;
    font-size: 13px;
    color: #444;
    background: #f0f0f0;
    padding: 8px 14px;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    line-height: 1.5;
    min-height: 42px;
  }
  .algo-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 10px;
    margin-bottom: 14px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    color: #555;
  }
  .algo-meta span {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 6px 10px;
  }
  .algo-meta b { color: #045a8d; }
  .algo-layout {
    display: grid;
    grid-template-columns: 1fr 240px;
    gap: 16px;
  }
  @media (max-width: 720px) {
    .algo-layout { grid-template-columns: 1fr; }
  }
  .algo-partition-panel {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 12px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    max-height: 420px;
    overflow-y: auto;
  }
  .algo-partition-panel h4 {
    margin: 0 0 10px 0;
    font-size: 13px;
    color: #045a8d;
  }
  .algo-level-block { margin-bottom: 12px; }
  .algo-level-block .level-title {
    font-weight: 700;
    color: #666;
    margin-bottom: 4px;
  }
  .algo-cluster {
    display: inline-block;
    margin: 2px 4px 2px 0;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #f9f9f9;
  }
  .algo-cluster.active {
    border-color: #2b8cbe;
    box-shadow: 0 0 0 2px rgba(43,140,190,0.15);
    font-weight: 700;
  }
  .algo-step-counter {
    font-size: 12px;
    color: #888;
    margin-left: auto;
  }
</style>

<div class="viz-card">
  <div class="viz-controls">
    <button class="level-btn active" data-level="2">D₂ (radius 4)</button>
    <button class="level-btn" data-level="1">D₁ (radius 2)</button>
    <button class="level-btn" data-level="0">D₀ (radius 1)</button>
    <span class="viz-info" id="partition-label">Partition: {a,b,c,d,e}</span>
  </div>
  <div id="d3-viz" style="width: 100%; height: 440px;"></div>
  <div style="margin-top: 10px; font-size: 12px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 8px;">
    Click a level button to highlight the partition. Hover over a node to see cluster details.
  </div>
</div>

<div class="viz-tooltip" id="viz-tooltip"></div>

<script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  var container = document.getElementById('d3-viz');
  if (!container) return;

  var totalWidth = 820;
  var totalHeight = 440;
  var margin = { top: 50, right: 100, bottom: 50, left: 50 };
  var innerW = totalWidth - margin.left - margin.right;
  var innerH = totalHeight - margin.top - margin.bottom;

  var treeData = {
    id: 'R', name: 'V = {a,b,c,d,e}', level: 2, radius: 4,
    children: [
      { id: 'C1', name: '{a,b}', level: 1, radius: 2,
        children: [
          { id: 'a', name: '{a}', level: 0, radius: 1 },
          { id: 'b', name: '{b}', level: 0, radius: 1 } ] },
      { id: 'C2', name: '{c,d}', level: 1, radius: 2,
        children: [
          { id: 'c', name: '{c}', level: 0, radius: 1 },
          { id: 'd', name: '{d}', level: 0, radius: 1 } ] },
      { id: 'C3', name: '{e}', level: 1, radius: 2,
        children: [
          { id: 'e', name: '{e}', level: 0, radius: 1 } ] }
    ]
  };

  var partitionLabels = {
    2: 'Partition: {a,b,c,d,e}',
    1: 'Partition: {a,b}  {c,d}  {e}',
    0: 'Partition: {a} {b} {c} {d} {e}'
  };

  var levelY = {};
  levelY[0] = innerH - 20;
  levelY[1] = innerH * 0.55;
  levelY[2] = 30;

  var svg = d3.select('#d3-viz')
    .append('svg')
    .attr('viewBox', '0 0 ' + totalWidth + ' ' + totalHeight)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%');

  svg.append('defs')
    .append('filter')
    .attr('id', 'node-shadow')
    .append('feDropShadow')
    .attr('dx', 0).attr('dy', 1)
    .attr('stdDeviation', 2)
    .attr('flood-opacity', 0.25);

  var root = d3.hierarchy(treeData);
  d3.tree().size([innerW, innerH])(root);
  root.descendants().forEach(function(d) { d.y = levelY[d.data.level]; });

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Level markers
  var levelMarkers = g.append('g');
  [0, 1, 2].forEach(function(l) {
    levelMarkers.append('line')
      .attr('x1', -15).attr('x2', innerW + 15)
      .attr('y1', levelY[l]).attr('y2', levelY[l])
      .attr('stroke', '#eee').attr('stroke-dasharray', '4,4');
    levelMarkers.append('text')
      .attr('x', innerW + 20).attr('y', levelY[l] + 4)
      .attr('fill', '#bbb').attr('font-size', '12px')
      .attr('font-family', 'Courier New, monospace')
      .text('D' + l);
  });

  // Edge length labels
  g.append('text').attr('x', innerW * 0.15)
    .attr('y', (levelY[2] + levelY[1]) / 2 + 3)
    .attr('fill', '#aaa').attr('font-size', '10px')
    .attr('font-family', 'Courier New, monospace')
    .text('2² = 4');
  g.append('text').attr('x', innerW * 0.15)
    .attr('y', (levelY[1] + levelY[0]) / 2 + 3)
    .attr('fill', '#aaa').attr('font-size', '10px')
    .attr('font-family', 'Courier New, monospace')
    .text('2¹ = 2');

  // Edges
  var link = g.append('g').selectAll('path')
    .data(root.links()).enter().append('path')
    .attr('fill', 'none').attr('stroke', '#ccc')
    .attr('stroke-width', 2)
    .attr('d', function(d) {
      return 'M' + d.source.x + ',' + d.source.y + ' L' + d.target.x + ',' + d.target.y;
    });

  // Nodes
  var node = g.append('g').selectAll('g.node')
    .data(root.descendants()).enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  node.append('circle')
    .attr('r', function(d) { return d.data.level === 2 ? 14 : d.data.level === 1 ? 9 : 6; })
    .attr('fill', '#f5f5f5').attr('stroke', '#ccc').attr('stroke-width', 2);

  node.append('text').attr('class', 'node-label')
    .attr('x', function(d) { return d.data.level === 0 ? 10 : 0; })
    .attr('y', function(d) {
      return d.data.level === 0 ? 4 : -(d.data.level === 2 ? 20 : 14);
    })
    .attr('text-anchor', function(d) { return d.data.level === 0 ? 'start' : 'middle'; })
    .attr('font-size', '12px').attr('font-family', 'Courier New, monospace')
    .attr('fill', '#333').style('pointer-events', 'none')
    .text(function(d) { return d.data.name; });

  node.filter(function(d) { return d.data.level > 0; })
    .append('text')
    .attr('y', function(d) { return d.data.level === 2 ? -34 : -26; })
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px').attr('fill', '#999')
    .text(function(d) { return '(radius ' + d.data.radius + ')'; });

  // Color scales
  var colorsForLevel = {};
  colorsForLevel[2] = d3.scaleOrdinal().domain(['R']).range(['#2b8cbe']);
  colorsForLevel[1] = d3.scaleOrdinal().domain(['C1','C2','C3']).range(['#e41a1c','#377eb8','#4daf4a']);
  colorsForLevel[0] = d3.scaleOrdinal().domain(['a','b','c','d','e']).range(['#e41a1c','#f28e2b','#377eb8','#4daf4a','#984ea3']);

  function getClusterId(d, level) {
    var cur = d;
    while (cur && cur.data.level !== level) { cur = cur.parent; }
    return cur ? cur.data.id : null;
  }

  // Tooltip
  var tooltip = document.getElementById('viz-tooltip');

  node.on('mouseenter', function(ev, d) {
    tooltip.style.opacity = '1';
    tooltip.innerHTML = '<b>' + d.data.name + '</b><br>Level: D' + d.data.level + '<br>Radius: ' + d.data.radius;
    tooltip.style.left = (ev.clientX + 12) + 'px';
    tooltip.style.top = (ev.clientY - 10) + 'px';
  }).on('mousemove', function(ev) {
    tooltip.style.left = (ev.clientX + 12) + 'px';
    tooltip.style.top = (ev.clientY - 10) + 'px';
  }).on('mouseleave', function() {
    tooltip.style.opacity = '0';
  });

  function updateViz(level) {
    document.getElementById('partition-label').textContent = partitionLabels[level];

    link.transition().duration(400)
      .attr('stroke', function(d) {
        return d.source.data.level >= level ? '#888' : '#ddd';
      })
      .attr('stroke-width', function(d) {
        return d.source.data.level >= level ? 2.5 : 1;
      })
      .attr('stroke-opacity', function(d) {
        return d.source.data.level >= level ? 0.8 : 0.3;
      });

    node.select('circle').transition().duration(400)
      .attr('r', function(d) {
        if (d.data.level === level) return d.data.level === 2 ? 16 : 11;
        return d.data.level === 2 ? 14 : d.data.level === 1 ? 9 : 6;
      })
      .attr('fill', function(d) {
        if (d.data.level === level) {
          return colorsForLevel[level](getClusterId(d, level));
        }
        if (d.data.level > level) return '#f9f9f9';
        var c = d3.color(colorsForLevel[level](getClusterId(d, level)));
        if (c) { c.opacity = 0.35; return c + ''; }
        return '#f0f0f0';
      })
      .attr('stroke', function(d) {
        if (d.data.level === level) {
          var c = d3.color(colorsForLevel[level](getClusterId(d, level)));
          return c ? c.darker(0.5) + '' : '#333';
        }
        return d.data.level > level ? '#d0d0d0' : '#ccc';
      })
      .attr('stroke-width', function(d) { return d.data.level === level ? 3 : 1.5; })
      .attr('filter', function(d) {
        return d.data.level === level ? 'url(#node-shadow)' : null;
      });

    node.style('opacity', function(d) {
      return d.data.level >= level ? 1 : 0.55;
    });
  }

  d3.selectAll('.level-btn').on('click', function() {
    var level = parseInt(this.dataset.level);
    d3.selectAll('.level-btn').classed('active', false);
    d3.select(this).classed('active', true);
    updateViz(level);
  });

  updateViz(2);
});
</script>

## Laminar Families and the Induced Tree

What we have constructed is a *laminar family*, as mentioned in the paper. A hierarchical cut decomposition defines a laminar family.

Recall that a family $F \subseteq 2^V$ is called **laminar** if for any $A, B \in F$, it holds that

$$
A \subseteq B \quad \text{or} \quad B \subseteq A \quad \text{or} \quad A \cap B = \emptyset.
$$

Such families are particularly convenient because they admit a natural tree representation: each set corresponds to a node, and inclusion defines the parent-child structure. Thus, laminar families form a relatively simple algebraic structure from which trees can be constructed directly.

So we try to set the metric in a way that gives us a good distance: start from the root, it doubles, and the distance between two leaves is the distance to their least common ancestor in the tree.

Each node in $D_i$ is connected to each of its children in the tree by an edge of length $2^i$, which is an upper bound on the radius of the corresponding cluster $S$. This induces a distance function $d_T(\cdot,\cdot)$ on $V$, where $d_T(u,v)$ is defined as the shortest-path distance between the leaves corresponding to $\{u\}$ and $\{v\}$ in $T$.

Given this edge-length assignment, it is easy to see that

$$
d_T(u,v) \ge d(u,v), \quad \forall\, u,v \in V.
$$

## The Partition Algorithm

<blockquote style="background: #f8f9fa; border-left: 4px solid #2b8cbe; padding: 16px 20px; margin: 20px 0; font-family: 'Courier New', monospace; font-size: 14px; border-radius: 4px;">
<strong style="color: #045a8d; font-size: 15px;">Algorithm 1.</strong> <em>Partition(V, d)</em>
<br><br>
1. Choose a random permutation $\pi$ of $V$, denoted $v_1, v_2, \dots, v_n$.<br>
2. Choose $\beta$ uniformly at random from $[1,2]$.<br>
3. Set $D_\delta \leftarrow \{V\}$ and $i \leftarrow \delta - 1$.<br>
4. <strong>while</strong> $D_{i+1}$ contains at least one non-singleton cluster <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ 5. $\beta_i \leftarrow 2^{i-1}\beta$<br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ 6. <strong>for</strong> $l = 1,2,\dots,n$ <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ &nbsp;&nbsp;&nbsp;&nbsp;$\,$ 7. <strong>for each</strong> cluster $S \in D_{i+1}$ <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ &nbsp;&nbsp;&nbsp;&nbsp;$\,$ &nbsp;&nbsp;&nbsp;&nbsp;$\,$ 8. Create a new cluster consisting of all unassigned vertices $u \in S$ such that $d(u,\pi(l)) \le \beta_i$.<br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ &nbsp;&nbsp;&nbsp;&nbsp;$\,$ 9. <strong>end for</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ 10. <strong>end for</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;$\,$ 11. $i \leftarrow i - 1$<br>
12. <strong>end while</strong>
</blockquote>

<div class="algo-viz-card" id="partition-algo-viz">
  <div class="algo-controls">
    <button class="algo-btn primary" id="algo-randomize">Randomize &amp; Reset</button>
    <button class="algo-btn" id="algo-prev">◀ Step</button>
    <button class="algo-btn" id="algo-next">Step ▶</button>
    <button class="algo-btn" id="algo-play">▶ Play</button>
    <span class="algo-step-counter" id="algo-step-counter">Step 0 / 0</span>
  </div>
  <div class="algo-meta">
    <span><b>π:</b> <span id="algo-pi">—</span></span>
    <span><b>β:</b> <span id="algo-beta">—</span></span>
    <span><b>level i:</b> <span id="algo-level">—</span></span>
    <span><b>β<sub>i</sub>:</b> <span id="algo-beta-i">—</span></span>
    <span><b>center π(l):</b> <span id="algo-center">—</span></span>
  </div>
  <div class="algo-status" id="algo-status">Click <em>Randomize &amp; Reset</em> to draw a new permutation and scaling factor, then step through the partition.</div>
  <div class="algo-layout">
    <div id="algo-canvas" style="width: 100%; height: 400px;"></div>
    <div class="algo-partition-panel" id="algo-partition-panel">
      <h4>Partitions</h4>
      <div id="algo-partitions">—</div>
    </div>
  </div>
  <div style="margin-top: 10px; font-size: 12px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 8px;">
    The metric uses the same five-point example: {a,b} close, {c,d} close, e far. Highlighted vertices lie within distance β<sub>i</sub> of the current center; newly formed clusters appear on the right.
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  if (typeof d3 === 'undefined') return;

  var V = ['a', 'b', 'c', 'd', 'e'];
  var positions = {
    a: { x: 70, y: 220 },
    b: { x: 140, y: 220 },
    c: { x: 300, y: 220 },
    d: { x: 370, y: 220 },
    e: { x: 220, y: 70 }
  };
  var dist = {
    a: { a: 0, b: 1, c: 3, d: 4, e: 5 },
    b: { a: 1, b: 0, c: 3, d: 4, e: 5 },
    c: { a: 3, b: 3, c: 0, d: 1, e: 5 },
    d: { a: 4, b: 4, c: 1, d: 0, e: 5 },
    e: { a: 5, b: 5, c: 5, d: 5, e: 0 }
  };

  var width = 560, height = 400;
  var margin = { top: 24, right: 24, bottom: 24, left: 24 };
  var innerW = width - margin.left - margin.right;
  var innerH = height - margin.top - margin.bottom;
  var clusterColors = d3.scaleOrdinal()
    .domain(V)
    .range(['#e41a1c', '#f28e2b', '#377eb8', '#4daf4a', '#984ea3']);

  var svg = d3.select('#algo-canvas').append('svg')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%').style('height', '100%');

  var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  g.append('text').attr('x', innerW / 2).attr('y', -6)
    .attr('text-anchor', 'middle').attr('fill', '#999')
    .attr('font-size', '11px').attr('font-family', 'Courier New, monospace')
    .text('metric space (2D layout for illustration)');

  var linkG = g.append('g').attr('class', 'links');
  var nodeG = g.append('g').attr('class', 'nodes');
  var radiusG = g.append('g').attr('class', 'radius');

  var nodeData = V.map(function(id) {
    return { id: id, x: positions[id].x, y: positions[id].y };
  });

  var links = [];
  for (var i = 0; i < V.length; i++) {
    for (var j = i + 1; j < V.length; j++) {
      links.push({ source: V[i], target: V[j], d: dist[V[i]][V[j]] });
    }
  }

  linkG.selectAll('line').data(links).enter().append('line')
    .attr('x1', function(d) { return positions[d.source].x; })
    .attr('y1', function(d) { return positions[d.source].y; })
    .attr('x2', function(d) { return positions[d.target].x; })
    .attr('y2', function(d) { return positions[d.target].y; })
    .attr('stroke', '#e0e0e0').attr('stroke-width', 1);

  linkG.selectAll('text').data(links).enter().append('text')
    .attr('x', function(d) {
      return (positions[d.source].x + positions[d.target].x) / 2;
    })
    .attr('y', function(d) {
      return (positions[d.source].y + positions[d.target].y) / 2 - 4;
    })
    .attr('text-anchor', 'middle').attr('fill', '#ccc')
    .attr('font-size', '9px').attr('font-family', 'Courier New, monospace')
    .text(function(d) { return d.d; });

  var nodes = nodeG.selectAll('g.node').data(nodeData).enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  nodes.append('circle').attr('r', 16)
    .attr('fill', '#fff').attr('stroke', '#bbb').attr('stroke-width', 2);

  nodes.append('text').attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('font-size', '14px').attr('font-weight', '700')
    .attr('font-family', 'Courier New, monospace')
    .text(function(d) { return d.id; });

  var piOrderG = g.append('g').attr('class', 'pi-order');

  var state = { steps: [], index: 0, levels: {}, pi: [], beta: 1, playTimer: null };

  function shuffle(arr) {
    var a = arr.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = a[k]; a[k] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function buildSteps(pi, beta) {
    var steps = [];
    var maxDist = 0;
    V.forEach(function(u) {
      V.forEach(function(v) { maxDist = Math.max(maxDist, dist[u][v]); });
    });
    var delta = Math.ceil(Math.log(maxDist) / Math.LN2);
    var levels = {};
    levels[delta] = [V.slice()];
    steps.push({
      type: 'init',
      pi: pi.slice(),
      beta: beta,
      delta: delta,
      levels: JSON.parse(JSON.stringify(levels)),
      message: 'Choose permutation π = [' + pi.join(', ') + '] and β = ' + beta.toFixed(3) + ' ∈ [1,2]. Set D_' + delta + ' = {V}.'
    });

    var i = delta - 1;
    var current = levels[delta];

    while (i >= 0 && current.some(function(S) { return S.length > 1; })) {
      var beta_i = Math.pow(2, i - 1) * beta;
      var assigned = {};
      V.forEach(function(v) { assigned[v] = false; });
      var clusters = [];

      steps.push({
        type: 'level_start',
        i: i,
        beta_i: beta_i,
        parent: current.map(function(S) { return S.slice(); }),
        levels: JSON.parse(JSON.stringify(levels)),
        message: 'Level i = ' + i + ': set β_i = 2^{' + (i - 1) + '}·β = ' + beta_i.toFixed(3) + '. Refine D_' + (i + 1) + ' into D_' + i + '.'
      });

      for (var l = 0; l < V.length; l++) {
        var center = pi[l];
        for (var s = 0; s < current.length; s++) {
          var S = current[s];
          var candidates = S.filter(function(u) {
            return !assigned[u] && dist[u][center] <= beta_i;
          });
          steps.push({
            type: 'consider',
            i: i,
            l: l + 1,
            center: center,
            S: S.slice(),
            beta_i: beta_i,
            candidates: candidates.slice(),
            assigned: V.filter(function(u) { return assigned[u]; }),
            clusters: clusters.map(function(c) { return c.slice(); }),
            message: candidates.length
              ? 'Center π(' + (l + 1) + ') = ' + center + ' claims unassigned vertices in ' + JSON.stringify(S) + ' with d(·,' + center + ') ≤ ' + beta_i.toFixed(3) + ': ' + JSON.stringify(candidates) + '.'
              : 'Center π(' + (l + 1) + ') = ' + center + ': no new vertices claimed from ' + JSON.stringify(S) + '.'
          });
          if (candidates.length > 0) {
            clusters.push(candidates.slice());
            candidates.forEach(function(u) { assigned[u] = true; });
            var partial = {};
            partial[i] = clusters.map(function(c) { return c.slice(); });
            steps.push({
              type: 'assign',
              i: i,
              l: l + 1,
              center: center,
              cluster: candidates.slice(),
              beta_i: beta_i,
              assigned: V.filter(function(u) { return assigned[u]; }),
              clusters: clusters.map(function(c) { return c.slice(); }),
              levels: JSON.parse(JSON.stringify(Object.assign({}, levels, partial))),
              message: 'Form cluster ' + JSON.stringify(candidates) + ' around center ' + center + '.'
            });
          }
        }
      }

      // Add any still unassigned vertices as singleton clusters
      V.forEach(function(u) {
        if (!assigned[u]) {
          clusters.push([u]);
          assigned[u] = true;
        }
      });
      if (clusters.some(function(c) { return c.length === 1; })) {
        steps.push({
          type: 'singletons',
          i: i,
          clusters: clusters.map(function(c) { return c.slice(); }),
          levels: JSON.parse(JSON.stringify(Object.assign({}, levels, {[i]: clusters.map(function(c) { return c.slice(); })}))),
          message: 'Remaining vertices form singleton clusters.'
        });
      }

      levels[i] = clusters.map(function(c) { return c.slice(); });
      current = levels[i];
      steps.push({
        type: 'level_end',
        i: i,
        beta_i: beta_i,
        partition: clusters.map(function(c) { return c.slice(); }),
        levels: JSON.parse(JSON.stringify(levels)),
        message: 'D_' + i + ' = ' + clusters.map(function(c) { return JSON.stringify(c); }).join('  ') + '.'
      });
      i--;
    }

    steps.push({
      type: 'done',
      levels: JSON.parse(JSON.stringify(levels)),
      message: 'Partition complete. Each D_i is a 2^i-cut decomposition refining the level above.'
    });

    return { steps: steps, levels: levels, delta: delta };
  }

  function clusterColor(cluster, idx) {
    return clusterColors(cluster[0]);
  }

  function renderPartitionPanel(levels, activeLevel, activeCluster) {
    var html = '';
    var keys = Object.keys(levels).map(Number).sort(function(a, b) { return b - a; });
    keys.forEach(function(lv) {
      html += '<div class="algo-level-block"><div class="level-title">D<sub>' + lv + '</sub></div>';
      levels[lv].forEach(function(cluster, idx) {
        var isActive = lv === activeLevel && activeCluster && activeCluster.join() === cluster.join();
        var color = clusterColor(cluster, idx);
        html += '<span class="algo-cluster' + (isActive ? ' active' : '') + '" style="border-color:' + color + ';background:' + color + '22">' + '{' + cluster.join(',') + '}' + '</span>';
      });
      html += '</div>';
    });
    document.getElementById('algo-partitions').innerHTML = html || '—';
  }

  function metricRadius(center, beta_i) {
    var cx = positions[center].x;
    var cy = positions[center].y;
    var maxPixel = 0;
    V.forEach(function(u) {
      if (dist[u][center] <= beta_i) {
        var dx = positions[u].x - cx;
        var dy = positions[u].y - cy;
        maxPixel = Math.max(maxPixel, Math.sqrt(dx * dx + dy * dy));
      }
    });
    return Math.max(maxPixel + 12, 28);
  }

  function renderStep(step, index) {
    var levels = step.levels || state.levels;
    state.levels = levels;

    document.getElementById('algo-status').textContent = step.message;
    document.getElementById('algo-step-counter').textContent = 'Step ' + index + ' / ' + (state.steps.length - 1);

    if (step.type === 'init' || step.type === 'done') {
      document.getElementById('algo-pi').textContent = '[' + (step.pi || state.pi).join(', ') + ']';
      document.getElementById('algo-beta').textContent = (step.beta != null ? step.beta : state.beta).toFixed(3);
      document.getElementById('algo-level').textContent = '—';
      document.getElementById('algo-beta-i').textContent = '—';
      document.getElementById('algo-center').textContent = '—';
    } else {
      document.getElementById('algo-pi').textContent = '[' + state.pi.join(', ') + ']';
      document.getElementById('algo-beta').textContent = state.beta.toFixed(3);
      document.getElementById('algo-level').textContent = step.i != null ? step.i : '—';
      document.getElementById('algo-beta-i').textContent = step.beta_i != null ? step.beta_i.toFixed(3) : '—';
      document.getElementById('algo-center').textContent = step.center != null ? step.center + '  (l = ' + step.l + ')' : '—';
    }

    var activeLevel = null;
    var activeCluster = null;
    if (step.type === 'assign') {
      activeLevel = step.i;
      activeCluster = step.cluster;
    }

    renderPartitionPanel(levels, activeLevel, activeCluster);

    piOrderG.selectAll('*').remove();
    state.pi.forEach(function(v, idx) {
      var p = positions[v];
      piOrderG.append('text')
        .attr('x', p.x).attr('y', p.y + 30)
        .attr('text-anchor', 'middle').attr('fill', '#bbb')
        .attr('font-size', '10px').attr('font-family', 'Courier New, monospace')
        .text('π(' + (idx + 1) + ')');
    });

    radiusG.selectAll('*').remove();
    if (step.center && step.beta_i != null && (step.type === 'consider' || step.type === 'assign')) {
      var r = metricRadius(step.center, step.beta_i);
      radiusG.append('circle')
        .attr('cx', positions[step.center].x)
        .attr('cy', positions[step.center].y)
        .attr('r', r)
        .attr('fill', 'rgba(43,140,190,0.08)')
        .attr('stroke', '#2b8cbe')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6,4');
    }

    nodes.select('circle').transition().duration(250)
      .attr('fill', function(d) {
        if (step.type === 'consider' || step.type === 'assign') {
          if (d.id === step.center) return '#2b8cbe';
          if (step.candidates && step.candidates.indexOf(d.id) >= 0) return clusterColors(d.id) + '55';
          if (step.assigned && step.assigned.indexOf(d.id) >= 0) return '#f0f0f0';
        }
        if (step.type === 'level_end' || step.type === 'done' || step.type === 'singletons') {
          var lv = step.i != null ? step.i : 0;
          var part = step.partition || (levels[lv] || []);
          for (var c = 0; c < part.length; c++) {
            if (part[c].indexOf(d.id) >= 0) return clusterColors(part[c][0]) + '44';
          }
        }
        return '#fff';
      })
      .attr('stroke', function(d) {
        if ((step.type === 'consider' || step.type === 'assign') && d.id === step.center) return '#045a8d';
        if (step.candidates && step.candidates.indexOf(d.id) >= 0) return clusterColors(d.id);
        return '#bbb';
      })
      .attr('stroke-width', function(d) {
        if (d.id === step.center) return 3;
        if (step.candidates && step.candidates.indexOf(d.id) >= 0) return 2.5;
        return 2;
      })
      .attr('r', function(d) {
        return d.id === step.center ? 20 : 16;
      });

    nodes.select('text').attr('fill', function(d) {
      return d.id === step.center ? '#045a8d' : '#333';
    });
  }

  function goTo(index) {
    state.index = Math.max(0, Math.min(index, state.steps.length - 1));
    renderStep(state.steps[state.index], state.index);
  }

  function randomize() {
    if (state.playTimer) { clearInterval(state.playTimer); state.playTimer = null; }
    state.pi = shuffle(V);
    state.beta = 1 + Math.random();
    var built = buildSteps(state.pi, state.beta);
    state.steps = built.steps;
    state.levels = built.levels;
    goTo(0);
    document.getElementById('algo-play').textContent = '▶ Play';
  }

  document.getElementById('algo-randomize').addEventListener('click', randomize);
  document.getElementById('algo-prev').addEventListener('click', function() { goTo(state.index - 1); });
  document.getElementById('algo-next').addEventListener('click', function() { goTo(state.index + 1); });
  document.getElementById('algo-play').addEventListener('click', function() {
    if (state.playTimer) {
      clearInterval(state.playTimer);
      state.playTimer = null;
      this.textContent = '▶ Play';
      return;
    }
    var btn = this;
    btn.textContent = '⏸ Pause';
    state.playTimer = setInterval(function() {
      if (state.index >= state.steps.length - 1) {
        clearInterval(state.playTimer);
        state.playTimer = null;
        btn.textContent = '▶ Play';
        return;
      }
      goTo(state.index + 1);
    }, 900);
  });

  randomize();
});
</script>

What are we doing? Notice that in each cluster in the process, we have a set of refinements. Now what we are going to do is set the new distance, and we want to cluster the vertices close to each other and refine it further. For that we should really choose a center to distinguish distances from, and we do that by randomizing the vertices available and choosing the first vertex and setting it as a means to further refine the cluster. For example, all the vertices which have distance less than $\beta_i$ to a $\pi(l)$ will be in the same cluster.

## Analysis

Now we should try to analyze it. The expected value of $d_T(u,v)$ is bounded by $O(\log n)\cdot d(u,v)$.

We make no attempt to optimize constants in this analysis. From the discussion above, it follows that

$$
\mathbb{E}[d_T(u,v)] \le \sum_{i=0}^{\delta} \Pr[(u,v)\ \text{is at level } i]\cdot 2^{i+2}.
\tag{1}
$$

Note that if $(u,v)$ is at level $i$, then

$$
d_T(u,v) = 2\sum_{j=0}^{i} 2^j \le 2^{i+2}.
$$

If vertices $u$ and $v$ are in separate clusters in $D_i$, we say that $D_i$ *separates* $(u,v)$. Note that $(u,v)$ is at level $i$ if:

- (a) $D_i$ separates $(u,v)$,
- (b) $D_j$ does not separate $(u,v)$ for any $j > i$.

Clearly, if $d(u,v) > 2^{i+2}$, then $u$ and $v$ cannot lie in the same cluster in $D_{i+1}$, i.e., $D_{i+1}$ separates $(u,v)$. From condition (b), it follows that $(u,v)$ cannot be at level $i$.

Let $j^*$ be the smallest index $i$ such that

$$
d(u,v) \le 2^{i+2}.
$$

Thus,

$$
\Pr[(u,v)\ \text{is at level } i] = 0 \quad \text{for all } i < j^*.
$$

For $i \ge j^*$, we bound the probability that $(u,v)$ is at level $i$. From conditions (a) and (b), for any $i \ge j^*$,

$$
\begin{aligned}
\Pr[(u,v)\ \text{is at level } i]
&= \Pr[D_i \text{ separates } (u,v)] \\
&\quad \cdot \Pr\big[\exists j > i : D_j \text{ separates } (u,v)\mid D_i \text{ separates } (u,v)\big] \\
&\le \Pr[D_i \text{ separates } (u,v)].
\end{aligned}
$$

For any $j^* \le j \le \delta$, let $K_j^u$ be the set of vertices in $V$ closer than $2^j$ to vertex $u$, and let $k_j^u = |K_j^u|$. Similarly define $K_j^v$ and $k_j^v$. For $j < j^*$, we define $k_j^u = 0$.

We say that a center $w$ *cuts $u$ out of $(u,v)$ at level $i$* if $w$ cuts $(u,v)$ at level $i$ and $u$ is assigned to $w$ (while $v$ is not assigned to $w$) at this level.

Let $w_1, w_2, \dots, w_{k_i^u}$ be the centers ordered by increasing distance from $u$ at level $i$. For a center $w_s$ to cut $(u,v)$ in a way that only $u$ is assigned to $w_s$, the following conditions must hold:

- (a) $d(u,w_s) \le \beta_i$,
- (b) $d(v,w_s) > \beta_i$,
- (c) $w_s$ is the first center that settles $u$ at this level.

Thus $\beta_i$ must lie in the interval $[d(u,w_s), d(v,w_s)]$. By the triangle inequality,

$$
d(v,w_s) \le d(v,u) + d(u,w_s),
$$

and hence the interval $[d(u,w_s), d(v,w_s)]$ has length at most $d(u,v)$.

Since $\beta_i$ is chosen uniformly in $[2^{i-1},2^i]$ (by construction), the probability that $\beta_i$ falls into this "bad" interval is at most

$$
\frac{d(u,v)}{2^{i-1}}.
$$

It follows that the probability that $D_i$ separates $(u,v)$ is bounded by

$$
\begin{aligned}
\Pr[D_i \text{ separates } (u,v)]
&\le \sum_{s=1}^{k_i^u} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s}
+ \sum_{s=1}^{k_i^v} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s} \\
&\le \frac{d(u,v)}{2^{i-1}} \left(\ln k_i^u + \ln k_i^v\right).
\end{aligned}
$$

Thus each level $i$ contributes at most $O(\log n)$ to the expected value of $d_T(u,v)$ (see Equation (1)), and hence the expected distance is bounded by

$$
\mathbb{E}[d_T(u,v)] \le O(\log n \log \Delta)\, d(u,v).
$$