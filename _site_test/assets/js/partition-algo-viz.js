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

  var clusterColors = {
    a: '#e41a1c', b: '#f28e2b', c: '#377eb8', d: '#4daf4a', e: '#984ea3'
  };

  function shuffle(arr) {
    var a = arr.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var t = a[k]; a[k] = a[j]; a[j] = t;
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

  function partitionRefines(fine, coarse) {
    return fine.every(function (fCluster) {
      return coarse.some(function (cCluster) {
        return fCluster.every(function (v) { return cCluster.indexOf(v) >= 0; });
      });
    });
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
      viewLevel: delta,
      message: 'Choose \u03C0 = [' + pi.join(', ') + '] and \u03B2 = ' + beta.toFixed(3) + ' \u2208 [1,2]. Set D_' + delta + ' = {V}.'
    });

    var i = delta - 1;
    var current = levels[delta].map(function (c) { return c.slice(); });

    while (i >= 0 && current.some(function (S) { return S.length > 1; })) {
      var beta_i = Math.pow(2, i - 1) * beta;
      var assigned = {};
      V.forEach(function (v) { assigned[v] = false; });
      var clusters = [];

      steps.push({
        type: 'level_start',
        i: i,
        beta_i: beta_i,
        parent: current.map(function (S) { return S.slice(); }),
        levels: cloneLevels(levels),
        partial: [],
        viewLevel: i + 1,
        message: 'Level i = ' + i + ': \u03B2_i = 2^{' + (i - 1) + '}\u00B7\u03B2 = ' + beta_i.toFixed(3) + '. Refine each cluster of D_' + (i + 1) + ' into D_' + i + '.'
      });

      for (var l = 0; l < V.length; l++) {
        var center = pi[l];
        for (var s = 0; s < current.length; s++) {
          var S = current[s];
          var unassignedInS = S.filter(function (u) { return !assigned[u]; });
          if (unassignedInS.length === 0) {
            continue;
          }

          var candidates = unassignedInS.filter(function (u) {
            return dist[u][center] <= beta_i;
          });

          var rejected = unassignedInS.filter(function (u) {
            return dist[u][center] > beta_i;
          });

          if (candidates.length === 0) {
            steps.push({
              type: 'no_claim',
              i: i,
              l: l + 1,
              center: center,
              S: S.slice(),
              cluster: [],
              rejected: rejected,
              beta_i: beta_i,
              assignedBefore: V.filter(function (u) { return assigned[u]; }),
              partial: clusters.map(function (c) { return c.slice(); }),
              levels: cloneLevels(levels),
              viewLevel: i,
              message: 'l = ' + (l + 1) + ', center \u03C0(' + (l + 1) + ') = ' + center + ', S = ' + fmtSet(S) + ': no unassigned u with d(u,' + center + ') \u2264 ' + beta_i.toFixed(3) + '.'
            });
            continue;
          }

          clusters.push(candidates.slice());
          candidates.forEach(function (u) { assigned[u] = true; });

          steps.push({
            type: 'assign',
            i: i,
            l: l + 1,
            center: center,
            S: S.slice(),
            cluster: candidates.slice(),
            rejected: rejected,
            beta_i: beta_i,
            assignedBefore: V.filter(function (u) { return assigned[u]; }).filter(function (u) {
              return candidates.indexOf(u) < 0;
            }),
            partial: clusters.map(function (c) { return c.slice(); }),
            levels: cloneLevels(levels),
            viewLevel: i,
            message: 'l = ' + (l + 1) + ', center \u03C0(' + (l + 1) + ') = ' + center + ', cluster S = ' + fmtSet(S) + ': create ' + fmtSet(candidates) + ' where d(u,' + center + ') \u2264 ' + beta_i.toFixed(3) + '.'
          });
        }
      }

      levels[i] = clusters.map(function (c) { return c.slice(); });
      current = levels[i];

      steps.push({
        type: 'level_end',
        i: i,
        beta_i: beta_i,
        partition: clusters.map(function (c) { return c.slice(); }),
        levels: cloneLevels(levels),
        partial: clusters.map(function (c) { return c.slice(); }),
        viewLevel: i,
        message: 'D_' + i + ' = ' + clusters.map(fmtSet).join('  ') + '.'
      });
      i--;
    }

    if (!levels[0]) {
      levels[0] = V.map(function (v) { return [v]; });
    }

    var keys = Object.keys(levels).map(Number).sort(function (a, b) { return b - a; });
    var summary = keys.map(function (lv) {
      return 'D_' + lv + ' = ' + levels[lv].map(fmtSet).join('  ');
    }).join('  \u227A  ');

    steps.push({
      type: 'done',
      pi: pi.slice(),
      beta: beta,
      levels: cloneLevels(levels),
      viewLevel: keys.indexOf(1) >= 0 ? 1 : 0,
      message: 'Hierarchical cut decomposition: ' + summary + '.'
    });

    return steps;
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

    var W = 520;
    var H = 380;
    var svg = d3.select(canvas).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%').style('height', '100%');

    var mainG = svg.append('g').attr('transform', 'translate(16,12)');
    var state = { steps: [], index: 0, pi: [], beta: 1, playTimer: null };

    function renderPartitionPanel(step) {
      var el = document.getElementById('algo-partitions');
      if (!el) { return; }

      var levels = step.levels;
      var keys = Object.keys(levels).map(Number).sort(function (a, b) { return b - a; });
      var html = '';

      keys.forEach(function (lv) {
        var building = (step.type === 'assign' || step.type === 'no_claim' || step.type === 'level_start') && lv === step.i;
        var parentLv = step.type === 'level_start' || step.type === 'assign' || step.type === 'no_claim' ? step.i + 1 : null;
        var title = 'D<sub>' + lv + '</sub>';
        if (lv === parentLv && (step.type === 'level_start' || step.type === 'assign')) {
          title += ' <span style="color:#d4a017">(parent)</span>';
        }
        if (building) {
          title += ' <span style="color:#2b8cbe">(building)</span>';
        }
        html += '<div class="algo-level-block"><div class="level-title">' + title + '</div>';

        if (building && step.partial && step.partial.length > 0) {
          step.partial.forEach(function (cluster) {
            var active = step.type === 'assign' && step.cluster && step.cluster.length && clusterKey(cluster) === clusterKey(step.cluster);
            var c = clusterColors[cluster[0]];
            html += '<span class="algo-cluster' + (active ? ' active' : '') + '" style="border-color:' + c + ';background:' + c + '22">' + fmtSet(cluster) + '</span>';
          });
        } else if (building && step.type === 'level_start') {
          html += '<span style="color:#aaa">empty \u2014 scan centers in \u03C0 order</span>';
        } else {
          levels[lv].forEach(function (cluster) {
            var c = clusterColors[cluster[0]];
            html += '<span class="algo-cluster" style="border-color:' + c + ';background:' + c + '22">' + fmtSet(cluster) + '</span>';
          });
        }
        html += '</div>';
      });
      el.innerHTML = html;
    }

    function drawOverview(step, partition) {
      var y0 = 20;
      mainG.append('text')
        .attr('x', 0).attr('y', y0)
        .attr('fill', '#666').attr('font-size', '12px')
        .attr('font-family', 'Courier New, monospace')
        .text(step.type === 'init' ? 'Starting partition D_' + step.delta + ' = {V}' :
          step.type === 'level_start' ? 'Parent partition D_' + (step.i + 1) + ' (to refine at level i = ' + step.i + ')' :
          step.type === 'level_end' ? 'Completed D_' + step.i :
          step.type === 'done' ? 'Final hierarchical decomposition' : '');

      var groups = partition.map(function (cluster, gi) {
        return { id: gi, cluster: cluster, color: clusterColors[cluster[0]] };
      });

      var gx = mainG.append('g').attr('transform', 'translate(0,50)');
      var xOff = 0;
      groups.forEach(function (g) {
        var n = g.cluster.length;
        var boxW = Math.max(70, n * 44 + 20);
        var box = gx.append('g').attr('transform', 'translate(' + xOff + ',0)');

        box.append('rect')
          .attr('width', boxW).attr('height', 72)
          .attr('rx', 8)
          .attr('fill', g.color + '18')
          .attr('stroke', g.color)
          .attr('stroke-width', 2);

        box.append('text')
          .attr('x', boxW / 2).attr('y', 14)
          .attr('text-anchor', 'middle')
          .attr('fill', '#666').attr('font-size', '10px')
          .attr('font-family', 'Courier New, monospace')
          .text(fmtSet(g.cluster));

        g.cluster.forEach(function (v, vi) {
          var cx = 20 + vi * 44 + (boxW - n * 44) / 2;
          box.append('circle')
            .attr('cx', cx).attr('cy', 44)
            .attr('r', 16)
            .attr('fill', '#fff')
            .attr('stroke', g.color)
            .attr('stroke-width', 2.5);
          box.append('text')
            .attr('x', cx).attr('y', 48)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700')
            .attr('font-family', 'Courier New, monospace')
            .text(v);
        });
        xOff += boxW + 16;
      });
    }

    function drawCutView(step) {
      var center = step.center;
      var S = step.S;
      var beta_i = step.beta_i;
      var y0 = 16;

      mainG.append('text')
        .attr('x', 0).attr('y', y0)
        .attr('fill', '#045a8d').attr('font-size', '12px').attr('font-weight', '700')
        .attr('font-family', 'Courier New, monospace')
        .text('Cut S = ' + fmtSet(S) + '  with center w = \u03C0(' + step.l + ') = ' + center + ',  radius \u03B2_i = ' + beta_i.toFixed(3));

      mainG.append('text')
        .attr('x', 0).attr('y', y0 + 16)
        .attr('fill', '#888').attr('font-size', '11px')
        .attr('font-family', 'Courier New, monospace')
        .text('Claim unassigned u \u2208 S with d(u,w) \u2264 \u03B2_i (metric distance, not Euclidean in the plane).');

      var axisY = 100;
      var axisX0 = 50;
      var axisW = 420;
      var maxX = Math.max(beta_i, 1);
      S.forEach(function (u) { maxX = Math.max(maxX, dist[u][center]); });
      maxX = Math.ceil(maxX) + 0.5;
      var scale = axisW / maxX;

      var ax = mainG.append('g').attr('transform', 'translate(' + axisX0 + ',' + axisY + ')');

      ax.append('line')
        .attr('x1', 0).attr('x2', axisW)
        .attr('y1', 0).attr('y2', 0)
        .attr('stroke', '#ccc').attr('stroke-width', 1.5);

      ax.append('text')
        .attr('x', -8).attr('y', 4)
        .attr('text-anchor', 'end')
        .attr('fill', '#045a8d').attr('font-size', '11px')
        .attr('font-family', 'Courier New, monospace')
        .text('w');

      var betaX = beta_i * scale;
      ax.append('line')
        .attr('x1', betaX).attr('x2', betaX)
        .attr('y1', -12).attr('y2', 48)
        .attr('stroke', '#e41a1c').attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,4');
      ax.append('text')
        .attr('x', betaX).attr('y', -16)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e41a1c').attr('font-size', '10px')
        .attr('font-family', 'Courier New, monospace')
        .text('\u03B2_i = ' + beta_i.toFixed(3));

      var shaded = ax.append('rect')
        .attr('x', 0).attr('y', -8)
        .attr('width', betaX).attr('height', 40)
        .attr('fill', 'rgba(43,140,190,0.1)');

      var points = S.map(function (u) {
        var d = dist[u][center];
        var claimed = step.type === 'assign' && step.cluster.indexOf(u) >= 0;
        var already = step.assignedBefore && step.assignedBefore.indexOf(u) >= 0;
        var inBall = d <= beta_i;
        return { id: u, d: d, x: d * scale, claimed: claimed, already: already, inBall: inBall };
      }).sort(function (a, b) { return a.d - b.d; });

      points.forEach(function (p) {
        var g = ax.append('g').attr('transform', 'translate(' + p.x + ',18)');
        var fill = p.claimed ? clusterColors[p.id] :
          p.already ? '#e8e8e8' :
          p.inBall ? '#fff' : '#fff';
        var stroke = p.claimed ? clusterColors[p.id] :
          p.already ? '#bbb' :
          p.inBall ? '#2b8cbe' : '#d4a017';
        var sw = p.claimed ? 3 : 2;

        g.append('circle')
          .attr('r', 14)
          .attr('fill', fill)
          .attr('stroke', stroke)
          .attr('stroke-width', sw)
          .attr('stroke-dasharray', p.claimed || p.already ? null : (p.inBall ? null : '3,2'));

        g.append('text')
          .attr('y', 4)
          .attr('text-anchor', 'middle')
          .attr('font-size', '13px').attr('font-weight', '700')
          .attr('font-family', 'Courier New, monospace')
          .attr('fill', p.claimed ? '#fff' : '#333')
          .text(p.id);

        g.append('text')
          .attr('y', 34)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-family', 'Courier New, monospace')
          .attr('fill', '#666')
          .text('d=' + p.d.toFixed(2));

        if (p.claimed) {
          g.append('text')
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('fill', '#2b8cbe')
            .attr('font-family', 'Courier New, monospace')
            .text('claimed');
        } else if (!p.already && !p.inBall) {
          g.append('text')
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('fill', '#d4a017')
            .attr('font-family', 'Courier New, monospace')
            .text('d > \u03B2_i');
        } else if (p.already) {
          g.append('text')
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('fill', '#aaa')
            .attr('font-family', 'Courier New, monospace')
            .text('assigned');
        }
      });

      if (step.type === 'assign') {
        mainG.append('text')
          .attr('x', axisX0).attr('y', axisY + 70)
          .attr('fill', '#2b8cbe').attr('font-size', '11px')
          .attr('font-family', 'Courier New, monospace')
          .text('\u2192 New cluster: ' + fmtSet(step.cluster));
      } else {
        mainG.append('text')
          .attr('x', axisX0).attr('y', axisY + 70)
          .attr('fill', '#d4a017').attr('font-size', '11px')
          .attr('font-family', 'Courier New, monospace')
          .text('\u2192 No cluster created (all unassigned vertices in S have d(u,w) > \u03B2_i).');
      }

      if (step.rejected && step.rejected.length > 0) {
        mainG.append('text')
          .attr('x', axisX0).attr('y', axisY + 86)
          .attr('fill', '#d4a017').attr('font-size', '11px')
          .attr('font-family', 'Courier New, monospace')
          .text('Still unassigned in S (wait for later centers): ' + step.rejected.map(function (u) {
            return u + ' (d=' + dist[u][center].toFixed(2) + ')';
          }).join(', '));
      }
    }

    function drawPiStrip(step) {
      var pi = step.pi || state.pi;
      var y = 330;
      mainG.append('text')
        .attr('x', 0).attr('y', y)
        .attr('fill', '#999').attr('font-size', '10px')
        .attr('font-family', 'Courier New, monospace')
        .text('Permutation \u03C0 (centers tried in this order):');

      var strip = mainG.append('g').attr('transform', 'translate(0,' + (y + 10) + ')');
      var x = 0;
      pi.forEach(function (v, idx) {
        var active = (step.type === 'assign' || step.type === 'no_claim') && step.l === idx + 1;
        var done = (step.type === 'assign' || step.type === 'no_claim') && step.l > idx + 1;
        strip.append('rect')
          .attr('x', x).attr('y', 0)
          .attr('width', 52).attr('height', 28)
          .attr('rx', 4)
          .attr('fill', active ? '#2b8cbe' : done ? '#e8f4f8' : '#f5f5f5')
          .attr('stroke', active ? '#045a8d' : '#ddd')
          .attr('stroke-width', active ? 2 : 1);
        strip.append('text')
          .attr('x', x + 26).attr('y', 18)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-family', 'Courier New, monospace')
          .attr('fill', active ? '#fff' : '#444')
          .text('\u03C0(' + (idx + 1) + ')=' + v);
        x += 58;
      });
    }

    function partitionAt(step) {
      var levels = step.levels;
      var lv = step.viewLevel;
      if (step.type === 'level_start') {
        return step.parent;
      }
      if (step.type === 'assign') {
        return step.partial;
      }
      if (step.type === 'level_end' || step.type === 'done') {
        return levels[lv] || levels[step.i];
      }
      return levels[lv];
    }

    function renderStep(step, index) {
      mainG.selectAll('*').remove();

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

      if (step.type === 'init' || step.type === 'done') {
        if (levelEl) { levelEl.textContent = step.type === 'init' ? String(step.delta) : 'done'; }
        if (betaIEl) { betaIEl.textContent = '\u2014'; }
        if (centerEl) { centerEl.textContent = '\u2014'; }
      } else {
        if (levelEl) { levelEl.textContent = String(step.i); }
        if (betaIEl) { betaIEl.textContent = step.beta_i != null ? step.beta_i.toFixed(3) : '\u2014'; }
        if (centerEl) {
          centerEl.textContent = step.center != null ? step.center + ' (l=' + step.l + ')' : '\u2014';
        }
      }

      renderPartitionPanel(step);
      drawPiStrip(step);

      if (step.type === 'assign' || step.type === 'no_claim') {
        drawCutView(step);
      } else {
        drawOverview(step, partitionAt(step));
      }
    }

    function goTo(index) {
      state.index = Math.max(0, Math.min(index, state.steps.length - 1));
      renderStep(state.steps[state.index], state.index);
    }

    function loadRun(pi, beta) {
      if (state.playTimer) { clearInterval(state.playTimer); state.playTimer = null; }
      state.pi = pi.slice();
      state.beta = beta;
      state.steps = buildSteps(state.pi, state.beta);
      goTo(0);
      var playBtn = document.getElementById('algo-play');
      if (playBtn) { playBtn.textContent = '\u25B6 Play'; }
    }

    document.getElementById('algo-example').addEventListener('click', function () {
      loadRun(['a', 'b', 'c', 'd', 'e'], 1.5);
    });
    document.getElementById('algo-randomize').addEventListener('click', function () {
      loadRun(shuffle(V), 1 + Math.random());
    });
    document.getElementById('algo-prev').addEventListener('click', function () { goTo(state.index - 1); });
    document.getElementById('algo-next').addEventListener('click', function () { goTo(state.index + 1); });
    document.getElementById('algo-play').addEventListener('click', function () {
      var btn = this;
      if (state.playTimer) {
        clearInterval(state.playTimer);
        state.playTimer = null;
        btn.textContent = '\u25B6 Play';
        return;
      }
      btn.textContent = '\u275A\u275A Pause';
      state.playTimer = setInterval(function () {
        if (state.index >= state.steps.length - 1) {
          clearInterval(state.playTimer);
          state.playTimer = null;
          btn.textContent = '\u25B6 Play';
          return;
        }
        goTo(state.index + 1);
      }, 1400);
    });

    loadRun(['a', 'b', 'c', 'd', 'e'], 1.5);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPartitionAlgoViz);
  } else {
    initPartitionAlgoViz();
  }
})();
