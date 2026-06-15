// NutriVerse · 3D hero background
// A glowing organic core surrounded by a drifting nutrient particle field,
// orbiting "macro" nodes and subtle mouse-driven parallax.
import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x070b09, 0.045);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 14);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

// ---- palette ----
const LIME = new THREE.Color('#9cff57');
const EMERALD = new THREE.Color('#27e08a');
const MINT = new THREE.Color('#5ff0c8');

// ---- lights ----
scene.add(new THREE.AmbientLight(0x88ffcc, 0.6));
const key = new THREE.PointLight(0x9cff57, 60, 60);
key.position.set(6, 8, 10);
scene.add(key);
const rim = new THREE.PointLight(0x27e08a, 40, 60);
rim.position.set(-8, -4, 6);
scene.add(rim);

// ---- central glowing core (icosahedron wireframe + inner glow) ----
const coreGroup = new THREE.Group();
scene.add(coreGroup);

const coreGeo = new THREE.IcosahedronGeometry(2.6, 1);
const coreMat = new THREE.MeshStandardMaterial({
  color: 0x0d2018, emissive: 0x0f3a28, emissiveIntensity: 0.6,
  metalness: 0.6, roughness: 0.25, flatShading: true,
});
const core = new THREE.Mesh(coreGeo, coreMat);
coreGroup.add(core);

const wire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(2.72, 1),
  new THREE.MeshBasicMaterial({ color: EMERALD, wireframe: true, transparent: true, opacity: 0.35 })
);
coreGroup.add(wire);

// store base positions for the breathing displacement
const basePos = coreGeo.attributes.position.array.slice();

// ---- orbiting macro nodes ----
const nodes = new THREE.Group();
scene.add(nodes);
const nodeColors = [LIME, EMERALD, MINT, LIME, MINT];
for (let i = 0; i < 5; i++) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(0.16 + Math.random() * 0.12, 16, 16),
    new THREE.MeshStandardMaterial({
      color: nodeColors[i], emissive: nodeColors[i], emissiveIntensity: 1.4, roughness: 0.3,
    })
  );
  m.userData = {
    radius: 4 + Math.random() * 2.2,
    speed: 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 1.2,
  };
  nodes.add(m);
}

// ---- drifting particle field ----
const COUNT = reduceMotion ? 400 : 1300;
const pGeo = new THREE.BufferGeometry();
const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT; i++) {
  const r = 6 + Math.random() * 16;
  const t = Math.random() * Math.PI * 2;
  const p = Math.acos(2 * Math.random() - 1);
  positions[i * 3] = r * Math.sin(p) * Math.cos(t);
  positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t) * 0.6;
  positions[i * 3 + 2] = r * Math.cos(p);
  const c = [LIME, EMERALD, MINT][i % 3];
  colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// soft round sprite
const sprite = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();

const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
  size: 0.14, map: sprite, vertexColors: true, transparent: true, opacity: 0.85,
  depthWrite: false, blending: THREE.AdditiveBlending,
}));
scene.add(particles);

// ---- interaction: parallax ----
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (e) => {
  mouse.tx = (e.clientX / innerWidth - 0.5);
  mouse.ty = (e.clientY / innerHeight - 0.5);
});

let scrollY = 0;
addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---- animation loop ----
const clock = new THREE.Clock();
function animate() {
  const t = clock.getElapsedTime();

  // smooth parallax
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  // core breathing / rotation
  if (!reduceMotion) {
    coreGroup.rotation.y = t * 0.18;
    coreGroup.rotation.x = Math.sin(t * 0.25) * 0.25;
    const pos = coreGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const nx = basePos[ix], ny = basePos[ix + 1], nz = basePos[ix + 2];
      const d = 1 + Math.sin(t * 1.5 + nx * 2 + ny * 2) * 0.04;
      pos.array[ix] = nx * d; pos.array[ix + 1] = ny * d; pos.array[ix + 2] = nz * d;
    }
    pos.needsUpdate = true;
    wire.rotation.copy(core.rotation);
  }

  // orbiting nodes
  nodes.children.forEach((m, i) => {
    const u = m.userData;
    const a = t * u.speed + u.phase;
    m.position.set(
      Math.cos(a) * u.radius,
      Math.sin(a * 0.8) * u.radius * 0.4 + u.tilt,
      Math.sin(a) * u.radius
    );
    const s = 1 + Math.sin(t * 2 + i) * 0.2;
    m.scale.setScalar(s);
  });

  // particle drift + scroll pull
  particles.rotation.y = t * 0.02 + scrollY * 0.0002;
  particles.rotation.x = scrollY * 0.0001;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
