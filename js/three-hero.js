// Three.js hero — custom GLSL shaders, orbiting neon lights, constellation network
window.addEventListener('load', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;

  function setSize() {
    const w = canvas.offsetWidth || window.innerWidth;
    const h = canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    return { w, h };
  }
  let { w, h } = setSize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 1400);
  camera.position.z = 340;

  // ══════════════════════════════════════════
  // GLSL: Glowing particle sprites with light proximity boost
  // ══════════════════════════════════════════
  const PARTICLE_VERT = `
    attribute float aSize;
    attribute vec3 aColor;
    uniform float uTime;
    uniform vec3 uLightOrange;
    uniform vec3 uLightCyan;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec3 col = aColor;

      // Light proximity boost — particles near orbiting lights glow brighter
      float dO = length(position - uLightOrange);
      float dC = length(position - uLightCyan);
      float boostO = exp(-dO * 0.0035) * 0.7;
      float boostC = exp(-dC * 0.003) * 0.6;
      col += boostO * vec3(1.0, 0.42, 0.17);
      col += boostC * vec3(0.05, 0.64, 0.91);
      col = clamp(col, 0.0, 1.5);

      vColor = col;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      // Per-particle pulsation — position.x/z as phase offset creates organic feel
      float pulse = sin(uTime * 1.6 + position.x * 0.009 + position.z * 0.007) * 0.5 + 0.5;
      float sz = aSize * (1.0 + pulse * 0.75);
      gl_PointSize = sz * (280.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 0.5, 14.0);

      gl_Position = projectionMatrix * mvPosition;
      vAlpha = 0.45 + pulse * 0.38 + boostO * 0.25 + boostC * 0.2;
      vAlpha = clamp(vAlpha, 0.0, 1.0);
    }
  `;

  const PARTICLE_FRAG = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 uv = gl_PointCoord - vec2(0.5);
      float dist = length(uv);
      if (dist > 0.5) discard;

      // Soft radial falloff
      float alpha = 1.0 - smoothstep(0.08, 0.5, dist);
      alpha = pow(alpha, 1.7);

      // Bright bloom core
      float core = exp(-dist * 9.0) * 0.65;
      vec3 col = vColor + core;

      gl_FragColor = vec4(col, alpha * vAlpha);
    }
  `;

  // ══════════════════════════════════════════
  // GLSL: Wireframe breathing opacity
  // ══════════════════════════════════════════
  const WIRE_VERT = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const WIRE_FRAG = `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uBase;
    uniform float uPhase;

    void main() {
      float breathe = sin(uTime * 0.6 + uPhase) * 0.5 + 0.5;
      float alpha = uBase * (0.5 + breathe * 1.5);
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  // ══════════════════════════════════════════
  // ORBITING NEON POINT LIGHTS (positions passed to shader)
  // ══════════════════════════════════════════
  const orangeLightPos = new THREE.Vector3(200, 80, 100);
  const cyanLightPos = new THREE.Vector3(-180, -60, 80);

  // Visual light helpers — small bright points for the lights themselves
  const lightDotGeo = new THREE.SphereGeometry(4, 8, 8);
  const orangeLightDot = new THREE.Mesh(lightDotGeo,
    new THREE.MeshBasicMaterial({ color: 0xff6b2b, transparent: true, opacity: 0.6 })
  );
  const cyanLightDot = new THREE.Mesh(lightDotGeo,
    new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.5 })
  );
  scene.add(orangeLightDot);
  scene.add(cyanLightDot);

  // ══════════════════════════════════════════
  // PARTICLE GALAXY
  // ══════════════════════════════════════════
  const COUNT = 1500;
  const pGeo = new THREE.BufferGeometry();
  const pPos  = new Float32Array(COUNT * 3);
  const pCol  = new Float32Array(COUNT * 3);
  const pSize = new Float32Array(COUNT);

  const PALETTE = [
    [1.0, 0.42, 0.17],   // orange
    [0.05, 0.64, 0.91],  // cyan
    [0.38, 0.40, 0.95],  // indigo
    [0.90, 0.88, 0.85],  // cool white/star
  ];

  for (let i = 0; i < COUNT; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 1000;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 680;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 500;
    pSize[i] = Math.random() * 3.8 + 0.7;
    const r = Math.random();
    const p = r < 0.36 ? PALETTE[0] : r < 0.62 ? PALETTE[1] : r < 0.80 ? PALETTE[2] : PALETTE[3];
    pCol[i * 3] = p[0]; pCol[i * 3 + 1] = p[1]; pCol[i * 3 + 2] = p[2];
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('aColor',   new THREE.BufferAttribute(pCol, 3));
  pGeo.setAttribute('aSize',    new THREE.BufferAttribute(pSize, 1));

  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:        { value: 0 },
      uLightOrange: { value: orangeLightPos },
      uLightCyan:   { value: cyanLightPos },
    },
    vertexShader:   PARTICLE_VERT,
    fragmentShader: PARTICLE_FRAG,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(pGeo, particleMat);
  scene.add(particles);

  // ══════════════════════════════════════════
  // CONSTELLATION NODE NETWORK
  // ══════════════════════════════════════════
  const NODE_COUNT = 58;
  const nodePos = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePos.push(new THREE.Vector3(
      (Math.random() - 0.5) * 600,
      (Math.random() - 0.5) * 400,
      (Math.random() - 0.5) * 200 - 60
    ));
  }

  const nGeo = new THREE.BufferGeometry().setFromPoints(nodePos);
  const nMat = new THREE.PointsMaterial({ color: 0x0ea5e9, size: 2.8, transparent: true, opacity: 0.38, sizeAttenuation: true });
  const nodeDots = new THREE.Points(nGeo, nMat);
  scene.add(nodeDots);

  const lineVerts = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    for (let j = i + 1; j < NODE_COUNT; j++) {
      if (nodePos[i].distanceTo(nodePos[j]) < 210) {
        lineVerts.push(nodePos[i], nodePos[j]);
      }
    }
  }
  const lGeo = new THREE.BufferGeometry().setFromPoints(lineVerts);
  const lMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.048 });
  const constLines = new THREE.LineSegments(lGeo, lMat);
  scene.add(constLines);

  // ══════════════════════════════════════════
  // WIREFRAME ICOSAHEDRON — breathing shader
  // ══════════════════════════════════════════
  const icoGeo = new THREE.IcosahedronGeometry(108, 2);
  const icoMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(0xff6b2b) },
      uBase:  { value: 0.058 },
      uPhase: { value: 0.0 },
    },
    vertexShader: WIRE_VERT, fragmentShader: WIRE_FRAG,
    wireframe: true, transparent: true, depthWrite: false,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // INNER SPHERE — breathing shader, different phase
  const sGeo = new THREE.SphereGeometry(64, 22, 22);
  const sMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(0x6366f1) },
      uBase:  { value: 0.042 },
      uPhase: { value: Math.PI },
    },
    vertexShader: WIRE_VERT, fragmentShader: WIRE_FRAG,
    wireframe: true, transparent: true, depthWrite: false,
  });
  const sphere = new THREE.Mesh(sGeo, sMat);
  scene.add(sphere);

  // ══════════════════════════════════════════
  // TORUS RINGS — 3 orbital planes
  // ══════════════════════════════════════════
  const TORI = [
    { r: 138, tube: 1.0, col: 0x0ea5e9, op: 0.10, rx: Math.PI / 3,   rz: 0 },
    { r: 172, tube: 0.6, col: 0xff6b2b, op: 0.065, rx: -Math.PI/4.5, rz: Math.PI/6 },
    { r: 208, tube: 0.4, col: 0x6366f1, op: 0.042, rx: Math.PI/7,    rz: Math.PI/3 },
  ];
  const tori = TORI.map(c => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(c.r, c.tube, 8, 120),
      new THREE.MeshBasicMaterial({ color: c.col, transparent: true, opacity: c.op })
    );
    m.rotation.x = c.rx; m.rotation.z = c.rz;
    scene.add(m);
    return m;
  });

  // ══════════════════════════════════════════
  // MOUSE PARALLAX
  // ══════════════════════════════════════════
  let tX = 0, tY = 0, cX = 0, cY = 0;
  document.addEventListener('mousemove', e => {
    tX = (e.clientX / window.innerWidth  - 0.5) * 80;
    tY = -(e.clientY / window.innerHeight - 0.5) * 55;
  });

  // ══════════════════════════════════════════
  // RENDER LOOP
  // ══════════════════════════════════════════
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    // ── Update orbiting light positions ──
    orangeLightPos.set(
      Math.cos(t * 0.28) * 210,
      Math.sin(t * 0.22) * 110,
      Math.sin(t * 0.35) * 150
    );
    cyanLightPos.set(
      Math.cos(t * 0.22 + Math.PI) * 190,
      Math.cos(t * 0.30) * 90,
      Math.sin(t * 0.26 + 1.2) * 130
    );
    orangeLightDot.position.copy(orangeLightPos);
    cyanLightDot.position.copy(cyanLightPos);

    // ── Update uniforms ──
    particleMat.uniforms.uTime.value        = t;
    particleMat.uniforms.uLightOrange.value = orangeLightPos;
    particleMat.uniforms.uLightCyan.value   = cyanLightPos;
    icoMat.uniforms.uTime.value             = t;
    sMat.uniforms.uTime.value               = t;

    // ── Rotations ──
    particles.rotation.y += 0.00014;
    particles.rotation.x += 0.00006;

    ico.rotation.y = t * 0.088;
    ico.rotation.x = t * 0.052;

    sphere.rotation.y = -t * 0.078;
    sphere.rotation.z =  t * 0.042;

    tori[0].rotation.y =  t * 0.068;
    tori[0].rotation.z =  t * 0.022;
    tori[1].rotation.y = -t * 0.052;
    tori[1].rotation.x += 0.00032;
    tori[2].rotation.y =  t * 0.038;
    tori[2].rotation.z = -t * 0.028;

    nodeDots.rotation.y   = t * 0.022;
    constLines.rotation.y = t * 0.022;

    // ── Camera parallax ──
    cX += (tX - cX) * 0.036;
    cY += (tY - cY) * 0.036;
    camera.position.x = cX;
    camera.position.y = cY;
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
