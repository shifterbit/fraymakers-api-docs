---
title: Audio
layout: doc
prev: false
next: false
---

# Working With Audio
## Playing Sound Effects Manually
### Playing Audio
#### Global/Built-in
For Global Sound Effects you pass one of the `GlobalSfx` to `AudioClip.play()`
```haxe
AudioClip.play(GlobalSfx.AIRDASH);
```

#### Custom
Assuming you have audio with the id `woosh` in your project
```haxe
AudioClip.play(self.getResource().getContent("woosh"));
```


### Stopping Audio
Stopping Audio requires you to store the audio in a variable so you can access it for later use, there are a mulitutde of ways to do this, but here we'll be using an example using a global variable.

So first we define a global variable for the audio like so:
```haxe
var myAudioClip:AudioClip = null;
```

When we play the audio, we assign the result to our global variable:
```haxe
myAudioClip = myAudioClio;
```

And stopping the audio works by calling `stop()`, keep in mind that setting it to `null` does NOT actually stop the audio from playing.
```haxe
if (myAudioClip != null && myAudioClip.isDisposed()) {
	myAudioClip.stop();
	myAudioClip = null;
}
```

## Overriding Hit Sounds
Sometimes you may also want to change out the hit sound of a hitbox.
If you don't know how to work with hitbox stats, please check the [[WorkingWithHitBoxStats]] section on how to change hitbox stats in various ways.
### No hitsounds
To have no sound be played on hit, you can change `hitSoundOverride` to the following.
```haxe
hitSoundOverride: "#n/a"
```

### Using your custom hit sounds
Assuming the id of your audio resource is `kaboom`
```haxe
hitSoundOverride: self.getResource().getContent("kaboom")
```


### Playing a Different Global Sound Effect
Lets say I wanted to play the  `GlobalSfx.ASSIST_CALL` instead
```haxe
hitSoundOverride: GlobalSfx.ASSIST_CALL
```


### Randomly Selected Hit Sounds
You can also have a set of sounds to be randomly selected to be played on hit, keep in mind that you're free to use a combination of both built-in and custom sfx.
```haxe
hitSoundOverrideArray: [
						GlobalSfx.ASSIST_CALL,
						self.getResource().getContent("kaboom"),
						GlobalSfx.WOOSH_3
					]
```



# See Also


- **GlobalSFX Listings**
	- https://shifterbit.github.io/fraymakers-api-docs/classes/GlobalSfx
	- https://github.com/Fraymakers/fraymakers-api-docs/blob/main/docs/classes/GlobalSfx.md
	- Video Demonstration: https://www.youtube.com/watch?v=w4DxaGlu7pE
- **AudioClip Api Reference**:
	-  https://shifterbit.github.io/fraymakers-api-docs/classes/AudioClip
	- https://github.com/Fraymakers/fraymakers-api-docs/blob/main/docs/classes/AudioClip.md

