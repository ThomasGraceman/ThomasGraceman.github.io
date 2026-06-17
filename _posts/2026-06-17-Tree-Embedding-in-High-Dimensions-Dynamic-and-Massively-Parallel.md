---
title: "Tree Embedding in High Dimensions: Dynamic and Massively Parallel"
date: 2026-06-17
permalink: /posts/tree-embedding-high-dimensions-dynamic-mpc/
redirect_from:
  - /Tree-Embedding-in-High-Dimensions-Dynamic-and-Massively-Parallel/
---

I recently came across a really cool paper: *Tree Embedding in High Dimensions: Dynamic and Massively Parallel* by Gramoz Goranci, Shaofeng H.-C. Jiang, Peter Kiss, Qihao Kong, Yi Qian, and Eva Szilagyi (SODA 2026). It's a nice utilization of geometric hashing, which itself is a sparse partition of the metric space at hand. At the basic level, the algorithm works like its predecessors (the CKR process): put a randomization forward, break down the metric space in a recursive manner. The structure and analysis yield an ultrametric with distortion \(O(\log n)\). But the novelty lies in the dynamic algorithm and the more general setting, and their use of the dynamic paradigm works extremely well in the MPC model (a streaming model of computation).

The intuition is: find good neighborhoods of points, put a random priority map, and decompose the labels into appropriate buckets according to distance at each level. Instead of a top-down recursive approach — which is a rather greedy paradigm and may force you to exert more computational power — we build it independently at each level. This helps in the design of the dynamic algorithm.

---

## The Algorithm

Let \((V, \mathrm{dist})\) be a metric space. Define

\[
B(x,r) := \{\, y\in V : \mathrm{dist}(x,y)\le r \,\},
\qquad B_P(x,r) := B(x,r)\cap P.
\]

Let \(\pi : P \to [0,1]\) be a random map, and let \(r \sim \mathrm{Unif}[w/4, w/2]\). For each \(p\in P\), define

\[
\ell_p := \operatorname*{arg\,min}\{\pi(q) : q \in B_P(p,r)\}.
\]

We assume, without loss of generality, that the dataset \(P\subseteq V\) has minimum inter-point distance greater than \(1\), and that its diameter \(\Delta = \operatorname{diam}(P)\) satisfies \(\Delta = 2^{m-1}\) for some \(m\in\mathbb{N}\). For every integer \(i\), let

\[
w_i := 2^{m-i}.
\]

