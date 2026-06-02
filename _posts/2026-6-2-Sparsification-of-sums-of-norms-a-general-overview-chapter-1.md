---
title: "Sparsification of Sums of Norms: A General Overview — Chapter 1"
date: 2026-06-02
permalink: /posts/sparsification-sums-of-norms-chapter-1/
redirect_from:
  - /Sparsification_of_sums_of_norms_a_general_overview_chapter_1/
  - /Sparsification-of-sums-of-norms-a-general-overview-chapter-1/
---

# Sparsification of Sums of Norms
## A General Overview · Chapter 1

> Ok, I want to summarize the *sparsification of sums of norms* problem. Unlike some of my longer earlier posts, I will not try a full review at once, on purpose. Each chapter should focus on one concept or technique in detail, or at least that is the plan. Hopefully I can finish this series if nothing gets in the way.

---

## 1. From Graphs to Sums of Norms

Sparsification usually means replacing a large object by a smaller one that is still close in a useful sense. The classical starting point in computer science to my knowledge is **graph sparsification**: for example Benczúr and Karger (1996), *Approximating s-t Minimum Cuts in $\tilde{O}(n^2)$ Time*, build sparse subgraphs that preserve cuts. From 2000, preserving **spectral** notions has became central, see Tasuku Soma, *Spectral Sparsification of Hypergraphs*, or James R. Lee, *Spectral Hypergraph Sparsification via Chaining*, where one minimizes an energy $Q_h$ over convex bodies tied to the hypergraph.

The paper I am following here tries to propose an abstraction, a more general framwork. A later paper is Jambulapati, Lee, Liu, Sidford, *Sparsifying Generalized Linear Models*. Some techniques utilized also found justifications in *Chaining, Group Leverage Score Overestimates, and Fast Spectral Hypergraph Sparsification* (in my opinion).

---

## 2. What They Prove

I will state the main result in the authors' wording. For any norms $N_1,\dots,N_m$ on $\mathbb{R}^n$, define

$$
N(x) := N_1(x)+\cdots+N_m(x).
$$

They show that there exists a sparsified norm

$$
\widetilde{N}(x) = w_1 N_1(x)+\cdots+w_m N_m(x),
$$

such that

$$
\bigl|N(x)-\widetilde{N}(x)\bigr| \leq \varepsilon\,N(x)
\qquad \text{for all } x\in\mathbb{R}^n,
$$

where $w_1,\dots,w_m$ are nonnegative weights, of which only

$$
\mathcal{O}\!\left(
  \varepsilon^{-2}\, n
  \log\!\left(\frac{n}{\varepsilon}\right)
  (\log n)^{2.5}
\right)
$$

are nonzero.

The weights can be found with high probability in time

$$
\mathcal{O}\!\left(
  m(\log n)^{\mathcal{O}(1)}
  +
  \operatorname{poly}(n)
\right)T,
$$

where $T$ is the time to evaluate one norm $N_i(x)$, assuming $N$ is $\operatorname{poly}(n)$-equivalent to the Euclidean norm.

This abstraction covers graph sparsification and other cases (for example some submodular functions related to cuts). That is why the general statement is worth the setup.

---

## 3. The Problem in One Place

Let $$N_1,\ldots,N_m : \mathbb{R}^n \to \mathbb{R}_{+}$$ be seminorms and $$N(x) := \sum_{i=1}^{m} N_i(x)$$. Given weights $$w_1,\ldots,w_m \ge 0$$, the weighted seminorm is

$$
\widetilde{N}(x) := \sum_{i=1}^{m} w_i\, N_i(x).
$$

We call $\widetilde{N}$ **$s$-sparse** if at most $s$ of the $w_i$ are nonzero, and an **$\varepsilon$-approximation** of $N$ if

$$
\bigl|N(x)-\widetilde{N}(x)\bigr| \leq \varepsilon\,N(x),
\qquad \forall\, x\in\mathbb{R}^n.
$$

The question is whether one can build such a $\widetilde{N}$ using only a small number of nonzero weights.

---

## 4. How the Paper Proceeds

