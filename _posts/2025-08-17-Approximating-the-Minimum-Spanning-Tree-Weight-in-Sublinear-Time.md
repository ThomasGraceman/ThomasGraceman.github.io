# Approximating the Minimum Spanning Tree Weight in Sublinear Time

Such a good [paper](https://people.csail.mit.edu/ronitt/papers/mst.pdf), although the writing was a bit terse and working out the details was hell painful :D.

Suppose that you have a graph in which the edges are weighted, and you are asked to find the minimum spanning tree in a sublinear amount of time! What does that mean? It means that before you end up reading the whole input you should come up with some sort of close approximation of a good minimum spanning tree.

It is one of the earlier papers in sublinear algorithms and definitely a classic, and worth giving a shot at analyzing the techniques they used to solve the problem and working out the details. I must say that Luca Trevisan is one of my idols, and I plan to read most of his works anyway, so in the name of supreme mathematician we begin.

As they point out in their paper:

> In this paper, we show that there are conditions under which it is possible
> to approximate the weight of the MST of a connected graph in time sublinear
> in the number of edges. We give an algorithm which approximates the MST
> of a graph $G$ to within a multiplicative factor of $1 + \varepsilon$ and runs in time
> $O\left(dw\varepsilon^{-2} \log \frac{dw}{\varepsilon}\right)$ for any $G$ with average degree $d$ and edge weights in the
> set $\{1, \ldots, w\}$. The algorithm requires no prior information about the graph
> besides $w$ and $n$; in particular, the average degree is assumed to be unknown.
> The relative error $\varepsilon$ ($0 < \varepsilon < 1/2$) is specified as an input parameter. Note
> that if $d$ and $\varepsilon$ are constant and the ratios of the edge weights are bounded,
> then the algorithm runs in constant time. We also extend our algorithm to
> the case where $G$ has nonintegral weights in the range $[1, w]$, achieving a
> comparable runtime with a somewhat worse dependence on $\varepsilon$.

First we begin by approximating the number of connected components in a graph. The significance of this approximation will later be illuminated in this article.

First suppose that we have the graph in the form of adjacency lists. Then for a vertex $v$, we define $d_u$ to be the number of edges that the vertex is one endpoint of. Self loops are also included (throughout the paper for technical reasons) and we define $m_u$ to be the number of edges in the connected component that vertex $v$ belongs to and we let $c$ be the number of components (for example $c = 1, 2, 3, \ldots$). It is easy to see that:

**Fact 1** Given a graph with vertex set $V$, for every connected component $I \subseteq V$, $\sum_{u \in I} \frac{1}{2} \frac{d_u}{m_u} = 1$ and $\sum_{u \in V} \frac{1}{2} \frac{d_u}{m_u} = c$.

To see that if we sum over $I \subseteq V$, $\sum_{u \in I} \frac{1}{2} \frac{d_u}{m_u} = \frac{1}{2} \frac{\sum_{u \in I} d_u}{m_u} = \frac{1}{2}\frac{2m_u}{m_u} = 1$ because by counting $d_u$ we count each edge two times, and to handle the case that $m_u = 0$ we let $\frac{d_u}{m_u} = 2$ which still lets us count the number of components correctly.

So here comes the first principle: if you want to approximate something, then find an equivalent formulation of that thing based on other variables which are easier to approximate and you have more information about them, and use them to approximate what you want to approximate!

In this case we approximate $\frac{d_u}{m_u}$! And we see how! As we have defined, we let $d$ to be the average degree, and we can always make $d$ to be $\geq 1$ by adding self loops (oops!).

And we want our estimate to actually be accurate enough, meaning we want it to be equal to $c \pm \varepsilon n$.

**Algorithm: approx-number-connected-components$(G, \varepsilon, W, d^*)$**

1. Uniformly choose $r = O(1/\varepsilon^2)$ vertices $u_1, \ldots, u_r$
2. **For** each vertex $u_i$:
   - Set $\beta_i = 0$
   - Take the first step of a BFS from $u_i$
   - (*) Flip a coin
   - **If** (heads) **and** (# vertices visited in BFS $< W$) **and** (no visited vertex has degree $> d^*$):
     - Resume BFS to double number of visited edges
     - **If** this allows BFS to complete:
       - **If** $m_{u_i} = 0$: set $\beta_i = 2$
       - **Else**: set $\beta_i = \frac{d_{u_i}}{2} \cdot \frac{\text{2^# coin flips}}{\text{# edges visited in BFS}}$
     - **Else**: go to (*)
3. **Output** $\hat{c} = \frac{n}{2r} \sum_{i=1}^{r} \beta_i$

As you've seen, the algorithm gets an $\varepsilon$, a threshold parameter $W$ set to be $\frac{4}{\varepsilon}$, the graph, and an approximation of average degree $d^*$.

So just forget about the algorithm for a second! First let us approximate the average degree first!

Let $C$ be some large constant, then let us pick $\frac{C}{\varepsilon}$ vertices from our Graph $G$ at random, so we count each of those vertices' degrees and pick the maximum among them and set that equal to $d^*$. In order to find the degree of each vertex we must make $O(d)$ operations on average (since each vertex on average has $d$ degrees) so in an amortized sense, to count each degree it is going to take $O(d)$ time, so that makes the expected running time to be $O(C\frac{d}{\varepsilon}) = O(\frac{d}{\varepsilon})$. So imagine that we have each degree sorted in a non-increasing manner, for example the highest degree is the first one and so on. We let the place that our set maximum degree takes place to be $\rho$, for example if our degree is the third highest degree then $\rho = 3$. We will show that with high probability we have that $\rho = \Theta(\varepsilon n)$, $n$ being the number of vertices.

Before proving this we first have to know certain inequalities. There comes the second principle of devising a good approximation algorithm! And that shall be to know thy inequalities! Devising sublinear algorithms seems to be the art of approximating with high probabilities of certainty.

So $(1 - x)^n \leq e^{-nx}$ for $x \in (0,1)$ and $n \geq 0$.

And we have $e^{-x} > 1 - x$ for any $x \geq 0$.

Also one can show that $(1 - \varepsilon/C^2)^{C/\varepsilon} \geq e^{-2/C}$ as it is not that hard of an estimate.

As $(1- \frac{1}{x})^{x} = e^{-1}$ as $x$ goes to $\infty$, so $(1 - \varepsilon/C^2)^{C/\varepsilon} \geq (1 - \varepsilon/C)^{C/\varepsilon} \approx e^{-1} \geq e^{-2/C}$ as $C$ is a large constant.

So assume that $$d^*$$ is not in the first $\varepsilon n$ highest degrees, then each vertex is not in the first $\varepsilon n$ sorted degrees, then the probability of that would be $(1-\varepsilon)^{C/\varepsilon} \leq e^{-C}$. So for a large constant $C$ the probability of that would be very small, so at least one of the degrees with high probability lies within the $\varepsilon n$ first degrees. And now we have devised an upper bound for a high probability. Now we devise a lower bound to see that: assume that the probability that $$d^*$$ doesn't lie within the first $\varepsilon \frac{n}{C^2}$ is $(1-\varepsilon/C^2)^{C/\varepsilon} \geq e^{-2/C} \geq 1 - 2/C$. So with very high probability the position $\rho$ of $d^*$ lies within $\varepsilon \frac{n}{C^2}$ and $\varepsilon n$, hence $\rho = \Theta(\varepsilon n)$. Hence we have the following lemma proved:

**Lemma 4** In $O(d/\varepsilon)$ expected time, we can compute a vertex degree $d^*$ that, with high probability, is the $k$-th largest vertex degree, for some $k = \Theta(\varepsilon n)$.

Also note that we have $d^* = O(\frac{d}{\varepsilon})$. To see that we have $$\Omega(\varepsilon n), so \frac{\sum_{u \in G}d_u}{n} = d \geq \rho d^* = \varepsilon n \frac{d^*}{n}$$, then $\frac{d}{\varepsilon} \ge d^*$, so $d^* = O(\frac{d}{\varepsilon})$. And if we scale $\varepsilon$ properly, with very high probability we have that only $\varepsilon \frac{n}{4}$ vertices have higher degree than $d^*$ (with high probability).

So that's how we approximated the degrees. It leads me to the third principle that I have observed, that is: observe in a way randomly so that you can have some lower and higher bounds with very high probability. We must bear that in mind.

And the second point regarding the threshold parameter $W$: what's the maximum number of such components we can have? In a sense we are taking a look at a very extreme structure in a sense that as $\varepsilon$ goes smaller and smaller, the threshold goes higher and higher and the components with such structure and number of edges tend to get lesser and lesser, so at most we have $\frac{n}{\frac{4}{\varepsilon}} = \varepsilon \frac{n}{4}$. So that leads me to the fourth principle that I really find intuitive! And that is, RULE OUT THE EXTREME STRUCTURES AND COUNT THE MILD ONES! THIS WAY IT MAY LEAD TO A GOOD APPROXIMATION. I will clarify this in a minute.

So let's get to the algorithm.

We sample $r = O(\frac{1}{\varepsilon^2})$ vertices at random uniformly, so we have vertices $u_1, \ldots, u_r$. For each vertex $u_i$ we set $\beta_i$ to be equal to zero, then we flip a coin, and if the conditions were satisfied (spoiler: in the condition we are ruling out the extreme cases!) then take the first step of a BFS from $u_i$. By the first step the authors clarified that it is visiting vertex $u_i$ and its $d_{u_i}$ neighbors.

Then each other time resume BFS to double number of visited edges, till we complete the algorithm, namely seeing every vertex in a component, then we set the parameters!

And then we aggregate a set of approximated parameters to approximate $c$, namely $\hat{c}$.

Let $S$ denote the set of vertices that lie in components with fewer than $W$ vertices all of which are of degree at most $d^*$. We have size of $S \leq n$.

So now we want to compute $E(\beta_i)$ and there are two cases: one where BFS completes and the second where we abort for whatever reason. So in the latter $\beta_i = 0$ so it doesn't affect the mean. And in the former, if BFS completes we flip the coin at least $\frac{m_i}{d_i}$ times, because each time we are doubling the number of new edges visited so $2^td_i \geq m_i$ number of visited edges for the BFS to be complete, so $t \geq \log(\frac{m_i}{d_i})$. So the expected value would be:

$$E(\beta_i) = \sum_{s \in S} \frac{1}{n} 2^{-\log(\frac{m_i}{d_i})} 2^{\log(\frac{m_i}{d_i})}\frac{d_i}{m_i} \leq \frac{2c}{n}$$

So the mean of $\beta_i = \frac{d_i}{m_i}$, so actually what we were doing now is making sense! Because we are setting $\beta$ in a sense that on average we would get a value akin to $\frac{d_i}{m_i}$, or in the case that $m_i = 0$ we would flip a coin and get a 2, so that way we are handling that case too. So on average we would get a good approximation of the number of components! That was very smart of the authors! I like this man :) Note that in each case $\beta \leq 2$.

So now computing the variance gives us:
$$\text{var}(\beta_i) \leq E(\beta_i^2) \leq E(2\beta_i) \leq \frac{2}{n} \sum_{s \in S} \frac{d_{u_i}}{m_{u_i}} \leq \frac{2}{n} 2c = \frac{4c}{n}$$

And for variance of $\hat{c}$:
$$\text{var } \hat{c} = \text{var}\left(\frac{n}{2r}\sum_{i}\beta_i\right) = \frac{n^2}{4r^2} \cdot r \cdot \text{var } \beta_i \leq \frac{nc}{r} \quad (2)$$

And the mean of $\hat{c}$ is $E(\hat{c}) = \frac{n}{2r} \sum_r E(\beta_r) \leq \frac{n}{2r} \frac{2cr}{n} \leq c$.

So the mean is less than $c$ which is kind of what we wanted.

So as I have said earlier, in our algorithm only when our degree was more than $d^*$ or the set of vertices visited was more than $W = \frac{\varepsilon n}{4}$ we aborted the algorithm. So if $\varepsilon$ is small enough, we have $\frac{1}{\varepsilon^2} \gg n$, so with very high probability we draw the vertices in $S$, so we count at least $c - \frac{n \varepsilon}{4} - \frac{n \varepsilon}{4}$. Why? Because the probability that we draw an extreme case vertex is $\varepsilon/2$ at most, so with very high probability, if we try to draw $O(\frac{1}{\varepsilon^2})$ we mostly draw the good vertices so the mean would be $c \geq E(\hat{c}) \geq c - \frac{n \varepsilon}{2}$ (2).

The fifth thing that I have learned is that Chebyshev is a very good friend of ours!:

**Chebyshev's Inequality:** For any random variable $X$ with finite mean $\mu$ and variance $\sigma^2$, and for any $k > 0$:

$$\Pr[|X - \mu| \geq k] \leq \frac{\sigma^2}{k^2}$$

Alternative form with $k = t\sigma$:
$$\Pr[|X - \mu| \geq t\sigma] \leq \frac{1}{t^2}$$

One-sided version:
$$\Pr[X - \mu \geq k] \leq \frac{\sigma^2}{\sigma^2 + k^2}$$

In terms of standard deviations:
$$\Pr[|X - \mu| \geq k\sigma] \leq \frac{1}{k^2}$$

So now we have:
$$\Pr\left[ |\hat{c} - E[\hat{c}]| > \varepsilon n/2 \right] < \frac{\text{var } \hat{c}}{(\varepsilon n/2)^2} \leq \frac{4c}{\varepsilon^2 rn} \quad (3)$$

Choosing $r = O(1/\varepsilon^2)$ ensures that, with constant probability arbitrarily close to $1$, our estimate $\hat{c}$ of the number of connected components deviates from the actual value by at most $\varepsilon n$.

See it? It is very interesting we ruled out some extreme vertices and started to count the good ones so now with a very high probability we get a good approximation of the number of connected components and that's cool.

So now let's compute the complexity of it.

Notice that in each iteration BFS meets at most $2^k d_i$ edges, assuming that we see $2^{k-1}d_i$ previously seen edges again, so what would be the expected number of meeting new edges be?

Note that it is equal to $E(\text{edges-met}) = \frac{1}{2}d_i + \frac{1}{4}2d_i + \ldots + \frac{1}{2^{k+1}}2^kd_i$.

We have to notice that a desired component has at most $$d^*W$$ edges inside it, so hence at most we do this $$k = \log(d^*W)$$ times. Hence, $$E(\text{edges-met}) = O(d_i \cdot d^*W) = O({\frac{d}{\varepsilon^2}})$$.

Hence we run the algorithm for $O(r)$ edges and each time in each iteration we do this $O({\frac{d}{\varepsilon^2}})$ times, $$O(r) \cdot \frac{1}{n} \sum_{u \in V} d_u \log(W d^*) = O(dr \log(W d^*)) = O\left(d\varepsilon^{-2} \log \frac{d}{\varepsilon}\right)$$.

So we have the following theorem proved:

**Theorem 2** Let $c$ be the number of components in a graph with $n$ vertices. Then Algorithm approx-number-connected-components runs in time $O\left(d\varepsilon^{-2} \log \frac{d}{\varepsilon}\right)$
 and with probability at least $3/4$ outputs $\hat{c}$ such that $$|c - \hat{c}| \leq \varepsilon n$$. Remember that $3/4$ here is an arbitrary constant. In fact we can get the probability arbitrarily close to $1$ with the right $$\varepsilon$$.

So here comes the main algorithm: they start with an ingenious observation:

And let me explain:

Suppose that we have the subgraph, where we only keep edges that have weight $1$. In this way we have some connected components for which we could take the minimum spanning tree of each and then we have a forest. Notice that every other minimum spanning tree must have these edges too, because we have picked the edges in a local optimum way that the global optimum won't deviate from it! So for the minimum spanning tree to be complete we must connect these edges to one another, hence here comes our need to approximate the number of components:

We have the following theorem:

**Claim 5** For integer $w \geq 2$,
$$M(G) = n - w + \sum_{i=1}^{w-1} c(i).$$

**Proof:** Let $\alpha_i$ be the number of edges of weight $i$ in an MST of $G$. (Note that $\alpha_i$ is independent of which MST we choose.) Observe that for all $0 \leq \ell \leq w - 1$, $\sum_{i>\ell} \alpha_i = c(\ell) - 1$, therefore

$$\begin{align}
M(G) &= \sum_{i=1}^{w} i\alpha_i \\
&= \sum_{\ell=0}^{w-1} \sum_{i=\ell+1}^{w} \alpha_i \\
&= -w + \sum_{\ell=0}^{w-1} c(\ell) \\
&= n - w + \sum_{i=1}^{w-1} c(i).
\end{align}$$

So here the magic has already happened! We have an algorithm that can approximate the number of connected components, and we have a formulation that relates the number of connected components to the weight of minimum spanning tree, so we would run our approximation separately to approximate the minimum spanning tree weight.

**Algorithm: approx-MST-weight$(G, \varepsilon)$**

1. **For** $i = 1, \ldots, w - 1$:
   - $\hat{c}(i) = $ approx-number-connected-components$(G(i), \varepsilon, 4w/\varepsilon, d^*)$
2. **Output** $\hat{v} = n - w + \sum_{i=1}^{w-1} \hat{c}(i)$

Our algorithm approximates the value of the MST by estimating each of the $c(\ell)$'s. The algorithm is given in Figure 2. Note that we do not set $W = 4/\varepsilon$ in the call to the connected-components algorithm. For the same reason (to be explained below) we need a different estimate of the degree $$d^*$$. We use Lemma 4 just once to compute, in $$O(dw/\varepsilon)$$ time, an estimate $$d^* = O(dw/\varepsilon)$$ such that at most $$\varepsilon n/(4w)$$ vertices have degree higher than $$d^*$$.

In the following, we assume that $w/n < 1/2$, since otherwise we might as well compute the MST explicitly, which can be done in $O(dn)$ time with high probability.

**Theorem 6** Let $w/n < 1/2$. Let $v$ be the weight of the MST of $G$. Algorithm approx-mst-weight runs in time $O\left(dw\varepsilon^{-2} \log \frac{dw}{\varepsilon}\right)$ and outputs a value $\hat{v}$ that, with probability at least $3/4$, differs from $v$ by at most $\varepsilon v$.

**Proof:** Let $c = \sum_{i=1}^{w-1} c(i)$. Repeating the previous analysis, we find that (1, 2) become:

$$c(i) - \frac{\varepsilon n}{2w} \leq E[\hat{c}(i)] \leq c(i) \quad \text{and} \quad \text{var } \hat{c}(i) \leq \frac{nc(i)}{r}.$$

By summing over $i$, it follows that $c - \varepsilon n/2 \leq E[\hat{c}] \leq c$ (that's why we set $d^* = \frac{\varepsilon n}{4w}$) and $\text{var } \hat{c} \leq nc/r$, where $\hat{c} = \sum_{i=1}^{w-1} \hat{c}(i)$. Choosing $r\varepsilon^2$ large enough, by Chebyshev we have (notice that we have the term $(n - w - c)$ in the inequality because it equals the weight $v$):

$$\Pr\left[ |\hat{c} - E[\hat{c}]| > \frac{(n - w + c)\varepsilon}{3} \right] < \frac{9nc}{r\varepsilon^2(n - w + c)^2},$$

which is arbitrarily small. It follows that, with high probability, the error on the estimate satisfies ($\frac{\varepsilon n}{2}$ is there to account for the deviation of the mean of $E(\hat{c})$):

$$|v - \hat{v}| = |c - \hat{c}| \leq \frac{\varepsilon n}{2} + \frac{\varepsilon(n - w + c)}{3} \leq \varepsilon v.$$

Since the expected running time of each call to approx-number-connected-components is $O(dr \log(W d^*))$, the total expected running time is $O\left(dw\varepsilon^{-2} \log \frac{dw}{\varepsilon}\right)$.


And here comes another nice technique that they have used, namely:

It could be a good principle: instead of doing things at once, make cumulative good approximation in several phases. Now we see an example.

Now we fine tune the algorithm instead of doing it all at once: we first run $O(1/\varepsilon)$ times.

By Chebyshev and (1, 2):
$$\Pr\left[ |\hat{c} - E[\hat{c}]| > \frac{E[\hat{c}] + \varepsilon n}{2} \right] < \frac{4nc}{r(c + \varepsilon n/2)^2} \leq \frac{4n}{r(c + \varepsilon n/2)}$$

which is arbitrarily small for $r\varepsilon$ large enough. Next, we use this approximation $\hat{c}$ to "improve" the value of $r$. We set $r = A/\varepsilon + A\hat{c}/(\varepsilon^2 n)$ for some large enough constant $A$ and we run the algorithm again, with the effect of producing a second estimate $c^*$. By (2, 3):

$$\begin{align}
\Pr[ |c^* - E[c^*]| > \varepsilon n/2 ] &< \frac{4c}{\varepsilon^2 rn} \\
&\leq \frac{8c}{A\varepsilon n + AE[\hat{c}]} \\
&\leq \frac{8}{A}
\end{align}$$

and so, with overwhelming probability, our second estimate $c^*$ of the number of connected components deviates from $c$ by at most $\varepsilon n$ (they designed $r$ in such a way that we would have $A\varepsilon n + AE[\hat{c}]$. We have to remember that this procedure is valid only when $c$ is small, because if $c$ is not small the $E(\hat{c})$ might deviate from its supposed lower bound which was $c-\frac{n \varepsilon}{2}$).

So we have the following theorem proved in this way:

**Theorem 2-modified** Let $c$ be the number of components in a graph with $n$ vertices. Then Algorithm approx-number-connected-components runs in time $O\left(\left(\varepsilon + \frac{c}{n}\right)d\varepsilon^{-2} \log \frac{d}{\varepsilon}\right)$ 
and with probability at least $3/4$ outputs $$\hat{c}$$ such that $$|c - \hat{c}| \leq \varepsilon n$$. Remember that $3/4$ here is an arbitrary constant. In fact we can get the probability arbitrarily close to $1$ with the right $\varepsilon$.

## Approximating Nonintegral Weights

Here comes another interesting technique: namely, suppose that you can compute the algorithm for some sort of inputs, then turn any other input to the desired input such that you can have the result back with an error of at most like something $O(\varepsilon)$ or something along those lines...

Suppose the weights of $G$ are all in the range $[1, w]$, but are not necessarily integral. To extend the algorithm to this case, one can multiply all the weights by $1/\varepsilon$ and round each weight to the nearest integer. Then one can run the above algorithm with error parameter $\varepsilon/2$ and with a new range of weights $[1, \lceil w/\varepsilon \rceil]$ to get a value $v'$. Finally, output $\varepsilon v'$. The relative error introduced by the rounding is at most $\varepsilon/2$ per edge in the MST, and hence $\varepsilon/2$ for the whole MST, which gives a total relative error of at most $\varepsilon$. The runtime of the above algorithm is $O\left(dw\varepsilon^{-3} \log \frac{w}{\varepsilon}\right)$.

Now here comes the second portion of the paper, namely computing the lower bound of any algorithm approximating the weight of minimum spanning tree. It was harder for me to understand than the previous portion, but nonetheless we give it a go...

It uses the classic Yao's minimax principle, and it uses a nice technique to showcase the lower bound.

Here comes another of my observations: IN ORDER TO SHOW THE LOWER BOUND, MAKE SOME ADVERSARIALLY CLOSE DISTRIBUTIONS, AND SOMEHOW HAVE THEM AFFECTING THE INPUT THAT THE ALGORITHM TAKES.

So now I will explain:

[Yao's Minimax](https://faculty.cc.gatech.edu/~ssingla7/courses/Spring22/lec8.pdf) Lemma is a very simple, yet powerful tool to prove impossibility results regarding worst-case performance of randomized algorithms, which are not necessarily online. We state it for algorithms that always do something correct but the profit or cost may vary. Such algorithms are called **Las Vegas algorithms**. We first state it for minimization problems because this is the usual way.

We assume that we have a class of deterministic algorithms $\mathcal{A}$ and a class of instances $\mathcal{X}$. In order to avoid technicalities, assume that both classes are finite. Algorithm $a \in \mathcal{A}$ on instance $x \in \mathcal{X}$ incurs cost $c(a, x) \in \mathbb{R}$. A randomized algorithm is simply a probability distribution over the set of deterministic algorithms $\mathcal{A}$. So, let $A$ be a randomized algorithm (which is now a random variable), then $A$'s worst-case cost is $\max_{x \in \mathcal{X}} \mathbb{E}[c(A, x)]$.

**Theorem (Yao's Minimax Lemma)** Let $A$ be any random variable with values in $\mathcal{A}$ and let $X$ be any random variable with values in $\mathcal{X}$. Then:
$$\max_{x \in \mathcal{X}} \mathbb{E}[c(A, x)] \geq \min_{a \in \mathcal{A}} \mathbb{E}[c(a, X)].$$

Before proving the theorem, let us interpret what it means. The left-hand side of the inequality is what we will try to lower-bound: It is the worst-case performance of randomized algorithm $A$. The right-hand side will be easier to talk about, because algorithms are deterministic. This is a sort of average-case performance of the best deterministic algorithm in our class. The distribution over instances is arbitrary.

We start with this lemma, and start by examining another problem:

For any $0 < q \leq 1/2$ and $s = 0, 1$, let $D^s_q$ denote the distribution induced by setting a $0/1$ random variable to $1$ with probability $q_s = q(1 + (-1)^s\varepsilon)$. We define a distribution $D$ on $n$-bit strings as follows:

1. Pick $s = 1$ with probability $1/2$ (and $0$ else);
2. Then draw a random string from $\{0, 1\}^n$ (by choosing each $b_i$ from $D^s_q$ independently).

Consider a probabilistic algorithm that, given access to such a random bit string, outputs an estimate on the value of $s$. How well can it do? Notice that we are devising two arbitrarily close different distributions!

**Lemma** Any probabilistic algorithm that can guess the value of $s$ with a probability of error below $1/4$ requires $\Omega(\varepsilon^{-2}/q)$ bit lookups on average.

**Proof:** By Yao's minimax principle, we may assume that the algorithm is deterministic and that the input is distributed according to $D$. It is intuitively obvious that any algorithm might as well scan $b_1 b_2 \cdots$ until it decides it has seen enough to produce an estimate of $s$ (just like our algorithm where we sample $O(r)$ samples for example to estimate the connected components). In other words, there is no need to be adaptive in the choice of bit indices to probe (but the running time itself can be adaptive and by probing we mean seeing parts of the input or feeding different parts of our input to our algorithm). To see why is easy. An algorithm can be modeled as a binary tree with a bit index at each node and a $0/1$ label at each edge (I guess this part is intuitive enough, I will try to draw a picture of it somehow). An adaptive algorithm may have an arbitrary set of bit indices at the nodes, although we can assume that the same index does not appear twice along any path. Each leaf is naturally associated with a probability, which is that of a random input from $D$ following the path to that leaf. The performance of the algorithm is entirely determined by these probabilities and the corresponding estimates of s. Because of the independence of the random $$b_is$$, we can relabel the tree so that each path is a prefix of the same sequence of bit probes$$ b_1 b_2 \cdots$$. This oblivious algorithm has the same performance as the adaptive one. What it means is that suppose you have an arbitrary deterministic algorithm that takes inputs from different indices for example $$b_1, b_2, b_7, b_9, \ldots b_{20}$$ just like a decision tree, and goes from the root to leaf based on the possibility, then we can devise the similar deterministic algorithm, which really does the same procedure with same probability hence their expected cost values are all the same, hence we can assume that we are just reading the first $n$ inputs namely $$0$$ and $$1$$ for example.

We can go one step further and assume that the running time is the same for all inputs. Let $t^*$ be the expected number of probes, and let $$0 < \alpha < 1$$ be a small constant. With probability at most $$\alpha$$, a random input takes time $$\geq t \stackrel{\text{def}}{=} t^*/\alpha$$ because by Markov inequality we have:

$P(X \geq a) \leq \frac{E[X]}{a}$

Substituting the given variables, we have:
$P(\text{probes} \geq t) \leq \frac{t^*}{t}$

Now, substitute the definition of $$t = t^*/\alpha:
P(\text{probes} \geq t) \leq \frac{t^*}{t^*/\alpha} \leq \alpha$$

Suppose that the prefix of bits examined by the algorithm is $b_1 \cdots b_u$. If $u < t$, simply go on probing $b_{u+1} \cdots b_t$ without changing the outcome. If $u > t$, then stop at $b_t$ and output $s = 1$. Thus, by adding $\alpha$ to the probability of error, we can assume that the algorithm consists of looking up $b_1 \cdots b_t$ regardless of the input string because $P(\text{err}_{\text{new}}) \leq (1-\alpha)P(\text{err}) +\alpha \leq P(\text{err}) + \alpha$.

Denote $$Pr(\text{err}_{\text{new}}) = p_{\text{err}}$$.

Let $p^s(b_1 \cdots b_t)$ be the probability that a random $t$-bit string chosen from $D^s_q$ is equal to $b_1 \cdots b_t$. The probability of error satisfies:
$p_{\text{err}} \geq \frac{1}{2} \sum_{b_1 \cdots b_t} \min_s p^s(b_1 \cdots b_t).$

Why?

We have $$P(0) = P(1) = 1/2$$ and we have $$P_s(x) = P[x|s]$$ hence $$p(x) = 1/2P_0(x) + 1/2P_1(x)$$ . 
Let our algorithm output be denoted by $\hat{s}(x)$.
$$ P_{\text{err}} = P(\hat{s}(x) \neq s) = 
\sum_x P(X =x) P(\hat{s}(x) \neq s | X=x)$$

and 

$$ P(s = i | X=x) =  \frac{\frac{P(x| s=i)}{2}}{P(x)} 
= \frac{1/2P_i(x)}{P(x)}$$.

So when will the error be minimum? When the probability that we have guessed wrong over the inputs gets to the minimum.
Look that we are trying to get a lower bound for the best average case deterministic algorithm, so the lower bound would be that the probability that we have guessed wrong is minimum. 
Therefore we have $$P(\hat{s}(x) \neq s | X=x) = 1 - P(\hat{s} = s |X =x)$$. 
So in order for our deterministic algorithm to have the minimum error it should pick $$\hat{s}$$ that makes the $$P(\hat{s} = s |X =x)$$ maximum, hence:

$$P(\hat{s}(x) \neq s | X=x) = 1 - P(\hat{s} = s |X =x) \geq 1 - \max_i P(s = i | X=x) = \min_i (1 - P(s = i | X=x)) = \\ \newline \frac{1}{2}\min_i P_i(x)/P(x)$$

Then:

$$P_{\text{err}} = P(\hat{s}(x) \neq s) = \sum_x P(X =x) P(\hat{s}(x) \neq s | X=x) 
\geq \frac{1}{2} \sum_x \min_i P_i(x)$$

Hence we have showed it to be true.

Obviously, $p^s(b_1 \cdots b_t)$ depends only on the number of ones in the string, so if $p^s(k)$ denotes the probability that $b_1 + \cdots + b_t = k$, then:
$p_{\text{err}} \geq \frac{1}{2} \sum_{k=0}^{t} \min_s p^s(k). \quad (5)$

By the normal approximation of the binomial distribution:
$p^s(k) \to \frac{1}{\sqrt{2\pi t q_s(1 - q_s)}} e^{-\frac{(k - tq_s)^2}{2tq_s(1-q_s)}},$

Note that we have:

Given $q_s = q(1 + (-1)^s\varepsilon)$, we calculate $q_s(1-q_s)$:

$\begin{align}
q_s(1-q_s) &= q(1 + (-1)^s\varepsilon) \cdot (1 - q(1 + (-1)^s\varepsilon)) \\ \newline
&= q(1 + (-1)^s\varepsilon) \cdot (1 - q - q(-1)^s\varepsilon) \\ \newline
&= q(1 + (-1)^s\varepsilon) \cdot (1 - q + q(-1)^{s+1}\varepsilon) \\ \newline
&= q(1-q)(1 + (-1)^s\varepsilon)(1 + \frac{q(-1)^{s+1}\varepsilon}{1-q}) \\ \newline
&= q(1-q)\left(1 + (-1)^s\varepsilon + \frac{q(-1)^{s+1}\varepsilon}{1-q} + \frac{q(-1)^s(-1)^{s+1}\varepsilon^2}{1-q}\right) \\ \newline
&= q(1-q)\left(1 + (-1)^s\varepsilon - \frac{q(-1)^s\varepsilon}{1-q} - \frac{q\varepsilon^2}{1-q}\right) \\ \newline
&= q(1-q)\left(1 + (-1)^s\varepsilon\left(1 - \frac{q}{1-q}\right) - \frac{q\varepsilon^2}{1-q}\right) \\ \newline
&= q(1-q)\left(1 + (-1)^s\varepsilon\frac{1-2q}{1-q} - \frac{q\varepsilon^2}{1-q}\right) 
\end{align}$

For small $\varepsilon$, ignoring higher-order terms:
$$q_s(1-q_s) \approx q(1-q) = \Theta(q)$$

Based on the said previous inequalities for Gaussian distribution we have:

$$P(|X - \mu| \geq C\sigma) \leq e^{-C^2/2}$$

So with high probability we have:
$|X - \mu| \leq C\sigma$

So $P(x) \geq \frac{e^{-C^2/2}}{\sqrt{2 \pi}\sigma}$.

So with high probability we have that $p^s(k) \geq \Omega(\frac{1}{\sqrt{qt}})$.

This shows that $p^s(k) = \Omega(1/\sqrt{qt})$ over an interval $I_s$ of length $\Omega(\sqrt{qt})$ centered at $tq_s$.

Note 
$$|\mu_0 - \mu_1| = t|q_0 - q_1| = 2tq\varepsilon$$.

So if $qt\varepsilon^2$ is smaller than a suitable constant $$\gamma_0$$, then $$|tq_0 - tq_1|$$ is small enough that $$I_0 \cap I_1$$ is itself an interval of length $$\Omega(\sqrt{qt})$$. 
It is an intuitive result, make sure to derive it yourself, working it out is easy.
So the indistinguishable area is $I_0 \cap I_1$ and its expected value is greater than $\int_{I_0 \cap I_1} p^s(k)dk \geq \Omega(1/\sqrt{qt}) \cdot \Omega(\sqrt{qt}) = \Omega(1)$.

This shows that if the algorithm runs in expected time $\gamma_0\varepsilon^{-2}/q$, for some constant $\gamma_0 > 0$ small enough, then it will fail with probability at least some absolute constant. By setting $\alpha$ small enough, we can make that constant larger than $2\alpha$. This means that, prior to uniformizing the running time, the algorithm must still fail with probability $\alpha$.

Why? Because we can make the means of distribution close to each other so that the area they cover gets bigger, hence the expected value of them being indistinguishable goes to $1$ more and more, hence if $\alpha$ is small enough we have $\alpha \leq P_{\text{err}} - \alpha \leq P_{\text{err-old}}$.

Note that by choosing $\gamma_0$ small enough, we can always assume that $\alpha > 1/4$. Indeed, suppose by contradiction that even for an extremely small $\gamma_1$, there is an algorithm that runs in time at most $\gamma_1\varepsilon^{-2}/q$ and fails with probability $\leq 1/4$. Then run the algorithm many times and take a majority vote. In this way we can bring the failure probability below $\alpha$ for a suitable $\gamma_1 = \gamma_1(\alpha, \gamma_0) < \gamma_0$, and therefore reach a contradiction. This means that an expected time lower than $\varepsilon^{-2}/q$ by a large enough constant factor causes a probability of error at least $1/4$.

So now let's prove the following theorem:

**Theorem** Given a graph with $n$ vertices and average degree $d$, any probabilistic algorithm for approximating the number of connected components with an additive error of $\varepsilon n$ requires $\Omega(d\varepsilon^{-2})$ edge lookups on average. It is assumed that $C/\sqrt{n} < \varepsilon < 1/2$, for some large enough constant $C$.

Consider the graph $G$ consisting of a simple cycle of $n$ vertices $v_1,\ldots,v_n$. Pick $s\in\{0,1\}$ at random and take a random $n$-bit string $b_1\cdots b_n$ with bits drawn independently from $$D^{(s)}_{1/2}$$. Next, remove from G any edge $$(v_i, v_{i+1 \bmod n})$$ if $$b_i=0$$. Because $$\varepsilon > C/\sqrt{n}$$, the standard deviation of the number of components, which is $$\Theta(\sqrt{n})$$, is sufficiently smaller than $$\varepsilon n$$.

So what is happening here with standard deviation and mean?

Let $G$ be the $n$-cycle and let each edge $(v_i, v_{i+1})$ be removed when $b_i = 0$, where:
$b_i \sim \text{i.i.d. Bernoulli}(q_s)$
with:
$q_s = \frac{1}{2}(1 + (-1)^s \varepsilon), \quad s \in \{0,1\}.$

Let:
K be the number of removed edges. Then, the number of connected components is:
$C = K$

Hence we can read off the mean and variance from the binomial:
$K \sim \mathrm{Bin}(n, 1-q_s).$

**Mean.** We have:
$\mathbb{E}[C] = \mathbb{E}[K] + \Pr[K=0]\cdot (1-0) = n(1-q_s) + o(1) = \frac{n}{2}(1 - (-1)^s \varepsilon) + o(1).$

In particular, the two cases differ by:
$\mathbb{E}[C \mid s=1] - \mathbb{E}[C \mid s=0] = n \varepsilon.$

**Standard deviation.** Similarly:
$\operatorname{sd}(C) = \sqrt{\operatorname{Var}(K)} + o(1) = \sqrt{n q_s (1-q_s)} + o(1) = \sqrt{\frac{n}{4}(1-\varepsilon^2)} + o(1) = \Theta(\sqrt{n}).$

Because $\varepsilon^2$ is sufficiently smaller than $1$ and since:
$\varepsilon > \frac{C}{\sqrt{n}},$

the gap in expectations:
$\mathbb{E}[C \mid s=1] - \mathbb{E}[C \mid s=0] = n \varepsilon,$

is much larger than the standard deviation:
$\operatorname{sd}(C) = \Theta(\sqrt{n}).$

So that with overwhelming probability any two graphs derived from $D_{0}^{1/2}$ and $D_{1}^{1/2}$ differ by more than $\frac{\varepsilon n}{2}$ in their numbers of connected components. That means that any probabilistic algorithm that estimates the number of connected components with an additive error of $\frac{\varepsilon n}{2}$ can be used to identify the correct $s$. By Lemma 9, this requires $\Omega(\varepsilon^{-2})$ edge probes into $G$ on average.

For values of $d$ smaller than one, we may simply build a graph of the previous type on a fraction $d$ of the $n$ vertices and leave the others isolated. The same lower bound still holds as long as $d \varepsilon^2 n$ is bigger than a suitable constant, just like the previous case where the difference between mean was greater than standard deviation.

If $d > 1$, then we may simply add $d \pm O(1)$ self-loops to each vertex in order to bring the average degree up to $d$. Each linked list thus consists of two "cycle" pointers and about $d$ "loop" ones. If we place the cycle pointers at random among the loop ones, then it takes $\Omega(d)$ probes on average to hit a cycle pointer. If we single out the probes involving cycle pointers, it is not hard to argue that the probes involving cycle pointers are, alone, sufficient to solve the connected components problem on the graph deprived of its loops: one expects at most $O(T / d)$ such probes and therefore $T = \Omega(d \varepsilon^{-2})$.

Why? It is also a good technique, look at it: we take the simple cycle and add self loops, so we have a case of graph with average degree $d$. So now, look that we have degree $d$ for each vertex and notice that for each vertex and its adjacency list only two pointers to another vertex determine the number of connected components, so the algorithm should work in this way: every $d$ probing gives us a pointer that determines the number of connected components, so then by a total of $O(T/d)$ times on average we can see the pointers that determine the number of connected components. Hence after that we can run the previous case 1 algorithm, hence $T = \Omega(d \varepsilon^{-2})$ are needed.