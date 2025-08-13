---
layout: default
title: Open Problems
permalink: /problems/
---

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
<script>
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
  }
};
</script>

# Open Problems & Research Questions

<div class="problems-container">
  {% for problem in site.data.problems %}
  <div class="problem-card">
    <div class="problem-header">
      <h3 class="problem-title">{{ problem.title }}</h3>
      <span class="problem-difficulty difficulty-{{ problem.difficulty }}">{{ problem.difficulty }}</span>
    </div>
    <div class="problem-description">
      {{ problem.description | markdownify }}
    </div>
    {% if problem.math %}
    <div class="problem-math">
      {{ problem.math }}
    </div>
    {% endif %}
    <div class="problem-meta">
      <span class="problem-category">{{ problem.category }}</span>
      <span class="problem-date">Posted: {{ problem.date }}</span>
      {% if problem.reward %}
      <span class="problem-reward">💰 {{ problem.reward }}</span>
      {% endif %}
    </div>
  </div>
  {% endfor %}
</div>

<script>
// Force MathJax to process the page after it loads
document.addEventListener('DOMContentLoaded', function() {
  if (typeof MathJax !== 'undefined') {
    MathJax.typesetPromise();
  }
});
</script>