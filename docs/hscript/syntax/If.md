---
layout: doc
title: If Else Expressions
next: 
    link: './Switch.md'
    text: "Switch"
prev: 
    link: './Blocks.md'
    text: "Blocks"
---

# If Expressions
## Basic If
```haxe
// if (condition) expression;
if (1 > 0) {
	Engine.log("Obviously True");
}

```
## If-Else
The condition expression must be of type `Bool`, else is also optional
```haxe
// if (condition) expression else expression2;
if (a > b) {
	Engine.log("a is larger");
} else {
	Engine.log("a is not  larger");
}
```
## Notes on Types
Note that both expression1 and expression2 types should be the same

```haxe
// if (condition1) expression1
//else if (condition2) expression2
// else expression3

var a = 2;
var b = 5;

if (a > b) {
	Engine.log("a is larger");
} else if (b > a) {
	Engine.log("b is larger");
} else {
	Engine.log("a and b are equal");
}

// Remember they are expressions!
var larger = if (a > b) {
	a;
} else if (b > a){
	b;
} else {
	a;
};
```
