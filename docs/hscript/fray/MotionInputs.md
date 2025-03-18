---
title: Motion Inputs
layout: doc
next: false
prev: false
---

## Intro
This is pretty much a fray implementation of a motion input system based of off [This Tutorial By CritPoints](https://critpoints.net/2025/02/05/how-to-code-fighting-game-motion-inputs/)

This'll net you motion inputs that are:
- Easy to add and Modify
- The ability to control Leniency for each individual input
- Input Rounding for many shortcuts will function


## The Building Blocks

First we create a simply struct to hold inputs, for out implementation, its important we follow numpad notation, We also want to store an input buffer as well as a variable to configure its capacity:

```haxe
var BUFFER_CAPACITY = 100;
var inputBuffer:Array<Int> = [];

var Input = {
    DOWN_BACK: 1,
    DOWN: 2,
    DOWN_FORWARD: 3,
    BACK: 4,
    NEUTRAL: 5,
    FORWARD: 6,
    UP_BACK: 7,
    UP: 8,
    UP_FORWARD: 9
};
```
We also need to create helper functions to generate the motion inputs as well
as the directions with all their options(input rounding, input windows):
```haxe
/**
 * @description Generate an Object Storing a particular input direction
 * @param direction Input Direction in number notation
 * @param window Input Window for this particular input in frames
 * @param exact If false, inputs would be rounded
 */
function createDirection(direction: Int, window: Int, exact: Bool) {
    return {
        direction: direction,
        window: window,
        exact: exact
    };
}

/**
 * @description creates a motion input object
 * @param name mostly for error reporting
 * @param inputs list of direction inputs generated from `createDirection`
 */
function createMotionInput(name: String, inputs: Array<{ direction: Int, window: Int, exact: Bool }>) {
    inputs.reverse();
    return {
        name: name,
        inputs: inputs
    }
}
```

The rest of these functions make use if the above structures to determine if an input is successful
```haxe
/**
 * @description Checks the input buffer if the current motion input was successfully
 * @param player The player character this is being checked for, pass self if you're a character probably
 * @param currentInput, the current input index in the motion input index
 * @param bufferPosition current position in the input buffer
 * @param inputBuffer the input buffer
 * @param motionInput the motion inputObject
 */
function checkValidInput(player: Character, currentInput: Int, bufferPosition: Int, inputBuffer: Array<Int>, motionInput: { name: String, inputs: Array<{ direction: Int, window: Int, exact: Bool }> }): Bool {
    // Start at the
    // var i = bufferPosition;
    var windowEnd = motionInput.inputs[currentInput].window + bufferPosition;
    for (i in bufferPosition...windowEnd) {// We also add the check the input windows
        if (inputBuffer[i] == 5) { continue; } // Skip Neutral Inputs
        if (checkDir(player, inputBuffer[i], motionInput.inputs[currentInput].direction, motionInput.inputs[currentInput].exact)) {
            if (currentInput + 1 >= motionInput.inputs.length) { //if there's no input at this point in the list, we're done, return true
                return true;
            } else return checkValidInput(player, currentInput + 1, i + 1, inputBuffer, motionInput);
        }
    }
    return false;
}

/**
 * @description Check direction
 * @param player the player to check, used ot check facing direction
 * @param direction from buffer
 * @param targetDirection the expected direction from the motion input
 * @param exact whether to use exact values or rounding
 */
function checkDir(player: Character, direction: Int, targetDirection: Int, exact: Bool): Bool {
    //step 1, correct the currently held direction based on the facing direction, so 6 is forward, and 4 is back.
    var currDir = direction;
    if (player.isFacingLeft()) {
        if (currDir == 7 || currDir == 4 || currDir == 1) currDir += 2;
        else if (currDir == 9 || currDir == 6 || currDir == 3) currDir -= 2;
    }

    if (exact) {
        return (currDir == targetDirection);
    } else { //do some fuzzy comparison shit
        //else ifs let it terminate if it finds a value before the others
        //the diagonals are at the bottom because it's less likely to have an input with fuzzy diagonals, so you do less comparisons
        //the ands let it early terminate if the target direction isn't right.
        if (targetDirection == 6 && (currDir == 6 || currDir == 9 || currDir == 3)) { return true; } // Forward
        if (targetDirection == 4 && (currDir == 4 || currDir == 1 || currDir == 7)) { return true; } // Backward
        if (targetDirection == 2 && (currDir == 2 || currDir == 1 || currDir == 3)) { return true; } // Down
        if (targetDirection == 8 && (currDir == 8 || currDir == 7 || currDir == 9)) { return true; } // Up
        if (targetDirection == 3 && (currDir == 3 || currDir == 6 || currDir == 2)) { return true; } // Down Forward
        if (targetDirection == 1 && (currDir == 1 || currDir == 4 || currDir == 2)) { return true; } // Down Back
        if (targetDirection == 9 && (currDir == 9 || currDir == 8 || currDir == 6)) { return true; } // Up Forward
        if (targetDirection == 7 && (currDir == 7 || currDir == 8 || currDir == 4)) { return true; } // Up Back
    }
    return false;
}

/**
 * @description reads player input into the inputBuffer
 * @param player the player to read inputs from
 * @param inputBuffer the input buffer to add inputs to
 */
function checkInput(player: Character, inputBuffer: Array<Int>) {
    var held = player.getHeldControls();
    var pressed = player.getPressedControls();
    var left = held.LEFT || pressed.LEFT;
    var right = held.RIGHT || held.RIGHT;
    var up = held.UP || held.UP;
    var down = held.DOWN || held.DOWN;
    var currentDirection = 5;

    // Neutral is pretty self explainatory
    if (!(left || right || up || down)) {
        currentDirection = 5;
    } else {
        /**
         * Math here is a bit weird to explain so its easier to visualize it with the number pad itself
         * 7 8 9
         * 4 5 6
         * 1 2 3
         * 
         * The vertical values are set to be the numbers in the middle column,
         *  up being 8, neutral being 5 and down being 2, the horizontal number is an offset, so if we have up(8) and right(+1) 
         *  we end up with up forward
         * 
         * In a nutshell this just lets us sum numbers rather than having a massive if else chain
         */

        var horizontal = 0;
        var vertical = 5;
        if ((left && right) || !(left || right)) {
            horizontal = 0;
        } else if (left) {
            horizontal = -1;
        } else if (right) {
            horizontal = 1;
        }
        if ((down && up) || !(down || up)) {
            vertical = 5;
        } else if (down) {
            vertical = 2;
        } else if (up) {
            vertical = 8;
        }
        currentDirection = horizontal + vertical;
    }
    // Remove from the buffer in the event that its overfull
    while (inputBuffer.length >= BUFFER_CAPACITY) {
        inputBuffer.pop();
    }
    // Add the latest input to the beginning of the buffer
    inputBuffer.unshift(currentDirection);
}
```


## Application
Now to actually make use of all of this code, first you'd need to create the motion input objects as top level variables like so, keep in mind
that they are reusable.

As for the arguments, the first is self explanatory, the direction of course, The second is the input window, and the 3rd is whether to use strict detectino(Will use input rounding if false)
```haxe
var shoryuInput = createMotionInput("Shoryuken", [
    createDirection(Input.FORWARD, 10, true),
    createDirection(Input.DOWN, 10, true),
    createDirection(Input.DOWN_FORWARD, 12, false),
]);
var hadouInput = createMotionInput("Hadouken", [
    createDirection(Input.DOWN, 12, true),
    createDirection(Input.DOWN_FORWARD, 12, false),
    createDirection(Input.FORWARD, 12, true),
]);
```
Here we have hadouken and shoryuken inputs, now to bind them to our attack or special buttons, first in `update()` or in an infinite timer,
Update:
```haxe
function update() {
    // We add the latest input to the buffer
    checkInput(self, inputBuffer);
    // 
    if (self.getPressedControls().ATTACK) {
        if (checkValidInput(self, 0, 0, inputBuffer, hadouInput)) {
            self.toState(CState.STRONG_FORWARD_ATTACK);
        }
        if (checkValidInput(self, 0, 0, inputBuffer, shoryuInput)) {
            self.toState(CState.STRONG_UP_ATTACK);
        }
    }

    if (self.getPressedControls().SPECIAL) {
        if (checkValidInput(self, 0, 0, inputBuffer, hadouInput)) {
            self.toState(CState.SPECIAL_NEUTRAL);
        }
        if (checkValidInput(self, 0, 0, inputBuffer, shoryuInput)) {
            self.toState(CState.SPECIAL_UP);
        }
    }

}
```

Infinite Timer:
```haxe
self.addTimer(1, -1, function () {
    // We add the latest input to the buffer
    checkInput(self, inputBuffer);
    // 
    if (self.getPressedControls().ATTACK) {
        if (checkValidInput(self, 0, 0, inputBuffer, hadouInput)) {
            self.toState(CState.STRONG_FORWARD_ATTACK);
        }
        if (checkValidInput(self, 0, 0, inputBuffer, shoryuInput)) {
            self.toState(CState.STRONG_UP_ATTACK);
        }
    }

    if (self.getPressedControls().SPECIAL) {
        if (checkValidInput(self, 0, 0, inputBuffer, hadouInput)) {
            self.toState(CState.SPECIAL_NEUTRAL);
        }
        if (checkValidInput(self, 0, 0, inputBuffer, shoryuInput)) {
            self.toState(CState.SPECIAL_UP);
        }
    }
}, { persistent: true });
```


### Conditional Special Input Cancelling
Whilst the initial code is fine you probably dont want to be able to special cancel *every* state, so you'd need to check if you're actionable as well as have a list of exceptions

So you can create a top level variable with the states that you want to be special cancellable:
```haxe
var cancellableStates = [
    CState.TILT_DOWN,
    CState.TILT_UP,
    CState.TILT_FORWARD,
];
```

Then a basic isActionable Function that takes in those exceptions
```haxe
function isActionable(player: Character, ?allowList: Array<Int>) {
    if (allowList == null) {allowList = [];}
    if (allowList.contains(player.getState())) {
        return true;
    }
    var deniedStates: Array<Int> = [
        CState.BURIED, CState.HELD, CState.FALL_SPECIAL,
        CState.GRAB_HOLD, CState.LAND, CState.SPOT_DODGE,
        CState.ROLL, CState.CRASH_ROLL, CState.CRASH_ROLL,
        CState.TECH, CState.TECH_CEILING, CState.TECH_WALL,
        CState.TECH_ROLL
    ];

    var deniedStateGroups: Array<Int> = [
        CStateGroup.AIRDASH, CStateGroup.ATTACK, CStateGroup.INTRO,
        CStateGroup.SHIELD, CStateGroup.LEDGE, CStateGroup.KO,
        CStateGroup.LEDGE_CLIMB, CStateGroup.LEDGE_ROLL, CStateGroup.UNINITIALIZED,
        CStateGroup.GRAB,
    ];

    for (group in deniedStateGroups) {
        if (player.inStateGroup(group)) {
            return false;
        }
    }
    if (player.inHurtState() || player.getHitstun > 0) {
        return false;
    }
    if (deniedStates.contains(player.getState())) {
        return false;
    }

    return true;
}
```

And now you can use that in your conditions like:
```haxe
    if (self.getPressedControls().ATTACK && isActionable(self, cancellableStates )) {
        if (checkValidInput(self, 0, 0, inputBuffer, hadouInput)) {
            self.toState(CState.STRONG_FORWARD_ATTACK);
        }
        if (checkValidInput(self, 0, 0, inputBuffer, shoryuInput)) {
            self.toState(CState.STRONG_UP_ATTACK);
        }
    }
```


#### On Hit Special Cancelling
Pretty similar to the above situation but we use an event listener and an additional timer
```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (event: GameObjectEvent) {
    var cancelWindow = event.data.hitboxStats.hitstop + 60;
    self.addTimer(1, cancelWindow, function () {
        if (self.getPressedControls().ATTACK) {
            if (checkValidInput(self, 0, 0, inputBuffer, hadouken)) {
                self.toState(CState.SPECIAL_NEUTRAL);
            }
            if (checkValidInput(player, 0, 0, inputBuffer, shoryuInput)) {
                self.toState(CState.SPECIAL_UP);
            }
        }
    }, { persistent: true });
}, { persistent: true });
```
Of course, only if you haven't already done so, make sure to have at just one of these and in either update() or an infinite 1 frame timer.
```haxe
checkInput(self, inputBuffer);
```