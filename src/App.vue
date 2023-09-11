<script setup lang="ts">
import { ref } from 'vue'
import Database from './components/Database.vue'
import Info from './components/Info.vue'
import Material from './components/Material.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'

let vrm

const info = ref({
  title: '',
  version: 0,
  author: '',
  triangles: 0,
  materials: 0,
  textures: 0,
  joints: 0,
  size: new THREE.Vector3(),
})

const materials = ref({})

let renderInfo

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
renderer.setPixelRatio(window.devicePixelRatio)
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

const onLoad = (gltf) => {
  console.log(gltf)
  vrm = gltf.userData.vrm
  console.log(vrm)
  scene.add(vrm.scene)
  VRMUtils.rotateVRM0(vrm)
  
  //vrm.expressionManager.setValue('happy', 1.0)
  //vrm.expressionManager.update()
  
  vrm.humanoid.getNormalizedBoneNode('leftUpperArm').rotation.z = 1.1
  vrm.humanoid.getNormalizedBoneNode('rightUpperArm').rotation.z = -1.1
  vrm.humanoid.update()

  //vrm.lookAt.target = camera
  //vrm.lookAt.autoUpdate = true

  // バウンディングボックスの可視化
  const boxHelper = new THREE.BoxHelper(vrm.scene, 0xffff00)
  vrm.scene.add(boxHelper)

  const bBox = new THREE.Box3().setFromObject(vrm.scene)
  const bSize = bBox.max.sub(bBox.min)

  //Info
  renderInfo = getRenderInfo()
  info.value = {
    title: vrm.meta.title,
    version: vrm.meta.version,
    author: vrm.meta.author,
    triangles: renderInfo.render.triangles,
    materials: vrm.materials.length,
    textures: Object.keys(gltf.parser.textureCache).length,
    size: bSize,
    joints: vrm.springBoneManager._joints.size,
  }

  //Material
  materials.value = vrm.materials
}

function load(model:string) {
  if ( vrm ) reset();
  loader.load(
    model, onLoad,
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error),
  )
}

const update = () => {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}

const getRenderInfo = () => {
  update()
  return (renderer.info)
}

update()
</script>

<template>
  <Info :info="info" />
  <Database @load="load" />
  <Material :materials="materials" />
</template>

<style lang="scss">
body, p, ul, ol, dl { margin: 0 }
</style>