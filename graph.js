class Edge {
  constructor(v, w, weight=1) {
    if (v < 0) throw new Error("vertex index must be a nonnegative integer");
    if (w < 0) throw new Error("vertex index must be a nonnegative integer");
    if (Number.isNaN(weight)) throw new Error("Weight is NaN");
    this.v = v;
    this.w = w;
    this.weight = weight;
  }

  weight() {
    return this.weight;
  }

  either() {
    return this.v;
  }

  other(vertex) {
    if (vertex === this.v) return this.w;
    else if (vertex === this.w) return this.v;
    else throw new Error("Illegal endpoint");
  }
}

export default class Graph {
  constructor(V) {
    if (V < 0) throw new Error("Number of vertices must be nonnegative");
    this.V = V;
    this.adj = [];
    for (let v = 0; v < V; v++) {
      this.adj[v] = [];
    }
  }
  edges() {
    const list = [];
    for (let v = 0; v < V; v++) {
      for (let e of this.adj(v)) {
        list.push(e);
      }
    }
    return list;
  }
  addEdge(v, w, t) {
    const e = new Edge(v, w, t);
    this.adj[v].push(e);
  }
  removeEdge(v, w) {
    this.adj[v] = this.adj[v].filter(e => !(v === e.v && w === e.w));
  }
  adj(v) {
    return adj[v];
  }
  degree(v) {
    return adj[v].length;
  }
}