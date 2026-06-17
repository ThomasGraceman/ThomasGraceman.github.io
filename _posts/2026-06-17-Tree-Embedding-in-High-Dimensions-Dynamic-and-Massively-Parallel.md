---
title: "Tree Embedding in High Dimensions: Dynamic and Massively Parallel"
date: 2026-06-17
permalink: /posts/tree-embedding-high-dimensions-dynamic-mpc/
redirect_from:
  - /Tree-Embedding-in-High-Dimensions-Dynamic-and-Massively-Parallel/
---

# Tree Embedding in High Dimensions: Dynamic and Massively Parallel

Let $(V,\mathrm{dist})$ be a metric space. Define

$$
B(x,r) := \{\, y\in V : \mathrm{dist}(x,y)\le r \,\}, \qquad x\in V,\; r\ge 0.
$$

For a subset $P\subseteq V$, define

$$
B_P(x,r) := B(x,r)\cap P.
$$

Let $\pi:P\to [0,1]$ be a random map, and let $r\sim \mathrm{Unif}\!\left[\frac{w}{4},\frac{w}{2}\right]$.

For each $p\in P$, define

$$
\ell_p := \operatorname*{arg\,min} \left\{ \pi(q): q\in B_P(p,r) \right\}.
$$

A **$\tau$-bounded decomposition** ($\tau$-BD) is a partition of $V$ such that every part has diameter at most $\tau$.

Let $\phi:V\to U$ be a hash function. For $x\in V$, define its bucket

$$
\operatorname{buk}(x) := \phi^{-1}(\phi(x)),
$$

and for any set $S\subseteq V$,

$$
\operatorname{buk}^{P}(x) := \operatorname{buk}(x)\cap P.
$$

Define the bucketed neighborhood

$$
\operatorname{buks}^{P}(S) := \bigcup_{x\in S}\operatorname{buk}^{P}(x).
$$

Finally, define

$$
\ell_p := \pi_{\min}\!\bigl(\widetilde{B}_P(p,r)\bigr),
\qquad \text{where} \qquad
\pi_{\min}(S) := \operatorname*{arg\,min}_{x\in S}\pi(x).
$$

### Assumptions and Parameters

For the sake of presentation( as in the paper ), we assume, without loss of generality, that the dataset $P\subseteq V$ has the smallest inter-point distance greater than $1$, and that its diameter $\Delta := \operatorname{diam}(P)$ satisfies

$$
\Delta = 2^{m-1}
$$

for some $m\in\mathbb{N}$. For every integer $i$, let $w_i := 2^{m-i}$.

---

Well recently I have come across a really cool paper, *Tree Embedding in High Dimensions: Dynamic and Massively Parallel*, which is a nice and cool utilization of geometric hashing  which in turn is itself a sparse partition of the space and metric space at hand. Basically how the algorithm at the basic level works is the same as its predecessors like the CKR process: put a randomization forward, break down the metric space in a recursive ( in predecessors) manner, and the structure and analysis help you get an ultrametric with distortion of $O(\log n)$. But the novelty of their paper lies in the fact that they propose a cool dynamic algorithm, work in a more general setting, and make novel use of the dynamic paradigm, which also works extremely well in the MPC agenda, a distributed version of streaming where parallelism replaces sequential access. Without consistent hashing or geometric hashing such a thing may not have been possible.

So the intuition is really there: find a good neighborhood of points, put a random priority map, decompose the labels in the appropriate buckets according to distance at each level. But it takes a more sophisticated approach which I am going to explain. Instead of a top-down recursive approach  a rather greedy paradigm which in this setting may force more computational power  we build it independently at each level. This helps in the design of the dynamic algorithm.

So, the base intuition is there, but I may start with some technical analysis like the authors did or just outright explain the algorithm. Explaining the analysis is more revealing, so we start with that.

---

It is a standard fact that the distance between points $p,q$ in the tree $T$ is determined by their LCA (least common ancestor) in the tree. The following notation defines the level of the LCA (minus $1$) with respect to the labels $\ell$.

**Algorithm 1:** Tree embedding on input $P \subseteq V$ with access to metric hashes $\{\phi_i\}_{i\in[m]}$