<blockquote style="background: #f8f9fa; border-left: 4px solid #2b8cbe; padding: 16px 20px; margin: 20px 0; font-family: 'Courier New', monospace; font-size: 14px; border-radius: 4px;">
<strong style="color: #045a8d; font-size: 15px;">Algorithm 1.</strong> <em>Tree embedding on input \(P \subseteq V\) with access to metric hashes \(\{\phi_i\}_{i\in[m]}\)</em>
<br><br>
<span style="color: #888;">/* \(\phi_i\) is a metric hashing with diameter bound \(\tau_i := w_i/2\) */</span><br>
1. Sample \(\beta \in [1/4, 1/2]\) uniformly at random<br>
2. Let \(\pi\) be a uniform random map from \(P\) to \([0,1]\)<br>
3. <strong>for</strong> \(i \leftarrow 1\) to \(m\) <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;4. \(r_i \leftarrow \frac{\beta}{\Gamma} \cdot w_i\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;5. <strong>for each</strong> \(p \in P\) <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6. \(\ell^{(i)}_p \leftarrow \pi_{\min}\!\big(\widetilde{B}^{P}_i(p,r_i)\big)\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;7. <strong>end for</strong><br>
8. <strong>end for</strong><br>
9. <strong>return</strong> \(\{\ell^{(i)}_p\}_{i\in[m],\,p\in P}\)
</blockquote>

Here \(\widetilde{B}^{P}_i(p,r)\) is the bucketed neighborhood:

\[
\operatorname{buk}(x) := \phi^{-1}(\phi(x)),\qquad
\operatorname{buk}^{P}(x) := \operatorname{buk}(x)\cap P,
\]

\[
\widetilde{B}^{P}_i(p,r) := \bigcup_{x \in B(p,r)} \operatorname{buk}^{P}_i(x),
\qquad
\pi_{\min}(S) := \operatorname*{arg\,min}_{x\in S} \pi(x).
\]

---

## Tree Level and Distance

The embedding tree is a \(2\)-HST. The distance between points \(p,q\) in the tree \(T\) is determined by their LCA. The level of the LCA is captured by the labels \(\ell^{(i)}\).

<div class="definition" style="background: #f0f7fb; border-left: 4px solid #3a87ad; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
<strong style="color: #045a8d;">Definition (Tree level).</strong> For \(p,q\in P\), define
\[
\operatorname{lv}(p,q) := \min\{\, i\in [m] : \ell^{(i)}_{p}\neq \ell^{(i)}_{q} \,\}.
\]
</div>

Since the embedding tree is a \(2\)-HST,

\[
\operatorname{dist}_T(p,q) = \sum_{i=\operatorname{lv}(p,q)}^{m} 2w_i \in \left[\,2w_{\operatorname{lv}(p,q)},\;4w_{\operatorname{lv}(p,q)}\right).
\]

The tree \(T\) has height \(m\), and the edge weight from every level-\(i\) node to every level-\((i+1)\) node is \(w_i\). Level \(1\) is the root (singleton partition), and level \(m\) consists of leaves, each containing at most a single data point.

Fix \(p,q\in P\) and let \(i := \operatorname{lv}(p,q)-1\). Then \(\operatorname{dist}_T(p,q)\ge 2w_{i+1}\), and \(\ell^{(i)}_p = \ell^{(i)}_q\). Let \(p' := \pi^{-1}(\ell^{(i)}_p)\). Then \(p\) and \(q\) are in the same bucket at the upper levels, and

\[
\operatorname{buks}_i(p')\cap B(p,r_i)\neq\varnothing,\qquad
\operatorname{buks}_i(p')\cap B(q,r_i)\neq\varnothing.
\]

By the diameter bound of \(\phi_i\), choosing \(\hat{p}, \hat{q}\) from these intersections gives \(\operatorname{dist}(\hat{p},\hat{q})\le w_{i+1}\), and by triangle inequality,

\[
\operatorname{dist}(p,q)
\le 2r_i + w_{i+1}
\le 2w_{i+1}
\le \operatorname{dist}_T(p,q).
\]

The proof of the upper bound

\[
\mathbb{E}[\operatorname{dist}_T(p,q)] \le O(\Gamma\log\Gamma)\cdot \log n \cdot \operatorname{dist}(p,q)
\]

is interesting in its own right, but too technical for a general audience. It can be studied to prove similar results and is quite helpful in those settings. I may discuss it in a future post.

---

## Representative Sets

The analysis uses a clever structural tool: representative sets. These capture the local growth of the bucketed neighborhood while maintaining the geometric structure of a ball.

<div class="definition" style="background: #f0f7fb; border-left: 4px solid #3a87ad; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
<strong style="color: #045a8d;">Definition (Representative sets).</strong> A collection \(\operatorname{rep}_i(p,r) \subseteq V\) is called a family of representative sets if for every \(i\in[m]\), \(p\in P\), and \(r\ge 0\):

<ol>
<li><strong>(distinct)</strong> For all \(x \neq y \in \operatorname{rep}_i(p,r)\),
\(\operatorname{buks}_i(x) \cap \operatorname{buks}_i(y) = \emptyset.\)</li>

<li><strong>(monotone)</strong> For all \(r' \in (0,r)\),
\(\operatorname{rep}_i(p,r') \subseteq \operatorname{rep}_i(p,r).\)</li>

<li><strong>(ball-preserving)</strong>
\(\operatorname{rep}_i(p,r) \subseteq B(p,r)\cap \operatorname{buks}_i(P),\) and
\(\operatorname{buks}^{P}_i(\operatorname{rep}_i(p,r)) = \operatorname{buks}^{P}_i(B(p,r)).\)</li>
</ol>
</div>

Property 1 is useful for several results in the analysis. Properties 2 and 3 ensure that representative sets behave similarly to metric balls, so no essential information is lost in the abstraction.

The construction goes as follows. For each \(i\in[m]\), \(p\in P\), and \(x\in V\), define

\[
\operatorname{NNbuks}_i(p,x) := \arg\min_{y\in \operatorname{buks}_i(x)} \operatorname{dist}(p,y).
\]

This is the nearest point in \(\operatorname{buks}_i(x)\) to \(p\) (not necessarily in \(P\)). Then for \(S\subseteq V\),

\[
\operatorname{NNbuks}_i(p,S) := \{\operatorname{NNbuks}_i(p,x) : x\in S\}.
\]

If \(\phi_i(x)=\phi_i(y)\), then \(\operatorname{NNbuks}_i(p,x) = \operatorname{NNbuks}_i(p,y)\), so \(\operatorname{NNbuks}_i(p,S)\) contains at most one point from each bucket.

### Key Representative

The key representative is the minimizer within \(\operatorname{rep}_i(p,r)\):

\[
\operatorname{rep}^{*}_i(p,r) := \arg\min\{\pi_{\min}(\operatorname{buks}^{P}_i(x)) : x \in \operatorname{rep}_i(p,r)\},
\]

which is unique with probability \(1\). This key representative realizes the minimizer of \(\pi\):

\[
\ell^{(i)}_p = \pi_{\min}(\operatorname{buks}^{P}_i(\operatorname{rep}^{*}_i(p,r_i))).
\]

### Separation Probability

The event \(\ell^{(i)}_p \neq \ell^{(i)}_q\) is symmetric, so it suffices to bound

\[
\Pr[\ell^{(i)}_p < \ell^{(i)}_q].
\]

This event implies \(\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i)\), giving

\[
\Pr[\ell^{(i)}_p < \ell^{(i)}_q] \le \Pr[\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i)].
\]

To analyze this, we define an auxiliary event \(E^{(i)}_p(x)\) that depends only on \(\pi\) (not on the random radius \(r_i\)), capturing whether \(x\) achieves the minimum \(\pi\)-value in \(\widetilde{B}^{P}_i(p,\operatorname{dist}(p,x))\).

The resulting bound (Lemma 3.3) states:

<div class="lemma" style="background: #f5f5f5; border-left: 4px solid #888; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
<strong>Lemma 3.3.</strong> For every \(p,q\in P\), \(i\in[m]\), and \(0 \le r' \le \tfrac{1}{2} r^{\max}_i\) such that \(B(p,r') \subseteq B(q,\tfrac{1}{2} r^{\max}_i)\),

\[
\Pr[\ell^{(i)}_p \ne \ell^{(i)}_q]
\le 8 \cdot \frac{\operatorname{dist}(p,q)}{r^{\max}_i}
\left( H_{|\widetilde{B}^{P}_i(p,r^{\max}_i)|} - H_{|\widetilde{B}^{P}_i(p,r')|} \right),
\]

where \(H_k\) is the \(k\)-th harmonic number.
</div>

This lemma captures how the separation probability depends on the local growth of the bucketed neighborhood. The dynamics of its proof are interesting and revealing — I'll dedicate a separate post to it, as it's the most sophisticated part of the paper.

---

## Consistent Hashing

The algorithm relies on a notion of geometric hashing that makes the MPC implementation possible.

<div class="definition" style="background: #f0f7fb; border-left: 4px solid #3a87ad; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
<strong style="color: #045a8d;">Definition.</strong> A (randomized) hash function \(\phi : \mathbb{R}^d \to \mathbb{R}^d\) is called a \(\Gamma\)-gap \(\Lambda\)-consistent hash with diameter bound \(\tau>0\), or simply a \((\Gamma,\Lambda)\)-hash function, if:

<ol>
<li><strong>(Diameter)</strong> For every image \(z \in \phi(\mathbb{R}^d)\),
\(\operatorname{diam}(\phi^{-1}(z)) \le \tau\).</li>

<li><strong>(Consistency)</strong> For every \(S \subseteq \mathbb{R}^d\) with \(\operatorname{diam}(S) \le \tau/\Gamma\),
\(\mathbb{E}[|\phi(S)|] \le \Lambda\).</li>
</ol>
</div>

In words: small-diameter sets are expected to remain concentrated under the hash, while each bucket itself has bounded diameter. Without this notion, the algorithm could not be implemented in an MPC model, where computation may be performed in a streaming fashion.

---

## Dynamic Algorithm

The main result of the paper:

<div class="theorem" style="background: #f5f5f5; border-left: 4px solid #888; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
<strong>Theorem 4.2.</strong> Assume there exists a \((\Gamma,\Lambda)\)-hash function \(\phi : \mathbb{R}^d \to \mathbb{R}^d\) with diameter bound \(\tau\), such that for \(p \in \mathbb{R}^d\), the hash value \(\phi(p)\) and the set \(\phi(B(p,\tau/\Gamma))\) can be evaluated in \(O(\mathrm{poly}(d))\) and \(O(|\phi(B(p,\tau/\Gamma))|\cdot \mathrm{poly}(d))\) time, respectively.

Then there exists a dynamic algorithm which, for a dynamic set of points \(P \subseteq \mathbb{R}^d\), \(|P|\le n\), undergoing point insertions and deletions, maintains a tree embedding of \(P\) with \(O(\Gamma \log \Gamma \log n)\) distortion and \(\tilde{O}(d+\Lambda)\) expected amortized update time.
</div>

The tree embedding is rebuilt after every \(n\) updates. Each update results in \(\tilde{O}(1)\) expected updates to the tree embedding of two types:

- **Type 1:** A leaf becomes inactive (no point in \(P\) corresponds to it).
- **Type 2:** A new leaf and a path connecting it to an existing node are inserted.

How does the dynamic algorithm work? It follows the intuition of the static algorithm in the first half — finding the path and labels of the inserted point. The second half updates the labels for other points in \(P\) that need to change.

<blockquote style="background: #f8f9fa; border-left: 4px solid #2b8cbe; padding: 16px 20px; margin: 20px 0; font-family: 'Courier New', monospace; font-size: 14px; border-radius: 4px;">
<strong style="color: #045a8d; font-size: 15px;">Algorithm 2.</strong> <em>Insertion-procedure\((p)\)</em>
<br><br>
<span style="color: #888;">/* \(\phi_i\) is a metric hashing with diameter bound \(\tau_i := w_i/2\) */</span><br>
1. Draw \(\pi(p)\) and compute \(\phi_i(p)\) for all \(i \in [m]\)<br>
2. <strong>for</strong> \(i \leftarrow 1\) to \(m\) <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;3. Compute hash values \(X_i \leftarrow \{\phi_i(x) \mid x \in B(p,r_i)\}\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;4. Update \(\phi_i^{-1}(x)\) and \(\pi_{\min}(\phi_i^{-1}(x)\cap P)\) for all \(x \in X_i\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;5. \(\ell^{(i)}_p \leftarrow \pi_{\min}\!\big(\bigcup_{x\in X_i} \widetilde{B}^{P}_i(p,r_i)\big)\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;6. <strong>if</strong> \(\pi(p) = \pi_{\min}(\phi_i^{-1}(\phi_i(p)))\) <strong>then</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7. <strong>for all</strong> \(x \in X_i\) and all \(p' \in \phi_i^{-1}(x)\cap P\) <strong>do</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8. <strong>if</strong> \(\pi(x) < \ell^{(i)}_{p'}\) <strong>then</strong> update \(\ell^{(i)}_{p'} \leftarrow \pi(x)\)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9. <strong>end for</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;10. <strong>end if</strong><br>
11. <strong>end for</strong>
</blockquote>

Based on the theorems of consistent hashing, this gives the desired amortized upper bound on insertions.

---

## Looking Ahead

I'll write a separate post dedicated to Lemma 3.3 and its proof — it's the most technically sophisticated part of the paper and deserves a thorough treatment. The dynamics of the harmonic-number bound and how it interacts with the representative sets is particularly revealing.

### References

- Goranci, Jiang, Kiss, Kong, Qian, Szilagyi. *Tree Embedding in High Dimensions: Dynamic and Massively Parallel*. SODA 2026. arXiv:2510.XXXXX.
- The CKR decomposition: Charikar, Chekuri, Goel, Guha, and others. *Approximating a finite metric by a small number of tree metrics*. FOCS 1998.
- Bartal, Y. *Probabilistic approximation of metric spaces and its algorithmic applications*. FOCS 1996.
