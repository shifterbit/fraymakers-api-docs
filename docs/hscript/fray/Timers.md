---
title: Timers
layout: doc
prev: false
next: false
---


# Using Timers

## Preface
Timers allow you to run a function at a particular interval, for example, lets say you wanted to run a function every frame, 
or 3 frames, or maybe run a function 500 frames later, sure you could use a counter variable with the update function like this:

```haxe
var counter = self.makeInt(120); // 120 Frame counter


function makeDamageContainerInvisible() {
    self.getDamageCounterContainer().alpha = 1;
}


function update() {
    counter.dec();

    if (counter.get() == 0) {
        makeDamageContainerInvisible();

    }
}
```

But this approach while functional, might not scale well when you might wanna create several timers, 
you'd need 1 variable for each one, and if you want it to repeat you'd also have to reset the counter
yourself, or do some simple math to trigger at certain intervals.


## A Primer on Timers
### What can timers be added to?
Currently timers can be added to the following classes:
- [Stage](../../classes/Stage.md)
- [Match](../../classes/Match.md)
- [Entity](../../classes/Entity.md)
- [GameObject](../../classes/GameObject.md)
- [Character](../../classes/Character.md)
- [Assist](../../classes/Assist.md)
- [AssistController](../../classes/AssistController.md)

### Basic Structure
For reference this is the structure
```haxe
addTimer(interval:Int, repeats:Int, func, ?options: {?condition: () -> Bool, ?inverseCondition: () => Bool, ?pauseCondition: () => Bool, ?persistent: Bool}) ):Int 
```
- `interval`: Time in frames between function calls
- `repeats`: How many times to call the function
- `func`: The function being passed to the timer, please take a look at the [Functions Page](./Functions.md) on how to pass functions to other functions
- `options`: These are the options that modify the behavior of the timer in various ways, they are optional so you don't need to use them
    - `condition`: A function you can pass that determines whether the function will trigger when the interval is hit, if the function returns true, `func` gets called, otherwise it will not
    - `inverseCondition`: similar to `condition` except the `func` if the function you pass returns false when the interval is hit
    - `pauseCondition`: when this function returns true, the timer will be paused
    - `persistent`: determines whether the timer will stop if there is an animation change

- The timer also returns an `Int`, which is the timer's id, which can be used to remove the timer manually


That's quite a bit to take in, but the `option` you'll likely be using most is `persistent` so we'll use the simple example of adding damage over time

### Examples

#### Basic Non Persistent Timer
```haxe
self.addTimer(1, 100, function () {
    self.addDamage(1);
});
```
Lets breakdown what happens here:

- First we pass 1 for the `interval`, so this timer runs every frame
- We passed 100 for the repeats, so it will trigger 100 times
- The function simply adds 1 damage to `self` 

With all that put together, it causes you to gain 1 damage per frame, for 100 frames.

But if the current animation lasts for less than 100 frames, then the timer will end prematurely, so to prevent that you make it persistent:

#### Persistent Timers
```haxe
self.addTimer(1, 100, function () {
    self.addDamage(1);
}, {persistent: true});
```

Now with the `persistent: true`, the timer would always run to completion even if the animation changes.

#### Endless Timers
If you wanted the timer to run forever, pass either 0 or a negative number to repeats like so:
```haxe
self.addTimer(1, -1, function () {
    self.addDamage(1);
}, {persistent: true});
```

#### Larger Intervals
If you wanted the interval to be larger, the process is fairly similar
```haxe
self.addTimer(30, -1, function () {
    self.addDamage(1);
}, {persistent: true});
```
#### Manually Removing Timers
`addTimer` returns an `Int`, which is the timerId, which you can pass to `removeTimer`
```haxe
var id:Int = self.addTimer(30, -1, function () {
    self.addDamage(1);
}, {persistent: true});

// When you wanna remove the timer later
self.removeTimer(id);
```

#### Timer Conditions
To put it simply conditions determine when the timer will be active and whether the function would be called.
##### Conditions and Inverse Conditions
This would be a function that checks if the timer function will be able to run at any given time.

Building upon the example above, let's say you wanted to heal only if you were in one of the falling states
```haxe
function isFalling() {
    return self.inState(CState.FALL) || self.inState(CState.FALL_SPECIAL);
}

self.addTimer(30, -1, function () {
    self.addDamage(1);
}, {persistent: true, condition: isFalling});
```

Of course this is equivalent to this:
```haxe
function isFalling() {
    return self.inState(CState.FALL) || self.inState(CState.FALL_SPECIAL);
}

self.addTimer(30, -1, function () {
    if (isFalling()) {
        self.addDamage(1);
    }
}, {persistent: true});
```
###### Inverse Conditions
Inverse conditions work very similarly so I'll keep it brief.It determines when the function **shouldn't** be called so
if you wanted the function to be called only when NOT in falling state:

```haxe
function isFalling() {
    return self.inState(CState.FALL) || self.inState(CState.FALL_SPECIAL);
}

self.addTimer(30, -1, function () {
    self.addDamage(1);
}, {persistent: true, inverseCondition: isFalling});
```

##### Pause Conditions

Pause conditions work a bit differently from the two above. Rather than determining whether the function should be called, 
it determines whether the timer should continue counting, or in other words while the condition is true, the timer is halted.

So if we wanted to pause the timer whilst in a HURT or KO state group:

```haxe
function shouldPause() {
    return self.inStateGroup(CStateGroup.KO) || self.inStateGroup(CStateGroup.HURT);
}

self.addTimer(30, -1, function () {
    self.addDamage(1);
}, {persistent: true, pauseCondition: shouldPause});
```





