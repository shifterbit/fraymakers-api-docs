---
title: String
layout: doc
prev: false 
next: false
---
## Instance Variables
### length
The length of the string, of type `Int`

## Instance Functions
### charAt(pos: Int): String
#### Description
Returns the character at the specified index.

`pos` — The zero-based index of the desired character.
#### Usage
```haxe
var name: String = "Fraynkie";

var initial: String = name.charAt(0) // "F"

```
### concat(items: Array\<String\>): Array\<Any\>
#### Description
Combines Two or more strings together.
Returns a string that contains the concatenation of two or more strings.

`strings` — The strings to append to the end of the string.
#### Usage
```haxe
var greeting: String = "I am ";
var name: String = "Fraynkie";

var fullGreeting: String = greeting.concat(name) // "I am Fraynkie"

// greeting and name remain unchanged from their original values
```
### indexOf(searchString: String, position?: Int): Int
#### Description
Returns the position of the first occurrence of a substring.

`searchString` — The substring to search for in the string

`position` — The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
#### Usage
```haxe
var greeting: String = "Hello I am Fraynkie";
var FraynkieStart = greeting.indexOf("Fraynkie"); // returns 11, being the index where the first occurence of "Fraynkie" starts
var sandbagStart = greeting.indexOf("sandbag"); // returns -1, as the substring "sandbag" is not present
```
### lastIndexOf(searchString: String, position?: Int): Int
#### Description
Returns the last occurrence of a substring in the string.

`searchString` — The substring to search for.

`position` — The index at which to begin searching. If omitted, the search begins at the end of the string.
#### Usage
```haxe
var greeting: String = "Hello I am Fraynkie Fraynkie";
var FraynkieStart: Int = greeting.indexOf("Fraynkie"); // returns 20, being the index where the last occurance of "Fraynkie" starts
var sandbagStart: Int = greeting.lastIndexOf("sandbag"); // returns -1, as the substring "sandbag" is not present
```

### split(separator: String | RegExp, limit?: Int): Array\<String\>
#### Description
Split a string into substrings using the specified separator and return them as an array.

`separator` — A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.

`limit` — A value used to limit the number of elements returned in the array.
#### Usage
```haxe
var sentence: String = "Hello I am Fraynkie";
var words: Array<String> = sentence.split(" "); // returns ["Hello", "I", "am", "Fraynkie"]

var vowels: String = "aeiou";
var splitVowels: Array<String> = vowels.split(","); // returns ["a", "e", "i", "o", "u"];
```



### toLowerCase(): String
#### Description
Converts all the alphabetic characters in a string to lowercase.
#### Usage
```haxe
var shout = "FRAYNKIE";
var whisper = shout.toLowerCase(); // whisper is "fraynkie"
// shout is unchanged
```


### toString(): String
#### Description
Returns a string representation of a string.
#### Usage


### toUpperCase(): String
#### Description
Converts all the alphabetic characters in a string to uppercase.
#### Usage
```haxe
var whisper = "fraynkie";
var shout = shout.toUpperCase(); // shout is "FRAYNKIE"
// whisper is unchanged
```
