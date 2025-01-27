---
title: Pseudo Classes
layout: doc
prev: false
next: false
---

# Using Pseudo Classes

## NOTE: THIS PROBABLY ISN'T ROLLBACK SAFE
## Walkthrough

Haxescript does not officially support the definition of classes, however, this doesn't mean you can't implement them yourself, which is what you'll be learning how to do here.

Here's a documented example on how to make a Pseudo Class

### Minimal Example
```haxe
function playerHitCounter(player: Character) {
	// Variables to keep track of state
	var foeCounts = [0,0,0,0]
	
	// getter function to get values
	getFoeHitCount(foe:Character): Int {
		var foePort = foe.getPlayerConfig().port;
		return foeCounts[foePort];
	}
	
	incrementFoeHitCount(foe:Character): Int {
		var foePort = foe.getPlayerConfig().port;
		Engine.log("Player "+ (foePort+1) + "got hit " + foeCounts[foePort] + " times!");
		foeCounts[foePort] = foeCounts[foePort] + 1;
	}
	
	// Event Listener Function
	function onHit(e:GameObjectEvent) {
		var foe:GameObject = e.data.foe;
		if (foe.getType == EntityType.CHARACTER) {
			incrementFoeHitCount(foe);
		}
	}
	
	// Event Listener Helper
	function startEvents() {
		player.addEventListener(GameObjectEvent.HIT_DEALT, onHit, {persistent:true});
	}
	
	function stopEvents() {
		player.removeEventListener(GameObjectEvent.HIT_DEALT, onHit);
	}
	
	return {
		start: startEvents,
		stop: stopEvents
	};
}

hitCounter = playerHitCount(self)
hitCounter.start(); // Starts the Counter
hitCounter.stop(); // Stops the Counter

```

### Complex  Example

```haxe
function createTrippingClass(player: Character) {
    // Instance variables can be defined using var
    var total_trips = self.makeInt(0);
    var active = self.makeBool(true);
    var timerId = self.makeInt(-1);

    // we can also access variables or perform actions using functions here
   
    // Gets the number of times we tripped over the player
    function get_trips():Int {
        return total_trips.get();
    }

    // Returns true if the event listeners and timers are active
    function isActive():Bool {
        return active.get();
    }

    // Manually increments the trip counter
    function add_trip():Void {
        total_trips.inc();
    }

    // Reset the trip counter
    function reset_trips():Void {
        total_trips.set(0);
    }

    // Trip the player, also updates the counter
    function trip():Void {
        player.toState(CState.CRASH_BOUNCE);
        add_trip();
    }
 
    // We can create timers and event listeners!


    // First we create a function we're gonna use for the timer,
    //  creating it separately makes it easier to pause and resume it
    function onInterval() {
        if (player.isOnFloor()) && (player.inStateGroup(CStateGroup.DASH) 
                                    || player.inStateGroup(CStateGroup.RUN)
                                    || player.inStateGroup(CStateGroup.WALK))
         {
            if (Random.getInt(0, 15) == 5) {
                trip();
            }
        }
    }

    // We also define the function for the event listener separately here, for the same reason as above
    function onStateChange(e:EntityEvent) {
        var toState = e.data.toState;
        var grounded = player.isOnFloor();
        if (grounded && toState == CState.DASH) {
             if (Random.getInt(0, 6) == 3) {;
                trip();
            }
        }
    }
    
    // Now we create the timer here, the timer returns an id we can use to remove it later 
    timerId.set(player.addTimer(60, -1, onInterval, {persistent: true}));
    // Here we create the event listener
    player.addEventListener(EntityEvent.STATE_CHANGE, onStateChange);

    // A helper function for outsiders to be able to manually enable tripping
    function resumeEvents() {
        if (!active.get() && timerId.get() < 0>) {
            player.addEventListener(EntityEvent.STATE_CHANGE, onStateChange);
            timerId.get(player.addTimer(60,-1,onInterval), {persistent:true});
            active.set(true);
        }
    }

    // A helper function for outsiders to be able to manually pause tripping
    function pauseEvents() {
        player.removeTimer(timerId);
        player.removeEventListener(EntityEvent.STATE_CHANGE, onStateChange);
        active.set(false);
        timerId.set(-1);
    }

    // Now we return an object with all the functions
    return {
        add: add_trip,
        reset: reset_trips,
        get_count: get_trips,
        pause: pauseEvents,
        isActive: isActive,
        resume: resumeEvents,
        trip: trip

    }
}
```



### Actually using this "Class"
For convenience we can create a our own constructor, think of how you use `Sprite.create`, `Container.create` or `Point.create`
so as a top level variable we have and we can just embed the function inside, 
keep in mind that you need to define the function ***BEFORE YOU DEFINE THIS AND NOT AFTER***.
```haxe
var TrippingMachine = {
    create: createTrippingClass
};

var HitCounter = {
    create: playerHitCounter
};
```

#### "Attaching" the class to players
From the perspective of the player being `self`.

For the simple example:
```haxe
var hitCounter = TrippingMachine.create(self);
tripper.start(); // we can call its functions from the outside!
tripper.stop();
```
```haxe
var tripper = TrippingMachine.create(self);
tripper.trip(); // we can call its functions from the outside!
tripper.pause();

```
