---
title: Closest Foe
layout: doc
prev: false
next: false
---

# Finding the Closest Foe
 Finding the closest foe character, may want to review the [[Points]] section to understand how this works.

 
 
 ```haxe
 function getClosestFoe():Character {
    var closestDistance = Math.POSITIVE_INFINITY;
     var chosenFoe:Character = null;
     var myPoint:Point = new Point(self.getX(), self.getY());
     var foePoint:Point = null;

     for (foe in self.getFoes()) {
         if (foePoint == null) {
             foePoint = new Point();
         }
         foePoint.init(foe.getX(), foe.getY());
         var currDistance = myPoint.distanceSquared(foePoint);
         if (currDistance < closestDistance) {
             closestDistance = currDistance;
             chosenFoe = foe;
         }
     }
     
     foePoint.dispose();
     myPoint.dispose();

     return chosenFoe;
}
```
