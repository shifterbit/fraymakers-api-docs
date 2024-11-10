---
layout: page
title: Hscript Basics
---
## Variable Declarations
Variables are declared with the `var` keyword
```haxe
// var variable_name: VariableType  = expression; 
// var variable_name  = expression;
var a; // Basic Variable Declaration
var b: Int; // Variables can optionally have their types explicitly declared(This is good for autocomplete)
var c: Int = 1; // Declared variable c with type Int and the initial value 1
```
## Operators
### Unary


| Operator | Operation           | Operand Type | Position           | Result Type |
|----------|---------------------|--------------|--------------------|-------------|
| `~`      | Bitwise Negation    | `Int`        | prefix             | `Int`       |
| `!`      | Logical Negation    | `Bool`       | prefix             | `Bool`      |
| `-`      | Arithmetic Negation | `Float/Int`  | prefix             | `Float/Int` |
| `++`     | Increment           | `Float/Int`  | prefix and postfix | `Float/Int` |
| `--`     | Decrement           | `Float/Int`  | prefix and postfix | `Float/Int` |

The increment and decrement values function a bit differently depends if they are used
as a prefix or a postfix operator, being that when used as a prefix, the incremented/decremented
value is returned, but when used as a postfix, the original value is returned

```haxe
var a = 1; // a is 1
var b = a++; // b is 1, a is 2
var c = ++a; // c is 3, a is 3
```

### Binary
#### Arithmetic operators

| Operator | Operation      | Operand 1   | Operand 2   | Result type  |
|----------|----------------|-------------|-------------|--------------|
| `%`      | Modulo         | `Float/Int` | `Float/Int` | `Float/Int`  |
| `*`      | Multiplication | `Float/Int` | `Float/Int` | `Float/Int`  |
| `/`      | Division       | `Float/Int` | `Float/Int` | `Float`      |
| `+`      | Addition       | `Float/Int` | `Float/Int` | `Float/Int`  |
| `-`      | Subtraction    | `Float/Int` | `Float/Int` | `Float/Int`  |

Generally speaking if any of the operands are floats, then the result will also be a float.
```haxe
var a = 1 + 2; // adds them
var b = 2 * a; // multiplication with variables
var c = b / 2; // division
var d = a - b; // subtraction
var e = 20 % 9 // modulo, gives the reainder after division
```


#### String concatenation operator

| Operator | Operation     | Operand 1 | Operand 2 | Result type |
|----------|---------------|-----------|-----------|-------------|
| `+`      | concatenation | any       | `String`  | `String`    |
| `+`      | concatenation | `String`  | any       | `String`    |
| `+=`     | concatenation | `String`  | any       | `String`    |

When performing any concatenation/addition involving strings, other values would be
automatically be converted to a string.

#### Logical Operators

| Operator | Operation   | Operand 1 | Operand 2 | Result type |
|----------|-------------|-----------|-----------|-------------|
| `&&`     | logical and | `Bool`    | `Bool`    | `Bool`      |
| `||`     | logical or  | `Bool`    | `Bool`    | `Bool`      |

##### Short circuting
Logical Operators are evaluated from left to right, but only as far as necessary.
For example
```haxe
// If the right side is false, then the left is never evaluated
// This is because only one of them has to be false for the entire condition to fail
var a = foo != null && foo.count == 1 
```


#### Compound assignment operators

| Operator | Operation      | Operand 1   | Operand 2   | Result type |
|----------|----------------|-------------|-------------|-------------|
| `%=`     | modulo         | `Float/Int` | `Float/Int` | `Float/Int` |
| `*=`     | multiplication | `Float/Int` | `Float/Int` | `Float/Int` |
| `/=`     | division       | `Float`     | `Float/Int` | `Float`     |
| `+=`     | addition       | `Float/Int` | `Float/Int` | `Float/Int` |
| `-=`     | subtraction    | `Float/Int` | `Float/Int` | `Float/Int` |

```haxe
var a = 5;
a += 4; // same as a = a + 4
```

