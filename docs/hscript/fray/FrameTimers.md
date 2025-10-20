# Working with FrameTimers
## Creating a Frametimer
#### Local Variables
```haxe
var myTimer:FrameTimer = new FrameTimer(60); // 60 Frameframetimer
```

#### Rollback Friendly, Global Variables
```haxe
var myTimer:FrameTimer = self.makeFrameTimer(60);
```




## Ticking the timer
```haxe
myTimer.tick();
```
#### Ticking Multiple frames at once
```haxe
myTimer.tick(3);
```

## Deactivating/Pausing the timer
This effectively pauses the timer, meaning ticks won't do anything
```haxe
myTimer.active = false;
```

## Checking for completion
```haxe
if (myTimer.completed) {
	Engine.log("Run code when timer is done!");
}
```

## Resetting the timer
```haxe
myTimer.reset();
```

## Changing the duration
```haxe
myTimer.duration = 25;
```


## Checking for ticked frames
```haxe
if (myTimer.elapsedFrames > 20) {
	Engine.log("We've ticked over 20 frames this run!");
}
```

