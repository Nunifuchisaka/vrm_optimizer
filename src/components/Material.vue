<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import * as THREE from 'three'

let uploadingIndex = ref(0)
watch(uploadingIndex, () => {
  console.log(uploadingIndex.value)
})

const props = defineProps<{
  materials: object
}>()
const materials = ref<object>(props.materials);

watch(() => props.materials, () => {
  //console.log(props.materials)
  materials.value = props.materials
})

//
const bitmapLoader = new THREE.ImageBitmapLoader();
bitmapLoader.setOptions( { imageOrientation: 'flipY' } );

const upload = (event) => {
  console.group('Texture Upload')
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return
  const file = files[0]
  //console.log(file)
  if (!file) return
  const url = URL.createObjectURL(file)
  //console.log(url)
  bitmapLoader.load(url, (imageBitmap) => {
    //console.log(imageBitmap)
    materials.value[uploadingIndex.value].map.image = imageBitmap
    //const texture = new THREE.CanvasTexture( imageBitmap )
    //materials.value[uploadingIndex.value].map = texture
  })
  console.groupEnd()
}
</script>

<template>
  <section id="materials">
    <h2>Materials</h2>
    <table>
      <template v-for="(material, i) in materials" :key="i">
        <tr v-if="Boolean(material.map)" :set="dataURL = THREE.ImageUtils.getDataURL(material.map.image)">
          <th>
            {{ i }} : {{ material.name }}
            <p><a :href="dataURL" :download="material.name"><button class="button_1">Download</button></a></p>
            <p><label class="button_1" for="uploadTexture" @click="uploadingIndex = i">upload</label></p>
          </th>
          <td>
            <img class="thumbnail" :src="dataURL">
          </td>
        </tr>
      </template>
    </table>
    <input id="uploadTexture" type="file" accept=".png,.jpg" @change="upload" style="display: none">
  </section>
</template>

<style lang="scss">
#materials {
  // overflow: auto;
  // position: absolute;
  // bottom: 0;
  // right: 0;
  // max-height: 90vh;
  // padding: 1em;
  // background: rgba(255,255,255,.8);
  box-sizing: border-box;
  h2 {
    margin: 0;
  }
  table {
    text-align: left;
  }
  th, td {
    vertical-align: top;
  }
  th {
    width: 0;
    padding-right: 1em;
    white-space: nowrap;
  }
  .thumbnail {
    width: 100px;
    height: auto;
  }
}
</style>