export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = typeof SEASONS[number];
export type GameTime = { season: Season; day: 1 | 2 | 3; hour: number; minute: number };
export type TimeBand = "morning" | "day" | "evening" | "night";

export function timeBand(hour: number): TimeBand { if (hour >= 6 && hour < 9) return "morning"; if (hour >= 9 && hour < 17) return "day"; if (hour >= 17 && hour < 20) return "evening"; return "night"; }

export class GameClock {
  private paused = true;
  constructor(public time: GameTime) {}
  setPaused(paused: boolean): void { this.paused = paused; }
  advanceRealSeconds(seconds: number): void { if (this.paused) return; this.advanceGameMinutes(seconds * 2); }
  changeSeason(season: Season): void { this.time = { ...this.time, season, day: 1 }; }
  private advanceGameMinutes(minutes: number): void {
    let total = this.time.hour * 60 + this.time.minute + minutes;
    let day = this.time.day as number, seasonIndex = SEASONS.indexOf(this.time.season);
    while (total >= 1440) { total -= 1440; day++; if (day > 3) { day = 1; seasonIndex = (seasonIndex + 1) % SEASONS.length; } }
    this.time = { season: SEASONS[seasonIndex], day: day as 1|2|3, hour: Math.floor(total/60), minute: total%60 };
  }
}
