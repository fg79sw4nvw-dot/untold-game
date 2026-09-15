import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const maps = {
  "eld-library": {
    width: 640,
    height: 1024,
    tile: 64,
    fixtures: [
      ["shelf",0,0,10,1],["shelf",0,1,1,6],["shelf",9,1,1,5],
      ["shelf",3,4,5,1],["shelf",3,7,5,1],["shelf",4,10,5,1],
      ["counter",1,12,1,3],["stairs",0,12,1,1],["desk",5,13,4,1],
    ],
    stools: [[5,12],[6,12],[7,12],[8,12]],
    characters: [{kind:"librarian",tile:[0,13],facing:"right"}],
    markers: [{kind:"book",tile:[3,4],label:"BOOK"}],
    entrance: {xTiles:[4,5]},
  },
};

const mapId = process.argv[2] ?? "eld-library";
const map = maps[mapId];
if (!map) throw new Error(`Unknown map: ${mapId}. Available: ${Object.keys(maps).join(", ")}`);

const esc = s => String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const tileRect = ([kind,x,y,w,h]) => {
  const cls = `fixture ${kind}`;
  return `<rect class="${cls}" x="${x*map.tile}" y="${y*map.tile}" width="${w*map.tile}" height="${h*map.tile}"/>`;
};
const center = ([x,y]) => [(x+.5)*map.tile,(y+.5)*map.tile];
const facingGlyph = {up:"▲",right:"▶",down:"▼",left:"◀"};

const fixtures = map.fixtures.map(tileRect).join("\n");
const stools = map.stools.map(t => { const [x,y]=center(t); return `<circle class="stool" cx="${x}" cy="${y}" r="16"/>`; }).join("\n");
const chars = map.characters.map(c => { const [x,y]=center(c.tile); return `<g><rect class="character ${c.kind}" x="${x-24}" y="${y-24}" width="48" height="48" rx="12"/><text x="${x}" y="${y+5}" text-anchor="middle">${facingGlyph[c.facing]??""}</text></g>`; }).join("\n");
const markers = map.markers.map(m => { const [x,y]=center(m.tile); return `<g><rect class="marker" x="${x-24}" y="${y-11}" width="48" height="22"/><text x="${x}" y="${y+4}" text-anchor="middle">${esc(m.label)}</text></g>`; }).join("\n");
const entranceX = Math.min(...map.entrance.xTiles)*map.tile;
const entranceW = map.entrance.xTiles.length*map.tile;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${map.width}" height="${map.height}" viewBox="0 0 ${map.width} ${map.height}">
<style>
.room{fill:#211b13;stroke:#6f604a;stroke-width:4}.fixture{fill:#493a25;stroke:#7a6545;stroke-width:2}.counter{fill:#5a452b}.stairs{fill:#17140f}.desk{fill:#624c30}.stool{fill:#4b3823;stroke:#7a6545;stroke-width:2}.character{stroke:#cbb58a;stroke-width:2}.librarian{fill:#554b6d}.marker{fill:#2d2115;stroke:#b69a63}.entrance{fill:#17140f}text{fill:#f1e5c8;font:12px system-ui,sans-serif}
</style>
<rect class="room" x="2" y="2" width="${map.width-4}" height="${map.height-4}"/>
${fixtures}
${stools}
${chars}
${markers}
<rect class="entrance" x="${entranceX}" y="${map.height-4}" width="${entranceW}" height="4"/>
</svg>`;

const outDir = resolve("previews");
await mkdir(outDir,{recursive:true});
const out = resolve(outDir,`${mapId}.svg`);
await writeFile(out,svg,"utf8");
console.log(out);
