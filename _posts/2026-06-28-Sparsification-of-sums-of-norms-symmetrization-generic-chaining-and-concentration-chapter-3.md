---
title: "Sparsification of Sums of Norms: Symmetrization, Generic Chaining, and Concentration — Chapter 3"
date: 2026-06-28
permalink: /posts/sparsification-sums-of-norms-symmetrization-generic-chaining-chapter-3/
redirect_from:
  - /Sparsification-of-sums-of-norms-symmetrization-generic-chaining-and-concentration-Chapter-3/
---

# Sparsification of Sums of Norms
## Symmetrization, Generic Chaining, and Concentration · Chapter 3

How to compute the things?

So in this post I am going to recite some of the results of the paper in some generality. As I was going through it, there are still some concepts I have difficulty grasping — like the clustering in generic chaining, or the concentration of measure, and the convex body inequalities that are existing within the paper. More specifically, I think I should study Milman's paper for a more fundamental understanding; and besides their own paper, I wonder how best to study and deepen my understanding further.

Well, let's go through the inner dynamics of the paper, to learn something out of it. We must be aware that some classes of norms are studied because they can guarantee some nice analytic results, and in a way they give us control over the problem of sparsification — otherwise we would be hopeless.

In the paper, lots of concentration results and convex body inequalities are used. Most importantly, I would say that this paper is a nice application of the concentration of measure phenomena. Everything else is built around it. I will use one early theorem in Talagrand's book *Probability in Banach Spaces* to showcase the first principles concerning some inequalities used. The base observation is that, in really high dimensions, behavior is in a sense deterministically random — the law of large numbers is one such example.

Ok, let's go through the paper:

The base observation is that we want to sparsify the norms based on importance sampling (which is a general scheme in solving several sparsification problems; for example you can study the paper *Streaming Facility Location in High Dimension via Geometric Hashing* to see another nice application of this scheme).

More formally:

Consider a probability distribution $\rho = (\rho_1, \ldots, \rho_m) \in (0,1]^m$ on $\{1,\ldots,m\}$, and sample $M$ indices $i_1,\ldots,i_M$ independently from $\rho$. Define

$$
\widetilde{N}(x) := \frac{1}{M}\left(
\frac{N_{i_1}(x)}{\rho_{i_1}} + \cdots + \frac{N_{i_M}(x)}{\rho_{i_M}}
\right).
$$

We have

$$
\mathbb{E}\left[\frac{N_{i_1}(x)}{\rho_{i_1}}\right] = N(x),
$$

and therefore

$$
\mathbb{E}[\widetilde{N}(x)] = N(x)
$$

for any fixed $x$.

So the whole paper is now about concentration, and controlling the behavior of probabilities in some way.

The authors use a nice application of symmetrization (which is heavily used in Talagrand's book) to show that, basically, the sparsification of norms can be reduced to a stochastic process of Bernoulli variables, which is sub-Gaussian with respect to the norm — hence you can use several theorems of generic chaining to provide some sort of concentration results.

We want to control the following:

$$
\mathbb{E}\Bigg[\max_{x \in B_N}
\Big( \widetilde{N}(x) - \mathbb{E}[\widetilde{N}(x)] \Big)\Bigg].
$$

More formally, consider this. Fix a metric space $(T,d)$. A random process $\{V_x : x \in T\}$ is said to be *subgaussian with respect to $d$* if there exists a constant $\alpha > 0$ such that for all $x,y \in T$ and all $t > 0$,

$$
\mathbb{P}\big(|V_x - V_y| > t\big)
\leq \exp\!\left(-\frac{t^2}{\alpha^2 d(x,y)^2}\right).
$$

We say that $\{V_x : x \in T\}$ is *centered* if

$$
\mathbb{E}[V_x] = 0 \quad \text{for all } x \in T.
$$

Given a metric space $(T,d)$, define the ball

$$
B(x,r) := \{y \in T : d(x,y) \le r\}.
$$

For a subset $\Omega \subseteq \mathbb{R}^n$, we use the notation

$$
\|F\|_{C(\Omega)} := \sup_{x \in \Omega} |F(x)|.
$$

The authors really consider the following set, which is ok because everything else works up to scaling:

$$
\Omega = \{x \in \mathbb{R}^n : F(x) \le 1\}.
$$

So how does symmetrization work?

Note that

$$
\mathbb{E}[\widetilde{F}_{\rho,\nu}(x)] = F(x) \quad \text{for every } x \in \mathbb{R}^n.
$$

Thus, for any convex function $\psi : \mathbb{R}_+ \to \mathbb{R}_+$,

$$
\mathbb{E}_{\nu}\,\psi\!\left(\max_{x \in \Omega} \big(F(x) - \widetilde{F}_{\rho,\nu}(x)\big)\right)
\le
\mathbb{E}_{\nu,\tilde{\nu}}\,
\psi\!\left(\max_{x \in \Omega} \big(\widetilde{F}_{\rho,\nu}(x) - \widetilde{F}_{\rho,\tilde{\nu}}(x)\big)\right),
\tag{2.13}
$$

where $\tilde{\nu}$ is an independent copy of $\nu$.

The argument inside $\psi$ on the right-hand side can be written as

$$
\max_{x \in \Omega}
\frac{1}{M} \sum_{j=1}^M
\left(
\frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
-
\frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}
\right).
$$

