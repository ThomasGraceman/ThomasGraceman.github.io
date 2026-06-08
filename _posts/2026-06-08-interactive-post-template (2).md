# Tree Embeddings, Hierarchical Cut Decompositions, and Probabilistic Partitions

As part of my effort to understand the broader literature surrounding the areas I hope to work on in the future, I am studying both foundational papers and contemporary developments. Alongside my primary focus on the work of James R. Lee, I plan to read a number of folklore and classical papers that have shaped the modern theory of metric embeddings.

One of the central themes I am exploring is tree embeddings as an algorithmic tool. A recurring paradigm in approximation algorithms is to replace a complicated metric space with a distribution over tree metrics. Since many optimization problems become significantly easier on trees, one can design an algorithm in the tree setting and then transfer the guarantee back to the original metric, often losing only a logarithmic factor in approximation quality.

A canonical example of this philosophy is the probabilistic partition framework of Yuri Bartal and the subsequent CKR decomposition of Moses Charikar, Chandra Chekuri, and Anupam Gupta. These techniques form a cornerstone of modern metric embedding theory and have influenced approximation algorithms, online algorithms, routing, clustering, and network design.

What makes this area particularly exciting is that even these classical constructions continue to inspire new advances. For example, the recent paper *Tree Embedding in High Dimensions: Dynamic and Massively Parallel* by Gramoz Goranci, Shaofeng H.-C. Jiang, Peter Kiss, Qihao Kong, Yi Qian, and Eva Szilagyi extends the tree-embedding paradigm to dynamic and massively parallel settings, obtaining efficient algorithms for high-dimensional Euclidean data and applications such as k-median and earth mover distance.

We now consider the following idea: if we cannot construct an exact object, we instead build a collection of objects that approximate it, and place a probability distribution over them. By sampling from this distribution, we can reason about the expected quality of the constructed object over time.

Let `S` be a family of metrics over `V`, and let `D` be a distribution over `S`. We say that `(S,D)` `α`-probabilistically approximates a metric `(V,d)` if every metric in `S` dominates `d`, and for every pair of vertices `u,v ∈ V`,

\[
\mathbb{E}_{d' \sim \mathcal{D}}[d'(u,v)] \le \alpha \cdot d(u,v).
\]

## Hierarchical Cut Decompositions

Let `(V,d)` be a finite metric space. For a parameter `r > 0`, an `r`-cut decomposition is a partition of `V` into clusters such that:

- Each cluster is associated with a center vertex.
- Every vertex in a cluster lies within distance at most `r` from its center.

Thus, every cluster has diameter at most `2r`.

A **hierarchical cut decomposition** is a sequence of nested partitions

\[
D_0,D_1,\dots,D_\delta
\]

such that:

- `D_δ = {V}`.
- `D_i` is a `2^i`-cut decomposition.
- `D_i` refines `D_{i+1}` for all `i`.

At the finest level, `D_0` consists of singleton clusters.

## Intuition

This construction organizes the metric space in a top-down manner. At large scale, points are grouped into coarse clusters, and as the scale decreases, these clusters are recursively refined into smaller ones. This yields a multiscale representation of the metric that can be viewed as a tree-like structure.

## Example

Let

\[
V=\{a,b,c,d,e\}.
\]

Suppose:

- `{a,b}` are very close.
- `{c,d}` are very close.
- `e` is far from all others.

### Level D₀ (radius 1)

\[
D_0=\{\{a\},\{b\},\{c\},\{d\},\{e\}\}.
\]

### Level D₁ (radius 2)

\[
D_1=\{\{a,b\},\{c,d\},\{e\}\}.
\]

### Level D₂ (radius 4)

\[
D_2=\{\{a,b,c,d,e\}\}.
\]

Notice the refinement property

\[
D_0 \prec D_1 \prec D_2.
\]

Each level coarsens the metric while preserving local structure at smaller scales.

What we have constructed is a *laminar family*, as mentioned in the paper. A hierarchical cut decomposition defines a laminar family.

Recall that a family `F ⊆ 2^V` is called **laminar** if for any `A,B ∈ F`,

\[
A \subseteq B \quad \text{or} \quad B \subseteq A \quad \text{or} \quad A \cap B = \emptyset.
\]

Such families are particularly convenient because they admit a natural tree representation: each set corresponds to a node, and inclusion defines the parent-child structure.

## Building the Tree Metric

So we try to set the metric in a way that it gives us a good distance. Start from the root, the scale doubles as we move upward, and the distance between two leaves is determined by their least common ancestor in the tree.

