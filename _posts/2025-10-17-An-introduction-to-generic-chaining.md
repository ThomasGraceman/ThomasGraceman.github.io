# Stochastic Processes and Generic Chaining

So, let us talk a little bit about stochastic processes and generic chaining, which I got introduced to after reading a paper written by James Lee.

A collection of random variables $(X_t)$, where $t$ belongs to a certain index set $T$, is called a stochastic process, and now suppose that we want to study the upper and lower bounds for the quantity

$$\mathbb{E}\left[\sup_{t \in T} X_t\right].$$

Then what should we do? And how can we tackle this problem?

In this blog post we see how bounding the expectation of a stochastic process relates to the underlying metric structure, namely it depends on the geometry of the underlying set.

## Sub-Gaussian Processes: Motivation and Basic Inequalities

First let us study a bit about certain inequalities and the weak law of large numbers and the central limit theorem:

Consider the following inequality:

$$\forall\, u > 0, \quad \mathbb{P}\big(|X_s - X_t| \ge u\big) \le 2 \exp\left(-\frac{u^2}{2 d(s, t)^2}\right).$$

We will talk a little bit about the above inequality, which is true if our processes are sub-Gaussian. In general it seems like variance and gradient could be related concepts; variance is defined to measure the fluctuation of the distribution or the function, and gradient is used to compute how sensitive a function is to small changes.

Let us suppose that we have this function:

$$f(X_1, \ldots, X_n)$$

By the weak law of large numbers, we expect that the fluctuations are of order

$$f(X_1, \ldots, X_n) - \mathbb{E}[f(X_1, \ldots, X_n)] \sim \frac{\sigma}{\sqrt{n}}.$$

So based on this observation we can deduce something about fluctuations of the function $f$, namely because we can sort of guess the behaviour of the fluctuations, and approximate the size of these fluctuations. But what about the distribution of the said fluctuations? Here we can invoke the central limit theorem and further deduce that:

$$f(X_1, \ldots, X_n) - \mathbb{E}[f(X_1, \ldots, X_n)] \approx \mathcal{N}\left(0, \frac{\sigma^2}{n}\right)$$

Now as we can see, using the central limit theorem we have more control and much sharper information about the behaviour of fluctuations, and we can approximate it with a Gaussian! Now we can use the inequalities of the Gaussian processes to have certain types of control over tails, namely: we can make a wide guess and deduce that these inequalities exist:

$$\mathbb{P}\left( \left| f(X_1, \ldots, X_n) - \mathbb{E}[f(X_1, \ldots, X_n)] \right| \ge t \right) \le e^{-\frac{n t^2}{2\sigma^2}}$$

Note that what I am writing here is not a precise argument but rather a kind of motivation for why we should consider sub-Gaussian processes.

### The Chernoff Bound

**Lemma (Chernoff bound):** Let $X$ be a random variable. Define its log-moment generating function $\psi$ and the Legendre dual $\psi^*$ as

$$\psi(\lambda) := \log \mathbb{E}\left[e^{\lambda (X - \mathbb{E}X)}\right], \quad \psi^*(t) := \sup_{\lambda \ge 0} \{\lambda t - \psi(\lambda)\}.$$

Then, for all $t \ge 0$,

$$\mathbb{P}[X - \mathbb{E}X \ge t] \le e^{-\psi^*(t)}.$$

**Proof:** The proof is easy; we know that $e^{\lambda x}$ is increasing and using Markov's inequality it is obvious. □

Because the log-moment generating function is continuous, we can use tools from calculus, and that is what makes it interesting for us to use the Chernoff bound.

### Example: Gaussian Random Variables

Let $X \sim \mathcal{N}(\mu, \sigma^2)$. Then

$$\mathbb{E}[e^{\lambda(X - \mathbb{E}X)}] = e^{\lambda^2 \sigma^2 / 2},$$

so that

$$\psi(\lambda) = \frac{\lambda^2 \sigma^2}{2}, \quad \psi^*(t) = \frac{t^2}{2\sigma^2}.$$

