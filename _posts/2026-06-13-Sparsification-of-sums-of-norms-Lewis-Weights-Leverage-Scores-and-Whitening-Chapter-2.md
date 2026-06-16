---
title: "Lewis Weights, Leverage Scores, and Whitening — Chapter 2"
date: 2026-06-13
permalink: /posts/lewis-weights-leverage-scores-whitening-chapter-2/
redirect_from:
  - /Lewis-Weights-Leverage-Scores-and-Whitening-Chapter-2/
---

# Sparsification of Sums of Norms
## Lewis Weights, Leverage Scores, and Whitening · Chapter 2

This is the second chapter in my series on [Sparsifying Sums of Norms](https://homes.cs.washington.edu/~jrl/papers/pdf/norm-sparsify.pdf). [Chapter 1](/posts/sparsification-sums-of-norms-chapter-1/) set up the general problem and briefly mentioned Lewis weights. In the second post of this series on sparsification of the norm, I want to turn to the $\ell_p$ row sampling paper. I'll be spending a few posts on this one, because I think it is genuinely revealing on the subject  it is worth pondering carefully and going through in some detail. The paper relies heavily on the works of Milman and Talagrand(for example), so I may cover those seminal papers too at some point. At a high level, this paper is a vast generalization of the Johnson–Lindenstrauss lemma, with a few extremely technical steps, but the overall theme is clear and elegant. I especially like how they used Talagrand's result and intuition, and the way they brought in Lewis weights to pull everything together.


---

## What Is This Paper About?

Randomized sampling is a very powerful tool in the literature. There are many instances where the number of rows vastly exceeds the dimension of interest. The most obvious and easy such problem is **Least Squares**: if $d \gg n$, we can sample enough rows and keep going with our life while finding a good minimizer that approximates the original one. So how do we approach this algorithmically?

For the case where the norm is $p = 2$, we have the concept of **leverage scores**, which assign a score to each row based on its importance. We then sample each row a proportional number of times to get an unbiased estimator. The key step is then proving some sort of concentration inequality  just like Johnson–Lindenstrauss  and showing that with high probability we get a good approximation, to get that we actually need to have all the basises and directions to have a uniform impact on the question at hand, and in this setting a statistical white transform is utilized.

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

## What Is a Leverage Score?

A leverage score is a kind of **Statistical Whitening Transform**.

In many modeling applications, data are transformed to have an identity covariance matrix, a process known as *statistical whitening*. After whitening, the features are uncorrelated and each dimension has unit variance.

Given a data matrix $X \in \mathbb{R}^{n \times p}$ with covariance matrix

$$\Sigma = \frac{1}{n} X^\top X,$$

a whitening transformation seeks a matrix $W$ such that the transformed data has identity covariance:

$$W^\top \Sigma W = I_p.$$

Consequently, the whitening matrix satisfies $WW^\top = \Sigma^{-1}$. After whitening, the variables are uncorrelated and each dimension has unit variance.

By making the data uncorrelated and viewing it in this special way  which is the key intuition here  we can change the density of rows and then sparsify the matrix.

The **statistical leverage score** of the $i$th row $a_i$ is defined as

$$\tau_i(A) \stackrel{\text{def}}{=} a_i^\top (A^\top A)^{-1} a_i = \left\|(A^\top A)^{-1/2} a_i \right\|_2^2.$$

Equivalently, it is the squared Euclidean norm of the $i$th row after applying the statistical whitening transform.

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

## Setup and Goal

The $\ell_p$-norm of a vector $x \in \mathbb{R}^d$ is defined as

$$\|x\|_p = \left(\sum_{i=1}^{d} |x_i|^p\right)^{1/p}.$$

For a matrix $A \in \mathbb{R}^{n \times d}$, let $a_i$ denote its $i$th row (viewed as a column vector). Then,

$$\|Ax\|_p = \left(\sum_{i=1}^{n} |a_i^{\top}x|^p\right)^{1/p}.$$

Throughout, we assume that $A$ has full column rank; otherwise, one may restrict to its column space or use the Moore–Penrose pseudoinverse.

For an $n \times d$ matrix $A$ with $n \gg d$ and $\varepsilon > 0$, the goal is to select a small set of (rescaled) rows to form $A'$ such that

$$\|Ax\|_p \approx_{1+\varepsilon} \|A'x\|_p$$

for all $x \in \mathbb{R}^d$, where $\approx_{1+\varepsilon}$ denotes multiplicative error within a factor of $1 + \varepsilon$.

The main theorem we want to prove is the following  but we consider the case $p = 1$ first.

> **Theorem.** Given a matrix $A$ and $\varepsilon > 0$, there exists a distribution over sampling matrices $S$ with $O(d \log d \cdot \varepsilon^{-2})$ rows and one nonzero entry per row such that, with high probability,
>
> $$\|SAx\|_1 \approx_{1+\varepsilon} \|Ax\|_1$$
>
> for all $x \in \mathbb{R}^d$. Moreover, a sample from this distribution can be generated using $O(\log \log n)$ calls to a procedure that computes $2$-approximate statistical leverage scores of matrices of the form $WA$, where $W$ is a nonneg diagonal matrix.

---

## The Key Intuitions from Talagrand

From the literature especially Talagrand's papers  we get two central intuitions:

1. **Matrix concentration bound:** uniform sampling works (for all $p$) when all leverage scores are close, i.e., $O(d/n)$.

2. **$\ell_p$ whitening transformation:** split $a_i$ into $w_i$ (fractional) "copies" with the same leverage scores.

The $\ell_p$ spaces are significantly more complex than $\ell_2$ and lack many of its useful properties. The Lewis weight framework can be viewed as a way to recover some of the structure of $\ell_2$ by associating to any matrix $A$ a matrix $B$ such that $\|Ax\|_p$ is closely related to $\|Bx\|_2$.

---

## From $\ell_p$ to $\ell_2$: Lewis Weights

**How should we relate the norms to the well-studied $\ell_2$ case?**

A naive approach is to set $B = A$. However, this fails because $\|Bx\|_2$ is not invariant under changes of density. For example, splitting a row $a_i$ of $A$ into $k$ copies of $k^{-1/p} a_i$ leaves $\|Ax\|_p$ unchanged, but $\|Ax\|_2$ can change arbitrarily depending on how the splitting is done.

To address this, we modify the notion of density. We view each row $a_i$ as representing $w_i$ copies of $w_i^{-1/p} a_i$, where $w_i$ need not be an integer but acts as a weight in a weighted $\ell_p$ norm. Under an $\ell_2$ transformation, this corresponds to a single row $w_i^{1/2 - 1/p} a_i$. Hence, defining $W = \mathrm{diag}(w_i)$, we set

$$B = W^{1/2 - 1/p} A.$$

---

## Defining Lewis Weights

Intuitively, we want the split rows $w_i^{-1/p} a_i$ to be normalized in a consistent way. Lewis's change of density formalizes this: each normalized row should have leverage score $1$ which makes the matrix isotropic under the geometry induced by the weighted covariance.

This is a circular definition $w_i$ depends on the leverage scores of $B$, while $B$ itself depends on $w_i$  but it turns out to have a unique solution. The Gram matrix of $B$ is $A^\top W^{1 - 2/p} A$.

> **Definition (Lewis Weights).** For a matrix $A$ and $p \ge 1$, the $\ell_p$ Lewis weights $w$ are the unique vector satisfying, for each $i$,
>
> $$w_i = \tau_i\!\left(W^{1/2 - 1/p}A\right).$$
>
> Equivalently,
>
> $$a_i^\top \left(A^\top W^{1 - 2/p} A\right)^{-1} a_i = w_i^{2/p}.$$

For $p = 1$, the Lewis quadratic form is $A^\top W^{-1} A$, and the defining condition becomes $w_i^2 = a_i^\top (A^\top W^{-1} A)^{-1} a_i$, which says the leverage score of each weighted row $w_i a_i$ is exactly $1$. We are setting all leverage scores to $1$ precisely because we want a uniform matrix  and to do that we use the change-of-density trick where a row is broken into several fractional copies, we must note that what i'm explaining here is extremely simplified, namely we should be exploring what things are meant here in detailed mannar.

---

## The $\ell_1$ Matrix Concentration Bound

Once we have the Lewis weights in hand, the sampling result follows:

> **Theorem ($\ell_1$ matrix concentration bound).** There exists an absolute constant $C_s$ such that the following holds. Let $A$ be a matrix with $\ell_1$ Lewis weights $w_i$, and let $p_i$ be sampling values satisfying $\sum_i p_i = N$ and
>
> $$p_i \ge C_s\, w_i \log N \cdot \varepsilon^{-2}.$$
>
> Construct a sampling matrix $S \in \mathbb{R}^{N \times n}$ by independently choosing each row to be the $i$th standard basis vector $e_i$ scaled by $1/p_i$ with probability $p_i/N$.
>
> Then, with high probability,
>
> $$\|SAx\|_1 \approx_{1+\varepsilon} \|Ax\|_1 \quad \text{for all } x \in \mathbb{R}^d.$$
>
> In particular, using constant-factor approximations to the Lewis weights, $O(d \log(d/\varepsilon) \cdot \varepsilon^{-2})$ row samples suffice.

The big remaining questions  how we should set the Lewis weights so that all leverage scores become uniform, and how to compute them efficiently  will be the subject of the next post.

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
