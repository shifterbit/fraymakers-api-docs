---
title: Variables
layout: doc
next: 
    link: './Operators.md'
    text: "Operators"
prev: 
    link: './index.md'
    text: "Syntax"
---
Variables are declared with the `var` keyword
```haxe
// var variable_name: VariableType  = expression; 
// var variable_name  = expression;
var a; // Basic Variable Declaration
var b: Int; // Variables can optionally have their types explicitly declared(This is good for autocomplete)
var c: Int = 1; // Declared variable c with type Int and the initial value 1
```

## Caveats with Top Level Variables
### Top Level Variables Have to be assigned
This will silently fail
```haxe
var foo;
```
But this works fine
```haxe
var foo = true;
```

### Rollback Compatibility
By default, most types aren't rollback compatible. This isn't a concern for local variables within
functions, but it can pose some issues for top level variables even in the event that one isn't playing in rollback(which is currently the case with custom content).

Besides future proofing your code, there's also another reason to use rollback safe code, and that's 
to ensure that they're still properly accessible from your `onTeardown` method

#### Quick Rundown on creating rollback friendly variables
##### Booleans
```haxe
var foo:ApiVarBool = self.makeBool(false);

// Setting the value
foo.set(true);
// Retrieving the value
foo.get() 
```

##### Integers and Floats
Integers and Floats have an Identical interface
```haxe
var foo:ApiVarFLoat = self.makeFloat(6.2);
var bar:ApiVarInt = self.makeInt(4);

// Setting the value
foo.set(392.59);
bar.set(14);

// Incrementing and Decrementing the values
// Keep in Mind that these methods also return the new value inside as well
foo.inc();
bar.dev()

// Retrieving the values inside
foo.get();
bar.get();
```

##### Array
```haxe
var foo:ApiVarArr = self.makeArray([1,2,3,5]);

// Setting the value
foo.set([2,4,6,8]); // replaces the array
// Retrieving the value
foo.get()  // returns the array inside
```

##### Other Types
`ApiVarObject`'s are different in the sense that that they are used to store any type, best reserved for cases where whatever data types you have don't fit into the groups above.
A few common examples that may come to mind are the various filter types, `Sprite`, `Vfx`, `Entity`, `GameObject` etc.
```haxe
var foo:ApiVarObject = self.makeObject(null);


// Setting the value
foo.set(self.getOwner()); // stores the owner
// Retrieving the value
foo.get()  // returns the owner
```

