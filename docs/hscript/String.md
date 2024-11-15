---
title: String
---
## Instance Variables
### length
The length of the string, of type `Int`

## Instance Functions
### concat(items: Array<String>): Array<Any>
#### Description
Combines Two or mor strings together.
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
### lastIndexOf(searchString: String, position?: Int): Int
#### Description
Returns the last occurrence of a substring in the string.

`searchString` — The substring to search for.

`position` — The index at which to begin searching. If omitted, the search begins at the end of the string.
#### Usage
### localeCompare(that: String): Int
#### Description
Determines whether two strings are equivalent in the current locale.

`that` — String to compare to target string
#### Usage
### match(regexp: String | RegExp): RegExpMatchArray
#### Description
Matches a string with a regular expression, and returns an array containing the results of that search.

`regexp` — A variable name or string literal containing the regular expression pattern and flags.
#### Usage
### replace(searchValue: String | RegExp, replaceValue: String): String
#### Description
Replaces text in a string, using a regular expression or search string.

`searchValue` — A string to search for.

`replaceValue` — A string containing the text to replace for every successful match of searchValue in this string.
#### Usage
### search(regexp: String | RegExp): Int
#### Description
Finds the first substring match in a regular expression search.

regexp` — The regular expression pattern and applicable flags.
#### Usage
### slice(start?: Int, end?: Int): String
#### Description
Returns a section of a string.

`start` — The index to the beginning of the specified portion of stringObj.

`end` — The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end. If this value is not specified, the substring continues to the end of stringObj.
#### Usage
### split(separator: String | RegExp, limit?: Int): Array<String>
#### Description
Split a string into substrings using the specified separator and return them as an array.

`separator` — A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.

`limit` — A value used to limit the number of elements returned in the array.
#### Usage
### substr(from: Int, length?: Int): String
#### Description
Gets a substring beginning at the specified location and having the specified length.

`from` — The starting position of the desired substring. The index of the first character in the string is zero.

`length` — The number of characters to include in the returned substring.
#### Usage
### substring(start: Int, end?: Int): String
#### Description
Returns the substring at the specified location within a String object.

`start` — The zero-based index number indicating the beginning of the substring.

`end` — Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end. If end is omitted, the characters from start through the end of the original string are returned.
#### Usage
### toLocaleLowerCase(locales?: String | string[]): String
#### Description
Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.
#### Usage
### toLocaleUpperCase(locales?: String | string[]): String
#### Description
Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.
#### Usage
### toLowerCase(): String
#### Description
Converts all the alphabetic characters in a string to lowercase.

#### Usage
### toString(): String
#### Description
Returns a string representation of a string.
#### Usage
### toUpperCase(): String
#### Description
Converts all the alphabetic characters in a string to uppercase.
#### Usage
### trim(): String
#### Description
Removes the leading and trailing white space and line terminator characters from a string.
#### Usage
### valueOf(): String
#### Description
Returns the primitive value of the specified object.
#### Usage
