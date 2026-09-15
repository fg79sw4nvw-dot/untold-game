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
import { attemptsLibraryExit } from "../game/library-exit-trigger";
import { ELD_LIBRARY_COLLISION_OBSTACLES } from "../game/library-collision";
import type { LibraryInteractionState } from "../game/library-interaction-state";
import type { LibraryPlayerState } from "../game/library-player-state";
import type { LibraryOpeningView } from "./library-opening-view";

const LIBRARY_BOUNDS: AxisAlignedRect = {
  left: 0,
  top: 0,
  right: ELD_LIBRARY_PIXEL_SIZE[0],
  bottom: ELD_LIBRARY_PIXEL_SIZE[1],
};

type TapHandler = () => void | Promise<void>;
type ExitHandler = () => void | Promise<void>;

export class LibraryFreeRoamInput {
  private readonly input = new FloatingFieldInput();
  private activePointerId: number | null = null;
  private direction: DirectionVector | null = null;
  private animationFrame: number | null = null;
  private previousFrameTime: number | null = null;
  private exitPending = false;

  constructor(
    private readonly stage: HTMLElement,
    private readonly view: LibraryOpeningView,
    private readonly playerState: LibraryPlayerState,
    private readonly interactionState: LibraryInteractionState,
    private readonly onTap: TapHandler,
    private readonly onExit: ExitHandler,
  ) {
    stage.addEventListener("pointerdown", this.handlePointerDown);
    stage.addEventListener("pointermove", this.handlePointerMove);
    stage.addEventListener("pointerup", this.handlePointerUp);
    stage.addEventListener("pointercancel", this.handlePointerCancel);
  }

  private isEnabled(): boolean {
    return this.interactionState.allowsFreeRoam();
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (!this.isEnabled() || this.activePointerId !== null || this.exitPending) return;
    this.activePointerId = event.pointerId;
    this.stage.setPointerCapture?.(event.pointerId);
    this.input.begin({ x: event.clientX, y: event.clientY });
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerId !== this.activePointerId || !this.isEnabled() || this.exitPending) return;
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
    if (release.kind === "tap" && this.isEnabled() && !this.exitPending) void this.onTap();
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

  private stopCurrentPointer(): void {
    this.input.cancel();
    if (this.activePointerId !== null) this.releasePointer(this.activePointerId);
    this.stopMovement();
  }

  private ensureMovementLoop(): void {
    if (this.animationFrame !== null) return;
    this.previousFrameTime = null;
    this.animationFrame = requestAnimationFrame(this.stepMovement);
  }

  private readonly stepMovement = (time: number): void => {
    this.animationFrame = null;
    if (!this.direction || !this.isEnabled() || this.exitPending) {
      this.previousFrameTime = null;
      return;
    }

    const previous = this.previousFrameTime ?? time;
    const elapsedSeconds = Math.max(0, (time - previous) / 1000);
    this.previousFrameTime = time;

    if (elapsedSeconds > 0) {
      const current = this.playerState.getPosition();
      const delta = movementDelta(this.direction, elapsedSeconds);

      if (attemptsLibraryExit(current, delta)) {
        this.exitPending = true;
        this.stopCurrentPointer();
        void Promise.resolve(this.onExit()).finally(() => {
          this.exitPending = false;
        });
        return;
      }

      const next = moveWithAxisSliding(
        current,
        delta,
        ELD_LIBRARY_COLLISION_OBSTACLES,
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
