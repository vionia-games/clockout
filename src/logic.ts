/** Reproducible puzzle layouts. All art and UI are original. */
export const ICONS = ['coffee', 'headphones', 'bag', 'phone', 'bus', 'laptop', 'clock', 'folder', 'key'] as const;
export type Icon = typeof ICONS[number];
export interface Tile { id: number; kind: Icon; layer: number; x: number; y: number; }
export interface Level { stage: number; cols: number; rows: number; total: number; tiles: Tile[]; solution: number[][]; }

export function todayInSeoul(now: Date = new Date()): string {
  const p = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const v = (s: string) => p.find(x => x.type === s)!.value;
  return `${v('year')}-${v('month')}-${v('day')}`;
}
function hash(value:string):number {let s=2166136261;for(let i=0;i<value.length;i++){s^=value.charCodeAt(i);s=Math.imul(s,16777619);}return s>>>0;}
function rng(seed:number){let n=seed||1;return ()=>{n=(n+0x6d2b79f5)|0;let z=Math.imul(n^(n>>>15),1|n);z^=z+Math.imul(z^(z>>>7),61|z);return((z^(z>>>14))>>>0)/4294967296;};}
function shuffle<T>(a:T[],r:()=>number):T[]{const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[j],out[i]]=[out[i],out[j]];}return out;}
export function isFree(tile:Tile, remaining:Tile[]):boolean {
  return !remaining.some(t=>t.id!==tile.id && t.layer>tile.layer && Math.abs(t.x-tile.x)<.89 && Math.abs(t.y-tile.y)<.89);
}
const readRows=(rows:string[], ox=0, oy=0) => rows.flatMap((row,y)=>[...row].flatMap((cell,x)=>cell==='#'?[{x:x+ox,y:y+oy}]:[]));
const FILE_MOUND=readRows([
  '....####....',
  '..######....',
  '.####.###...',
  '##.####.##..',
  '.###.####...',
  '..######....',
  '...#######..'
]);
const SIDE_FILES=[{x:-1,y:3},{x:-1,y:4},{x:-1,y:5},{x:10,y:2},{x:10,y:3},{x:10,y:4},{x:4,y:7},{x:5,y:7},{x:6,y:7}];
const TOP_FILES=[...FILE_MOUND.slice(0,27),...SIDE_FILES.slice(0,9)];
function officeMound():Array<Omit<Tile,'kind'>> {
  const base=FILE_MOUND;
  const middle=[...base,...SIDE_FILES];
  const top=TOP_FILES;
  let id=0;
  return [
    ...base.map(p=>({id:id++,layer:0,x:p.x+1,y:p.y})),
    ...middle.map(p=>({id:id++,layer:1,x:p.x+1.12,y:p.y-.12})),
    ...top.map(p=>({id:id++,layer:2,x:p.x+1.24,y:p.y-.24}))
  ];
}
export function generateLevel(date:string,stage:number):Level {
  const hard=stage===2;
  const rand=rng(hash(`${date}:clockout-tiles-v4:${stage}`));
  let id=0;
  if(!hard){
    const positions:Array<Omit<Tile,'kind'>>=[];
    for(let y=0;y<3;y++)for(let x=0;x<3;x++)positions.push({id:id++,layer:0,x,y});
    for(let y=0;y<3;y++)for(let x=0;x<3;x++)positions.push({id:id++,layer:1,x:x+.1,y:y-.1});
    const kinds=ICONS.slice(0,3),assigned=new Map<number,Icon>(),solution:number[][]=[];
    for(const layer of [1,0]){
      const cards=shuffle(positions.filter(p=>p.layer===layer),rand);
      const arrangement=shuffle([...Array(3).fill(kinds[0]),...Array(3).fill(kinds[1]),...Array(3).fill(kinds[2])] as Icon[],rand);
      cards.forEach((p,i)=>assigned.set(p.id,arrangement[i]));
      for(const icon of kinds)solution.push(cards.filter(p=>assigned.get(p.id)===icon).map(p=>p.id));
    }
    return {stage,cols:3,rows:3,total:18,tiles:positions.map(p=>({...p,kind:assigned.get(p.id)!})),solution};
  }
  const positions=officeMound();
  const assigned=new Map<number,Icon>(),solution:number[][]=[];
  for(const layer of [2,1,0]){
    const pool=shuffle(positions.filter(p=>p.layer===layer),rand);
    for(let i=0;i<pool.length;i+=3){
      const group=pool.slice(i,i+3),kind=ICONS[Math.floor(rand()*ICONS.length)];
      group.forEach(p=>assigned.set(p.id,kind));solution.push(group.map(p=>p.id));
    }
  }
  return {stage,cols:14,rows:8,total:positions.length,tiles:positions.map(p=>({...p,kind:assigned.get(p.id)!})),solution};
}
export function formatTime(seconds:number):string {return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}