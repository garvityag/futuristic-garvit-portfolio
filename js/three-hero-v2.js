// Three.js v2 — ACID GRID: wave-particle system + orbiting ring
// Palette: acid chartreuse (#C8FF00) + white on pure void black
window.addEventListener('load', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  function setSize() {
    const w = canvas.offsetWidth || window.innerWidth;
    const h = canvas.offsetHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    return { w, h };
  }
  let { w, h } = setSize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 2000);
  camera.position.z = 520;

  // ══════════════════════════════════════════
  // GLSL: Acid particle shader
  // Wave ripple + pulsation + acid/white split
  // ══════════════════════════════════════════
  const VERT = `
    attribute float aSize;
    attribute float aPhase;
    attribute float aAcid;
    uniform float uTime;
    varying float vAcid;
    varying float vAlpha;

    void main() {
      vec3 pos = position;

      // Two interfering sine waves for organic ripple
      float w1 = sin(pos.x * 0.0065 + uTime * 0.52 + aPhase) * 24.0;
      float w2 = cos(pos.y * 0.0082 + uTime * 0.38 + aPhase * 1.4) * 16.0;
      pos.z += w1 + w2;

      // Subtle drift
      pos.x += sin(uTime * 0.14 + aPhase * 0.6) * 2.2;
      pos.y += cos(uTime * 0.19 + aPhase)        * 1.6;

      vAcid = aAcid;

      vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
      float pulse = sin(uTime * 1.9 + aPhase) * 0.28 + 0.72;
      float sz = aSize * pulse * (310.0 / -mvPos.z);
      gl_PointSize = clamp(sz, 0.4, 18.0);
      gl_Position  = projectionMatrix * mvPos;
      vAlpha = 0.38 + pulse * 0.44;
    }
  `;

  const FRAG = `
    varying float vAcid;
    varying float vAlpha;

    void main() {
      vec2 uv = gl_PointCoord - vec2(0.5);
      float d = length(uv);
      if (d > 0.5) discard;

      float rim  = pow(1.0 - smoothstep(0.05, 0.5, d), 2.4);
      float core = exp(-d * 8.5) * 0.75;

      // Acid (#C8FF00) vs white
      vec3 acidCol  = vec3(0.784, 1.0, 0.0);
      vec3 whiteCol = vec3(1.0, 1.0, 1.0);
      vec3 col = mix(whiteCol, acidCol, vAcid);
      col += core * mix(vec3(0.85), acidCol, vAcid);

      gl_FragColor = vec4(col, rim * vAlpha);
    }
  `;

  // ══════════════════════════════════════════
  // PARTICLE GRID — 55×38 wave lattice
  // ══════════════════════════════════════════
  const COLS = 55, ROWS = 38;
  const GRID  = COLS * ROWS;
  const EXTRA = 1100;
  const TOTAL = GRID + EXTRA;

  const pPos   = new Float32Array(TOTAL * 3);
  const pSize  = new Float32Array(TOTAL);
  const pPhase = new Float32Array(TOTAL);
  const pAcid  = new Float32Array(TOTAL);

  const GW = 1340, GH = 880;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      pPos[i*3]     = (c / (COLS-1) - 0.5) * GW;
      pPos[i*3 + 1] = (r / (ROWS-1) - 0.5) * GH;
      pPos[i*3 + 2] = 0;
      pSize[i]  = Math.random() * 2.0 + 0.7;
      pPhase[i] = Math.random() * Math.PI * 2;
      pAcid[i]  = Math.random() < 0.17 ? 1.0 : 0.0;
    }
  }

  for (let i = GRID; i < TOTAL; i++) {
    pPos[i*3]     = (Math.random() - 0.5) * 1600;
    pPos[i*3 + 1] = (Math.random() - 0.5) * 1050;
    pPos[i*3 + 2] = (Math.random() - 0.5) * 650;
    pSize[i]  = Math.random() * 4.2 + 1.0;
    pPhase[i] = Math.random() * Math.PI * 2;
    pAcid[i]  = Math.random() < 0.32 ? 1.0 : 0.0;
  }

  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  gridGeo.setAttribute('aSize',    new THREE.BufferAttribute(pSize, 1));
  gridGeo.setAttribute('aPhase',   new THREE.BufferAttribute(pPhase, 1));
  gridGeo.setAttribute('aAcid',    new THREE.BufferAttribute(pAcid, 1));

  const gridMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(gridGeo, gridMat);
  scene.add(particles);

  // ══════════════════════════════════════════
  // GRID LINES — horizontal every 5th row + vertical every 9th col
  // ══════════════════════════════════════════
  const lineVerts = [];
  for (let r = 0; r < ROWS; r += 5) {
    for (let c = 0; c < COLS - 1; c++) {
      const i = r * COLS + c;
      const j = r * COLS + c + 1;
      lineVerts.push(pPos[i*3], pPos[i*3+1], pPos[i*3+2]);
      lineVerts.push(pPos[j*3], pPos[j*3+1], pPos[j*3+2]);
    }
  }
  for (let c = 0; c < COLS; c += 9) {
    for (let r = 0; r < ROWS - 1; r++) {
      const i =  r    * COLS + c;
      const j = (r+1) * COLS + c;
      lineVerts.push(pPos[i*3], pPos[i*3+1], pPos[i*3+2]);
      lineVerts.push(pPos[j*3], pPos[j*3+1], pPos[j*3+2]);
    }
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xc8ff00,
    transparent: true,
    opacity: 0.022,
    blending: THREE.AdditiveBlending,
  });
  const gridLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(gridLines);

  // ══════════════════════════════════════════
  // ORBITING RING — particles on elliptical orbit
  // ══════════════════════════════════════════
  const RING_N   = 320;
  const RING_R   = 360;
  const rPos   = new Float32Array(RING_N * 3);
  const rSize  = new Float32Array(RING_N);
  const rPhase = new Float32Array(RING_N);
  const rAcid  = new Float32Array(RING_N);

  for (let i = 0; i < RING_N; i++) {
    const angle  = (i / RING_N) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * 90;
    rPos[i*3]     = Math.cos(angle) * (RING_R + jitter);
    rPos[i*3 + 1] = Math.sin(angle) * (RING_R + jitter) * 0.35;
    rPos[i*3 + 2] = (Math.random() - 0.5) * 140;
    rSize[i]  = Math.random() * 3.5 + 0.9;
    rPhase[i] = Math.random() * Math.PI * 2;
    rAcid[i]  = i % 4 === 0 ? 1.0 : 0.0;
  }

  const ringGeo = new THREE.BufferGeometry();
  ringGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  ringGeo.setAttribute('aSize',    new THREE.BufferAttribute(rSize, 1));
  ringGeo.setAttribute('aPhase',   new THREE.BufferAttribute(rPhase, 1));
  ringGeo.setAttribute('aAcid',    new THREE.BufferAttribute(rAcid, 1));

  const ringMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const ring = new THREE.Points(ringGeo, ringMat);
  scene.add(ring);

  // ══════════════════════════════════════════
  // SECOND RING — tilted, opposite orbit
  // ══════════════════════════════════════════
  const RING2_N  = 180;
  const r2Pos   = new Float32Array(RING2_N * 3);
  const r2Size  = new Float32Array(RING2_N);
  const r2Phase = new Float32Array(RING2_N);
  const r2Acid  = new Float32Array(RING2_N);

  for (let i = 0; i < RING2_N; i++) {
    const angle = (i / RING2_N) * Math.PI * 2;
    const j2    = (Math.random() - 0.5) * 60;
    r2Pos[i*3]     = Math.cos(angle) * (240 + j2);
    r2Pos[i*3 + 1] = Math.sin(angle) * (240 + j2) * 0.55;
    r2Pos[i*3 + 2] = Math.sin(angle) * 80 + (Math.random() - 0.5) * 30;
    r2Size[i]  = Math.random() * 2.5 + 0.6;
    r2Phase[i] = Math.random() * Math.PI * 2;
    r2Acid[i]  = i % 5 === 0 ? 1.0 : 0.0;
  }

  const ring2Geo = new THREE.BufferGeometry();
  ring2Geo.setAttribute('position', new THREE.BufferAttribute(r2Pos, 3));
  ring2Geo.setAttribute('aSize',    new THREE.BufferAttribute(r2Size, 1));
  ring2Geo.setAttribute('aPhase',   new THREE.BufferAttribute(r2Phase, 1));
  ring2Geo.setAttribute('aAcid',    new THREE.BufferAttribute(r2Acid, 1));

  const ring2Mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const ring2 = new THREE.Points(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 4;
  ring2.rotation.z = Math.PI / 6;
  scene.add(ring2);

  // ══════════════════════════════════════════
  // MOUSE PARALLAX
  // ══════════════════════════════════════════
  let tX = 0, tY = 0, cX = 0, cY = 0;
  document.addEventListener('mousemove', e => {
    tX =  (e.clientX / window.innerWidth  - 0.5) * 72;
    tY = -(e.clientY / window.innerHeight - 0.5) * 48;
  });

  // ══════════════════════════════════════════
  // RENDER LOOP
  // ══════════════════════════════════════════
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;

    gridMat.uniforms.uTime.value  = t;
    ringMat.uniforms.uTime.value  = t;
    ring2Mat.uniforms.uTime.value = t;

    // Grid drifts slowly
    particles.rotation.y =  t * 0.013;
    particles.rotation.x =  t * 0.006;
    gridLines.rotation.y =  t * 0.013;
    gridLines.rotation.x =  t * 0.006;

    // Rings orbit in opposite directions
    ring.rotation.y  = -t * 0.038;
    ring.rotation.z  =  t * 0.012;
    ring2.rotation.y =  t * 0.055;
    ring2.rotation.x += 0.00022;

    // Camera parallax
    cX += (tX - cX) * 0.033;
    cY += (tY - cY) * 0.033;
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
