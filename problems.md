---
title: Open Problems
permalink: /problems/
mathjax: true
---

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