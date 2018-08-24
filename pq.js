export default class MinPQ {
  constructor(maxN) {
    if (maxN < 0)
      throw new RangeError();
    this.maxN = maxN;
    this.n = 0;
    this.keys = new Array(maxN + 1);
    this.pq   = new Uint16Array(maxN + 1);
    this.qp   = new Int16Array(maxN + 1);
    for (let i = 0; i <= maxN; i++)
      this.qp[i] = -1;
  }

  isEmpty() {
    return this.n === 0;
  }

  contains(i) {
    if (i < 0 || i >= this.maxN) throw new RangeError();
    return this.qp[i] !== -1;
  }

  insert(i, key) {
    if (i < 0 || i >= this.maxN)
      throw new RangeError();
    if (this.contains(i))
      throw new Error("index is already in the priority queue");
    this.n++;
    this.qp[i] = this.n;
    this.pq[this.n] = i;
    this.keys[i] = key;
    this.swim(this.n);
  }

  delMin() {
    if (this.n === 0) throw new Error("Priority queue underflow");
    const min = this.pq[1];
    this.exch(1, this.n--);
    this.sink(1);
    this.qp[min] = -1;        // delete
    this.keys[min] = null;    // to help with garbage collection
    this.pq[this.n+1] = -1;        // not needed
    return min;
  }

  decreaseKey(i, key) {
    if (i < 0 || i >= this.maxN) throw new RangeError();
    if (!this.contains(i)) throw new Error("index is not in the priority queue");
    this.keys[i] = key;
    this.swim(this.qp[i]);
  }

  greater(a, b) {
    return this.keys[this.pq[a]] > this.keys[this.pq[b]];
  }

  exch(i, j) {
    const swap = this.pq[i];
    this.pq[i] = this.pq[j];
    this.pq[j] = swap;
    this.qp[this.pq[i]] = i;
    this.qp[this.pq[j]] = j;
  }

  swim(k) {
    while (k > 1 && this.greater(k>>1, k)) {
      this.exch(k, k>>1);
      k = k>>1;
    }
  }

  sink(k) {
    while (2*k <= this.n) {
      let j = 2*k;
      if (j < this.n && this.greater(j, j+1)) j++;
      if (!this.greater(k, j)) break;
      this.exch(k, j);
      k = j;
    }
  }
}