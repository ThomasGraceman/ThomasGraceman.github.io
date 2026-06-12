---
title: "Lewis Weights, Leverage Scores, and Whitening — Chapter 2"
date: 2026-06-13
permalink: /posts/lewis-weights-leverage-scores-whitening-chapter-2/
redirect_from:
  - /Lewis-Weights-Leverage-Scores-and-Whitening-Chapter-2/
---

# Sparsification of Sums of Norms
## Lewis Weights, Leverage Scores, and Whitening · Chapter 2

This is the second chapter in my series on [Sparsifying Sums of Norms](https://homes.cs.washington.edu/~jrl/papers/pdf/norm-sparsify.pdf). [Chapter 1](/posts/sparsification-sums-of-norms-chapter-1/) set up the general problem and briefly mentioned Lewis weights. Here I want to slow down and explain one piece that helped me personally: **leverage scores look like statistical whitening in disguise**, and Lewis weights are the $\ell_p$ generalization of that idea.

---

## 1. Whitening as a Change of Coordinates

In statistics and machine learning, **whitening** means transforming data so that its covariance becomes the identity. Good expositions are [Andy Jones's notes on statistical whitening](https://andrewcharlesjones.github.io/journal/whitening.html) and Dustin Stansbury's post [*The Statistical Whitening Transform*](https://theclevermachine.wordpress.com/2013/03/30/the-statistical-whitening-transform/) on The Clever Machine.

Suppose $X \in \mathbb{R}^{n \times p}$ has (centered) covariance $\Sigma = \frac{1}{n} X^\top X$. A whitening matrix $W$ satisfies

$$
\frac{1}{n} W^\top X^\top X W = W^\top \Sigma W = I_p,
$$

so the whitened data $Y = XW$ has identity covariance. One standard choice is

$$
W = \Sigma^{-1/2} = U \Lambda^{-1/2} U^\top,
$$

where $\Sigma = U \Lambda U^\top$ is the eigendecomposition. Geometrically (as Stansbury explains): first rotate into the eigenbasis of $\Sigma$, then scale each direction by the inverse of its standard deviation. The result is a sphere of unit variance in every coordinate.

The key point for us is not PCA versus ZCA whitening, but the appearance of **$\Sigma^{-1/2}$**: a symmetric square root of the inverse covariance. That object reweights directions so that none dominates.

---

## 2. Leverage Scores Are Whitening Applied to Rows

Now switch to the linear-algebra setting of row sampling. Let $A \in \mathbb{R}^{n \times d}$ with rows $a_1^\top, \ldots, a_n^\top$, and assume $A$ has full column rank so $A^\top A$ is invertible. The **Gram matrix** $A^\top A$ plays the role of a covariance matrix for the column space.

The **leverage score** of row $i$ is

$$
\tau_i(A) := a_i^\top (A^\top A)^{-1} a_i
= \bigl\|(A^\top A)^{-1/2} a_i\bigr\|_2^2.
$$

Read the second form carefully: we apply $(A^\top A)^{-1/2}$ to the row $a_i$, then take its squared Euclidean length. That is exactly the whitening pattern from the previous section, but applied row-by-row instead of to a data matrix of samples.

So leverage scores measure **how large a row becomes after we whiten the column geometry**. Rows that align with directions where $A^\top A$ has small eigenvalues blow up under $(A^\top A)^{-1/2}$ and get large leverage. Rows that lie in flat directions of the row space get small leverage.

This is why leverage scores are the right sampling probabilities for $\ell_2$ row sampling: after whitening, every direction in $\mathbb{R}^d$ should contribute comparably, and $\tau_i(A)$ quantifies how much row $i$ contributes.

---

## 3. From $\ell_2$ Leverage to $\ell_p$ Lewis Weights

For general $p$, the analogue of leverage scores is less obvious because $\|\cdot\|_p$ is not induced by a single inner product in the same clean way. Lewis's classical **change-of-density** construction ([Lewis, 1978](https://eudml.org/doc/218208), *Finite dimensional subspaces of $L_p$*) produces weights $w_1, \ldots, w_n \ge 0$ such that an $\ell_p$ norm on rows can be studied through an associated $\ell_2$ geometry. Bourgain, Lindenstrauss, and Milman ([1989](https://doi.org/10.1007/BF02392835), *Approximation of zonoids by zonotopes*) and Talagrand ([1995](https://archive.org/details/isbn_9783764352073_77), *Embedding subspaces of $L_p$ in $\ell_p^N$*) developed and used this framework in convex geometry and functional analysis.

On the algorithmic side, Cohen and Peng made Lewis weights into a practical row-sampling tool in [*$\ell_p$ Row Sampling by Lewis Weights*](https://arxiv.org/abs/1412.0588) ([PDF](https://arxiv.org/pdf/1412.0588)). Their problem: given $A \in \mathbb{R}^{n \times d}$ with $n \gg d$, build a sparse matrix $A'$ from rescaled rows of $A$ such that

$$
\|Ax\|_p \approx_{1+\varepsilon} \|A'x\|_p,
\qquad \forall\, x \in \mathbb{R}^d.
$$

The sampling probabilities come from the **$\ell_p$ Lewis weights**, defined as follows.

> **Definition ($\ell_p$ Lewis weights).**
>
> Given $A \in \mathbb{R}^{n \times d}$, the Lewis weights $w_1, \ldots, w_n \ge 0$ are the unique weights such that, for $W = \operatorname{diag}(w_1, \ldots, w_n)$ and every row $i$,
>
> $$
> w_i = \tau_i\!\left(W^{\,\frac12 - \frac1p} A\right).
> $$

When $p = 2$, this reduces to ordinary leverage scores (up to the normalization built into $W$). For general $p$, the matrix $W^{\frac12 - \frac1p} A$ is a **$p$-dependent reweighting** of rows before applying the whitening map $(\cdot)^\top A^\top W' A (\cdot)$ in disguise. One can also characterize Lewis weights variationally: they arise from maximizing $\det(M)$ subject to $\sum_i (a_i^\top M a_i)^{p/2} \le d$, $M \succeq 0$ (see [Lee's Lewis weights notes](https://homes.cs.washington.edu/~jrl/teaching/cse599au23/notes/lewisweights.html)).

Cohen and Peng show that sampling $\tilde{O}(\varepsilon^{-2} d \log d)$ rows with probabilities proportional to Lewis weights yields a $(1 \pm \varepsilon)$-approximate $\ell_p$ subspace embedding. That is the backbone for many fast regression and optimization algorithms.

---

## 4. Why This Matters for Sparsification

Returning to the program of [Chapter 1](/posts/sparsification-sums-of-norms-chapter-1/): sparsifying a sum of norms requires (i) choosing importances for each term, (ii) sampling by those importances, and (iii) controlling the resulting random process. Lewis weights supply the importance scores in the $\ell_p$ setting. The whitening viewpoint explains *why* they are natural: they equalize contributions after passing to a geometry where $\ell_2$ tools (leverage scores, effective resistances, chaining) apply.

I find it helpful to keep both pictures in mind:

| Object | Whitening / geometry | Role in sampling |
|--------|----------------------|------------------|
| $\Sigma^{-1/2}$ | decorrelate and scale data | standardize variance across coordinates |
| $(A^\top A)^{-1/2}$ | whiten row directions in $\mathbb{R}^d$ | define leverage scores |
| Lewis weights $w_i$ | $p$-adapted change of density | $\ell_p$ row-sampling probabilities |

The next chapters will follow [Lee's course](https://homes.cs.washington.edu/~jrl/teaching/cse599au23) more closely: importance sampling, symmetrization, and generic chaining for sums of general norms.

---

## References

### Main sources for this chapter

- James R. Lee et al., [*Sparsifying Sums of Norms*](https://homes.cs.washington.edu/~jrl/papers/pdf/norm-sparsify.pdf)
- James R. Lee, [*CSE 599: Sparsification, sampling, and optimization*](https://homes.cs.washington.edu/~jrl/teaching/cse599au23) (Autumn 2023; see also [Lewis weights notes](https://homes.cs.washington.edu/~jrl/teaching/cse599au23/notes/lewisweights.html))
- Michael B. Cohen and Richard Peng, [*$\ell_p$ Row Sampling by Lewis Weights*](https://arxiv.org/abs/1412.0588) ([PDF](https://arxiv.org/pdf/1412.0588))

### Whitening and leverage-score intuition

- Andy Jones, [*Statistical whitening transformations*](https://andrewcharlesjones.github.io/journal/whitening.html)
- Dustin Stansbury, [*The Statistical Whitening Transform*](https://theclevermachine.wordpress.com/2013/03/30/the-statistical-whitening-transform/) (The Clever Machine, 2013)
- Kessy, Lewin, and Strimmer, *Optimal whitening and decorrelation*, *The American Statistician* **72** (2018), 309–314 — cited in Jones's post for ZCA versus PCA whitening

### Classical Lewis-weight literature

- D. R. Lewis, [*Finite dimensional subspaces of $L_p$*](https://eudml.org/doc/218208), *Studia Mathematica* **63** (1978), 207–212 — change of density
- J. Bourgain, J. Lindenstrauss, and V. D. Milman, [*Approximation of zonoids by zonotopes*](https://doi.org/10.1007/BF02392835), *Acta Mathematica* **162** (1989), 73–141
- M. Talagrand, *Embedding subspaces of $L_p$ in $\ell_p^N$*, in *Geometric Aspects of Functional Analysis* (Israel Seminar 1992–94), Oper. Theory Adv. Appl. **77**, Birkhäuser, 1995, pp. 311–326 ([volume](https://archive.org/details/isbn_9783764352073_77))

### Previous chapter in this series

- [Chapter 1: A General Overview](/posts/sparsification-sums-of-norms-chapter-1/)
