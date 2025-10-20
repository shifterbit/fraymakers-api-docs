---
title: How to Read Errors
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
[Error] Coult not parse contents of "scriptId" in resource "resourceID"
```
Either the script file is missing(see below), or there's a syntax error(see above)



### Missing Script Errors
```js
[Error] Coult not find script "scriptId" in resource "resourceID"
```

This one's a bit straightforward, it essentially means either:
- The id is wrong on the script file
- The id the wrong on the manifest


### Type Errors - TODO