> **Note:** $\phi_i$ is a metric hashing with diameter bound $\tau_i := w_i/2$
>
> 1. Sample $\beta \in \left[\tfrac{1}{4}, \tfrac{1}{2}\right]$ uniformly at random
> 2. Let $\pi$ be a uniform random map from $P$ to $[0,1]$
> 3. **For** $i \leftarrow 1$ to $m$:
>    - $r_i \leftarrow \frac{\beta}{\Gamma} \cdot w_i$
>    - **For** each $$p \in P$$:
>      - $$\ell^{(i)}_p \leftarrow \pi_{\min}\!\big(\widetilde{B}^{P}_i(p,r_i)\big)$$
> 4. **Return** $$\{\ell^{(i)}_p\}_{i\in[m],\,p\in P}$$

> **Definition (Tree level).**
> For $p,q\in P$, define
> $$
> \operatorname{lv}(p,q) := \min\left\{\, i\in [m] : \ell^{(i)}_{p}\neq \ell^{(i)}_{q} \,\right\}.
> $$

Since the embedding tree is a $2$-HST, it is immediate that

$$
\operatorname{dist}_T(p,q)
= \sum_{i=\operatorname{lv}(p,q)}^{m} 2w_i
\in \left[\,2w_{\operatorname{lv}(p,q)},\;4w_{\operatorname{lv}(p,q)}\right).
$$

The embedding tree $T$ has height $m$, and the edge weight from every level-$i$ node to every level-$(i+1)$ node is $w_i$. Here, level $1$ is the root (which consists of a singleton partition), and level $m$ consists of the leaves, each of which contains at most a single data point.

Fix $p,q\in P$, and let

$$
i := \operatorname{lv}(p,q)-1,
$$

so that we are one level higher than the separator in the tree. Since the embedding tree is a $2$-HST, we have

$$
\operatorname{dist}_T(p,q)\ge 2w_{i+1}.
$$

Moreover, by the definition of $\operatorname{lv}(p,q)$, we have $\ell^{(i)}_p=\ell^{(i)}_q$. Let

$$
p' := \pi^{-1}\!\left(\ell^{(i)}_p\right).
$$

<img src="/images/treemetric.png" alt="Banach book" style="max-width: 400px; height: auto;">

Then we also have $p'=\pi^{-1}\!\left(\ell^{(i)}_q\right)$, because this follows directly from the definition. In other words, $p$ and $q$ are placed in the same bucket at the upper levels; namely, the hash functions classify them identically.

Therefore,

