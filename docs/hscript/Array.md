---
title: Array
---

## Instance Variables
### length
The length of the array, of type `Int`

## Instance Functions
### concat(items: Array<Any>): Array<Any>
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
### every(predicate: (value: any, index: Int, array: Array<Any>) -> Any, thisArg? Any): Bool
#### Description
Determines whether all the members of an array satisfy the specified test.

`predicate` — A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array.

`thisArg` — An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
// Our predicate function in this case
function isEven(number: Int, index: Int, arr: Array<Int>) {
	if (number % 2 == 0) { // check if the remainder when divided by 2 is 0
		return true;
	} else {
		return false;
	}
}

var myNumbers: Array<Int>= [1,2,3,4,5,6,7,8,9,10];
var myOtherNumbers: Array<Int> [2,4,6,8,10,12,14,16,18,20];

myNumbers.every(isEven); // returns false as there are odd numbers
myOtherNumbers.every(isEven); // returns true as all the numbers are even


```
### filter(predicate: (value: any, index: Int, array: Array<Any>) -> Any, thisArg? Any): Array<Any>
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

var myNumbers: Array<Int>= [1,2,3,4,5,6,7,8,9,10];
var evenNumbers = myOtherNumbers.filter(isEven); // returns [2,4,6,8,10]
```
### forEach(callbackFn: (value: any, index: Int, array: Array<Any>) -> Any, thisArg? Any): Void
#### Description
Performs the specified action for each element in an array.

`callbackfn` — A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.

`thisArg` — An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
function printer(number: Int, index: Int, arr: Array<Int>) {
	Engine.log(number);
}

var myNumbers: Array<Int>= [1,2,3,4,5,6,7,8,9,10];
myNumbers.forEach(printer); // prints each of the numbers
```
### indexOf(searchElement: Any, fromIndex?: Int): Int
#### Description
Returns the index of the first occurrence of a value in an array.

`searchElement` — The value to locate in the array.

`fromIndex` — The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
#### Usage
```haxe
var myNumbers: Array<Int>= [1,2,3,4,5,6,7,8,9,10];
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
var myNumbers: Array<Int>= [1,2,3,4,5,1,2,3,4,5];
myNumbers.indexOf(5); // returns 9
```
### map(callbackFn: (value: any, index: Int, array: Array<Any>) -> Any, thisArg? Any): Array<Any>
#### Description
Calls a defined callback function on each element of an array, and returns an array that contains the results.

`callbackfn` — A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.

`thisArg` — An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
function doubleNum(number: Int, index: Int, arr: Array<Int>) {
	return number * 2;
}

var myNumbers: Array<Int>= [1,2,3,4,5,6,7,8,9,10];
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
### push(...items: Array<Any>): Int
#### Description
Appends new elements to an array, and returns the new length of the array.

`items` — New elements of the Array.
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
arr.push(5) 
// arr is now [1,2,3,4,5]
```
### reduce(callbackfn: (previousValue: Any, currentValue: Any, currentIndex: Int, array: Array<Any>) => Any): Any
#### Description
Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

`callbackfn` — A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

`initialValue` — If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
#### Usage
### reduceRight(callbackfn: (previousValue: Any, currentValue: Any, currentIndex: Int, array: Array<Any>) => Any): Any
#### Description
Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function. Unlike regular `reduce`, this begins from the end of the array

`callbackfn` — A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.

`initialValue` — If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
#### Usage
### reverse
#### Description
Reverses the elements in the array.
#### Usage
```haxe
var arr: Array<Int> = [1,2,3,4];
arr.reverse();
// arr is now [4,3,2,1]
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
### slice(start?: Int, end?: Int): Array<Int>
#### Description
Returns a section of an array.

`start` — The beginning of the specified portion of the array.

`end` — The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
#### Usage
```haxe
var arr: Array<Int> = [0,1,2,3,4,5,6,7];
arr.slice(2,6); // [2,3,4,5]

```

### some(predicate: (value: any, index: Int, array: Array<Any>) -> Any, thisArg? Any): Bool
#### Description
Determines whether the specified callback function returns true for any element of an array.

`predicate` — A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array.

`thisArg` — An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
#### Usage
```haxe
// Our predicate function in this case
function isEven(number: Int, index: Int, arr: Array<Int>) {
	if (number % 2 == 0) { // check if the remainder when divided by 2 is 0
		return true;
	} else {
		return false;
	}
}

var myNumbers: Array<Int> = [1,2,3,4,5,6,7,8,9,10];
var myOtherNumbers: Array<Int> =  [2,4,6,8,10,12,14,16,18,20];
var odds: Array<Int> = [1,3,6,9,11,13,15,17,19,21];

myNumbers.some(isEven); // returns true as there's at least one even number
myOtherNumbers.some(isEven); // returns true as all the numbers are even
odds.some(isEven); // returns false as none of the numbers are even
```

### sort(compareFn?: (a: any, b: any) => number): any[]
#### Description
Sorts an array.

`compareFn` — Function used to determine the order of the elements. It is expected to return a negative value if first argument is less than second argument, zero if they're equal and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.

#### Usage
```haxe
var arr: Array<Int> = [1,5,2,4,2];
var sorted = arr.sort(); // [1,2,2,4,5]
```
### splice(start: Int, deleteCount?: Int): Array<Any>
#### Description
Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

`start` — The zero-based location in the array from which to start removing elements.

`deleteCount` — The number of elements to remove.
#### Usage
```haxe
var arr = [0,1,2,3,4,5,6,7,8];
var spliced = arr.splice(2,4); // [0,1,6,7,8]
```
### toLocaleString(): String
#### Description
Returns a string representation of an array. The elements are converted to string using their toLocalString methods.


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