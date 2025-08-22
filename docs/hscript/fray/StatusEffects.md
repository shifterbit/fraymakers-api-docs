---
title: Status Effects
layout: doc
prev: false
next: false
---
# Using Status Effects

Status Effects server two purposes:
- Impose Certain effects on GameObjects such as Characters, Projectiles or Assists
- Store Metadata on GameObjects.

First of you probably want to take a look at [the Status Effect Types](../../classes/StatusEffectType.md) to see what you can do.

## Breakdown of addStatusEffect
```haxe
addStatusEffect(type: Int, value?: Int, options?: StatusEffectObject): StatusEffectObject
```

- `type`: The type of status effect, see [StatusEffectType](../../classes/StatusEffectType.md)
- `value`: The value of the status effect, will be put into the StatusEffectObject, behavior is entirely dependent on the Status Effect in question.

### Breakdown of StatusEffectObject

```haxe
 {
 id: String,
 options?: 
    {
      fields?: {frameTimer?: TFrameTimer},
      metadata?: Any,
      params?: {interval?: Int}, 
      tag?: String
    },
 value: Int // Not used when passed into addStatusEffect
}
 ```
- `id`: The status id, usually used for removal
- `options`:
   - `fields.frameTimer`: TFrameTimer used for the status effect, see [TFrameTimer](../../classes/TFrameTimer.md)
   - `metadata`: Metadata you can add to a status effect, useful for storing data on characters
   - `params.interval`: The interval, usually used for Damage over time(e.g. how often to add/reduce damage)
   - `tag`: The status tag, used for grouping organizing several status effects as we'll explore later
- `value`: Value of the status effect, its behavior is entirely dependent on the status effect in question



We'll be using the `SIZE_MULTIPLIER` and `DISABLE_ACTION` as examples here for status effects
## Adding Status Effects
```haxe
self.addStatusEffect(StatusEffectType.SIZE_MULTIPLIER, 2);
self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.DASH_ATTACK);
```
## Managing Status Effects
### Using ids to remove Status Effects
First when creating status effects make sure to assign them to variables(feel free to use global variables if that fits your use case more)
```haxe
var sizeStatus = self.addStatusEffect(StatusEffectType.SIZE_MULTIPLIER, 2);
var noDashAttackStatus = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.DASH_ATTACK);
```

Then to remove them using those variables:
```haxe
self.removeStatus(StatusEffectType.SIZE_MULTIPLIER, sizeStatus.id);
self.removeStatus(StatusEffectType.DISABLE_ACTION, noDashAttackStatus.id);
```
### Using Tags to remove status effects
Now, let's say you wanted to temporarily disable a bunch of character actions like so:
```haxe
var statusNair = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.AERIAL_NEUTRAL);
var statusFAir = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.AERIAL_FORWARD);
var statusDAir = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.AERIAL_DOWN);
var statusBAir = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.AERIAL_BACK);
var statusUAir = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.AERIAL_UP);
var statusUSpec = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.SPECIAL_UP);;
var statusDSpec = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.SPECIAL_DOWN);
var statusSSpec = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.SPECIAL_SIDE);
var statusNSpec = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.SPECIAL_NEUTRAL);
var statusDStrong = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.STRONG_DOWN);
var statusFStrong = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.STRONG_FORWARD);
var statusUStrong = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.STRONG_UP);
var statusJab = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.JAB);
var statusFTilt = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.TILT_FORWARD);
var statusDTilt = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.TILT_DOWN);
var statusUTilt = self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.TILT_UP);
```

Well disabling all of them would be pretty tedious:
```haxe
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusNAir.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusFAir.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusDair.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusBAir.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusUAir.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusUSpec.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusDSpec.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusSSpec.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusNSpec.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusDStrong.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusFStrong.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusUStrong.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusJab.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusFTilt.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusDTilt.id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, statusUTilt.id);
```

If you used global variables you might also need to create one for each of these, or have an array of status effects globally, for `DISABLE_ACTION`. One way to work around this is to use a common **tag** to keep track of them so you don't have to worry about individual id's.

So you can create a bunch of them like this now:
```haxe
var disabledActions = [
    CharacterActions.AERIAL_NEUTRAL,
    CharacterActions.AERIAL_FORWARD,
    CharacterActions.AERIAL_DOWN,
    CharacterActions.AERIAL_BACK,
    CharacterActions.AERIAL_UP,
    CharacterActions.SPECIAL_UP,
    CharacterActions.SPECIAL_DOWN,
    CharacterActions.SPECIAL_SIDE,
    CharacterActions.SPECIAL_NEUTRAL,
    CharacterActions.STRONG_DOWN,
    CharacterActions.STRONG_FORWARD,
    CharacterActions.STRONG_UP,
    CharacterActions.JAB,
    CharacterActions.TILT_FORWARD,
    CharacterActions.TILT_DOWN,
    CharacterActions.TILT_UP
];

for (action in disabledActions) {
    self.addStatusEffect(StatusEffectType.DISABLE_ACTION, action, { tag: "myUniqueTag"});
}
```

Since we have `"myUniqueTag"` on each status, we don't necessarily need the individual variables statuses anymore
```haxe
var statuses = self.findStatusEffectObjectsByTag(StatusEffectType.DISABLE_ACTION, "myUniqueTag");
if (statuses != null) {
    for (action in statuses) {
        self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, action.id);
    }
}
```
As you can see it's a lot less verbose, plus we have the plus side of not needing to worry about having to manage so many global variables. You can also use tags to manage a single status effects if you wanted too.

## Using Custom Status Effects For Storing Metadata
We also have the status effect known as `CUSTOM`, which appears not to have any function, but it can still be useful
as a tool to store metadata on individual characters.

So let's say we want a move that adds extra hitstop on a foe if it hits a foe for the 3rd time, so in 
frame 1 of the move's framescript we have:

```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (e:GameObjectEvent) {
    var foe:GameObject = e.data.foe;
    // First we check if we have less than 3 status effects
    var myTag = "mySuperCoolTag";
    var statuses = self.findStatusEffectObjectsByTag(StatusEffectType.CUSTOM, myTag);
    if (statuses == null ||  (statuses != null && statuses.length < 3)) {
        // Add a status effect to keep track of hits
        self.addStatusEffect(StatusEffectType.CUSTOM, 1, { tag: myTag} );
    }

    if (statuses != null && statuses.length == 3) {
        // Apply Extra Hitstop
        foe.forceStartHitstop(foe.getHitstop() + 30);
        // Remove the old Statuses
        for (status in statuses) {
            self.removeStatusEffect(StatusEffectType.CUSTOM, status.id);
        }
    }
});
```

The neat thing about this is that we don't need individual variables to keep track of each player for 3 or 4 player matches, this also works for any GameObject too.