#### Numeric comparison operators

| Operator | Operation             | Operand 1   | Operand 2   | Result type |
|----------|-----------------------|-------------|-------------|-------------|
| `==`     | equal                 | `Float/Int` | `Float/Int` | `Bool`      |
| `!=`     | not equal             | `Float/Int` | `Float/Int` | `Bool`      |
| `<`      | less than             | `Float/Int` | `Float/Int` | `Bool`      |
| `<=`     | less than or equal    | `Float/Int` | `Float/Int` | `Bool`      |
| `>;`     | greater than          | `Float/Int` | `Float/Int` | `Bool`      |
| `>;=`    | greater than or equal | `Float/Int` | `Float/Int` | `Bool`      |

#### String comparison operators

| Operator | Operation                         | Operand 1 | Operand 2 | Result type |
|----------|-----------------------------------|-----------|-----------|-------------|
| `==`     | equal                             | `String`  | `String`  | `Bool`      |
| `!=`     | not equal                         | `String`  | `String`  | `Bool`      |
| `<`      | lexicographically before          | `String`  | `String`  | `Bool`      |
| `<=`     | lexicographically before or equal | `String`  | `String`  | `Bool`      |
| `>`      | lexicographically after           | `String`  | `String`  | `Bool`      |
| `>=`     | lexicographically after or equal  | `String`  | `String`  | `Bool`      |

```haxe
var a = "foo";
var b = "bar";
var c = "foo";
var x = (a == b); // false
var y = (a == c); // true
var z = (a == "foo"); // true
```


### Ternary Operator

| Operator | Operation | Operand 1 | Operand 2 | Operand 3 | Result type  |
|----------|-----------|-----------|-----------|-----------|--------------|
| `?:`     | condition | `Bool`    | any       | any       | any          |

NdOperand 2 and 3 must be the same type.

The ternary conditional operator is a shorter form of [`if`](expression-if):

```haxe
// Tenary Operators are also expressions

var b = 1 == 2 ? 3 : 4; // 4

// equivalent to:
var b = if (1 == 2) 3 else 4; // 4
```

## If Expressions

```haxe
// if (condition) expression;
if (1 > 0) {
	Engine.log("Obviously True");
}

```
The condition expression must be of type `Bool`, else is also optional
```haxe
// if (condition) expression else expression2;
if (a > b) {
	Engine.log("a is larger");
} else {
	Engine.log("a is not  larger");
}
```

Note that both expression1 and expression2 types must be the same

```haxe
// if (condition1) expression1
//else if (condition2) expression2
// else expression3

var a = 2;
var b = 5;

if (a > b) {
	Engine.log("a is larger");
} else if (b > a) {
	Engine.log("b is larger");
} else {
	Engine.log("a and b are equal");
}

// Remember they are expressions!
var larger = if (a > b) {
	a;
} else if (b > a){
	b;
} else {
	a;
};
```

## Blocks
Blocks create scopes.
```haxe
var a = 1;
{
	var b = 2;
		{
		var c = 2;
		} // c goes out of scope
} // b goes out of scope
```


Because blocks are expressions they can be used as values, the value the block returns would be the value of the first called return statement like so
```haxe
var x = {
	var a = 1;
	var b = 4;
	a + b;
}; // a and b are now out of scope since wer are outside the block

Engine.log(x) // x is now 5

```

## Switch
```haxe
// switch expression {
//  	case value1: body1;
//  	case value2: body2;
//  	default: default-expression
// }
var a = "eggs";
switch (a) {
	case "bacon":
		Engine.log("got Bacon");
	case "eggs":
		Engine.log("got Eggs");
	default:
		Engine.log("got something else");
}
```
## For

```haxe
var list = ["apple", "pear", "banana"];
for (v in list) {
  Engine.log(v);
}
// apple
// pear
// banana
```

```haxe
for (i in 0...10) Engine.log(i); // 0 to 9
```

## While

```haxe
// while (condition) {expression}
var i = 0;
while (i < 10) {
};
```
