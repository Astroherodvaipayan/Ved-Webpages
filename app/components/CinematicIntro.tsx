"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import "./CinematicIntro.css"; // Import the strict CSS

interface CinematicIntroProps {
    onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        class ParticleSystem {
            container: HTMLCanvasElement;
            width: number;
            height: number;
            renderer: THREE.WebGLRenderer;
            scene: THREE.Scene;
            camera: THREE.PerspectiveCamera;
            mouse: THREE.Vector2;
            points: THREE.Points | null = null;
            material: THREE.ShaderMaterial | null = null;
            animationId: number = 0;

            constructor(canvas: HTMLCanvasElement) {
                this.container = canvas;
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.container,
                    antialias: true,
                    alpha: true,
                });

                this.renderer.setSize(this.width, this.height);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Optimized cap

                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 10000);
                this.camera.position.z = 1200;

                this.mouse = new THREE.Vector2(-10, -10);

                this.init();

                this.onResize = this.onResize.bind(this);
                this.onMouseMove = this.onMouseMove.bind(this);

                window.addEventListener("resize", this.onResize);
                window.addEventListener("mousemove", this.onMouseMove);
            }

            onMouseMove(event: MouseEvent) {
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }

            onResize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.camera.aspect = this.width / this.height;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.width, this.height);
            }

            async init() {
                this.setupParticleSystem();
                this.startCinematicSequence();
                this.render(0);
            }

            setupParticleSystem() {
                const text = "VED AI";
                const scale = 0.5;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                canvas.width = 1800 * scale;
                canvas.height = 1000 * scale;

                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = `italic 900 ${300 * scale}px Montserrat`;
                ctx.fillText(text, canvas.width / 2, canvas.height / 2);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const textPositions = [];
                const step = 2; // Optimal density

                for (let y = 0; y < canvas.height; y += step) {
                    for (let x = 0; x < canvas.width; x += step) {
                        const index = (y * canvas.width + x) * 4;
                        if (pixels[index + 3] > 128) {
                            textPositions.push(
                                (x - canvas.width / 2) * (1 / scale),
                                -(y - canvas.height / 2) * (1 / scale),
                                0
                            );
                        }
                    }
                }

                const numParticles = textPositions.length / 3;
                const geometry = new THREE.InstancedBufferGeometry();

                // Base quad
                const vertices = new Float32Array([-1.5, 1.5, 0, 1.5, 1.5, 0, -1.5, -1.5, 0, 1.5, -1.5, 0]);
                geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
                geometry.setIndex([0, 2, 1, 2, 3, 1]);

                // Attributes
                geometry.setAttribute("posText", new THREE.InstancedBufferAttribute(new Float32Array(textPositions), 3));

                const posScattered = new Float32Array(numParticles * 3);
                const posBall = new Float32Array(numParticles * 3);
                const randoms = new Float32Array(numParticles);
                const velocities = new Float32Array(numParticles * 3);

                for (let i = 0; i < numParticles; i++) {
                    // Scattered (initial)
                    posScattered[i * 3 + 0] = (Math.random() - 0.5) * 4000;
                    posScattered[i * 3 + 1] = (Math.random() - 0.5) * 4000;
                    posScattered[i * 3 + 2] = (Math.random() - 0.5) * 4000;

                    // Ball (Organic Star Cluster) - Gaussian distribution for realism
                    const u = Math.random();
                    const v = Math.random();
                    const theta = 2 * Math.PI * u;
                    const phi = Math.acos(2 * v - 1);
                    // Power function concentrates stars in center (Nebula look)
                    const r = 28 * Math.pow(Math.random(), 3.0);

                    // Add slight irregularity/ellipsoid shape
                    posBall[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta); // X
                    posBall[i * 3 + 1] = (r * 0.9) * Math.sin(phi) * Math.sin(theta); // Y (slightly squashed)
                    posBall[i * 3 + 2] = (r * 0.8) * Math.cos(phi); // Z (depth squashed)

                    randoms[i] = Math.random();

                    // Explosion direction (more forceful)
                    const dirX = (Math.random() - 0.5);
                    const dirY = (Math.random() - 0.5);
                    const dirZ = (Math.random() - 0.5);
                    const mag = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
                    velocities[i * 3 + 0] = (dirX / mag) * (1.0 + Math.random());
                    velocities[i * 3 + 1] = (dirY / mag) * (1.0 + Math.random());
                    velocities[i * 3 + 2] = (dirZ / mag) * (1.0 + Math.random());
                }

                geometry.setAttribute("posScattered", new THREE.InstancedBufferAttribute(posScattered, 3));
                geometry.setAttribute("posBall", new THREE.InstancedBufferAttribute(posBall, 3));
                geometry.setAttribute("random", new THREE.InstancedBufferAttribute(randoms, 1));
                geometry.setAttribute("velocity", new THREE.InstancedBufferAttribute(velocities, 3));

                const vertexShader = `
            attribute vec3 posText;
            attribute vec3 posScattered;
            attribute vec3 posBall;
            attribute vec3 velocity;
            attribute float random;
            
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uState; // 0:Scattered, 1:Text, 2:Ball, 3:FinalScattered
            uniform float uTransition; 
            uniform float uExplosionTime;

            varying float vRandom;
            varying float vAlpha;
            uniform float uOpacity;
            uniform float uTintMix;

            void main() {
                vRandom = random;

                vec3 targetPos;
                
                if (uState < 0.5) { // Phase 1: Scattered -> Text
                    targetPos = mix(posScattered, posText, uTransition);
                } else if (uState < 1.5) { // Phase 2: Text -> Ball
                    targetPos = mix(posText, posBall, uTransition);
                } else { // Phase 3: Ball -> Interactive Stars
                    // Explosion happens from uExplosionTime
                    targetPos = posBall + (velocity * uExplosionTime * 3000.0);
                    
                    // Mouse interaction
                    vec3 worldPos = targetPos;
                    float dist = distance(uMouse, worldPos.xy);
                    float radius = 200.0;
                    if (dist < radius) {
                        float force = (1.0 - dist / radius);
                        worldPos.z += force * 200.0 * (random + 0.5);
                        worldPos.xy += (worldPos.xy - uMouse) * force * 0.8;
                    }
                    targetPos = worldPos;
                }

                // Global floaty movement
                targetPos.x += sin(uTime * 0.4 + random * 15.0) * 10.0;
                targetPos.y += cos(uTime * 0.3 + random * 15.0) * 10.0;
                targetPos.z += sin(uTime * 0.2 + random * 15.0) * 10.0;

                vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Stars look - larger when exploded (uState >= 2)
                float baseSize = mix(1.0, 2.5, step(1.5, uState)); 
                
                // Varied sizes based on random attribute (Realism)
                if (uState > 1.5 && uState < 2.5) {
                   // Cluster phase: varied sizes
                   gl_PointSize = (baseSize + random * 4.0) * (1300.0 / -mvPosition.z);
                } else {
                   gl_PointSize = (baseSize + random * 3.5) * (1300.0 / -mvPosition.z);
                }

                // Fade alpha based on opacity
                vAlpha = uOpacity * (0.5 + 0.5 * random);
            }
        `;

                const fragmentShader = `
            varying float vRandom;
            varying float vAlpha;
            uniform float uOpacity; 
            uniform float uTintMix;
            uniform float uTime; 

            void main() {
                // Circular particle
                vec2 coord = gl_PointCoord - vec2(0.5);
                float dist = length(coord);
                if (dist > 0.5) discard;

                // Soft glow edge
                float strength = 1.0 - (dist * 2.0);
                strength = pow(strength, 1.5); // Soft falloff

                // Twinkle Effect (organic pulse)
                float twinkle = 0.7 + 0.3 * sin(uTime * 3.0 + vRandom * 10.0);

                // Cosmic Color: Mix Cool White with subtle Gold/Blue hints
                vec3 finalColor = mix(vec3(0.9, 0.95, 1.0), vec3(1.0, 0.9, 0.7), vRandom * 0.3);
                
                // Mix with tint (if any)
                finalColor = mix(finalColor, vec3(1.0, 0.8, 0.4), uTintMix);

                gl_FragColor = vec4(finalColor, vAlpha * strength * twinkle);
            }
        `;

                this.material = new THREE.ShaderMaterial({
                    vertexShader,
                    fragmentShader,
                    transparent: true,
                    depthTest: false,
                    uniforms: {
                        uTime: { value: 0 },
                        uMouse: { value: new THREE.Vector2(-5000, -5000) },
                        uState: { value: 0 },
                        uTransition: { value: 0 },
                        uExplosionTime: { value: 0 },
                        uOpacity: { value: 1 },
                        uTintMix: { value: 0 },
                    },
                });

                this.points = new THREE.Points(geometry, this.material);
                this.scene.add(this.points);
            }

            startCinematicSequence() {
                const tl = gsap.timeline({
                    onComplete: () => {
                        // Logic when sequence ends? 
                        // Ideally we trigger onComplete in the middle of flash
                    }
                });

                // Phase 1: Stars gathering into VED AI dots
                tl.to(this.material!.uniforms.uTransition, { value: 1, duration: 2.8, ease: "power2.inOut" });

                // Brief hold before contraction
                tl.to({}, { duration: 0.4 });

                // Phase 2: Contract from letters into lotus core
                tl.add(() => {
                    this.material!.uniforms.uState.value = 1;
                    this.material!.uniforms.uTransition.value = 0;
                });

                tl.to(this.material!.uniforms.uTransition, { value: 1, duration: 1.2, ease: "expo.in" });

                // Fade stars as they cluster for subtle transition
                tl.to(this.material!.uniforms.uOpacity, { value: 0.3, duration: 1.0, ease: "power2.in" }, "<");

                // Don't fade to black, keep them white/glowing
                tl.to(this.material!.uniforms.uTintMix, { value: 0, duration: 1.2, ease: "power2.in" }, "<0.2");

                // Show divine halo EARLY - before lotus container appears
                tl.add(() => {
                    const halo = document.getElementById("lotus-halo");
                    if (halo) {
                        halo.classList.remove("active", "active-zoom");
                        void halo.offsetWidth;
                        halo.classList.add("active");
                    }
                }, "<0.5");

                // Keep opacity low so they form a subtle "core"
                tl.to(this.material!.uniforms.uOpacity, { value: 0.2, duration: 0.6, ease: "power1.out" });

                // Reveal lotus container
                tl.set("#logo-container", { opacity: 0 });
                tl.to("#logo-container", { opacity: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.2");

                // 2. OPEN THE LOTUS
                tl.add(() => {
                    const cam = document.getElementById("lotus-camera");
                    if (cam) {
                        cam.style.willChange = "transform";
                        cam.classList.add("to-top");
                    }
                }, "+=0.1");

                // 3. ZOOM + BLAST
                tl.to({}, { duration: 1.0 });
                tl.add("startZoom");

                tl.add(() => {
                    const cam = document.getElementById("lotus-camera");
                    const halo = document.getElementById("lotus-halo");
                    if (cam) cam.classList.add("zoom");
                    if (halo) {
                        halo.classList.remove("active", "active-zoom");
                        void halo.offsetWidth;
                        halo.classList.add("active-zoom");
                    }

                    // Switch particle state
                    this.material!.uniforms.uState.value = 2;
                    this.material!.uniforms.uOpacity.value = 1;
                    this.material!.uniforms.uTintMix.value = 0;
                }, "startZoom");

                // Flash Overlay - Expanding Circle Transition
                tl.to("#flash-overlay", {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onStart: () => {
                        // Maybe notify parent here?
                    },
                    onComplete: () => {
                        // The flash is fully white/gold covering screen.
                        // THIS is where we switch to the landing page.
                        onComplete();
                    }
                }, "+=1.5");

                // Explode stars concurrent with Zoom
                tl.to(this.material!.uniforms.uExplosionTime, { value: 1, duration: 2.5, ease: "power3.out" }, "startZoom");
            }

            render(time: number) {
                this.animationId = requestAnimationFrame(this.render.bind(this));

                if (this.material) {
                    this.material.uniforms.uTime.value = time * 0.001;

                    if (this.material.uniforms.uState.value >= 2) {
                        const targetX = this.mouse.x * (this.width / 2);
                        const targetY = this.mouse.y * (this.height / 2);
                        this.material.uniforms.uMouse.value.x += (targetX - this.material.uniforms.uMouse.value.x) * 0.15;
                        this.material.uniforms.uMouse.value.y += (targetY - this.material.uniforms.uMouse.value.y) * 0.15;
                    }
                }

                this.renderer.render(this.scene, this.camera);
            }

            dispose() {
                cancelAnimationFrame(this.animationId);
                window.removeEventListener("resize", this.onResize);
                window.removeEventListener("mousemove", this.onMouseMove);
                this.renderer.dispose();
            }
        }

        const system = new ParticleSystem(canvasRef.current);

        return () => {
            system.dispose();
        };
    }, [onComplete]);

    // Copying EXACT HTML structure from index.html (excluding scripts/preloader)
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "black" }}>
            <canvas ref={canvasRef} id="main-canvas" />

            {/* Brand Logo Overlay (Now 3D CSS Lotus) */}
            <div id="logo-container">
                <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                        <radialGradient id="grad-outer" cx="50%" cy="100%" r="90%">
                            <stop offset="0%" stopColor="#e8d5c4" />
                            <stop offset="20%" stopColor="#fff0e6" />
                            <stop offset="40%" stopColor="#ffdee9" />
                            <stop offset="75%" stopColor="#ffb7ce" />
                            <stop offset="100%" stopColor="#ff9eb5" />
                        </radialGradient>

                        <radialGradient id="grad-mid" cx="50%" cy="100%" r="90%">
                            <stop offset="0%" stopColor="#d4b8a8" />
                            <stop offset="15%" stopColor="#ffe8d5" />
                            <stop offset="50%" stopColor="#ffc6df" />
                            <stop offset="100%" stopColor="#fc6c9e" />
                        </radialGradient>

                        <radialGradient id="grad-inner" cx="50%" cy="100%" r="80%">
                            <stop offset="0%" stopColor="#c8a090" />
                            <stop offset="10%" stopColor="#fff5e8" />
                            <stop offset="50%" stopColor="#ffacc9" />
                            <stop offset="100%" stopColor="#ff5e92" />
                        </radialGradient>

                        <linearGradient id="grad-vein" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="10%" stopColor="rgba(180, 40, 90, 0.5)" />
                            <stop offset="90%" stopColor="rgba(180, 40, 90, 0)" />
                        </linearGradient>

                        <radialGradient id="grad-stamen" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fff9e6" />
                            <stop offset="40%" stopColor="#ffe680" />
                            <stop offset="100%" stopColor="#ffcc00" />
                        </radialGradient>
                        <radialGradient id="grad-stamen-inner" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffeb99" />
                            <stop offset="100%" stopColor="#ff9900" />
                        </radialGradient>
                    </defs>
                </svg>

                <div className="lotus-halo" id="lotus-halo"></div>

                <div className="camera" id="lotus-camera">
                    <div className="scene">
                        {/* FAT OUTER LAYER (Layer 0) */}
                        <div className="lotus layer0">
                            <ul>
                                {/* 12 petals */}
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <li key={i}>
                                        <svg viewBox="0 0 100 220">
                                            <path className="petal-shadow" d="M50,220 C20,200 0,150 0,100 C0,40 35,0 50,0 C65,0 100,40 100,100 C100,150 80,200 50,220 Z" />
                                            <path className="petal-main" d="M50,220 C20,200 0,150 0,100 C0,40 35,0 50,0 C65,0 100,40 100,100 C100,150 80,200 50,220 Z" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* LAYER 1 */}
                        <div className="lotus layer1">
                            <ul>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <li key={i}>
                                        <svg viewBox="0 0 100 220">
                                            <path className="petal-shadow" d="M50,215 C25,190 5,140 5,90 C5,35 35,0 50,0 C65,0 95,35 95,90 C95,140 75,190 50,215 Z" />
                                            <path className="petal-main" d="M50,215 C25,190 5,140 5,90 C5,35 35,0 50,0 C65,0 95,35 95,90 C95,140 75,190 50,215 Z" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* LAYER 2 */}
                        <div className="lotus layer2">
                            <ul>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <li key={i}>
                                        <svg viewBox="0 0 100 220">
                                            <path className="petal-shadow" d="M50,210 C30,180 10,130 10,80 C10,30 38,0 50,0 C62,0 90,30 90,80 C90,130 70,180 50,210 Z" />
                                            <path className="petal-main" d="M50,210 C30,180 10,130 10,80 C10,30 38,0 50,0 C62,0 90,30 90,80 C90,130 70,180 50,210 Z" />
                                            {/* Subtle Veins */}
                                            <path className="petal-veins" d="M50,10 Q50,80 50,150 M50,10 Q30,60 20,100 M50,10 Q70,60 80,100" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* LAYER 3 */}
                        <div className="lotus layer3">
                            <ul>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <li key={i}>
                                        <svg viewBox="0 0 100 220">
                                            <path className="petal-shadow" d="M50,200 C35,170 20,120 20,70 C20,25 40,0 50,0 C60,0 80,25 80,70 C80,120 65,170 50,200 Z" />
                                            <path className="petal-main" d="M50,200 C35,170 20,120 20,70 C20,25 40,0 50,0 C60,0 80,25 80,70 C80,120 65,170 50,200 Z" />
                                            {/* Subtle Veins */}
                                            <path className="petal-veins" d="M50,0 Q50,60 50,120 M50,0 Q35,50 30,90 M50,0 Q65,50 70,90" />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div id="flash-overlay"></div>
        </div>
    );
}
