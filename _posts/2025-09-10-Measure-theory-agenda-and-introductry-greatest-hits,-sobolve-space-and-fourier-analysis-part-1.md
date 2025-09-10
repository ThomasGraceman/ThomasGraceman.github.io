
# Foundations of Measure Theory and Functional Analysis: A Journey Toward Sobolev Spaces

I decided to write a series of blog posts about Sobolev spaces, functional analysis, and Fourier analysis. I am especially interested in the applications of Fourier analysis and functional analysis in quantum computation, particularly the mathematics related to Quantum Function Approximation.

In this blog post, I intend to prove and discuss some theorems from measure theory and functional analysis, and talk about the conceptual framework needed in this branch. I will also discuss Sobolev spaces.

Basically, I am trying to understand some mathematics about Fourier and harmonic analysis related to problems in quantum machine learning theory. We want to use mathematical tools to improve learning and make it more stable when we have many qubits. So I will post a series of blogs related to functional analysis, measure theory, harmonic and Fourier analysis to solidify what I have learned and have some concrete outcomes before solving any actual problems.

I will start with some basic tools, theorems, and lemmas from measure theory, possibly expanding to applications of Parseval's theorem and explaining Sobolev spaces.

## The Core Philosophy of Measure Theory

In measure theory, at least the basic part of what I am reading from Royden's book, the main thinking agenda revolves around **limiting arguments**! I can further clarify what I mean by proving Fatou's lemma and the dominated Lebesgue convergence theorem.

The second important agenda in measure theory is that of **approximation**! This means if you have something that behaves closely to a desired good behavior, it is sufficient to be able to use for other purposes, namely **LITTLEWOOD'S THREE PRINCIPLES**.

The third principle is to construct from the bottom up: construct the integral operator first for simple functions, and using the approximation agenda, we use those simple functions in turn to get close to computing the integral of other functions. We could use those functions to compute the Lebesgue integral of other functions.

So in measure theory, we assume that we have a space $X$ with a sigma algebra $\mathcal{A}$:
$$
(X, \mathcal{A}, \mu)
$$

We have the definition of measurable functions, which translate inverses of measurable sets to measurable sets. So in a way, measurable functions are like continuous functions for topological spaces we have an inverse translation from open sets to open sets, so we have a precise method of data transmission.

I take this quote from Royden's book:

> J. E. Littlewood says:  
> "The extent of knowledge required is nothing like so great as is sometimes supposed. There are three principles, roughly expressible in the following terms: Every measurable set is nearly a finite union of intervals; every measurable function is nearly continuous; every pointwise convergent sequence of measurable functions is nearly uniformly convergent. Most of the results of [the theory] are fairly intuitive applications of these ideas, and the student armed with them should be equal to most occasions when real variable theory is called for. If one of the principles would be the obvious means to settle the problem if it were 'quite' true, it is natural to ask if the 'nearly' is near enough, and for a problem that is actually solvable it generally is."

Egorov's Theorem: A Cornerstone Example

