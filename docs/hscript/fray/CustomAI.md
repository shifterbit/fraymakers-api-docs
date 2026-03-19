---
title: Custom AI Cookbook
layout: doc
prev: false
next: false
---

# Custom AI Code Cookbook

## Better Completion for CustomAI
Add these top level variables.
```haxe
var self:CharacterAiScript = self;
var character:Character = character;
```

Naturally, `character` refers to the player character the cpu is controlling.

This should allow you to use the api completions that should come with the characte AI

Absolutely do not set these variables to anything else.


## Making use of CPU Level

Checking your CPU level is pretty straight forward, simply check
```haxe
character.getPlayerConfig().level
```
As for how you can use this, a simple way would be to add a random chance element to every decision which scales with level. Now we're gonna go through several examples of basically using our level + some randomness to create a true/false value we can use to control the rate of something scaling to level.


Linear Scaling, upto 100% chance
```haxe
var level = character.getPlayerConfig().level:
var calculatedRate = level/9;
var isSmartEnough = Random.getValue() < calculatedRate;
if (isSmartEnough) {
	// Do thing
}
```

Linear Scaling, upto 75% chance
```haxe
var level = character.getPlayerConfig().level:
var calculatedRate = (level/9) * 0.75;
var isSmartEnough = Random.getValue() < calculatedRate;
if (isSmartEnough) {
	// Do thing
}
```

Linear Scaling, Only levels 5-9, upto 50%
```haxe
var level = character.getPlayerConfig().level:
var calculatedRate = ((level-4)/(9-4)) * 0.5;
var isSmartEnough = Random.getValue() < calculatedRate;
if (isSmartEnough) {
	// Do thing
}
```
Do notice that the only thing that changes here is `calculatedRate`


Now let's say you wanted non linear scaling, you can use `EaseTimer.interpolate`, to generate your own values for `calculatedRate`, this has the benefit of not having to code easing functions yourself.


Which ends up getting used like this, note that you can just switch out the ease type with the last argument, to see what feels better
```haxe
var level = character.getPlayerConfig().level:
var calculatedRate = EaseTimer.interpolate(0,1, (level/9), EaseTimer.EASE_OUT_CUBIC);
var isSmartEnough = Random.getValue() < calculatedRate;
if (isSmartEnough) {
	// Do thing
}
```

## Ensuring your CPU does not immediately start attacking on training mode
Basically, do this check
```haxe
self.getBehavior() == AiBehavior.ATTACK
```

Though you'd probably not want to repeat this line of code all the time so, I'd suggest wrapping all your attack logic at the very least in one top level function, and return early if it's false.
```haxe
function checkAttack() {
	if (self.getBehavior() != AiBehavior.ATTACK) {
		return;
	}
}
```
Of course you can also seperate your logic into smaller functions that get called by this.

## Disabling and Enabling Moves so the Engine doesn't perform them
You can also prevent certain moves that the built-in AI uses
First you wanna check out [ChracterAiActions](../../classes/CharacterAiActions.md) for all the stuff you can control, but generally it comes down to:

### Enabling An Action
```haxe
self.enableAction(CharacterAiActions.SPECIAL_UP);
self.enableAction(CharacterAiActions.SPECIAL_UP_AIR);
```
### Disabling An Action
```haxe
self.disableAction(CharacterAiActions.SPECIAL_UP);
self.disableAction(CharacterAiActions.SPECIAL_UP_AIR);
```

## Getting A Target Foe
### Using the Built-in Functionality
```haxe
var foe:Character = null;
if (Std.isOfType(self.getTargetFoe(),Character)) { // Type Checking
	foe = self.getTargetFoe(); // We set the actual value here
}
```
### Manual Method
```haxe
 function getTargetFoe():Character {
    var closestDistance = Math.POSITIVE_INFINITY;
     var chosenFoe:Character = null;
     var myPoint:Point = new Point(self.getX(), self.getY());
     var foePoint:Point = null;

     for (foe in self.getFoes()) {
         if (foePoint == null) {
             foePoint = new Point();
         }
         foePoint.init(foe.getX(), foe.getY());
         var currDistance = myPoint.distanceSquared(foePoint);
         if (currDistance < closestDistance) {
             closestDistance = currDistance;
             chosenFoe = foe;
         }
     }
     
     foePoint.dispose();
     myPoint.dispose();

     return chosenFoe;
}
```

## Accessing the character
The character the AI is controlling can simply be accessed with the character variable, as usual you can check their state, position, etc, as you would a foe for instance.
```haxe
if (character.inState(CState.SPECIAL_UP)) {
	Engine.log("Do something while in up special state");
}
```
refer to [Character](../../classes/Character.md),  [GameObject](../../classes/GameObject.md) and [Entity](../../classes/Entity.md) for any methods you want to use, they all apply here just as well.

Of course, you can always access exports, so be sure to provide information in exports that you think can help your ai make better decisions.

##  Performing Inputs as the AI

### Adding Inputs

Inputs are done via `addInputOverrides()`, but how does it work?
`addInputOverrides` accepts an array with an even number of items, with this structure:
**NOTE: THIS IS PSEUDO CODE, DO NOT COPY THIS DIRECTLY**
```haxe
self.addInputOverride([
	inputs, frameDuration,
	inputs, frameDuration,
	...
]);
```


