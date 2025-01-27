---
title: Making use of Ports
layout: doc
prev: false
next: false
---
# Making Use of Ports and Arrays

## Storing Data For Multiple Players
Lets imagine for a second we wanted to keep track of the player scores over the course of the match, and give the top scorer a glow filter;

Putting the pieces together we have something like this:

First we set up our variables for each of our players
```haxe
var player1: Character = null;
var player1Glow:GlowFilter = null; 

var player2: Character = null;
var player2Glow:GlowFilter = null; 

var player3: Character = null;
var player3Glow:GlowFilter = null; 

var player4: Character = null;
var player4Glow:GlowFilter = null; 


// Next we define this function to call in initialize
function setupVariables() {
    Engine.forCount(match.getPlayers(), function (player:Character, _idx:Int) {
        if (player1 == null) {
            player1 = player;
            player1Glow = new GlowFilter();
            player1Glow.alpha = 0;
            player1.addFilter(player1Glow);
        } else if (player2 == null) {
            player2 = player;
            player2Glow = new GlowFilter();
            player2Glow.alpha = 0;
            player2.addFilter(player2Glow);
        } else if (player3 == null) {
            player3 = player;
            player3Glow = new GlowFilter();
            player3Glow.alpha = 0;
            player3.addFilter(player3Glow);
        } else if (player4 == null) {
            player4 = player;
            player4Glow = new GlowFilter();
            player4Glow.alpha = 0;
            player4.addFilter(player4Glow);
        }
        return true;
    },[]);
}


// Update Filters, call this in update
function updateGlows() {
    var player1Score = (2000 * player1.getScore()) - player1.getDamage();
    var player2Score = (2000 * player2.getScore()) - player2.getDamage();
    var player3Score = (2000 * player3.getScore()) - player3.getDamage();
    var player4Score = (2000 * player4.getScore()) - player4.getDamage();


    player1Glow.alpha = 0;
    player2Glow.alpha = 0;
    player3Glow.alpha = 0;
    player4Glow.alpha = 0;


    if (player1Score > player2Score && player1Score > player3Score && player1Score > player4Score) {
        player1Glow.alpha = 1;

    } else if (player2Score > player1Score && player2Score > player3Score && player2Score > player4Score) {
        player2Glow.alpha = 1;

    } else if (player3Score > player2Score && player3Score > player1Score && player3Score > player4Score) {
        player3Glow.alpha = 1;

    } else if (player4Score > player2Score && player4Score > player3Score && player4Score > player1Score) {
        player4Glow.alpha = 1;
    }
}
```

Now, this code probably works fine for but consider the following:
- What if we had to less than 4 players.

Well, the code would break, because we'd get a null access error for player3 or player4 because those would be `null`, and calling getScore() on `null` would cause an error.
One approach would be to have 1 version of the function for each number of players, or a massive switch statement based on the player count, but now we'd effectively be writing 
the same code about 3 different times, if we want to make changes?, gotta do them 3 different times as well. Roughly Speaking it would look like this:

```haxe
function updateGlows() {
    switch (match.getPlayers().length) {
        case 4: {
            var player1Score = (2000 * player1.getScore()) - player1.getDamage();
            var player2Score = (2000 * player2.getScore()) - player2.getDamage();
            var player3Score = (2000 * player3.getScore()) - player3.getDamage();
            var player4Score = (2000 * player4.getScore()) - player4.getDamage();


            player1Glow.alpha = 0;
            player2Glow.alpha = 0;
            player3Glow.alpha = 0;
            player4Glow.alpha = 0;


            if (player1Score > player2Score && player1Score > player3Score && player1Score > player4Score) {
                player1Glow.alpha = 1;

            } else if (player2Score > player1Score && player2Score > player3Score && player2Score > player4Score) {
                player2Glow.alpha = 1;

            } else if (player3Score > player2Score && player3Score > player1Score && player3Score > player4Score) {
                player3Glow.alpha = 1;

            } else if (player4Score > player2Score && player4Score > player3Score && player4Score > player1Score) {
                player4Glow.alpha = 1;
            }
        };
        case 3: {
            var player1Score = (2000 * player1.getScore()) - player1.getDamage();
            var player2Score = (2000 * player2.getScore()) - player2.getDamage();
            var player3Score = (2000 * player3.getScore()) - player3.getDamage();


            player1Glow.alpha = 0;
            player2Glow.alpha = 0;
            player3Glow.alpha = 0;


            if (player1Score > player2Score && player1Score > player3Score) {
                player1Glow.alpha = 1;

            } else if (player2Score > player1Score && player2Score > player3Score) {
                player2Glow.alpha = 1;

            } else if (player3Score > player2Score && player3Score > player1Score) {
                player3Glow.alpha = 1;
            }
        };
        case 2: {
            var player1Score = (2000 * player1.getScore()) - player1.getDamage();
            var player2Score = (2000 * player2.getScore()) - player2.getDamage();


            player1Glow.alpha = 0;
            player2Glow.alpha = 0;


            if (player1Score > player2Score) {
                player1Glow.alpha = 1;

            } else if (player2Score > player1Score) {
                player2Glow.alpha = 1;
            }
        };
        default: {};
    }
}
```
As you can see, this is quite a lot of code, but luckily we can get around doing this, by taking advantage of player ports and arrays:


## Primer On Ports

Any given `Player` Object can their port retrieved like so:
```haxe
var port:Int = player.getPlayerConfig().port;
```

Ports are **zero-indexed**, meaning that player 1 would have a port value of 0, player 2 a value of 1, player 3 a value of 2 and player 4 a value of 3. Now, how can this be useful?

As it turns out, arrays are also zero-indexed! With the first item having an index of 0, the second having 1, the third having 2 and so on, 
so with this knowledge we can have a more efficient way to deal with storing data that a bunch of players have in common.

## New Approach using ports and arrays
Instead of having a variable for each player and filter, we simply have an array for the filters:
```haxe 
var glowFilters:Array<GlowFilter> = [null,null,null,null];
```
we create a new glow filters array, and initialize it with 4 null values, now with this structure, let's approach our `setupVariables` function a bit differently:
```haxe

function setupVariables() {
    for (player in match.getPlayers()) {
        var port = player.getPlayerConfig().port; // Get the player port
        var glowFilter = new GlowFilter(); // Create a glow filter
        glowFilter.alpha = 0; // make it invisible
        glowFilters[port] = glowFilter; // add the filter to the array
        player.addFilter(glowFilter); // attach it to the player
    }
}

```
As you can see, using numbers in combination with arrays can result in having to use a lot less code, whilst in a small 
example like this, it isn't necessary a problem, it becomes very helpful when you have several Vfx's, filters, status effects
or shaders associated with each player and once you have more complex logic you end up writing far more code than you need to.


Now actually updating the filters is also pretty concise too:

```haxe
function updateGlows() {
    var highestScoringPort = -1; // Keep track of the highest scoring port, initially at -1 since player ports start at zero
    var highestScore = Math.NEGATIVE_INFINITY; // Keep track of the highest score, we use negative infinity since thats the lowest possible number
    for (player in match.getPlayers()) {
        var port = player.getPlayerConfig().port; // Get the player port
        var score = (2000 * player.getScore()) - player.getDamage(); // We calculate the score in the loop

        if (score > highestScore) {
            highestScoringPort = port;
            highestScore = score;
        }
    }

    if (highestScoringPort >= 0)  { // Check if we found a port for the highest scorer
        glowFilters[highestScoringPort].alpha = 1; // make winners glow filter visible
    }

    // Loop over all the players
    for (player in match.getPlayers()) {
        var port = player.getPlayerConfig().port;
        if (port != highestScoringPort) { // Check if the port is different from the winner, if we don't one it'll always be different, if so then...
            glowFilters[highestScoringPort].alpha = 0; // We can make it invisible
        }
    }
   
}
```

Now, this approach does quite a few things for us:
- Because we're using port numbers, it doesn't matter how many players are in the match, so we don't have to worry about that 
- Because port numbers and arrays are both zero indexed, we don't need to keep track of specific player variables to get the right 
  filter, since port numbers correspond directly to array indexes.
- Using an array also means we can use do calculations in a for loop, so there's no need to copy and paste calculations