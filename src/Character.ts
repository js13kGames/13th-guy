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

import {
    CharacterAnimation,
    CharacterFacingDirection,
    renderCharacter,
} from "./CharacterAnimation";
import { GameObject } from "./GameObject";
import { cx } from "./graphics";
import { mirrorHorizontally } from "./rendering";
import { isZero, Vector, ZERO_VECTOR } from "./Vector";

export class Character implements GameObject {
    private direction: Vector = ZERO_VECTOR;
    private latestDirection: Vector = { x: 0, y: -1 };

    x: number;
    y: number;
    width = 1;
    height = 1;

    velocity: Vector = ZERO_VECTOR;

    fallStartTime: number | undefined;

    constructor(position: Vector) {
        this.x = position.x;
        this.y = position.y;
    }

    move(direction: Vector): void {
        this.direction = direction;
        if (!isZero(direction)) {
            this.latestDirection = direction;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    drop(position: Vector): void {
        this.x = position.x;
        this.y = position.y;
        this.direction = ZERO_VECTOR;
        this.latestDirection = { x: 0, y: -1 };
        this.velocity = ZERO_VECTOR;
        this.fallStartTime = undefined;
    }

    // eslint-disable-next-line
    draw(t: number, _: number): void {
        const direction: CharacterFacingDirection =
            this.latestDirection.y !== 0
                ? this.latestDirection.x === 0
                    ? this.latestDirection.y < 0
                        ? CharacterFacingDirection.Forward
                        : CharacterFacingDirection.Backward
                    : this.latestDirection.y > 0
                      ? CharacterFacingDirection.BackwardRight
                      : CharacterFacingDirection.ForwardRight
                : CharacterFacingDirection.Right;

        cx.save();

        // Debug border
        // cx.save();
        // cx.strokeStyle = "red";
        // cx.lineWidth = 0.1;
        // cx.strokeRect(this.x, this.y, this.width, this.height);
        // cx.restore();

        // Different render height than actual height, for pseudo-3d effect.
        const renderHeight = this.height * 3;
        const heightDiff = renderHeight - this.height;

        cx.translate(this.x, this.y - heightDiff);

        if (this.latestDirection.x < 0) {
            mirrorHorizontally(cx, this.width);
        }

        const animationTime =
            isZero(this.direction) && this.fallStartTime == null ? 0 : t;

        renderCharacter(
            cx,
            this.width,
            renderHeight,
            animationTime,
            direction,
            this.getAnimation(),
        );
        cx.restore();
    }

    private getAnimation(): CharacterAnimation {
        if (this.fallStartTime != null) {
            return CharacterAnimation.Fall;
        }

        if (!isZero(this.direction)) {
            return CharacterAnimation.Walk;
        }

        return CharacterAnimation.Still;
    }
}
