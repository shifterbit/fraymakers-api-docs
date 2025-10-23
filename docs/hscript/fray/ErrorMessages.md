---
title: How to Read Error Messages
layout: doc
prev: false
next: false
---

# Reading Error Messages 

## How to figure out the location of the error -  READ THIS FIRST


Some Error Messages follow this structure:
```haxe
[Error] <Error Type> <Error Location> <Message Contents> (origin <Error Location>)
```
For reference, everything inside the angle brackets(<>) is a placeholder for something else, `<Message Contents>` is pretty self explanatory, and its variations will be explained in the rest of this document.
### Error Types
First `Error Type`, this is the type of error, Errors can be thrown into roughly two categories, where most errors either fall in one or the other:
- `Script Parse Error`: These are syntax errors, comes from typos, missing/extra commas, brackets etc. These are the errors you wan't to take care of first, as they can prevent some code from running, which hides other errors.
- `Script Interpret Error`: These are logical errors, this usually comes from using Api methods incorrectly or just invalid code that happens to be syntatically correct, the most basic examples of this include trying to access a field on a null value or mispelling a variable name.

Now for the Error Location, errors typically exist either in a .hx(Script os stats) file or within one of the many framescripts of an entity. The error uses one of the following conventions depending on where the error is:

### Error Locations
`<Error Location>` is one of the following

For Script Files:
```haxe
[cc] <Script Id>:<Line Number>
```
- `<Script Id>`: The id of the script
- `<Line Number>`: The line of code where the error was detected

Example Location: `charactertemplateScript:12`

If an error message has the above location for example, to locate it you need to:
1. Go to the **script** with the id `charactertemplateScript`
2. Go to line 12.


For Framescripts:
```haxe
[cc] <Entity Id>:<Animation Name>:frame<Frame Number>:<Line Number>
```
- `<Entity Id>`: The Id of the Entity where you animatons are, this is not necessarily the same as the content id for your character/stage/assist/projectile.
- `<Animation Name>`: self-explanatory, the name of the animation where the framescript in question is located
- `<Frame Number>`: The frame number of the keyframe of the framescript layer where the error is occuring
- `<Line Number>`: The line number within the particular framescript where the error is occuring

Example Location: `charactertemplate:special_neutral:frame5:2`

If an error message has the above location for example, to locate it you need to:
1. Open to the **entity** with the id `charactertemplate`
2. Open the **animation** with the name `special_neutral`
3. Go to **Frame 5** and open the **Framescript Layer Keyframe** there
4. Go to **Line 2** in the code popup


And that's all for locating errors, error messages may feel overwhelming to look at, especially if there's a flood of red on your screen, 
but learning to find where the errors are being reported is an important step towards fixing any bug; And with enough practice, reading error
messages will become second-nature.


## Missing Script Errors
```js
[Error] Could not find script "scriptId" in resource "resourceID"
[Error] Could not parse contents of "scriptId" in resource "resourceID"
```

This one's a bit straightforward, it essentially means either:
- The id is wrong on the script file
- The id the wrong on the manifest

Fix is straightforward: double-check your ids.

## Typos/Syntax/Parse Errors

A parse error or a syntax error can be viewed as the **programming equivalent of a spelling mistake or grammatical error**.

First tokens!
#### Tokens
 Not gonna go into technical details but if you were to think of your source code as a book, a token would be either a word or punctuation, 
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
- `=`  `==`
-  `>=`  `<=`
- `>` `>>`  `<<` `<`
- `!=` `*=` `-=` `+=`  `&=`  `/=`
- `.` `;` `,`

**The end-of-file token**
This one is a bit of a special case since it's technically the only token you cannot type, but it would be displayed as `<eof>` which well,
marks the end of the file, the biggest causse for this is usually a top level bracket or brace that's missing a matching pair.

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
Note that occasionally if a syntax error is bad enough, sometimes it prevents the entire script from being parsed, resulting in this error, you will likely see this if you mess up global variables


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
in this case you passed a function hence it has the `()` inside. 

For the actual format, it is structured like this:

```haxe
(<return type> (arg1 type, arg2 type,.....))

```
the solution often times is to just add the missing `()` like so 
```haxe
camera.getBackgroundContainer().addChild(self.getViewRootContainer());
```

## Null Errors

### Null Access .e
This error can be pretty confusing, and devastating, It prevents your entire script from being run at all.
and you get this error:
```haxe
[Error] Script Interpret Error: hscript:0::Null Access .e (origin: [cc] objectScript)
```
now, this doesn't really give you much to go of off, but what we do know is the id, being the hypothetical `objectScript` (which would be the actual script id in your case).

The cause of this error is creating a global variable without assigning it to anything, for instance, let's say I'm implementing a meter and need a global variable for my meter sprite and I do this:
```haxe
var meterSprite:Sprite;
```
or
```haxe
var meterSprite;
```

then we'd get the error, to fix this, you want to assign it to null, or some default value, either:

```haxe
var meterSprite:Sprite = null;
```
or
```haxe
var meterSprite = null;
```

so in short, ensure ALL your global variables are initialized to something, even if that something is `null` in the case of api classes or strings,
 `0` in the case of numbers or `true`/`false` in the case of booleans.

### Unknown variable Errors
```haxe
[Error] Script Interpret Error: [cc] objectScript:68 Unknown Variable: myVarable (origin: [cc] objectScript)
```
Which in bullet point form means:
- Something went wrong on line 68 of `objectScript`
- That thing being that `myVariable` does not exist yet you are trying to use it.

A Few potential causes here:
- You have a syntax error that causes your variable not to be loaded
- You made a typo and actually meant `myVariable` for example
- A Null Access .e error(see above) prevented the variable from loading since the script it existed it refused to load,
- The script the variable was defined in had the wrong id

## Invalid Access Errors
```haxe
[Error] Script Interpret Error: [cc] objectScript:68 Invalid access to field setX (origin: [cc] objectScript)
```

This Error Occurs for a few reasons:
- The field does not exist on the variable/object you're accessing it on, for example, `setX` does not exist on a `Sprite` or `Container`
- The variable/object you're trying to access is null, this can be prevented by performing nullchecks like so:
```haxe
if (myVar != null) {
	myVar.setX(29);
}	
```
- Another possibility is that it's been disposed, so you need to use both a null check and a dispose check like so:
```haxe
if (myVar != null && !myVar.isDisposed()) {
	myVar.setX(29);
}	
```