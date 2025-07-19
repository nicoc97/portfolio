import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PixelButton } from './PixelButton';
import { ExternalLink } from 'lucide-react';

// Define the AlbumData type since it's imported in the original
interface AlbumData {
  title: string;
  artist: string;
  year: string;
  labelColor: string;
  accentColor: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

interface VinylLightboxProps {
  album: AlbumData;
  isOpen: boolean;
  onClose: () => void;
}

export const VinylLightbox: React.FC<VinylLightboxProps> = ({ album, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sleeveGroup: THREE.Group;
    sleeve3D: THREE.Mesh;
  } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Use refs for rotation values so they can be accessed in the animation loop
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  // Create album art texture (same as VinylRecord)
  const createAlbumArt = (albumData: AlbumData) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Album-specific gradient background
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, albumData.labelColor);
    gradient.addColorStop(0.5, albumData.accentColor);
    gradient.addColorStop(1, albumData.labelColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    // Groovy circular pattern
    ctx.fillStyle = albumData.accentColor;
    ctx.beginPath();
    ctx.arc(32, 32, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2a2419';
    ctx.beginPath();
    ctx.arc(32, 32, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = albumData.labelColor;
    ctx.beginPath();
    ctx.arc(32, 32, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f5f2e8';
    ctx.beginPath();
    ctx.arc(32, 32, 5, 0, Math.PI * 2);
    ctx.fill();

    // Album title text
    ctx.fillStyle = '#f5f2e8';
    ctx.font = 'bold 6px monospace';
    const words = albumData.title.toUpperCase().split(' ');
    ctx.fillText(words[0], 32 - ctx.measureText(words[0]).width / 2, 12);
    if (words[1]) {
      ctx.fillText(words[1], 32 - ctx.measureText(words[1]).width / 2, 58);
    }

    // Some groovy stars
    ctx.fillStyle = '#f5f2e8';
    const stars = [[8, 20], [56, 16], [48, 48], [16, 44]];
    stars.forEach(([x, y]) => {
      ctx.fillRect(x, y, 2, 2);
      ctx.fillRect(x - 2, y, 2, 2);
      ctx.fillRect(x + 2, y, 2, 2);
      ctx.fillRect(x, y - 2, 2, 2);
      ctx.fillRect(x, y + 2, 2, 2);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  };

  // Initialize 3D scene
  const init3DScene = () => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true
    });
    renderer.setSize(500, 500);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setPixelRatio(0.5);

    // Warm 70s lighting
    const ambientLight = new THREE.AmbientLight(0xd4c4a0, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffb380, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x7c9756, 0.4);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const spotLight = new THREE.SpotLight(0xff8c42, 0.5);
    spotLight.position.set(-5, 5, 5);
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    // Create 3D sleeve group
    const sleeveGroup = new THREE.Group();
    scene.add(sleeveGroup);

    // Create sleeve - made 1.4x as large
    const sleeveSize = 3.64; // 2.6 * 1.4
    const sleeveDepth = 0.168; // 0.12 * 1.4
    const albumTexture = createAlbumArt(album);

    // Create the main sleeve body using BoxGeometry instead of separate planes
    const sleeveGeometry = new THREE.BoxGeometry(sleeveSize, sleeveSize, sleeveDepth);
    
    // Create materials array for each face of the box
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x5a4a3a, flatShading: true }), // right
      new THREE.MeshPhongMaterial({ color: 0x5a4a3a, flatShading: true }), // left
      new THREE.MeshPhongMaterial({ color: 0x5a4a3a, flatShading: true }), // top
      new THREE.MeshPhongMaterial({ color: 0x5a4a3a, flatShading: true }), // bottom
      new THREE.MeshPhongMaterial({ map: albumTexture, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0x3a2a1a, flatShading: true })  // back
    ];
    
    const sleeve3D = new THREE.Mesh(sleeveGeometry, materials);
    sleeve3D.castShadow = true;
    sleeve3D.receiveShadow = true;
    sleeveGroup.add(sleeve3D);

