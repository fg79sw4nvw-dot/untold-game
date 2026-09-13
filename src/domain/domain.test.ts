import { describe, expect, it } from "vitest";
import { GameClock, timeBand } from "./clock";
import { equip, unequip, type EquipmentCard } from "./equipment";
import { addCard, addMaterial, FREE_POCKET_CAPACITY, type PocketCard } from "./inventory";
import { RecordBook, type RecordEntry } from "./records";
const card=(id:string):EquipmentCard=>({instanceId:id,definitionId:"coat",category:"equipment",equipmentSlot:"wear"});
const record=(id:string,clues:string[]=[]):RecordEntry=>({id,text:`text-${id}`,sourceType:"npc",sourceId:"npc",locationId:"eld",recordedAt:"",clueIds:clues,marks:[]});
describe("confirmed domain rules",()=>{
 it("uses 180 slots and stacks only material to 99",()=>{let inv=[] as ReturnType<typeof addMaterial>["inventory"]; inv=addMaterial(inv,"wood",98).inventory; const result=addMaterial(inv,"wood",4); expect(result.inventory).toEqual([{definitionId:"wood",category:"material",quantity:99}]); expect(result.discarded).toBe(3); expect(FREE_POCKET_CAPACITY).toBe(180);});
 it("requires space for a new non-material card",()=>{let inv=[] as PocketCard[]; for(let i=0;i<180;i++) inv=addCard(inv,card(String(i))).inventory as PocketCard[]; expect(addCard(inv,card("overflow")).needsSpace).toBe(true);});
 it("moves equipment outside pocket capacity and blocks unequip at capacity",()=>{const first=card("a"); const worn=equip([first],{},"a","wear"); expect(worn.inventory).toHaveLength(0); const full=Array.from({length:180},(_,i)=>card(String(i))); expect(unequip(full,worn.equipped,"wear").blocked).toBe(true);});
 it("counts shared clues and removes only one source",()=>{const book=new RecordBook(); book.add(record("a",["clue"])); book.add(record("b",["clue"])); book.delete("a"); expect(book.clueCount("clue")).toBe(1);});
 it("advances two game minutes per real second and cycles seasons",()=>{const clock=new GameClock({season:"spring",day:3,hour:23,minute:59}); clock.setPaused(false); clock.advanceRealSeconds(1); expect(clock.time).toEqual({season:"summer",day:1,hour:0,minute:1}); expect(timeBand(20)).toBe("night");});
});
