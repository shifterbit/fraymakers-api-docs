---
title: Working with Points
layout: doc
prev: false
next: false
---

# Points
Points can be viewed as essentially wrappers around (x,y) coordinates, and are pretty useful since there's many helper functions that work with points.


## Creating Points
### Global, Rollback Friendly Pointers
```haxe
var __tempPoint1:Point = self.makePoint(0,0);
```

### Global or Local Non Rollback Friendly Pointers
```haxe
var __tempPoint1:Point = new Point(0,0);
```

or 

```haxe
var __tempPoint1:Point = Point.create(0,0);
```



## Updating Points
(we will assume your point is `__tempPoint1`)
Updating both x and y coordinates at once
```haxe
__tempPoint1.init(40,10);
```

Updating just the x or y coordinates
```haxe
__tempPoint1.x = 40;
__tempPoint1.y = 10;
```


## Disposing of Points

```haxe
__tempPoint1.dispose();
```


## Calculate Distances using points

Lets say you have two points
```haxe
var __tempPoint1:Point = new Point(13,-492);
var __tempPoint2:Point = new Point(-140,29);
```



Calculating the **exact distance** between them would work as follows
```haxe
var distance:Float = __tempPoint1.distance(__tempPoint2);
```

Calculating the **distance squared** between them would work as follows
```haxe
var distanceSquared:Float = __tempPoint1.distanceSquared(__tempPoint2);
```
### When to use `distanceSquared` over`distance`


`distance`() is obviously much more accurate than `distanceSquared`, however, `distanceSquared()` is **much more performant**. So if you want to know which foe **is closer** you want to use `distanceSquared`, if you specifically need the **exact distance** then you should use `distance()`.

To give a brief example, let's imagine we need to find the **closest foe** that's also less than 400 units away. 

```haxe
 function getClosestFoeWithin(maxDistance:Float):Character {
	 // keep track of the closest distance in a variable
	 var closestDistance = Math.POSITIVE_INFINITY;
	 // have a variable for the foe we choose
     var chosenFoe:Character = null;
     var myPoint:Point = new Point(self.getX(), self.getY());
     var foePoint:Point = null; // Point for the foe, will eventually have something
	// We loop over foes
     for (foe in self.getFoes()) {
	     // We create a point if it does not exist
         if (foePoint == null) {
             foePoint = new Point();
         }
         foePoint.init(foe.getX(), foe.getY());
         // We don't care about the exact distance yet so we use distanceSquared
         var currDistance = myPoint.distanceSquared(foePoint);
         if (currDistance < closestDistance) {
             closestDistance = currDistance;
             chosenFoe = foe;
         }
     }
     
     if (chosenFoe == null) {
		 if (foePoint != null) {
			 foePoint.dispose();
		 }
	     myPoint.dispose();
	     return null;
     }
     
     
     // Now that we have the closest foe we can check if it matches the exact dista
     if (myPoint.distance(foePoint) <= maxDistance) {
	     if (foePoint != null) {
			 foePoint.dispose();
		 }
	     myPoint.dispose();
	     return chosenFoe;
     }
     
     // Always ensure that your points are disposed of!
     if (foePoint != null) {
		foePoint.dispose();
	 }
	 myPoint.dispose();
     
     return null;
}
```


Something like this has various applications of course, most common being:
-  **Teleporting to the closest foe**
-  **Auto tracking projectiles**
- **Custom AI stuff**