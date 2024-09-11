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

import { TT } from "./TrackElement";

export const simpleTrack: readonly TT[] = [
    TT.FullWidth,
    TT.FullWidth,
    TT.Checkpoint,
    TT.FullWidth,
    TT.SlopeEmptySlope,
    TT.FullWidth,
    TT.FullWidth,
    TT.SlopeObstacleSlope,
    TT.FullWidth,
    TT.Checkpoint,
    TT.FullWidth,
    TT.VeryNarrow,
    TT.Basic,
    TT.Checkpoint,
    TT.BasicSlope,
    TT.FullWidthWithObstacles,
    TT.SlopeObstacleSlope,
    TT.FullWidthWithObstacleAtCenter,
    TT.FullWidthWithObstacles,
    TT.Finish,
];

export const secondTrack: readonly TT[] = [
    TT.FullWidth,
    TT.FullWidth,
    TT.BasicSlope,
    TT.FullWidthWithObstacles,
    TT.Basic,
    TT.Basic,
    TT.Checkpoint,
    TT.FullWidth,
    TT.BasicSlope,
    TT.FullWidthWithObstacleAtCenter,
    TT.FullWidthWithObstacles,
    TT.Basic,
    TT.Basic,
    TT.Raft,
    TT.Chasm,
    TT.VeryNarrow,
    TT.Checkpoint,
    TT.BasicSteepSlope,
    TT.FullWidthWithObstacles,
    TT.Basic,
    TT.Basic,
    TT.FullWidth,
    TT.TwoRafts,
    TT.Chasm,
    TT.FullWidthWithObstacleAtCenter,
    TT.Checkpoint,
    TT.FullWidth,
    TT.Raft,
    TT.Chasm,
    TT.FullWidth,
    TT.Checkpoint,
    TT.BasicSteepSlope,
    TT.BasicSteepSlope,
    TT.BasicSteepSlope,
    TT.FullWidthWithObstacles,
    TT.FullWidthWithObstacles,
    TT.Basic,
    TT.FullWidthWithObstacleAtCenter,
    TT.FullWidthWithObstacles,
    TT.FullWidthWithObstacleAtCenter,
    TT.Finish,
];

export const thirdTrack: readonly TT[] = [
    TT.FullWidth,
    TT.FullWidth,
    TT.BasicSteepSlope,
    TT.BasicSteepSlope,
    TT.BasicSlope,
    TT.FullWidthWithObstacles,
    TT.FullWidthWithObstacleAtCenter,
    TT.Checkpoint,
    TT.FullWidth,
    TT.FullWidth,
    TT.TwoRafts,
    TT.Chasm,
    TT.FullWidth,
    TT.TwoRafts,
    TT.Chasm,
    TT.FullWidth,
    TT.FullWidthWithObstacleAtCenter,
    TT.Checkpoint,
    TT.FullWidth,
    TT.Raft,
    TT.Chasm,
    TT.Checkpoint,
    TT.BasicSlope,
    TT.FullWidthWithObstacles,
    TT.FullWidth,
    TT.Basic,
    TT.FullWidthWithObstacleAtCenter,
    TT.FullWidthWithObstacleAtCenter,
    TT.Checkpoint,
    TT.FullWidth,
    TT.Raft,
    TT.Chasm,
    TT.FullWidthWithObstacles,
    TT.FullWidthWithObstacleAtCenter,
    TT.BasicSlope,
    TT.FullWidthWithObstacles,
    TT.Basic,
    TT.Basic,
    TT.VeryNarrow,
    TT.FullWidthWithObstacles,
    TT.DualPassage,
    TT.FullWidthWithObstacleAtCenter,
    TT.Checkpoint,
    TT.FullWidth,
    TT.VeryNarrow,
    TT.FullWidthWithObstacles,
    TT.FullWidth,
    TT.BasicSteepSlope,
    TT.BasicSteepSlope,
    TT.FullWidthWithObstacles,
    TT.FullWidthWithObstacleAtCenter,
    TT.Basic,
    TT.Checkpoint,
    TT.FullWidth,
    TT.Raft,
    TT.Chasm,
    TT.VeryNarrow,
    TT.FullWidthWithObstacles,
    TT.BasicSteepSlope,
    TT.BasicSteepSlope,
    TT.FullWidthWithObstacleAtCenter,
    TT.FullWidth,
    TT.Finish,
];
