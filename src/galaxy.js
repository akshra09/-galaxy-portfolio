import * as THREE from 'three';

/**
 * Builds a spiral-armed particle galaxy as a THREE.Points object.
 * Each particle is placed along one of `branches` spiral arms, with
 * random radial scatter and a color gradient from the core outward.
 */
export function createGalaxy({
  count = 22000,
  radius = 6,
  branches = 4,
  spin = 1.1,
  randomness = 0.4,
  randomnessPower = 3,
  insideColor = '#ec4899',
  outsideColor = '#7c3aed',
} = {}) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const colorInside = new THREE.Color(insideColor);
  const colorOutside = new THREE.Color(outsideColor);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const r = Math.pow(Math.random(), 1.5) * radius;
    const branchAngle = ((i % branches) / branches) * Math.PI * 2;
    const spinAngle = r * spin;

    const randomX =
      Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
    const randomY =
      Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.4;
    const randomZ =
      Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

    positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

    const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

  // NormalBlending (not Additive) — additive washes out to white on a
  // light background, which is what we want to avoid here.
  const material = new THREE.PointsMaterial({
    size: 0.06,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
  });

  const points = new THREE.Points(geometry, material);
  return points;
}

/**
 * A sparse, far-away starfield for depth behind the galaxy.
 * Rendered as small dark-violet flecks so they stay visible against
 * a light backdrop instead of disappearing like white-on-white would.
 */
export function createStarfield({ count = 1800, radius = 60 } = {}) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Distribute roughly on a sphere shell so stars stay far from the camera path.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.6 + Math.random() * 0.4);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    color: '#8b7cc4',
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

/**
 * A handful of playful wireframe solids scattered along the camera path —
 * the "3D ornaments" that make the scene feel inhabited rather than just
 * a particle cloud. Each is deliberately a different primitive so they
 * read as distinct "bodies" as you scroll past them.
 */
export function createFloatingShapes() {
  const group = new THREE.Group();

  const shapeDefs = [
    {
      geometry: new THREE.IcosahedronGeometry(0.9, 0),
      color: '#ec4899',
      position: [2.6, 1.4, -1.5],
    },
    {
      geometry: new THREE.TorusKnotGeometry(0.55, 0.16, 100, 12),
      color: '#06b6d4',
      position: [-4, 0.6, -1],
    },
    {
      geometry: new THREE.OctahedronGeometry(0.7, 0),
      color: '#8b5cf6',
      position: [4.2, -0.8, -2],
    },
    {
      geometry: new THREE.TorusGeometry(0.6, 0.12, 12, 40),
      color: '#f59e0b',
      position: [-2.2, 2.5, -1.8],
    },
  ];

  shapeDefs.forEach(({ geometry, color, position }) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.userData.baseY = position[1];
    mesh.userData.spinSpeed = 0.15 + Math.random() * 0.25;
    mesh.userData.bobSpeed = 0.4 + Math.random() * 0.4;
    mesh.userData.bobPhase = Math.random() * Math.PI * 2;
    group.add(mesh);
  });

  return group;
}
