import MinPQ from './pq.js';
export default class Dijkstra {

  constructor(G, s) {
    this.distTo = new Uint16Array(G.V);
    this.edgeTo = new Array(G.V);

    for (let v = 0; v < G.V; v++)
    this.distTo[v] = 65535;
    this.distTo[s] = 0;

    // relax vertices in order of distance from s
    this.pq = new MinPQ(G.V);
    this.pq.insert(s, this.distTo[s]);
    while (!this.pq.isEmpty()) {
      const v = this.pq.delMin();
      for (const e of G.adj[v])
        this.relax(e, v);
    }
  }

  // relax edge e and update pq if changed
 relax(e, v) {
    const w = e.other(v);
    if (this.distTo[w] > this.distTo[v] + e.weight) {
      this.distTo[w] = this.distTo[v] + e.weight;
      this.edgeTo[w] = e;
      if (this.pq.contains(w)) this.pq.decreaseKey(w, this.distTo[w]);
      else this.pq.insert(w, this.distTo[w]);
    }
  }

  hasPathTo(v) {
    return this.distTo[v] < 65535;
  }

  pathTo(v) {
    if (!this.hasPathTo(v)) return [];
    const path = [];
    let x = v;
    for (let e = this.edgeTo[v]; e != null; e = this.edgeTo[x]) {
      path.push(x);
      x = e.other(x);
    }
    return path;
  }
}