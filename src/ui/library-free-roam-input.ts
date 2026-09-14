import { ELD_LIBRARY_PIXEL_SIZE } from "../data/eld-library";
import {
  moveWithAxisSliding,
  type AxisAlignedRect,
} from "../game/axis-aligned-collision";
import {
  FloatingFieldInput,
  movementDelta,
  type DirectionVector,
} from "../game/floating-field-input";
import type { LibraryOpeningView } from "./library-opening-view";

const LIBRARY_BOUNDS: AxisAlignedRect = {
  left: 0,
  top: 0,
  right: ELD_LIBRARY_PIXEL_SIZE[0],
  bottom: ELD_LIBRARY_PIXEL_SIZE[1],
};

type TapHandler = () => void | Promise<void>;

export class LibraryFreeRoamInput {
  private readonly input = new FloatingFieldInput();
  private activePointerId: number | null = null;
  private direction: DirectionVector | null = null;
  private animationFrame: number | null = null;
  private previousFrameTime: number | null = null;

  constructor(
    private readonly stage: HTMLElement,
    private readonly view: LibraryOpeningView,
    private readonly onTap: TapHandler,
  ) {
    stage.addEventListener("pointerdown", this.handlePointerDown);
    stage.addEventListener("pointermove", this.handlePointerMove);
    stage.addEventListener("pointerup", this.handlePointerUp);
    stage.addEventListener("pointercancel", this.handlePointerCancel);
  }

  private isEnabled(): boolean {
    return this.view.getOpeningPhase().startsWith("free-library");
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (!this.isEnabled() || this.activePointerId !== null) return;
    this.activePointerId = event.pointerId;
    this.stage.setPointerCapture?.(event.pointerId);
    this.input.begin({ x: event.clientX, y: event.clientY });
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId || !this.isEnabled()) return;
    const update = this.input.update({ x: event.clientX, y: event.clientY });
    if (update.kind !== "move") return;
    this.direction = update.direction;
    this.view.faceMovementDirection(update.direction);
    this.ensureMovementLoop();
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;
    const release = this.input.end({ x: event.clientX, y: event.clientY });
    this.releasePointer(event.pointerId);
    this.stopMovement();
    if (release.kind === "tap" && this.isEnabled()) void this.onTap();
  };

  private readonly handlePointerCancel = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId) return;
    this.input.cancel();
    this.releasePointer(event.pointerId);
    this.stopMovement();
  };

  private releasePointer(pointerId: number): void {
    if (this.stage.hasPointerCapture?.(pointerId)) this.stage.releasePointerCapture(pointerId);
    this.activePointerId = null;
  }

  private ensureMovementLoop(): void {
    if (this.animationFrame !== null) return;
    this.previousFrameTime = null;
    this.animationFrame = requestAnimationFrame(this.stepMovement);
  }

  private readonly stepMovement = (time: number): void => {
    this.animationFrame = null;
    if (!this.direction || !this.isEnabled()) {
      this.previousFrameTime = null;
      return;
    }

    const previous = this.previousFrameTime ?? time;
    const elapsedSeconds = Math.max(0, (time - previous) / 1000);
    this.previousFrameTime = time;

    if (elapsedSeconds > 0) {
      const current = this.view.getProtagonistPosition();
      const delta = movementDelta(this.direction, elapsedSeconds);
      const next = moveWithAxisSliding(
        current,
        delta,
        this.view.getCollisionObstacles(),
        LIBRARY_BOUNDS,
      );
      this.view.setProtagonistPosition(next);
    }

    this.animationFrame = requestAnimationFrame(this.stepMovement);
  };

  private stopMovement(): void {
    this.direction = null;
    this.previousFrameTime = null;
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }
}
