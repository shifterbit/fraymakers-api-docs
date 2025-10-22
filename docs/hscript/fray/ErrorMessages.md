---
title: How to Read Error Messages
layout: doc
prev: false
next: false
---

# Reading Error Messages 

First we're gonna go over different error types and explain what they mean

## Typos/Syntax/Parse Errors

A parse error can simply be seen as a syntax error, maybe you misplaced a semicolon, used a symbol wrong, etc, It's the **programming equivalent of a spelling mistake**.

First tokens!
#### Tokens
 Not gonna go into technical details but if you were to think of your script as a paragraph, a token would be a word or element of punctuation, 
 **Keyword Tokens**:
	 - `function`
	 - `var`
	 - `for`
	 - `switch`
	 - `case`
	 - `class`
	 -  `in`
**Single/Two Character Tokens**(These represent either operators or statement enders or blocks)
- `|` `||` `&` `&&`
- `=`  `==
-  `>=`  `<=`
- `>` `>>`  `<<` `<`
- `!=` `*=` `-=` `+=`  `&=`  `/=`
- `.` `;` `,`

or **Any Valid Value or Variable Name**

### Understanding the messages
So let's break this error down:
```js
	[Error] Script Parse Error: "[cc]objectStats:32": Unexpected token "]" in "template"
```
First lets break it into sections:

First we have the "header", basically tells us its a syntax error, not much to say here
```js
[Error] Script Parse Error: 
```

Next we have the location
```js
 "[cc]objectStats:32"
```
This tells us the **location** of the error, in this case its **line 32** of the file that happens to have the id `objectStats`

next we have what the game caught
```js
 Unexpected token "]"
```

In Plain English, using the information we have, this translates to:

Mr Haxe Bot: `I was reading the script file with the id objectStats, but on line 32 I ran into a "]", when I expected something else.`
or in bullet point form:
- Something went wrong trying to read the script with the id `objectStats`
- The error occured on line 32
- There was a `]` character where it isn't supposed to be

Common causes for this could be:
- forgetting a semicolon(usually on the previous lines)
- not closing braces({}) properly  when writing out event listeners
- Missing commas


```js
[Error] Could not parse contents of "scriptId" in resource "resourceID"
```
Either the script file is missing(see below), or there's a syntax error(see above)



### Missing Script Errors
```js
[Error] Could not find script "scriptId" in resource "resourceID"
```

This one's a bit straightforward, it essentially means either:
- The id is wrong on the script file
- The id the wrong on the manifest


## Argument Errors

Let's imagine a scenario, you have a function like this:
```haxe
function dealSomeDamage(character:Character) {
	character.addDamage(100);
}

dealSomeDamage(); // line 68
```

Running this code may result in a crash, or error, but either way it would print out something like this in
the log
```haxe
[Error]: [cc] scriptId:68 Invalid number of parameters. Got 0 required 1 for function 'dealSomeDamage'
```
Now as to what this error means in bullet point form:
- Something went wrong on line 68
- the `dealSomeDamage` function *requires* 1 argument to be passed, but it received none

so the solution here would be simple, just pass an argument to the function when you should, if its self for example:

```haxe
dealSomeDamage(self);
```

If its inside an event listener
```haxe
dealSomeDamage(event.data.foe);
```
Basically be mindful of how many arguments your functions require when using them.

Another instance where not being mindful of this can be extra troublesome is using them with event listeners and timers, since those will likely cause a crash if you pass a function with an incorrect number of arguments. Examples:

```haxe
self.addEventListener(GameObjectEvent.HIT_DEALT, function (event:GameObjectEvent, character:Character) {
	Engine.log("Hit something!");
});
```
Would crash with something like
```haxe
Exception: [cc] scriptId:68 Invalid number of parameters. Got 1 required 2 for function.
```

Similar thing goes for timers

```haxe
self.addTimer(90, 1,function (character:Character) {
	Engine.log("Waited 90 frames!");
});
```
Would crash with something like
```haxe
Exception: [cc] scriptId:68 Invalid number of parameters. Got 0 required 1 for function.
```

## Type Errors
Another type of error, known as a **type error**. But before breaking down type errors, we need to undetstand what types are.

### Types and Inheritance

First off, it's important to have a good concept for types


All Data in Fraymakers is of a certain **type**, be it a `String`, `Bool`, `ApiVarObject`, `Character`, `GameObject` or many more.
- Some Types are based on other types, like `Character` being based on `GameObject` which is based on `Entity`, you can infer these relationship just by looking at the methods available from completion or checking out the api types repo.
- Unless a type is based on another type, they are not interchangable, the only exception to this is the various number types.
- The type hints you write out in code do not actually change the type, it's only really to ensure proper code completion, especially if you're using `self.makeObject` for rollback friendly stuff.

Now that you know a bit about types we're going to be looking at a couple of type cast errors


### Type Casting errors
First I'd recommend you read up on [Types and Inheritance here](./Types.md).

```haxe
camera.getBackgroundContainer().addChild(self);
```

Here's a pretty basic one, first the code, then the error it'd result in
```haxe
[Error] Script Interpret Error: objectScript:218::Can't cast pxf.api.VfxApi to pxf.api.DisplayObjectApi (origin: objectscript)
```
Which in bullet point form means:
- Something went wrong on line 218 of `objectScript`
- That thing being  `pxf.api.VfxApi` could not be **cast** to `pxf.api.DisplayObjectApi`

Basicallly, the function wanted something that's either a DisplayObject or something that inherits from it(hope you read up).


sometimes it's a bit weirder, when you forget to call functions
```haxe
camera.getBackgroundContainer().addChild(self.getViewRootContainer);
```
Giving errors like this

```haxe
[Error] Script Interpret Error: objectScript:218::Can't cast (Container ()) to pxf.api.DisplayObjectApi (origin: objectscript)
```
in this case you passed a function hence it has the `()`, for the actual format, its roughly like this
```haxe
(<return type> (arg1 type, arg2 type,.....))

```
the solution often times is to just add the missing `()` like so 
```haxe
camera.getBackgroundContainer().addChild(self.getViewRootContainer());
```