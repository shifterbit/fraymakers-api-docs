---
title: For Loops
---
Haxe does not use traditional C-Style for loops, instead, for loops follow the following
structure:
```
for (item in iterable) {
  Engine.log(item)
}
```
The iterable value which comes in one of three forms:

## Iterating Through Arrays
Arrays are likely to be the most common iterator
```haxe
var list = ["apple", "pear", "banana"];
for (item in list) {
  Engine.log(item); // The item variable is accessible in this block
}
// apple
// pear
// banana
```
## Iterating Through Number Ranges
In some cases you might just need to run through a range of numbers but the data you're operating on isn't an iterable or maybe you just want to generate a numbered sequence:

This is a basic for loop using iterators:
```haxe
for (i in 0...10) {
	Engine.log(i); 
} // Prints 0 to 9
```
If you wanted to iterate through all characters in a string:
```haxe
var greeting = "HeyGuys";
for (charIndex in 0...(greeting.length)) {
	Engine.log(string.charAt(charIndex)); 
} // Prints all the characters line by line
  // H
  // e
  // y
  // G
  // u
  // y
  // s
```