$$
\operatorname{buks}_i(p')\cap B(p,r_i)\neq\varnothing
\qquad\text{and}\qquad
\operatorname{buks}_i(p')\cap B(q,r_i)\neq\varnothing.
$$

What we are really doing is taking the neighborhood of a point and using the sparsification palette (or agenda) induced by the hashing functions. We then label the point according to the highest-priority point that lies in the corresponding buckets, according to the hash function, and that also belongs to $P$.

Hence, by the definition of $\widetilde{B}_i^P$, we can see that

$$
\phi_i(p')\in \phi_i\bigl(B(p,r_i)\bigr)
\qquad\text{and}\qquad
\phi_i(p')\in \phi_i\bigl(B(q,r_i)\bigr),
$$

so the claim is proved. We use this fact to obtain an upper bound on $\operatorname{dist}(p,q)$.

Now, let $\hat{p}$ be an arbitrary point in $\operatorname{buks}_i(p') \cap B(p,r_i)$, and let $\hat{q}$ be an arbitrary point in $\operatorname{buks}_i(p') \cap B(q,r_i)$.

Since $\hat{p}$ and $\hat{q}$ belong to the same bucket $\operatorname{buks}_i(p')$, i.e., $\phi_i(\hat{p})=\phi_i(\hat{q})$, by the diameter bound of $\phi_i$ we have

$$
\operatorname{dist}(\hat{p},\hat{q})\le \tau_i=w_{i+1}.
$$

Also observe that $\operatorname{dist}(p,\hat{p})\le r_i$ and $\operatorname{dist}(q,\hat{q})\le r_i$. Hence,

$$
\operatorname{dist}(p,q)
\le \operatorname{dist}(p,\hat{p})
   + \operatorname{dist}(\hat{p},\hat{q})
   + \operatorname{dist}(\hat{q},q)
\le 2r_i + w_{i+1}
\le 2w_{i+1}
\le \operatorname{dist}_T(p,q).
$$

The proof of

$$
\mathbb{E}\!\left[\operatorname{dist}_T(p,q)\right]
\le
O(\Gamma\log\Gamma)\cdot \log n \cdot \operatorname{dist}(p,q)
$$

is interesting in its own right, but it is too technical for a general reader. Nevertheless, it can be studied to prove similar results and is quite helpful in those settings. Therefore, I omit it from this post and may discuss it in a future post.

However, we now turn to Lemma 3.3, which is used for the distortion result.

> **Lemma 3.3.**
> For every $p,q\in P$, $i\in[m]$, and $0 \le r' \le \tfrac{1}{2} r^{\max}_i$ such that
> $B(p,r') \subseteq B\!\left(q,\tfrac{1}{2} r^{\max}_i\right)$, it holds that
>
> $$
> \Pr\!\big[\ell^{(i)}_p \ne \ell^{(i)}_q\big]
> \le
> 8 \cdot \frac{\operatorname{dist}(p,q)}{r^{\max}_i}
> \left(
> H_{|\widetilde{B}^{P}_i(p,r^{\max}_i)|}
> -
> H_{|\widetilde{B}^{P}_i(p,r')|}
> \right).
> $$

The dynamics of the proof of this lemma are really interesting and revealing, so I will dedicate a separate post to it  I find it the most sophisticated part of the paper.

This lemma is particularly revealing and intuitive in parts, as it captures how the separation probability depends on the local growth of the bucketed neighborhood structure.
But the neighborhood definition which the authors defined was so hard to work with in analysis so they came up with a rather nice object to solve the problem.

Their solution was to come up with the **representative set**, which is a way to keep the geometric structure nice and steady  ball-like even  while at the same time maintaining crucial information necessary for the analysis of the algorithm, there have been another problem in finding the upperbounds for probabilities which they solved by defining axuliry events, these two key observations are rather interesting.

I will try to explain these concepts.

---

### Representative Sets

Their proof strategy is to utilize the structure of $\widetilde{B}^{P}_i(\cdot,\cdot)$, and argue that a carefully chosen set of representatives of $\widetilde{B}^{P}_i(p,r)$ has similar geometric properties kind of like a standard ball.

> **Definition (Representative sets).**
> A collection of sets $\operatorname{rep}_i(p,r) \subseteq V$ (which may not necessarily be a subset of $P$), defined for every $p\in P$, $i\in[m]$, and $r\ge 0$, is called a **family of representative sets** if for every $i\in[m]$, $p\in P$, and $r\ge 0$, the following properties hold:
>
> 1. **(distinct)** For all $x \neq y \in \operatorname{rep}_i(p,r)$,
>    $$\operatorname{buks}_i(x) \cap \operatorname{buks}_i(y) = \emptyset.$$
>
> 2. **(monotone)** For all $r' \in (0,r)$,
>    $$\operatorname{rep}_i(p,r') \subseteq \operatorname{rep}_i(p,r).$$
>
> 3. **(ball-preserving)**
>    $$\operatorname{rep}_i(p,r) \subseteq B(p,r)\cap \operatorname{buks}_i(P),$$
>    and
>    $$\operatorname{buks}^{P}_i\!\big(\operatorname{rep}_i(p,r)\big) = \operatorname{buks}^{P}_i\!\big(B(p,r)\big).$$

Property 1 is useful for several results in the upcoming analysis. Properties 2 and 3 ensure that the representative sets behave similarly to metric balls, so that no essential information is lost in the abstraction.

> **Lemma.**
> There exists a family $\{\operatorname{rep}_i(p,r) : i\in[m],\, p\in P,\, r\ge 0\}$ satisfying the definition above.

*Proof.* We introduce the following notation to define $\operatorname{rep}$.

For each $i\in[m]$, $p\in P$, and $x\in V$, define

$$
\operatorname{NNbuks}_i(p,x)
:=
\arg\min_{y\in \operatorname{buks}_i(x)} \operatorname{dist}(p,y)
\in V.
$$

This is the nearest point in $\operatorname{buks}_i(x)$ to $p$, which may not necessarily lie in $P$. Then, for each $i\in[m]$, $p\in P$, and $S\subseteq V$, define

$$
\operatorname{NNbuks}_i(p,S) := \left\{ \operatorname{NNbuks}_i(p,x) : x\in S \right\}.
$$

Note that for any $x,y\in S$, if $\phi_i(x)=\phi_i(y)$, then $\operatorname{NNbuks}_i(p,x) = \operatorname{NNbuks}_i(p,y)$, so $\operatorname{NNbuks}_i(p,S)$ contains at most one point from each bucket.

> **Definition (Key representative).**
> For each $i\in[m]$, $p\in P$, and $r>0$, define $\operatorname{rep}^{*}_i(p,r)$ as the minimum point in $\operatorname{rep}_i(p,r)$ with respect to $\pi$:
>
> $$
> \operatorname{rep}^{*}_i(p,r)
> :=
> \arg\min \left\{
> \pi_{\min}\!\big(\operatorname{buks}^{P}_i(x)\big)
> : x \in \operatorname{rep}_i(p,r)
> \right\}.
> $$
>
> Note that $\operatorname{rep}^{*}_i(p,r)$ is unique, since all values of $\pi$ are distinct with probability $1$.

Moreover, this key representative precisely realizes the minimizer of the $\pi$-value within $\operatorname{rep}_i(p,r)$:

$$
\ell^{(i)}_p = \pi_{\min}\!\big(\operatorname{buks}^{P}_i(\operatorname{rep}^{*}_i(p,r_i))\big).
$$

To give a rough sketch, we define the probability of separation based on the key representative, and introduce auxiliary events to analyze the resulting probabilities.

First, notice that the event $\ell^{(i)}_p \neq \ell^{(i)}_q$ is equivalent to either $\ell^{(i)}_p < \ell^{(i)}_q$ or $\ell^{(i)}_p > \ell^{(i)}_q$, and these two events are symmetric. Therefore, it suffices to bound $\Pr\big[\ell^{(i)}_p < \ell^{(i)}_q\big]$.

Specifically, we show that the event $\ell^{(i)}_p < \ell^{(i)}_q$ implies a geometric fact about the key representative; namely,

$$
\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i).
$$

To see this, by the key representative identity and Algorithm 1 (line 5), we have

$$
\ell^{(i)}_p
= \pi_{\min}\!\big(\operatorname{buks}^{P}_i(\operatorname{rep}^{*}_i(p,r_i))\big)
< \ell^{(i)}_q
= \pi_{\min}\!\big(\operatorname{buks}^{P}_i(B(q,r_i))\big).
$$

This implies that

$$
\operatorname{buks}^{P}_i(\operatorname{rep}^{*}_i(p,r_i))
\not\subseteq
\operatorname{buks}^{P}_i(B(q,r_i)),
$$

which leads to $\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i)$. Therefore,

$$
\Pr\big[\ell^{(i)}_p < \ell^{(i)}_q\big]
\le
\Pr\big[\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i)\big].
$$

#### Analyzing the probability via an auxiliary event

One difficulty in analyzing $\Pr[\operatorname{rep}^{*}_i(p,r_i) \notin B(q,r_i)]$ is that it depends on two sources of randomness: the hash function $\pi$ and the random radius $r_i$. To separate these sources, we define an auxiliary event $E$, whose randomness depends only on $\pi$.

This event is defined with respect to $i\in[m]$, $p\in P$, and $x\in V$. It captures whether $x$ achieves the minimum $\pi$-value in $\widetilde{B}^{P}_i(p,r)$, where $r=\operatorname{dist}(p,x)$.

> **Definition (Auxiliary event).**
> For every $i\in[m]$, $p\in P$, and $x\in V$, define the event (with respect to the randomness of $\pi$)
>
> $$
> E^{(i)}_p(x)
> :=
> \left\{
> \pi_{\min}\!\big(\operatorname{buks}^{P}_i(x)\big)
> =
> \pi_{\min}\!\big(\operatorname{buks}^{P}_i(\operatorname{rep}_i(p,r))\big)
> \right\},
> $$
>
> where $r = \operatorname{dist}(p,x)$.

Now we turn to the most interesting part of the paper.

> **Definition ($(\Gamma,\Lambda)$-hash function).**
> A (randomized) hash function $\phi : \mathbb{R}^d \to \mathbb{R}^d$ is called a **$\Gamma$-gap $\Lambda$-consistent hash** with diameter bound $\tau>0$, or simply a **$(\Gamma,\Lambda)$-hash function**, if it satisfies:
>
> 1. **(Diameter)** For every image $z \in \phi(\mathbb{R}^d)$,
>    $$\operatorname{diam}(\phi^{-1}(z)) \le \tau.$$
>
> 2. **(Consistency)** For every $S \subseteq \mathbb{R}^d$ with $\operatorname{diam}(S) \le \tau/\Gamma$,
>    $$\mathbb{E}\big[|\phi(S)|\big] \le \Lambda.$$

In words, this definition formalizes a geometric hashing scheme in which small-diameter sets are expected to remain concentrated under the hash, while each bucket itself has bounded diameter.

Without the notion of consistent hashing, it would not be possible to implement the algorithm in an MPC model, where computation may be performed in a streaming fashion as mentioned and implemented in the original papers.

> **Theorem 4.2.**
> Assume there exists a $(\Gamma,\Lambda)$-hash function $\phi : \mathbb{R}^d \to \mathbb{R}^d$ with diameter bound $\tau$, such that for $p \in \mathbb{R}^d$, the hash value $\phi(p)$ and the set of hash values $\phi(B(p,\tau/\Gamma))$ can be evaluated in $O(\mathrm{poly}(d))$ time and $O(|\phi(B(p,\tau/\Gamma))|\cdot \mathrm{poly}(d))$ time, respectively.
>
> Then there exists a dynamic algorithm which, for a dynamic set of points 
> $P \subseteq \mathbb{R}^d$ with $|P|\le n$ undergoing point insertions and deletions, maintains a tree embedding of $P$ with
> $O(\Gamma \log \Gamma \log n)$ distortion and $\tilde{O}(d+\Lambda)$ expected amortized update time.
>
> The underlying tree embedding is rebuilt by the algorithm after every $n$ updates. An update to the point set $P$ results in $\tilde{O}(1)$ expected updates to the tree embedding of the following types:
>
> - **Type 1:** A leaf of the embedding becomes inactive, in the sense that no point in $P$ corresponds to it.
> - **Type 2:** A new leaf and a path connecting the leaf to an existing node in the tree embedding are inserted into the embedding.


**Algorithm 2:** Insertion-procedure$(p)$

> **Note:** $\phi_i$ is a metric hashing with diameter bound $\tau_i := w_i/2$
>
> 1. Draw $\pi(p)$ and compute $\phi_i(p)$ for all $i \in [m]$
> 2. **For** $i \leftarrow 1$ to $m$:
>    - Compute hash values $X_i \leftarrow \{\phi_i(x) \mid x \in B(p,r_i)\}$
>    - *(Computing label $\ell^{(i)}_p = \pi_{\min}(\widetilde{B}^{P}_i(p,r_i))$)*
>    - Update $$\phi_i^{-1}(x)$ and $\pi_{\min}(\phi_i^{-1}(x)\cap P)$$ for all $$x \in X_i$$
>    - $$\ell^{(i)}_p \leftarrow \pi_{\min}\!\left(\bigcup_{x\in X_i} \widetilde{B}^{P}_i(p,r_i)\right)$$
>    - *(Updating labels $\ell^{(i)}_q$ for $q \in P$)*
>    - **If** $\pi(p) = \pi_{\min}(\phi_i^{-1}(\phi_i(p)))$:
>      - **For** all $x \in X_i$ and all $p' \in \phi_i^{-1}(x)\cap P$:
>        - **If** $$\pi(x) < \ell^{(i)}_{p'}$$: update $$\ell^{(i)}_{p'} \leftarrow \pi(x)$$

So based on the theorems of consistent hashing we can provide the preferred amortized upper bound on the insertion.

But how does the dynamic algorithm work? It basically follows the intuition of the previous algorithm in the first half, by finding the path and labels of the inserted point, and the second half updates the path for other nodes in $P$, by altering the labels which need to change.