Each node in `D_i` is connected to each of its children by an edge of length `2^i`, which is an upper bound on the radius of the corresponding cluster. This induces a distance function `d_T(·,·)` on `V`, where `d_T(u,v)` is the shortest-path distance between the leaves corresponding to `{u}` and `{v}`.

Given this edge-length assignment,

\[
d_T(u,v)\ge d(u,v).
\]

## Partition Algorithm

```text
Partition(V,d)

1. Choose a random permutation π = (v₁,v₂,...,vₙ).
2. Choose β uniformly at random from [1,2].
3. Set Dδ ← {V}.
4. For i = δ−1,δ−2,... while non-singleton clusters remain:
      βᵢ ← 2^(i−1)β

      For each center π(l):
          For each cluster S in Dᵢ₊₁:
              Create a new cluster containing all unassigned
              vertices u ∈ S satisfying

                    d(u, π(l)) ≤ βᵢ
```

What we are doing? Notice that in each cluster in the process we have a set of refinements. Now what we are going to do is set the new distance, and we want to cluster the vertices close to each other and refine it further.

For that we should really choose a center to distinguish distances from, and we do that by randomizing the vertices available and choosing the first vertex and setting it as a means to further refine the cluster. For example, all the vertices whose distance is less than `βᵢ` from `π(l)` will be placed in the same cluster.

So now we should try to analyze it.

## D3.js Visualization

The following D3.js snippet visualizes the laminar family as a tree.

```html
<div id="tree"></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
const data = {
  name: "D2",
  children: [
    {
      name: "{a,b}",
      children: [
        { name: "a" },
        { name: "b" }
      ]
    },
    {
      name: "{c,d}",
      children: [
        { name: "c" },
        { name: "d" }
      ]
    },
    {
      name: "e"
    }
  ]
};

const width = 800;
const height = 400;

const root = d3.hierarchy(data);
const tree = d3.tree().size([width - 100, height - 100]);
tree(root);

const svg = d3.select("#tree")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.selectAll("line")
  .data(root.links())
  .enter()
  .append("line")
  .attr("x1", d => d.source.x + 50)
  .attr("y1", d => d.source.y + 50)
  .attr("x2", d => d.target.x + 50)
  .attr("y2", d => d.target.y + 50)
  .attr("stroke", "black");

svg.selectAll("circle")
  .data(root.descendants())
  .enter()
  .append("circle")
  .attr("cx", d => d.x + 50)
  .attr("cy", d => d.y + 50)
  .attr("r", 5);

svg.selectAll("text")
  .data(root.descendants())
  .enter()
  .append("text")
  .attr("x", d => d.x + 60)
  .attr("y", d => d.y + 5)
  .text(d => d.data.name);
</script>
```

## Expected Distortion Analysis

The expected value of `d_T(u,v)` is bounded by `O(log n) · d(u,v)`.

\[
\mathbb{E}[d_T(u,v)]
\le
\sum_{i=0}^{\delta}
\Pr[(u,v)\text{ is at level }i]\cdot 2^{i+2}.
\]

Note that if `(u,v)` is at level `i`, then

\[
d_T(u,v)=2\sum_{j=0}^{i}2^j \le 2^{i+2}.
\]

If vertices `u` and `v` are in separate clusters in `D_i`, we say that `D_i` separates `(u,v)`.

Clearly, if

\[
d(u,v) > 2^{i+2},
\]

then `u` and `v` cannot lie in the same cluster in `D_{i+1}`.

Let `j*` be the smallest index such that

\[
d(u,v)\le 2^{j^*+2}.
\]

Then

\[
\Pr[(u,v)\text{ is at level }i]=0
\quad\text{for } i<j^*.
\]

For `i ≥ j*`,

\[
\Pr[(u,v)\text{ is at level }i]
\le
\Pr[D_i \text{ separates } (u,v)].
\]

By analyzing the random radius interval and using the triangle inequality, the probability that a center cuts `(u,v)` at level `i` is at most

\[
\frac{d(u,v)}{2^{i-1}}.
\]

Summing over candidate centers yields

\[
\Pr[D_i \text{ separates } (u,v)]
\le
\frac{d(u,v)}{2^{i-1}}
\left(\ln k_i^u+\ln k_i^v\right).
\]

Thus each level contributes at most `O(log n)` to the expectation, leading to

\[
\mathbb{E}[d_T(u,v)]
\le
O(\log n \log \Delta)\, d(u,v).
\]
