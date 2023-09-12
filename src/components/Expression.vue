<script setup lang="ts">
import { ref, watch } from 'vue'
//import * as THREE from 'three'

const props = defineProps<{
  expressions: object
  //currentEexpression: string
}>()
const expressions = ref<object>(props.expressions);
//const currentEexpression = ref<string>(props.currentEexpression);
console.log( expressions.value )

watch(() => props.expressions, () => {
  console.log(props.expressions)
  expressions.value = props.expressions
})

interface Emits {
  (e: 'setExpression', v: string ): void;
}
const emits = defineEmits<Emits>();

const click = (key) => {
  console.log(key)
  emits('setExpression', key)
}
</script>

<template>
  <section id="expressions">
    <h2>Expressions</h2>
    <ul>
      <li v-for="(expression, key) in expressions" :key="key" :class="key">
        <button class="button_1" @click="click(key)">{{ key }}</button>
      </li>
    </ul>
  </section>
</template>

<style lang="scss">
#expressions {
  // overflow: auto;
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // max-height: 90vh;
  // padding: 1em;
  // background: rgba(255,255,255,.8);
  box-sizing: border-box;
  h2 {
    margin: 0;
  }
  ul {
    padding: 0;
    list-style: none;
  }
  li + li {
    margin-top: .5em;
  }
}
</style>