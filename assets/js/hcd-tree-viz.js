(function () {
  'use strict';

  function initHcdTreeViz() {
    if (typeof d3 === 'undefined') {
      console.error('hcd-tree-viz: d3 not loaded');
      return;
    }

    var container = document.getElementById('d3-viz');
    if (!container || container.getAttribute('data-initialized') === 'true') {
      return;
    }
    container.setAttribute('data-initialized', 'true');

    var width = 720;
    var height = 400;
    var margin = { top: 36, right: 56, bottom: 28, left: 28 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;

    var nodes = [
      { id: 'R', name: 'V = {a,b,c,d,e}', level: 2, radius: 4, x: innerW / 2, y: 36 },
      { id: 'C1', name: '{a,b}', level: 1, radius: 2, x: innerW * 0.22, y: innerH * 0.48, parent: 'R' },
      { id: 'C2', name: '{c,d}', level: 1, radius: 2, x: innerW * 0.5, y: innerH * 0.48, parent: 'R' },
      { id: 'C3', name: '{e}', level: 1, radius: 2, x: innerW * 0.78, y: innerH * 0.48, parent: 'R' },
      { id: 'a', name: 'a', level: 0, radius: 1, x: innerW * 0.16, y: innerH - 24, parent: 'C1' },
      { id: 'b', name: 'b', level: 0, radius: 1, x: innerW * 0.28, y: innerH - 24, parent: 'C1' },
      { id: 'c', name: 'c', level: 0, radius: 1, x: innerW * 0.44, y: innerH - 24, parent: 'C2' },
      { id: 'd', name: 'd', level: 0, radius: 1, x: innerW * 0.56, y: innerH - 24, parent: 'C2' },
      { id: 'e', name: 'e', level: 0, radius: 1, x: innerW * 0.78, y: innerH - 24, parent: 'C3' }
    ];

    var nodeById = {};
    nodes.forEach(function (n) { nodeById[n.id] = n; });

    var links = nodes.filter(function (n) { return n.parent; }).map(function (n) {
      return { source: nodeById[n.parent], target: n };
    });

    var partitionLabels = {
      2: 'Partition: {a,b,c,d,e}',
      1: 'Partition: {a,b}  {c,d}  {e}',
      0: 'Partition: {a} {b} {c} {d} {e}'
    };

    var levelY = { 0: innerH - 24, 1: innerH * 0.48, 2: 36 };

    var colorsForLevel = {
      2: d3.scaleOrdinal().domain(['R']).range(['#2b8cbe']),
      1: d3.scaleOrdinal().domain(['C1', 'C2', 'C3']).range(['#e41a1c', '#377eb8', '#4daf4a']),
      0: d3.scaleOrdinal().domain(['a', 'b', 'c', 'd', 'e']).range(['#e41a1c', '#f28e2b', '#377eb8', '#4daf4a', '#984ea3'])
    };

    var svg = d3.select(container).append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%');

    svg.append('defs').append('filter')
      .attr('id', 'hcd-node-shadow')
      .append('feDropShadow')
      .attr('dx', 0).attr('dy', 1)
      .attr('stdDeviation', 2)
      .attr('flood-opacity', 0.25);

    var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    [0, 1, 2].forEach(function (l) {
      g.append('line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', levelY[l]).attr('y2', levelY[l])
        .attr('stroke', '#eee').attr('stroke-dasharray', '4,4');
      g.append('text')
        .attr('x', innerW + 8).attr('y', levelY[l] + 4)
        .attr('fill', '#bbb').attr('font-size', '12px')
        .attr('font-family', 'Courier New, monospace')
        .text('D' + l);
    });

    g.append('text')
      .attr('x', innerW * 0.12)
      .attr('y', (levelY[2] + levelY[1]) / 2 + 4)
      .attr('fill', '#aaa').attr('font-size', '10px')
      .attr('font-family', 'Courier New, monospace')
      .text('edge length 2^2 = 4');

    g.append('text')
      .attr('x', innerW * 0.12)
      .attr('y', (levelY[1] + levelY[0]) / 2 + 4)
      .attr('fill', '#aaa').attr('font-size', '10px')
      .attr('font-family', 'Courier New, monospace')
      .text('edge length 2^1 = 2');

    var link = g.append('g').selectAll('line')
      .data(links).enter().append('line')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    var node = g.append('g').selectAll('g.node')
      .data(nodes).enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    node.append('circle')
      .attr('r', function (d) { return d.level === 2 ? 14 : d.level === 1 ? 10 : 7; })
      .attr('fill', '#f5f5f5')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('x', function (d) { return d.level === 0 ? 12 : 0; })
      .attr('y', function (d) { return d.level === 0 ? 4 : (d.level === 2 ? -22 : -16); })
      .attr('text-anchor', function (d) { return d.level === 0 ? 'start' : 'middle'; })
      .attr('font-size', '12px')
      .attr('font-family', 'Courier New, monospace')
      .attr('fill', '#333')
      .style('pointer-events', 'none')
      .text(function (d) { return d.name; });

    node.filter(function (d) { return d.level > 0; })
      .append('text')
      .attr('y', function (d) { return d.level === 2 ? -36 : -28; })
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', '#999')
      .text(function (d) { return '(radius ' + d.radius + ')'; });

    function clusterId(node, level) {
      var cur = node;
      while (cur && cur.level > level) {
        cur = nodeById[cur.parent];
      }
      return cur ? cur.id : null;
    }

    var tooltip = document.getElementById('viz-tooltip');

    node.on('mouseenter', function (event, d) {
      if (!tooltip) { return; }
      tooltip.style.opacity = '1';
      tooltip.innerHTML = '<b>' + d.name + '</b><br>Level: D' + d.level + '<br>Radius: ' + d.radius;
      tooltip.style.left = (event.clientX + 12) + 'px';
      tooltip.style.top = (event.clientY - 10) + 'px';
    }).on('mousemove', function (event) {
      if (!tooltip) { return; }
      tooltip.style.left = (event.clientX + 12) + 'px';
      tooltip.style.top = (event.clientY - 10) + 'px';
    }).on('mouseleave', function () {
      if (!tooltip) { return; }
      tooltip.style.opacity = '0';
    });

    function updateViz(level) {
      var label = document.getElementById('partition-label');
      if (label) {
        label.textContent = partitionLabels[level];
      }

      link.transition().duration(400)
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; })
        .attr('stroke', function (d) { return d.source.level >= level ? '#666' : '#ddd'; })
        .attr('stroke-width', function (d) { return d.source.level >= level ? 2.5 : 1; })
        .attr('stroke-opacity', function (d) { return d.source.level >= level ? 0.85 : 0.25; });

      node.select('circle').transition().duration(400)
        .attr('r', function (d) {
          if (d.level === level) { return d.level === 2 ? 16 : 12; }
          return d.level === 2 ? 14 : d.level === 1 ? 10 : 7;
        })
        .attr('fill', function (d) {
          if (d.level === level) {
            return colorsForLevel[level](clusterId(d, level));
          }
          if (d.level > level) { return '#f9f9f9'; }
          var c = d3.color(colorsForLevel[level](clusterId(d, level)));
          if (c) { c.opacity = 0.35; return c.formatRgb(); }
          return '#f0f0f0';
        })
        .attr('stroke', function (d) {
          if (d.level === level) {
            var stroke = d3.color(colorsForLevel[level](clusterId(d, level)));
            return stroke ? stroke.darker(0.5).formatRgb() : '#333';
          }
          return d.level > level ? '#d0d0d0' : '#ccc';
        })
        .attr('stroke-width', function (d) { return d.level === level ? 3 : 1.5; })
        .attr('filter', function (d) { return d.level === level ? 'url(#hcd-node-shadow)' : null; });

      node.style('opacity', function (d) { return d.level >= level ? 1 : 0.5; });
    }

    d3.selectAll('.hcd-level-btn').on('click', function () {
      var level = parseInt(this.getAttribute('data-level'), 10);
      d3.selectAll('.hcd-level-btn').classed('active', false);
      d3.select(this).classed('active', true);
      updateViz(level);
    });

    updateViz(2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHcdTreeViz);
  } else {
    initHcdTreeViz();
  }
})();
