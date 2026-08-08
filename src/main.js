import * as THREE from 'three';
import { createGalaxy, createStarfield, createFloatingShapes } from './galaxy.js';
import './style.css';

const canvas = document.querySelector('#galaxy-canvas');
const progressFill = document.querySelector('#scroll-progress-fill');

// ---------- Scene ----------
const scene = new THREE.Scene();

const sizes = { width: window.innerWidth, height: window.innerHeight };

const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 3.2, 7.5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ---------- Galaxy + starfield ----------
const galaxyGroup = new THREE.Group();
const galaxy = createGalaxy();
galaxyGroup.add(galaxy);
scene.add(galaxyGroup);

const starfield = createStarfield();
scene.add(starfield);

// Playful wireframe "ornaments" scattered through the scene.
const floatingShapes = createFloatingShapes();
scene.add(floatingShapes);

// Subtle ambient light so any future solid geometry reads correctly.
scene.add(new THREE.AmbientLight('#ffffff', 0.4));

// ---------- Camera path ----------
// One waypoint per content section. Scroll progress lerps the camera
// smoothly between them instead of jump-cutting.
const cameraPath = [
  { position: new THREE.Vector3(0, 3.2, 7.5), lookAt: new THREE.Vector3(0, 0, 0) }, // origin (hero)
  { position: new THREE.Vector3(4.5, 1.6, 4.5), lookAt: new THREE.Vector3(0, 0, 0) }, // nebula (about)
  { position: new THREE.Vector3(-5, 2.2, 3.5), lookAt: new THREE.Vector3(0, 0.5, 0) }, // cluster (projects)
  { position: new THREE.Vector3(0, 5.5, 2), lookAt: new THREE.Vector3(0, 0, 0) }, // signal (contact)
];

let scrollProgress = 0; // 0..1 across the whole page
let targetScrollProgress = 0;

function updateScrollProgress() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY;
  const scrollable = doc.scrollHeight - window.innerHeight;
  targetScrollProgress = scrollable > 0 ? scrollTop / scrollable : 0;
  progressFill.style.width = `${targetScrollProgress * 100}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ---------- Mouse parallax ----------
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width - 0.5) * 2;
  mouse.y = (event.clientY / sizes.height - 0.5) * 2;
});

// ---------- Resize ----------
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ---------- Helpers ----------
function getPathPoint(t) {
  const segments = cameraPath.length - 1;
  const scaled = t * segments;
  const index = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - index;

  const a = cameraPath[index];
  const b = cameraPath[Math.min(index + 1, segments)];

  return {
    position: a.position.clone().lerp(b.position, localT),
    lookAt: a.lookAt.clone().lerp(b.lookAt, localT),
  };
}

// ---------- Render loop ----------
const clock = new THREE.Clock();

function tick() {
  const elapsed = clock.getElapsedTime();

  // Ease the raw scroll value toward its target for a smooth glide.
  scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

  const { position, lookAt } = getPathPoint(scrollProgress);
  camera.position.lerp(position, 1); // path already eased above
  camera.lookAt(lookAt);

  // Gentle constant rotation + mouse parallax tilt on the galaxy itself.
  galaxyGroup.rotation.y = elapsed * 0.035 + mouse.x * 0.15;
  galaxyGroup.rotation.x = mouse.y * 0.08;

  starfield.rotation.y = elapsed * 0.008;

  floatingShapes.children.forEach((mesh) => {
    mesh.rotation.x = elapsed * mesh.userData.spinSpeed;
    mesh.rotation.y = elapsed * mesh.userData.spinSpeed * 0.7;
    mesh.position.y =
      mesh.userData.baseY + Math.sin(elapsed * mesh.userData.bobSpeed + mesh.userData.bobPhase) * 0.25;
  });

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();

// ---------- Touch-friendly card flip ----------
// Hover handles desktop; on touch devices there's no hover, so tapping
// a project card toggles a `.flipped` class instead.
document.querySelectorAll('.star-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});
