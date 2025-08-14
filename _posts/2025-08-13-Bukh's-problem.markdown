
---
layout: post
date: 2025-08-14
categories: graph-theory probability
math: true
---

So, assume that we have a graph G = (V , E) by $$G_{p}$$ for some $$ p \in (0,1) $$ we mean a subgraph such that the 
probibility of each edge appearing in that subgraph is independent with probability p. now that we have the defination set
the main motive of [shinkar]'s paper `On Coloring Random Subgraphs of a Fixed Graph`, is to study the $$ \chi(G_{1/2}) $$ the coloring number
of the subgraph that we randomly get by removing each edge with the probibility of 1/2. 

so the study of this garph coloring number is really motivated by the following question from Bukh's: 

  is there a constant c > 0 such that $$ E(\chi(G_{1/2}) > c.\frac{\chi(G)}{\chi(G_{1/2})} $$ for all Graphs G? 

in shinkar's paper theorem 1.6 goes as follow: 

**Theorem 1.6.**  
Let G = (V, E) be a graph with  
$$\alpha(G) \le C \cdot \frac{n}{k}$$
for some C > 1. Then for all  
$$d \le \frac{k}{16 C \log(k)}$$
it holds that  
$$\Pr\big[ \chi(G_p) \le d \big] \ \le\ \Pr\big[ \alpha(G_p) > \frac{n}{d} \big] \ \le\ 2^{ - \frac{pkn}{8 C d^2} } .$$

In particular, for all $$( p \ge \frac{1}{k} )$$ it holds that  

$$\mathbb{E} \big[ \chi(G_p) \big] \ \ge\ \frac{p k}{ 32 C \log(p k) } .$$

later at the end of the paper he asks the following question:

> **Question 6.2.**  
> Is it true that every graph (G) contains an induced subgraph $$(G' \subseteq G)$$ such that
> $$
> \chi(G') \;>\; c \cdot \chi(G)
> \quad\text{and}\quad
> \alpha(G') \;\le\; C \,\frac{|V(G')|}{\chi(G')}
> $$
> for some absolute constants C, c > 0?

---

### Notes
- Here \(\chi(\cdot)\) denotes the chromatic number and \(\alpha(\cdot)\) denotes the independence number.  
- The question asks for an **induced** G' that simultaneously preserves a constant fraction of the chromatic number of G while having independence number at most a constant multiple of the Turán-type benchmark $$|V(G')|/\chi(G')$$.

<style>
  .problem-card {
    border: 1px solid #e5e7eb;
    border-left: 6px solid #3b82f6;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    background: #fafafa;
    margin: 1.25rem 0;
  }
  .problem-title {
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
</style>

<div class="problem-card">
  <div class="problem-title">Open Problem 6.2 (compact form)</div>
  Find \(G' \subseteq G\) induced with
  \[
  \chi(G') > c\,\chi(G), \qquad
  \alpha(G') \le C\,\frac{|V(G')|}{\chi(G')}
  \]
  for absolute constants \(c,C>0\).
</div>



[shinkar]: https://arxiv.org/pdf/1612.04319