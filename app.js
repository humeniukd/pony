import Helper from "./helper.js";
const headers = {'Content-Type': 'application/json'};
const base = 'https://ponychallenge.trustpilot.com/pony-challenge/maze';
const $res = document.getElementById('res');
const $difficulty = document.getElementById('difficulty');
const $guide = document.getElementById('guide');
let helper, interval;

const init = () => {
  const req = {
    "maze-width": 15,
    "maze-height": 25,
    "maze-player-name": "Fluttershy",
    "difficulty": parseInt($difficulty.value)
  };
  fetch(base, {
    method: 'POST',
    body: JSON.stringify(req),
    headers
  }).then(res => res.json()).then(json => {
    fetch(`${base}/${json.maze_id}`)
        .then(res => res.json())
        .then(json => {
          helper = new Helper(json);
          $res.innerHTML = helper.print();
          check();
        });
  });
  clearInterval(interval);
  interval = setInterval(() => {
    fetch(`${base}/${helper.id}`, {
      method: 'POST',
      body: JSON.stringify(helper.next()),
      headers
    }).then(res => res.json()).then(json => {
      fetch(`${base}/${helper.id}`)
          .then(res => res.json())
          .then(json => {
            helper.domokun = json.domokun[0];
            helper.pony = json.pony[0];
            helper.guide = $guide.checked;
            helper.recalc();
            $res.innerHTML = helper.print();
            check();
          });
    });
  }, 500);
};
$difficulty.onchange = init;
init();
const check = () => {
  if (helper.pony === helper.end) confirm('You win! Want to play again?') ? init() : clearInterval(interval);
  else if (!helper.path.length) confirm('You lose! Want to play again?') ? init() : clearInterval(interval);
};