In particular, the Chernoff bound gives

$$\mathbb{P}[X - \mathbb{E}X \ge t] \le e^{-t^2 / 2\sigma^2}.$$

Note that if the log-moment generating function was bounded above by $\frac{\lambda^2 \sigma^2}{2}$ we could deduce the above inequality too.


### Example: Bernoulli Processes

Suppose that $\varepsilon_1, \dots, \varepsilon_m$ are i.i.d. uniform $\pm 1$ random variables, and for $t \in T$, we define

$$X_t := \varepsilon_1 t_1 + \varepsilon_2 t_2 + \cdots + \varepsilon_m t_m.$$

Then the family $\{ X_t : t \in \mathbb{R}^n \}$ is a collection of subgaussian random variables with the same parameters: $c = 1/2$ and

$$d(s,t) = \left( \mathbb{E}|X_s - X_t|^2 \right)^{1/2}.$$


### Definition: Sub-Gaussian Random Variables

A random variable $X$ is called **$\sigma^2$-subgaussian** if its log-moment generating function

$$\psi(\lambda) := \log \mathbb{E}[e^{\lambda (X - \mathbb{E}X)}]$$

satisfies

$$\psi(\lambda) \le \frac{\lambda^2 \sigma^2}{2} \quad \text{for all } \lambda \in \mathbb{R}.$$

The constant $\sigma^2$ is called the **variance proxy** of $X$.

Note that by Hoeffding's lemma we can prove that every bounded random variable is sub-Gaussian, so it makes sense for us to consider sub-Gaussian processes and random variables because they have good tail inequalities and they cover a good part of random variables. Using this definition we can introduce a certain sense of well-behavedness. What I wanted to argue is that considering sub-Gaussian processes is meaningful, from computing fluctuations, down to Gaussian and Bernoulli processes and etc.

## The Framework: Metric Structure and Sub-Gaussian Processes

We will always assume that

$$\forall t \in T, \quad \mathbb{E}[X_t] = 0.$$

And also suppose that the underlying metric space is given by the metric:

$$d(s, t) = \left( \mathbb{E}[(X_s - X_t)^2] \right)^{1/2}$$

where $T$ is the index set. Then based on the above inequality we have the following:

$$\text{For } u > 0, \quad \mathbb{P}\bigl(|X_s - X_t| \ge u\bigr) \le 2 \exp\left(- \frac{u^2}{2 d(s, t)^2} \right).$$

Furthermore, we could a bit more abstractly suppose any metric space $(T,d)$ in which the above inequality holds too.

Now we want to compute

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right].$$

What could this value really mean? Intuitively, it represents an upper bound on the "largest" value the stochastic process $(X_t)_{t \in T}$ might take on average. By taking the expectation of the supremum, we are averaging over all possible realizations of the process, which makes it possible to analyze its typical behavior using probabilistic methods.

To examine this further, we observe that for any fixed $t_0 \in T$, we have

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] = \mathbb{E} \left[ \sup_{t \in T} (X_t - X_{t_0}) \right].$$

This equality is useful because centering the process at $X_{t_0}$ often simplifies computations, especially when using concentration inequalities or metric-based bounds, and it makes the random variables non-negative too.

By the standard identity for non-negative random variables, we have

$$\mathbb{E}[Y] = \int_0^{\infty} \mathbb{P}(Y > u) \, du.$$

Thus, to bound $\mathbb{E} \left[ \sup_{t \in T} (X_t - X_{t_0}) \right]$, it suffices to find bounds for

$$\mathbb{P} \left( \sup_{t \in T} (X_t - X_{t_0}) \ge u \right).$$

## The Chaining Idea: From Union Bound to Successive Approximation

The most obvious way to give a rough approximation would be to compute the union bound, of course:

$$\mathbb{P} \left( \sup_{t \in T} (X_t - X_{t_0}) \ge u \right) \le \sum_{t \in T} \mathbb{P}(X_t - X_{t_0} \ge u).$$

