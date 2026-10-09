// Balance simulator: plays scripted strategies against the game engine in src/game.html.
// Usage: node tools/sim.js                      (default settings)
//        node tools/sim.js '{"BASE_AP":5}'      (override any CFG value)
const fs=require('fs'),path=require('path'),vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../src/game.html'),'utf8');
const engine=html.slice(html.indexOf('// ENGINE START'),html.indexOf('// ENGINE END'));
const overrides=process.argv[2]?JSON.parse(process.argv[2]):{};
const N=Number(process.env.GAMES||200);

const strategies=`
Object.assign(CFG,OVERRIDES);
function play(strat){newGame();let m=1;while(!S.over){strat();endTurn();m=Math.min(m,share())}return {t:S.turn,r:S.over.title,m}}
const tax=max=>{let go=true;while(go){go=false;const c=S.countries.filter(c=>!locked(c)&&c.tax<Math.min(max,fleeAt(c)-1)&&taxCost(c)<=S.ap).sort((a,z)=>held(z)-held(a))[0];if(c&&held(c)>.1){raiseTax(c.id);go=true}}};
const richest=()=>[...S.bills].sort((a,z)=>wealth(z)-wealth(a))[0];
const kil=()=>kill(richest().id);
const nat=()=>{let best=null;S.countries.forEach(c=>{if(locked(c)||!natOK(c))return;SECTORS.forEach(s=>{if(c.pub[s])return;const a=heldSec(c,s),k=natCost(c,s);if(a>.05&&k<=S.ap&&(!best||a/k>best.v))best={c,s,v:a/k}})});if(best&&best.v>.15){nationalise(best.c.id,best.s);return true}return false};
const conv=()=>{let best=null;S.bills.forEach(b=>{if(b.faith)return;RELIGIONS.forEach(r=>{const v=convChance(b,r.id)*wealth(b);if(!best||v>best.v)best={b,r,v}})});if(best&&S.ap>=CFG.CONVERT_COST&&best.v>.4){convert(best.b.id,best.r.id);return true}return false};
const camp=()=>{const c=S.countries.filter(c=>!locked(c)&&c.lean>.2).sort((a,z)=>held(z)-held(a))[0];if(c&&S.ap>=1){campaign(c.id);return true}return false};
const STRATS={
  passive:()=>{},
  killAndTax:()=>{if(S.ap>=killCost())kil();else if(S.turn%3!=0)tax(2)},
  nationaliseOnly:()=>{while(nat());},
  convertOnly:()=>{while(conv());},
  mixed:()=>{if(S.ap>=killCost()&&S.turn%2==0)kil();while(nat());while(conv());tax(2);camp()},
  nationaliseFirst:()=>{while(nat());if(S.ap>=killCost())kil();while(conv());camp();tax(2)},
  campaignToNationalise:()=>{const t=S.countries.filter(c=>!locked(c)&&!natOK(c)&&held(c)>1).sort((a,z)=>held(z)-held(a))[0];while(nat());if(S.ap>=killCost())kil();if(t)while(S.ap>=1&&!natOK(t))campaign(t.id);while(conv());tax(2)},
};
for(const [name,f] of Object.entries(STRATS)){
  const res={};let years=0;const mins=[];
  for(let i=0;i<GAMES;i++){const o=play(f);res[o.r]=(res[o.r]||0)+1;years+=o.t;mins.push(o.m)}
  mins.sort((a,b)=>a-b);
  console.log(name.padEnd(22),JSON.stringify(res).padEnd(52),'avg years',(years/GAMES).toFixed(1).padStart(5),' median lowest share',(mins[GAMES>>1]*100).toFixed(1)+'%');
}`;
vm.runInNewContext(engine+strategies,{console,Math,OVERRIDES:overrides,GAMES:N});