**Theorem (Egorov's theorem):** Let $(E,\mathcal{M},m)$ be a measurable set with $m(E)<\infty \\ $. 
Let $\{f_n\}$ be a sequence of measurable functions on $E$ which converges pointwise a.e. to a real-valued measurable function $f$ on $E \\ $. 
Then for every $\varepsilon>0$ there exists a closed set $F\subset E$ such that
$$
f_n\to f \quad\text{uniformly on }F
$$
and
$$
m(E\setminus F)<\varepsilon.
$$

**Proof:** Following Royden, we first prove the following lemma:

**Lemma:** Under the assumptions of Egorov's theorem, for each $\eta>0$ and $\epsilon>0$, 
there exists a measurable subset $A\subseteq E$ and an index $N\in\mathbb{N}$ such that
$$
|f_n-f|<\eta \quad \text{on } A \quad \text{for all } n>N,
$$
and
$$
m(E\setminus A)<\epsilon.
$$

The context of thinking to prove this lemma relies on the properties of sigma algebras and measurable functions.

First, we use the approximation agenda and limiting arguments. Let us start with a set that can capture a less strict behavior of the set:

$$N_{M,\eta} = \left\{ x \in E : \text{for all } n > M, \, |f_n(x) - f(x)| < \eta \right\}$$

Let $N = \bigcup_{M=1}^\infty N_{M,\eta}$. By the measurability of functions, we know that each $N_M$ is measurable, and the union of measurable sets is measurable, hence $N$ is measurable. But is there any correlation between $N$ and $E$?

For each $x \in E$, there exists an $M$ such that for all $n > M$, we have $|f_n(x) - f(x)| < \eta$ based on the pointwise convergence assumption. 
Hence we can deduce that $E = N$, and the $N_M$ form an ascending collection of measurable sets.

Based on the continuity of measure, we have:
$$m\left(\bigcup_{k=1}^\infty N_k\right) = \lim_{k \to \infty} m(N_k)$$

Since the measure of set $E$ is finite, there exists an index $M$ such that $m(E \setminus N_M) < \epsilon/2$.

For every measurable set, we can approximate it with a closed set which is a subset of our set such that $m(N_M \setminus A) < \epsilon/2$. Hence we can deduce that $m(E \setminus A) < \epsilon$.

Using these two agendas approximating and capturing partial behavior, plus using limiting arguments we can prove the lemma. Now let's turn to the actual theorem.

According to the previous lemma, for each $\eta = \frac{1}{n}$, we have a subset $A_n$ such that $m(E \setminus A_n) < \frac{\epsilon}{2^{n+1}}$.

Here comes another limiting argument. We have nice information about the behavior of each $A_n$ which was easy to compute. If we tried to find a set where the function is uniformly continuous from the start, it would be very hard. Now that we have partial behavior sets, we can use limiting arguments to determine the desired uniform behavior we were after. Consider: $ \\ F = \bigcap_{n=1}^{\infty} A_n$.

Based on the subadditivity of the measure function:
$$
\\
\begin{aligned}
E \setminus \bigcap_{n=1}^{\infty} A_n &= \bigcup_{n=1}^{\infty} (E \setminus A_n), \\
m\left(E \setminus \bigcap_{n=1}^{\infty} A_n\right) &\le \sum_{n=1}^{\infty} m(E \setminus A_n) \\
&\le \sum_{n=1}^{\infty} \frac{\epsilon}{2^{n+1}} = \frac{\epsilon}{2}.
\end{aligned}
$$

Then it is easy to determine the uniformity of our function on the set $F$:

It is easy to show that $\{f_n\}$ converges to $f$ uniformly on $F$.\
Indeed, let $\varepsilon > 0$. Choose an index $N_0$ such that $\frac{1}{N_0} < \varepsilon$. Then:
$$
|f_k - f| < \frac{1}{N_0} \quad \text{on } A_{N_0} \text{ for } k > N_0.
$$
However, $F \subseteq A_{N_0}$ and $\frac{1}{N_0} < \varepsilon$, therefore:
$ |f_k - f| < \varepsilon \quad \text{on } F \text{ for } k > N_0  \\ .$
and we can choose a closed subset of F namely $F_0$ such that $m(F \setminus F_0) \le  \varepsilon/2 \\ $.
Thus, $\{f_n\}$ converges to $f$ uniformly on $F$, and $m(E \setminus F_0) < \varepsilon$.

We have seen an example of the arguments used in measure theory and the context behind it. □

## Littlewood's Second Principle

**Proposition (Littlewood's Second Principle):** Let $f$ be a simple function defined on $E$. Then for each $\varepsilon > 0$, there exists a continuous function $g$ on $\mathbb{R}$ and a closed set $F \subseteq E$ such that
$$f = g \text{ on } F \quad \text{and} \quad m(E \setminus F) < \varepsilon.$$

**Proof:** Based on the definition of simple functions, we have $f(x) = \sum_{i=1}^{n} a_i \chi_{E_i}$.

We can approximate each $E_i$ such that there exist closed sets $F_i \subseteq E_i$ with $m(E_i \setminus F_i) \leq \frac{\varepsilon}{n} \\ .$. 
Then we take their union $F = \bigcup_{i=1}^n F_i$, which gives us a closed subset with the property that 
$$m(E \setminus F) \leq \sum_{i=1}^n m(E_i \setminus F_i) \leq \varepsilon.$$

Since $\mathbb{Q}$ is dense in $\mathbb{R}$, every open set can be written as a union of countably many open intervals. Hence, $F^c$ is open and can be expressed as a union of countable intervals. We can then extend the function $f$ defined on $F$ to a function $g$ on the whole real line such that $g = f$ on $F$ by defining $g$ linearly on each interval of the form $(a,b)$.

First, we need to show that $f$ is continuous on $F$. Since $F$ is a union of closed sets, for each $x \in F_i$, we can find a neighborhood that does not intersect with other $F_j$'s, so the function is continuous on $F$. If we linearly extend it as mentioned, it is easy to see that if we have our neighborhood small enough around any $x_0$, we would have $|g(x) - g(x_0)| \le \epsilon$ because:
- If $x \in F^c$, then it is obvious
- If $x$ is in the interior of $F$, it is obvious too  
- If $x$ is in the closure of $F$, then for a neighborhood small enough, the continuity holds based on our construction

Thus we have proved the proposition. □

## Lusin's Theorem

**Theorem (Lusin's Theorem):** Let $f$ be a real-valued measurable function on $E$. Then for each $\varepsilon > 0$, there exists a continuous function $g$ on $\mathbb{R}$ and a closed set $F \subseteq E$ such that
$$f = g \text{ on } F \quad \text{and} \quad m(E \setminus F) < \varepsilon.$$

**Proof:** We follow the book's proof and only prove the case where $m(E) < \infty$.

First, assume that we have a function which is not simple, but we can use simple functions to approximate it pointwise. For example, if a function equals $f = \sum_{i=1}^{\infty} a_i \chi_{E_i}$, then we can use $f_n = \sum_{i=1}^{n} a_i \chi_{E_i}$ to approximate it and have pointwise convergence.

Alternatively, we could consider the truncated function by setting $E_n = \{x : |f(x)| \leq n\}$ and approximating the function on this subset first. 
It is easy to show that we can approximate this function with the desired error $|f(x) - g_n(x)| \le \frac{1}{n}$ using another simple function $g_n$ on $E_n$ and setting $g_n$ to equal $n$ on $E_n^c$.
 It is easy to show that this converges pointwise to $f$.

Using this approach, we have a sequence of simple function approximations $\{f_n\}$. Based on the previous proposition, we can extend them to continuous functions $\{g_n\}$: $g_n = f_n$ on $F_n$ where $m(E \setminus F_n) < \frac{\varepsilon}{2^{n+1}}$.

Now we know that there exists a set on which the $f_n$'s converge uniformly to $f$ (by Egorov's theorem). Let this set be $F_0$ with $m(E \setminus F_0) < \frac{\varepsilon}{2}$.

If we consider the set $F = \bigcap_{n=0}^{\infty} F_n$, then:
- Each function $g_n = f_n$ is continuous on $F$ 
- They converge uniformly to $f(x)$ on $F$
- Since uniform convergence of continuous functions preserves continuity, $f(x)$ is continuous on $F$
- We have $m(E \setminus F) < \varepsilon$

Thus we have our proof. □

### The Strategy

What was the agenda here? First, we used the fact that we can use a sequence of simple functions that converge pointwise to any measurable function. Then we used the fact that we can restrict those simple functions to a subset of their domain so that they are continuous on that domain. We used Egorov's theorem to show that there exists a subset on which the $f_n$'s converge uniformly to $f$.

By these facts, and the fact that uniform convergence of continuous functions is continuous, we showed that any measurable function could be continuous on a subset of its domain with arbitrarily small complement.

This is another nice use of a limiting argument: first we used simple functions to approximate something, because simple functions are easy objects to deal with and have nice properties. Then using a limiting argument, we could transmit those nice properties to any desired measurable function. Nice, isn't it?

## The Lebesgue Integral

Quoting Royden:

> Recall that a measurable real-valued function $\phi$ defined on a set $E$ is said to be simple provided it takes only a finite number of real values. If $\phi$ takes the distinct values $a_1, \ldots, a_n$ on $E$, then, by the measurability of $\phi$, its level sets $\phi^{-1}(a_i)$ are measurable and we have the canonical representation of $\phi$ on $E$ as 
> $$\phi = \sum_{i=1}^{n} a_i \chi_{E_i} \quad \text{on } E,$$
> where each $E_i = \phi^{-1}(a_i) = \{x \in E : \phi(x) = a_i\}$.

The canonical representation is characterized by the $E_i$'s being disjoint and the $a_i$'s being distinct.

**Definition:** For a simple function $\phi$ defined on a set of finite measure $E$, we define the integral of $\phi$ over $E$ by 
$$\int_E \phi = \sum_{i=1}^{n} a_i \cdot m(E_i).$$

Now let us prove some things about Lebesgue integrals. For our limiting argument agenda to work, we need to prove some theorems regarding convergence related to integrals. Mostly what we can get regarding limiting arguments is related to pointwise convergence in practice, it is much easier to derive sequences which converge pointwise rather than uniformly.

## Convergence Theorems for Integrals

**Proposition:** Let $\{f_n\}$ be a sequence of bounded measurable functions on a set of finite measure $E$. If $f_n \to f$ uniformly on $E$, then 
$$\lim_{n \to \infty} \int_E f_n = \int_E f.$$

**Proof:** We have to show that $\lim_{n \to \infty} \int_E (f_n - f) = 0$.

Based on uniform continuity, we have $|f_n - f| \le \epsilon$ for $n \ge N$,
and we have $\left|\lim_{n \to \infty} \int_E (f_n - f)\right| \le \lim_{n \to \infty} \int_E |f_n - f|$.

To prove it, it suffices to establish the inequality for simple functions approximating $\lim_{n \to \infty} \int_E (f_n - f)$.

So for the desired $\frac{\epsilon}{m(E)}$ and for $N$ large enough and $n \ge N$, we have:
$$\left| \int_E (f_n - f)\right| \le \int_E |f_n - f| \le \epsilon \cdot m(E)$$

Hence the proposition is proved. □

As we have seen, the uniform case is extremely simple. However, if that sufficed, life would have been too good. Thus, we must turn to other methods to capture the more subtle behaviors of measurable functions.

**Theorem (The Bounded Convergence Theorem):** Let $\{f_n\}$ be a sequence of measurable functions on a set of finite measure $E$. Suppose $\{f_n\}$ is uniformly pointwise bounded on $E$, that is, there is a number $M > 0$ for which $|f_n| \leq M$ on $E$ for all $n$. If $\{f_n\} \to f$ pointwise on $E$, then 
$$\lim_{n \to \infty} \int_E f_n = \int_E f.$$

**Proof:** This is a nice application of Egorov's theorem.

We have a subset $F$ of $E$ such that $m(E \setminus F) \le \epsilon$.

Since we know that the $f_n$'s are bounded, we have:
$$\left| \int_E (f_n - f)\right| \le \int_E |f_n - f| \le \int_F |f_n - f| + \int_{E \setminus F} |f_n - f| \le \int_F |f_n - f| + 2M \cdot \epsilon$$

By Egorov's theorem, we have uniformness on $F$, so for $N$ large enough and $n \ge N$,
we have $|f_n - f| \le \epsilon$. Hence:
$$\left| \int_E (f_n - f)\right| \le \int_F |f_n - f| + 2M \cdot \epsilon \le \epsilon \cdot m(F) + 2M \cdot \epsilon \le \epsilon \cdot m(E) + 2M \cdot \epsilon$$

So if we let $\epsilon = \frac{\epsilon_1}{2M + m(E)}$, then:
$$\left| \int_E (f_n - f)\right| \le \epsilon \cdot m(E) + 2M \cdot \epsilon \le \epsilon_1$$ □

What did we do here? By using Egorov's theorem, we chose a subset $F$ for which the convergence is uniform and for which we have $m(E \setminus F) \leq \varepsilon$, meaning we can control the distance in measure. Because the functions are bounded, it is obvious that the function $f$ is also bounded, and we can form an upper bound for the above integral with ease.

As we see, this proof is clearly natural. In principle, we first find a subset on which the desired convergence behaves very nicely, then we use boundedness to control the behavior of the less desired properties.

## Extended Definition of the Integral

**Definition:** For $f$ a nonnegative measurable function on $E$, we define the integral of $f$ over $E$ by
$$\int_E f = \sup \left\{ \int_E h : h \text{ bounded, measurable, of finite support and } 0 \leq h \leq f \text{ on } E \right\}.$$

This definition follows the agenda of the previous definitions. Notice that we first defined integral for simple functions, which were easy objects to deal with, and defining integral was a very natural, easy thing for those simple functions. Next we defined integral for bounded functions with finite support measure. Notice that the building block of why we defined integral for these bounded, finite support measure functions was because we had the simple approximation lemma and we were following the natural way of defining integral using the Riemann integral definition agenda.

Coming up with this definition is also something very natural. Now we came up with a definition of integral of bounded functions with finite support, and now we can use those functions to compute the integral of non-negative extended real-valued functions! It doesn't follow the agenda of Riemann definition because we might have $\infty$, so taking the inf might have no meaning at all, but we can use limiting arguments in disguise to compute this definition of integral and settle some cases like $0 \cdot \infty$, for example.

## Chebyshev's Inequality

**Chebyshev's Inequality:** Let $f$ be a nonnegative measurable function on $E$. Then for any $\lambda > 0$,
$$m\{x \in E : f(x) > \lambda\} \leq \frac{1}{\lambda} \int_E f.$$

**Proof:** There are two cases. First, suppose that $m(E) = \infty$. If we consider $A = \{x : f(x) \ge \lambda\}$ and consider the set $A_n = A \cap [-n, n]$, then if we set a bounded function of finite support to be $\lambda$ on $A_n$ and $0$ otherwise, this is indeed a function that is used to compute the integral of $\int f$. So for each $n$ we have $\lambda \cdot m(A_n) \le \int f$. Hence we have $\lim_{n \to \infty} \lambda \cdot m(A_n) \le \int f$, which means $\lambda \cdot m(A) \le \int f$.

For the other case where $m(E) < \infty$: it is obvious that we can define a simple function approximating the integral, which makes the theorem obvious. □

The agenda of measure theory was used here to settle the case of $m(E) = \infty$ we used limiting arguments here.

## Fatou's Lemma

Now let us analyze one of my favorite lemmas in measure theory: Fatou's lemma.

**Fatou's Lemma:** Let $\{f_n\}$ be a sequence of nonnegative measurable functions on $E$. If $\{f_n\} \to f$ pointwise a.e. on $E$, then 
$$\int_E f \leq \liminf_{n \to \infty} \int_E f_n.$$

**Proof:** This is one of the nicest examples of limiting arguments used here.

As we may see, it is very hard to derive this integral directly, so now we turn to limiting arguments. We used the approximation agenda to find an easier object approximating a harder object, and made those easier objects more precise.

Let us consider a bounded measurable function $h$ with compact support that is used to compute the integral of $\int f$. Here we use this because it is the fixed object of our problem, and we also note that $f$ is also measurable, because it is the result of pointwise convergence of measurable functions, meaning pointwise convergence preserves measurability.

Now having $h$, how can we derive a bounded measurable function with compact support that approximates $f_n$? The answer is to set $h_n = \min\{h, f_n\}$. It is measurable, bounded (obviously), with compact support. If support is not compact here, we know that support is bounded, and we can select a closed subset with measure difference $m(E \setminus F) \le \epsilon$, which makes it suitable. We can make a limiting argument to argue that $\int h_n \le \int f_n$.

So now we know that $\int h_n \le \int f_n$. What happens if we make another limiting argument?

We know that $h_n = \min\{h, f_n\}$, then $\lim_{n \to \infty} h_n = h$. Because of the fact that $f_n$ were nonnegative, $h_n$ are bounded measurable functions, so we have pointwise convergence and boundedness. Hence we can use the bounded convergence theorem:

$$\lim_{n \to \infty} \int h_n = \int h$$

Therefore:
$$\int h = \lim_{n \to \infty} \int h_n \leq \liminf_{n \to \infty} \int f_n$$

Since this holds for any bounded measurable function $h$ with compact support such that $0 \leq h \leq f$, taking the supremum over all such $h$ gives us:
$$\int f \leq \liminf_{n \to \infty} \int f_n$$ □

From Fatou's lemma, we can prove the monotone convergence theorem and Lebesgue convergence theorem, which are very strong theorems.

**Theorem (The Monotone Convergence Theorem):** Let $\{f_n\}$ be an increasing sequence of nonnegative measurable functions on $E$. If $\{f_n\} \to f$ pointwise a.e. on $E$, then 
$$\lim_{n \to \infty} \int_E f_n = \int_E f.$$

**Proof:** According to Fatou's Lemma,
$$\int_E f \leq \liminf_{n \to \infty} \int_E f_n.$$

If we can show that:
$$\int_E f \ge \limsup_{n \to \infty} \int_E f_n,$$
then we have the proof.

But notice that if we have $f_n \le f$, hence for each function $h \le f_n$, we have $h \le f$. Hence $\int f_n \le \int f$. Therefore $\limsup_{n \to \infty} \int f_n \le \int f$. □

We also state (which is not very hard to prove it is a direct application of Fatou's lemma):

**Theorem (General Lebesgue Dominated Convergence Theorem):** Let $\{f_n\}$ be a sequence of measurable functions on $E$ that converges pointwise a.e. on $E$ to $f$. Suppose there is a sequence $\{g_n\}$ of nonnegative measurable functions on $E$ that converges pointwise a.e. on $E$ to $g$ and dominates $\{f_n\}$ on $E$ in the sense that $|f_n| \leq g_n$ on $E$ for all $n$.

If $\lim_{n \to \infty} \int_E g_n = \int_E g < \infty$, then 
$$\lim_{n \to \infty} \int_E f_n = \int_E f.$$

## Introduction to Functional Analysis and $L^p$ Spaces

We now turn to functional analysis and try to prove some inequalities which make for a powerful arsenal. Then we will try to prove certain introductory things about Sobolev spaces.

The following passage belongs to Stein's book.

If $1 \leq p < \infty$, the space $L^p(X, \mathcal{F}, \mu)$ consists of all complex-valued measurable functions on $X$ that satisfy 
$$\int_X |f(x)|^p \, d\mu(x) < \infty.$$

To simplify the notation, we write $L^p(X, \mu)$, or $L^p(X)$, or simply $L^p$ when the underlying measure space has been specified.

Then, if $f \in L^p(X, \mathcal{F}, \mu)$, we define the $L^p$ norm of $f$ by
$$\|f\|_{L^p(X, \mathcal{F}, \mu)} = \left( \int_X |f(x)|^p \, d\mu(x) \right)^{1/p}.$$

We also abbreviate this to $\|f\|_{L^p(X)}$, $\|f\|_{L^p}$, or $\|f\|_p$.

**Theorem (Hölder inequality):** Suppose $1 < p < \infty$ and $1 < q < \infty$ are conjugate exponents. If $f \in L^p$ and $g \in L^q$, then $fg \in L^1$ and 
$$\|fg\|_{L^1} \leq \|f\|_{L^p} \|g\|_{L^q}.$$

**Proof:** The nature of this inequality is very geometric. Let's try to prove this.

First, let us use a generalized form of the arithmetic-geometric inequality:

If $A, B \geq 0$, and $0 \leq \theta \leq 1$, then 
$$A^{\theta} B^{1-\theta} \leq \theta A + (1-\theta) B.$$

Note that if $f$ or $g = 0$ a.e., then $fg = 0$ almost everywhere, and the inequality is true, so let's consider the other case. We now consider $\frac{f}{\|f\|}$ and $\frac{g}{\|g\|}$.

We may further assume that $\|f\|_{L^p} = \|g\|_{L^q} = 1$. We now need to prove that $\|fg\|_{L^1} \leq 1$.

If we set $A = |f(x)|^p$, $B = |g(x)|^q$, and $\theta = 1/p$ so that $1 - \theta = 1/q$, then the above inequality gives
$$|f(x)g(x)| \leq \frac{1}{p} |f(x)|^p + \frac{1}{q} |g(x)|^q.$$

Integrating this inequality yields $\|fg\|_{L^1} \leq 1$, and the proof of the Hölder inequality is complete. □

**Theorem (Minkowski inequality):** If $1 \leq p < \infty$ and $f, g \in L^p$, then $f + g \in L^p$ and 
$$\|f + g\|_{L^p} \leq \|f\|_{L^p} + \|g\|_{L^p}.$$

**Proof:** The case $p = 1$ is obtained by integrating $|f(x) + g(x)| \leq |f(x)| + |g(x)|$.

When $p > 1$, we may begin by verifying that $f + g \in L^p$ when both $f$ and $g$ belong to $L^p$. Indeed,
$$|f(x) + g(x)|^p \leq 2^p(|f(x)|^p + |g(x)|^p),$$
as can be seen by considering separately the cases $|f(x)| \leq |g(x)|$ and $|g(x)| \leq |f(x)|$.

Next we note that 
$|f(x) + g(x)|^p \leq |f(x)| |f(x) + g(x)|^{p-1} + |g(x)| |f(x) + g(x)|^{p-1}.$

If $q$ denotes the conjugate exponent of $p$, then $(p-1)q = p$, so we see that $(f + g)^{p-1}$ belongs to $L^q$, and therefore Hölder's inequality applied to the two terms on the right-hand side of the above inequality gives
$\|f + g\|_{L^p}^p \leq \|f\|_{L^p} \|(f + g)^{p-1}\|_{L^q} + \|g\|_{L^p} \|(f + g)^{p-1}\|_{L^q}.$

However, using once again $(p-1)q = p$, we get 
$\|(f + g)^{p-1}\|_{L^q} = \|f + g\|_{L^p}^{p/q}.$

From the above, since $p - p/q = 1$, and because we may suppose that $\|f + g\|_{L^p} > 0$, we find
$\|f + g\|_{L^p} \leq \|f\|_{L^p} + \|g\|_{L^p},$
so the proof is finished. □

## Introduction to Sobolev Spaces

Now, let us talk about Sobolev spaces, derive some basic relations needed to prove some basics. In later chapters, I will talk about Sobolev spaces' origins, test functions, and derive further more sophisticated results. Now let's prove that Sobolev spaces are Banach spaces, which are complete.

Sobolev spaces are a form of generalization I like to call "soft abstraction," which means instead of having an object be a precise something for example, a function being precisely differentiable we just require it to behave on the surface like the nice object that we like to have. So that is a postmodern agenda, I suppose. Well, the problem was that mathematicians couldn't derive some differentiations from PDE problems, but in nature, those problems behaved just fine, as if differentiations existed. So I guess this form of abstraction is a valid one.

A function $f \in L^p(\mathbb{R}^d)$ is said to have **weak derivatives** in $L^p$ up to order $k$, if for every multi-index $\alpha = (\alpha_1, \ldots, \alpha_d)$ with $|\alpha| = \alpha_1 + \cdots + \alpha_d \leq k$, there is a $g_\alpha \in L^p$ with
$\int_{\mathbb{R}^d} g_\alpha(x) \varphi(x) \, dx = (-1)^{|\alpha|} \int_{\mathbb{R}^d} f(x) \partial_x^\alpha \varphi(x) \, dx$
for all smooth functions $\varphi$ that have compact support in $\mathbb{R}^d$.

Here, we use the multi-index notation 
$\partial_x^\alpha = \frac{\partial^{|\alpha|}}{\partial x^\alpha} = \frac{\partial^{|\alpha|}}{\partial x_1^{\alpha_1} \cdots \partial x_d^{\alpha_d}}.$

The space $L^p_k(\mathbb{R}^d)$ is the subspace of $L^p(\mathbb{R}^d)$ of all functions that have weak derivatives up to order $k$. This space is usually referred to as a **Sobolev space**.

A norm that turns $L^p_k(\mathbb{R}^d)$ into a Banach space is
$\|f\|_{L^p_k(\mathbb{R}^d)} = \sum_{|\alpha| \leq k} \|\partial_x^\alpha f\|_{L^p(\mathbb{R}^d)}.$

More generally, we have:

For any domain $\Omega \subseteq \mathbb{R}^N$, any $m \in \mathbb{N}$ and any $p \in [1, +\infty]$, we set
$W^{m,p}(\Omega) := \{v \in L^p(\Omega) : D^\alpha v \in L^p(\Omega), \forall \alpha \in \mathbb{N}^N, |\alpha| \leq m\}.$

(Thus $W^{0,p}(\Omega) := L^p(\Omega)$.) This is a vector space over $\mathbb{C}$, that we equip with the norm
$\|v\|_{W^{m,p}(\Omega)} := \left( \sum_{|\alpha| \leq m} \|D^\alpha v\|_{L^p(\Omega)}^p \right)^{1/p} \quad \forall p \in [1, +\infty[,$
$\|v\|_{W^{m,\infty}(\Omega)} := \max_{|\alpha| \leq m} \|D^\alpha v\|_{L^\infty(\Omega)}.$

Proving that this norm is actually a norm is pretty simple. For the triangle inequality requirement of the norm, Hölder's inequality is needed; the other two requirements are pretty easy to solve.

## Why the Integration by Parts Formula?

So why do we have 
$\int_{\mathbb{R}^d} g_\alpha(x) \varphi(x) \, dx = (-1)^{|\alpha|} \int_{\mathbb{R}^d} f(x) \partial_x^\alpha \varphi(x) \, dx \quad ?$

I cite a theorem contributed by PhoemueX on Math Stack Exchange:

**Lemma:** Let $\emptyset \neq V \subset \mathbb{R}^d$ be open and bounded. Let $\varphi \in C(\overline{V})$ with $\varphi|_{\partial V} \equiv c$ for some $c \in \mathbb{R}$. Furthermore, let $i \in \{1, \ldots, d\}$ and assume that $\partial_i \varphi \in C(V) \cap L^1(V)$. Then 
$\int_V (\partial_i \varphi)(x) \, dx = 0.$

**Proof:** Since $\partial_d \varphi \in L^1(V)$ and $\chi_V$ is measurable, Fubini–Tonelli applies to the function $(x', x_d) \mapsto \partial_d \varphi(x', x_d) \chi_V(x', x_d)$. Hence for a.e. $x' \in \mathbb{R}^{d-1}$ the inner integral
$\int_{\mathbb{R}} \partial_d \varphi(x', x_d) \chi_V(x', x_d) \, dx_d$
converges absolutely and
$\int_V \partial_d \varphi(x) \, dx = \int_{\mathbb{R}^{d-1}} \left( \int_{\mathbb{R}} \partial_d \varphi(x', x_d) \chi_V(x', x_d) \, dx_d \right) dx'.$

For fixed $x' = (x_1, \ldots, x_{d-1})$ the slice
$V_{x'} = \{x_d \in \mathbb{R} : (x', x_d) \in V\}$
is an open subset of $\mathbb{R}$. Any open subset of $\mathbb{R}$ is a (countable) disjoint union of open intervals, so
$V_{x'} = \bigsqcup_{n \in \mathbb{N}} (a_n, b_n),$
where $-\infty < a_n \leq b_n < \infty$ because $V$ is bounded.

If $a_n < b_n$, then $a_n$ and $b_n$ are endpoints of a maximal open interval contained in $V_{x'}$, so they cannot belong to $V_{x'}$. Thus 
$
(x',a_n), (x',b_n) \notin V.
$
Because these points are limits of points of $V$, they lie in $\overline{V}$. Hence 
$
(x',a_n),(x',b_n) \in \overline{V}\setminus V = \partial V.
$

By hypothesis $\varphi \in C(\overline{V})$ and $\varphi|_{\partial V} \equiv c$. Therefore
$
\varphi(x',a_n) = \varphi(x',b_n) = c \quad \text{for each $n$ with } a_n < b_n.
$

For each interval $(a_n,b_n)$ the function $t \mapsto \varphi(x',t)$ is $C^1$ on $(a_n,b_n)$ (because $\partial_d \varphi$ is continuous on $V$), and extends continuously to $[a_n,b_n]$. Hence the fundamental theorem of calculus gives
$
\int_{a_n}^{b_n} \partial_d \varphi(x',t)\,dt 
= \varphi(x',b_n) - \varphi(x',a_n) = c - c = 0.
$
If $a_n=b_n$ the integral is trivially $0$.

For the fixed $x'$ (for which the inner integral converges absolutely) we therefore have
$
\int_{\mathbb{R}} \partial_d \varphi(x',x_d) \,\chi_V(x',x_d)\,dx_d
= \sum_n \int_{a_n}^{b_n} \partial_d \varphi(x',x_d)\,dx_d
= \sum_n 0 = 0.
$
Integrating in $x'$ (using Fubini as in step 1) gives
$
\int_V \partial_d \varphi(x)\,dx = 0.
$

Now choose some bounded open set $V \subset U$ with $\operatorname{supp}(\varphi) \subset V$ and apply the above Lemma to $\phi = u \cdot \varphi$ (check that all assumptions are satisfied with $c=0$). Using the product rule, this implies
$
0 = \int_V (\partial_i \phi)(x)\,dx
   = \int_V \varphi \cdot \partial_i u + u \cdot \partial_i \varphi \, dx,
$
which yields the integration by parts formula that justifies our definition of weak derivatives. □

Conclusion

This concludes our foundational exploration of measure theory, functional analysis, and the introduction to Sobolev spaces. We have seen how the core principles of measure theory limiting arguments, approximation, and bottom-up construction provide the framework for understanding more sophisticated objects.
