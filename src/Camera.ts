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

import { Area, Dimensions } from "./Area";
import { GameObject } from "./GameObject";
import { random } from "./random";

export class Camera {
    public x = 0;
    public y = 0;
    public zoom = 1;
    public visibleAreaHeight?: number;

    private shakePower = 0;
    private shakeDecay = 0;

    private target: GameObject | null = null;

    public followHorizontally: boolean = false;

    constructor(
        private level: Area,
        private view: Dimensions,
    ) {}

    // Returns the area of the level that is currently visible on the
    // camera.
    getViewArea(): Area {
        const viewAreaWidth = this.view.width / this.zoom;
        const viewAreaHeight = this.view.height / this.zoom;

        return {
            x: this.x - viewAreaWidth / 2,
            y: this.y - viewAreaHeight / 2,
            width: viewAreaWidth,
            height: viewAreaHeight,
        };
    }

    follow(target: GameObject): void {
        this.target = target;
    }

    zoomToLevel(): void {
        this.target = null;

        this.x = this.level.x + this.level.width / 2;
        this.y = this.level.y + this.level.height / 2;

        if (
            this.level.width / this.level.height >=
            this.view.width / this.view.height
        ) {
            this.zoom = this.view.width / this.level.width;
        } else {
            this.zoom = this.view.height / this.level.height;
        }
    }

    shake(power = 8, length = 0.5): void {
        this.shakePower = power;
        this.shakeDecay = power / length;
    }

    update(): void {
        if (this.visibleAreaHeight != null) {
            this.zoom = this.view.height / this.visibleAreaHeight;
        }

        if (this.target) {
            this.fitZoom();
            this.followFrame(this.target);
        }

        this.shakeFrame();
    }

    private shakeFrame(): void {
        const { shakePower } = this;

        if (shakePower <= 0) {
            return;
        }

        this.x += random(shakePower * 2) - shakePower;
        this.y += random(shakePower * 2) - shakePower;

        this.shakePower -= this.shakeDecay * (1.0 / 60);
    }

    private fitZoom(): void {
        const zoomedWidth = this.level.width * this.zoom;
        const zoomedHeight = this.level.height * this.zoom;

        // Zoom such that camera stays within the this.level.
        if (zoomedWidth < this.view.width || zoomedHeight < this.view.height) {
            this.zoom = Math.max(
                this.view.width / this.level.width,
                this.view.height / this.level.height,
            );
        }
    }

    private followFrame(o: GameObject): void {
        const viewAreaWidth = this.view.width / this.zoom;
        const viewAreaHeight = this.view.height / this.zoom;

        if (this.followHorizontally) {
            let x = o.x + o.width;

            // Keep camera within level in x-direction.
            if (x - viewAreaWidth / 2 < this.level.x) {
                x = this.level.x + viewAreaWidth / 2;
            } else if (
                x + viewAreaWidth / 2 >
                this.level.x + this.level.width
            ) {
                x = this.level.x + this.level.width - viewAreaWidth / 2;
            }

            this.x = x;
        }

        let y = o.y + o.height;
        // Characted should be 1/4 height from bottom
        y -= viewAreaHeight / 4;

        // Keep camera within level in y-direction.
        if (y - viewAreaHeight / 2 < this.level.y) {
            y = this.level.y + viewAreaHeight / 2;
        } else if (y + viewAreaHeight / 2 > this.level.y + this.level.height) {
            y = this.level.y + this.level.height - viewAreaHeight / 2;
        }

        this.y = y;
    }
}
