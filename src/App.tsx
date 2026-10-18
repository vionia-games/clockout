import * as React from 'react';
import { Icon, Tile, Level, generateLevel, isFree, todayInSeoul, formatTime } from './logic';
import './styles.css';

type Status = 'playing' | 'stageClear' | 'won' | 'lost';
interface Snapshot { tiles:Tile[]; tray:Icon[]; matched:number; moves:number; shuffled:boolean; }
interface State {
 day:string; stage:number; level:Level; tiles:Tile[]; tray:Icon[]; matched:number; moves:number; seconds:number;
 status:Status; history:Snapshot[]; hint:number[]; help:boolean; shuffled:boolean; record:number|null;
}
const REC_PREFIX='vionia-clockout-v3-record-';
const HELP_KEY='vionia-clockout-v3-onboarding';
function get(key:string){try{return localStorage.getItem(key);}catch{return null;}}
function put(key:string,val:string){try{localStorage.setItem(key,val);}catch{/* ignore */}}
function initial(day:string,stage=1,seconds=0,moves=0):State {
 const level=generateLevel(day,stage);
 return {day,stage,level,tiles:level.tiles,tray:[],matched:0,moves,seconds,status:'playing',history:[],hint:[],help:get(HELP_KEY)!=='yes',shuffled:false,record:Number(get(REC_PREFIX+day))||null};
}
const names:Record<Icon,string>={coffee:'고양이 나비',headphones:'강아지 몽이',bag:'토끼 뭉치',phone:'곰돌이 쿠키',bus:'병아리 삐약',laptop:'개구리 초롱',clock:'판다 두부',folder:'아기 여우 루루',key:'햄스터 콩이'};

