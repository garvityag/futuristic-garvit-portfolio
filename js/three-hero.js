// Three.js hero background — particle field + wireframe icosahedron
window.addEventListener('load', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function setSize() {
    const w = canvas.offsetWidth || window.innerWidth;
    const h = canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    return { w, h };
  }
  let { w, h } = setSize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.z = 300;

  // Particle field
  const count = 800;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 500;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    if (Math.random() > 0.5) {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.42; colors[i * 3 + 2] = 0.17;
    } else {
      colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.65; colors[i * 3 + 2] = 0.91;
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Wireframe icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(90, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xff6b2b,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // Subtle inner glow sphere
  const glowGeo = new THREE.SphereGeometry(60, 24, 24);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.05
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // Mouse parallax
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 60;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 40;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    ico.rotation.y = t * 0.15;
    ico.rotation.x = t * 0.08;

    glow.rotation.y = -t * 0.12;
    glow.rotation.z = t * 0.06;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const s = setSize();
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
  });
});
