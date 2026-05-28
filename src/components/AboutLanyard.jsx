/* eslint-disable react/no-unknown-property */
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei";
import {
	BallCollider,
	CuboidCollider,
	Physics,
	RigidBody,
	useRopeJoint,
	useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import "./Lanyard.css";
import cardGLB from "../assets/lanyard/card.glb?url";
import lanyardTexture from "../assets/lanyard/lanyard.png";

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB_PATH = cardGLB;
const LANYARD_TEXTURE_PATH =
	typeof lanyardTexture === "string" ? lanyardTexture : lanyardTexture?.src;

export default function AboutLanyard({
	position = [0, 0, 20],
	gravity = [0, -40, 0],
	fov = 20,
	transparent = true,
}) {
	const [isMobile, setIsMobile] = useState(
		() => typeof window !== "undefined" && window.innerWidth < 768
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="lanyard-wrapper">
			<Canvas
				camera={{ position, fov }}
				dpr={[1, isMobile ? 1.5 : 2]}
				gl={{ alpha: transparent }}
				onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
			>
				<ambientLight intensity={Math.PI} />
				<Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
					<Band isMobile={isMobile} />
				</Physics>
				<Environment blur={0.75}>
					<Lightformer
						intensity={2}
						color="white"
						position={[0, -1, 5]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={3}
						color="white"
						position={[-1, -1, 1]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={3}
						color="white"
						position={[1, 1, 1]}
						rotation={[0, 0, Math.PI / 3]}
						scale={[100, 0.1, 1]}
					/>
					<Lightformer
						intensity={10}
						color="white"
						position={[-10, 0, 14]}
						rotation={[0, Math.PI / 2, Math.PI / 3]}
						scale={[100, 10, 1]}
					/>
				</Environment>
			</Canvas>
		</div>
	);
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
	const band = useRef();
	const fixed = useRef();
	const j1 = useRef();
	const j2 = useRef();
	const j3 = useRef();
	const card = useRef();
	const cursorElRef = useRef(null);
	const vec = new THREE.Vector3();
	const ang = new THREE.Vector3();
	const rot = new THREE.Vector3();
	const dir = new THREE.Vector3();
	const segmentProps = {
		type: "dynamic",
		canSleep: true,
		colliders: false,
		angularDamping: 4,
		linearDamping: 4,
	};
	const { nodes, materials } = useGLTF(CARD_GLB_PATH);
	const texture = useTexture(LANYARD_TEXTURE_PATH);
	const cardFaceTexture = useTexture(LANYARD_TEXTURE_PATH);
	const [curve] = useState(
		() =>
			new THREE.CatmullRomCurve3([
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
				new THREE.Vector3(),
			])
	);
	useEffect(() => {
		if (nodes.card.geometry) {
			const geometry = nodes.card.geometry;
			const uv = geometry.attributes.uv;
			
			// Get the bounding box to understand current UV layout
			const positions = geometry.attributes.position;
			geometry.computeBoundingBox();
			const bbox = geometry.boundingBox;
			
			// Recalculate UVs to show full texture
			for (let i = 0; i < uv.count; i++) {
				const x = positions.getX(i);
				const y = positions.getY(i);
				
				// Map position to 0-1 UV space
				const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x);
				const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y);
				
				uv.setXY(i, u, v);
			}
			
			uv.needsUpdate = true;
		}
	}, [nodes]);
	const [dragged, drag] = useState(false);
	const [hovered, hover] = useState(false);

	useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.55]);
	useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.55]);
	useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.55]);
	useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.5, 0]]);

	useEffect(() => {
		if (!hovered) return undefined;

		const cursorEl = document.createElement("div");
		cursorEl.className = "lanyard-cursor";
		document.body.appendChild(cursorEl);
		cursorElRef.current = cursorEl;
		document.body.style.cursor = "none";

		const handlePointerMove = (event) => {
			cursorEl.style.left = `${event.clientX}px`;
			cursorEl.style.top = `${event.clientY}px`;
		};

		window.addEventListener("pointermove", handlePointerMove);
		return () => {
			window.removeEventListener("pointermove", handlePointerMove);
			cursorEl.remove();
			cursorElRef.current = null;
			document.body.style.cursor = "auto";
		};
	}, [hovered]);

	useEffect(() => {
		if (!cursorElRef.current) return;
		cursorElRef.current.classList.toggle("lanyard-cursor--dragging", Boolean(dragged));
	}, [dragged]);

	useFrame((state, delta) => {
		if (dragged) {
			vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
			dir.copy(vec).sub(state.camera.position).normalize();
			vec.add(dir.multiplyScalar(state.camera.position.length()));
			[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
			card.current?.setNextKinematicTranslation({
				x: vec.x - dragged.x,
				y: vec.y - dragged.y,
				z: vec.z - dragged.z,
			});
		}
		if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
			[j1, j2].forEach((ref) => {
				if (!ref.current.lerped) {
					ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
				}
				const clampedDistance = Math.max(
					0.1,
					Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
				);
				ref.current.lerped.lerp(
					ref.current.translation(),
					delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
				);
			});
			curve.points[0].copy(j3.current.translation());
			curve.points[1].copy(j2.current.lerped);
			curve.points[2].copy(j1.current.lerped);
			curve.points[3].copy(fixed.current.translation());
			band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
			ang.copy(card.current.angvel());
			rot.copy(card.current.rotation());
			card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
		}
	});

	curve.curveType = "chordal";
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	cardFaceTexture.colorSpace = THREE.SRGBColorSpace;
	cardFaceTexture.flipY = true;

	// Set wrapping mode to clamp so the image doesn't repeat
	// cardFaceTexture.wrapS = THREE.ClampToEdgeWrapping;
	cardFaceTexture.wrapT = THREE.ClampToEdgeWrapping;

	// Don't scale or offset - show the full image as-is
	cardFaceTexture.repeat.set(1, 1);
	cardFaceTexture.offset.set(0, 0);

	cardFaceTexture.needsUpdate = true;

	return (
		<>
			<group position={[0, 3, 0]}>
				<RigidBody ref={fixed} {...segmentProps} type="fixed" />
				<RigidBody position={[0.35, 0, 0]} ref={j1} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody position={[0.7, 0, 0]} ref={j2} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody position={[1.05, 0, 0]} ref={j3} {...segmentProps}>
					<BallCollider args={[0.1]} />
				</RigidBody>
				<RigidBody
					position={[1.35, 0, 0]}
					ref={card}
					{...segmentProps}
					type={dragged ? "kinematicPosition" : "dynamic"}
				>
					<CuboidCollider args={[0.8, 1.125, 0.01]} />
					<group
						scale={3}
						position={[0, -1.2, -0.05]}
						onPointerOver={() => hover(true)}
						onPointerOut={() => hover(false)}
						onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
						onPointerDown={(e) => (
							e.target.setPointerCapture(e.pointerId),
							drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
						)}
					>
						<mesh geometry={nodes.card.geometry}>
						{/* <planeGeometry args={[1.0, 1.0]} /> */}
							<meshPhysicalMaterial
								map={cardFaceTexture}
								map-anisotropy={16}
								clearcoat={isMobile ? 0 : 1}
								clearcoatRoughness={0.15}
								roughness={0.9}
								metalness={0.8}
								// side={THREE.DoubleSide}
							/>
						</mesh>
						<mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
						<mesh geometry={nodes.clamp.geometry} material={materials.metal} />
					</group>
				</RigidBody>
			</group>
			<mesh ref={band}>
				<meshLineGeometry />
				<meshLineMaterial
					color="white"
					depthTest={false}
					resolution={isMobile ? [1000, 2000] : [1000, 1000]}
					useMap
					map={texture}
					repeat={[-4, 1]}
					lineWidth={1}
				/>
			</mesh>
		</>
	);
}
