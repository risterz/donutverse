import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCw, ShoppingBag } from 'lucide-react';
import { DONUTS, formatMYR, type DonutProduct } from '../data/donuts';
import { useCart } from '../context/CartContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_FLAVORS: DonutProduct[] = [
  DONUTS[0], // Strawberry Dream
  DONUTS[1], // Belgian Chocolate Bliss
  DONUTS[2], // Matcha Cloud
  DONUTS[5], // Raspberry Velvet
];

// Deterministic PRNG for consistent sprinkle placement
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function createBriocheTextures(): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const width = 512;
  const height = 512;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bctx = bumpCanvas.getContext('2d')!;

  // Base golden-brown gradient with authentic lighter pale-gold fry ring around equator (v ~ 0 and v ~ 0.5)
  const grad = cctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0.0, '#F1D4A7'); // outer equator fry band
  grad.addColorStop(0.09, '#D89748');
  grad.addColorStop(0.25, '#BC722B'); // rich toasted top crown
  grad.addColorStop(0.41, '#D89748');
  grad.addColorStop(0.5, '#F0D2A2'); // inner equator fry band
  grad.addColorStop(0.6, '#D59245');
  grad.addColorStop(0.75, '#B46924'); // toasted bottom
  grad.addColorStop(0.91, '#D89748');
  grad.addColorStop(1.0, '#F1D4A7');
  cctx.fillStyle = grad;
  cctx.fillRect(0, 0, width, height);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, width, height);

  // Fine baked brioche crumb grain
  const rand = seededRandom(4207);
  for (let i = 0; i < 6500; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = 0.7 + rand() * 2.1;
    const dark = rand() > 0.45;
    cctx.fillStyle = dark
      ? `rgba(128, 66, 20, ${0.04 + rand() * 0.08})`
      : `rgba(255, 232, 195, ${0.04 + rand() * 0.07})`;
    cctx.beginPath();
    cctx.arc(x, y, r, 0, Math.PI * 2);
    cctx.fill();

    const bumpVal = dark ? 105 : 152;
    bctx.fillStyle = `rgba(${bumpVal}, ${bumpVal}, ${bumpVal}, 0.28)`;
    bctx.beginPath();
    bctx.arc(x, y, r * 1.1, 0, Math.PI * 2);
    bctx.fill();
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

function createDoughGeometry(majorR: number, tubeR: number): THREE.BufferGeometry {
  const uSegs = 112;
  const vSegs = 64;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegs; j++) {
    const vRatio = j / vSegs;
    const v = vRatio * Math.PI * 2;
    const cosV = Math.cos(v);
    const sinV = Math.sin(v);

    for (let i = 0; i <= uSegs; i++) {
      const uRatio = i / uSegs;
      const u = uRatio * Math.PI * 2;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      // Subtle organic artisan puffiness so it feels hand-proofed, not geometric
      const organic =
        1 +
        0.022 * Math.sin(u * 3 + 0.6) +
        0.014 * Math.cos(u * 5 - v * 2) +
        0.01 * Math.sin(v * 3);
      const r = tubeR * organic;
      // Slightly plumper pillow profile (squashed vertically a bit like real brioche)
      const x = (majorR + r * cosV) * cosU;
      const y = r * sinV * 0.88;
      const z = (majorR + r * cosV) * sinU;

      positions.push(x, y, z);
      uvs.push(uRatio * 2, vRatio);
    }
  }

  for (let j = 0; j < vSegs; j++) {
    for (let i = 0; i < uSegs; i++) {
      const a = j * (uSegs + 1) + i;
      const b = a + uSegs + 1;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function createGlazeGeometry(majorR: number, tubeR: number): THREE.BufferGeometry {
  const uSegs = 128;
  const vSegs = 48;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let j = 0; j <= vSegs; j++) {
    const t = j / vSegs; // 0 = outer drip rim, 0.5 = crown, 1 = inner drip rim
    for (let i = 0; i <= uSegs; i++) {
      const u = (i / uSegs) * Math.PI * 2;
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      // Organic wavy glaze drips around outer & inner rim
      const outerDrip =
        -0.14 +
        0.19 * Math.sin(u * 7 + 0.4) +
        0.11 * Math.cos(u * 11 - 0.8) +
        0.06 * Math.sin(u * 17);
      const innerDrip =
        Math.PI +
        0.08 +
        0.13 * Math.cos(u * 6 + 1.1) +
        0.08 * Math.sin(u * 13);

      const v = THREE.MathUtils.lerp(outerDrip, innerDrip, t);
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);

      const organic =
        1 +
        0.022 * Math.sin(u * 3 + 0.6) +
        0.014 * Math.cos(u * 5 - v * 2) +
        0.01 * Math.sin(v * 3);

      // Smooth rounded thickness bead at the glaze edges so it looks thickly dipped
      const edgeFade = Math.sin(t * Math.PI);
      const thickness = 0.008 + 0.038 * Math.pow(edgeFade, 0.42);
      const r = tubeR * organic + thickness;

      const x = (majorR + r * cosV) * cosU;
      const y = r * sinV * 0.88 + 0.012 * edgeFade;
      const z = (majorR + r * cosV) * sinU;

      positions.push(x, y, z);
    }
  }

  for (let j = 0; j < vSegs; j++) {
    for (let i = 0; i < uSegs; i++) {
      const a = j * (uSegs + 1) + i;
      const b = a + uSegs + 1;
      const c = b + 1;
      const d = a + 1;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

interface ProceduralDonutProps {
  glazeHex: string;
  sprinklePalette: string[];
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}

function ProceduralDonut({
  glazeHex,
  sprinklePalette,
  pointerRef,
  reducedMotion,
}: ProceduralDonutProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sprinklesRef = useRef<THREE.InstancedMesh>(null);
  const majorR = 1.15;
  const tubeR = 0.56;

  const { doughGeo, glazeGeo, doughTextures } = useMemo(() => {
    return {
      doughGeo: createDoughGeometry(majorR, tubeR),
      glazeGeo: createGlazeGeometry(majorR, tubeR),
      doughTextures: createBriocheTextures(),
    };
  }, []);

  useEffect(() => {
    return () => {
      doughGeo.dispose();
      glazeGeo.dispose();
      doughTextures.map.dispose();
      doughTextures.bumpMap.dispose();
    };
  }, [doughGeo, glazeGeo, doughTextures]);

  const sprinkleTransforms = useMemo(() => {
    const count = 138;
    const rand = seededRandom(9913);
    const items: {
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
      scale: THREE.Vector3;
      colorIdx: number;
    }[] = [];

    const up = new THREE.Vector3(0, 1, 0);

    for (let k = 0; k < count; k++) {
      const u = (k / count) * Math.PI * 2 + (rand() - 0.5) * 0.18;
      // Concentrate along the top crown of the glaze
      const v = 0.34 + rand() * (Math.PI - 0.68);
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);

      const organic =
        1 +
        0.022 * Math.sin(u * 3 + 0.6) +
        0.014 * Math.cos(u * 5 - v * 2) +
        0.01 * Math.sin(v * 3);
      const r = tubeR * organic + 0.049;

      const position = new THREE.Vector3(
        (majorR + r * cosV) * cosU,
        r * sinV * 0.88 + 0.011,
        (majorR + r * cosV) * sinU,
      );

      // Approximate outward surface normal
      const normal = new THREE.Vector3(cosV * cosU, sinV / 0.88, cosV * sinU).normalize();

      // Lay capsule flat along tangent plane with random yaw
      const tangent = new THREE.Vector3(-sinU, 0, cosU).normalize();
      const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
      const yaw = rand() * Math.PI * 2;
      const dir = tangent
        .clone()
        .multiplyScalar(Math.cos(yaw))
        .add(bitangent.clone().multiplyScalar(Math.sin(yaw)))
        .normalize();

      const quaternion = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const lenScale = 0.85 + rand() * 0.45;
      const scale = new THREE.Vector3(1, lenScale, 1);

      items.push({
        position,
        quaternion,
        scale,
        colorIdx: Math.floor(rand() * 12),
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const mesh = sprinklesRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    sprinkleTransforms.forEach((item, idx) => {
      dummy.position.copy(item.position);
      dummy.quaternion.copy(item.quaternion);
      dummy.scale.copy(item.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);

      const hex = sprinklePalette[item.colorIdx % sprinklePalette.length];
      color.set(hex);
      mesh.setColorAt(idx, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [sprinkleTransforms, sprinklePalette]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const targetRotX = 0.58 + pointerRef.current.y * 0.34;
    const targetRotZ = -pointerRef.current.x * 0.22;

    if (!reducedMotion) {
      groupRef.current.rotation.y += delta * 0.36;
      groupRef.current.position.y = Math.sin(t * 1.45) * 0.08;
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.06,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      0.06,
    );
  });

  return (
    <group ref={groupRef} rotation={[0.58, 0.3, 0]} scale={1.14}>
      {/* Golden-brown baked brioche dough */}
      <mesh geometry={doughGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={doughTextures.map}
          bumpMap={doughTextures.bumpMap}
          bumpScale={0.025}
          roughness={0.74}
          metalness={0.02}
        />
      </mesh>

      {/* Glossy draped glaze */}
      <mesh geometry={glazeGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={glazeHex}
          roughness={0.14}
          metalness={0.02}
          clearcoat={1}
          clearcoatRoughness={0.06}
          reflectivity={0.92}
        />
      </mesh>

      {/* Surface-aligned instanced sprinkles */}
      <instancedMesh
        ref={sprinklesRef}
        args={[undefined, undefined, sprinkleTransforms.length]}
        castShadow
      >
        <capsuleGeometry args={[0.023, 0.088, 6, 12]} />
        <meshPhysicalMaterial roughness={0.28} clearcoat={0.5} />
      </instancedMesh>
    </group>
  );
}

class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Gracefully fall back to studio photography if WebGL context cannot initialize.
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Donut3DSection() {
  const [activeFlavor, setActiveFlavor] = useState<DonutProduct>(SHOWCASE_FLAVORS[0]);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const prefersReduced = usePrefersReducedMotion();
  const { addItem } = useCart();

  useEffect(() => {
    if (prefersReduced || !sectionRef.current || !canvasWrapRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.experience-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        },
      });

      gsap.fromTo(
        canvasWrapRef.current,
        { scale: 0.92, y: 24 },
        {
          scale: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'center center',
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: 0, y: 0 };
  };

  const fallbackPhoto = (
    <div className="flex h-full w-full items-center justify-center p-8">
      <img
        src={activeFlavor.image}
        alt={activeFlavor.name}
        className="max-h-[380px] rounded-3xl object-cover shadow-elevated"
      />
    </div>
  );

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative overflow-hidden bg-cocoa-900 py-24 text-cream-100 sm:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        {/* Left Interactive 3D Stage */}
        <div
          ref={canvasWrapRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="relative lg:col-span-7"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.25rem] border border-cream-100/12 bg-[radial-gradient(circle_at_50%_40%,#4A261D_0%,#2A1510_68%,#1C0D0A_100%)] shadow-elevated sm:aspect-[16/12]">
            <WebGLErrorBoundary fallback={fallbackPhoto}>
              <Suspense fallback={fallbackPhoto}>
                <Canvas
                  shadows
                  dpr={[1, 2]}
                  camera={{ position: [0, 1.35, 4.35], fov: 38 }}
                  gl={{ antialias: true, alpha: true }}
                >
                  <ambientLight intensity={0.45} color="#FFF4E6" />
                  <directionalLight
                    position={[4, 6, 5]}
                    intensity={1.7}
                    color="#FFF8F0"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                  />
                  <directionalLight
                    position={[-4, 2, -3]}
                    intensity={0.85}
                    color="#F7C9D8"
                  />
                  <pointLight position={[0, -2.5, 2]} intensity={0.45} color="#E3A45B" />

                  <Environment resolution={256}>
                    <Lightformer
                      form="circle"
                      intensity={2.4}
                      position={[4, 5, 3]}
                      scale={4}
                      color="#FFF8F1"
                    />
                    <Lightformer
                      form="rect"
                      intensity={1.4}
                      position={[-5, 2, 2]}
                      scale={[4, 6, 1]}
                      color="#FCE4EC"
                    />
                    <Lightformer
                      form="ring"
                      intensity={1.1}
                      position={[0, 6, -4]}
                      scale={5}
                      color="#FFE5C8"
                    />
                  </Environment>

                  <ProceduralDonut
                    glazeHex={activeFlavor.glazeHex}
                    sprinklePalette={activeFlavor.sprinklePalette}
                    pointerRef={pointerRef}
                    reducedMotion={prefersReduced}
                  />

                  <ContactShadows
                    position={[0, -1.38, 0]}
                    opacity={0.55}
                    scale={6.5}
                    blur={2.4}
                    far={3}
                    color="#0E0503"
                  />

                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    rotateSpeed={0.65}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.85}
                  />
                </Canvas>
              </Suspense>
            </WebGLErrorBoundary>

            <div className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-cocoa-950/75 px-3.5 py-2 text-xs font-medium text-cream-200 ring-1 ring-cream-100/15">
              <RotateCw className="h-3.5 w-3.5 text-blush-200" aria-hidden="true" />
              <span>Drag to spin · Move cursor to tilt</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Spec & Live Glaze Switcher */}
        <div className="lg:col-span-5">
          <p className="experience-reveal text-xs font-bold uppercase tracking-[0.2em] text-blush-200">
            Interactive 3D Glaze Atelier
          </p>
          <h2 className="experience-reveal mt-3 font-display-soft text-4xl font-extrabold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl">
            Not Just a Donut.{' '}
            <span className="italic text-blush-200">It&apos;s an Experience.</span>
          </h2>
          <p className="experience-reveal mt-5 text-base leading-relaxed text-cream-200/85">
            Inspect every curve of our golden-brown brioche ring and glossy
            hand-dipped glaze in real time. Pick a glaze below to preview the
            sheen and sprinkle finish.
          </p>

          {/* Flavor Swatches */}
          <div className="experience-reveal mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-cream-200/70">
              Select Glaze Finish
            </p>
            <div
              role="radiogroup"
              aria-label="Choose 3D donut glaze flavor"
              className="mt-3 grid grid-cols-2 gap-3"
            >
              {SHOWCASE_FLAVORS.map((flavor) => {
                const isSelected = flavor.id === activeFlavor.id;
                return (
                  <button
                    key={flavor.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setActiveFlavor(flavor)}
                    className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all ${isSelected
                      ? 'border-blush-200 bg-cream-100/12 text-cream-50'
                      : 'border-cream-100/12 bg-cocoa-950/40 text-cream-200/80 hover:border-cream-100/30'
                      }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 rounded-full ring-2 ring-cream-50/40"
                      style={{ backgroundColor: flavor.glazeHex }}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {flavor.name}
                      </span>
                      <span className="block text-xs text-cream-200/70">
                        {formatMYR(flavor.price)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="experience-reveal mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => addItem(activeFlavor, 1)}
              className="inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-strawberry-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-strawberry-500 active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>
                Add {activeFlavor.name} ({formatMYR(activeFlavor.price)})
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
