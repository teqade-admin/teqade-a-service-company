"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export type BuilderStage = { label: string; color: string }

const CHIP_T = 0.14 // chip thickness incl. die
const PIN = 0.03 // how far pins stick out past the chip body
// the skyscraper: tiers of chips that step back as they rise, then a spire
const TIERS = [
  { count: 5, width: 0.62 },
  { count: 5, width: 0.5 },
  { count: 4, width: 0.38 },
  { count: 3, width: 0.27 },
]
const SPIRE_H = 0.6
const ITEM_COUNT = TIERS.reduce((n, tier) => n + tier.count, 0) + 1
const PAD_Y = 0.06
const BUILDING_Z = 0.6
const FIGURE_Z = -2.0
const FIGURE_SCALE = 1.25 // founder + rig size relative to the original 2.5-unit figure
const SEGMENTS = 22
const STEP = 0.5 // seconds between item starts
const MOVE = 1.8 // seconds per pick-and-place
const FIRST_START = 0.8
const BUILD_END = FIRST_START + (ITEM_COUNT - 1) * STEP + MOVE
const PROXIMAL = 0.22 // finger segment length from knuckle to middle joint

// Finger angle that puts the fingertips just outside an item of this width,
// and the matching height of the hand's hub above the item's center.
const HAND_SCALE = 1.2 // grippers are scaled up to handle the larger chips
function gripFor(width: number) {
  const angle = Math.asin(Math.min(1, Math.max(0.05, (width / HAND_SCALE / 2 + 0.025 - 0.1) / PROXIMAL)))
  return { angle, offset: HAND_SCALE * (0.26 + PROXIMAL * Math.cos(angle)) }
}
const IDLE_GRIP = gripFor(0.5)
const HOLD_END = BUILD_END + 2.6
const CYCLE = HOLD_END + 1.6
const STATIC_TIME = BUILD_END + 1.2

// Cyborg floor: glowing minor/major grid, a few blinking panels, and a scan pulse
// rippling out from the tower. Added to the floor's emissive so it still takes light and shadows.
const CYBORG_GRID_GLSL = /* glsl */ `
float gridLine(vec2 p, float spacing, float width) {
  vec2 q = abs(fract(p / spacing + 0.5) - 0.5) * spacing;
  vec2 aa = fwidth(p) * 1.2;
  vec2 l = 1.0 - smoothstep(vec2(width), vec2(width) + aa, q);
  return max(l.x, l.y);
}
float cellHash(vec2 c) { return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 cyborgGrid(vec2 p) {
  float minor = gridLine(p, 0.4, 0.006);
  float major = gridLine(p, 1.6, 0.014);
  float h = cellHash(floor(p / 0.4));
  float lit = step(0.94, h) * (0.55 + 0.45 * sin(uTime * 1.7 + h * 40.0));
  float ring = fract(length(p - uCenter) * 0.35 - uTime * 0.25);
  float wave = smoothstep(0.0, 0.04, ring) * smoothstep(0.12, 0.04, ring);
  vec3 c = uColor * (minor * 0.18 + major * 0.55)
         + uColor2 * lit * 0.08
         + uColor * wave * (0.2 + (minor + major) * 1.2) * (0.5 + uPulse);
  float edge = smoothstep(3.2, 2.2, max(abs(p.x), abs(p.y)));
  return c * (0.35 + 0.65 * edge);
}
`

const UP = new THREE.Vector3(0, 1, 0)
const DOWN = new THREE.Vector3(0, -1, 0)

// Tentacle arms, attached to the back harness. Each feeds from a chip pad in one corner
// of the floor: the upper pair from the rear corners, the lower pair from the front corners.
const ARMS = [
  { root: new THREE.Vector3(-0.16, 1.72, -0.34), bend: new THREE.Vector3(-1.1, 1.5, -0.5), rest: new THREE.Vector3(-2.0, 3.7, -1.4), pad: new THREE.Vector3(-2.55, 0, -2.55) },
  { root: new THREE.Vector3(0.16, 1.72, -0.34), bend: new THREE.Vector3(1.1, 1.5, -0.5), rest: new THREE.Vector3(2.0, 3.7, -1.4), pad: new THREE.Vector3(2.55, 0, -2.55) },
  { root: new THREE.Vector3(-0.16, 1.36, -0.34), bend: new THREE.Vector3(-1.2, 0.9, 0.3), rest: new THREE.Vector3(-1.6, 2.7, 0.1), pad: new THREE.Vector3(-2.55, 0, 2.55) },
  { root: new THREE.Vector3(0.16, 1.36, -0.34), bend: new THREE.Vector3(1.2, 0.9, 0.3), rest: new THREE.Vector3(1.6, 2.7, 0.1), pad: new THREE.Vector3(2.55, 0, 2.55) },
]

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const phase = (u: number, a: number, b: number) => clamp01((u - a) / (b - a))

