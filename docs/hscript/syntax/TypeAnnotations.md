---
title: Type Annotations
layout: doc
next: 
    link: './index.md'
    text: "Haxescript"
prev: 
    link: './Function.md'
    text: "Functions"
---

## Type Annotations Primer
To put it simply, when you declare a function or variable, a type annotation lets you specify it's type.
So let's say you have a variable representing the owner:

```haxe
var owner = self.getOwner();
```

there's a few things you might noticed, for example, if the owner is a player, assist or projectile, you aren't 
getting any specific api functions for it when completing on `owner`, this is because FrayTools can't tell what **type** it is.
so to get around that, you will have:

For a Character:
```haxe
var owner:Character = self.getOwner();
```

For a Projectile:
```haxe
var owner:Projectile = self.getOwner();
```

For an Assist:
```haxe
var owner:Assist = self.getOwner();
```

and so on, doing this allows you get get more accurate completions on your variables when using FrayTools, this becomes especially 
important when using `makeObject` which returns the Any type or `makeArray`.

Of course, type annotations don't actually change how your code functions, but it does help with readability and improves the coding experience 
in the long run as code gets larger or if you take a break from a project.

For stuff like strings, numbers and booleans we have: `String`, `Int`, `Float` and `Bool`


### Array Types

For Arrays look a bit different, you have an array type being `Array` but you also have to include what the array items are so:

For an array of Ints:
```haxe
var arr:Array<Int>: [];
```

Array of Strings
```haxe
var arr:Array<String> = [];
```

Array of Characters:
```haxe
var arr:Array<Character> = [];
```

This also works for 2d Arrays like so:
```haxe
var arr:Array<Array<Int>> = [[]];

```
### Structure Types
In addition to arrays you can also write types for structures.

So lets say you had a function called `magic()` that returned 
```haxe
{
    greeting: "Hey guys",
    greeter: self
}
```
it's type would be:
```haxe
{
    greeting: String
    greeter: Character
}
```
assuming its called from a character script

and with variable assignment:
```haxe
var greeterObject: {greeting: String, greeter:Character} = {greeting: "Hey guys", greeter: self};
```
of course this can be useful in other ways too, for example if you wanted to store a player and a given filter together you could simply do:
```haxe
var glowFilter:GlowFilter = new GlowFilter();
var player:Character = match.getPlayers()[0]:
var combined: {player:Character, glow: GlowFilter} = {player: player, glow: glowFilter};

// adding the filter later
combined.player.addFilter(combined.glow);
```


### Composing Types
You can also compose types, for example lets say you wanted an array of objects, with each object having one field for a player, another for a filter you can have:
```haxe
var playersWithFilters:Array<{player:Character, glowFilter: GlowFilter}> = [];
```
Let's say we wanted our type to also store an array of Ints, just because:

```haxe
var playersWithFilters:Array<{player:Character, glowFilter: GlowFilter, numbers: Array<Int>}> = [];
```

Or if we wanted another field, maybe an a boolean field to say if the filter was applied:
```haxe
var playersWithFilters:Array<{player:Character, glowFilter: GlowFilter, numbers: Array<Int>, filterApplied: Bool}> = [];
```

and of course we can split it over multiple lines:
```haxe
var playersWithFilters:Array<{ 
                            player:Character, 
                            glowFilter: GlowFilter,
                            numbers: Array<Int>,
                            filterApplied: Bool
                            }> = [];
```


The nice thing about these is that you get autocomplete on the types inside the types as well, regardless of whether you hae a 1D array or a 400D array or an array of objects or an object containing arrays, or objects containing objects etc.

### Function Types
You can also add type annotations to function arguments as well as the function return types


So if you want to annotate a function that expects a string you have:

```haxe
function greeting(message:String) {
    Engine.log(message);
}
```

but if say, you wanted to specify return types as well(FrayTools and automatically infer this most of the time for functions you define)
```haxe
function makeGreeting(name:String): String {
    return "Hey Guys its " + name;
}
```

and if you wanted to have more complex types, those work as well here, just ensure the return type fits
```haxe
function removeFilter(filterObj: {player:Character, filter:GlowFilter, filterApplied: Bool}): {player:Character, removedFilter:Bool} {

    var player = filterObj.player; // Because we specified the type above, FrayTools can infer it for us
    var filter:GlowFilter = filterObj.filter; // You can also just put the type anyways
    player.removeFilter()

    return {
        player: player,
        removedFilter: true
    };
}
```

Function types can also be especially helpful when working with event listeners, for instance:
```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (event) {
    Engine.log(event.data.foe);
});
```

would have zero code completion on event.data, because we haven't specified the type, but if we have a type signature:
```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (event:GameObjectEvent) {
    Engine.log(event.data.foe);
});
```
It will autocomplete for all the fields under event.data.

