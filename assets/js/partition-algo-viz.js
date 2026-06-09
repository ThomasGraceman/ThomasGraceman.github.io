(function () {
  'use strict';

  var V = ['a', 'b', 'c', 'd', 'e'];

  var dist = {
    a: { a: 0, b: 1, c: 3, d: 4, e: 5 },
    b: { a: 1, b: 0, c: 3, d: 4, e: 5 },
    c: { a: 3, b: 3, c: 0, d: 1, e: 5 },
    d: { a: 4, b: 4, c: 1, d: 0, e: 5 },
    e: { a: 5, b: 5, c: 5, d: 5, e: 0 }
  };

  var positions = {
    a: { x: 55, y: 210 },
    b: { x: 125, y: 210 },
    c: { x: 285, y: 210 },
    d: { x: 355, y: 210 },
    e: { x: 205, y: 55 }
  };

  var clusterColors = {
    a: '#e41a1c', b: '#f28e2b', c: '#377eb8', d: '#4daf4a', e: '#984ea3'
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = a[k];
      a[k] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function computeDelta() {
    var maxDist = 0;
    V.forEach(function (u) {
      V.forEach(function (v) { maxDist = Math.max(maxDist, dist[u][v]); });
    });
    return Math.max(1, Math.ceil(Math.log(maxDist) / Math.LN2) - 1);
  }

  function cloneLevels(levels) {
    var out = {};
    Object.keys(levels).forEach(function (k) {
      out[k] = levels[k].map(function (c) { return c.slice(); });
    });
    return out;
  }

  function fmtSet(arr) {
    return '{' + arr.join(',') + '}';
  }

  function clusterKey(cluster) {
    return cluster.slice().sort().join(',');
  }

  function findParentCluster(vertex, partition) {
    for (var i = 0; i < partition.length; i++) {
      if (partition[i].indexOf(vertex) >= 0) {
        return partition[i];
      }
    }
    return null;
  }

  function partitionRefines(fine, coarse) {
    return fine.every(function (fCluster) {
      return coarse.some(function (cCluster) {
        return fCluster.every(function (v) { return cCluster.indexOf(v) >= 0; });
      });
    });
  }

  function runPartition(pi, beta) {
    var delta = computeDelta();
    var levels = {};
    levels[delta] = [V.slice()];

    var i = delta - 1;
    var current = levels[delta].map(function (c) { return c.slice(); });

    while (i >= 0 && current.some(function (S) { return S.length > 1; })) {
      var beta_i = Math.pow(2, i - 1) * beta;
      var assigned = {};
      V.forEach(function (v) { assigned[v] = false; });
      var clusters = [];

      for (var l = 0; l < V.length; l++) {
        var center = pi[l];
        for (var s = 0; s < current.length; s++) {
          var S = current[s];
          var candidates = S.filter(function (u) {
            return !assigned[u] && dist[u][center] <= beta_i;
          });
          if (candidates.length > 0) {
            clusters.push(candidates.slice());
            candidates.forEach(function (u) { assigned[u] = true; });
          }
        }
      }

      levels[i] = clusters.map(function (c) { return c.slice(); });
      current = levels[i];
      i--;
    }

    if (!levels[0]) {
      var finest = levels[1] || levels[delta];
      if (finest && finest.every(function (c) { return c.length === 1; })) {
        levels[0] = finest.map(function (c) { return c.slice(); });
      } else {
        levels[0] = V.map(function (v) { return [v]; });
      }
    }

    return { levels: levels, delta: delta };
  }

  function buildSteps(pi, beta) {
    var steps = [];
    var delta = computeDelta();
    var levels = {};
    levels[delta] = [V.slice()];

    steps.push({
      type: 'init',
      pi: pi.slice(),
      beta: beta,
      delta: delta,
      levels: cloneLevels(levels),
      highlightLevel: delta,
      message: 'Draw \u03C0 = [' + pi.join(', ') + '] and \u03B2 = ' + beta.toFixed(3) + ' \u2208 [1,2]. Start with D_' + delta + ' = {V}.'
    });

    var i = delta - 1;
    var current = levels[delta].map(function (c) { return c.slice(); });

    while (i >= 0 && current.some(function (S) { return S.length > 1; })) {
      var beta_i = Math.pow(2, i - 1) * beta;
      var assigned = {};
      V.forEach(function (v) { assigned[v] = false; });
      var clusters = [];
      var partialLevels = cloneLevels(levels);

      steps.push({
        type: 'level_start',
        i: i,
        beta_i: beta_i,
        parent: current.map(function (S) { return S.slice(); }),
        levels: cloneLevels(levels),
        partial: [],
        highlightLevel: i + 1,
        message: 'Refine D_' + (i + 1) + ' into D_' + i + ' using \u03B2_i = 2^{' + (i - 1) + '}\u00B7\u03B2 = ' + beta_i.toFixed(3) + '.'
      });

      for (var l = 0; l < V.length; l++) {
        var center = pi[l];
        for (var s = 0; s < current.length; s++) {
          var S = current[s];
          var candidates = S.filter(function (u) {
            return !assigned[u] && dist[u][center] <= beta_i;
          });

          if (candidates.length === 0) {
            continue;
          }

          clusters.push(candidates.slice());
          candidates.forEach(function (u) { assigned[u] = true; });
          partialLevels[i] = clusters.map(function (c) { return c.slice(); });

          steps.push({
            type: 'assign',
            i: i,
            l: l + 1,
            center: center,
            cluster: candidates.slice(),
            S: S.slice(),
            beta_i: beta_i,
            assigned: V.filter(function (u) { return assigned[u]; }),
            levels: cloneLevels(levels),
            partial: clusters.map(function (c) { return c.slice(); }),
            highlightLevel: i,
            message: 'Center \u03C0(' + (l + 1) + ') = ' + center + ' settles ' + fmtSet(candidates) + ' from parent cluster ' + fmtSet(S) + ' (all unassigned u with d(u,' + center + ') \u2264 ' + beta_i.toFixed(3) + ').'
          });
        }
      }

      levels[i] = clusters.map(function (c) { return c.slice(); });
      current = levels[i];
      partialLevels = cloneLevels(levels);

      steps.push({
        type: 'level_end',
        i: i,
        beta_i: beta_i,
        partition: clusters.map(function (c) { return c.slice(); }),
        levels: cloneLevels(levels),
        partial: [],
        highlightLevel: i,
        message: 'Finished D_' + i + ' = ' + clusters.map(fmtSet).join('  ') + '.'
      });
      i--;
    }

    var finalLevels = runPartition(pi, beta).levels;
    var levelKeys = Object.keys(finalLevels).map(Number).sort(function (a, b) { return b - a; });
    var refineOk = true;
    for (var k = 0; k < levelKeys.length - 1; k++) {
      var coarse = levelKeys[k];
      var fine = levelKeys[k + 1];
      if (!partitionRefines(finalLevels[fine], finalLevels[coarse])) {
        refineOk = false;
      }
    }

    var summary = levelKeys.map(function (lv) {
      return 'D_' + lv + ' = ' + finalLevels[lv].map(fmtSet).join('  ');
    }).join(' \u227A ');

    var showcase = 1;
    if (!finalLevels[1] || finalLevels[1].every(function (c) { return c.length === 1; })) {
      showcase = 0;
    }

    steps.push({
      type: 'done',
      pi: pi.slice(),
      beta: beta,
      levels: cloneLevels(finalLevels),
      highlightLevel: showcase,
      refineOk: refineOk,
      message: 'Done. ' + summary + (refineOk ? ' (each level refines the one above).' : '')
    });

    return steps;
  }

  function clusterColorForVertex(vertex, partition) {
    var cluster = findParentCluster(vertex, partition);
    if (!cluster) {
      return '#fff';
    }
    return clusterColors[cluster[0]];
  }

  function initPartitionAlgoViz() {
    if (typeof d3 === 'undefined') {
      console.error('partition-algo-viz: d3 not loaded');
      return;
    }

    var canvas = document.getElementById('algo-canvas');
    if (!canvas || canvas.getAttribute('data-initialized') === 'true') {
      return;
    }
    canvas.setAttribute('data-initialized', 'true');

    var width = 512;
    var height = 360;
    var margin = { top: 20, right: 16, bottom: 16, left: 16 };
    var innerW = width - margin.left - margin.right;

    var svg = d3.select(canvas).append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%');

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    g.append('text')
      .attr('x', innerW / 2).attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#999')
      .attr('font-size', '11px')
      .attr('font-family', 'Courier New, monospace')
      .text('metric space (edge labels are d(\u00B7,\u00B7))');

    var links = [];
    for (var i = 0; i < V.length; i++) {
      for (var j = i + 1; j < V.length; j++) {
        links.push({ source: V[i], target: V[j], d: dist[V[i]][V[j]] });
      }
    }

    g.append('g').selectAll('line')
      .data(links).enter().append('line')
      .attr('x1', function (d) { return positions[d.source].x; })
      .attr('y1', function (d) { return positions[d.source].y; })
      .attr('x2', function (d) { return positions[d.target].x; })
      .attr('y2', function (d) { return positions[d.target].y; })
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1);

    g.append('g').selectAll('text.edge-label')
      .data(links).enter().append('text')
      .attr('x', function (d) { return (positions[d.source].x + positions[d.target].x) / 2; })
      .attr('y', function (d) { return (positions[d.source].y + positions[d.target].y) / 2 - 5; })
      .attr('text-anchor', 'middle')
      .attr('fill', '#ccc')
      .attr('font-size', '9px')
      .attr('font-family', 'Courier New, monospace')
      .text(function (d) { return d.d; });

    var highlightG = g.append('g').attr('class', 'highlights');

    var nodes = g.append('g').selectAll('g.node')
      .data(V.map(function (id) { return { id: id, x: positions[id].x, y: positions[id].y }; }))
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    nodes.append('circle')
      .attr('r', 16)
      .attr('fill', '#fff')
      .attr('stroke', '#bbb')
      .attr('stroke-width', 2);

    nodes.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('font-family', 'Courier New, monospace')
      .text(function (d) { return d.id; });

    var piOrderG = g.append('g').attr('class', 'pi-order');

    var state = { steps: [], index: 0, levels: {}, pi: [], beta: 1, playTimer: null };

    function renderPartitionPanel(step) {
      var el = document.getElementById('algo-partitions');
      if (!el) { return; }

      var levels = step.levels || state.levels;
      var keys = Object.keys(levels).map(Number).sort(function (a, b) { return b - a; });
      var html = '';
      var highlightLevel = step.highlightLevel;

      keys.forEach(function (lv) {
        var isCurrent = step.type === 'level_start' && lv === step.i + 1;
        var isBuilding = (step.type === 'assign' || step.type === 'level_end') && lv === step.i;
        var isDoneFocus = step.type === 'done' && lv === step.highlightLevel;
        var titleExtra = isCurrent ? ' \u2190 refining' : (isBuilding ? ' \u2190 building' : (isDoneFocus ? ' \u2190 highlight' : ''));

        html += '<div class="algo-level-block"><div class="level-title">D<sub>' + lv + '</sub>' + titleExtra + '</div>';

        if (isBuilding && step.partial && step.partial.length > 0 && step.type === 'assign') {
          step.partial.forEach(function (cluster) {
            var isActive = step.cluster && clusterKey(cluster) === clusterKey(step.cluster);
            var color = clusterColors[cluster[0]];
            html += '<span class="algo-cluster' + (isActive ? ' active' : '') + '" style="border-color:' + color + ';background:' + color + '22">' + fmtSet(cluster) + '</span>';
          });
        } else {
          levels[lv].forEach(function (cluster) {
            var isActive = step.type === 'assign' && step.cluster && clusterKey(cluster) === clusterKey(step.cluster);
            var isParent = (step.type === 'assign' || step.type === 'level_start') && step.parent && step.parent.some(function (p) {
              return clusterKey(p) === clusterKey(cluster);
            });
            var color = clusterColors[cluster[0]];
            html += '<span class="algo-cluster' + (isActive ? ' active' : '') + (isParent ? ' parent' : '') + (isDoneFocus ? ' done-focus' : '') + '" style="border-color:' + color + ';background:' + color + '22">' + fmtSet(cluster) + '</span>';
          });
        }

        html += '</div>';
      });

      el.innerHTML = html || '\u2014';
    }

    function colorPartition(step) {
      var levels = step.levels || state.levels;
      var lv = step.highlightLevel;
      if (lv == null || !levels[lv]) {
        return null;
      }
      return levels[lv];
    }

    function renderStep(step, index) {
      state.levels = step.levels || state.levels;

      var status = document.getElementById('algo-status');
      var counter = document.getElementById('algo-step-counter');
      if (status) { status.textContent = step.message; }
      if (counter) { counter.textContent = 'Step ' + index + ' / ' + (state.steps.length - 1); }

      var piEl = document.getElementById('algo-pi');
      var betaEl = document.getElementById('algo-beta');
      var levelEl = document.getElementById('algo-level');
      var betaIEl = document.getElementById('algo-beta-i');
      var centerEl = document.getElementById('algo-center');

      if (piEl) { piEl.textContent = '[' + (step.pi || state.pi).join(', ') + ']'; }
      if (betaEl) { betaEl.textContent = (step.beta != null ? step.beta : state.beta).toFixed(3); }

      if (step.type === 'init') {
        if (levelEl) { levelEl.textContent = String(step.delta); }
        if (betaIEl) { betaIEl.textContent = '\u2014'; }
        if (centerEl) { centerEl.textContent = '\u2014'; }
      } else if (step.type === 'done') {
        if (levelEl) { levelEl.textContent = 'done'; }
        if (betaIEl) { betaIEl.textContent = '\u2014'; }
        if (centerEl) { centerEl.textContent = '\u2014'; }
      } else {
        if (levelEl) { levelEl.textContent = String(step.i); }
        if (betaIEl) { betaIEl.textContent = step.beta_i != null ? step.beta_i.toFixed(3) : '\u2014'; }
        if (centerEl) { centerEl.textContent = step.center != null ? step.center + ' (l=' + step.l + ')' : '\u2014'; }
      }

      renderPartitionPanel(step);

      piOrderG.selectAll('*').remove();
      state.pi.forEach(function (v, idx) {
        var p = positions[v];
        var isActive = step.type === 'assign' && step.center === v;
        piOrderG.append('text')
          .attr('x', p.x).attr('y', p.y + 28)
          .attr('text-anchor', 'middle')
          .attr('fill', isActive ? '#045a8d' : '#bbb')
          .attr('font-size', '10px')
          .attr('font-weight', isActive ? '700' : '400')
          .attr('font-family', 'Courier New, monospace')
          .text('\u03C0(' + (idx + 1) + ')=' + v);
      });

      highlightG.selectAll('*').remove();
      if (step.type === 'assign' && step.center && step.beta_i != null) {
        V.forEach(function (u) {
          if (dist[u][step.center] <= step.beta_i) {
            highlightG.append('line')
              .attr('x1', positions[step.center].x)
              .attr('y1', positions[step.center].y)
              .attr('x2', positions[u].x)
              .attr('y2', positions[u].y)
              .attr('stroke', u === step.center ? 'none' : '#2b8cbe')
              .attr('stroke-width', 1.5)
              .attr('stroke-dasharray', '4,3')
              .attr('opacity', step.cluster && step.cluster.indexOf(u) >= 0 ? 0.9 : 0.35);
          }
        });
      }

      var displayPartition = colorPartition(step);
      if (step.type === 'assign') {
        displayPartition = step.partial || displayPartition;
      }

      nodes.select('circle').transition().duration(200)
        .attr('fill', function (d) {
          if (step.type === 'assign') {
            if (d.id === step.center) { return '#2b8cbe'; }
            if (step.cluster && step.cluster.indexOf(d.id) >= 0) {
              return clusterColorForVertex(d.id, step.partial || [step.cluster]) + '88';
            }
            if (step.assigned && step.assigned.indexOf(d.id) >= 0) { return '#f0f0f0'; }
            if (step.S && step.S.indexOf(d.id) >= 0) { return '#fff8e8'; }
          }
          if (displayPartition) {
            return clusterColorForVertex(d.id, displayPartition) + '55';
          }
          return '#fff';
        })
        .attr('stroke', function (d) {
          if (d.id === step.center) { return '#045a8d'; }
          if (step.cluster && step.cluster.indexOf(d.id) >= 0) { return clusterColorForVertex(d.id, [step.cluster]); }
          if (displayPartition) { return clusterColorForVertex(d.id, displayPartition); }
          return '#bbb';
        })
        .attr('stroke-width', function (d) {
          if (d.id === step.center) { return 3; }
          if (step.cluster && step.cluster.indexOf(d.id) >= 0) { return 2.5; }
          return 2;
        })
        .attr('r', function (d) { return d.id === step.center ? 20 : 16; });
    }

    function goTo(index) {
      state.index = Math.max(0, Math.min(index, state.steps.length - 1));
      renderStep(state.steps[state.index], state.index);
    }

    function loadRun(pi, beta) {
      if (state.playTimer) {
        clearInterval(state.playTimer);
        state.playTimer = null;
      }
      state.pi = pi.slice();
      state.beta = beta;
      state.steps = buildSteps(state.pi, state.beta);
      state.levels = state.steps[0].levels;
      goTo(0);
      var playBtn = document.getElementById('algo-play');
      if (playBtn) { playBtn.textContent = '\u25B6 Play'; }
    }

    function randomize() {
      loadRun(shuffle(V), 1 + Math.random());
    }

    var randomizeBtn = document.getElementById('algo-randomize');
    var exampleBtn = document.getElementById('algo-example');
    var prevBtn = document.getElementById('algo-prev');
    var nextBtn = document.getElementById('algo-next');
    var playBtn = document.getElementById('algo-play');

    if (randomizeBtn) { randomizeBtn.addEventListener('click', randomize); }
    if (exampleBtn) {
      exampleBtn.addEventListener('click', function () {
        loadRun(['a', 'b', 'c', 'd', 'e'], 1.5);
      });
    }
    if (prevBtn) { prevBtn.addEventListener('click', function () { goTo(state.index - 1); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function () { goTo(state.index + 1); }); }
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (state.playTimer) {
          clearInterval(state.playTimer);
          state.playTimer = null;
          playBtn.textContent = '\u25B6 Play';
          return;
        }
        playBtn.textContent = '\u275A\u275A Pause';
        state.playTimer = setInterval(function () {
          if (state.index >= state.steps.length - 1) {
            clearInterval(state.playTimer);
            state.playTimer = null;
            playBtn.textContent = '\u25B6 Play';
            return;
          }
          goTo(state.index + 1);
        }, 1100);
      });
    }

    loadRun(['a', 'b', 'c', 'd', 'e'], 1.5);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartitionAlgoViz);
  } else {
    initPartitionAlgoViz();
  }
})();