function bezier(out: THREE.Vector3, p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number) {
  const it = 1 - t
  const a = it * it * it, b = 3 * it * it * t, c = 3 * it * t * t, d = t * t * t
  return out.set(
    p0.x * a + p1.x * b + p2.x * c + p3.x * d,
    p0.y * a + p1.y * b + p2.y * c + p3.y * d,
    p0.z * a + p1.z * b + p2.z * c + p3.z * d,
  )
}

function makeTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 256, h = 256) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (ctx) draw(ctx, w, h)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number) {
  let s = size
  do {
    ctx.font = `800 ${s}px Inter, system-ui, sans-serif`
    s -= 2
  } while (ctx.measureText(text).width > maxWidth && s > 10)
}

export function BuilderScene({ stages }: { stages: BuilderStage[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.domElement.style.display = "block"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    container.appendChild(renderer.domElement)

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const colors = stages.map((s) => new THREE.Color(s.color))
    const primary = colors[0]

    // ---------- scene, camera, lights ----------
    const scene = new THREE.Scene()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTexture
    scene.environmentIntensity = 0.4

    // isometric view: orthographic camera looking down the (1, 1, 1) diagonal
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    const target = new THREE.Vector3(0, 0.8, 0.2)
    const isoDir = new THREE.Vector3(1, 1, 1).normalize()
    const fitPoints = [
      ...[-3.2, 3.2].flatMap((x) => [-3.2, 3.2].flatMap((z) => [new THREE.Vector3(x, -0.3, z), new THREE.Vector3(x, 0, z)])),
      new THREE.Vector3(0, 2.6 * FIGURE_SCALE, FIGURE_Z),
      ...ARMS.map((arm) => arm.rest.clone().setY(arm.rest.y + 0.5)),
    ]

    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x0a0c12, 0.7))
    const sun = new THREE.DirectionalLight(0xffffff, 1.6)
    sun.position.set(5, 9, 6)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.camera.left = -6
    sun.shadow.camera.right = 6
    sun.shadow.camera.top = 6
    sun.shadow.camera.bottom = -6
    sun.shadow.bias = -0.0005
    scene.add(sun)
    const beacon = new THREE.PointLight(primary, 0, 6)
    beacon.position.set(0, 2.6, BUILDING_Z)
    scene.add(beacon)

    // ---------- materials ----------
    const metal = new THREE.MeshStandardMaterial({ color: 0x8a96a3, metalness: 0.8, roughness: 0.3 })
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a3441, metalness: 0.6, roughness: 0.4 })
    const rubber = new THREE.MeshStandardMaterial({ color: 0x111418, roughness: 0.9 })
    const glow = (c: THREE.Color, intensity = 1.4) =>
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: intensity, roughness: 0.4 })
    const armGlow = colors.map((c) => glow(c))

    const add = (geometry: THREE.BufferGeometry, material: THREE.Material | THREE.Material[], x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }

    // ---------- stage ----------
    const groundGeometry = new THREE.BoxGeometry(6.4, 0.3, 6.4)
    const ground = add(groundGeometry, new THREE.MeshStandardMaterial({ color: 0x0d131b, roughness: 0.9 }), 0, -0.15, 0)
    ground.castShadow = false
    const groundEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(groundGeometry),
      new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.5 }),
    )
    groundEdges.position.y = -0.15
    scene.add(groundEdges)
    const floorUniforms = {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uColor: { value: primary.clone() },
      uColor2: { value: colors[1].clone() },
      uCenter: { value: new THREE.Vector2(0, BUILDING_Z) },
    }
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x070b10, roughness: 0.35, metalness: 0.6 })
    floorMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, floorUniforms)
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vFloor;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFloor = (modelMatrix * vec4(position, 1.0)).xyz;")
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>\nvarying vec3 vFloor;\nuniform float uTime;\nuniform float uPulse;\nuniform vec3 uColor;\nuniform vec3 uColor2;\nuniform vec2 uCenter;\n${CYBORG_GRID_GLSL}`,
        )
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += cyborgGrid(vFloor.xz);")
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0.002
    floor.receiveShadow = true
    scene.add(floor)
    // glowing strip around the platform's sides
    add(new THREE.BoxGeometry(6.42, 0.025, 6.42), glow(primary, 0.9), 0, -0.12, 0).castShadow = false

    const baseGeometry = new THREE.BoxGeometry(1.6, 0.06, 1.6)
    add(baseGeometry, darkMetal, 0, 0.03, BUILDING_Z)
    const baseEdgeMaterial = new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity: 0.6 })
    const baseEdges = new THREE.LineSegments(new THREE.EdgesGeometry(baseGeometry), baseEdgeMaterial)
    baseEdges.position.set(0, 0.03, BUILDING_Z)
    scene.add(baseEdges)

    ARMS.forEach((arm, i) => {
      const color = stages[i].color
      const label = stages[i].label.toUpperCase()
      const texture = makeTexture((ctx, w, h) => {
        ctx.fillStyle = "#0b1119"
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = color
        ctx.lineWidth = 8
        ctx.strokeRect(8, 8, w - 16, h - 16)
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = color
        ctx.font = "800 88px Inter, system-ui, sans-serif"
        ctx.fillText(`0${i + 1}`, w / 2, h / 2 - 22)
        ctx.fillStyle = "#dbe7f0"
        fitFont(ctx, label, w - 40, 34)
        ctx.fillText(label, w / 2, h / 2 + 54)
      })
      const top = new THREE.MeshStandardMaterial({ map: texture, emissive: 0xffffff, emissiveMap: texture, emissiveIntensity: 0.5, roughness: 0.6 })
      const pad = new THREE.Mesh(new THREE.BoxGeometry(1.2, PAD_Y, 1.2), [darkMetal, darkMetal, top, darkMetal, darkMetal, darkMetal])
      pad.position.set(arm.pad.x, PAD_Y / 2, arm.pad.z)
      pad.receiveShadow = true
      scene.add(pad)
    })

    // ---------- the four-armed builder ----------
    const figure = new THREE.Group()
    figure.position.set(0, 0, FIGURE_Z)
    scene.add(figure)

    // the builder: a realistic suited figure modeled in Blender (MPFB with CC0 MakeHuman assets),
    // loaded from public/models, with the Teqade rig on his back carrying the four arms
    const rig = new THREE.Group()
    rig.scale.setScalar(FIGURE_SCALE)
    figure.add(rig)
    add(new RoundedBoxGeometry(0.32, 0.64, 0.12, 2, 0.03), darkMetal, 0, 1.54, -0.22, rig)
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 20), glow(primary), 0, 1.56, -0.285, rig).rotation.x = Math.PI / 2
    ARMS.forEach((arm) => add(new THREE.SphereGeometry(0.09, 16, 12), metal, arm.root.x, arm.root.y, arm.root.z, rig))
    let rootShiftZ = 0
    let disposed = false

    new GLTFLoader().load(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/founder.glb`, (gltf) => {
      if (disposed) return
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const scale = (2.5 * FIGURE_SCALE) / (box.max.y - box.min.y)
      model.scale.setScalar(scale)
      model.position.set(-((box.min.x + box.max.x) / 2) * scale, -box.min.y * scale, -((box.min.z + box.max.z) / 2) * scale)
      model.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.isMesh) {
          mesh.castShadow = true
          mesh.receiveShadow = true
          // brighter under the studio environment, and sharp textures at grazing iso angles
          const material = mesh.material as THREE.MeshStandardMaterial
          material.envMapIntensity = 1.6
          for (const map of [material.map, material.normalMap]) if (map) map.anisotropy = renderer.capabilities.getMaxAnisotropy()
        }
      })
      figure.add(model)
      model.updateMatrixWorld(true)
      // sit the rig flush against his back, measured at chest height
      const hit = new THREE.Raycaster(new THREE.Vector3(0, 1.55 * FIGURE_SCALE, FIGURE_Z - 3), new THREE.Vector3(0, 0, 1)).intersectObject(model, true)[0]
      if (hit) {
        rootShiftZ = hit.point.z - FIGURE_Z + (0.22 - 0.06) * FIGURE_SCALE
        rig.position.z = rootShiftZ
      }
      if (!running) render()
    })

    // tentacle segments + claws
    // robotic arm: alternating alloy links and dark joint collars
    const segmentGeometries = Array.from({ length: SEGMENTS }, (_, i) => {
      const r = (0.11 - 0.05 * (i / SEGMENTS)) * (i % 2 ? 1.12 : 1)
      return new THREE.CylinderGeometry(r * 0.94, r, 1, 16)
    })
    const knuckleGeometry = new THREE.SphereGeometry(0.034, 12, 10)
    const proximalGeometry = new RoundedBoxGeometry(0.05, PROXIMAL, 0.07, 2, 0.012)
    const distalGeometry = new RoundedBoxGeometry(0.045, 0.13, 0.06, 2, 0.012)
    const tipGeometry = new RoundedBoxGeometry(0.05, 0.035, 0.066, 2, 0.012)
    const arms = ARMS.map((_, a) => {
      const segments = segmentGeometries.map((geometry, i) =>
        add(geometry, i % 6 === 3 ? armGlow[a] : i % 2 ? darkMetal : metal, 0, 0, 0),
      )
      // gripper hand: wrist, palm, and four two-jointed fingers
      const claw = new THREE.Group()
      claw.scale.setScalar(HAND_SCALE)
      scene.add(claw)
      add(new THREE.CylinderGeometry(0.085, 0.095, 0.1, 20), darkMetal, 0, -0.04, 0, claw)
      add(new THREE.TorusGeometry(0.094, 0.014, 8, 28), armGlow[a], 0, -0.075, 0, claw).rotation.x = Math.PI / 2
      add(new RoundedBoxGeometry(0.24, 0.08, 0.24, 2, 0.03), metal, 0, -0.13, 0, claw)
      const fingers = [0, 1, 2, 3].map((j) => {
        const pivot = new THREE.Group()
        pivot.rotation.y = (j * Math.PI) / 2
        claw.add(pivot)
        const knuckle = new THREE.Group()
        knuckle.position.set(0.1, -0.17, 0)
        pivot.add(knuckle)
        add(knuckleGeometry, darkMetal, 0, 0, 0, knuckle)
        add(proximalGeometry, metal, 0, -PROXIMAL / 2, 0, knuckle)
        const joint = new THREE.Group()
        joint.position.y = -PROXIMAL
        knuckle.add(joint)
        add(knuckleGeometry, darkMetal, 0, 0, 0, joint)
        add(distalGeometry, metal, 0, -0.065, 0, joint)
        add(tipGeometry, rubber, 0, -0.14, 0, joint)
        return { knuckle, joint }
      })
      return { segments, claw, fingers, points: Array.from({ length: SEGMENTS + 1 }, () => new THREE.Vector3()) }
    })

    // ---------- microchips and the skyscraper they build ----------
    const chipBody = new THREE.MeshStandardMaterial({ color: 0x16191f, roughness: 0.45, metalness: 0.2 })
    const gold = new THREE.MeshStandardMaterial({ color: 0xd9a846, metalness: 1, roughness: 0.3 })
    const dieMaterials = colors.map((c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0, roughness: 0.35 }))

    // gold pins on all four sides, merged into one geometry per chip size
    const pinsFor = (width: number) => {
      const parts: THREE.BufferGeometry[] = []
      const n = Math.max(2, Math.floor((width - 0.08) / 0.06))
      const edge = width / 2 + PIN / 2
      for (let i = 0; i < n; i++) {
        const s = -((n - 1) * 0.06) / 2 + i * 0.06
        parts.push(new THREE.BoxGeometry(0.022, 0.02, PIN).translate(s, -0.02, edge))
        parts.push(new THREE.BoxGeometry(0.022, 0.02, PIN).translate(s, -0.02, -edge))
        parts.push(new THREE.BoxGeometry(PIN, 0.02, 0.022).translate(edge, -0.02, s))
        parts.push(new THREE.BoxGeometry(PIN, 0.02, 0.022).translate(-edge, -0.02, s))
      }
      const merged = mergeGeometries(parts)
      parts.forEach((part) => part.dispose())
      return merged
    }
    const chipParts = new Map(
      TIERS.map(({ width }) => [
        width,
        {
          body: new RoundedBoxGeometry(width, CHIP_T * 0.8, width, 2, 0.02),
          pins: pinsFor(width),
          die: new THREE.BoxGeometry(width * 0.5, 0.02, width * 0.5),
        },
      ]),
    )

    type Item = { object: THREE.Group; start: number; pad: THREE.Vector3; slot: THREE.Vector3; grip: ReturnType<typeof gripFor> }
    const items: Item[] = []
    let stackY = PAD_Y
    const addItem = (object: THREE.Group, height: number, gripWidth: number) => {
      const a = items.length % 4
      scene.add(object)
      items.push({
        object,
        start: FIRST_START + items.length * STEP,
        pad: new THREE.Vector3(ARMS[a].pad.x, PAD_Y + height / 2, ARMS[a].pad.z),
        slot: new THREE.Vector3(0, stackY + height / 2, BUILDING_Z),
        grip: gripFor(gripWidth),
      })
      stackY += height + 0.01
    }
    TIERS.forEach(({ count, width }) => {
      const parts = chipParts.get(width)!
      for (let i = 0; i < count; i++) {
        const chip = new THREE.Group()
        add(parts.body, chipBody, 0, -CHIP_T * 0.1, 0, chip)
        add(parts.pins, gold, 0, 0, 0, chip)
        add(parts.die, dieMaterials[items.length % 4], 0, CHIP_T * 0.4, 0, chip)
        addItem(chip, CHIP_T, width + PIN * 2)
      }
    })
    const spire = new THREE.Group()
    add(new THREE.CylinderGeometry(0.07, 0.09, 0.1, 20), darkMetal, 0, -0.25, 0, spire)
    add(new THREE.CylinderGeometry(0.012, 0.035, 0.46, 12), metal, 0, 0.03, 0, spire)
    add(new THREE.SphereGeometry(0.035, 12, 10), glow(primary, 2), 0, 0.28, 0, spire)
    addItem(spire, SPIRE_H, 0.1)

    // ---------- modeled arm parts (Blender) replace the primitives once loaded ----------
    // Each part is authored in the local frame of the group it replaces; material names are roles.
    type Part = { geometry: THREE.BufferGeometry; roles: string[] }
    const segmentScale = segmentGeometries.map(() => 1) // radial scale; 1 while primitives are in use
    let segmentLength = 1
    const chrome = new THREE.MeshStandardMaterial({ color: 0xd8dde3, metalness: 1, roughness: 0.15 })
    const roleMaterials: Record<string, THREE.Material> = { metal, dark: darkMetal, chrome, rubber }
    const materialsFor = (part: Part, accent: THREE.Material) => part.roles.map((role) => roleMaterials[role] ?? accent)
    const isMesh = (object: THREE.Object3D): object is THREE.Mesh => (object as THREE.Mesh).isMesh === true
    const swapIn = (parent: THREE.Object3D, part: Part, accent: THREE.Material) => {
      parent.children.filter(isMesh).forEach((mesh) => parent.remove(mesh))
      return add(part.geometry, materialsFor(part, accent), 0, 0, 0, parent)
    }

    new GLTFLoader().load(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/models/arm-parts.glb`, (gltf) => {
      if (disposed) return
      gltf.scene.updateMatrixWorld(true)
      const parts: Record<string, Part> = {}
      gltf.scene.children.forEach((node) => {
        const pieces: THREE.BufferGeometry[] = []
        const roles: string[] = []
        const toPart = node.matrixWorld.clone().invert()
        node.traverse((object) => {
          if (!isMesh(object)) return
          const piece = new THREE.BufferGeometry()
          piece.setAttribute("position", object.geometry.getAttribute("position"))
          piece.setAttribute("normal", object.geometry.getAttribute("normal"))
          piece.setIndex(object.geometry.getIndex())
          pieces.push(piece.applyMatrix4(toPart.clone().multiply(object.matrixWorld)))
          roles.push((object.material as THREE.Material).name)
          ;(object.material as THREE.Material).dispose()
        })
        parts[node.name] = { geometry: mergeGeometries(pieces, true), roles }
      })

      arms.forEach(({ segments, claw, fingers }, a) => {
        segments.forEach((segment, i) => {
          const part = parts[i % 6 === 3 ? "segment_accent" : "segment"]
          segment.geometry = part.geometry
          segment.material = materialsFor(part, armGlow[a])
          segmentScale[i] = 0.11 - 0.05 * (i / SEGMENTS)
        })
        swapIn(claw, parts.palm, armGlow[a])
        fingers.forEach(({ knuckle, joint }) => {
          swapIn(knuckle, parts.proximal, armGlow[a])
          swapIn(joint, parts.distal, armGlow[a])
        })
      })
      segmentLength = 1 / 2.2 // modeled segment is 2.2 units long
      rig.children.filter(isMesh).forEach((mesh) => rig.remove(mesh))
      add(parts.plate.geometry, materialsFor(parts.plate, glow(primary)), 0, 1.54, -0.22, rig)
      ARMS.forEach((arm) => {
        add(parts.mount.geometry, materialsFor(parts.mount, metal), arm.root.x, arm.root.y, -0.28, rig).rotation.x = -Math.PI / 2
      })
      if (!running) render()
    })

    // ---------- animation ----------
    const hand = new THREE.Vector3()
    const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), p2 = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const from = new THREE.Vector3(), to = new THREE.Vector3(), rest = new THREE.Vector3()
    const carried: (THREE.Vector3 | null)[] = items.map(() => null)
    const handPositions = ARMS.map(() => new THREE.Vector3())
    let pointerYaw = 0
    let pointerTarget = 0

    const arc = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, v: number, lift: number) =>
      out.lerpVectors(a, b, v).setY(out.y + Math.sin(Math.PI * v) * lift)

    function update(time: number) {
      const t = time % CYCLE
      carried.fill(null)

      ARMS.forEach((arm, a) => {
        rest.copy(arm.rest)
        rest.x += Math.sin(time * 1.1 + a) * 0.15
        rest.y += Math.sin(time * 1.4 + a * 2) * 0.12

        let open = 1
        let grip = IDLE_GRIP
        hand.copy(rest)
        for (let k = a; k < items.length; k += 4) {
          const item = items[k]
          const u = (t - item.start) / MOVE
          if (t >= HOLD_END || u < 0 || u > 1) continue
          grip = item.grip
          from.copy(item.pad).setY(item.pad.y + grip.offset)
          to.copy(item.slot).setY(item.slot.y + grip.offset)
          if (u < 0.28) arc(hand, rest, from, ease(u / 0.28), 0.6)
          else if (u < 0.36) { hand.copy(from); open = 1 - phase(u, 0.28, 0.36) }
          else if (u < 0.78) { arc(hand, from, to, ease(phase(u, 0.36, 0.78)), 1.3); open = 0; carried[k] = handPositions[a] }
          else if (u < 0.84) { hand.copy(to); open = phase(u, 0.78, 0.84) }
          else arc(hand, to, rest, ease(phase(u, 0.84, 1)), 0.5)
        }
        handPositions[a].copy(hand)

        // tentacle curve: out and up from the harness, then straight down onto the hand
        const { segments, claw, fingers, points } = arms[a]
        p0.set(arm.root.x * FIGURE_SCALE, arm.root.y * FIGURE_SCALE, arm.root.z * FIGURE_SCALE + FIGURE_Z + rootShiftZ)
        p1.copy(p0).add(arm.bend)
        p2.copy(hand).setY(hand.y + 1.6)
        for (let i = 0; i <= SEGMENTS; i++) bezier(points[i], p0, p1, p2, hand, i / SEGMENTS)
        segments.forEach((segment, i) => {
          dir.subVectors(points[i + 1], points[i])
          const length = dir.length() || 0.0001
          segment.position.addVectors(points[i], points[i + 1]).multiplyScalar(0.5)
          segment.quaternion.setFromUnitVectors(UP, dir.divideScalar(length))
          segment.scale.set(segmentScale[i], length * 1.12 * segmentLength, segmentScale[i])
        })
        claw.position.copy(hand)
        claw.quaternion.setFromUnitVectors(DOWN, dir.subVectors(hand, p2).normalize())
        // closed: fingertips pinch the sides of the held chip
        fingers.forEach(({ knuckle, joint }) => {
          knuckle.rotation.z = grip.angle + open * 0.45
          joint.rotation.z = -grip.angle + open * 0.6
        })
      })

      const done = phase(t, BUILD_END, BUILD_END + 0.5) * (1 - phase(t, HOLD_END, HOLD_END + 0.4))
      items.forEach((item, k) => {
        let scale = 1
        const held = carried[k]
        const teardown = HOLD_END + (items.length - 1 - k) * 0.06
        if (t >= HOLD_END) {
          scale = 1 - ease(phase(t, teardown, teardown + 0.3))
          item.object.position.copy(item.slot)
        } else if (t < item.start) {
          scale = ease(phase(t, item.start - 0.5, item.start - 0.1))
          item.object.position.copy(item.pad)
        } else if (held) {
          item.object.position.copy(held).setY(held.y - item.grip.offset)
        } else {
          item.object.position.copy((t - item.start) / MOVE < 0.5 ? item.pad : item.slot)
        }
        item.object.visible = scale > 0.001
        item.object.scale.setScalar(Math.max(scale, 0.001))
      })
      dieMaterials.forEach((material) => (material.emissiveIntensity = done * 0.6))
      beacon.intensity = done * 6
      floorUniforms.uTime.value = time
      floorUniforms.uPulse.value = done
      baseEdgeMaterial.opacity = 0.6 + done * 0.4
      if (badgeRef.current) badgeRef.current.style.opacity = String(done)

      pointerYaw += (pointerTarget - pointerYaw) * 0.05
      camera.position.copy(isoDir).applyAxisAngle(UP, pointerYaw).multiplyScalar(30).add(target)
      camera.lookAt(target)
    }

    // ---------- lifecycle ----------
    const clock = new THREE.Clock()
    let elapsed = reduced ? STATIC_TIME : 0
    let running = false
    const render = () => {
      update(elapsed)
      renderer.render(scene, camera)
    }
    const frame = () => {
      elapsed += Math.min(clock.getDelta(), 0.05)
      render()
    }

    const layout = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height, false)
      // frame the diorama: project its extremes into view space, then match the aspect
      camera.position.copy(isoDir).multiplyScalar(30).add(target)
      camera.lookAt(target)
      camera.updateMatrixWorld()
      const bounds = new THREE.Box2()
      fitPoints.forEach((p) => {
        const v = p.clone().applyMatrix4(camera.matrixWorldInverse)
        bounds.expandByPoint(new THREE.Vector2(v.x, v.y))
      })
      const center = bounds.getCenter(new THREE.Vector2())
      const size = bounds.getSize(new THREE.Vector2()).multiplyScalar(0.53)
      const aspect = width / height
      if (size.x / size.y > aspect) size.y = size.x / aspect
      else size.x = size.y * aspect
      camera.left = center.x - size.x
      camera.right = center.x + size.x
      camera.top = center.y + size.y
      camera.bottom = center.y - size.y
      camera.updateProjectionMatrix()
      if (!running) render()
    }
    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(container)
    layout()

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting && !reduced
      if (running) clock.getDelta()
      renderer.setAnimationLoop(running ? frame : null)
    }, { threshold: 0.05 })
    intersectionObserver.observe(container)

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerTarget = ((event.clientX - rect.left) / rect.width - 0.5) * 0.35
    }
    const onPointerLeave = () => (pointerTarget = 0)
    container.addEventListener("pointermove", onPointerMove)
    container.addEventListener("pointerleave", onPointerLeave)

    return () => {
      disposed = true
      renderer.setAnimationLoop(null)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerleave", onPointerLeave)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        const materials = Array.isArray(material) ? material : material ? [material] : []
        materials.forEach((m) => {
          ;(m as THREE.MeshStandardMaterial).map?.dispose()
          m.dispose()
        })
      })
      envTexture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [stages])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 cursor-crosshair"
      role="img"
      aria-label="Animated 3D scene: a man in a sharp suit and sunglasses, with four robotic arms attached to his back, picks up microchips and stacks them into a stepped, Empire-style skyscraper topped with a glowing spire."
    >
      <div
        ref={badgeRef}
        className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 border border-primary/40 bg-background/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary opacity-0"
      >
        Your startup · Live
      </div>
      {failed && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-muted-foreground">
          3D preview unavailable in this browser.
        </p>
      )}
    </div>
  )
}
