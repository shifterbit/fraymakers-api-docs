---
title: Blocks
layout: doc
next: 
    link: './If.md'
    text: "If-Else"
prev: 
    link: './Operators.md'
    text: "Operators"
---
# Block Expressions
## Basic Usage
Blocks create scopes.
```haxe
var a = 1;
{
	var b = 2;
		{
		var c = 2;
		} // c goes out of scope
} // b goes out of scope
```


Because blocks are expressions they can be used as values, the value the block returns would be the value of the first called return statement like so
```haxe
var x = {
	var a = 1;
	var b = 4;
	a + b;
}; // a and b are now out of scope since wer are outside the block

Engine.log(x) // x is now 5

```
