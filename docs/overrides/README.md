# Overrides

The Docs Page uses a very basic overrides system for descriptions, effectively allowing you add an extra "community description" to entries that lack them.


First, overrides follow a couple of rules:
- Overrides are `json` files
- The basename of the file MUST match the class you're modifying, so if you wanted to make an override for `CState` the filename MUST be `CState.json`.


Now for the actual format, here's an example file that adds extra comments to the `Point` class
```json
{
    "staticFunctions": {
        "create": "Creates a new Point Instance"
    },
    "staticVariables": {
        "someField": "someDescription"
    }
    "instanceVariables": {
        "x": "The x-position of the `Point` instance",
        "y": "The y-position of the `Point` instance"
    },
    "instanceFunctions": {
        "dispose": "Please make sure to dispose your points!"
    }
}
```

Now for a brief explaination on what static and instance mean for the uninitiated.

static variables and functions are called on the **class** itself, so `Point.create`, and `CState.constToString` are good example of static functions, note that if you were to create a point variable like `var myPoint:Point = new Point();`, calling `create()` on `myPoint` wouldn't work.