The problem with it is that if we have too many processes the series for example might diverge, or if they are too correlated with each other the estimate would be really off the chart. So what can we do now? **The solution would be to regroup highly correlated processes with each other and choose one process from each group to be computed in the union bound.** Hence we can control both the number of processes and the correlation of them. Now that's an interesting idea.

To handle the case where the points are nearly identical, we consider a subset $T_1 \subset T$, and for each $t \in T$, we select a point $\pi_1(t) \in T_1$, which we can think of as a first approximation of $t$. The elements of $T$ that correspond to the same point $\pi_1(t)$ are, at this level of approximation, considered identical.

We then decompose

$$X_t - X_{t_0} = (X_t - X_{\pi_1(t)}) + (X_{\pi_1(t)} - X_{t_0}).$$

For $n \ge 0$, we consider a subset $T_n \subset T$, and for each $t \in T$, we select a point $\pi_n(t) \in T_n$. (The idea is, of course, that the points $\pi_n(t)$ are successive approximations of $t$.) We assume that $T_0$ consists of a single element $t_0$, so that $\pi_0(t) = t_0$ for each $t \in T$.

The fundamental relation is

$$X_t - X_{t_0} = \sum_{n \ge 1} \left( X_{\pi_n(t)} - X_{\pi_{n-1}(t)} \right),$$

which holds provided we arrange that $\pi_n(t) = t$ for $n$ large enough, in which case the series is actually a finite sum. This relation decomposes the increments of the process $X_t - X_{t_0}$ along the "chain" $(\pi_n(t))_{n \ge 0}$.

Now, this is what we call the **successive approximation agenda**: by breaking down the process into smaller increments, we are essentially following a divide-and-conquer paradigm. Moreover, this perspective naturally leads us to consider the geometry of the underlying metric space. If we can provide good approximations for example, by covering the whole space with finer sets then the chaining approximation becomes correspondingly finer, allowing us to better control the supremum of the process, what i mean is that each subset $T_i$ represents a way of breaking down the wholw sum down to Controllable nice parts that might behave nicely, over all the possible such $T_i$'s. 

## Entropy Numbers and Covering

It will be convenient to control the set $T_n$ through its cardinality, with

$$\mathrm{card}\, T_n \le N_n,$$

where

$$N_0 = 1, \quad N_n = 2^{2^n} \quad \text{if } n \ge 1.$$

Let $(T,d)$ be a metric space. Define the quantity $e_h(T,d)$ as the smallest radius $r$ such that $(T,d)$ can be covered by at most $2^{2^h}$ balls of radius $r$, where a ball in $(T,d)$ is given by

$$B(t,r) := \{ s \in T : d(s,t) \le r \}.$$

It follows by a greedy construction that there exists a **net** $N_h \subseteq T$ such that
 $|N_h| \le 2^{2^h}$ and every point of T is within distance at most $e_h(T,d)$ of a point in $N_h$.

Since $\pi_n(t)$ approximates $t$, it is natural to assume that

$$d(t, \pi_n(t)) = d(t, T_n) := \inf_{s \in T_n} d(t, s).$$

What we denoted by $e_h(T,d)$ is the **entropy number**. We could think of it as the number of how many bits or covers are needed to convey enough information regarding the underlying space.

## The Union Bound with Chaining

And assuming that they are sub-Gaussian processes like we have argued before, we can use the inequality:

$$\mathbb{P}\left( \left| X_{\pi_n(t)} - X_{\pi_{n-1}(t)} \right| \ge \frac{u 2^n}{2} \, d(\pi_n(t), \pi_{n-1}(t)) \right) \le 2 \exp\left( - u^2 2^n \right).$$

The number of possible pairs $(\pi_n(t), \pi_{n-1}(t))$ is bounded by

$$\mathrm{card}\, T_n \cdot \mathrm{card}\, T_{n-1} \le N_n N_{n-1} \le N_{n+1} = 2^{2^{n+1}}.$$

Now we wanted to approximate using the union bound. Therefore:

Thus, if we denote by $\Omega_u$ the event

