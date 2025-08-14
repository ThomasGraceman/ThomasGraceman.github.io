
So, assume that we have a graph $G = (V, E)$. By $G_p$ for some $p \in (0,1)$ we mean a subgraph such that the probability of each edge appearing in that subgraph is independent with probability $p$. 

Now that we have the definition set, the main motive of [Shinkar's paper](https://arxiv.org/pdf/1612.04319) "On Coloring Random Subgraphs of a Fixed Graph" is to study the $\chi(G_{1/2})$ the coloring number of the subgraph that we randomly get by removing each edge with probability $1/2$. So the study of this graph coloring number is really motivated by the following question from [Bukh](https://arxiv.org/pdf/2312.08340):

> **Is there a constant $c > 0$ such that** 
> $$E(\chi(G_{1/2})) > c \cdot \frac{\chi(G)}{\log \chi(G)}$$
> **for all graphs $G$?**

In Shinkar's paper, Theorem 1.6 goes as follows:

**Theorem 1.6.** Let $G = (V, E)$ be a graph with $\alpha(G) \le C \cdot \frac{n}{k}$ for some $C > 1$. Then for all $d \le \frac{k}{16 C \log(k)}$ it holds that 

$$\Pr\big[ \chi(G_p) \le d \big] \le \Pr\big[ \alpha(G_p) > \frac{n}{d} \big] \le 2^{-\frac{pkn}{8 C d^2}}$$

In particular, for all $p \ge \frac{1}{k}$ it holds that 

$$\mathbb{E} \big[ \chi(G_p) \big] \ge \frac{p k}{32 C \log(p k)}$$

Later at the end of the paper, he asks the following question:

<div class="problem-card">
<div class="problem-title">Question 6.2</div>
Is it true that every graph $G$ contains an induced subgraph $G' \subseteq G$ such that 
$$\chi(G') > c \cdot \chi(G) \quad\text{and}\quad \alpha(G') \le C \,\frac{|V(G')|}{\chi(G')}$$
for some absolute constants $C, c > 0$?
</div>

So if there is any positive answer to Question 6.2, then by Theorem 1.6 Bukh's problem is immediate.

## Related Work

Some related papers worth noting:

- [Mohar and Wu](https://arxiv.org/pdf/1807.06285) proved in their paper "Fractional chromatic number of a random subgraph" that by replacing chromatic number with fractional chromatic number, Bukh's problem holds.
- [Girão et al](https://arxiv.org/pdf/2203.03612) in "Induced subgraphs of induced subgraphs of large chromatic number" show how *not* to construct such an induced subgraph.
- [Bukh's recent paper](https://arxiv.org/pdf/2312.08340) "Colouring random subgraphs" is also worth reading.

---

As I get the time to read papers, I try to share my understanding of the techniques and ways people use to attack problems, for my future self, and you who are currently reading.

## Remarks on Shinkar's Techniques

Most of Shinkar's arguments are probabilistic. He tries to divide the vertices into $d$ distinct sets of vertices, then tries to compute the expectation or probability of how feasible or how probable such a dividing yields to a random coloring.

For example: let $A = \{A_1, \dots, A_d\}$ be such a dividing, and then he defines the **uncut** of such dividing (uncuts represent the sets of edges which have both endpoints in one of the $A_i$'s)  for example, the set of edges that makes our $d$ dividing not a proper coloring.

Let $G_{1/2} = (V, E_{1/2})$ be a random subgraph of $G$, and let $S = E \setminus E_{1/2}$ be the random subset of edges of $G$ that are **not** in $G_{1/2}$. We have

$$\Pr\big[ \chi(G_{1/2}) \le d \big] = \Pr\big[ \exists A \in \mathcal{P}_d : \operatorname{uncut}(A) \subseteq S \big]$$

Let $U$ be the **monotone closure** of $\{\operatorname{uncut}(A) : A \in \mathcal{P}_d\}$, defined as

$$U = \{ \operatorname{uncut}(A) : A \in \mathcal{P}_d \}^{\uparrow} = \{ S \subseteq E : \exists A \in \mathcal{P}_d \text{ such that } \operatorname{uncut}(A) \subseteq S \} \tag{1}$$

This implies that 

$$\Pr\big[ \chi(G_{1/2}) \le d \big] = \Pr[ \exists A : S \supseteq \operatorname{uncut}(A)] = \frac{|U|}{2^{|E|}}$$

Later he goes on to show that this structure satisfies a certain property due to a theorem by Frankl:

$$\Pr\big[ \chi(G_{1/2}) \le d \big] = \Pr\big[ \exists A : S \supseteq \operatorname{uncut}(A) \big] = \frac{|U|}{2^{|E|}} \le \left( \frac{\sqrt{5} - 1}{2} \right)^t$$

where $t$ is an appropriate parameter (e.g., the size of a matching or subset in context).

Then he computes the probability. His usage of defining **martingales** is clever it means a process in which we try to refine the information that we have about a certain process. Then if that certain process reveals the information in a specific manner, we can use it to deduce some probabilistic inequality due to Azuma's inequality → I guess this technique would work very well in some areas and it is worth noting:

**Proposition 3.4.** Let $X_1, \dots, X_k$ be a sequence of random variables adapted to some filtration $(\mathcal{F}_i)$ such that 

$$|X_{i+1} - X_i| \le 1 \quad \text{for all } i = 1, \dots, k-1$$

Then for any $0 < \varepsilon < \frac{1}{2}$ it holds that

$$\Pr\left[ \left| \frac{X_k}{\mathbb{E}[X_k]} - 1 \right| > \varepsilon \right] < O\left(e^{-\Omega\left(\varepsilon^2 \mathbb{E}[X_k]\right)}\right)$$

Using this and letting the refining information-gathering kind of process, we could use that lemma to infer something about the probability inequality of the chromatic number.

Let $V = C_1 \cup \cdots \cup C_k$ be a partition of the vertices of $G$ into $k$ color classes, i.e., each $C_i$ is an independent set in $G$. Define a sequence of random variables $X_0, X_1, \dots, X_k$ by

$$X_i = \mathbb{E}\Big[ \chi(G_{1/2}) \;\big|\; G_{1/2}[C_1 \cup \cdots \cup C_i] \Big]$$

In words, the random variable $X_i$ first exposes the edges induced by $C_1 \cup \cdots \cup C_i$, and then takes the expected chromatic number of the random subgraph $G_{1/2}$ conditioned on these exposed edges. In particular,

$$X_0 = \mathbb{E}[\chi(G_{1/2})], \qquad X_k = \chi(G_{1/2})$$

Moreover, for each $i$,

$$X_{i+1} - X_i \in \{0, 1\}$$

since adding edges from an independent set $C_{i+1}$ can increase the chromatic number by at most 1.

I guess we can use some form of the Doob-Dynkin lemma to prove that $X_k = \chi(G_{1/2})$. If I find the proof, I will share it as a blog post.

<div class="problem-card">
<div class="problem-title">Open Problem 6.2 (compact form)</div>
Find $G' \subseteq G$ induced with 
$$\chi(G') > c\,\chi(G), \qquad \alpha(G') \le C\,\frac{|V(G')|}{\chi(G')}$$
for absolute constants $c,C>0$.
</div>

<style>
.problem-card {
    border: 1px solid #e5e7eb;
    border-left: 6px solid #3b82f6;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    background: #fafafa;
    margin: 1.25rem 0;
}

.problem-title {
    font-weight: 700;
    margin-bottom: 0.5rem;
}
</style>