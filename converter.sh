#!/usr/bin/env bash
mkdir -p typedefs
cp ./api-types-plugin/src/ts/typedefs/*globals.d.ts typedefs
mv ./typedefs/fraymakers-assist-api-globals.d.ts ./typedefs/assist.js 
mv ./typedefs/fraymakers-entity-api-globals.d.ts ./typedefs/entity.js 
mv ./typedefs/fraymakers-character-api-globals.d.ts ./typedefs/character.js 
mv ./typedefs/fraymakers-game-object-api-globals.d.ts ./typedefs/gameobject.js 
mv ./typedefs/fraymakers-projectile-api-globals.d.ts ./typedefs/projectile.js 

myArray=("./typedefs/character.js" "./typedefs/projectile.js" "./typedefs/entity.js" "./typedefs/assist.js" "./typedefs/gameobject.js")

for str in ${myArray[@]}; do
  sed --in-place -E 's/:(\w+)//g' $str
  sed --in-place -E 's/:\(\) => (\w+)//g' $str
  sed --in-place -E 's/:\{(.*)\}//g' $str
  sed --in-place -E 's/;/ {};/g' $str
  sed --in-place -E 's/declare interface Common/export default class Common/g' $str
done

mkdir -p ./docs/common

npx jsdoc2md --no-cache ./typedefs/entity.js > ./docs/common/Entity.md
npx jsdoc2md --no-cache ./typedefs/projectile.js > ./docs/common/Projectile.md
npx jsdoc2md --no-cache ./typedefs/character.js > ./docs/common/Character.md
npx jsdoc2md --no-cache ./typedefs/assist.js > ./docs/common/Assist.md
npx jsdoc2md --no-cache ./typedefs/gameobject.js > ./docs/common/GameObject.md


myArray=("Character" "Projectile" "Entity" "Assist" "GameObject")

for str in ${myArray[@]}; do
    sed -i "1i---\ntitle:$str Common Functions\n---\n# $str Common Functions" "./docs/common/$str.md"
    sed --in-place -E "s/## /## Common./g" "./docs/common/$str.md"
    sed --in-place -E '/<dl>/,/dl>/d' "./docs/common/$str.md"
    sed --in-place -E "s/## Common.Functions//" "./docs/common/$str.md"
done