$$\forall n \ge 1, \ \forall t \in T, \quad \left| X_{\pi_n(t)} - X_{\pi_{n-1}(t)} \right| \le \frac{u 2^n}{2} \, d(\pi_n(t), \pi_{n-1}(t)),$$

we see that

$$\mathbb{P}(\Omega_u^c) \le p(u) := \sum_{n \ge 1} 2 \cdot 2^{2^{n+1}} \, \exp(-u^2 2^n).$$

When $\Omega_u$ occurs, from previous formulas we have that:

$$|X_t - X_{t_0}| \le u \sum_{n \ge 1} 2^{n/2} d(\pi_n(t), \pi_{n-1}(t)),$$

so that

$$\sup_{t \in T} |X_t - X_{t_0}| \le u S,$$

where

$$S := \sup_{t \in T} \sum_{n \ge 1} 2^{n/2} d(\pi_n(t), \pi_{n-1}(t)).$$

Thus, we have

$$\mathbb{P}\left( \sup_{t \in T} |X_t - X_{t_0}| > u S \right) \le p(u).$$

Writing

$$u^2 2^n \ge \frac{u^2}{2} + u^2 2^{n-1} \ge \frac{u^2}{2} + 2^{n+1} \quad \text{for } u \ge 2,$$

we see that for $u \ge 2$,

$$p(u) \le L \, \exp\left(-\frac{u^2}{2}\right),$$

for some constant $L$.

Therefore:

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] \le L S.$$

Using the triangle inequality, and if we expand the distances in $S$ we can get:

$$d(\pi_n(t), \pi_{n-1}(t)) \le d(t, \pi_n(t)) + d(t, \pi_{n-1}(t)) \le d(t, T_n) + d(t, T_{n-1}),$$

where $d(t, T_n) := \inf_{s \in T_n} d(t,s)$, because we want the approximation to be as fine as possible.

Thus,

$$S \le L \, \sup_{t \in T} \sum_{n \ge 0} 2^{n/2} d(t, T_n),$$

and we have proved that

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] \le L \, \sup_{t \in T} \sum_{n \ge 0} 2^{n/2} d(t, T_n)$$

where here $L$ is a different constant.

As I have mentioned, we are using a greedy approach to construct $T_n$'s. A problem that has arisen for me is: **is there any better paradigm, at least bounded to certain classes of metric spaces, that yields better results?** Let's move on.

We define

$$e_n(T) := \inf \sup_{t \in T} d(t, T_n),$$

where the infimum is taken over all subsets $T_n \subset T$ with $\mathrm{card}\, T_n \le N_n$. (Since $T$ is finite here, the infimum is actually a minimum.)

It is good to observe that (since $N_0 = 1$)

$$\frac{\Delta(T)}{2} \le e_0(T) \le \Delta(T),$$

where, here and in the sequel, $\Delta(T)$ denotes the diameter of $T$,

$$\Delta(T) := \sup_{t_1, t_2 \in T} d(t_1, t_2).$$

Why? Because:

Suppose $t_1, t_2 \in T$ realize the diameter, i.e.,

$$d(t_1, t_2) = \Delta(T).$$

Then for any $t_0 \in T$, the triangle inequality gives

$$d(t_1, t_0) + d(t_0, t_2) \ge d(t_1, t_2) = \Delta(T).$$

Let us then choose, for each $n$, a subset $T_n \subset T$ with $\mathrm{card}\, T_n \le N_n$ such that

$$e_n(T) = \sup_{t \in T} d(t, T_n).$$

Since $d(t, T_n) \le e_n(T)$ for each $t$, it follows from the previous inequality that we have proved the following result.

## Dudley's Entropy Bound

**Proposition (Dudley's entropy bound):** Under the increment condition of sub-Gaussianness, we have

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] \le L \sum_{n \ge 0} 2^{n/2} e_n(T).$$

Let us rephrase Dudley's entropy bound by covering number. Here the relationship with the underlying shape and metric space arises:

The **covering number** $N(T,d,\varepsilon)$ is defined as the smallest integer $N$ such that there exists a subset $F \subset T$ with $\mathrm{card}\, F \le N$ and

$$\forall t \in T, \quad d(t, F) \le \varepsilon.$$

Thus,

$$e_n(T) = \inf \left\{ \varepsilon : N(T,d,\varepsilon) \le N_n \right\},$$

and

$$\varepsilon < e_n(T) \ \Rightarrow \ N(T,d,\varepsilon) > N_n \ \Rightarrow \ N(T,d,\varepsilon) \ge 1 + N_n.$$

We have

$$\sqrt{\log(1 + N_n)} \, \left(e_n(T) - e_{n+1}(T)\right) \le \int_{e_{n+1}(T)}^{e_n(T)} \sqrt{\log N(T,d,\varepsilon)} \, d\varepsilon.$$

Since $\log(1 + N_n) \ge 2^n \log 2$ for $n \ge 0$, summation over $n \ge 0$ yields

$$\sqrt{\log 2} \sum_{n \ge 0} 2^{n/2} \left(e_n(T) - e_{n+1}(T)\right) \le \int_{0}^{e_0(T)} \sqrt{\log N(T,d,\varepsilon)} \, d\varepsilon.$$

Now,

$$\begin{align*}
\sum_{n \ge 0} 2^{n/2} \left(e_n(T) - e_{n+1}(T)\right) &= \sum_{n \ge 0} 2^{n/2} e_n(T) - \sum_{n \ge 1} 2^{(n-1)/2} e_n(T) \\
&\ge \left(1 - \frac{1}{\sqrt{2}}\right) \sum_{n \ge 0} 2^{n/2} e_n(T).
\end{align*}$$

Thus, we obtain

$$\sum_{n \ge 0} 2^{n/2} e_n(T) \le L \int_{0}^{\infty} \sqrt{\log N(T,d,\varepsilon)} \, d\varepsilon,$$

and hence, the **integral form of Dudley's entropy bound**:

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] \le L \int_{0}^{\infty} \sqrt{\log N(T,d,\varepsilon)} \, d\varepsilon.$$

## Generic Chaining and the Majorizing Measure Theorem

Hence we will have the following theorem:

**Theorem (The generic chaining bound):** Under the increment condition (0.4), and assuming that $\mathbb{E}X_t = 0$, for each admissible sequence $\{A_n(t)\}_{n \ge 0}$ we have

$$\mathbb{E} \sup_{t \in T} X_t \le L \, \sup_{t \in T} \sum_{n \ge 0} 2^{n/2} \, \Delta(A_n(t)),$$

where $\Delta(A_n(t))$ denotes the diameter of the set $A_n(t)$ with respect to the metric $d$,

$$\Delta(A_n(t)) = \sup_{s_1, s_2 \in A_n(t)} d(s_1, s_2).$$

Given a set $T$, an **admissible sequence** is an increasing sequence  $(\mathcal{A}_n)_{n \ge 0}$  of partitions of T 
such that

$$\mathrm{card}(\mathcal{A}_n) \le N_n.$$

Given $\alpha > 0$ and a metric space $(T, d)$ (that need not be finite), we define

$$\gamma_\alpha(T, d) = \inf_{(\mathcal{A}_n)} \sup_{t \in T} \sum_{n \ge 0} 2^{n / \alpha} \, \Delta(\mathcal{A}_n(t)),$$

where the infimum is taken over all admissible sequences $$(\mathcal{A}_n)_{n \ge 0}$$.

It is good to observe that, since $$\mathcal{A}_0(t) = T$$,
we have
$$\gamma_\alpha(T, d) \ge \Delta(T).$$

**Proof:** Fix any admissible sequence $$(\mathcal{A}_n)_{n\ge 0}$$.
For every $t\in T$ the sum in the definition of 
$\gamma_\alpha$
contains the $n=0$ term

$$2^{0/\alpha}\,\Delta(\mathcal{A}_0(t)) = 1\cdot \Delta(\mathcal{A}_0(t)).$$

