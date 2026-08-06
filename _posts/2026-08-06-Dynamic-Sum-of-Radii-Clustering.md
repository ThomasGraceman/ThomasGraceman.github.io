---
title: "Dynamic Sum-of-Radii Clustering"
date: 2026-08-06
permalink: /posts/dynamic-sum-of-radii-clustering/
description: "Study notes on a dynamic algorithm for the sum-of-radii clustering problem in doubling metrics, built on the navigating-nets scheme."
tags:
  - clustering
  - dynamic algorithms
  - facility location
  - doubling dimension
  - nearest neighbor search
---

So in this second post, following the [previous data structure](/posts/dynamic-approximate-nns/), I am going to review some algorithms that were devised using the scheme of nearest neighbor search.

**Definition (Dynamic Sum-of-Radii Clustering).** They studied the dynamic sum-of-radii clustering problem, defined as follows. The original input consists of a (possibly infinite) set $V$ of potential clients or points, a finite set $F \subseteq V$ of facilities with an opening cost $f_j$ for each facility $j \in F$, and a metric $d$ over $V$.

For the online input, a set $C$ of live clients evolves over time: at each timestep $t$, either a new client arrives and is added to $C$, or a client from $C$ departs and is removed from $C$, a query is made for the approximate cost of an optimal solution (*cost query*), or a query asks for the entire current solution (*solution query*).

For the output, at each timestep the algorithm maintains a set of open facilities, each open facility $j$ being associated to a radius $R_j$, such that every client of $C$ is covered, i.e., belongs to some open ball $B(j, R_j)$, and the goal is to minimize the cost, namely, the sum over open facilities $j$ of $f_j + R_j$.

The dynamic sum-of-radii clustering problem can actually be interpreted as a special case of dynamic set cover.

The doubling dimension of a metric space $(V, d)$ is said to be bounded by $\kappa$ if any ball $B(x, r)$ in $(V, d)$ can be covered by $2^\kappa$ balls of radius $r/2$, as defined in the previous post based on Lee's paper.

The algorithm designed by them answers cost queries in constant time and solution queries in linear time in the size of the solution, up to a factor of $\log(W/f_{\min})$, where $W$ is the diameter of the metric space and $f_{\min}$ is the minimum opening cost of any facility.

**Theorem.** There exists an algorithm for the dynamic sum-of-radii clustering problem, when clients and facilities live in a metric space with doubling dimension $\kappa$, such that at every timestep the solution has cost at most $O(2^{2\kappa})$ times the cost of an optimal solution at that time, and such that the update time is $O(2^{6\kappa} \log(W/f_{\min}))$, where $W$ is the diameter of the space, $n$ is the current number of clients, and $f_{\min}$ is the minimum opening cost. A cost query can be answered in constant time, and a solution query in time $O(s \log(W/f_{\min}))$, where $s$ is the size of the output.

There exists a collection $\Pi$ of pairs $\langle j, r \rangle$ where $j \in F$ and $r$ is a non-negative integer, each with an associated area $A(j, r)$ of $V$, and an abstract tree $T$ over $\Pi$, with the following properties:

1. $T$ has height $O(\log(W/f_{\min}))$ and degree at most $2^{4\kappa}$.
2. The collection $\mathcal{A}$ of areas is a laminar family, its laminar structure is given by $T$, and for each area, $A(j, r) \subseteq B(j, 7 \cdot 5^r)$.
3. For any subset $C$ of $V$, there exists a collection $S$ of areas covering $C$ and whose cost,

$$\sum_{\langle j,r \rangle \in S} \left(f_j + 7 \cdot 5^r\right),$$

is $O(2^{2\kappa})$ times the optimal cost for $C$.

So if you pay close attention, they are really using the scheme and the paradigm used by Lee and his co-author, really by maintaining a tree with nodes as a set of $Z_{r/2}$ (namely, the points that are sufficiently close in the $2^i$ net to the point that is being queried upon). But now the difficulty lies in the fact that we have to keep track of the opening cost, so we have to think of a heuristic there to come up with a good solution.

So the algorithm runs in two phases: one processes the data and finds a solution, and the other maintains the solution by the successive updates that come along the way. They start by discretizing a potential solution to the problem.

**Lemma.** For all $C \subseteq V$, there exists a solution such that every ball $B(j, R)$ has $f_{\min} \leq f_j \leq R \leq 5 \cdot W$, the radius $R$ is an integer power of 5, and the cost is $O(\text{OPT})$.

*Proof.* Consider the unknown optimal solution. If some ball is such that $\max(f_j, R) > W$, then replace the entire solution by a ball centered at the facility of cost $f_{\min}$ and of radius $W$. Else, for each ball $B(j, R)$ of the optimal solution:

- if $f_j > R$ then increase the radius of the ball from $R$ to $f_j$.
- Increase $R$ to the smallest integer power of 5 that is greater than or equal to $R$.

The new solution satisfies the desired constraints, and the cost has increased by a factor of 10 at most, which is not that hard to actually compute.

A *logradius* is an integer $r$ such that $f_{\min} \leq 5^r \leq 5 \cdot W$. Let $\rho_{\min} = \lfloor \log_5 f_{\min} \rfloor$ and $\rho_{\max} = \lceil \log_5 W \rceil$. Then the number of different logradii, $\rho_{\max} - \rho_{\min} + 1$, is $O(\log(W/f_{\min}))$ (they are the relevant scales that had been used in Lee's paper, but the scales are maintained by a power of 5).

We construct a set $\Pi$ of pairs $\langle j, r \rangle$ where $j$ is a facility and $r$ is a logradius. For each logradius $r \in [\rho_{\min}, \rho_{\max}]$:

- let $J'_r = \{j \in F \mid f_j \leq 5^r \}$.
- let $J_r$ be a maximal subset of $J'_r$ such that any two facilities in $J_r$ are at distance greater than $5^{r+1}$.

$$\Pi \gets \bigcup_r \{ \langle j, r \rangle \mid j \in J_r \}.$$

Note that for $r = \rho_{\max}$, the set $J_r$ contains just one facility.

So after we have constructed the coarse leveled information, we are going to construct a tree here:

## Hierarchical decomposition of $\Pi$

Construct an abstract tree $T$ over $\Pi$ as follows (with ties broken arbitrarily):

- the root of $T$ is the unique pair $\langle j, \rho_{\max} \rangle$.
- for all $r < \rho_{\max}$ and $j \in J_r$:
  - let $j'$ be the facility of $J_{r+1}$ closest to $j$
  - $\text{parent}(j, r) \gets \langle j', r + 1 \rangle$

**Lemma (Nesting of balls).** If $\text{parent}(j, r) = \langle j', r + 1 \rangle$, then $B(j, 7 \cdot 5^r) \subseteq B(j', 7 \cdot 5^{r+1})$.

*Proof.* We have $\langle j, r \rangle \in \Pi$, so $j \in J'_r \subseteq J'_{r+1}$. By the Covering property of $\Pi$, the maximum distance from any point in $B(j, 7 \cdot 5^r)$ to $j'$ is $d(j, j') + 7 \cdot 5^r \leq 5^{r+2} + 7 \cdot 5^r \leq 7 \cdot 5^{r+1}$.

**Lemma.** For any point $p$ and radius $r$, the set of pairs

$$\Pi(p, r) = \{ \langle j, r \rangle \in \Pi \mid d(p, j) < 2^\alpha \cdot 5^{r+1} \}$$

has at most $2^{(\alpha+1)\kappa}$ elements, where $\kappa$ is the doubling dimension of the metric space.

*Proof.* By definition of doubling dimension, $B(p, 2^\alpha \cdot 5^{r+1})$ can be covered by a set of at most $(2^\kappa)^{\alpha+1}$ balls of radius $(1/2) \cdot 5^{r+1}$. By the Separating property of $\Pi$, any two pairs $\langle j, r \rangle$ of $\Pi(p, r)$ are at distance greater than $5^{r+1}$ from each other, hence must belong to different balls of the set, and so $\Pi(p, r)$ has cardinality at most $(2^\kappa)^{\alpha+1}$.

**Lemma.** A node $\langle j, r \rangle$ of $T$ has at most $2^{4\kappa}$ children.

*Proof.* Children of $\langle j, r \rangle$ have logradius $r - 1$, so by the Covering property of $\Pi$ their distance to $j$ is at most $5^r$. Thus, they belong to $\Pi(j, r - 1)$ for $\alpha = 3$, and so Lemma 4 applies.

So, now just like the sets $Z$ that have been maintained in the data structure, they now construct a set of related areas.

Recall that a collection $\mathcal{A}$ of sets is laminar if for any two $A, B \in \mathcal{A}$, either $A \cap B = \emptyset$ or $A \subseteq B$ or $B \subseteq A$. We partition $V$ into a laminar family of areas, denoted by $\mathcal{A}$, such that no two same-logradius areas overlap.

**Algorithm: Constructing Laminar Areas**

1. For all $\langle j, r \rangle \in \Pi$: $A(j, r) \gets \emptyset$.
2. For all points $p \in V$:
   a. $r^* \gets \min \{ r \mid \exists \langle j, r \rangle \in \Pi \text{ such that } p \in B(j, 7 \cdot 5^r) \}$.
   b. $\langle j^*, r^* \rangle \gets \arg\min_{\langle j, r^* \rangle} d(p, j)$ among all valid pairs with logradius $r^*$.
   c. Add $p$ to $A(j^*, r^*)$.
   d. For all $\langle j', r' \rangle$ that are ancestors of $\langle j^*, r^* \rangle$ in $T$:
      - Add $p$ to $A(j', r')$.