    // Create inner pocket - slightly smaller and offset
    const pocketWidth = sleeveSize * 0.92;
    const pocketHeight = sleeveSize * 0.96;
    const pocketDepth = sleeveDepth * 0.8; // Reduced depth to prevent overlap
    const pocketGeometry = new THREE.BoxGeometry(pocketWidth, pocketHeight, pocketDepth);
    const pocketMaterial = new THREE.MeshPhongMaterial({
      color: 0x0f0e0c,
      side: THREE.BackSide,
      flatShading: true
    });
    const pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.position.x = sleeveSize * 0.02;
    pocket.position.z = -sleeveDepth * 0.1; // Adjusted to prevent ridge
    sleeveGroup.add(pocket);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      sleeveGroup,
      sleeve3D
    };
  };

  // Update album texture when album changes
  const updateAlbumTexture = () => {
    if (sceneRef.current) {
      // Update sleeve texture
      const newAlbumTexture = createAlbumArt(album);
      const materials = sceneRef.current.sleeve3D.material;
      
      // Check if materials is an array (BoxGeometry uses material array)
      if (Array.isArray(materials)) {
        // Index 4 is the front face in BoxGeometry
        const frontMaterial = materials[4] as THREE.MeshPhongMaterial;
        if (frontMaterial && frontMaterial.map) {
          frontMaterial.map.dispose(); // Dispose old texture
          frontMaterial.map = newAlbumTexture;
          frontMaterial.needsUpdate = true;
        }
      }
    }
  };

  // Animation loop
  const animate = () => {
    if (sceneRef.current && isOpen) {
      // Smooth rotation for sleeve using refs
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;

      sceneRef.current.sleeveGroup.rotation.y = currentRotationRef.current.y;
      sceneRef.current.sleeveGroup.rotation.x = currentRotationRef.current.x;

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Mouse controls
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isMouseDown) return;

    const deltaX = event.clientX - mousePos.x;
    const deltaY = event.clientY - mousePos.y;

    // Update rotation using refs
    targetRotationRef.current.y += deltaX * 0.01;
    targetRotationRef.current.x += deltaY * 0.01;

    // Clamp vertical rotation to prevent flipping
    targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));

    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Touch controls
  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.touches.length === 1) {
      setIsMouseDown(true);
      setMousePos({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    }
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isMouseDown || event.touches.length !== 1) return;

    const deltaX = event.touches[0].clientX - mousePos.x;
    const deltaY = event.touches[0].clientY - mousePos.y;

    // Update rotation using refs - increased sensitivity for touch
    targetRotationRef.current.y += deltaX * 0.025; // 2.5x more sensitive than mouse
    targetRotationRef.current.x += deltaY * 0.025;

    // Clamp vertical rotation
    targetRotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetRotationRef.current.x));

    setMousePos({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
  };

  // Handle background click to close
  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Initialize scene when opened and handle body scroll
  useEffect(() => {
    if (isOpen) {
      // Reset rotation refs when opening
      targetRotationRef.current = { x: 0, y: 0 };
      currentRotationRef.current = { x: 0, y: 0 };

      // Prevent body scrolling
      document.body.style.overflow = 'hidden';

      init3DScene();
      animate();
    } else {
      // Restore body scrolling
      document.body.style.overflow = 'unset';
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Cleanup: restore scrolling
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Update texture when album changes
  useEffect(() => {
    if (isOpen) {
      updateAlbumTexture();
    }
  }, [album, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-primary-black/95 flex flex-col items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{
        backgroundImage: `repeating-linear-gradient(45deg,
          transparent,
          transparent 10px,
          rgba(255, 140, 66, 0.02) 10px,
          rgba(255, 140, 66, 0.02) 20px
        )`
      }}
      onClick={handleBackgroundClick}
    >
      {/* 3D Container */}
      <div className="w-[500px] h-[500px] relative mb-8">
        <canvas
          ref={canvasRef}
          className={`w-full h-full ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        <p className="text-center text-text-secondary text-sm mt-2 font-tech uppercase tracking-wider">
          ↔ Drag to Rotate ↔
        </p>
      </div>

      {/* Album Info */}
      <div className="pixel-card max-w-lg w-full mx-4 text-center">
        <h3 className="text-3xl font-bold text-accent-orange mb-2 font-retro uppercase tracking-wider">
          {album.title}
        </h3>
        <p className="text-xl text-accent-green mb-2 font-tech uppercase tracking-wider">
          {album.artist}
        </p>
        <p className="text-text-secondary uppercase tracking-wide font-tech text-sm mb-6">
          {album.year}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3 mb-4">
          {album.spotifyUrl && (
            <PixelButton
              variant="success"
              size="sm"
              onClick={() => window.open(album.spotifyUrl, '_blank')}
              className="flex-1 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              SPOTIFY
            </PixelButton>
          )}
          {album.appleMusicUrl && (
            <PixelButton
              variant="primary"
              size="sm"
              onClick={() => window.open(album.appleMusicUrl, '_blank')}
              className="flex-1 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              APPLE MUSIC
            </PixelButton>
          )}
        </div>

        {/* Close button */}
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full"
        >
          CLOSE
        </PixelButton>
      </div>
    </div>
  );
};