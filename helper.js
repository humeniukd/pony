import Graph from './graph.js';
import Dijkstra from './dijkstra.js';

export default class Helper {

  constructor({ pony,['end-point']: end, data, ['maze_id']: id, size, domokun }) {
    this.id = id;
    this.width = size[0];
    this.data = data;
    this.end = end[0];
    this.pony = pony[0];
    this._domokun = domokun[0];
    this.path = [];
    this.guide = false;
    this.graph = new Graph(this.data.length);
    for (let v = 0; v < this.data.length; v++) {
      for(let w of this.neighbors(v))
        if (w !== this._domokun) this.graph.addEdge(v, w);
    }
    this.recalc();
  }

  set domokun(d) {
    for(let v of this.neighbors(d))
      this.graph.removeEdge(v, d);

    for (let w of this.neighbors(this._domokun))
      if(w !== d) this.graph.addEdge(w, this._domokun);
    this._domokun = d;
  }

  neighbors(i) {
    const node = this.data[i], neighbors = [],
        bottom = i + this.width, right = i + 1;
    if('undefined' === typeof node)
      throw new Error();
    if (!node.some(a => a === 'north'))
      neighbors.push(i - this.width);

    if (!node.some(a => a === 'west'))
      neighbors.push(i - 1);

    if ((bottom < this.data.length) &&
        !this.data[bottom].some(a => a === 'north'))
      neighbors.push(bottom);

    if ((right < this.data.length) &&
        !this.data[right].some(a => a === 'west'))
      neighbors.push(right);

    return neighbors;
  }

  recalc() {
    let d = new Dijkstra(this.graph, this.pony);
    this.path = d.pathTo(this.end);
  }

  next() {
    let direction;
    const d = this.path.pop() - this.pony;
    if (d > 0)
      direction = d > 1 ? 'south' : 'east';
    else
      direction = d < -1 ? 'north' : 'west';
    return {
      direction
    }
  }

  print() {
    let res = '';
    let i = 0;
    let l1 = '', l2 = '';
    for (const item of this.data) {
      l1 += '+';
      let fill = '   ';
      if (this.pony === i)
        fill = ' <b id="p">P</b> ';
      else if (this._domokun === i)
        fill = ' <b id="d">Ż</b> ';
      else if (this.end === i)
        fill = ' <b id="e">E</b> ';
      else if (this.guide && this.path.includes(i))
        fill = ` <i id="c">·</i> `;
      l1 += item.some(a => a === 'north') ? '---': '   ';
      l2 += item.some(a => a === 'west') ? `|${fill}` : ` ${fill}`;
      i++;
      if (i % this.width === 0) {
        res += `${l1}+\n${l2}|\n`;
        l1 = '';
        l2 = '';
      }
    }
    let end = '';
    for (let i = 0; i < this.width; i++)
      end += '+---';
    return res+end+'+';
  }
}
