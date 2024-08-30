/*
 * Copyright (c) 2024 Tero Jäntti, Sami Heikkinen
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Area } from "./Area";
import { Camera } from "./Camera";
import { Character } from "./Character";
import { GameObject } from "./GameObject";
import { canvas, cx } from "./graphics";
import { getKeys } from "./keyboard";
import {
    calculateCollisionBetweenCharacters,
    calculateCollisionToObstacle,
    getMovementVelocity,
} from "./physics";
import { Track } from "./Track";
import { TT } from "./TrackElement";
import { normalize, Vector, ZERO_VECTOR } from "./Vector";
import {
    playTune,
    SFX_BOUNCE,
    // Ignore lint errors from JS import
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
} from "./sfx/sfx.js";

const TRACK_START_Y = 400;

// Width of empty area on the left and right side of the track.
const BANK_WIDTH = 10;

// Length of empty area before the start and after the end of the
// track.
const BANK_HEIGHT = 40;

const START_POSITION: Vector = { x: 0, y: TRACK_START_Y - 10 };

const FALL_TIME: number = 500;

export enum State {
    RUNNING,
    GAME_OVER,
    FINISHED,
}

export class Level implements Area {
    private camera: Camera = new Camera(this, canvas);

    private track: Track;

    private characters: Character[] = [];
    private player: Character;

    readonly x;
    readonly y;
    readonly width;
    readonly height;

    state: State = State.RUNNING;

    constructor(trackTemplate: readonly TT[]) {
        this.track = new Track(trackTemplate, TRACK_START_Y);

        this.x = 0 - this.track.width / 2 - BANK_WIDTH;
        this.y = TRACK_START_Y - this.track.height - BANK_HEIGHT;
        this.width = this.track.width + 2 * BANK_WIDTH;
        this.height = this.track.height + 2 * BANK_HEIGHT;

        this.player = new Character(0, START_POSITION);
        this.characters.push(this.player);
        this.camera.follow(this.player);
        this.resetZoom();

        const aiCharacter = new Character(1, { x: -10, y: TRACK_START_Y - 10 });
        this.characters.push(aiCharacter);

        const aiCharacter2 = new Character(2, { x: 10, y: TRACK_START_Y - 10 });
        this.characters.push(aiCharacter2);

        const aiCharacter3 = new Character(3, { x: 0, y: TRACK_START_Y - 15 });
        this.characters.push(aiCharacter3);
    }

    resetZoom() {
        this.camera.zoom = 2;
        this.camera.update();
    }

    update(t: number, dt: number): void {
        this.camera.update();

        // Calculate movement for characters.
        for (let i = 0; i < this.characters.length; i++) {
            const c = this.characters[i];

            const range = this.track.getBetween(c.y, c.y + c.height);

            let movementDirection: Vector = ZERO_VECTOR;

            if (c.fallStartTime != null && t - c.fallStartTime > FALL_TIME) {
                c.drop(START_POSITION);
            } else if (
                c.fallStartTime == null &&
                !this.track.isOnPlatform(range, c)
            ) {
                c.fallStartTime = t;
            } else {
                movementDirection =
                    c === this.player
                        ? this.getPlayerMovement()
                        : { x: 0, y: -1 };

                c.setDirection(movementDirection);
                c.velocity = getMovementVelocity(c, movementDirection, dt);
            }
        }

        // Calculate collisions to other characters.
        for (let ci = 0; ci < this.characters.length; ci++) {
            const c = this.characters[ci];

            for (let oi = 0; oi < this.characters.length; oi++) {
                if (oi === ci) continue;
                const other = this.characters[oi];

                if (calculateCollisionBetweenCharacters(c, other)) {
                    playTune(SFX_BOUNCE);
                }
            }
        }

        // The obstacles shall have the final word on collision detection.
        for (let ci = 0; ci < this.characters.length; ci++) {
            const c = this.characters[ci];

            const range = this.track.getBetween(c.y, c.y + c.height);
            const { minI, maxI } = range;

            for (let ei = minI; ei <= maxI; ei++) {
                const element = this.track.get(ei);
                for (let oi = 0; oi < element.objects.length; oi++) {
                    const o = element.objects[oi];

                    if (calculateCollisionToObstacle(c, o)) {
                        playTune(SFX_BOUNCE);
                    }
                }
            }
        }

        // Finally, move the characters according to their velocies.
        for (let ci = 0; ci < this.characters.length; ci++) {
            const c = this.characters[ci];

            c.move();
        }
    }

    private getPlayerMovement(): Vector {
        const keys = getKeys();

        const left = keys.ArrowLeft || keys.KeyA;
        const right = keys.ArrowRight || keys.KeyD;
        const up = keys.ArrowUp || keys.KeyW;
        const down = keys.ArrowDown || keys.KeyS;

        const dx = left ? -1 : right ? 1 : 0;
        const dy = up ? -1 : down ? 1 : 0;

        if (dx === 0 && dy === 0) {
            return ZERO_VECTOR;
        }

        return normalize({
            x: dx,
            y: dy,
        });
    }

    draw(t: number, dt: number): void {
        cx.save();

        // Apply camera - drawing in level coordinates after these lines:
        cx.translate(canvas.width / 2, canvas.height / 2);
        cx.scale(this.camera.zoom, this.camera.zoom);
        cx.translate(-this.camera.x, -this.camera.y);

        const objectsToDraw: GameObject[] = [];

        cx.save();

        const viewArea = this.camera.getViewArea();
        const { minI, maxI } = this.track.getBetween(
            viewArea.y,
            viewArea.y + viewArea.height,
        );

        for (let e = maxI; e >= minI; e--) {
            const element = this.track.get(e);

            const surfaces = element.surfaces;
            cx.fillStyle = "rgb(70,50,70)";

            for (let i = 0; i < surfaces.length; i++) {
                const surface = surfaces[i];
                cx.fillRect(
                    surface.x,
                    surface.y,
                    surface.width,
                    surface.height,
                );
            }

            objectsToDraw.push(...element.objects);
        }

        cx.restore();

        objectsToDraw.push(...this.characters);

        // Sort the objects so that objects in front get drawn after
        // objects behind them.
        objectsToDraw.sort((a, b) => a.y + a.height / 2 - (b.y + b.height / 2));

        for (let i = 0; i < objectsToDraw.length; i++) {
            const c = objectsToDraw[i];
            c.draw(t, dt);
        }

        cx.restore(); // End camera - Drawing no longer in level coordinates
    }
}
