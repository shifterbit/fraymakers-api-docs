---
title: Array
layout: doc
prev: false 
next: false
---

## Instance Variables
### length
The length of the array, of type `Int`

## Instance Functions
### concat(items: Array<Any\>): Array<Any\>
#### Description
Combines two or more arrays.

`items` — Additional items to add to the end of array.
#### Usage
```haxe
var arr: Array<Int> = [1,6,3];
var arr2: Array<Int> = [4,9,0];

var arr3 = arr.concat(arr2); // arr3 is now [1,6,3,4,9,0]
// arr and arr2 remain unchanged from their original values
```

### contains(item: Any): Bool
Returns whether this Array contains `item`.

If `item` is found by checking standard equality, the function returns true, otherwise the function returns false.

### filter(predicate: (value: any, index: Int, array: Array<Any\>) -> Any, thisArg? Any): Array<Any\>
#### Description
Returns the elements of an array that meet the condition specified in a callback function.

`predicate` — A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.

`thisArg` — An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
function isEven(number: Int, index: Int, arr: Array<Int>) {
	if (number % 2 == 0) { // check if the remainder when divided by 2 is 0
		return true;
	} else {
		return false;
	}
}

var myNumbers: Array<Int> = [1,2,3,4,5,6,7,8,9,10];
var evenNumbers = myOtherNumbers.filter(isEven); // returns [2,4,6,8,10]
```
### indexOf(searchElement: Any, fromIndex?: Int): Int
#### Description
Returns the index of the first occurrence of a value in an array.

`searchElement` — The value to locate in the array.

`fromIndex` — The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
#### Usage
```haxe
var myNumbers: Array<Int> = [1,2,3,4,5,6,7,8,9,10];
myNumbers.indexOf(5); // returns 4
```
### join(separator?: String): String
#### Description
Adds all the elements of an array separated by the specified separator string.

`separator` — A string used to separate one element of an array from the next in the resulting String. If omitted, the array elements are separated with a comma.
#### Usage
```haxe
var strings: Array<String> = ["Hello", "my", "name", "is", "Fraynkie"];
var sentence: String = strings.join(" "); // "Hello my name is Fraynkie"
```
### lastIndexOf(searchElement: Any, fromIndex?: Int): Int
#### Description
Returns the index of the last occurrence of a specified value in an array.

`searchElement` — The value to locate in the array.

`fromIndex` — The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
#### Usage
```haxe
var myNumbers: Array<Int> = [1,2,3,4,5,1,2,3,4,5];
myNumbers.indexOf(5); // returns 9
```
### map(callbackFn: (value: any, index: Int, array: Array<Any\>) -> Any, thisArg? Any): Array<Any\>
#### Description
Calls a defined callback function on each element of an array, and returns an array that contains the results.

`callbackfn` — A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

`thisArg` — An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
function doubleNum(number: Int, index: Int, arr: Array<Int>) {
	return number * 2;
}

var myNumbers: Array<Int> = [1,2,3,4,5,6,7,8,9,10];
var doubledNubers = myOtherNumbers.map(doubleNum); // [2,4,6,8,10,12,14,16,18,20]
```
### pop(): Any
#### Description
Removes the last element from an array and returns it.
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
var lastItem = arr.pop() // 4
// arr is now [1,2,3]
```
### push(...items: Array<Any\>): Int
#### Description
Appends new elements to an array, and returns the new length of the array.

`items` — New elements of the Array.
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
arr.push(5) 
// arr is now [1,2,3,4,5]
```

### remove(item: Any): Bool
#### Description
Removes the first occurrence of `item` in this Array.

NOTE: This operation modifies this Array in place.

If `item` is found by checking standard equality, it is removed from this Array and all following elements are reindexed accordingly. The function then returns true.

If x is not found, this Array is not changed and the function returns false.
Reverses the elements in the array.

#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
arr.remove(3);
// arr is  [1,2,4]
```

### reverse(): Array<Any\>
#### Description
Reverses the elements in the array.
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
var reversed = arr.reverse();
// reversed is  [4,3,2,1]
// arr remains unchanged
```

### shift(): Any
#### Description
Removes the first element from an array and returns it.


#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
var lastItem = arr.shift() // 1
// arr is now [2,3,4];
```
### slice(start?: Int, end?: Int): Array<Int\>
#### Description
Returns a section of an array.

`start` — The beginning of the specified portion of the array.

`end` — The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
#### Usage
```haxe
var arr: Array<Int> = [0,1,2,3,4,5,6,7];
arr.slice(2,6); // [2,3,4,5]

```

### sort(compareFn?: (a: Any, b: Any) => Int): Array<Any\>
#### Description
Sorts an array.

`compareFn` — Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.

#### Usage
```haxe
var arr: Array<Int> = [1,5,2,4,2];
var sorted = arr.sort(); // [1,2,2,4,5]
```
### splice(start: Int, deleteCount?: Int): Array<Any\>
#### Description
Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

`start` — The zero-based location in the array from which to start removing elements.

`deleteCount` — The number of elements to remove.
#### Usage
```haxe
var arr = [0,1,2,3,4,5,6,7,8];
var spliced = arr.splice(2,4); // [0,1,6,7,8]
```
### toString(): String
#### Description
Returns the string representation of the array, each of the items are converted using their respective `toString` methods

### unshift(...items: Any): Int
#### Description
Adds elements to the beginning of the array
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
arr.unshift(0) // 
// arr is now [0,1, 2,3,4];
```