By admissibility $$\mathcal{A}_0(t)=T$$
, hence this term equals $\Delta(T)$. Since all remaining terms of the sum are nonnegative,
 we obtain for every $t\in T$

$$\sum_{n\ge 0} 2^{n/\alpha}\,\Delta(\mathcal{A}_n(t)) \ge \Delta(T).$$

Taking the supremum over $t\in T$ yields

$$\sup_{t\in T}\sum_{n\ge 0} 2^{n/\alpha}\,\Delta(\mathcal{A}_n(t)) \ge \Delta(T).$$

Finally, taking the infimum over all admissible sequences gives

$$\gamma_\alpha(T,d)=\inf_{(\mathcal{A}_n)}\sup_{t\in T}\sum_{n\ge 0} 
 2^{n/\alpha}\,\Delta(\mathcal{A}_n(t)) \ge \Delta(T),$$

as claimed. □

**Theorem (Majorizing measure theorem / Generic chaining for Gaussian processes):** Let $(X_t)_{t \in T}$ be a centered Gaussian process, and denote by

$$d(t, s) = \left( \mathbb{E} |X_t - X_s|^2 \right)^{1/2}$$

the associated natural metric on $T$. Then

$$\mathbb{E} \left[ \sup_{t \in T} X_t \right] \asymp \gamma_2(T),$$

where

$$\gamma_2(T) := \inf_{(T_n)} \sup_{t \in T} \sum_{n \ge 0} 2^{n/2} \, d(t, T_n),$$

and the infimum is taken over all sequences of subsets $T_n \subset T$ 
with $|T_n| < 2^{2^n}$.

## Reflections on Multiscale Approximation

So let me cite some monographs from the paper: *CHAINING, INTERPOLATION, AND CONVEXITY*

If I had time to further examine this topic and write a further blog post...

> However, when presented with any specific situation, it often proves to be remarkably difficult to control $\gamma_2(T)$ efficiently and to obtain sharp results, unless one is able to construct a nearly optimal sequence of nets $(T_n)$. This task is significantly complicated by the multiscale nature of $\gamma_2(T)$.
>
> The aim of this paper is to exhibit some surprisingly elementary principles that make it possible to obtain sharp control of $\gamma_2(T)$ in various interesting examples, and that shed new light on the underlying geometric phenomena.
>
> There are essentially two general approaches that have been used to control $\gamma_2(T)$. The simplest and by far the most useful approach is obtained by bringing the supremum over $t \in T$ inside the sum in the definition of $\gamma_2(T)$. This yields
> $$\gamma_2(T) \le \sum_{n \ge 0} 2^{n/2} e_n(T),$$
> where the *entropy number* $e_n(T)$ is defined as the smallest $\varepsilon > 0$ such that there exists an $\varepsilon$-net in $T$ of cardinality less than $2^{2^n}$.
>
> This bound, due to Dudley, long predates Theorem 1.1 and has found widespread use. Its utility stems from the fact that controlling entropy numbers only requires us to approximate the set $T$ at a single scale.
>
> Unfortunately, Dudley's bound can fail to be sharp even in the simplest examples, such as ellipsoids in Hilbert space. In fact, the supremum of a random process on $T$ cannot in general be understood in terms of the entropy numbers of $T$: one can easily construct two such sets with comparable entropy numbers on which a Gaussian process behaves very differently.
>
> It is therefore a crucial feature of Theorem 1.1 that the use of entropy numbers is replaced by a genuinely multiscale form of approximation. The construction of such a multiscale approximation in any given situation is, however, a highly nontrivial task.

---

## References

The references for this blogpost:

- *CHAINING, INTERPOLATION, AND CONVEXITY* by Ramon van Handel
- *Probability in High Dimension* by Ramon van Handel
- *The Generic Chaining* by the great Michel Talagrand
- *Upper and Lower Bounds for Stochastic Processes* by the great Michel Talagrand
- *Sparsification, sampling, and optimization* lecture notes by James R. Lee