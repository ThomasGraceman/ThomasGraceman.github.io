# Separations in Proof Complexity and TFNP - part 1

So here we are reviewing a paper by Mika Göös. The main subject of study of this paper is finding distinction and separation between different proof systems, namely Resolution proofs and Sherali–Adams (SA) proofs (algebraic type proof systems), and its effect on TFNP problems, total search problems that are NP but we know that a solution for them exists and that we can verify the solution in an efficient manner. i try to cover in the papers manner in parts because it is a long paper, and a bit dense to read too, so hopefully whenever i find enough time again i will come back into it to cover more. Namely, the computational model works as follows: suppose that we have a black box, an oracle that we can make $q$ queries to, and it gives an answer back based on the query instantly. If we had a deterministic algorithm that based on input could verify us the answer, for let's say in $\text{poly}(\log(n))$, then we can basically simulate this algorithm based on a decision tree with depth $\text{poly}(\log(n))$ where leaves are different portions of input that we requested access to.

A **total query search problem** is a sequence of relations $R_n \subseteq \{0, 1\}^n \times O_n$, one for each size $n \in \mathbb{N}$, such that for all inputs $x \in \{0, 1\}^n$ there is an output $o \in O_n$ such that $(x, o) \in R_n$. Here $O_n$ is a finite set of outputs and we say that $o$ is a solution to instance $x$, when $(x, o) \in R_n$.

We think of an instance $x \in \{0, 1\}^n$ as a very long bitstring that can only be accessed through queries to individual bits. In this context, an **efficient algorithm** is a deterministic algorithm that, for any $x \in \{0, 1\}^n$, finds a solution $o$ to $x$ by performing a small number of queries to $x$, namely at most $\text{poly}(\log n)$ queries. Thus, efficient algorithms correspond to decision trees (with leaves labelled by elements of $O_n$) of depth at most $\text{poly}(\log n)$. Note that this model is non-uniform: the problem admits an efficient algorithm, if for each $n \in \mathbb{N}$, there exists a shallow decision tree solving $R_n$.

The notion of total search problems as defined above does not quite correspond to TFNP yet, because it is missing the requirement for efficient verification of solutions. We enforce this in the following natural way. A total search problem $$R = (R_n)_n$$ is in $$\mathsf{TFNP_{dt}}$$
if for each $$o \in O_n$$ there is a decision tree $$T_o$$ 
with depth $$\text{poly}(\log n)$$
such that for every $$x \in \{0, 1\}^n$, $T_o(x) = 1$$ 
if and only if $$(x, o) \in R_n$$.

Let $\mathcal{F}_n = \{ f : \{0, 1\}^n \to \{0, 1\}^n \}$ be the class of all circuits $f$ mapping $n$ bits into $n$ bits. We give a definition of a search problem for the family $\mathcal{F}_n$. In the white-box model, an algorithm is required to solve the search problem $S$ while given an explicit representation of the function $f$ (as a circuit). The white-box complexity of $S$ is the running time (as opposed to number of queries) needed (measured as a function of the size of the representation) to solve a search problem in the worst case. In the white-box setting, we are mostly interested in solvers that run in polynomial-time in the size of the function.

**Definition (White-box complexity).** The white-box complexity of $S$, denoted by $\textrm{wbc}(S)$, 
is bounded by a function $T(\cdot)$ if there exists an algorithm $A$ that for sufficiently large $n$,
 given $f \in \mathcal{F}_n$ (as a circuit) runs in time $T(|f|)$, 
 and outputs $x_1, \ldots, x_q$ such that $(x_1, \ldots, x_q, f(x_1), \ldots, f(x_q)) \in S$.

Using the black box model we can make our life easier and theorems and separations that we prove in the black box model could be transported into other more interesting models of computation, so black box models are very useful.

So the main contribution of this paper comes from the observation that we can relate black box TFNP efficient problems to proof complexity.

Namely at the start of the paper they note that:

The width of a CNF formula is: the maximum number of literals in any single clause. Formally, if $F = \bigwedge_{i=1}^m C_i$ and each clause $C_i = (\ell_{i,1} \vee \ell_{i,2} \vee \cdots \vee \ell_{i,w_i})$, then 

$$\text{width}(F) = \max_i w_i.$$

There is a correspondence between total query search problems and CNF contradictions. In one direction, a CNF contradiction $F := C_1 \wedge \cdots \wedge C_m$ over the variables $x = (x_1, \ldots, x_n)$ naturally gives rise to a corresponding total search problem $S(F)$: given an assignment $x \in \{0, 1\}^n$, find an unsatisfied clause of $F$. Formally, we define $S(F) \subseteq \{0, 1\}^n \times [m]$ by $(x, i) \in S(F)$ if and only if $C_i(x) = 0$. Thus, a sequence of unsatisfiable CNF formulas $\mathcal{F} = (F_n)$, where $F_n$ has $n$ variables, defines the total search problem $S(\mathcal{F}) = (S(F_n))$. Note that $S(\mathcal{F}) \in \textrm{TFNP}^{\textrm{dt}}$ if $F_n$ has width $\textrm{poly}(\log n)$.

In the other direction, a problem $\mathcal{R} = (R_n)$ in $\textrm{TFNP}^{\textrm{dt}}$ can be written equivalently as $S(\mathcal{F})$ for some sequence of CNF contradictions $$\mathcal{F} = (F_n)$$. 
Specifically, for $$R_n \subseteq \{0, 1\}^n \times \mathcal{O}_n$$ we define the formula 
$$F_n := \bigwedge_{o \in \mathcal{O}_n} \neg T_o(x)$$, 
where we note that $$T_o(x)$$ can naturally be written as a DNF formula of width at most $$\textrm{poly}(\log n)$$ (with one term per accepting leaf of $$T_o$$),
 and thus $$\neg T_o(x)$$ can be written as a CNF formula of the same width.

To see this more explicitly:

- Look at the path from the root to $\ell$.
- Suppose it queries variables $x_{i_1}, x_{i_2}, \ldots, x_{i_k}$, with outcomes $b_1, b_2, \ldots, b_k \in \{0,1\}$.
- This path corresponds to the term

$$(x_{i_1} = b_1) \wedge (x_{i_2} = b_2) \wedge \cdots \wedge (x_{i_k} = b_k),$$

i.e., a conjunction of literals.

Then:

$$T_o(x) = \bigvee_{\ell \text{ accepting leaf}} \;\bigwedge_{(i,b)\in \text{path}(\ell)} \ell_{i,b}.$$

So here we define some instances of TFNP problems, they are the main interests of the authors of the paper:

**PPP: Pigeon ($\text{Pigeon}_n$).** This problem features $n$ pigeons, denoted by $[n]$, and as input we are given, for each pigeon $u \in [n]$ a hole $s_u \in [n - 1]$. The goal is to output

1. $u, v \in [n]$, if $u \neq v$ and $s_u = s_v$. (pigeon collision)

**PPADS: Sink-of-Line ($\text{SoL}_n$).** This problem is defined on a set of $n$ nodes, denoted by $[n]$, where the node $1$ is "distinguished". For input, we are given a successor $s_u \in [n]$ for each node $u \in [n]$ and a predecessor $p_u \in [n]$ for each node $u \neq 1$. Given this list of successor/predecessor pointers we create a directed graph $G$ where we add an edge $(u, v)$ if and only if $s_u = v$ and $p_v = u$. We say $u$ is a *proper sink* if it has in-degree $1$ and out-degree $0$, and it is a *proper source* if it has in-degree $0$ and out-degree $1$. The goal of the search problem is to output any of the following

1. $1$, if $1$ is not a proper source node in $G$, or (no distinguished source)
2. $i \neq 1$, if $i$ is a proper sink node in $G$. (proper sink)

**PPAD: End-of-Line ($\text{EoL}_n$).** Same as $\text{SoL}$, except we add the following feasible solution.

