---
title: Cooldowns
layout: doc
prev: false
next: false
---

# Implementing Cooldowns
Prerequisites:
- Basic Understanding on how to apply [[StatusEffects]]
- Basic Understanding on how to use [[Timers]]


Generally, cool-downs are done by applying the  a`DISABLE_ACTION` status effect and removing it after the cool-down period is over.

## Using status tags

First define this function in your main script, so you can

```haxe
function startMoveCooldown(characterAction:Int, duration:Int) {
	var port:Int = player.getPlayerConfig().port; // Get our port
	var statusTag:String = self.getGameObjectStat("spriteContent")+port; // Combine our port and sprite content stat to get a unique enough tag
	
	// Add the status effect
	self.addStatusEffect(StatusEffectType.DISABLE_ACTION, characterAction, {tag:statusTag });
	
	// Immediately Start a timer
	self.addTimer(duration,1, function () {
		// Get a list of all DISABLE_ACTION statuses
		var statuses = self.findStatusEffectObjectsByTag(StatusEffectType.DISABLE_ACTION, statusTag);
		// Check if we have any statuses
		if (statuses != null && status.length > 0) {
			for (status in statuses) {
				// We only remove the status that matches the move we disabled
				if (status.value == characterAction) {
					// remove a status
					self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, status.id);
				}
			}
		}
		
	},{persistent:true});
}
```

For example if you want Neutral and Up Special to have 60 Frame and 95 frame cooldowns respectively, you put the following snippets in the respective framescripts:
```haxe
// In the framescript for your neutral special move
startMoveCooldown(CharacterActions.SPECIAL_NEUTRAL, 60);
```

```haxe
// In the framescript for your up special move
startMoveCooldown(CharacterActions.SPECIAL_UP, 95);
```
## Using a global variable

This method here is similar to how fraynkie does it, first we create a global variable to store the status id.

```haxe
var moveCooldownId:ApiVarString = self.makeString("");
```

then inside the framescript of the move

```haxe
moveCooldownId.set(self.addStatusEffect(StatusEffectType.DISABLE_ACTION, CharacterActions.SPECIAL_NEUTRAL).id);
self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, status.id);
self.addTimer(60,1, function() { 
	self.removeStatusEffect(StatusEffectType.DISABLE_ACTION, moveCooldownId.get()); 
}, {persistent:true});
```


## Stacking Cooldowns - TODO

