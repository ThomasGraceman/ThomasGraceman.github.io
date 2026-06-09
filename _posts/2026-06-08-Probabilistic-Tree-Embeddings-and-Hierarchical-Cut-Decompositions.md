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

$$\mathbb{E}_{d' \sim \mathcal{D}}[d'(u, v)] \le \alpha \cdot d(u, v).$$

## Hierarchical Cut Decomposition

Let $(V,d)$ be a finite metric space. For a parameter $r > 0$, an $r$-cut decomposition is a partition of $V$ into clusters such that:
- Each cluster is associated with a center vertex,
- Every vertex in a cluster lies within distance at most $r$ from its center.

Thus, every cluster has diameter at most $2r$.

A **hierarchical cut decomposition** is a sequence of nested partitions:

$$D_0, D_1, \dots, D_\delta$$

such that:
- $D_\delta = \{V\}$ (the trivial partition),
- $D_i$ is a $2^i$-cut decomposition,
- $D_i$ refines $D_{i+1}$ for all $i$ (i.e., every cluster in $D_i$ is contained in some cluster of $D_{i+1}$).

At the finest level, $D_0$ consists of singleton clusters.

### Intuition

This construction organizes the metric space in a top-down manner. At large scale, points are grouped into coarse clusters, and as the scale decreases, these clusters are recursively refined into smaller ones. This yields a multiscale representation of the metric that can be viewed as a tree-like structure.

### Example

Consider a metric space $(V,d)$ where:

$$V = \{a,b,c,d,e\}$$

Suppose the distances are such that:
- $\{a,b\}$ are very close,
- $\{c,d\}$ are very close,
- $e$ is far from all others.

We construct a hierarchical cut decomposition:

#### Level $D_0$ (radius $1$)
Each vertex is a singleton:

$$D_0 = \big\{ \{a\}, \{b\}, \{c\}, \{d\}, \{e\} \big\}$$

#### Level $D_1$ (radius $2$)
Close points are grouped:

$$D_1 = \big\{ \{a,b\}, \{c,d\}, \{e\} \big\}$$

#### Level $D_2$ (radius $4$)
Further merging:

$$D_2 = \big\{ \{a,b,c,d,e\} \big\}$$

Notice the refinement property:

$$D_0 \prec D_1 \prec D_2$$

Each level coarsens the metric, while preserving local structure at smaller scales.

{% include hcd-tree-viz.html %}

## Laminar Families and the Induced Tree

What we have constructed is a *laminar family*, as mentioned in the paper. A hierarchical cut decomposition defines a laminar family.

Recall that a family $F \subseteq 2^V$ is called **laminar** if for any $A, B \in F$, it holds that

$$A \subseteq B \quad \text{or} \quad B \subseteq A \quad \text{or} \quad A \cap B = \emptyset.$$

Such families are particularly convenient because they admit a natural tree representation: each set corresponds to a node, and inclusion defines the parent-child structure. Thus, laminar families form a relatively simple algebraic structure from which trees can be constructed directly.

So we try to set the metric in a way that gives us a good distance: start from the root, it doubles, and the distance between two leaves is the distance to their least common ancestor in the tree.

Each node in $D_i$ is connected to each of its children in the tree by an edge of length $2^i$, which is an upper bound on the radius of the corresponding cluster $S$. This induces a distance function $d_T(\cdot,\cdot)$ on $V$, where $d_T(u,v)$ is defined as the shortest-path distance between the leaves corresponding to $\{u\}$ and $\{v\}$ in $T$.

Given this edge-length assignment, it is easy to see that

$$d_T(u,v) \ge d(u,v), \quad \forall\, u,v \in V.$$

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

{% include partition-algo-viz.html %}

What are we doing? Notice that in each cluster in the process, we have a set of refinements. Now what we are going to do is set the new distance, and we want to cluster the vertices close to each other and refine it further. For that we should really choose a center to distinguish distances from, and we do that by randomizing the vertices available and choosing the first vertex and setting it as a means to further refine the cluster. For example, all the vertices which have distance less than $\beta_i$ to a $\pi(l)$ will be in the same cluster.

## Analysis

Now we should try to analyze it. The expected value of $d_T(u,v)$ is bounded by $O(\log n)\cdot d(u,v)$.

