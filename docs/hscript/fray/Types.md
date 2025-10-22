---
title: Understanding Types
layout: doc
prev: false
next: false
---
Note: I will be skimming over details here about OOP

# Types in Programming
Generally speaking, most programming langauge have a notion of **types**, but what they? In short **types** tell the programming environment what type of data something is so it can be worked with.

For example, division is something that should only work with certain **types** of data, such being intergers or floating point/decimal numbers.

Basically all data has a certain type which dictates what operations can be performeed on it as well as what it can do.

More complex types are also composed from other types, for example an array is just a list of a bunch of data which all have other types, or objects/classes which have fields/properties of simpler types(Think of how `sprite.x` is really just the sprite storing a decimal in the `x` field). These composite types are useful, but what if we need shared behavior?

Which leads us right into a concept known as inheritance.
## Inheritance
Inheritance is a fairly simple concept, you take an existing composite type(say you have a class called `Animal`) and use it as a base to build something a bit more specific(say a `Dog` type that inherits from `Animal`), which allows you to have a common set of behaviors. If you have a function that accepts an argument of type `Animal`, you can also pass a variable of type `Dog` and it'll work just fine, because the `Dog` class inherited all the behaviors from the `Animal` class. 

Turns out, this also applies to the Fraymakers API, if you've spent any amount of time using the api methods, you'll notice that a lot of object types have a quite a few methods in common. Let's look at a really simple method `.getX()`, which happens to work on a ton of types, `Character`, `GameObject`, `Entity`, `Projectile`, `Assist`, `CustomGameObject`or `Vfx`, but looking at the Api docs, you'll notice its on the entity page, this is because `Entity` defines this behavior, whilst everything else builds upon it.

This also has some other implications, which allow quite a bit of flexibility, let's look at the function `camera.addForcedTarget`, if we look at its type signature:
```haxe
addForcedTarget(entity:Entity)
```
you'll notice it specified an entity, but you can also use anything that inherits from `Entity`, as whatever `Entity` can do `Character`, `GameObject`, `Entity`, `Projectile`, `Assist`, `CustomGameObject`or `Vfx` can do.

Only thing to note is that this does not apply backwards, so if a function expects a `GameObject`, you cannot pass an `Entity` as `GameObject` is capable of more, but you can pass `Character`,`Projectile`, `Assist`, `CustomGameObject` or of course, `GameObject` itself.

The reason this is possible is due to something known as **casting**, where something can be seamelessly be "converted"/treated as another type if its compatible.


- types that inherit from other parent types can be used when the parent is expected(e.g you can use a `Character` where a `GameObject` is expected)
- When passing data into functions pay attention to the type it accepts, you can **only pass data that either that type or inherits from it in some way** (You cannot pass a `GameObject` when a `Character` is expected).


A basic understanding of this can help you avoid a ton of errors, and potentially write code that's more flexible.

# Types in Fraymakers
Here's a class/type tree for some common fraymakers types, data taken from https://github.com/Fraymakers/api-types-plugin/blob/main/src/ts/typedefs/fraymakers-api.d.ts

Basically, sub-list items inherit from thier list ancestors, not exactly comprehensive but should have you covered.

- [ApiObject](../../classes/ApiObject.md)
    - [CustomApiObject](../../classes/CustomApiObject.md)
        - [AssistController](../../classes/AssistController.md)
    - [Entity](../../classes/Entity.md)
        - [AiGraphNode](../../classes/AiGraphNode.md)
        - [Vfx](../../classes/Vfx.md)
        - [CollisionArea](../../classes/CollisionArea.md)
        - [GameObject](../../classes/GameObject.md)
            - [Character](../../classes/Character.md)
            - [Projectile](../../classes/Projectile.md)
            - [CustomGameObject](../../classes/CustomGameObject.md)
                - [Assist](../../classes/Assist.md)
        - [Structure](../../classes/Structure.md)
            - [LineSegmentStructure](../../classes/LineSegmentStructure.md)
                - [CustomLineSegmentStructure](../../classes/CustomLineSegmentStructure.md)
- [DisplayObject](../../classes/DisplayObject.md)
    - [Mask](../../classes/Mask.md)
    - [Container](../../classes/Container.md)
    - [Drawable](../../classes/Drawable.md)
        - [Sprite](../../classes/Sprite.md)
    - [Container](../../classes/Container.md)
- [Filter](../../classes/Filter.md)
    - [DisplacementFilter](../../classes/DisplacementFilter.md)
    - [GlowFilter](../../classes/GlowFilter.md)
    - [HsbcColorFilter](../../classes/HsbcColorFilter.md)
    - [MaskFilter](../../classes/MaskFilter.md)
    - [StrokeFilter](../../classes/StrokeFilter.md)
- [Shader](../../classes/Shader.md)
    - [PaletteSwapShader](../../classes/PaletteSwapShader.md)
    - [RgbaColorShader](../../classes/RgbaColorShader.md)
    - [SolidColorShader](../../classes/SolidColorShader.md)
