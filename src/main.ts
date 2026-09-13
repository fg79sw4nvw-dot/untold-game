import "./styles.css";
import { TOWNS, type Point } from "./data/world";
import { SpecifiedCardCollection } from "./domain/specified-cards";
import { PassabilityMask } from "./game/passability";
import { WorldView } from "./game/world-view";
import { BookView } from "./ui/book-view";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `<main class="game-shell"><canvas id="world" aria-label="UNTOLD開発用ワールド"></canvas><header class="hud"><span>HP -- / 100</span><span>空腹 -- / 100</span><span>ジェニー --</span><span>時刻 --:--</span></header><div class="pending">確定基礎マスク表示（仮素材）</div><nav class="actions"><button data-panel="book">BOOK</button><button disabled>CARD</button><button disabled>MAP</button></nav><section class="origin" role="dialog"><h1>UNTOLD</h1><p>開始地点は未確定です。移動確認用の起点を選択してください。</p><select id="origin"><option value="">開発用起点</option>${TOWNS.map(t=>`<option value="${t.id}">${t.name}</option>`).join("")}</select><button id="begin" disabled>移動確認を開始</button></section><div class="position">座標: 未選択</div><div class="dpad"><button data-dir="up">▲</button><button data-dir="left">◀</button><button data-dir="down">▼</button><button data-dir="right">▶</button></div><dialog id="book"></dialog></main>`;

const source = "/assets/elden-terrain-mask-final.svg";
const canvas = document.querySelector<HTMLCanvasElement>("#world")!;
const positionLabel = document.querySelector<HTMLDivElement>(".position")!;
const mask = new PassabilityMask();
await mask.load(source);
const world = new WorldView(canvas, mask, (position: Point | null) => { positionLabel.textContent = position ? `座標: ${Math.round(position[0])}, ${Math.round(position[1])}` : "座標: 未選択"; });
await world.start(source);

const select = document.querySelector<HTMLSelectElement>("#origin")!;
const begin = document.querySelector<HTMLButtonElement>("#begin")!;
select.addEventListener("change",()=>{ begin.disabled=!select.value; });
begin.addEventListener("click",()=>{ const town=TOWNS.find(t=>t.id===select.value); if(!town)return; world.setOrigin(town.position); document.querySelector(".origin")?.remove(); });
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-dir]")) { const direction=button.dataset.dir!; for(const start of ["pointerdown","touchstart"]){button.addEventListener(start,e=>{e.preventDefault();world.setDirection(direction,true);});} for(const end of ["pointerup","pointercancel","pointerleave","touchend"]){button.addEventListener(end,e=>{e.preventDefault();world.setDirection(direction,false);});} }

const specifiedCards = new SpecifiedCardCollection();
const book=document.querySelector<HTMLDialogElement>("#book")!;
const bookView=new BookView(book, specifiedCards);
document.querySelector<HTMLButtonElement>("[data-panel=book]")!.addEventListener("click",()=>bookView.open());