We make no attempt to optimize constants in this analysis. From the discussion above, it follows that

$$\mathbb{E}[d_T(u,v)] \le \sum_{i=0}^{\delta} \Pr[(u,v)\ \text{is at level } i]\cdot 2^{i+2}. \qquad (1)$$

Note that if $(u,v)$ is at level $i$, then

$$d_T(u,v) = 2\sum_{j=0}^{i} 2^j \le 2^{i+2}.$$

If vertices $u$ and $v$ are in separate clusters in $D_i$, we say that $D_i$ *separates* $(u,v)$. Note that $(u,v)$ is at level $i$ if:

- (a) $D_i$ separates $(u,v)$,
- (b) $D_j$ does not separate $(u,v)$ for any $j > i$.

Clearly, if $d(u,v) > 2^{i+2}$, then $u$ and $v$ cannot lie in the same cluster in $D_{i+1}$, i.e., $D_{i+1}$ separates $(u,v)$. From condition (b), it follows that $(u,v)$ cannot be at level $i$.

Let $j^*$ be the smallest index $i$ such that

$$d(u,v) \le 2^{i+2}.$$

Thus,

$$\Pr[(u,v)\ \text{is at level } i] = 0 \quad \text{for all } i < j^*.$$

For $$i \ge j^*$$, we bound the probability that $$(u,v)$$ is at level $$i$$. From conditions (a) and (b), for any $$i \ge j^*$$,

$$\begin{align}
\Pr[(u,v)\ \text{is at level } i] &= \Pr[D_i \text{ separates } (u,v)] \\
&\quad \cdot \Pr\big[\exists j > i : D_j \text{ separates } (u,v)\mid D_i \text{ separates } (u,v)\big] \\
&\le \Pr[D_i \text{ separates } (u,v)].
\end{align}$$

For any $$j^* \le j \le \delta$$,
 let $$K_j^u$$ be the set of vertices in $$V$$ closer than $$2^j$$ to vertex $$u$$,
  and let $$k_j^u = |K_j^u|$$. Similarly define $$K_j^v$$ and $$k_j^v$$. For $$j < j^*$$, we define $$k_j^u = 0$$.

We say that a center $$w$$ *cuts $$u$$ out of $$(u,v)$$ at level $$i$$* 
if $$w$$ cuts $$(u,v)$$ at level $$i$$ and $$u$$
 is assigned to $$w$$ (while $$v$$ is not assigned to $$w$$) at this level.

Let $w_1, w_2, \dots, w_{k_i^u}$ be the centers ordered by increasing distance from $u$ at level $i$. For a center $w_s$ to cut $(u,v)$ in a way that only $u$ is assigned to $w_s$, the following conditions must hold:

- (a) $d(u,w_s) \le \beta_i$,
- (b) $d(v,w_s) > \beta_i$,
- (c) $w_s$ is the first center that settles $u$ at this level.

Thus $\beta_i$ must lie in the interval $[d(u,w_s), d(v,w_s)]$. By the triangle inequality,

$$d(v,w_s) \le d(v,u) + d(u,w_s),$$

and hence the interval $[d(u,w_s), d(v,w_s)]$ has length at most $d(u,v)$.

Since $\beta_i$ is chosen uniformly in $[2^{i-1},2^i]$ (by construction), the probability that $\beta_i$ falls into this "bad" interval is at most

$$\frac{d(u,v)}{2^{i-1}}.$$

It follows that the probability that $D_i$ separates $(u,v)$ is bounded by

$$\begin{align}
\Pr[D_i \text{ separates } (u,v)] &\le \sum_{s=1}^{k_i^u} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s} + \sum_{s=1}^{k_i^v} \frac{d(u,v)}{2^{i-1}} \cdot \frac{1}{s} \\
&\le \frac{d(u,v)}{2^{i-1}} \left(\ln k_i^u + \ln k_i^v\right).
\end{align}$$

Thus each level $i$ contributes at most $O(\log n)$ to the expected value of $d_T(u,v)$ (see Equation (1)), and hence the expected distance is bounded by

$$\mathbb{E}[d_T(u,v)] \le O(\log n \log \Delta)\, d(u,v).$$
