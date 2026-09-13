import { FREE_POCKET_CATEGORIES } from "../domain/inventory";

const CATEGORY_LABELS: Record<(typeof FREE_POCKET_CATEGORIES)[number], string> = { spell:"スペル", food:"食料", equipment:"装備", event:"イベント用", other:"その他", material:"素材", valuable:"換金品" };

export class BookView {
  private specifiedPage = 0;
  private startX: number | null = null;
  constructor(private dialog: HTMLDialogElement) {
    dialog.innerHTML = `<button class="close" aria-label="閉じる">×</button><h2>BOOK</h2><nav class="book-tabs"><button data-book-tab="specified">指定ポケット</button><button data-book-tab="free">フリーポケット</button><button data-book-tab="records">記録</button><button data-book-tab="recipes">レシピ</button></nav><section class="book-content"></section>`;
    dialog.querySelector<HTMLButtonElement>(".close")!.addEventListener("click",()=>dialog.close());
    dialog.querySelectorAll<HTMLButtonElement>("[data-book-tab]").forEach(button=>button.addEventListener("click",()=>this.render(button.dataset.bookTab!)));
    this.render("specified");
  }
  open(): void { this.dialog.showModal(); }
  private render(tab: string): void {
    const content=this.dialog.querySelector<HTMLElement>(".book-content")!;
    this.dialog.querySelectorAll("[data-book-tab]").forEach(button=>button.classList.toggle("active",(button as HTMLElement).dataset.bookTab===tab));
    if(tab==="specified") this.renderSpecified(content);
    if(tab==="free") this.renderFree(content);
    if(tab==="records") content.innerHTML=`<h3>記録</h3><div class="empty-state">記録はありません</div><p>0 / 99</p>`;
    if(tab==="recipes") content.innerHTML=`<h3>レシピ</h3><div class="empty-state">習得済みのレシピはありません</div>`;
  }
  private renderSpecified(content: HTMLElement): void {
    const first=this.specifiedPage*9+1;
    content.innerHTML=`<h3>指定ポケット</h3><div class="book-grid">${Array.from({length:9},(_,i)=>`<div>No.${String(first+i).padStart(2,"0")}</div>`).join("")}</div><div class="pager"><button data-page="previous" ${this.specifiedPage===0?"disabled":""}>←</button><span>${this.specifiedPage+1} / 11</span><button data-page="next" ${this.specifiedPage===10?"disabled":""}>→</button></div>`;
    content.querySelectorAll<HTMLButtonElement>("[data-page]").forEach(button=>button.addEventListener("click",()=>this.changePage(button.dataset.page==="next"?1:-1,content)));
    content.addEventListener("pointerdown",event=>{this.startX=event.clientX;},{once:true});
    content.addEventListener("pointerup",event=>{if(this.startX===null)return; const delta=event.clientX-this.startX; this.startX=null; if(Math.abs(delta)>=40)this.changePage(delta<0?1:-1,content);},{once:true});
  }
  private changePage(delta:number,content:HTMLElement):void { this.specifiedPage=Math.max(0,Math.min(10,this.specifiedPage+delta)); this.renderSpecified(content); }
  private renderFree(content: HTMLElement): void {
    content.innerHTML=`<h3>フリーポケット</h3><nav class="category-tabs">${FREE_POCKET_CATEGORIES.map((id,index)=>`<button data-category="${id}" class="${index===0?"active":""}">${CATEGORY_LABELS[id]}</button>`).join("")}</nav><div class="equipment-slots" hidden><div>着用枠</div><div>汎用枠</div><div>汎用枠</div></div><div class="free-grid">${Array.from({length:9},()=>"<div></div>").join("")}</div><p>0 / 180</p><div class="pager"><button disabled>←</button><span>1 / 1</span><button disabled>→</button></div>`;
    const equipment=content.querySelector<HTMLElement>(".equipment-slots")!;
    content.querySelectorAll<HTMLButtonElement>("[data-category]").forEach(button=>button.addEventListener("click",()=>{content.querySelectorAll("[data-category]").forEach(item=>item.classList.remove("active"));button.classList.add("active");equipment.hidden=button.dataset.category!=="equipment";}));
  }
}
