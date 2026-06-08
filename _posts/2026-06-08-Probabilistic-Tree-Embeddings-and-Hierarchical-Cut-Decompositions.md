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

$
\mathbb{E}_{d' \sim \mathcal{D}}[d'(u, v)] \le \alpha \cdot d(u, v).
$

## Hierarchical Cut Decomposition

Let $(V,d)$ be a finite metric space. For a parameter $r > 0$, an $r$-cut decomposition is a partition of $V$ into clusters such that:
- Each cluster is associated with a center vertex,
- Every vertex in a cluster lies within distance at most $r$ from its center.

Thus, every cluster has diameter at most $2r$.

A **hierarchical cut decomposition** is a sequence of nested partitions:

$
D_0, D_1, \dots, D_\delta
$

such that:
- $D_\delta = \{V\}$ (the trivial partition),
- $D_i$ is a $2^i$-cut decomposition,
- $D_i$ refines $D_{i+1}$ for all $i$ (i.e., every cluster in $D_i$ is contained in some cluster of $D_{i+1}$).

At the finest level, $D_0$ consists of singleton clusters.

### Intuition

This construction organizes the metric space in a top-down manner. At large scale, points are grouped into coarse clusters, and as the scale decreases, these clusters are recursively refined into smaller ones. This yields a multiscale representation of the metric that can be viewed as a tree-like structure.

### Example

Consider a metric space $(V,d)$ where:

$
V = \{a,b,c,d,e\}
$

Suppose the distances are such that:
- $\{a,b\}$ are very close,
- $\{c,d\}$ are very close,
- $e$ is far from all others.

We construct a hierarchical cut decomposition:

#### Level $D_0$ (radius $1$)
Each vertex is a singleton:
$
D_0 = \big\{ \{a\}, \{b\}, \{c\}, \{d\}, \{e\} \big\}
$

#### Level $D_1$ (radius $2$)
Close points are grouped:
$
D_1 = \big\{ \{a,b\}, \{c,d\}, \{e\} \big\}
$

#### Level $D_2$ (radius $4$)
Further merging:
$
D_2 = \big\{ \{a,b,c,d,e\} \big\}
$

Notice the refinement property:
$
D_0 \prec D_1 \prec D_2
$

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
</style>

