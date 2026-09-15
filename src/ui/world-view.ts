import { BRIDGES, ROADS, TOWNS, WORLD, type Point } from "../data/world";
import type { WorldPassability } from "../game/passability";
import { WorldPlayerState } from "../game/world-player-state";

export class WorldView {
  private readonly context: CanvasRenderingContext2D;
  private readonly baseMap = new Image();
  private readonly pressed = new Set<string>();
  private lastFrame = performance.now();
  private frame = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly passability: WorldPassability,
    private readonly onPosition: (position: Point | null) => void,
    private readonly playerState = new WorldPlayerState(),
  ) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("World canvas is unavailable");
    this.context = context;
  }

  async start(source: string): Promise<void> {
    this.baseMap.src = source;
    await this.baseMap.decode();
    this.resize();
    addEventListener("resize", this.resize);
    addEventListener("keydown", this.keyDown);
    addEventListener("keyup", this.keyUp);
    this.frame = requestAnimationFrame(this.tick);
  }

  destroy(): void {
    cancelAnimationFrame(this.frame);
    removeEventListener("resize", this.resize);
    removeEventListener("keydown", this.keyDown);
    removeEventListener("keyup", this.keyUp);
  }

  setOrigin(position: Point): void {
    this.playerState.setOrigin(position);
    this.onPosition(this.playerState.getPosition());
  }

  setDirection(direction: string, active: boolean): void {
    active ? this.pressed.add(direction) : this.pressed.delete(direction);
  }

  private resize = (): void => {
    const ratio = devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  private keyDown = (event: KeyboardEvent): void => {
    this.pressed.add(event.key);
  };

  private keyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.key);
  };

  private tick = (now: number): void => {
    const elapsed = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    this.move(elapsed);
    this.draw();
    this.frame = requestAnimationFrame(this.tick);
  };

  private move(elapsed: number): void {
    const dx = Number(this.pressed.has("ArrowRight") || this.pressed.has("right"))
      - Number(this.pressed.has("ArrowLeft") || this.pressed.has("left"));
    const dy = Number(this.pressed.has("ArrowDown") || this.pressed.has("down"))
      - Number(this.pressed.has("ArrowUp") || this.pressed.has("up"));
    if (!dx && !dy) return;

    const previous = this.playerState.getPosition();
    const next = this.playerState.move({ x: dx, y: dy }, elapsed, this.passability);
    if (next && next !== previous) this.onPosition(next);
  }

  private draw(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    this.context.clearRect(0, 0, width, height);

    const position = this.playerState.getPosition();
    if (!position) {
      this.context.fillStyle = "#17140f";
      this.context.fillRect(0, 0, width, height);
      return;
    }

    const cameraX = position[0] - width / 2;
    const cameraY = position[1] - height / 2;
    this.context.drawImage(this.baseMap, -cameraX, -cameraY, WORLD.width, WORLD.height);
    this.context.save();
    this.context.translate(-cameraX, -cameraY);
    this.context.strokeStyle = "#b99052";
    this.context.lineWidth = 18;
    this.context.lineCap = "round";
    this.context.lineJoin = "round";

    for (const road of ROADS) {
      this.context.beginPath();
      road.points.forEach(([x, y], index) => (
        index ? this.context.lineTo(x, y) : this.context.moveTo(x, y)
      ));
      this.context.stroke();
    }

    for (const bridge of BRIDGES) {
      this.context.save();
      this.context.translate(...bridge.center);
      this.context.rotate(bridge.angleDegrees * Math.PI / 180);
      this.context.fillStyle = "#9a8461";
      this.context.fillRect(-bridge.length / 2, -52, bridge.length, 104);
      this.context.restore();
    }

    for (const town of TOWNS) {
      const [x, y] = town.position;
      this.context.fillStyle = "#cfb472";
      this.context.beginPath();
      this.context.arc(x, y, 10, 0, Math.PI * 2);
      this.context.fill();
      this.context.font = "18px serif";
      this.context.fillText(town.name, x + 16, y + 6);
    }

    this.context.restore();
    this.context.fillStyle = "#e8d5a4";
    this.context.beginPath();
    this.context.arc(width / 2, height / 2, WORLD.spriteWidthPx / 2, 0, Math.PI * 2);
    this.context.fill();
    this.context.strokeStyle = "#34291c";
    this.context.lineWidth = 2;
    this.context.stroke();
  }
}
