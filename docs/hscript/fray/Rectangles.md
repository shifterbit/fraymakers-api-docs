---
title: Working with Rectangles
layout: doc
prev: false
next: false
---

# Working With Rectangles

## Creating Rectangles
```haxe
//
var myRectangle:Rectangle = new Rectangle(0,0,10,10);
// Argument Structure (x,y,width,height)
```

Argument list
	1. `x`, the x Position of the rectangle
	2. `y`, the y Position
	3. `width` the width of the rectangle
	4. `height` the height of the rectangle

Note that just like points, rectangle x and y positions aren't really relative to any containers, so it only really makes sense to compare rectangles to each other in the same context.


## Updating Rectangles

Rectangle positions can be updated with `init()` like so:
```haxe
myRectangle.init(40,-7, 100,293);
```
you can also update stats like so
```haxe
myRectangle.x = 40;
myRectangle.y = -7;
myRectangle.width = 100;
myRectangle.height = 293;
```


## Checking for overlap
### Single Point
#### Using a Point

```haxe
var myRectangle1 = new Rectangle(40,-7, 100,293);
var myPoint = new Point(145, 300);
if (myRectangle.containsPoint(myPoint)) {
	Engine.log("myRectangle1 contains myPoint!");
}
```
#### Using raw coordinates
```haxe
var myRectangle1 = new Rectangle(40,-7, 100,293);
if (myRectangle.contains(145, 300)) {
	Engine.log("myRectangle1 contains (145,300)!");
}
```
### Between Rectangles
#### Complete Overlap
```haxe
var myRectangle1 = new Rectangle(40,-7, 100,293);
var myRectangle2 = new Rectangle(10,-7, 70,300);

if (myRectangle1.containsRect(myRectangle2)) {
	Engine.log("myRectangle1 contains myRectangle2!");
}
```
#### Partial Overlap

```haxe
var myRectangle1 = new Rectangle(40,-7, 100,293);
var myRectangle2 = new Rectangle(10,-7, 70,300);

if (myRectangle1.intersects(myRectangle2)) {
	Engine.log("myRectangle1 and myRectangle2 overlap!");
}
```