3. $i \neq 1$, if $i$ is a proper source node in $G$. (proper source)

So now it makes sense for us to talk about reductions from different search problems to another search problems, because just above we have defined several interesting instances of search problems which are total based on principles but maybe NP in general.

So we try to define a reduction for them:

**Definition.** Let $R \subseteq \{0, 1\}^n \times \mathcal{O}$ and $S \subseteq \{0, 1\}^m \times \mathcal{O}'$ be total search problems. An *$S$-formulation of $R$* is a decision-tree reduction $(f_i, g_o)_{i \in [m], o \in \mathcal{O}'}$ from $R$ to $S$. Formally, for each $i \in [m]$ and $o \in \mathcal{O}'$ there are functions $f_i : \{0, 1\}^n \to \{0, 1\}$ and $g_o : \{0, 1\}^n \to \mathcal{O}$ such that

$$(x, g_o(x)) \in R \Longleftarrow (f(x), o) \in S$$

where $f(x) \in \{0, 1\}^m$ is the string whose $i$-th bit is $f_i(x)$. The *depth* of the reduction is

$$d := \max \left\{D(f_i) : i \in [m]\right\} \cup \left\{D(g_o) : o \in \mathcal{O}'\right\}.$$

So what does this reduction do? Assume we have several decision trees, namely $m$, then based on the input we generate $m$ bits and we run the black box simulation on the shallow decision tree of the class which was reduced to, then when we have the answer, we use another decision tree to convert the answer back, so that is really logical for them to define it that way, in this way we keep everything deterministic and computable. (I love trees.)

So in this post we just focus on the following theorem: this theorem is used to establish some separation results further in the paper regarding different proof systems.

**Theorem.** There are $n$-variate CNF formulas $F$ that can be refuted by constant-width polynomial-size $\textrm{RevRes}$, but such that any $\mathcal{F}$-NS refutation (over any $\mathcal{F}$) of $F$ requires degree $n^{\Omega(1)}$.

**Weak Nullstellensatz.** Let $f_1, \ldots, f_m$ be polynomials. Then exactly one of the following statements holds:

1. The system of equations $f_1 = \cdots = f_m = 0$ has a solution $x \in \mathbb{C}^n$.
2. There exist polynomials $g_1, \ldots, g_m$ such that $\sum_{i=1}^m g_i \cdot f_i = 1$.

We define a generalization of $\mathbb{R}$-NS that we call *$\varepsilon$-approximate Nullstellensatz* ($\varepsilon$-NS) where $\varepsilon \in (0, 1)$ is an error parameter. An $\varepsilon$-NS refutation of a set of real polynomial equations $\{a_i(x) = 0 : i \in [m]\}$ is a set of polynomials $\{p_i(x)\}$ such that

$$\sum_{i \in [m]} p_i(x) \cdot a_i(x) = 1 \pm \varepsilon, \quad \forall x \in \{0, 1\}^n$$

**Definition.** Let $F = C_1 \wedge C_2 \wedge \cdots \wedge C_m$ be an unsatisfiable CNF over $n$ variables. Let $\mathbb{F}$ be any field. Then a **Nullstellensatz refutation** of $F$ is a set of polynomials (generalization: Polynomial Calculus) $g_1, g_2, \ldots, g_m, h_1, h_2, \ldots, h_n$ over $\mathbb{F}$ such that

$$\sum_{i=1}^m g_i \cdot p(C_i) + \sum_{j=1}^n h_j \cdot (x_j^2 - x_j) = 1$$

where $p(C_i)$ denotes its polynomial encoding.

Why is this a refutation?

Suppose that $F$ had a solution! Then plugging in we get $0 = 1$! Contradiction.

So for them in order to prove the theorem they start by proving the following lemma:

**Lemma.** Every $\frac{1}{2}$-NS refutation of $\mathsf{SoPL}_n$ requires degree $n^{\Omega(1)}$.

They start to prove it using a nice problem solving technique here called decision-to-search reduction and then they use the following fact:

**Fact.** Suppose that $p$ is an $n$-variate real polynomial such that $p(x) = \mathsf{OR}_n(x) \pm 1/3$ for all $x \in \{0, 1\}^n$. Then $\deg(p) \geq \Omega(\sqrt{n})$.

**Definition of reduction.** We define a depth-$d$ deterministic reduction as a pair $(f, u)$ such that

1. $f : \{0, 1\}^{n-1} \to \{0, 1\}^{n'}$ is a function that maps an input $x$ of $\mathsf{OR}_{n-1}$ to an input $y = f(x)$ of $\mathsf{SoPL}_n$. Moreover, each output bit $f_i(x) \in \{0, 1\}$ is a depth-$d$ decision tree function of $x$.

2. For any input $x$, the only solutions of $y = f(x)$ are active sinks on the last row $\{n\} \times [n]$. We write $\text{Sol}(y) \subseteq \{n\} \times [n]$ for the set of solutions in $y$. Moreover, $u \in \text{Sol}(y)$ is a solution called the planted solution. (Note that $u$ does not depend on $x$.)

3. If $\mathsf{OR}(x) = 0$, then $y = f(x)$ contains a unique solution, namely $\text{Sol}(y) = \{u\}$.

4. If $\mathsf{OR}(x) = 1$, then $y = f(x)$ contains at least two solutions, 
$|\text{Sol}(y)| \geq 2$.

**Ideal $(y, u)$:** Let $\bar{y}$ be any outcome of $y$ and consider $u$ conditioned on $y = \bar{y}$, namely, $u' := (u \mid y = \bar{y})$. Then $u'$ is uniformly distributed over $\text{Sol}(\bar{y})$; in short, $u' \sim \text{Sol}(\bar{y})$ (we want to have the available solution which is displayed to have equal chance to be displayed).

So we are constructing instances of reduction such that in an ideal setting the solutions have equal chance of showing up in the reduction, and we add in some elements of randomness by using a distribution.

So suppose that we have a distribution over all the pairs $(f,u)$, namely the reductions and their solutions, we can define distribution over them obviously because the set itself is finite; but we want the distribution to be ideal.

**Definition.** Let $n$ be a positive integer, and for simplicity assume $n = 2^\lambda - 1$ for some integer $\lambda \geq 1$. 
Consider the following unsatisfiable CNF formula $$\mathsf{SoPL}_n$$. 
For each $$(i, j) \in \{2, \ldots, n-1\} \times [n]$$ we have two blocks of $$\lambda$$ variables $$s_{i,j} \in \{0, 1\}^\lambda$$,
 $$p_{i,j} \in \{0, 1\}^\lambda$$ encoding the successor and predecessor pointers of the node $$(i, j)$$ in binary, 
where null is encoded by $$0^\lambda$$. For each $$j \in [n]$$,
 we additionally have a block of $$\lambda$$ variables $$s_{1,j} \in \{0, 1\}^\lambda$$ encoding the successor of $$(1, j)$$, 
a block of $$\lambda$$ variables $$p_{n,j} \in \{0, 1\}^\lambda$$ encoding the predecessor of $$(n, j)$$, 
and a single variable $$s_{n,j} \in \{0, 1\}$$ encoding whether or not $$(n, j)$$ is active.

The clauses of $\mathsf{SoPL}_n$ are the following:

- For each $j \in [n]$, $ s_{1,1} \neq j \vee p_{2,j} = 1 $ and $ s_{1,1} \neq 0 $ (active distinguished source)
- For each $j \in [n]$, $\overline{s_{n,j}}$ for each $j \in [n]$, (inactive sink)
- For each $(i, j) \in \{1, \ldots, n-2\} \times [n]$ and each $a, b \in [n]$, $c \in [n] \cup \{0\}$, $a \neq c$, (no proper sinks)

$$ s_{i,j} \neq a \vee p_{i+1,a} \neq j \vee s_{i+1,a} \neq b \vee p_{i+2,b} \neq c $$

as well as $ s_{i,j} \neq a \vee p_{i+1,a} \neq j \vee s_{i+1,a} \neq 0 $. Similarly, for each $a, b \in [n]$,

$$ s_{n-1,a} \neq b \vee p_{n,b} \neq a \vee s_{n,b} = 1 $$

As you can see, the above CNF formulation is unsatisfiable because the last term and inactive sink clauses are in contradiction with each other, so because Nullstellensatz is complete and sound then there exists the Nullstellensatz refutation of the fact. And the non-zero term of the refutation are the last row nodes which are supposed to be active.

**Ideal reduction $\Rightarrow$ Approximation to OR.** Next, we show that if we had an ideal reduction, we could construct an approximating polynomial for $\mathsf{OR}$. We write $i_u$ for the unique $i$ such that the polynomial equation $a_i(y) = 0$ encodes the $\mathsf{SoPL}_n$ constraint that $u$ is not an active sink. Namely, this corresponds to the equation $s_u = 0$, where the bit $s_u \in \{0, 1\}$ of the input $y$ encodes whether or not $u$ is active (see Definition above). If we think of $u \in \{n\} \times [n]$ as encoded by an $O(\log n)$-bit string, we can define an $[n' + O(\log n)]$-variate polynomial

$$q(y, u) := p_{i_u}(y) a_{i_u}(y) = \sum_i \mathbf{1}[i = i_u] p_i(y) a_i(y). \tag{5}$$

Here $p_i$ is the refutation polynomial:

$$\sum_{i \in [m]} p_i(x) \cdot a_i(x) = 1 \pm \varepsilon, \quad \forall x \in \{0, 1\}^n$$

Here, for every $i$, the indicator function $\mathbf{1}[i = i_u] \in \{0, 1\}$ is computed by an $O(\log n)$-degree polynomial. This means $q$ has degree $\deg(q) \leq O(k \log n)$ (keep in mind that it is a loose upper bound).

So we want to prove that the degree of refutation polynomials are $\Omega(1)$, so the constructions so far make sense, we are looking at each refutation polynomial separately.

If $(y, u)$ or $(f(x), u) = (y, u)$ is ideal, then for a specific $x$:

$$\begin{align*}
\mathbb{E}_{}[q(y, u)] &= \mathbb{E}_{\bar{y} \sim y} \mathbb{E}_{u' \sim (u \mid y = \bar{y})}[p_{i_{u'}}(\bar{y}) a_{i_{u'}}(\bar{y})] \\
&= \mathbb{E}_{\bar{y} \sim y} \mathbb{E}_{u' \sim \text{Sol}(\bar{y})}[p_{i_{u'}}(\bar{y}) a_{i_{u'}}(\bar{y})] \\
&= \mathbb{E}_{\bar{y} \sim y} |\text{Sol}(\bar{y})|^{-1} \sum_{u' \in \text{Sol}(\bar{y})} p_{i_{u'}}(\bar{y}) a_{i_{u'}}(\bar{y}) \\
&= \mathbb{E}_{\bar{y} \sim y} |\text{Sol}(\bar{y})|^{-1} \sum_i p_i(\bar{y}) a_i(\bar{y}) \\
&= \mathbb{E}_{\bar{y} \sim y} |\text{Sol}(\bar{y})|^{-1} \cdot (1 \pm \epsilon) \\
&= (1 \pm \epsilon) \cdot \mathbb{E}[|\text{Sol}(y)|^{-1}] \tag{6}
\end{align*}$$

where we used the fact that $\sum_{u' \in \text{Sol}(\bar{y})} p_{i_{u'}}(\bar{y}) a_{i_{u'}}(\bar{y}) = \sum_i p_i(\bar{y}) a_i(\bar{y})$, because $a_i(\bar{y}) = 0$ for all $i \notin \{i_{u'} : u' \in \text{Sol}(\bar{y})\}$, given that $\bar{y}$ satisfies all the $\mathsf{SoPL}_n$ constraints, except the equations requiring that $u'$ not be an active sink, for $u' \in \text{Sol}(\bar{y})$.

Suppose for a moment we had an ideal depth-$d$ randomized reduction $R$. Then, we could construct the polynomial

$$r(x) := \mathbb{E}_{R_x}[q(y, u)] = \sum_{f, u} \Pr_R[(f, u) = (f, u)] \cdot q(f(x), u).$$

We have $\deg(r) \leq O(dk \log n)$. Moreover, 
if $\mathsf{OR}(x) = 0$ then $r(x) = 1 \pm \epsilon$; and if $\mathsf{OR}(x) = 1$ then $r(x) \in [0, (1 + \epsilon)/2]$, (it is basically equal to $(1 \pm \epsilon) \cdot \mathbb{E}[|\text{Sol}(y)|^{-1}]$) 
since $\mathbb{E}[|\text{Sol}(y)|^{-1}] \in [0, 1/2]$. Thus for $\epsilon = 0.01$, 
if we consider $t(x) := 1 - r^2(x)$ we get that $t$ approximates $\mathsf{OR}$ to within error $1/3$. Using Fact 1, 
we deduce that $k \geq \Omega(\sqrt{n}/(d \log n))$. 
So the degree must be more than one proving the lemma, but the thing is that we must be able to construct an ideal distribution which in the paper it seems we cannot do.

So how is the construction?

They try to construct it very cleverly, it's a nice technique.

First they start off deterministically from the input of $x$, at each bit where $x_i$ is $1$ then make a path from that column to the sink, then after the deterministic construction is done, they permute the nodes of each row, then they have something nice.


![Image](/assets/image/reduction.png)

**A locally ideal reduction.** Consider the following depth-$1$ randomized reduction $R$; see Figure 4.

1. Let $$\bar{y} = \bar{y}(x)$$ be the input to $$\mathsf{SoPL}_n$$ that has a directed path running down the first column of nodes, 
starting at distinguished node $$(1, 1)$$ and terminating at the active sink 
$$\bar{u} := (n, 1)$$ (say $$\bar{u}$$ is made active by being assigned $$1$$ as successor). Moreover, 
we activate a path in $$\bar{y}$$ down column $$i \geq 2$$ iff $$x_{i-1} = 1$$. 
Note that $$\bar{y}$$ is a depth-$1$ decision tree function of $$x$$, 
and $$\bar{u}$$ does not depend on $x$ at all.

2. Let $y = y(x)$ be obtained from $\bar{y}$ so that, for each row except the first, $i \in [n] \setminus \{1\}$, randomly permute the nodes $\{i\} \times [n]$ on that row (updating the successor/predecessor pointers). Let $u$ be the sink node that $\bar{u}$ is mapped to.

3. Output $(f, u)$ where $f(x) := y(x)$.

As noted in the paper this reduction satisfies our requirements of SoPL but it is not ideal because we always have an active sink amongst the underlying set of the distribution, so it is not ideal, because it is based towards the existence of the active solution $u$ of our reduction, but in its local sense, for example in the local distribution by assuming $P(x \mid u)$ the rest are uniform because we are constructing them randomly and uniformly.

So that is a good trick, because basically we are simulating an ideal and uniform marginal in this way.

What we would really like instead is that $R_x$ was distributed as the ideal pair $(y, u) \sim I_x$ defined by the following procedure: Sample $(y, u') \sim R_x$; define $u$ such that for every outcome $\bar{y}$, $(u \mid y = \bar{y}) \sim \text{Sol}(\bar{y})$; and output $(y, u)$, (reachable states based on the randomness of the reduction).

Define two functions $\{0, 1\}^{n-1} \to \mathbb{R}$ by

$$\begin{align}
r(x) &:= \mathbb{E}_{R_x}[q(y, u)], \tag{7} \\
r'(x) &:= \mathbb{E}_{I_x}[q(y, u)]. \tag{8}
\end{align}$$

We know that $r$ has low degree as a polynomial,
 $\deg(r) \leq O(k \log n)$, and $r'$ has the ideal output behaviour, 
 $r'(x) = (1 \pm \epsilon) \cdot \mathbb{E}[|\text{Sol}(f(x))|^{-1}]$ by (6). The following claim shows that, in fact, $r = r'$, 
 and hence we can get the best of both worlds.

**Claim.** We have $r(x) = r'(x)$ for all $x \in \{0, 1\}^{n-1}$.

**Proof.** By linearity of expectation, it suffices to show $$\mathbb{E}_{R_x}[m(y, u)] = \mathbb{E}_{I_x}[m(y, u)]$$ 
for any monomial $$m$$ of $$q$$ and every $$x$$. Fix a monomial $$m$$. We claim that $R_x$ and $$I_x$$ 
have the same marginal distribution over the variables read by $$m$$, which would prove the claim. 
We may assume that $$\deg(m) \leq O(k \log n) \leq o(n)$$ because otherwise Lemma 1 is proved. 
Hence there exist two consecutive rows $$i, i + 1 \in [n/3, 2n/3]$$ such that $$m$$ does not read any variables associated with either row.

Starting with a sample $(y, u) \sim R_x$ we can generate a sample from $I_x$ as follows:
 Consider active nodes $A \subseteq \{i\} \times [n]$ and
 $B \subseteq \{i + 1\} \times [n]$ on rows $i$ and $i + 1$ in $y$ and the $|A| = |B| = 1 + |x|$ many directed edges joining them (defined by successor pointers for row $i$ and predecessor pointers for row $i + 1$). 
Reroute these edges by choosing a random bijection $A \to B$, and denote the resulting input by $y'$. Then $(y', u) \sim I_x$. 
This proves our claim about the marginals, since our modification to the input $y$ was done outside the variables read by $m$. $\square$

Since $q$ is a polynomial,

$$q(y,u) = \sum_m c_m \, m(y,u),$$

linearity of expectation gives

$$\mathbb{E}[q] = \sum_m c_m \, \mathbb{E}[m].$$

Therefore, to show

$$\mathbb{E}_{R_x}[q] = \mathbb{E}_{I_x}[q],$$

it is enough to prove that for every monomial $m$,

$$\mathbb{E}_{R_x}[m(y,u)] = \mathbb{E}_{I_x}[m(y,u)].$$

- $r(x) := \mathbb{E}_{R_x}[q(y,u)]$ --- expectation under the real reduction
- $r'(x) := \mathbb{E}_{I_x}[q(y,u)]$ --- expectation under the idealized distribution

$$\deg(m) \le O(k\log n) = o(n).$$

Each monomial only reads variables from few rows of the $\mathsf{SoPL}_n$ instance. Since there are $n$ rows total, by a pigeonhole argument there must exist two consecutive rows

$$i,\; i+1 \in [n/3,\, 2n/3]$$

such that no variable from either row appears in $m$. (So they don't affect the value of the monomial but we must still compute their effect on the underlying distribution.)

And the basis of the proof is a coupling argument:

Choosing a uniformly random bijection $A \to B$, updating the successor pointers in row $i$ and predecessor pointers in row $i+1$ accordingly, leaving everything else unchanged. This random rerouting does not change the marginal distribution of $y$ outside rows $i,i+1$.

But it completely randomizes which sink in the bottom row is reachable from the distinguished node.

As a result, conditioned on the final graph $y'$, the sink $u$ is now uniformly distributed over $\mathrm{Sol}(y')$.

Hence:

$$(y',u) \sim I_x.$$

This proves our claim about the marginals, since our modification to the input $y$ was done outside the variables read by $m$.

---

## References

The references for this blogpost:

- *Separations in Proof Complexity and TFNP* by mika goos et el
- *On the degree of boolean functions as real polynomials* by Noam Nisan and Mario Szegedy
- *this lecture* [here](http://cs.mcgill.ca/~robere/comp598/lectures/lecture13.pdf)