Alright, now that we have a semblance of the structure, how do we fill it in?
`frameDuration` if fairly straightforward, it simply tells us how long to hold the inputs this would be a positive number.

now for the inputs themselves...

#### Buttons Bitset and Bit-wise Stuff
For passing inputs, we use the `Buttons` class, please take a look at it here 
https://shifterbit.github.io/fraymakers-api-docs/classes/Buttons

Basically inputs is a combination but `Buttons` constants, but they have to be combined in a particular manner using bit-wise OR, if you've messed with `Common.onButtonsPressed` or `Common.onButtonsHeld` this should feel a bit familiar to you:

###### Single Button

```haxe
Buttons.SPECIAL
```

###### Multiple Buttons at once
```haxe
Buttons.SPECIAL | Buttons.UP
```

```haxe
Buttons.SPECIAL | Buttons.UP | Buttons.LEFT
```

##### No Buttons At all
```haxe
0
```

#### Examples of Performing Inputs

**Performing Up Special**
```haxe
self.addInputOverrides([
	0, 1, // For ONE FRAME, we let go of all out buttons
	Buttons.SPECIAL | Buttons.UP, 1 // NEXT FRAME, PRESS UP AND SPECIAL
	0, 1 // NEXT FRAME AFTER THAT, LET GO OF ALL BUTTONS
]);
```

**Charging Down Strong for 60 Frames before Letting Go**
```haxe
self.addInputOverrides([
	0, 1, // For ONE FRAME, we let go of all out buttons
	Buttons.STRONG | Buttons.DOWN, 60 // NEXT 60 FRAMES, HOLD DOWN AND STRONG
	0, 1 // NEXT FRAME AFTER THAT, LET GO OF ALL BUTTONS
]);
```


**Performing an input in the foes direction**
Lets assume our `targetFoe` isn't `null`, and we wanted to perform a tilt in the opponents direction, we can do:

```haxe
var direction:Int = self.getTargetFoe().getX() > character.getX() ? Buttons.RIGHT : Buttons.LEFT;
self.addInputOverrides([
	0, 1, // For ONE FRAME, we let go of all out buttons
	Buttons.TILT | direction, 1 // NEXT 1 FRAME, PRESS TILT in whatever direction is
	0, 1 // NEXT FRAME AFTER THAT, LET GO OF ALL BUTTONS
]);
```


**Performing a Frame Perfect Hadouken Motion Input Because You're a street fighter character or something**

```haxe
var direction:Int = self.getTargetFoe().getX() > character.getX() ? Buttons.RIGHT : Buttons.LEFT;
self.addInputOverrides([
	0, 1, // For ONE FRAME, we let go of all out buttons
	Buttons.DOWN, 1,
	Buttons.DOWN | direction, 1,
	direction, 1
	0, 1 // NEXT FRAME AFTER THAT, LET GO OF ALL BUTTONS
]);
```
### Clearing Queued inputs
```haxe
self.clearInputOverrides();
```
Clears out any inputs waiting to be done that have been added by `addInputOverrides`

### Checking if there's inputs being queued up
```haxe
self.hasInputOverrides();
```
Just checks if you have any inputs waiting to be performaned.


## Gathering Information on the foe

### Checking X and Y Distances Manually

First thing's first, you probably want completion on the foe itself
```haxe
var foe:Character = null;
if (Std.isOfType(self.getTargetFoe(),Character)) { // Type Checking
	foe = self.getTargetFoe();
}
```

Now assuming the `foe` variable isn't null, we can gather information, let's say you wanted to check if the foe is above you, pretty straight forward:

```haxe
var yDistance = character.getY()-foe.getY();
var foeHeight = Math.abs(foe.getEcbFootY()-foe.getEcbHeadY()); // We also get the height here
if (yDistance > foeHeight) { 
	// Do thing
}
```

Maybe you also wanna check horizontal distance as well as left/right
```haxe
var xDistance = character.getX()-foe.getX();
var xDistanceAbs = Math.abs(xDistanceAbs);
var isLeftOfMe = xDistance > 0;
if (xDistanceAbs < 70 && !isLeftOfMe) { // check if they're within 70 units of us and to the right of us
	// Do thing
}
```

Now Let's combine both checks into one, so now we're checking if:
- The opponent is to the left of us
- The opponent is within 70 units of us on the **left**
- We are above the opponent
```haxe
var yDistance = character.getY()-foe.getY();
var foeHeight = Math.abs(foe.getEcbFootY()-foe.getEcbHeadY());//  We also get the height here
var xDistance = character.getX()-foe.getX();
var xDistanceAbs = Math.abs(xDistanceAbs);
var isLeftOfMe = xDistance > 0;
if (yDistance > foeHeight && xDistanceAbs < 70 && !isLeftOfMe) { 
	// Do thing
}
```

We can also look at other information such as speed/state/facing direction etc, but you can refer to [Character](../../classes/Character.md),  [GameObject](../../classes/GameObject.md) and [Entity](../../classes/Entity.md) for any methods you want to use, they all apply here just as well.

With this you can make somewhat basic decisions like "What do I do if the for is at least 300 x units away from me horizontally but below me", etc.

