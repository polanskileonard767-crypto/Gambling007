const KEY='g007_easy_v2';
const state=JSON.parse(localStorage.getItem(KEY)||'null')||{score:10000};
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const fmt=n=>Math.max(0,Math.floor(n)).toLocaleString('de-DE');
const score=()=>$('#score').textContent=fmt(state.score);
const modal=$('#modal');
const game=$('#game');
function close(){modal.classList.add('hidden');}
function open(content){game.innerHTML=content;modal.classList.remove('hidden');}
function add(points){state.score+=points;save();score();}
function msg(text,good=true){const e=$('#result');if(e){e.textContent=text;e.className=good?'result good':'result';}}

function slots(){
 open(`<h2>SLOT 007</h2><p>Drück START und versuche <b>0 · 0 · 7</b> zu treffen.</p><div class="reels"><span id="r1">0</span><span id="r2">0</span><span id="r3">7</span></div><button class="play" id="start">START</button><div id="result" class="result">Bereit.</div>`);
 $('#start').onclick=()=>{const a=[0,1,2].map(()=>Math.floor(Math.random()*10));['r1','r2','r3'].forEach((id,i)=>$('#'+id).textContent=a[i]);if(a.join('')==='007'){add(500);msg('🎯 007 getroffen! +500 SCORE')}else msg('Noch nicht — nochmal!')};
}
function dice(){
 open(`<h2>DICE</h2><p>Drück den Button und würfle.</p><div id="die" class="big-number">?</div><button class="play" id="roll">WÜRFELN</button><div id="result" class="result">Bereit.</div>`);
 $('#roll').onclick=()=>{const n=Math.floor(Math.random()*6)+1;$('#die').textContent=n;if(n===6){add(200);msg('🎲 6! +200 SCORE')}else msg(n+' — versuch es nochmal.')};
}
function mines(){
 open(`<h2>MINES</h2><p>Finde das geheime Zielfeld.</p><div class="board">${Array(9).fill(0).map((_,i)=>`<button data-i="${i}">?</button>`).join('')}</div><div id="result" class="result">Such ein Feld.</div>`);
 const win=Math.floor(Math.random()*9);let done=false;
 document.querySelectorAll('.board button').forEach(b=>b.onclick=()=>{if(done)return;const i=+b.dataset.i;if(i===win){b.textContent='✓';done=true;add(250);msg('💎 Gefunden! +250 SCORE')}else{b.textContent='×';b.disabled=true;msg('Falsch. Probier ein anderes Feld.')}});
}
function target(){
 open(`<h2>TARGET</h2><p>Klicke den Punkt. Jeder Treffer gibt SCORE.</p><div id="targetZone" class="target-zone"><button id="targetCore">+</button></div><div id="result" class="result">Treffer: 0</div>`);
 const z=$('#targetZone'),t=$('#targetCore');let hits=0;
 function move(){t.style.left=Math.max(5,Math.random()*(z.clientWidth-55))+'px';t.style.top=Math.max(5,Math.random()*(z.clientHeight-55))+'px'}
 move();t.onclick=()=>{hits++;add(50);msg('🎯 Treffer '+hits+'! +50 SCORE');move()};
}

document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>({slots,dice,mines,target}[b.dataset.game])());
$('#close').onclick=close;
modal.onclick=e=>{if(e.target===modal)close()};
$('#reset').onclick=()=>{state.score=10000;save();score()};
score();