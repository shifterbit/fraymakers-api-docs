---
title: Functions
layout: doc
next: 
    link: './TypeAnnotations.md'
    text: "Type Annotations"
prev: 
    link: './For.md'
    text: "For"
---


## Using Funcitons

### Without Arguments
```haxe
// Declare our new function
function sayHello() {
  Engine.log("Hello!");
}

// Call it
sayHello();
```

### With a single Argument
```haxe
// Declare our new function
function helloFrom(name: String) {
  Engine.log("Hello, I am " + name);
}

// Call it
helloFrom("Fraynkie");

```
Functions can also be declared without, specifying types, but specifying types is always
recommended as it helps auto-completion provide you with more accurate suggestions.
```
// Function without specifying types
function helloFrom(name) {
  Engine.log("Hello, I am " + name);
}
```

### Default Arguments

```haxe
// Declare our new function
function helloFrom(name: String = "Fraynkie") {
  Engine.log("Hello, I am " + name);
}

// Call it
helloFrom("John"); // prints "Hello, I am John"
helloFrom(); // prints "Hello, I cam Fraynkie"

```

### Optional Arguments
```haxe
// Declare our new function
function helloFrom(?name: String) {
  if (name != null) {
	Engine.log("Hello, I am " + name);
  } else {
	Engine.log("Hello");
  }
}

// Call it
helloFrom("John"); // prints "Hello, I am Fraynkie"
helloFrom(); // prints "Hello"

```

### Return Values and Types
```haxe
// Declare our new function

function sum(a: Int, b: Int):Int {
  return a + b;
}

// Call it
var result: Int = sum(2, 4);
Engine.log(result);
```

Just like before, the return type at the end can also be omitted, but again, you 
should always specify types when possible
```haxe
function sum(a: Int, b: Int) {
  return a + b;
}
```

### Local Functions
```haxe
function sumSquares(numbers: Array<Int>): Int {
	var sum: Int = 0;
	function square(x: Int): Int  {
		return x * x;
	}
	// This is also equivalent to the above
	var square = funtion (x: Int): Int { return x * x; };
	
	for (num in numbers) {
		sum += square(num);

	}

}
```


### Functions as values
In Haxe, and by extension hscript, almost everything is an expression, this means you can:
#### Pass Functions to variables
We've already seen this above
```haxe
var x = function () {
	Engine.log("a");
};
```

#### Pass functions to other functions
```haxe
function greet(name: String) {
	Engine.log("Hello " + name);
}

function performGreetings(greeterFn, names: Array<String>) {
	for (name in names) {
		greeterFn(name);
	}
}

var names = ["Welltaro", "The Watcher", "Commander Video", "Orcane", "Ultra Fishbunjin 3000", "Octodad"];
performGreetings(greet,names );
```

#### Return Functions from other Functions
We can use a case where we might wanna wrap argument function in an event listener
```haxe

function reduceOpacity(player: Character) {
	player.alpha -= 0.01;
}

function wrapInEvent(fn) {
	return function (event: GameObjectEvent) {
		fn(event.data.self);
	};
};

// now we can add an event listener that uses this function like so
self.addEventListener(GameObjectEvent.HIT_RECEIVED, wrapInEvent(reduceOpacity), {persistent: true});
// Same as
self.addEventListener(GameObjectEvent.HIT_RECEIVED, function (event: GameObjectEvent) { reduceOpacity(event.data.self); }, {persistent: true});
```
