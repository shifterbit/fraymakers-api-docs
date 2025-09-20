---
title: Event Listeners
layout: doc
prev: false
next: false
---
# Using Event Listeners
Event listeners allow you to run some code in response to a particular event happening.

## Events and Their Users
- [MatchEvent](../../classes/MatchEvent.md) usable by [Match](../../classes/Match.md)
- [GameTimerEvent](../../classes/GameTimerEvent.md) usable by [Match](../../classes/Match.md)
- [ScoreEvent](../../classes/ScoreEvent.md) usable by [Match](../../classes/Match.md)
- [AssistEvent](../../classes/AssistEvent.md) usable by [Match](../../classes/Match.md)
- [StructureEvent](../../classes/StructureEvent.md) usable by [Structure](../../classes/Structure.md)
- [CharacterEvent](../../classes/CharacterEvent.md) usable by [Character](../../classes/Character.md)

- [GameObjectEvent](../../classes/GameObjectEvent.md) usable by:
    - [Assist](../../classes/Assist.md)
    - [Character](../../classes/Character.md)
    - [CustomGameObject](../../classes/CustomGameObject.md)
    - [GameObject](../../classes/GameObject.md)
    - [Projectile](../../classes/Projectile.md)

- [EntityEvent](../../classes/EntityEvent.md) usable by:
    - [AiGraphNode](../../classes/AiGraphNode.md)
    - [Assist](../../classes/Assist.md)
    - [Character](../../classes/Character.md)
    - [CollisionArea](../../classes/CollisionArea.md)
    - [CustomGameObject](../../classes/CustomGameObject.md)
    - [CustomLineSegmentStructure](../../classes/CustomLineSegmentStructure.md)
    - [Entity](../../classes/Entity.md)
    - [GameObject](../../classes/GameObject.md)
    - [Projectile](../../classes/Projectile.md)
    - [RectCollisionArea](../../classes/RectCollisionArea.md)
    - [RectStructure](../../classes/RectStructure.md)
    - [Stage](../../classes/Stage.md)
    - [Structure](../../classes/Structure.md)
    - [Vfx](../../classes/Vfx.md)


## Primer on Event Listeners
So here's the types for adding and removing event listener:
### Breakdown on function type
```haxe
addEventListener(type:Int, func:Listener, options?: {persistent: Bool})
removeEventListener(type:Int, func:Listener)
```

Let us breakdown what they mean, starting with adding:
- `type`: The type of event listener, one of the constants from the event classes listed above
- `func`: A function that takes an event class as an argument, this should correspond to the type, so if you have a `GameObjectEvent.HIT_DEALT`, then your function should look like:
  ```haxe
  function foo(event:GameObjectEvent) {
    Engine.log("Hey guys");
  }
  ```
  Should also take a look at [The Functions Section](./Functions.md) if you haven't.
- `{persistent: Bool}` if true, the event listener will never stop unless manually removed, otherwise it will 
  stop listening when the animation ends.


Removing event listeners is pretty similar, just without the persistent part:
- `type`: The type of event listener, one of the constants from the event classes listed above
- `func`: A function that takes an event class as an argument, this should correspond to the type, so if you have a `GameObjectEvent.HIT_DEALT`, then your function should look like:
  ```haxe
  function foo(event:GameObjectEvent) {
    Engine.log("Hey guys");
  }
  ```
### Examples

#### Basic Non Persistent Event
```haxe
// This would go in that animations framescript and would stop listening once the animation ends
self.addEventListener(GameObjectEvent.HIT_RECEIVED, function (e:GameObjectEvent) {
  self.addDamage(-10);
});
```
#### Basic Persistent Event
If you wanted the event listener to persist through multiple animations:
```haxe
// Lasts forever unless we remove it with self.removeEventListener
self.addEventListener(GameObjectEvent.HIT_RECEIVED, function (e:GameObjectEvent) {
  self.addDamage(-10);
}, {persistent: true});
```

#### Single Use Persistent Event
Event Listeners can also remove themselves, useful for cases where you want a persistent listener that only runs once:
```haxe

self.addEventListener(GameObjectEvent.HIT_RECEIVED, function healDamage(e:GameObjectEvent) {
  self.removeEventListener(GameObjectEvent.HIT_RECEIVED, healDamage); // You need a reference to the function to remove it
  self.addDamage(-10);
}, {persistent: true});
```
#### Event listeners without the use of inline functions
Optionally you can also define the functions outside and just pass them to event listeners without calling them, useful sharing functions across several listeners, this is useful since you need a reference to the function to remove the listener from the outside:
```haxe
function healDamage(e:GameObjectEvent) {
  self.addDamage(-10);
}
self.addEventListener(GameObjectEvent.HIT_RECEIVED,healDamage, {persistent: true});
// Later on when you dont need it
self.removeEventListener(GameObjectEvent.HIT_RECEIVED,healDamage);
```


### Caveats when using inline functions for event listeners
One thing to keep in mind when adding and removing event listeners is about how inlining affects things.
When you pass a function to an event listener, no matter how you do it, the event listener sees a **reference** to
that function.

When you inline a function, you're actually creating a new one each time, all with a different **reference**, so what does
this mean in practice:

If you have the event listener like:
```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (event:GameObjectEvent) {
    var target = event.data.self;
    target.setScaleX(target.getScaleX() * 1.05);
    target.setScaleY(target.getScaleY() * 1.05);
}, {persistent: true});
```
And tried to remove it like:

```haxe
self.removeEventListener(GameObjectEvent.HIT_DEALT, function (event:GameObjectEvent) {
    var target = event.data.self;
    target.setScaleX(target.getScaleX() * 1.05);
    target.setScaleY(target.getScaleY() * 1.05);
});
```
You might find that it doesn't work as expected, this is because you're actually creating two different functions each time, you can test this by calling `Engine.log` twice with two identical inline functions like:
```haxe
Engine.log(function () {});
Engine.log(function () {});
```

So to work around this you can define the function outside

```haxe
function grow(event:GameObjectEvent) {
    var target = event.data.self;
    target.setScaleX(target.getScaleX() * 1.05);
    target.setScaleY(target.getScaleY() * 1.05);
}
self.addEventListener(GameObjectEvent.HIT_DEALT, grow, {persistent: true});
self.removeEventListener(GameObjectEvent.HIT_DEALT, grow);
```

of course having the function defined on the outside has the secondary advantage of having the function being reusable
for multiple events like so:
```haxe

function grow(event:GameObjectEvent) {
    var target = event.data.self;
    target.setScaleX(target.getScaleX() * 1.05);
    target.setScaleY(target.getScaleY() * 1.05);
}
self.addEventListener(GameObjectEvent.HIT_DEALT, grow, {persistent: true});
self.addEventListener(GameObjectEvent.GRAB_DEALT, grow, {persistent: true});
self.addEventListener(GameObjectEvent.SHIELD_HIT_DEALT, grow, {persistent: true});
```
It also doesn't just have to be `self`, you can add event listeners to other players, or projectiles as well