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
  albumArtUrl?: string;
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sleeveGroup: THREE.Group;
    sleeve3D: THREE.Mesh;
  } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const scrollPositionRef = useRef<number>(0);
  const progressionTimeoutRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [viewportHeight, setViewportHeight] = useState('100vh');

  // Pixelation state
  const [currentPixelLevel, setCurrentPixelLevel] = useState(64);
  const [displayPixelLevel, setDisplayPixelLevel] = useState(64);
  const targetPixelLevelRef = useRef(64);
  const currentPixelLevelRef = useRef(64);

  // Use refs for rotation values so they can be accessed in the animation loop
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });

  // Handle iOS viewport height
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport API if available (better for iOS)
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(`${vh}px`);
    };

    // Update on mount
    updateViewportHeight();

    // Listen for viewport changes (iOS URL bar hide/show)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      window.visualViewport.addEventListener('scroll', updateViewportHeight);
    } else {
      window.addEventListener('resize', updateViewportHeight);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
        window.visualViewport.removeEventListener('scroll', updateViewportHeight);
      } else {
        window.removeEventListener('resize', updateViewportHeight);
      }
    };
  }, []);

  // Create pixelated album art (same as VinylRecord)
  const createPixelatedAlbumArt = (albumData: AlbumData, pixelSize: number): Promise<THREE.Texture> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256; // Higher res than original 64x64 for better pixelation
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;

      if (albumData.albumArtUrl) {
        // Load real album art
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          // Create temporary canvas for pixelation
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = pixelSize;
          tempCanvas.height = pixelSize;
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCtx.imageSmoothingEnabled = false;

          // Draw image at small size
          tempCtx.drawImage(img, 0, 0, pixelSize, pixelSize);

          // Draw pixelated version back to main canvas
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, 256, 256);

          // Add subtle vinyl texture overlay
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, 256, 256);

          const texture = new THREE.CanvasTexture(canvas);
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          resolve(texture);
        };

        img.onerror = () => {
          // Fallback to procedural art
          createProceduralArt(ctx, albumData, 256);
          const texture = new THREE.CanvasTexture(canvas);
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          resolve(texture);
        };

        img.src = albumData.albumArtUrl;
      } else {
        // Use procedural art if no URL provided
        createProceduralArt(ctx, albumData, 256);
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        resolve(texture);
      }
    });
  };

  // Create procedural art (your original design, but larger)
  const createProceduralArt = (ctx: CanvasRenderingContext2D, albumData: AlbumData, size: number) => {
    // Scale factor from original 64x64
    const scale = size / 64;

    // Album-specific gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, albumData.labelColor);
    gradient.addColorStop(0.5, albumData.accentColor);
    gradient.addColorStop(1, albumData.labelColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Groovy circular pattern
    const center = size / 2;
    ctx.fillStyle = albumData.accentColor;
    ctx.beginPath();
    ctx.arc(center, center, 20 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2a2419';
    ctx.beginPath();
    ctx.arc(center, center, 15 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = albumData.labelColor;
    ctx.beginPath();
    ctx.arc(center, center, 10 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f5f2e8';
    ctx.beginPath();
    ctx.arc(center, center, 5 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Album title text
    ctx.fillStyle = '#f5f2e8';
    ctx.font = `bold ${6 * scale}px monospace`;
    const words = albumData.title.toUpperCase().split(' ');
    ctx.textAlign = 'center';
    ctx.fillText(words[0], center, 12 * scale);
    if (words[1]) {
      ctx.fillText(words[1], center, (58 * scale));
    }

    // Some groovy stars
    ctx.fillStyle = '#f5f2e8';
    const stars = [[8, 20], [56, 16], [48, 48], [16, 44]];
    stars.forEach(([x, y]) => {
      const starX = x * scale;
      const starY = y * scale;
      const starSize = 2 * scale;
      ctx.fillRect(starX, starY, starSize, starSize);
      ctx.fillRect(starX - starSize, starY, starSize, starSize);
      ctx.fillRect(starX + starSize, starY, starSize, starSize);
      ctx.fillRect(starX, starY - starSize, starSize, starSize);
      ctx.fillRect(starX, starY + starSize, starSize, starSize);
    });
  };

  // Update album texture with new pixelation level
  const updateAlbumTexture = async (pixelLevel: number) => {
    if (sceneRef.current) {
      const newTexture = await createPixelatedAlbumArt(album, pixelLevel);
      const materials = sceneRef.current.sleeve3D.material;

      // Check if materials is an array (BoxGeometry uses material array)
      if (Array.isArray(materials)) {
        // Index 4 is the front face in BoxGeometry
        const frontMaterial = materials[4] as THREE.MeshPhongMaterial;
        if (frontMaterial && frontMaterial.map) {
          frontMaterial.map.dispose(); // Dispose old texture
          frontMaterial.map = newTexture;
          frontMaterial.needsUpdate = true;
        }
      }

      setDisplayPixelLevel(pixelLevel);
    }
  };

  // Initialize 3D scene
  const init3DScene = async () => {
    if (!canvasRef.current) return;

    // Get actual canvas dimensions
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup - adjust aspect ratio based on actual canvas size
    const camera = new THREE.PerspectiveCamera(45, canvasRect.width / canvasRect.height, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    // Renderer setup - use actual canvas dimensions
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true
    });
    renderer.setSize(canvasRect.width, canvasRect.height);
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
    const albumTexture = await createPixelatedAlbumArt(album, currentPixelLevel);

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

  // Start progressive pixelation
  const startPixelationProgression = () => {
    // Clear existing timeouts
    if (progressionTimeoutRef.current) clearTimeout(progressionTimeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    // Progress to 128px after 1.5 seconds
    progressionTimeoutRef.current = setTimeout(() => {
      targetPixelLevelRef.current = 128;

      // Progress to 192px after being idle for 3 seconds
      idleTimeoutRef.current = setTimeout(() => {
        targetPixelLevelRef.current = 192;
      }, 3000);
    }, 1500);
  };

  // Reset idle timer on interaction
  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    // Max out at 256px during interaction
    targetPixelLevelRef.current = 256;

    // After interaction stops, go back to 192px
    idleTimeoutRef.current = setTimeout(() => {
      targetPixelLevelRef.current = 192;
    }, 2000);
  };

  // Animation loop
  const animate = () => {
    if (sceneRef.current && isOpen) {
      // Smooth rotation for sleeve using refs
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.1;
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.1;

      sceneRef.current.sleeveGroup.rotation.y = currentRotationRef.current.y;
      sceneRef.current.sleeveGroup.rotation.x = currentRotationRef.current.x;

      // Smooth pixelation transition
      currentPixelLevelRef.current += (targetPixelLevelRef.current - currentPixelLevelRef.current) * 0.05;

      // Update texture when pixelation changes significantly
      const roundedLevel = Math.round(currentPixelLevelRef.current);
      if (Math.abs(currentPixelLevel - roundedLevel) > 4 && roundedLevel !== currentPixelLevel) {
        setCurrentPixelLevel(roundedLevel);
        updateAlbumTexture(roundedLevel);
      }

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Mouse controls
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsMouseDown(true);
    setMousePos({ x: event.clientX, y: event.clientY });
    resetIdleTimer();
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
    resetIdleTimer();
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
      resetIdleTimer();
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
    resetIdleTimer();
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
      // Reset rotation and pixelation refs when opening
      targetRotationRef.current = { x: 0, y: 0 };
      currentRotationRef.current = { x: 0, y: 0 };
      targetPixelLevelRef.current = 64;
      currentPixelLevelRef.current = 64;
      setCurrentPixelLevel(64);
      setDisplayPixelLevel(64);

      // Save current scroll position
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop;

      // Prevent body scrolling with a more robust approach for mobile
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      // Prevent layout shift from scrollbar
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // For iOS: Try to hide the URL bar by scrolling slightly
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 10);
      }

      init3DScene();
      animate();
      startPixelationProgression();

      return () => {
        // Clear timeouts
        if (progressionTimeoutRef.current) clearTimeout(progressionTimeoutRef.current);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

        // Restore body scrolling and position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isOpen]);

  // Update texture when album changes
  useEffect(() => {
    if (isOpen) {
      updateAlbumTexture(currentPixelLevel);
      startPixelationProgression();
    }
  }, [album, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-primary-black/95 flex flex-col items-center justify-center z-50 transition-opacity duration-300"
      style={{
        height: viewportHeight,
        backgroundImage: `repeating-linear-gradient(45deg,
          transparent,
          transparent 10px,
          rgba(255, 140, 66, 0.02) 10px,
          rgba(255, 140, 66, 0.02) 20px
        )`,
        touchAction: 'none', // Prevent touch gestures from scrolling
        WebkitTouchCallout: 'none', // iOS specific
        WebkitUserSelect: 'none', // iOS specific
        overscrollBehavior: 'none', // Prevent overscroll
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onClick={handleBackgroundClick}
    >
      {/* Inner container with safe area padding for iOS */}
      <div
        className="w-full h-full flex flex-col items-center justify-center p-8"
        style={{
          paddingTop: 'max(2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(2rem, env(safe-area-inset-left))',
          paddingRight: 'max(2rem, env(safe-area-inset-right))'
        }}
      >
        {/* 3D Container */}
        <div className="w-[500px] h-[500px] max-w-[calc(100vw-4rem)] max-h-[50vh] relative mb-4">
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Pixelation Level Indicator */}
          <div className="absolute top-4 right-4 text-accent-green font-tech text-sm uppercase tracking-wider bg-primary-black/80 px-3 py-1 rounded-sm">
            Focus: {displayPixelLevel}px
          </div>
        </div>

        {/* Album Info */}
        <div className="pixel-card max-w-lg w-full text-center mx-4">
          <p className="text-center text-text-secondary text-sm mb-2 font-tech uppercase tracking-wider">
            ↔ Drag to Rotate ↔
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-accent-orange mb-2 font-retro uppercase tracking-wider">
            {album.title}
          </h3>
          <p className="text-lg sm:text-xl text-accent-green mb-2 font-tech uppercase tracking-wider">
            {album.artist}
          </p>
          <p className="text-text-secondary uppercase tracking-wide font-tech text-sm mb-4 sm:mb-6">
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
    </div>
  );
};