---
title: Assist Controllers
layout: doc
prev: false
next: false
---
## Why Assist Controller?
Assist Controllers allow an assist to run code from the start to the end of the match.
This has quite a few applications such as:
- Creating psuedo special modes that are stage independent
- Refilling the assist bar upon player ko
- Passive assists that don't require activation, e.g an assist that adds a permanent status effect
- Keeping track of data before an assist spawns

## Setting up an Assist Controller
For this example we'll be using the official assist template.
### Creating the script
First we create a script in FrayTools with the id `assistControllerScript`, with the following contents
```haxe

function initialize() {

}

function update() {

}

function onTeardown() {

}
```

being just the bare minimum for a script, following the same structure for character, assist and stage scripts.

### Modifying the manifest
Now we need to modify the manifest.json for us to be able to use this script.

So given our original manifest:
```json
{
  "resourceId": "assisttemplate",
  "content": [{
    "id": "assisttemplate",
    "name": "Assist Template",
    "description": "An example assist character for Fraymakers.",
    "type": "assist",
    "objectStatsId": "assisttemplateAssistObjectStats",
    "animationStatsId": "assisttemplateAnimationStats",
    "hitboxStatsId": "assisttemplateHitboxStats",
    "scriptId": "assisttemplateScript",
    "costumesId": "assisttemplateCostumes",
    "metadata": {
      "ui":{
        "entityId":"menu",
        "render":{
          "animation":"assist_full",
          "animation_icon_no_palette":"assist_css"
        },
        "hud":{
          "animation":"assist_hud"
        },
        "css":{
          "animation":"assist_css",
          "info":{
            "game":"Fraymakers",
            "description":"My first assist character."
          }
        }
      }
    }
  },{
    "id": "assisttemplateProjectile",
    "type": "projectile",
    "objectStatsId": "assisttemplateProjectileObjectStats",
    "animationStatsId": "assisttemplateProjectileAnimationStats",
    "hitboxStatsId": "assisttemplateProjectileHitboxStats",
    "scriptId": "assisttemplateProjectileScript"
  }]
}
```

And now our new Manifest Below with 2 major changes:
- First we add a new field `assistControllerId` with the value `"myAssistController"` to our entry with the `"type": "assist"`
- We add a new manifest entry with the `id` being `"myAssistController"`
- notice how the `assistControllerId` and the `id` of the new manifest entry match.

```json
{
  "resourceId": "assisttemplate",
  "content": [{
    "id": "assisttemplate",
    "name": "Assist Template",
    "description": "An example assist character for Fraymakers.",
    "type": "assist",
    "objectStatsId": "assisttemplateAssistObjectStats",
    "animationStatsId": "assisttemplateAnimationStats",
    "hitboxStatsId": "assisttemplateHitboxStats",
    "scriptId": "assisttemplateScript",
    "costumesId": "assisttemplateCostumes",
    "assistControllerId": "myAssistController",
    "metadata": {
      "ui":{
        "entityId":"menu",
        "render":{
          "animation":"assist_full",
          "animation_icon_no_palette":"assist_css"
        },
        "hud":{
          "animation":"assist_hud"
        },
        "css":{
          "animation":"assist_css",
          "info":{
            "game":"Fraymakers",
            "description":"My first assist character."
          }
        }
      }
    }
  },
  {
    "id": "assisttemplateProjectile",
    "type": "projectile",
    "objectStatsId": "assisttemplateProjectileObjectStats",
    "animationStatsId": "assisttemplateProjectileAnimationStats",
    "hitboxStatsId": "assisttemplateProjectileHitboxStats",
    "scriptId": "assisttemplateProjectileScript"
  },
  {
    "id": "myAssistController",
    "type": "assistController",
    "scriptId": "assistControllerScript"
  }
  ]
}
```


Once you've done that that you've completed the basic setup for AssistController!

## Communicating with your Assist Controller Using from the Assist
To access your assist controller from your assist all you have to do is call `getAssistController()` on your owner character like so:
```haxe
var controller = self.getOwner().getAssistController();
```
From then on you can send and retrieve information from the controller using a combination of exported functions from
the controller or exported variables.

So lets say you wanted an assist to behave differently after every 3rd use.

In your assist controller you could expose 2 functions like so:

```haxe
self.exports = {};
var uses = self.makeInt(0);
function initialize() {

}

function update() {

}

function onTeardown() {

}

function addUse() {
  uses.inc();
}

function getUses() {
  return uses.get();
}
self.exports.getUses = getUses;
self.exports.addUse = addUse;
```

then in your assist's initialize

```haxe
function initialize () {
  var controller = self.getOwner().getAssistController().exports;
  if (controller.getUses() % 3 == 0) {
     // do stuff on third use here
  } else {
    // other uses
  }
  controller.addUse();

}

```
