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
const palette:Record<Icon,string>={coffee:'#bd87dd',headphones:'#8e8ae6',bag:'#e9a271',phone:'#75afd6',bus:'#6fa9cf',laptop:'#897de2',clock:'#e89ab0',folder:'#e69caf',key:'#8db4ce'};
const names:Record<Icon,string>={coffee:'커피',headphones:'헤드폰',bag:'가방',phone:'휴대폰',bus:'버스',laptop:'노트북',clock:'알람시계',folder:'파일 폴더',key:'열쇠'};

function TileIcon({kind}: {kind:Icon}){
 const shape:Record<Icon,React.ReactNode>={
  coffee:<g><path d="M5 9h13v5a6.5 6.5 0 0 1-13 0V9Z"/><path d="M18 10h2.4a2.1 2.1 0 0 1 0 4.2H18M5 21h15M9 3v3M14 3v3"/></g>,
  headphones:<g><path d="M4.2 14V12a7.8 7.8 0 0 1 15.6 0v2"/><rect x="3.2" y="12.5" width="4.4" height="7.2" rx="2"/><rect x="16.4" y="12.5" width="4.4" height="7.2" rx="2"/></g>,
  bag:<g><rect x="4" y="8" width="16" height="13" rx="2.5"/><path d="M9 8V6a3 3 0 0 1 6 0v2M4 13h16M10 13v2h4v-2"/></g>,
  phone:<g><rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M10 5h4M11.5 18h1"/></g>,
  bus:<g><path d="M4 17V7q0-3 4-3h8q4 0 4 3v10H4Z" fill="#8fc9e9" stroke="#4c7898"/><path d="M7 7h10v5H7z" fill="#eafaff" stroke="#4c7898"/><path d="M9 8v3m6-3v3" stroke="#78badc"/><circle cx="8" cy="17" r="2" fill="#544765"/><circle cx="16" cy="17" r="2" fill="#544765"/><path d="M6 14h12" stroke="#fff"/></g>,
  laptop:<g><rect x="5" y="4" width="14" height="12" rx="2" fill="#a99aea" stroke="#6d5ca5"/><rect x="7" y="6" width="10" height="8" rx="1" fill="#ddf5ff" stroke="#fff"/><path d="m3 19 2-3h14l2 3q0 1-2 1H5q-2 0-2-1Z" fill="#7971ba" stroke="#61558f"/><circle cx="12" cy="10" r="1" fill="#f5c962"/></g>,
  clock:<g><path d="m7 4-2-2m14 2 2-2" stroke="#9c70b3" strokeWidth="2.5"/><circle cx="12" cy="13" r="8" fill="#ffdf7c" stroke="#b27a52"/><circle cx="9" cy="12" r=".8" fill="#57435e"/><circle cx="15" cy="12" r=".8" fill="#57435e"/><path d="M9 16q3 2 6 0M12 8v4l2 1" fill="none" stroke="#76516d" strokeWidth="1.4" strokeLinecap="round"/></g>,
  folder:<g><path d="M3 7q0-2 2-2h5l2 2h7q2 0 2 2v9q0 2-2 2H5q-2 0-2-2Z" fill="#edacc3" stroke="#a9658f"/><path d="M4 10h16" stroke="#ffebf1" strokeWidth="2"/><path d="M7 13h9m-9 3h6" stroke="#b9789d"/></g>,
  key:<g><circle cx="8" cy="9" r="4"/><path d="m11 12 8 8M15 16l2.5-2.5M17 18l2.5-2.5"/></g>
 };
 return <svg className="tile-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke={palette[kind]} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{shape[kind]}</svg>;
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