**Lemma.** For every $\langle j, r \rangle \in \Pi$, $A(j, r) \subseteq B(j, 7 \cdot 5^r)$.

*Proof.* Let $p \in A(j, r)$. Either it has been added directly, in which case it belongs to $B(j, 7 \cdot 5^r)$, or it has been inherited, in which case it also belongs to it by Lemma 3.

**Lemma.** For every subset $C \subseteq V$ of clients there exists $S \subseteq \Pi$ such that $C$ is covered by $\cup \{A(j, r) : \langle j, r \rangle \in S\}$ and

$$\sum_{\langle j,r \rangle \in S} \left(f_j + 7 \cdot 5^r\right) = O(2^{2\kappa} \cdot \text{OPT}).$$

or:

$$\sum_{\langle j,r \rangle \in S^*} \sum_{\substack{\langle j',r \rangle \in \Pi \\ d(j,j') \leq 8 \cdot 5^r}} \left(f_{j'} + 7 \cdot 5^r\right)$$

*Proof.* Let $S^*$ be a solution of cost $O(\text{OPT})$ satisfying the properties of Lemma 2. For each ball $B(j, 5^r)$ of $S^*$, put in $S$ all the pairs $\langle j', r \rangle \in \Pi$ such that $d(j, j') \leq 8 \cdot 5^r$.

We claim that $C$ is covered by $\cup \{A(j', r) : \langle j', r \rangle \in S\}$. Indeed, consider a client $p \in C$ and a ball $B(j, 5^r)$ of $S^*$ containing $p$. By the Covering property of $\Pi$, there exists $\langle j', r \rangle \in \Pi$ with $d(j, j') \leq 5^{r+1}$. Then $d(p, j') \leq 5^{r+1} + 5^r < 7 \cdot 5^r$, and so in the definition of areas covering $p$ we must have $r^* \leq r$. Along the path from $\langle j^*, r^* \rangle$ to the root of $T$, there exists a pair for logradius $r$, $\langle j'', r \rangle$. By definition of areas and by Lemma 6, $p \in A(j'', r) \subseteq B(j'', 7 \cdot 5^r)$, so $d(j, j'') \leq d(j, p) + d(p, j'') \leq 8 \cdot 5^r$, and therefore $\langle j'', r \rangle \in S$ and $p$ is covered.

In terms of costs, since all these areas are associated to pairs within distance $8 \cdot 5^r < 2 \cdot 5^{r+1}$ from $j$, by Lemma 4 for $\alpha = 1$, there are at most $2^{2\kappa}$ of them.

For one optimal ball $B(j, 5^r)$, the proof constructs at most $2^{O(\kappa)}$ nearby pairs. Each pair contributes

$$f_{j'} + 7 \cdot 5^r \leq 8 \cdot 5^r,$$

so the total charge is

$$2^{O(\kappa)} \cdot 5^r.$$

Using the equivalence above,

$$2^{O(\kappa)} \cdot 5^r = O\left(2^{O(\kappa)} (f_j + 5^r)\right),$$

which is exactly a constant-factor multiple of the cost of the original optimal ball. Therefore, summing over all balls in $S^*$,

$$\sum_{\text{optimal balls}} O\left(2^{O(\kappa)} (f_j + 5^r)\right) = O(2^{O(\kappa)} \cdot \text{OPT}).$$

Now, a simple dynamic bottom-up DP approach is used to compute the best possible costs within our coarsened information tree.

Computing the optimal solution to the restricted problem in an offline manner is straightforward, thanks to the laminar structure of the candidate areas. We first compute, for each node $\langle j, r \rangle$ of $T$, the cost $c_{j,r} = f_j + c_2 \cdot 5^r$ of area $A(j, r)$, as well as the number $n_{j,r}$ of clients that are in area $A(j, r)$ but not in any of the areas of children nodes: since areas $A(j', r-1)$ are all disjoint by laminarity, we have

$$n_{j,r} = |C \cap A(j, r)| - \sum_{\langle j',r-1 \rangle : \text{parent}(j', r-1) = j} |C \cap A(j', r-1)|.$$

We then compute the optimal cost $x_{j,r}$ of covering the clients of $C \cap A(j, r)$ using only areas of the subtree of $T$ rooted at $\langle j, r \rangle$, using the following bottom-up recurrence:

For $\langle j, r \rangle \in \Pi$ in bottom-up order in $T$:

$$x_{j,r} = \begin{cases} c_{j,r} & \text{if } n_{j,r} > 0 \\ \min \left( c_{j,r}, \sum_{\{x_{j',r-1} : \langle j, r \rangle = \text{parent}(j', r-1)\}} x_{j',r-1} \right) & \text{otherwise.} \end{cases}$$

The cost of the optimal restricted solution is then $x_{j, \rho_{\max}}$ for the root $\langle j, \rho_{\max} \rangle$ of $T$. Given $c_{j,r}$ and $x_{j,r}$, computing the optimal restricted solution, a collection $S$ of areas, is done recursively:

$$S(j, r) = \begin{cases} \emptyset & \text{if } x_{j,r} = 0 \\ \{A(j, r)\} & \text{if } x_{j,r} = c_{j,r} \\ \bigcup \{S(j', r - 1) : \text{parent}(j', r - 1) = \langle j, r \rangle\} & \text{otherwise.} \end{cases}$$

Thus the algorithm to compute the optimal set $S$ of areas covering $C$ in the restricted problem, given the values of $c_{j,r}$ and $x_{j,r}$, explores a tree $T'$ that, as it is a partial subtree of $T$, also has height at most $O(\log(W/f_{\min}))$ and degree at most $2^{4\kappa}$; moreover its internal nodes are all ancestors of areas added to the solution $S$, so the running time to compute $S$ itself is $O(2^{4\kappa} \log(W/f_{\min}) |S|)$.

The algorithm will maintain two dynamic data structures:

1. a list of the currently existing clients $C \subseteq V$, with, for each client $p$, the $\langle j, r \rangle \in \Pi$ such that $p \in A(j, r)$ and $r$ is minimum; and
2. an annotated dependency tree $T_A$, keeping for each node $v = \langle j, r \rangle$ the following additional information:
   a. its cost $c_v = f_j + 7 \cdot 5^r$,
   b. the number $n_v$ of currently existing clients that belong to $A(j, r)$ but not to any descendant area,
   c. the value $x_v$, which is the minimum cost needed to cover all clients belonging to $A(j, r)$ using only areas $A(j', r')$ for $\langle j', r' \rangle \in \Pi$, and
   d. the value $y_v = \sum_{u \text{ child of } v} x_u$.

When a client $p$ is inserted, we first find $\langle j, r \rangle$ in $T_A$, such that $p \in A(j, r)$ and $r$ is minimum, in a way to be described shortly; we increment $n_v$, and then we traverse the path from $\langle j, r \rangle$ up to the root of $T_A$, similarly updating $x_v$ and $y_{\text{parent}(v)}$.

Thus, it only remains to determine the pair $\langle j^*, r^* \rangle$ with smallest logradius such that $p \in A(j^*, r^*)$. By Lemma 6, $p \in B(j^*, 7 \cdot 5^{r^*})$. Thus we will first find all pairs $\langle j, r \rangle$ such that $p \in B(j, 7 \cdot 5^r)$, based on them determine $r^*$, and then look for $\langle j^*, r^* \rangle$ in that set of balls. Thanks to Lemma 4, the first part can be done using a simple recursive algorithm starting from the root of $T_A$ (see below). The second part simply uses the definition of areas, i.e., it finds the pair $\langle j^*, r^* \rangle$ where $j^*$ has minimum distance to $p$ out of all pairs $\langle j, r^* \rangle$ with $p \in B(j, 7 \cdot 5^{r^*})$.

$$\text{Pairs}(p, j, r) = \begin{cases} \emptyset & \text{if } p \notin B(j, 7 \cdot 5^r) \\ \{\langle j, r \rangle\} \cup \bigcup \{\text{Pairs}(p, j', r - 1) : \text{parent}(j', r - 1) = \langle j, r \rangle\} & \text{otherwise.} \end{cases}$$

Let $r^*$ be minimum such that there exists pairs $\langle j, r^* \rangle$ in the set $\text{Pairs}(p, j_{\text{root}}, \rho_{\max})$. Among all such pairs, output the pair $\langle j^*, r^* \rangle$ minimizing $d(p, j^*)$.

The running time is dominated by the first part, which is $O(2^{4\kappa})$ times the number of pairs $\langle j, r \rangle$ such that $p \in B(j, 7 \cdot 5^r)$. There are $\log(W/f_{\min})$ possible values of $r$. For each $r$, by Lemma 4 there are at most $2^{2\kappa}$ pairs $\langle j, r \rangle \in \Pi$ such that $p \in B(j, c_2 \cdot 5^r)$, and the algorithm has to test the $O(2^{4\kappa})$ children of each of them. Thus the running time to do an insertion is $O(2^{6\kappa} \log(W/f_{\min}))$.

## References

- M. Henzinger, D. Leniowski, and C. Mathieu, *Dynamic Clustering to Minimize the Sum of Radii*. ESA 2017. [arXiv:1707.02577](https://arxiv.org/abs/1707.02577)
