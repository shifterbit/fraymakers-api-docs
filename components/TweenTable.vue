<script setup>
import { ref, reactive, computed } from 'vue'
import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint
} from 'easing-utils';

const startFrame = ref(null);
const duration = ref(null);
const startValue = ref(null);
const endValue = ref(null);
const easeFunctions = {
  "Linear": linear,
  "Ease In Quad": easeInQuad,
  "Ease Out Quad": easeOutQuad,
  "Ease In/Out Quad": easeInOutQuad,
  "Ease In Cubic": easeInCubic,
  "Ease Out Cubic": easeOutCubic,
  "Ease In/Out Cubic": easeInOutCubic,
  "Ease In Quart": easeInQuart,
  "Ease Out Quart": easeOutQuart,
  "Ease In/Out Quart": easeInOutQuart,
  "Ease In Quint": easeInQuint,
  "Ease Out Quint": easeOutQuint,
  "Ease In/Out Quint": easeInOutQuint
};
const selectedEaseFunction = ref("Linear");

function generateFrames() {
  let temp = [];
  console.log(temp);
  
  
  for (let i = 0; i <= duration.value; i++) {
    var valRange = endValue.value - startValue.value;
    var calculatedPosition = i / duration.value;
    var valueRatio =  easeFunctions[selectedEaseFunction.value](calculatedPosition);
    var currentValue = startValue.value + valRange * valueRatio;
    temp.push(currentValue);
  }
  return temp;

}

const frames = computed(generateFrames);
</script>


