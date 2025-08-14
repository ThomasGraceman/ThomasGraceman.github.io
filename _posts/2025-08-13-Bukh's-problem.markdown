

So, assume that we have a graph G = (V , E) by $$G_{p}$$ for some $$ p \in (0,1) $$ we mean a subgraph such that the 
probibility of each edge appearing in that subgraph is independent with probability p. now that we have the defination set
the main motive of [shinkar]'s paper `On Coloring Random Subgraphs of a Fixed Graph`, is to study the $$ \chi(G_{1/2}) $$ the coloring number
of the subgraph that we randomly get by removing each edge with the probibility of 1/2. 

so the study of this garph coloring number is really motivated by the following question from Bukh's: 

  is there a constant c > 0 such that $$ E(\chi(G_{1/2}) > c.\frac{\chi(G)}{\chi(G_{1/2})} $$ for all Graphs G? 

in shinkar's paper theorem 1.6 goes as follow: 

**Theorem 1.6.**  
Let G = (V, E) be a graph with  
$$\alpha(G) \le C \cdot \frac{n}{k}$$
for some C > 1. Then for all  
$$d \le \frac{k}{16 C \log(k)}$$
it holds that  
$$\Pr\big[ \chi(G_p) \le d \big] \ \le\ \Pr\big[ \alpha(G_p) > \frac{n}{d} \big] \ \le\ 2^{ - \frac{pkn}{8 C d^2} } .$$

In particular, for all $$( p \ge \frac{1}{k} )$$ it holds that  

$$\mathbb{E} \big[ \chi(G_p) \big] \ \ge\ \frac{p k}{ 32 C \log(p k) } .$$

later at the end of the paper he asks the following question:

> **Question 6.2.**  
> Is it true that every graph (G) contains an induced subgraph $$(G' \subseteq G)$$ such that
> $$
> \chi(G') \;>\; c \cdot \chi(G)
> \quad\text{and}\quad
> \alpha(G') \;\le\; C \,\frac{|V(G')|}{\chi(G')}
> $$
> for some absolute constants C, c > 0?



So if there is any posotive answer to the question 6.2 then by theorem 1.6 the bukh's problems is immediate.

some realted papers: 

[Mohar and wu] proved in thier paper `Fractional chromatic number of a random subgraph` that by replacing chromatic number with Fractional chromatic number bukh's problems holds.

[Girão et al] in `Induced subgraphs of induced subgraphs of large chromatic number` how not to construct such an indeced subgraph.

[Bukh]'s recent paper `Colouring random subgraphs` is to be read too.

---

as i get the time to read papers, i try to share my understadning on the technique and ways people use to attack peoblems, for my future self, and you who are currently reading:


some remarks on the techniques that shinkar used on his paper: 

most of shinkar argeumesnts are probabalistic, as he tries to divide the vertices into d distinct set of vertices then tries to compute the expectatation or prabability that 
how feaseable or how probable such a deviding yields to a random coloring for example: 
$$
A = \{ A_1, \dots, A_d \}
$$ are such dividing and then he difines the uncut of such dividing(uncuts represents the sets of edges which has both of its end point in One of Ai's)
for example the set of edges that makes our d divding not a proper coloring, 

$$
\Pr\big[ \chi(G_{1/2}) \le d \big]
\;=\;
\Pr\big[ \exists A \in \mathcal{P}_d : \operatorname{uncut}(A) \subseteq S \big] .
$$

Let 
$$
G_{1/2} = (V, E_{1/2})
$$ 
be a random subgraph of \(G\), and let 
$$
S = E \setminus E_{1/2}
$$ 
be the random subset of edges of \(G\) that are **not** in \(G_{1/2}\). 

We have

$$
\Pr\big[ \chi(G_{1/2}) \le d \big]
= \Pr\big[ \exists A \in \mathcal{P}_d : \operatorname{uncut}(A) \subseteq S \big].
$$

Let \(U\) be the **monotone closure** of 
\(\{ \operatorname{uncut}(A) : A \in \mathcal{P}_d \}\), defined as

\begin{equation}
U = \{ \operatorname{uncut}(A) : A \in \mathcal{P}_d \}^{\uparrow} 
= \{ S \subseteq E : \exists A \in \mathcal{P}_d \text{ such that } \operatorname{uncut}(A) \subseteq S \}.
\tag{1}
\end{equation}

This implies that

$$
\Pr\big[ \chi(H) \le d \big]
= \Pr[ \exists A : S \supseteq \operatorname{uncut}(A)] 
= \frac{|U|}{2^{|E|}} .
$$ later he goes on to show that this structure satasfy a certain thing due to theorem due to Frankl 

We have

$$
\Pr\big[ \chi(H) \le d \big] 
= \Pr\big[ \exists A : S \supseteq \operatorname{uncut}(A) \big] 
= \frac{|U|}{2^{|E|}} 
\le \left( \frac{\sqrt{5} - 1}{2} \right)^t ,
$$

where \(t\) is an appropriate parameter (e.g., the size of a matching or subset in context).

then he computes the probability,

his useag of defining matinagle is clever, it means a process in which we try to refine the information that we have anout a certain proccess, then if that certain procces revalse the information in a specefic manner, we can use it to deduce some probabilistic inequality due to Alon, -> i guess this technique would work very well in some areas and it is to be noted:

**Proof.**  

Let 
$$
V = C_1 \cup \cdots \cup C_k
$$ 
be a partition of the vertices of \(G\) into \(k\) color classes, i.e., each \(C_i\) is an independent set in \(G\).

Define a sequence of random variables 
$$
X_0, X_1, \dots, X_k
$$ 
by
$$
X_i = \mathbb{E}\Big[ \chi(G_{1/2}) \;\big|\; G_{1/2}[C_1 \cup \cdots \cup C_i] \Big].
$$

In words, the random variable \(X_i\) samples the random edges induced by \(C_1 \cup \cdots \cup C_i\), and then takes the expected chromatic number of the random subgraph \(G_{1/2}\) given the edges chosen from \(C_1 \cup \cdots \cup C_i\) that have already been exposed.  

In particular,
$$
X_0 = \mathbb{E}[\chi(G_{1/2})], \qquad X_k = \chi(G_{1/2}).
$$

Note that 
$$
X_{i+1} - X_i \in \{0, 1\}
$$ 
since each \(C_i\) is an independent set in \(G\).

Let 
$$
V = C_1 \cup \cdots \cup C_k
$$ 
be a partition of the vertices of \(G\) into \(k\) color classes, i.e., each \(C_i\) is an independent set in \(G\).

Define a sequence of random variables 
$$
X_0, X_1, \dots, X_k
$$ 
by
$$
X_i = \mathbb{E}\Big[ \chi(G_{1/2}) \;\big|\; G_{1/2}[C_1 \cup \cdots \cup C_i] \Big].
$$

In words, the random variable \(X_i\) first exposes the edges induced by \(C_1 \cup \cdots \cup C_i\), and then takes the expected chromatic number of the random subgraph \(G_{1/2}\) conditioned on these exposed edges.  

In particular,
$$
X_0 = \mathbb{E}[\chi(G_{1/2})], \qquad X_k = \chi(G_{1/2}).
$$

Moreover, for each \(i\),
$$
X_{i+1} - X_i \in \{0, 1\},
$$
since adding edges from an independent set \(C_{i+1}\) can increase the chromatic number by at most 1.


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

<div class="problem-card">
  <div class="problem-title">Open Problem 6.2 (compact form)</div>
  Find \(G' \subseteq G\) induced with
  \[
  \chi(G') > c\,\chi(G), \qquad
  \alpha(G') \le C\,\frac{|V(G')|}{\chi(G')}
  \]
  for absolute constants \(c,C>0\).
</div>



[shinkar]: https://arxiv.org/pdf/1612.04319

[Mohar and wu]: https://arxiv.org/pdf/1807.06285

[Girão et al]: https://arxiv.org/pdf/2203.03612

[Bukh]: https://arxiv.org/pdf/2312.08340