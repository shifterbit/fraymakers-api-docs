## Creating a VFX
### Global VFX

```haxe
match.createVfx(new VfxStats({spriteContent: "global::vfx.vfx", animation: GlobalVfx.DUST_SPIN}, self));
```

### Custom VFX
```haxe
match.createVfx(new VfxStats({spriteContent: self.getResource().getContent("contentId"), animation: "animationName"}));
```



## VFX Stats

General Information on VFXStats, please check out https://shifterbit.github.io/fraymakers-api-docs/classes/VfxStats

### Passing an Owner
When you call `match.createVfx()`, you can optionally pass an owner, this changes the behavior of some of the stats which we'll go over. Keep in mind if no owner is passed ,or `null` is passed as the second argument, then none of the stats below have any effect.

#### flipWith
Defaults to true, flips the vfx in the direction of the owner

#### relativeWith
Defaults to true, makes the `x` and `y` stat props act as *relative* values as opposed to *absolute* values. To Illustrate:

Let's say we have this vfx call

```haxe
match.createVfx(new VfxStats({spriteContent: "global::vfx.vfx", animation: GlobalVfx.DUST_SPIN, x: 300, y: 300}));
```

Since we didn't pass an owner, the x and y values would correspond to the x and y values on whatever layer the vfx happens to be on, if you don't specifiy a layer it'll default to the `VfxLayer.CHARACTERS_FRONT`, essentially you're putting the vfx on `(300, 300)` on the stage.

Now lets pass an owner and see what changes:
```haxe
match.createVfx(new VfxStats({spriteContent: "global::vfx.vfx", animation: GlobalVfx.DUST_SPIN, x: 300, y: 300}), self);
```

For simplicity `self` is assumed to be a character.

Here, x and y values would be **relative to the position of self at any given time**, so for as long as the vfx is active:
- If self is at `(10, 15)`, then the vfx would be at `(10 + 300, 15 + 300)`
#### resizeWith
Defaults to true, scales the vfx with the owner


### Vfx Chains

Now for the mysterious `chain` vfx stat, basically it lets you spawn multiple vfx in a single call.

```haxe
match.createVfx(new VfxStats({spriteContent: self.getResource().getContent("myVfx"), animation: "animation1", 
	chain: {
		animation: "animation2",
		chain: {
			animation: "animation3",
			timeout: 4,
		}
	}
}), self);
```

In a vfx chain, the vfx inherits properties from the previous vfx in the chain, meaning that if you specified the `spriteContent` or any other vfx stat in the top vfx, the children vfx also have those same stuff set unless you choose to override it.