Since the distribution of

$$
\frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
-
\frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}
$$

is symmetric, we have

$$
\sum_{j=1}^M \frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
-
\sum_{j=1}^M \frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}
\;\overset{\text{law}}{=}\;
\sum_{j=1}^M \varepsilon_j \left(
\frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
-
\frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}
\right)
$$

for any choice of signs $\varepsilon_1,\ldots,\varepsilon_M \in \{-1,1\}$.

This yields the stochastic domination

$$
\max_{x \in \Omega}
\frac{1}{M} \sum_{j=1}^M \frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
-
\frac{1}{M} \sum_{j=1}^M \frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}
\;\preceq\;
\max_{x \in \Omega}
\frac{1}{M} \sum_{j=1}^M \varepsilon_j \frac{\varphi_{\nu_j}(x)}{\rho_{\nu_j}}
+
\max_{x \in \Omega}
\frac{1}{M} \sum_{j=1}^M \varepsilon_j \frac{\varphi_{\tilde{\nu}_j}(x)}{\rho_{\tilde{\nu}_j}}.
$$

So, basically, we can now study the sub-Gaussian stochastic process as we try to randomly sparsify the norms and then find some sort of result to bound the concentration.

And they go on to prove the following lemma:

---

## Lemma 2.6

Let $M \ge 1$, let $\Omega \subseteq \mathbb{R}^n$, and let $\rho \in \mathbb{R}_+^m$ be a probability vector. Assume that

$$
\exists x_0 \in \Omega \ \text{s.t.} \ \varphi_1(x_0) = \cdots = \varphi_m(x_0) = 0.
\tag{2.8}
$$

Suppose further that for some $0 < \delta \le 1$, and every $\nu \in [m]^M$, it holds that

$$
\gamma_2(\Omega, d_{\rho,\nu})
\le \delta \, \|\widetilde{F}_{\rho,\nu}\|_{C(\Omega)}^{1/2}
\, \|F\|_{C(\Omega)}^{1/2}.
\tag{2.9}
$$

If $\nu_1,\ldots,\nu_M$ are sampled independently from $\rho$, then

$$
\mathbb{E}\max_{x \in \Omega}
\big(F(x) - \widetilde{F}_{\rho,\nu}(x)\big)
\;\lesssim\;
\mathbb{E}\,\gamma_2(\Omega, d_{\rho,\nu})
\;\le\;
8\delta \|F\|_{C(\Omega)}.
\tag{2.10}
$$

If it also holds that, for all $\nu \in [m]^M$,

$$
\mathrm{diam}(\Omega, d_{\rho,\nu})
\le \hat{\delta}\,
\|\widetilde{F}_{\rho,\nu}\|_{C(\Omega)}^{1/2}
\, \|F\|_{C(\Omega)}^{1/2},
\tag{2.11}
$$

then there exists a universal constant $K>0$ such that for all
$0 \le t \le \frac{1}{2K\hat{\delta}}$,

$$
\mathbb{P}\left(
\max_{x \in \Omega}
\big(F(x) - \widetilde{F}_{\rho,\nu}(x)\big)
>
K(\delta + t\hat{\delta})\|F\|_{C(\Omega)}
\right)
\le
e^{-Kt^2/4}.
\tag{2.12}
$$

---

Let me first examine a nice application of the concentration of measure, which roughly suggests that a function behaves like a constant on almost all of the space.

---

## Theorem 1.1

If $A$ is a Borel set in $S^{N-1}$ and $H$ is a cap (i.e. a ball for the geodesic distance $p$) with the same measure

$$
U^{N-1}(H) = U^{N-1}(A),
$$

then for any $r > 0$,

$$
U^{N-1}(A_r) \;\gtrsim\; U^{N-1}(H_r),
$$

where we recall that

$$
A_r = \{x \in S^{N-1} : p(x,A) < r\}
$$

is the $r$-neighborhood of $A$ for the geodesic distance.

In particular, if $U^{N-1}(A) \simeq \tfrac{1}{2}$ (and $N \ge 3$), then one obtains a sharp quantitative estimate on the size of spherical caps.

The main interest of such an isoperimetric theorem is, of course, the possibility of estimating (or even explicitly computing) the measure of a cap (since the neighborhood of a cap is again a cap). A particularly important estimate is given in the second assertion of the theorem.
