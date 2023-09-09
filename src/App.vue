<script setup lang="ts">
import { ref } from 'vue'
import Meta from './components/Meta.vue'
import Uoload from './components/Uoload.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin } from '@pixiv/three-vrm'

let vrm
const vrm_ = ref({
  meta: {
    title: '',
    version: 0,
    author: '',
  },
  materials: {length: 0},
})

const reset = () => {
  console.count('reset')
  if ( !vrm ) return;
  scene.remove(vrm.scene)
}

//シーン
const scene = new THREE.Scene()

//レンダラ
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  //alpha: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000)
document.body.appendChild(renderer.domElement)

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
)
camera.position.set(0,1,3)

//カメラコントーロール
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, .85, 0)
controls.screenSpacePanning = true
controls.update()

//ライト
const light = new THREE.DirectionalLight(0xffffff)
light.position.set(1,1,1).normalize()
scene.add(light)

//グリッドを表示
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)
gridHelper.visible = true

//座標軸
const axesHelper = new THREE.AxesHelper(0.5)
scene.add(axesHelper)

//ローダ
const loader = new GLTFLoader()

loader.register((parser) => {
  return new VRMLoaderPlugin(parser)
})

function load(model) {
  if ( vrm ) reset();
  loader.load(
    model,
    (gltf) => {
      //console.log(gltf.userData.vrm)
      vrm = gltf.userData.vrm
      console.log(vrm)
      /*
      vrm_.value = {
        title: vrm.meta.title,
        version: vrm.meta.version,
        materials: vrm.materials.length,
        author: vrm.meta.author,
      }
      */
      vrm_.value = vrm
      scene.add(vrm.scene)
      vrm.scene.rotation.y = Math.PI
      
      vrm.expressionManager.setValue('happy', 1.0)
      vrm.humanoid.getNormalizedBoneNode('leftUpperArm').rotation.z = 1.1
      vrm.humanoid.getNormalizedBoneNode('rightUpperArm').rotation.z = -1.1

      vrm.expressionManager.update()
      vrm.humanoid.update()
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error),
  )
}

load( '/AliciaSolid.vrm' )

const tick = () => {
  requestAnimationFrame(tick)
  renderer.render(scene, camera)
}
tick()
</script>

<template>
  <Meta :vrm="vrm_" />
  <Uoload @load="load" />
</template>

<style lang="scss">
body, p, ul, ol, dl { margin: 0 }
</style>