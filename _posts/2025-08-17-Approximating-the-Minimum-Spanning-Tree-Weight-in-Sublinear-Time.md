This is an excellent paper, although the writing was a bit terse and working out the details was quite painful. Suppose that you have a graph in which the edges are weighted, and you are asked to find the minimum spanning tree in a sublinear amount of time! What does that mean? It means that before you end up reading the whole input, you should come up with some sort of close approximation of a good minimum spanning tree.

This is one of the earlier papers in sublinear algorithms and definitely a classic, worth analyzing the techniques they used to solve the problem and working out the details. I must say that Luca Trevisan is one of my idols, and I plan to read most of his works anyway, so in the name of the supreme mathematician we begin.

As they point out in their paper:

\begin{quote}
In this paper, we show that there are conditions under which it is possible to approximate the weight of the MST of a connected graph in time sublinear in the number of edges. We give an algorithm which approximates the MST of a graph $G$ to within a multiplicative factor of $1 + \varepsilon$ and runs in time $O\left(dw\varepsilon^{-2} \log \frac{dw}{\varepsilon}\right)$ for any $G$ with average degree $d$ and edge weights in the set $\{1, \ldots, w\}$. The algorithm requires no prior information about the graph besides $w$ and $n$; in particular, the average degree is assumed to be unknown. The relative error $\varepsilon$ ($0 < \varepsilon < 1/2$) is specified as an input parameter. Note that if $d$ and $\varepsilon$ are constant and the ratios of the edge weights are bounded, then the algorithm runs in constant time. We also extend our algorithm to the case where $G$ has nonintegral weights in the range $[1, w]$, achieving a comparable runtime with a somewhat worse dependence on $\varepsilon$.
\end{quote}

\section{Approximating the Number of Connected Components}

First we begin by approximating the number of connected components in a graph. The significance of this approximation will later be illuminated in this article.

First suppose that we have the graph in the form of adjacency lists. Then for a vertex $v$, we define $d_u$ to be the number of edges that the vertex is an endpoint of (self loops are also included throughout the paper for technical reasons), and we define $m_u$ to be the number of edges in the connected component that vertex $v$ belongs to. We let $c$ be the number of components (for example $c = 1, 2, 3, \ldots$). It is easy to see that:

\begin{fact}
Given a graph with vertex set $V$, for every connected component $I \subseteq V$, $\sum_{u \in I} \frac{1}{2} \frac{d_u}{m_u} = 1$ and $\sum_{u \in V} \frac{1}{2} \frac{d_u}{m_u} = c$.
\end{fact}

To see this: if we sum over $I \subseteq V$, $\sum_{u \in I} \frac{1}{2} \frac{d_u}{m_u} = \frac{1}{2} \frac{\sum_{u \in I} d_u}{m_u} = \frac{1}{2}\frac{2m_u}{m_u} = 1$ because by counting $d_u$ we count each edge twice. To handle the case that $m_u = 0$, we let $\frac{d_u}{m_u} = 2$, which still lets us count the number of components correctly.

So here comes the first principle: if you want to approximate something, then find an equivalent formulation of that thing based on other variables which are easier to approximate and about which you have more information, and use them to approximate what you want to approximate!

In this case we approximate $\frac{d_u}{m_u}$! Let us see how. As we have defined, we let $d$ be the average degree, and we can always make $d \geq 1$ by adding self loops.

We want our estimate to actually be accurate enough, meaning we want it to be equal to $c \pm \varepsilon n$.

\begin{algorithm}
\caption{approx-number-connected-components$(G, \varepsilon, W, d^*)$}
\begin{algorithmic}[1]
\STATE uniformly choose $r = O(1/\varepsilon^2)$ vertices $u_1, \ldots, u_r$
\FOR{each vertex $u_i$}
    \STATE set $\beta_i = 0$
    \STATE take the first step of a BFS from $u_i$
    \STATE (*) flip a coin
    \IF{(heads) \textbf{and} (\# vertices visited in BFS $< W$) \textbf{and} (no visited vertex has degree $> d^*$)}
        \STATE resume BFS to double number of visited edges
        \IF{this allows BFS to complete}
            \IF{$m_{u_i} = 0$}
                \STATE set $\beta_i = 2$
            \ELSE
                \STATE set $\beta_i = \frac{d_{u_i}}{2} \cdot \frac{\text{\# coin flips}}{\text{\# edges visited in BFS}}$
            \ENDIF
        \ELSE
            \STATE go to (*)
        \ENDIF
    \ENDIF
\ENDFOR
\STATE \textbf{output} $\hat{c} = \frac{n}{2r} \sum_{i=1}^{r} \beta_i$
\end{algorithmic}
\end{algorithm}

As you can see, the algorithm gets an $\varepsilon$, a threshold parameter $W$ set to be $\frac{4}{\varepsilon}$, the graph, and an approximation of average degree $d^*$.

So just forget about the algorithm for a second! First let us approximate the average degree.