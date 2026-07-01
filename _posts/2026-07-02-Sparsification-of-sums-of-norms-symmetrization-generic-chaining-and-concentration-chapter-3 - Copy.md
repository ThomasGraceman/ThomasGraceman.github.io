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

let me first examine a nice application of the concentration of measure, which roughly suggests that a function behaves like a constant on almost all of the space.

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

---

**The Isoperimetric Problem.**
Given $a \in (0,1)$ and $\varepsilon > 0$, the isoperimetric problem asks to determine the Borel subsets $A \subseteq X$ satisfying

$$
\mu(A)=a,
$$

for which the measure of the $\varepsilon$-neighborhood

$$
A_\varepsilon
=
\{x\in X:\, d(x,A)<\varepsilon\},
$$

is as small as possible, where

$$
d(x,A):=\inf_{y\in A} d(x,y).
$$

Equivalently, one seeks to solve

$$
\min\left\{
\mu(A_\varepsilon):
A\subseteq X \text{ is Borel and }
\mu(A)=a
\right\}.
$$

So the theorem that is mentioned in the start of the book of the Talagrand's mentions a rather nice theorem about the set that has the lowest expansion, among other sets. But what is the significance of studying the isoperimetric problem in the $S^{n-1}$? it is useful because by using Poincaré limit, or rather by a nice application of the law of large numbers, we can relate studying the inequalities in the Sphere down to the $\mathbb{R}^d$ using projection, and excessive larger Dimension of the sphere.

what I mean by that is if we consider:

For every $N$, let $U^{N-1}$ denote the normalized uniform probability measure on the sphere

$$
\sqrt{N}\,S^{N-1}
=
\left\{x\in\mathbb{R}^N:\|x\|_2=\sqrt{N}\right\}.
$$

Let $\Pi_{N,d}$, with $N\ge d$, denote the canonical projection from $\sqrt{N}\,S^{N-1}$ onto $\mathbb{R}^d$, namely,

$$
\Pi_{N,d}(x_1,\ldots,x_N)
=
(x_1,\ldots,x_d).
$$

Then the sequence of probability measures

$$
\left\{\Pi_{N,d}\left(U^{N-1}\right)\right\}_{N\ge d}
$$

on $\mathbb{R}^d$ converges weakly, as $N\to\infty$, to the canonical Gaussian measure on $\mathbb{R}^d$.

Let

$$
G=(G_1,\ldots,G_N),
$$

where $G_1,\ldots,G_N$ are independent and identically distributed random variables with

$$
G_i\sim\mathcal{N}(0,1).
$$

Define

$$
X:=\sqrt{N}\,\frac{G}{\|G\|}.
$$

Then $X$ is uniformly distributed on the sphere $\sqrt{N}\,S^{N-1}$.

Now write

$$
X_i
=
\frac{\sqrt{N}}{\|G\|}G_i
=
\frac{G_i}
{\sqrt{\frac{1}{N}\sum_{j=1}^{N}G_j^2}}.
$$

By the Law of Large Numbers,

$$
\frac{1}{N}\sum_{j=1}^{N}G_j^2
\xrightarrow{\mathbb{P}}
\mathbb{E}[G_1^2]
=
1.
$$

Hence,

$$
\sqrt{\frac{1}{N}\sum_{j=1}^{N}G_j^2}
\xrightarrow{\mathbb{P}}
1.
$$