At a high level the workflow is:

1. Assign an **importance** to each term.
2. **Sample** terms to get an unbiased estimator while controlling variance and deviation.
3. **Compute** those importances efficiently, via a homotopy method.

I will unpack each step in later chapters; the homotopy method especially seems worth its own post.

---

## 5. Lewis Weights and Row Sampling

The specific algorithmic use of Lewis weights, to my knowledge, goes back to Cohen and Peng, [*$\ell_p$ Row Sampling by Lewis Weights*](https://arxiv.org/abs/1412.0588). Randomized row sampling is a nice technique that can be use to design many algorithms. A standard instance: given

$$
A \in \mathbb{R}^{n\times d},
\qquad n \gg d,
$$

and $\varepsilon>0$, find a matrix $A'$ built from few rescaled rows of $A$ such that

$$
\|Ax\|_p \approx_{1+\varepsilon} \|A'x\|_p,
\qquad \forall\, x\in\mathbb{R}^d,
$$

where $a \approx_{1+\varepsilon} b$ means $\frac{1}{1+\varepsilon}\,b \le a \le (1+\varepsilon)b$.

Strong $\ell_p$ row-sampling bounds use Lewis's change-of-density construction ([Lewis, 1978](https://eudml.org/doc/218208)), later used by Talagrand and others ([Bourgain–Lindenstrauss–Milman, 1989](https://doi.org/10.1007/BF02392835); [Talagrand, 1995](https://archive.org/details/isbn_9783764352073_77)): assign a weight to each row (like a leverage score), sample by those weights aka the **Lewis weights**. In short, Lewis weights let us study an $\ell_p$ matrix through an associated $\ell_2$ matrix $B$, where the space is much nicer in general.

---

> **Definition (Leverage Score).**
>
> Let $A\in\mathbb{R}^{n\times d}$, and let $a_i$ denote its $i$-th row. The leverage score of the $i$-th row is defined by
>
> $$
> \tau_i(A) := a_i^{\top}(A^{\top}A)^{-1}a_i.
> $$
>
> Equivalently,
>
> $$
> \tau_i(A) = \bigl\|(A^{\top}A)^{-1/2}a_i\bigr\|_2^2.
> $$

---

> **Definition ($\ell_p$ Lewis Weights).**
>
> Given a matrix $A\in\mathbb{R}^{n\times d}$, the $\ell_p$ Lewis weights are the unique weights
>
> $$
> w_1,\ldots,w_n \ge 0
> $$
>
> such that, if $W=\operatorname{diag}(w_1,\ldots,w_n)$, then for every row $i$,
>
> $$
> w_i = \tau_i\!\left(W^{\,\frac12-\frac1p}A\right),
> $$
>
> where $\tau_i(B)$ denotes the leverage score of the $i$-th row of the matrix $B$.

---

Existence and uniqueness in the general setting can be shown via the optimization problem

$$
\begin{array}{ll}
\text{maximize}   & \det(M) \\[6pt]
\text{subject to} & \displaystyle\sum_{i}\bigl(a_i^{\top}M\,a_i\bigr)^{p/2}\le d, \\[10pt]
                  & M \succeq 0.
\end{array}
$$

Used carefully, this theory is one route toward sparsification. As in [Lee's course notes](https://homes.cs.washington.edu/~jrl/teaching/cse599au23) (*Sparsification, sampling, and optimization*, Autumn 2023), we start from a concrete $\ell_2$ setting and build outward, that is what the next sections do.

---

## 6. Unbiased Estimators

A standard sparsifier starts from independent random sampling. Let $F(x)=\sum_{i=1}^m f_i(x)$ and let $\rho=(\rho_1,\ldots,\rho_m)$ be a probability distribution on $\{1,\ldots,m\}$. Sample $i_1,\ldots,i_M$ independently from $\rho$ and set

$$
\widetilde{F}(x)
:=
\frac{1}{M}
\sum_{j=1}^{M}
\frac{f_{i_j}(x)}{\rho_{i_j}}.
$$

Rescaling by $\rho_{i_j}$ makes $\widetilde{F}$ unbiased: for every $x$,

$$
\mathbb{E}\!\left[\frac{f_{i_1}(x)}{\rho_{i_1}}\right]
=
\sum_{i=1}^{m}f_i(x)
=
F(x),
$$

so $\mathbb{E}[\widetilde{F}(x)] = F(x)$.

---

## 7. Importance Sampling

Unbiasedness holds for any $\rho$, but a good $\varepsilon$-approximation with small $M$ needs $\rho$ chosen to **lower variance**, importance sampling: sample large contributors more often.

With $\rho \in (0,1]^m$, sample $i_1,\ldots,i_M$ from $\rho$ and define

$$
\widetilde{N}(x)
:=
\frac{1}{M}
\sum_{j=1}^{M}
\frac{N_{i_j}(x)}{\rho_{i_j}}.
$$

Since $\widetilde{N}$ is unbiased, we study how far it can deviate from its mean:

$$
\mathbb{E}
\left[
  \sup_{x\in B_N}
  \left|
    \widetilde{N}(x) - \mathbb{E}[\widetilde{N}(x)]
  \right|
\right],
\qquad
B_N = \{x\in\mathbb{R}^n : N(x)\le 1\}.
$$

---

## 8. Symmetrization and Chaining

To control that deviation we symmetrize and obtain a subgaussian process, then bound it by generic chaining.

Introduce independent Rademachers $\varepsilon_1,\ldots,\varepsilon_M \in \{-1,+1\}$. By symmetrization it suffices to bound

$$
\mathbb{E}_{\varepsilon_1,\ldots,\varepsilon_M}\!\left[
  \sup_{x\in B_N}
  \frac{1}{M}
  \sum_{j=1}^{M}
  \varepsilon_j\,
  \frac{N_{i_j}(x)}{\rho_{i_j}}
\right].
$$

The target is a bound of the form

$$
\delta\left(\sup_{x\in B_N}\widetilde{N}(x)\right)^{1/2}.
$$

Define

$$
V_x
:=
\frac{1}{M}
\sum_{j=1}^{M}
\varepsilon_j\,
\frac{N_{i_j}(x)}{\rho_{i_j}},
\qquad x\in\mathbb{R}^n.
$$

The family $\{V_x : x\in\mathbb{R}^n\}$ is subgaussian, with metric

$$
d(x,y)
:=
\Bigl(\mathbb{E}|V_x-V_y|^2\Bigr)^{1/2}
=
\frac{1}{M}
\left(
  \sum_{j=1}^{M}
  \left(
    \frac{N_{i_j}(x)-N_{i_j}(y)}{\rho_{i_j}}
  \right)^2
\right)^{1/2},
$$

using orthogonality of the Rademacher variables.

---

## 9. A Concrete $\ell_2$ Bound (from the course)

For $p=2$, following [Lee's course](https://homes.cs.washington.edu/~jrl/teaching/cse599au23), fix a sample $\nu=(\nu_1,\ldots,\nu_M)$ and set

$$
d_{\nu}(x,y)
:=
\left(
  \sum_{j=1}^{M}
  \left(
    \frac{f_{\nu_j}(x)-f_{\nu_j}(y)}{M\rho_{\nu_j}}
  \right)^2
\right)^{1/2}.
$$

One wants

$$
\mathbb{E}_{\varepsilon}\!\left[
  \sup_{F(x)\le 1}
  \sum_{j=1}^{M}
  \varepsilon_j\,
  \frac{f_{\nu_j}(x)}{M\rho_{\nu_j}}
\right]
\le
\delta
\left(
  \sup_{F(x)\le 1}
  \widetilde{F}_{\nu}(x)
\right)^{1/2},
\qquad
\widetilde{F}_{\nu}(x)
=
\sum_{j=1}^{M}
\frac{f_{\nu_j}(x)}{M\rho_{\nu_j}}.
$$

Let $B_F=\{x: F(x)\le 1\}$. Dudley's entropy bound on the subgaussian process gives

$$
\mathbb{E}_{\varepsilon}\!\left[
  \sup_{x\in B_F}
  \sum_{j=1}^{M}
  \varepsilon_j\,
  \frac{f_{\nu_j}(x)}{M\rho_{\nu_j}}
\right]
\lesssim
\sum_{h\ge 0}
2^{h/2}\,e_h(B_F,\,d_{\nu}),
$$

where $e_h(B_F,d_{\nu})$ is the $h$-th entropy number of $B_F$ for $d_{\nu}$.

The remaining work is covering numbers $N(B_2^n,d_U,\varepsilon)$ for rows

$$
u_j
:=
\frac{(A^\top A)^{-1/2}a_{\nu_j}}{\sqrt{M\rho_{\nu_j}}}.
$$

With the Lewis-type choice of $\rho$,

$$
\|u_j\|_2 = \sqrt{\frac{n}{M}}.
$$

Combining entropy estimates for $B_2^n$, Dudley's bound, and chaining yields

$$
\mathbb{E}_{\varepsilon}\!\left[
  \sup_{F(x)\le 1}
  \sum_{j=1}^{M}
  \varepsilon_j\,
  \frac{f_{\nu_j}(x)}{M\rho_{\nu_j}}
\right]
\lesssim
\sqrt{\frac{n(\log n)^2\log M}{M}}
\left(
  \sup_{F(x)\le 1}
  \widetilde{F}_{\nu}(x)
\right)^{1/2}.
$$

Taking

$$
M = C\,\frac{n}{\varepsilon^2}(\log n)^2\log\!\left(\frac{n}{\varepsilon}\right)
$$

for large enough $C$ gives the $\varepsilon$-scale bound needed for the approximation. That is the $\ell_2$ backbone; later chapters push the same pattern toward sums of general norms.

(I will try to keep the notes really short, and also try to add some novelty into them hopefully, i perhaps will investigate this paper through the lens of banach space theory, but it will take a lot of time and effort.)

---

## References

### Main Sources for this Chapter

- James R. Lee et al., [*Sparsifying Sums of Norms*](https://homes.cs.washington.edu/~jrl/papers/pdf/norm-sparsify.pdf)
- James R. Lee, [*CSE 599: Sparsification, sampling, and optimization*](https://homes.cs.washington.edu/~jrl/teaching/cse599au23) (Autumn 2023; see also [Lewis weights notes](https://homes.cs.washington.edu/~jrl/teaching/cse599au23/notes/lewisweights.html))
- Michael B. Cohen and Richard Peng, [*$\ell_p$ Row Sampling by Lewis Weights*](https://arxiv.org/abs/1412.0588) ([PDF](https://arxiv.org/pdf/1412.0588))

### Related Sparsification

- Jambulapati, Lee, Liu, Sidford, [*Sparsifying Generalized Linear Models*](https://arxiv.org/abs/2311.18145)
- Jambulapati, Liu, Sidford, [*Chaining, Group Leverage Score Overestimates, and Fast Spectral Hypergraph Sparsification*](https://arxiv.org/abs/2209.10539)
- James R. Lee, [*Spectral Hypergraph Sparsification via Chaining*](https://arxiv.org/abs/2209.04539)
- Tasuku Soma, *Spectral Sparsification of Hypergraphs*
- Benczúr and Karger (1996), *Approximating s-t Minimum Cuts in $\tilde{O}(n^2)$ Time*

### Classical Lewis-Weight Literature

- D. R. Lewis, [*Finite dimensional subspaces of $L_p$*](https://eudml.org/doc/218208), *Studia Mathematica* **63** (1978), 207–212 — change of density
- J. Bourgain, J. Lindenstrauss, and V. D. Milman, [*Approximation of zonoids by zonotopes*](https://doi.org/10.1007/BF02392835), *Acta Mathematica* **162** (1989), 73–141
- M. Talagrand, *Embedding subspaces of $L_p$ in $\ell_p^N$*, in *Geometric Aspects of Functional Analysis* (Israel Seminar 1992–94), Oper. Theory Adv. Appl. **77**, Birkhäuser, 1995, pp. 311–326 ([volume](https://archive.org/details/isbn_9783764352073_77))