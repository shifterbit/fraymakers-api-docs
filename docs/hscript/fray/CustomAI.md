---
title: Custom AI
layout: doc
prev: false
next: false
---

# Better Completion for CustomAI
Add these top level variables.
```haxe
var self:CharacterAiScript = self;
var character:Character = character;
```

Naturally, `character` refers to the player character the cpu is controlling.

# Building Custom AI

Writing your own custom AI can be broken down into a few parts:
- Finding your target
- Passing in inputs
- Using the API to gather information so you can potentially have the AI make smarter decisions(or just behave the way you want it to)



## Checking your CPU Level

Checking your CPU level is pretty straight forward, simply check
```haxe
character.getPlayerConfig().level
```
This gives you an integer between 0-9, how you use this is entirely up to you, be it for rng calls, timers etc.

## Ensuring your CPU does not immediately start attacking on training mode
Basically, do this check
```haxe
self.getBehavior() == AiBehavior.ATTACK
```

Though you'd probably not want to repeat this line of code all the time so, I'd suggest wrapping all your attack logic at the very least in one top level function, and return early if it's false
```haxe
function checkAttack() {
	if (self.getBehavior() != AiBehavior.ATTACK) {
		return;
	}
}
```
Of course you can also seperate your logic into smaller functions that get called by this.

## Disabling and Enabling Moves
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
var targetFoe:Entity = self.getTargetFoe();
var targetCharacter:Character = null;
if (Std.isOfType(targetFoe,Character)) { // Type Checking
	targetCharacter = targetFoe;
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

now for inputs...

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
### Clearing Previous Input Queues
```haxe
self.clearInputOverrides();
```
Clears out any inputs waiting to be done that have been added by `addInputOverrides`

### Checking if there's inputs waiting to be done
```haxe
self.hasInputOverrides();
```
Just checks if you have any inputs waiting to be performaned.

## Making Decisions
For Custom AI, it's enough to make inputs but also **when** to make them, but to know when to make them we need **information**, so I'll outline some methods to get information about opponents which you can use to hopefully help the AI make better decisions.

### Keeping Track of Foe Positioning
#### Checking X and Y Distances Manually
This is probably the simplest form of info gathering, which is fairly straightforward

```haxe
var xDistanceAbs:Float = Math.abs(character.getX() - self.getTargetFoe().getX());
var yDistanceAbs:Float = Math.abs(character.getY() - self.getTargetFoe().getY());
var foeAbove:Bool = character.getY() > self.getTargetFoe().getY();
var foeIsLeft:Bool = character.getX() > self.getTargetFoe().getX();
var foeInFront:Bool = (character.isFacingRight() && !foeIsLeft) || (character.isFacingLeft() && foeIsLeft);
```

With this you can make somewhat basic decisions like "What do I do if the for is at least 300 x units away from me horizontally but below me", etc

#### Keeping Track of a Global Foe Point
Another thing you can do is maintain 2 points, one for you and one for your foe
```haxe
var myPoint = self.makePoint(0,0);
var foePoint = self.makePoint(Math.POSITIVE_INFINITY,Math.POSITIVE_INFINITY);
```

Then with a helper function
```haxe
function updatePoints() {
	myPoint.init(character.getX(), character.getY());
	if (self.getTargetFoe() != null) {
		foePoint.init(self.getTargetFoe().getX(),self.getTargetFoe().getY());
	} else {
		foePoint.init(Math.POSITIVE_INFINITY,Math.POSITIVE_INFINITY);
	}
}
```

then in `update`

```haxe
function update() {
	updatePoints();
	if (self.isRecovering()) {
		checkRecovery();
	}
}
```
Of course now you can use all the point methods described in [[Points]] to check distances and such.

Of course you could take this a step further, for instance you could always make decisions based on information on the foe, maybe you want to do a certain move when the foe is shielding, or when their on the ledge etc.

#### Global Foe Rectangle - TODO
Rectangles, are similar to points, but have a few advantages, most notably, you can actually use them to check if a particular hitbox will land, additionally you can directly use the numbers from your entity to perform those checks!