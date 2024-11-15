---
title: Switch Expressions
---
```haxe
// switch expression {
//  	case value1: body1;
//  	case value2: body2;
//  	default: default-expression
// }
var a = "eggs";
switch (a) {
	case "bacon":
		Engine.log("got Bacon");
	case "eggs":
		Engine.log("got Eggs");
	default:
		Engine.log("got something else");
}
```