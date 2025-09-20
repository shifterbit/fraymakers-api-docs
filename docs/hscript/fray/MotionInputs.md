---
title: Motion Inputs
layout: doc
next: false
prev: false
---

## Intro
This is pretty much a fray implementation of a motion input system based of off [This Tutorial By CritPoints](https://critpoints.net/2025/02/05/how-to-code-fighting-game-motion-inputs/)

This'll net you motion inputs that are:
- Easy to add and Bindable to pretty much any action you please
- The ability to control Leniency via input windows or precision for each individual input



## The Building Blocks


### The Input Buffer

First Element of our motion input system is the input Buffer, which is pretty much an array of integers, with the numbers assumed to be in 
numpad notation.
![Image](https://pm1.narvii.com/6430/85620ea9661a7f2c7e8fe6263484d0c28064219b_hq.jpg)

For starters we create top level variables for our buffer array, rollback compatibility here is actually pretty straight forward too, since
this is pretty much the only state we'll be keeping track of.
```haxe
var BUFFER_CAPACITY = 60;
var inputBuffer: ApiVarArray = self.makeArray([]);
```


#### Reading Inputs into the Input Buffer
This function here takes in an array, being the input buffer and add the latest directional input and adds it to the beginning of the 
input buffer, and if the buffer hits max capacity, we remove from the end up the buffer.
```haxe
/**
 * @description reads player input into the inputBuffer
 * @param player the player to read inputs from
 * @param inputBuffer the input buffer to add inputs to
 */
function readInput(player: Character, inputBuffer: Array<Int>) {
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

This function should be called once every frame either in update like so:

```haxe
function update() {
    readInput(self, inputBuffer.get());
}
```
Timers work for this too
```haxe
self.addTimer(1, -1, function () {
    readInput(self, inputBuffer.get());
}, { persistent: true });

```

### Defining Our Motion Inputs
Another important part of our Motion Input system is well, the motion inputs, a motion input consists of a few parts:
- A name
- A List of Inputs, which each contain:
    - The input direction in numpad notation
    - The input window, being how wide the buffer window is for that particular input
    - Precision, basically, precise inputs require exact values, but imprecise inputs would also count the nearest input so if you have an imprecise down forward input in a motion, either forward or down would also be valid inputs.



Here's our `Input` struct with a helper method to create a new input with a helper method,
 so we can just call `Input.create()` when creating new inputs for a motion input
```haxe
var Input = {
    DOWN_BACK: 1,
    DOWN: 2,
    DOWN_FORWARD: 3,
    BACK: 4,
    NEUTRAL: 5,
    FORWARD: 6,
    UP_BACK: 7,
    UP: 8,
    UP_FORWARD: 9,
    create:
        /**
         * @description Generate an Object Storing a particular input direction
         * @param direction Input Direction in number notation
         * @param window Input Window for this particular input in frames
         * @param precise If false, inputs would be rounded
         */
        function (direction: Int, window: Int, precise: Bool) {
            return {
                direction: direction,
                window: window,
                precise: precise
            };
        }
};
```
We also need a function to create the motion input
```haxe
/**
 * @description creates a motion input object
 * @param name mostly for error reporting
 * @param inputs list of direction inputs generated from `createDirection`
 */
function createMotionInput(name: String, inputs: Array<{ direction: Int, window: Int, precise: Bool }>) {
    inputs.reverse();
    return {
        name: name,
        inputs: inputs
    }
}
```

Creating the motion input is also pretty straight forward now:

```haxe

var shoryuInput = createMotionInput("Dragon Punch", [
    Input.create(Input.FORWARD, 8, true),
    Input.create(Input.DOWN, 8, true),
    Input.create(Input.DOWN_FORWARD, 8, false),
]);
var hadouInput = createMotionInput("Hadouken", [
    Input.create(Input.DOWN, 12, true),
    Input.create(Input.DOWN_FORWARD, 12, false),
    Input.create(Input.FORWARD, 12, true),
]);
```
### Checking Motion Inputs
#### Checking Input Direction
Checking Input direction is fairly straight forward, however we also need to flip the direction if we're facing left,
We also need to do some fuzzy checking for imprecise Inputs
```haxe
/**
 * @description Check direction
 * @param player the player to check, used ot check facing direction
 * @param direction from buffer
 * @param targetDirection the expected direction from the motion input
 * @param precise whether to use exact values or rounding
 */
function checkDir(player: Character, direction: Int, targetDirection: Int, precise: Bool): Bool {
    //step 1, correct the currently held direction based on the facing direction, so 6 is forward, and 4 is back.
    var currDir = direction;
    if (player.isFacingLeft()) {
        if ([Input.UP_BACK, Input.BACK, Input.DOWN_BACK].contains(currDir)) currDir += 2;
        else if ([Input.UP_FORWARD, Input.FORWARD, Input.DOWN_FORWARD].contains(currDir)) currDir -= 2;
    }

    if (precise) {
        return (currDir == targetDirection);
    } else { //do some fuzzy comparison shit
        //else ifs let it terminate if it finds a value before the others
        //the diagonals are at the bottom because it's less likely to have an input with fuzzy diagonals, so you do less comparisons
        //the ands let it early terminate if the target direction isn't right.
        if (targetDirection == Input.FORWARD && ([Input.FORWARD, Input.UP_FORWARD, Input.DOWN_FORWARD].contains(currDir))) { return true; } // Forward
        if (targetDirection == Input.BACK && ([Input.BACK, Input.DOWN_BACK, Input.UP_BACK].contains(currDir))) { return true; } // Backward
        if (targetDirection == Input.DOWN && ([Input.DOWN, Input.DOWN_BACK, Input.DOWN_FORWARD].contains(currDir))) { return true; } // Down
        if (targetDirection == Input.UP && ([Input.UP, Input.UP_BACK, Input.UP_FORWARD].contains(currDir))) { return true; } // Up
        if (targetDirection == Input.DOWN_FORWARD && ([Input.DOWN_FORWARD, Input.FORWARD, Input.DOWN].contains(currDir))) { return true; } // Down Forward
        if (targetDirection == Input.DOWN_BACK && ([Input.DOWN_BACK, Input.BACK, Input.DOWN].contains(currDir))) { return true; } // Down Back
        if (targetDirection == Input.UP_FORWARD && ([Input.UP_FORWARD, Input.UP, Input.FORWARD].contains(currDir))) { return true; } // Up Forward
        if (targetDirection == Input.UP_BACK && ([Input.UP_BACK, Input.UP, Input.BACK].contains(currDir))) { return true; } // Up Back
    }
    return false;
}
```
#### Reading the Buffer for a Valid Input
Now here we search for the motion input backwards, this is also the reason why we have the latest inputs first in the buffer.
The Algorithm here works as follows:

1. Start reading inputs from the current buffer position(on the initial call this'll be the latest input) In a loop
2. We now check the current Input direction:
    - if we don't have a match, continue the loop from the next buffer position
    - if we do have a match:
        - If we have more inputs in the motion to look for, go back to step 1 with the next buffer input and input in the motion
        - If We don't have any more inputs, then we've successfully performed the motion
3. If we've reached the end of the window or ran out of space in the input buffer, then we've failed to perform the input

```haxe
/**
 * @description Checks the input buffer if the current motion input was successfully
 * @param player The player character this is being checked for, pass self if you're a character probably
 * @param currentInput, the current input index in the motion input index
 * @param bufferPosition current position in the input buffer
 * @param inputBuffer the input buffer
 * @param motionInput the motion inputObject
 */
function checkValidInput(player: Character, currentInput: Int, bufferPosition: Int, inputBuffer: Array<Int>, motionInput: { name: String, inputs: Array<{ direction: Int, window: Int, precise: Bool }> }): Bool {
    // Start at the
    // var i = bufferPosition;
    var windowEnd = motionInput.inputs[currentInput].window + bufferPosition;
    for (i in bufferPosition...windowEnd) {// We also add the check the input windows
        if (checkDir(player, inputBuffer[i], motionInput.inputs[currentInput].direction, motionInput.inputs[currentInput].precise)) {
            if (currentInput + 1 >= motionInput.inputs.length) { //if there's no input at this point in the list, we're done, return true
                return true;
            } else return checkValidInput(player, currentInput + 1, i + 1, inputBuffer, motionInput);
        }
    }
    return false;
}
```

And With that we should be done with the core functionality

### Running Inputs
In addition to the core functions, there's also some helper functions here to help us more easily bind inputs to actions


#### Mappings
A Mapping is pretty much just a Motion Input - Action Pair, with an action being a combination of:
- State to Change to
- Animation to Change to
- Functional to Call
- A Condition to Determine if the motion can be applied, useful for ground only, air only or animation specific inputs

of course you can omit the parts you dont need, so if you want to pass the animation but not state, just pass the animation,
or if you want to change state without worrying about the animation, etc.
```haxe
function createInputMapping(motionInput: { name: String, inputs: Array<{ direction: Int, window: Int, precise: Bool }> }, action: { condition: CallableFunction, callback: CallableFunction, state: Int, animation: String }) {
    return {
        motionInput: motionInput,
        action: action
    }
}
```

```haxe
function runInputs(player: Character,
    inputBuffer: Array<Int>,
    inputMappings: Array<{
        motionInput:
        {
            name: String,
            inputs: Array<{ direction: Int, window: Int, precise: Bool }>
        },
        action: { condition: CallableFunction, callback: CallableFunction, state: Int, animation: String }
    }>) {

    Engine.forCount(inputMappings.length, function (idx: Int) {
        var item = inputMappings[idx];
        var action = item.action;
        if (action == null) { return true; }
        if (action.condition != null && !action.condition()) {
            return true;
        }
        if (checkValidInput(player, 0, 0, inputBuffer, item.motionInput)) {

            if (action.animation != null && action.state != null) {
                player.toState(item.action, item.animation);
            } else if (action.state != null) {
                player.toState(action.state);
            } else if (action.animation) {
                player.playAnimation(action.animation);
            }

            if (action.callback != null) {
                action.callback();
            }

            return false;
        }
        return true;
    }, []);
}
```



## Application
Note that we also need some form of isActionable function to ensure we can't special cancel out of ledge or hurt so here is a basic version we
can use.

```haxe
function isActionable(player: Character, ?allowList: Array<Int>) {
    if (allowList == null) { allowList = []; }
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

    return player.getAnimationStat("interruptible");
}
```

Now to actually make use of all of this code, first you'd need to create the motion input objects as top level variables like so, keep in mind
that they are reusable.

First we create our motion inputs as top level variables
```haxe
var shoryuInput = createMotionInput("Shoryuken", [
    Input.create(Input.FORWARD, 8, true),
    Input.create(Input.DOWN, 8, true),
    Input.create(Input.DOWN_FORWARD, 8, true),
]);
var hadouInput = createMotionInput("Hadouken", [
    Input.create(Input.DOWN, 12, true),
    Input.create(Input.DOWN_FORWARD, 12, false),
    Input.create(Input.FORWARD, 12, true),
]);
```

Next we create mappings for them like so, we're gonna create both grounded and air versions like so:
Remember that the order determines priority.
```haxe
function isGrounded() { return self.isOnFloor(); }
function isInAir() { return !self.isOnFloor(); }

var inputMappings = [
    createInputMapping(shoryuInput, { state: CState.SPECIAL_UP, condition: isGrounded }),
    createInputMapping(shoryuInput, { state: CState.STRONG_UP_ATTACK, condition: isInAir }),
    createInputMapping(hadouInput, { state: CState.SPECIAL_NEUTRAL, condition: isGrounded }),
    createInputMapping(hadouInput, { state: CState.STRONG_FORWARD_ATTACK, condition: isInAir })
];
```

And now to make use of those mappings we can have our `update()` function look something like this now:
```haxe
function update() {
    readInput(self, inputBuffer.get());
    if (self.getPressedControls().ATTACK && isActionable(player, [])) {
        runInputs(player, inputBuffer.get(), inputMappings);
    }
}
```
And that should be all you need for basic special inputs

### Conditional Special Input Cancelling
If you want to be able to cancel out of certain states you can modify the array passed to isActionable like so
```haxe
function update() {
    readInput(self, inputBuffer.get());
    if (self.getPressedControls().ATTACK && isActionable(player, [CState.JAB, CState.STRONG_FORWARD_ATTACK])) {
        runInputs(player, inputBuffer.get(), inputMappings);
    }
}
```


### On Hit Special Cancelling
Special Cancelling on Hit and on block is also a pretty common thing in fighting games, here we can implement that using event listeners like
so:
First a function to call
```haxe
function onHit(event: GameObjectEvent) {
    var cancelWindow = event.data.hitboxStats.hitstop + 40; // This is the cancel window
    self.addTimer(1, cancelWindow, function () {
        if (self.getPressedControls().ATTACK) {
            runInputs(self,inputBuffer,specialInputMappings);
        }
    }, { persistent: true });
}
```

```haxe
self.addEventListener(GameObjectEvent.SHIELD_HIT_DEALT, onHit);
self.addEventListener(GameObjectEvent.HIT_DEALT, onHit);
```
You can make them persistent or use them in framescripts for specific moves, whichever you prefer.