<div class="viz-card">
  <div class="viz-controls">
    <button class="level-btn active" data-level="2">D&#x2082; (radius 4)</button>
    <button class="level-btn" data-level="1">D&#x2081; (radius 2)</button>
    <button class="level-btn" data-level="0">D&#x2080; (radius 1)</button>
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
  const container = document.getElementById('d3-viz');
  if (!container) return;

  const totalWidth = 820;
  const totalHeight = 440;
  const margin = { top: 50, right: 100, bottom: 50, left: 50 };
  const innerW = totalWidth - margin.left - margin.right;
  const innerH = totalHeight - margin.top - margin.bottom;

  const treeData = {
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

  const partitionLabels = {
    2: 'Partition: {a,b,c,d,e}',
    1: 'Partition: {a,b}  {c,d}  {e}',
    0: 'Partition: {a} {b} {c} {d} {e}'
  };

  const levelY = { 0: innerH - 20, 1: innerH * 0.55, 2: 30 };

  const svg = d3.select('#d3-viz')
    .append('svg')
    .attr('viewBox', [0, 0, totalWidth, totalHeight])
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

  const root = d3.hierarchy(treeData);
  d3.tree().size([innerW, innerH])(root);
  root.descendants().forEach(d => { d.y = levelY[d.data.level]; });

  const g = svg.append('g')
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
    .text('2\u00B2 = 4');
  g.append('text').attr('x', innerW * 0.15)
    .attr('y', (levelY[1] + levelY[0]) / 2 + 3)
    .attr('fill', '#aaa').attr('font-size', '10px')
    .attr('font-family', 'Courier New, monospace')
    .text('2\u00B9 = 2');

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
  var colorsForLevel = {
    2: d3.scaleOrdinal().domain(['R']).range(['#2b8cbe']),
    1: d3.scaleOrdinal().domain(['C1','C2','C3']).range(['#e41a1c','#377eb8','#4daf4a']),
    0: d3.scaleOrdinal().domain(['a','b','c','d','e']).range(['#e41a1c','#f28e2b','#377eb8','#4daf4a','#984ea3'])
  };

  function getClusterId(d, level) {
    var cur = d;
    while (cur && cur.data.level !== level) cur = cur.parent;
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

  var currentLevel = 2;

  function updateViz(level) {
    currentLevel = level;
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

$
A \subseteq B \quad \text{or} \quad B \subseteq A \quad \text{or} \quad A \cap B = \emptyset.
$

Such families are particularly convenient because they admit a natural tree representation: each set corresponds to a node, and inclusion defines the parent-child structure. Thus, laminar families form a relatively simple algebraic structure from which trees can be constructed directly.

So we try to set the metric in a way that gives us a good distance: start from the root, it doubles, and the distance between two leaves is the distance to their least common ancestor in the tree.

Each node in $D_i$ is connected to each of its children in the tree by an edge of length $2^i$, which is an upper bound on the radius of the corresponding cluster $S$. This induces a distance function $d_T(\cdot,\cdot)$ on $V$, where $d_T(u,v)$ is defined as the shortest-path distance between the leaves corresponding to $\{u\}$ and $\{v\}$ in $T$.

Given this edge-length assignment, it is easy to see that

$
d_T(u,v) \ge d(u,v), \quad \forall\, u,v \in V.
$

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

What are we doing? Notice that in each cluster in the process, we have a set of refinements. Now, what we do is set the new distance, and we want to cluster the vertices close to each other and refine it further. For that we should really choose a center to distinguish distances from, and we do that by randomizing the vertices available and choosing the first vertex and setting it as a means to further refine the cluster. For example, all the vertices which have distance less than $\beta_i$ to a $\pi(l)$ will be in the same cluster.

## Analysis

Now we should try to analyze it. The expected value of $d_T(u,v)$ is bounded by $O(\log n)\cdot d(u,v)$.

We make no attempt to optimize constants in this analysis. From the discussion above, it follows that

$
\mathbb{E}[d_T(u,v)] \le \sum_{i=0}^{\delta} \Pr[(u,v)\ \text{is at level } i]\cdot 2^{i+2}.
\tag{1}
$

Note that if $(u,v)$ is at level $i$, then

$
d_T(u,v) = 2\sum_{j=0}^{i} 2^j \le 2^{i+2}.
$

If vertices $u$ and $v$ are in separate clusters in $D_i$, we say that $D_i$ *separates* $(u,v)$. Note that $(u,v)$ is at level $i$ if:

- (a) $D_i$ separates $(u,v)$,
- (b) $D_j$ does not separate $(u,v)$ for any $j > i$.

Clearly, if $d(u,v) > 2^{i+2}$, then $u$ and $v$ cannot lie in the same cluster in $D_{i+1}$, i.e., $D_{i+1}$ separates $(u,v)$. From condition (b), it follows that $(u,v)$ cannot be at level $i$.

Let $j^*$ be the smallest index $i$ such that

$
d(u,v) \le 2^{i+2}.
$

Thus,

$
\Pr[(u,v)\ \text{is at level } i] = 0 \quad \text{for all } i < j^*.
$

For $i \ge j^*$, we bound the probability that $(u,v)$ is at level $i$. From conditions (a) and (b), for any $i \ge j^*$,

$
\begin{aligned}
\Pr[(u,v)\ \text{is at level } i]
&= \Pr[D_i \text{ separates } (u,v)] \\
&\quad \cdot \Pr\big[\exists j > i : D_j \text{ separates } (u,v)\mid D_i \text{ separates } (u,v)\big] \\
&\le \Pr[D_i \text{ separates } (u,v)].
\end{aligned}
$

For any $j^* \le j \le \delta$, let $K_j^u$ be the set of vertices in $V$ closer than $2^j$ to vertex $u$, and let $k_j^u = |K_j^u|$. Similarly define $K_j^v$ and $k_j^v$. For $j < j^*$, we define $k_j^u = 0$.

We say that a center $w$ *cuts $u$ out of $(u,v)$ at level $i$* if $w$ cuts $(u,v)$ at level $i$ and $u$ is assigned to $w$ (while $v$ is not assigned to $w$) at this level.

Let $w_1, w_2, \dots, w_{k_i^u}$ be the centers ordered by increasing distance from $u$ at level $i$. For a center $w_s$ to cut $(u,v)$ in a way that only $u$ is assigned to $w_s$, the following conditions must hold:

- (a) $d(u,w_s) \le \beta_i$,
- (b) $d(v,w_s) > \beta_i$,
- (c) $w_s$ is the first center that settles $u$ at this level.

Thus $\beta_i$ must lie in the interval $[d(u,w_s), d(v,w_s)]$. By the triangle inequality,

$
d(v,w_s) \le d(v,u) + d(u,w_s),
$

and hence the interval $[d(u,w_s), d(v,w_s)]$ has length at most $d(u,v)$.

Since $\beta_i$ is chosen uniformly in $[2^{i-1},2^i]$ (by construction), the probability that $\beta_i$ falls into this "bad" interval is at most

$
\frac{d(u,v)}{2^{i-1}}.
$

It follows that the probability that $D_i$ separates $(u,v)$ is bounded by

$
\begin{aligned}
\Pr[D_i \text{ separates } (u,v)]
&\le \sum_{s=1}^{k_i^u} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s}
+ \sum_{s=1}^{k_i^v} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s} \\
&\le \frac{d(u,v)}{2^{i-1}} \left(\ln k_i^u + \ln k_i^v\right).
\end{aligned}
$

Thus each level $i$ contributes at most $O(\log n)$ to the expected value of $d_T(u,v)$ (see Equation (1)), and hence the expected distance is bounded by

$
\mathbb{E}[d_T(u,v)] \le O(\log n \log \Delta)\, d(u,v).
$