function TileIcon({kind}: {kind:Icon}){
 const outline="#624b70";
 const face:Record<Icon,React.ReactNode>={
  coffee:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M13 25 11 10q0-4 4-2l12 9q5-2 10 0L49 8q4-2 4 3l-2 16q2 23-19 26Q11 52 13 25Z" fill="#ffd9a8"/>
   <path d="m14 19-1-9 11 8m27 1 1-10-11 9" fill="#f6a4bd" strokeWidth="2"/>
   <ellipse cx="24" cy="31" rx="2.3" ry="3.2" fill={outline} stroke="none"/><ellipse cx="40" cy="31" rx="2.3" ry="3.2" fill={outline} stroke="none"/>
   <circle cx="21" cy="29" r=".8" fill="white" stroke="none"/><circle cx="37" cy="29" r=".8" fill="white" stroke="none"/>
   <path d="m30 36 2 1.5 2-1.5m-2 2v3m0 0q-3 3-6 0m6 0q3 3 6 0" fill="none" strokeWidth="1.8"/>
   <circle cx="18" cy="37" r="3.6" fill="#f29eb5" stroke="none"/><circle cx="46" cy="37" r="3.6" fill="#f29eb5" stroke="none"/>
   <path d="M10 34 3 32m8 5-7 1m50-4 7-2m-8 5 7 1" fill="none" strokeWidth="1.4"/>
   <path d="M22 14q8-7 16 0" fill="none" stroke="#fff4db" strokeWidth="2"/>
  </g>,
  headphones:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M16 21Q5 23 8 39q2 7 10 4l3-14Zm32 0q11 2 8 18-2 7-10 4l-3-14Z" fill="#c58b66"/>
   <path d="M14 31q0-19 18-19t18 19v9q-1 13-18 14Q14 53 14 40Z" fill="#f6d7ad"/>
   <path d="M14 27q3-15 18-15t18 15" fill="none" stroke="#a56f89" strokeWidth="3"/>
   <ellipse cx="24" cy="33" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="40" cy="33" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <ellipse cx="32" cy="39" rx="7" ry="5" fill="#fff2e5" strokeWidth="1.8"/><path d="m30 37 2 1.5 2-1.5m-2 2v2m0 0q-3 2-5 0m5 0q3 2 5 0" fill="none" strokeWidth="1.6"/>
   <circle cx="19" cy="39" r="3" fill="#f29eb5" stroke="none"/><circle cx="45" cy="39" r="3" fill="#f29eb5" stroke="none"/>
   <path d="M24 19q8-5 16 0" fill="none" stroke="#fff0d7" strokeWidth="2"/>
  </g>,
  bag:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M22 27 18 6q-1-5 4-3l11 18Zm20 0 4-21q1-5-4-3L31 22Z" fill="#ffbfd7"/>
   <path d="M17 29Q17 17 32 17t15 12l2 10q1 15-17 16-18-1-17-16Z" fill="#fff0f5"/>
   <path d="M22 8 29 23M42 8l-8 15" stroke="#f18eb2" strokeWidth="2"/>
   <ellipse cx="25" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="39" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <path d="m29 40 3 2 3-2m-3 2v3m0 0q-4 3-7 0m7 0q4 3 7 0" fill="none" strokeWidth="1.7"/>
   <circle cx="20" cy="41" r="3.4" fill="#f39fbb" stroke="none"/><circle cx="44" cy="41" r="3.4" fill="#f39fbb" stroke="none"/>
   <path d="m27 16 5-7 5 7-5 3Z" fill="#ffdc72"/><circle cx="32" cy="14" r="2" fill="#fff4b9" stroke="none"/>
  </g>,
  phone:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <circle cx="18" cy="18" r="8" fill="#b77a58"/><circle cx="46" cy="18" r="8" fill="#b77a58"/>
   <circle cx="18" cy="18" r="3.7" fill="#f5b1b2" strokeWidth="1.5"/><circle cx="46" cy="18" r="3.7" fill="#f5b1b2" strokeWidth="1.5"/>
   <path d="M14 32Q14 17 32 17t18 15v8q-1 14-18 14-17 0-18-14Z" fill="#d69a73"/>
   <ellipse cx="25" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="39" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <ellipse cx="32" cy="41" rx="8" ry="6" fill="#fff2e5" strokeWidth="1.7"/><path d="m30 39 2 1.5 2-1.5m-2 2v2m0 0q-3 2-5 0m5 0q3 2 5 0" fill="none" strokeWidth="1.5"/>
   <circle cx="20" cy="40" r="3.5" fill="#f29eb5" stroke="none"/><circle cx="44" cy="40" r="3.5" fill="#f29eb5" stroke="none"/>
   <path d="M22 23q10-6 20 0" fill="none" stroke="#efc49b" strokeWidth="2"/>
  </g>,
  bus:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M26 16q-1-9 6-12 7 3 6 12" fill="#ffce58"/>
   <path d="M13 31q0-17 19-17t19 17v8q0 15-19 15T13 39Z" fill="#ffe477"/>
   <path d="M19 21q6-5 13-5t13 5" fill="none" stroke="#fff1ac" strokeWidth="3"/>
   <ellipse cx="25" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="39" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <path d="m29 40 3 2 3-2" fill="none" strokeWidth="1.8"/>
   <path d="m30 39-5 3 5 2 2-2 2 2 5-2-5-3" fill="#f28e72" strokeWidth="1.5"/>
   <circle cx="20" cy="41" r="3.4" fill="#f39fbb" stroke="none"/><circle cx="44" cy="41" r="3.4" fill="#f39fbb" stroke="none"/>
   <circle cx="21" cy="26" r="2" fill="#fff6c4" stroke="none"/><circle cx="45" cy="26" r="2" fill="#fff6c4" stroke="none"/>
  </g>,
  laptop:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M12 30Q12 16 24 16q4-9 8-9t8 9q12 0 12 14v9q-1 15-20 15-19 0-20-15Z" fill="#91dca6"/>
   <circle cx="23" cy="18" r="7" fill="#a8ebb7"/><circle cx="41" cy="18" r="7" fill="#a8ebb7"/>
   <ellipse cx="23" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="41" cy="34" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <path d="M25 42q7 6 14 0" fill="none" strokeWidth="2"/>
   <circle cx="18" cy="41" r="3.4" fill="#f39fbb" stroke="none"/><circle cx="46" cy="41" r="3.4" fill="#f39fbb" stroke="none"/>
   <circle cx="21" cy="16" r="2" fill="#fff" stroke="none"/><circle cx="39" cy="16" r="2" fill="#fff" stroke="none"/>
  </g>,
  clock:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <circle cx="17" cy="19" r="9" fill="#594d67"/><circle cx="47" cy="19" r="9" fill="#594d67"/>
   <circle cx="17" cy="19" r="4" fill="#f5aec0" strokeWidth="1.5"/><circle cx="47" cy="19" r="4" fill="#f5aec0" strokeWidth="1.5"/>
   <path d="M12 34Q12 17 32 17t20 17v5q-1 15-20 15-19 0-20-15Z" fill="#fffaf3"/>
   <ellipse cx="23" cy="34" rx="7" ry="8" fill="#4a3e56" strokeWidth="1.5"/><ellipse cx="41" cy="34" rx="7" ry="8" fill="#4a3e56" strokeWidth="1.5"/>
   <ellipse cx="23" cy="34" rx="2" ry="2.8" fill="#fff" stroke="none"/><ellipse cx="41" cy="34" rx="2" ry="2.8" fill="#fff" stroke="none"/>
   <path d="M28 44q4 4 8 0" fill="none" strokeWidth="2"/>
   <circle cx="17" cy="43" r="3.3" fill="#f39fbb" stroke="none"/><circle cx="47" cy="43" r="3.3" fill="#f39fbb" stroke="none"/>
   <path d="M22 23q10-5 20 0" fill="none" stroke="#fff" strokeWidth="2"/>
  </g>,
  folder:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <path d="M14 28 9 9q-1-4 4-4l17 14Zm36 0 5-19q1-4-4-4L34 19Z" fill="#f4a660"/>
   <path d="M13 31q0-16 19-16t19 16v8q0 15-19 15-19 0-19-15Z" fill="#f8bd78"/>
   <path d="M13 28 10 10l15 12m26 6 3-18-15 12" fill="#e88e4d" strokeWidth="2"/>
   <path d="M19 43q5-9 13-3 8-6 13 3-4 10-13 9-9 1-13-9Z" fill="#fff6ea" strokeWidth="1.8"/>
   <ellipse cx="24" cy="33" rx="2" ry="3" fill={outline} stroke="none"/><ellipse cx="40" cy="33" rx="2" ry="3" fill={outline} stroke="none"/>
   <path d="m30 40 2 1.5 2-1.5" fill="none" strokeWidth="1.6"/>
   <circle cx="18" cy="39" r="3" fill="#f39fbb" stroke="none"/><circle cx="46" cy="39" r="3" fill="#f39fbb" stroke="none"/>
  </g>,
  key:<g stroke={outline} strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">
   <circle cx="19" cy="19" r="8" fill="#c7c4d7"/><circle cx="45" cy="19" r="8" fill="#c7c4d7"/>
   <circle cx="19" cy="19" r="3.7" fill="#f5b3bf" strokeWidth="1.5"/><circle cx="45" cy="19" r="3.7" fill="#f5b3bf" strokeWidth="1.5"/>
   <path d="M13 33q0-16 19-16t19 16v6q0 15-19 15-19 0-19-15Z" fill="#e4e0e9"/>
   <path d="M20 26q5-6 11-1 6-5 12 1" fill="#b7b1c7" strokeWidth="1.8"/>
   <ellipse cx="24" cy="35" rx="2.2" ry="3" fill={outline} stroke="none"/><ellipse cx="40" cy="35" rx="2.2" ry="3" fill={outline} stroke="none"/>
   <ellipse cx="32" cy="41" rx="7" ry="5" fill="#fff6ed" strokeWidth="1.6"/><path d="m30 39 2 1.5 2-1.5m-2 2v1m0 0q-3 2-5 0m5 0q3 2 5 0" fill="none" strokeWidth="1.5"/>
   <circle cx="19" cy="42" r="3.4" fill="#f39fbb" stroke="none"/><circle cx="45" cy="42" r="3.4" fill="#f39fbb" stroke="none"/>
  </g>
 };
 return <svg className="tile-icon animal-tile-icon" viewBox="0 0 64 64" aria-hidden="true">{face[kind]}</svg>;
}
function TinyIcon({kind}:{kind:Icon}){return <span className="mini-symbol"><TileIcon kind={kind}/></span>;}
function PetPortraits({className=''}:{className?:string}) {
 return <svg className={className} viewBox="0 0 132 64" role="img" aria-label="고양이와 강아지 캐릭터">
  <g stroke="#59436e" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
   <path d="M7 25 8 9l16 8q9-5 18 0l15-8 1 18q4 21-25 26Q5 50 7 25Z" fill="#ffdfb1"/>
   <path d="M9 18 10 11l10 6m33 1-1-7-9 6" fill="#f4a6c2" strokeWidth="2"/>
   <ellipse cx="22" cy="31" rx="2" ry="3" fill="#59436e" stroke="none"/><ellipse cx="43" cy="31" rx="2" ry="3" fill="#59436e" stroke="none"/>
   <path d="m30 36 3 2 3-2m-3 2v3m0 0q-4 4-7 0m7 0q4 4 7 0" fill="none" strokeWidth="1.7"/>
   <circle cx="16" cy="37" r="3.5" fill="#f39cb4" stroke="none"/><circle cx="49" cy="37" r="3.5" fill="#f39cb4" stroke="none"/>
   <path d="m17 16 2-7q1-3 4-1l8 7m14 0 4-6q2-3 4 0l3 10" fill="#ffcf65"/>
   <path d="M72 24q-1-14 11-17l9 8q9-4 17 0l10-8q12 5 11 21 4 23-29 24-30-1-29-28Z" fill="#d9c9f7"/>
   <path d="M74 19q0-8 8-10l7 8m28 1 7-8q8 4 7 12" fill="#b39be1" strokeWidth="2"/>
   <ellipse cx="87" cy="31" rx="2" ry="3" fill="#59436e" stroke="none"/><ellipse cx="107" cy="31" rx="2" ry="3" fill="#59436e" stroke="none"/>
   <ellipse cx="97" cy="36" rx="6" ry="4.5" fill="#fff6ec" strokeWidth="1.5"/><path d="m95 34 2 1 2-1m-2 1v3m0 0q-3 3-5 0m5 0q3 3 5 0" fill="none" strokeWidth="1.5"/>
   <circle cx="80" cy="37" r="3" fill="#ee9db5" stroke="none"/><circle cx="114" cy="37" r="3" fill="#ee9db5" stroke="none"/>
   <path d="M38 8q7-6 13 0l-6 7q-6-1-7-7Z" fill="#ef82a9"/><circle cx="45" cy="9" r="1.5" fill="#fff" stroke="none"/>
   <path d="m97 8 2-6 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="#ffe17b" strokeWidth="1.7"/>
  </g>
 </svg>;
}