Since $G_i$ is asymptotically independent of the denominator (or, equivalently, by Slutsky's theorem),

$$
X_i
=
\frac{G_i}
{\sqrt{\frac{1}{N}\sum_{j=1}^{N}G_j^2}}
\xrightarrow{d}
\mathcal{N}(0,1).
$$

where $I_d$ denotes the $d\times d$ identity matrix.
furthermore The concentration of measure phenomenon is thus usually derived from an isoperimetric inequalities. to illustrate we use an example from Assaf Naor lecture notes about concentration of the measure.

---

## Lemma

Let $(X,d)$ be a metric space equipped with a Borel probability measure $\mu$. Let $f:X\to\mathbb{R}$ be an $L$-Lipschitz function. Then there exists $M\in\mathbb{R}$ such that, for every $\varepsilon>0$,

$$
\mu\bigl(\{x\in X:|f(x)-M|\ge\varepsilon\}\bigr)
\le
2\left(1-\phi_{1/2}\!\left(\frac{\varepsilon}{L}\right)\right).
$$

*Proof.*
Let $M$ be a median of $f$, namely,

$$
M=\inf\left\{t\in\mathbb{R}:
\mu\bigl(\{x\in X:f(x)\le t\}\bigr)\ge\frac12
\right\}.
$$

Set

$$
A=\{x\in X:f(x)>M\}.
$$

If $x\in A_{\varepsilon/L}$, then there exists $y\in A$ such that

$$
d(x,y)<\frac{\varepsilon}{L}.
$$

Since $f$ is $L$-Lipschitz,

$$
|f(x)-f(y)|
\le
Ld(x,y)
<
\varepsilon.
$$

As $y\in A$, we have $f(y)>M$, and therefore

$$
f(x)>M-\varepsilon.
$$

Hence

$$
\{x\in X:f(x)\le M-\varepsilon\}
\subseteq
X\setminus A_{\varepsilon/L}.
$$

Since $\mu(A)\ge\frac12$, the definition of the isoperimetric profile $\phi_{1/2}$ yields

$$
\mu\bigl(\{x\in X:f(x)\le M-\varepsilon\}\bigr)
\le
1-\phi_{1/2}\!\left(\frac{\varepsilon}{L}\right).
$$

Similarly, let

$$
B=\{x\in X:f(x)\le M\}.
$$

Then $\mu(B)\ge\frac12$, and the same argument gives

$$
\mu\bigl(\{x\in X:f(x)\ge M+\varepsilon\}\bigr)
\le
1-\phi_{1/2}\!\left(\frac{\varepsilon}{L}\right).
$$

Finally,

$$
\{|f-M|\ge\varepsilon\}
=
\{f\le M-\varepsilon\}
\cup
\{f\ge M+\varepsilon\},
$$

where the two sets are disjoint. Therefore,

$$
\mu\bigl(\{x\in X:|f(x)-M|\ge\varepsilon\}\bigr)
\le
2\left(
1-\phi_{1/2}\!\left(\frac{\varepsilon}{L}\right)
\right),
$$

which completes the proof. $\square$

---

so lets get back to an application of the first theorem, on how to make sense of these things.

Denote by $\gamma_N$ the canonical Gaussian probability measure on $\mathbb{R}^N$, Denote further by $\Phi$ the distribution function of $\gamma_1$, i.e.,

$$
\Phi(t)
=
\frac{1}{\sqrt{2\pi}}
\int_{-\infty}^{t}
e^{-x^{2}/2}\,dx,
\qquad
t\in(-\infty,+\infty).
$$

---

## Theorem 1.2

If $A$ is a Borel set in $\mathbb{R}^N$ and if

$$
H=\{x\in\mathbb{R}^N:\langle x,u\rangle<\lambda\},
$$

is a half-space, where $u\in\mathbb{R}^N$, $\|u\|=1$, and $\lambda\in(-\infty,+\infty)$, with the same Gaussian measure

$$
\gamma_N(H)=\gamma_N(A),
$$

then, for every $r>0$,

$$
\gamma_N(A_r)\geq\gamma_N(H_r),
$$

where

$$
A_r=\{x\in\mathbb{R}^N:d(x,A)<r\}
$$

is the Euclidean neighborhood of order $r$ of $A$.

Equivalently,

$$
\Phi^{-1}\!\bigl(\gamma_N(A_r)\bigr)
\geq
\Phi^{-1}\!\bigl(\gamma_N(A)\bigr)+r.
$$

In particular, if

$$
\gamma_N(A)\geq\frac12,
$$

then

$$
1-\gamma_N(A_r)
\leq
\Psi(r)
\leq
\frac12\exp\!\left(-\frac{r^2}{2}\right),
$$

where

$$
\Psi(r)=1-\Phi(r)
=\frac{1}{\sqrt{2\pi}}
\int_r^\infty e^{-t^2/2}\,dt
$$

is the Gaussian tail function.

---

so a half space has the least enlargement over the other sets with equal measure, we can suppose that enlargement works in a single dimension, because everything is rotationally invariant. So we can suppose that the half plane is orthogonal to an axis.

Now,

$$
H_r = \{x : \langle x, u \rangle < \lambda + r\}.
$$

Therefore,

$$
\gamma_N(H_r) = \Phi(\lambda + r).
$$

Since

$$
\lambda = \Phi^{-1}(\gamma_N(H)),
$$

we obtain

$$
\gamma_N(H_r) = \Phi\big(\Phi^{-1}(\gamma_N(H)) + r\big).
$$

Since

$$
\gamma_N(H) = \gamma_N(A),
$$

this becomes

$$
\gamma_N(H_r) = \Phi\big(\Phi^{-1}(\gamma_N(A)) + r\big).
$$

Now combine this with

$$
\gamma_N(A_r) \ge \gamma_N(H_r).
$$

Since $\Phi^{-1}$ is increasing, we obtain

$$
\Phi^{-1}\big(\gamma_N(A_r)\big)
\ge
\Phi^{-1}\big(\gamma_N(A)\big) + r.
$$

define

$$
a = \Phi^{-1}(\gamma_N(A)).
$$

Since

$$
\Phi^{-1}(0) = -\infty,
$$

they may assume that $a > -\infty$.

As we have shown, Poincaré's argument says that as $k \to \infty$, the first coordinates become approximately standard Gaussian:

$$
\Pi_{k,N}(X) \Rightarrow \gamma_N.
$$

Because $b < a$, as $k \to \infty$,

$$
\sigma_{k-1}^{k}\big(\Pi_{k,N}^{-1}(A)\big) \to \gamma_N(A),
$$

while

$$
\sigma_{k-1}^{k}\big(\Pi_{k,1}^{-1}((-\infty, b])\big) \to \Phi(b).
$$

Hence for $k$ large enough,

$$
\sigma_{k-1}^{k}\big(\Pi_{k,N}^{-1}(A)\big)
>
\sigma_{k-1}^{k}\big(\Pi_{k,1}^{-1}((-\infty, b])\big).
$$

It is easy to see that

$$
\Pi_{k,N}^{-1}(A_r) \sim \big(\Pi_{k,N}^{-1}(A)\big)_r,
$$

where the neighborhood of order $r$ on the right is understood with respect to the geodesic distance on $\sqrt{k}\,S^{k-1}$.

Since $\Pi_{k,1}^{-1}((-\infty,b])$ is a cap on $\sqrt{k}\,S^{k-1}$, by the isoperimetric inequality on spheres, we obtain

$$
\sigma_{k}^{k-1}\big(\Pi_{k,N}^{-1}(A_r)\big)
\;\ge\;
\sigma_{k}^{k-1}\big((\Pi_{k,N}^{-1}(A))_r\big)
\;\ge\;
\sigma_{k}^{k-1}\big((\Pi_{k,1}^{-1}((-\infty,b]))_r\big).
$$

Now,

$$
(\Pi_{k,1}^{-1}((-\infty,b]))_r = \Pi_{k,1}^{-1}((-\infty, b + r(k)])
$$

for some $r(k) \ge 0$ satisfying

$$
\lim_{k \to \infty} r(k) = r.
$$

Therefore, in the Poincaré limit, we get

$$
\gamma_N(A_r) \sim \Phi(b + r),
$$

and hence the result since

$$
b < \Phi^{-1}(\gamma_N(A))
$$

is arbitrary.

so really it is a variant of limiting argument and an application of law of large numbers, plus the geometry of sphere. So use the rotational invariance of Gaussian product measures, and basically go to the sphere to prove the inequality for large enough K, as you get the same measure for really high dimension, so it pinpoints that you may use a limiting argument.

so lets back to Lee's paper.

