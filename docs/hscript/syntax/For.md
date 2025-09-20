---
title: For Loops
layout: doc
next: 
    link: './Functions.md'
    text: "Functions"
prev: 
    link: './While.md'
    text: "While"
---
# Iterating with For Loops

## Basic Usage
Haxe does not use traditional C-Style for loops, instead, for loops follow the following
structure:
```
for (item in iterable) {
  Engine.log(item)
}
```
The iterable value which comes in one of three forms:

### Iterating Through Arrays
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
### Iterating Through Number Ranges
In some cases you might just need to run through a range of numbers but the data you're operating on isn't an iterable, or maybe you just want to generate a numbered sequence:

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

## Using Engine.forEach and Engine.forCount
When developing in fraytools you may notice that you don't get proper completion when using regular for loops as of the time of writing.

So for iterating through items with decent completion you can use `Engine.forEach` and `Engine.forCount`

I'd also recommend taking a look at [Functions](./Functions.md) since that's very relevant here.


### Engine.forEach
General Structure is
```haxe
Engine.forEach(numberOfItems, function (item,index) {
    // Function Body here accessing item or index
}, []);
```

```haxe
var list = ["apple", "pear", "banana"];
Engine.forEach(list, function (item:String , idx:Int) {
  Engine.log(item); // The item variable is accessible in this block
  Engine.log(idx); // Could also access the array index

},[]);
// apple
// 0
// pear
// 1
// banana
// 2
```
### Engine.forCount

The general structure is
```haxe
Engine.forCount(numberOfItems, function (index) {
    // Function Body here
}, []);
```




```haxe
Engine.forCount(10, function (i:Int) {
    Engine.log(i);
    return true;
}, []); // Prints 0 to 9

```

And Similarly for a string:

```haxe
var greeting = "HeyGuys";

Engine.forCount(greeting.length, function (i:Int) {
	Engine.log(string.charAt(charIndex)); 
}, []); 
// Prints all the characters line by line
  // H
  // e
  // y
  // G
  // u
  // y
  // s
```