export default class App extends React.Component<{},State>{
 private ticker:ReturnType<typeof setInterval>|undefined;
 state:State=initial(todayInSeoul());
 componentDidMount(){this.ticker=setInterval(()=>{const day=todayInSeoul();if(day!==this.state.day){this.setState(initial(day));return;}if(this.state.status==='playing')this.setState(s=>({seconds:s.seconds+1}));},1000);}
 componentWillUnmount(){if(this.ticker)clearInterval(this.ticker);}
 private tap=(id:number)=>this.setState(s=>{
  if(s.status!=='playing')return null;
  const clicked=s.tiles.find(t=>t.id===id);
  if(!clicked||!isFree(clicked,s.tiles))return null;
  const history=[...s.history,{tiles:s.tiles,tray:s.tray,matched:s.matched,moves:s.moves,shuffled:s.shuffled}].slice(-12);
  const tiles=s.tiles.filter(t=>t.id!==id);
  let tray=[...s.tray,clicked.kind],matched=s.matched;
  if(tray.filter(k=>k===clicked.kind).length>=3){let n=0;tray=tray.filter(k=>k===clicked.kind&&n++<3?false:true);matched+=3;}
  const cleared=tiles.length===0&&tray.length===0;
  const status:Status=cleared?(s.stage===1?'stageClear':'won'):tray.length>=7?'lost':'playing';
  let record=s.record;
  if(status==='won') {record=Math.min(s.record||Number.MAX_SAFE_INTEGER,s.seconds);put(REC_PREFIX+s.day,String(record));}
  return {tiles,tray,matched,moves:s.moves+1,status,history,hint:[],record};
 });
 private undo=()=>this.setState(s=>{
  if(!s.history.length||s.status==='won'||s.status==='stageClear')return null;
  const history=[...s.history],prev=history.pop()!;
  return {...prev,history,status:'playing' as Status,hint:[]};
 });
 private shuffle=()=>this.setState(s=>{
  if(s.status!=='playing'||s.shuffled)return null;
  const tiles=s.tiles.map(t=>({...t}));
  for(const layer of [...new Set(tiles.map(t=>t.layer))]){
   const group=tiles.filter(t=>t.layer===layer),kinds=group.map(t=>t.kind);
   for(let i=kinds.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[kinds[i],kinds[j]]=[kinds[j],kinds[i]];}
   group.forEach((tile,i)=>{tile.kind=kinds[i];});
  }
  return {tiles,shuffled:true,hint:[],history:[]};
 });
 private hint=()=>this.setState(s=>{
  if(s.status!=='playing')return null;
  const free=s.tiles.filter(t=>isFree(t,s.tiles));
  const groups=new Map<Icon,Tile[]>();for(const t of free)groups.set(t.kind,[...(groups.get(t.kind)||[]),t]);
  const inTray=(k:Icon)=>s.tray.filter(x=>x===k).length;
  const match=[...groups.entries()].filter(([k,ts])=>ts.length+inTray(k)>=3).sort(([a,aa],[b,bb])=>inTray(b)+bb.length-inTray(a)-aa.length)[0];
  const picks=match?match[1].slice(0,3-inTray(match[0])):free.slice(0,1);
  return {hint:picks.map(t=>t.id)};
 });
 private restart=()=>this.setState(s=>({...initial(s.day),help:false}));
 private nextStage=()=>this.setState(s=>({...initial(s.day,2,s.seconds,s.moves),help:false}));
 private closeHelp=()=>{put(HELP_KEY,'yes');this.setState({help:false});};
 render(){const s=this.state,date=s.day.split('-').slice(1).join('.');
  const free=s.tiles.filter(t=>isFree(t,s.tiles)).length;
  const pct=Math.round(s.matched/s.level.total*100);
  return <main className="app-page"><div className="game-shell">
   <header className="topbar"><div className="brand"><span className="brand-mark"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="25" r="15" fill="#fff2b8" stroke="#6b4a87" strokeWidth="3"/><path d="M16 8l3 5m13-5-3 5" stroke="#ffd76c" strokeWidth="4" strokeLinecap="round"/><circle cx="19" cy="23" r="1.7" fill="#513a70"/><circle cx="29" cy="23" r="1.7" fill="#513a70"/><path d="M19 29q5 5 10 0" fill="none" stroke="#ef879e" strokeWidth="2.5" strokeLinecap="round"/><path d="M33 29l8 4-5 5-7-5" fill="#f29a72" stroke="#6b4a87" strokeWidth="2"/><path d="M19 39l-5 5m13-5 4 5" stroke="#6b4a87" strokeWidth="3" strokeLinecap="round"/><path d="M36 18l5-3m-4 8 6 1" stroke="#ffbb54" strokeWidth="2.5" strokeLinecap="round"/></svg></span><span className="brand-text"><b>칼퇴하자!</b><small>CLOCK OUT!</small></span></div><button className="help-button" onClick={()=>this.setState({help:true})} aria-label="게임 방법 보기">?</button></header>
   <section className="challenge"><div className="mission-topline"><div className="challenge-badge"><span className="badge-spark">✦</span><span>오늘의 미션</span><b>정시 퇴근 도전</b></div><PetPortraits className="pet-portraits"/></div><div className="date-ribbon">✧ {date} 오늘의 도전 ✧</div><h1>오늘은 <span>칼퇴할 수 있을까?</span></h1><p>같은 그림 3개를 모아 퇴근 준비 끝!</p>
    <div className="stage-strip"><span className={s.stage===1?'active-stage':''}>01 <b>퇴근 준비</b></span><span className="stage-connector">···</span><span className={s.stage===2?'active-stage':''}>02 <b>야근 지옥</b></span><span className="timer">◷ {formatTime(s.seconds)}</span></div>
   </section>
   <section className="game-board-card" aria-label="블록 게임판">
    <div className="board-meta"><span className="board-level">{s.stage===1?'1단계 · 퇴근 준비':'2단계 · 야근 지옥'} <em>{s.stage===1?'18장 · 3가지 그림':'135장 · 9가지 그림'}</em></span><span className="remaining">남은 블록 <b>{s.tiles.length}</b></span></div>
    {s.stage===1&&<div className="tutorial-pals"><PetPortraits className="tutorial-portraits"/><span><b>나비 & 몽이의 첫 미션</b><small>같은 그림 3장을 모아 퇴근 가방을 채워요!</small></span><i>✦</i></div>}
    <div className={`board-field ${s.stage===1?'board-field-easy':''}`}>
     {s.tiles.map(t=>{const exposed=isFree(t,s.tiles);return <button type="button" key={t.id} data-tile-id={t.id} title={names[t.kind]} aria-label={`${names[t.kind]} 블록`} disabled={!exposed} onClick={()=>this.tap(t.id)} className={`tile ${exposed?'':'tile-covered'} ${s.hint.includes(t.id)?'tile-hint':''}`}
      style={{left:`${(t.x+.5)/s.level.cols*100}%`,top:`${(t.y+.5)/s.level.rows*100}%`,zIndex:10+t.layer}}><TileIcon kind={t.kind}/></button>;})}
    </div>
    <div className="board-progress"><span>클리어까지 <b>{pct}%</b></span><div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`}}/></div><span>✦</span></div>
   </section>
   <section className="tray-wrap"><div className="tray-title"><span>퇴근 가방 <small>같은 그림 3개를 모아 퇴근!</small></span><strong className={s.tray.length>=5?'danger':''}>{s.tray.length}/7</strong></div>
    <div className="tray-rail"><div className="tray">{Array.from({length:7},(_,i)=><div className={`tray-slot ${s.tray[i]?'filled':''}`} key={i}>{s.tray[i]?<TinyIcon kind={s.tray[i]}/>:<span className="slot-empty">·</span>}</div>)}</div></div>
   </section>
   <section className="powerups" aria-label="도움 아이템">
    <button onClick={this.undo} disabled={!s.history.length||s.status==='won'||s.status==='stageClear'}><span className="power-icon">↶</span><b>되돌리기</b></button>
    <button onClick={this.shuffle} disabled={s.shuffled||s.status!=='playing'}><span className="power-icon">⤨</span><b>섞기 {s.shuffled?'✓':''}</b></button>
    <button onClick={this.hint} disabled={s.status!=='playing'}><span className="power-icon">✧</span><b>힌트</b></button>
   </section>
   <div className="footline"><span>MADE BY VIONIASOFT</span><button onClick={this.restart}>⟳ 처음부터</button></div>
   {(s.help||s.status!=='playing')&&<div className="modal-backdrop" role="dialog" aria-modal="true"><div className="modal">
    {s.status==='stageClear'?<><div className="modal-art">✨</div><span className="modal-tag">STAGE 01 CLEAR!</span><h2>퇴근 준비 완료!</h2><p>가벼운 정리는 끝났어요!<br/>파일 산에 쌓인 야근 업무도 정리해 볼까요?</p><button className="primary" onClick={this.nextStage}>2단계 도전하기 →</button></>
    :s.status==='won'?<><div className="modal-art">🏆</div><span className="modal-tag">MISSION COMPLETE</span><h2>칼퇴 성공! 🎉</h2><p>오늘의 미션을 모두 클리어했어요.<br/>내일 새로운 도전이 열립니다.</p><div className="modal-result">◷ {formatTime(s.seconds)} · {s.moves}번 이동</div><button className="primary" onClick={this.restart}>다시 플레이</button></>
    :s.status==='lost'?<><div className="modal-art">💔</div><h2>오늘도 야근 확정... 😭</h2><p>퇴근 가방이 가득 찼어요.<br/>한 수 되돌리거나 다시 도전해 보세요.</p><button className="primary" onClick={this.undo} disabled={!s.history.length}>↶ 한 수 되돌리기</button><button className="modal-secondary" onClick={this.restart}>처음부터 다시 시작</button></>
    :<><div className="modal-art">☕</div><span className="modal-tag">HOW TO PLAY</span><h2>3개를 모으면 퇴근!</h2><div className="instructions"><div><b>①</b> 위에 다른 블록이 없는 카드를 터치!</div><div><b>②</b> 같은 그림 3개가 모이면 자동으로 사라져요.</div><div><b>③</b> 아래 보관함 7칸이 꽉 차면 실패!</div></div><p>1단계는 어떤 순서로 눌러도 안전해요.<br/>2단계는 파일 산 속 가려진 블록을 살펴보세요.</p><button className="primary" onClick={this.closeHelp}>게임 시작하기 →</button></>}
   </div></div>}
  </div></main>;
 }
}