<template>
  <form class="tweentable">
    <label class="tweentable" for="start">Start Frame</label> <input type="number" class="tweentable" id="start"
      v-model.number="startFrame" placeholder="Start Frame" />

    <label class="tweentable" for="duration">Duration In Frames</label><input type="number" class="tweentable" id="duration"
      v-model.number="duration" placeholder="Number of Tween Frames" />

    <label class="tweentable" for="init">Start Value</label> <input type="number" class="tweentable" id="init"
      v-model.number="startValue" placeholder="Starting Value" />

    <label class="tweentable"  for="end">Final Value</label> <input type="number" class="tweentable" id="end" v-model.number="endValue"
      placeholder="End Value" />

    <label class="tweentable" for="fntype">Ease Type</label>
    <select @change="generateFrames" class="tweentable" id="fntype" v-model.number="selectedEaseFunction">
      <option class="tweentable" v-for="fn in Object.keys(easeFunctions)">
        {{ fn }}
      </option>
    </select>
    <br>
  </form>

  <table v-if="(startValue != null && endValue != null && duration != null && startFrame != null) && (duration > 0 && startFrame > 0)">
    <thead>
      <tr>
        <th>Frame</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, index) in frames">
        <td> {{ index + startFrame }}</td>
        <td> {{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>


/* MVP.css v1.17.2 - https://github.com/andybrewer/mvp */
<style>
/**
 * Bolt.css
 * https://github.com/tbolt/boltcss
 *
 * Sections
 * 1. Content sectioning
 * 2. Text content
 * 3. Inline text semantics
 * 4. Image and multimedia
 * 5. Tables
 * 6. Forms
 * 7. Interactive elements
 *
 */

:root {
  --highlight-border-radius: 7px;
  --border-radius: 11px;
  --yellow-highlight: #fffab7;

  --links: #0f6dff;
  --background-body: #fff;
  --background-main: #f1f1f1;
  --background-inputs: #fcfcfc;
  --text: #1c1d1e;
  --border: #dddddd;
  --focus-highlight: #b8b8b8;
  --shadow-color: #545454;
  --table-highlight: #f1f1f1;
  --select-icon-url: url("data:image/svg+xml,%3Csvg width='292' height='292' viewBox='0 0 292 292' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath id='Path' fill='%23222222' stroke='none' d='M 287 69 C 283.606537 65.469971 278.895844 63.513214 274 63.600006 L 18.4 63.600006 C 13.4 63.600006 9.1 65.400009 5.5 69 C 1.984143 72.328568 -0.005267 76.958466 -0 81.800003 C -0 86.800003 1.8 91.100006 5.4 94.699997 L 133.399994 222.600006 C 137 226.200012 141.199997 228 146.199997 228 C 151.199997 228 155.399994 226.200012 159 222.600006 L 287 94.600006 C 290.5 91.100006 292.399994 86.800003 292.399994 81.800003 C 292.399994 76.800003 290.5 72.600006 286.899994 69 Z'/%3E%3C/svg%3E");
}

@media (prefers-color-scheme: dark) {
  :root {
    --links: #4589ee;
    --background-body: #0f0f0f;
    --background-main: #222;
    --background-inputs: #222;
    --text: #efefef;
    --border: #444;
    --focus-highlight: #888;
    --shadow-color: #bebebe;
    --table-highlight: #222;
    --select-icon-url: url("data:image/svg+xml,%3Csvg width='292' height='292' viewBox='0 0 292 292' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath id='Path' fill='%23ffffff' stroke='none' d='M 287 69 C 283.606537 65.469971 278.895844 63.513214 274 63.600006 L 18.4 63.600006 C 13.4 63.600006 9.1 65.400009 5.5 69 C 1.984143 72.328568 -0.005267 76.958466 -0 81.800003 C -0 86.800003 1.8 91.100006 5.4 94.699997 L 133.399994 222.600006 C 137 226.200012 141.199997 228 146.199997 228 C 151.199997 228 155.399994 226.200012 159 222.600006 L 287 94.600006 C 290.5 91.100006 292.399994 86.800003 292.399994 81.800003 C 292.399994 76.800003 290.5 72.600006 286.899994 69 Z'/%3E%3C/svg%3E");
  }
}

*.tweentable,
::after,
::before {
  box-sizing: border-box;
}

html.tweentable,
body.tweentable {
  margin: 0;
  font-size: 12pt;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  color: var(--text);
  background: var(--background-body);
}

/* No styles provided */
footer {}

header {}


/* Not provided */
hgroup {}

/* Not provided */
main {}

/* Not provided */
nav {}

/* Not provided */
section {}



/* Form elements */
input.tweentable,
button.tweentable,
select.tweentable,
optgroup.tweentable,
textarea.tweentable {
  margin: 0;
}

button.tweentable,
select.tweentable,
input.tweentable[type="submit"],
input.tweentable[type="button"],
input.tweentable[type="checkbox"],
input.tweentable[type="range"],
input.tweentable[type="radio"] {
  cursor: pointer;
}

button.tweentable {
  color: var(--text);
  background-color: var(--background-main);
  font-family: inherit;
  font-size: inherit;
  padding: 6px 15px 6px 15px;
  border: 1px solid transparent;
  border-radius: 6px;
  box-shadow: 0px 1px 1.5px rgba(158, 158, 158, 0.6);
}

button.tweentable:active {
  box-shadow: none;
  border: 1px solid var(--border);
}

button.tweentable:disabled,
button.tweentable[disabled] {
  box-shadow: none;
  border: 1px solid var(--border);
  cursor: initial;
  opacity: 0.55;
}

label.tweentable {
  display: block;
  max-width: fit-content;
}

input.tweentable {
  font-size: 1em;
  background-color: var(--background-inputs);
  border: 1px solid var(--border);
  color: var(--text);
  margin: 6px 0px;
  padding: 11px;
  border-radius: var(--border-radius);
  max-width: fit-content;
  outline: none;
  display: inline-block;
  appearance: none;
}

input.tweentable[type="checkbox"],
input.tweentable[type="radio"] {
  vertical-align: middle;
  position: relative;
  margin-right: 0.33em;
  margin-top: 0.31em;
}

input.tweentable[type="checkbox"] {
  border-radius: 7px;
}

input.tweentable[type="radio"] {
  border-radius: 100%;
}

input.tweentable[type="checkbox"]:checked,
input.tweentable[type="radio"]:checked {
  border: 1px solid var(--links);
  background: var(--links);
}

input.tweentable[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
}

input.tweentable[type="radio"]:checked {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e");
}

input.tweentable[type="range"] {
  vertical-align: middle;
  padding: 0;
}

input.tweentable[type="color"] {
  appearance: none;
  inline-size: 44px;
  outline-style: none;
  padding: initial;
  max-width: initial;
  height: 2rem;
  border-radius: 3px;
}

textarea.tweentable {
  font-family: inherit;
  font-size: 1em;
  background-color: var(--background-inputs);
  border: 1px solid var(--border);
  padding: 11px;
  color: var(--text);
  border-radius: var(--border-radius);
  outline: none;
  /* resize: none;  Todo: research if there is a non-js way to style/move grippie */
  max-width: 100%;
}

select.tweentable {
  display: inline-block;
  vertical-align: middle;
  font-size: 1rem;
  color: var(--text);
  padding: 0.6em 2em 0.5em 0.8em;
  margin: 6px 0px;
  max-width: fit-content;
  box-sizing: border-box;
  border: 1px solid var(--border);
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  border-radius: 0.5em;
  appearance: none;
  background-color: var(--background-inputs);
  background-image: var(--select-icon-url);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}



/* Interactive elements */
details.tweentable {
  border: 1px solid #aaa;
  border-radius: 7px;
  padding: 0.5em 0.5em 0;
}

summary.tweentable {
  font-weight: bold;
  margin: -0.5em -0.5em 0;
  padding: 0.5em;
}

details.tweentable[open] {
  padding: 0.5em;
}

details.tweentable[open] summary.tweentable {
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5em;
}

/* Dialog */
dialog.tweentable {
  border: 1px solid var(--border);
  border-radius: var(--border-radius);
}
</style>