import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
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
  const progressionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    // Early exit if no scene or component is unmounting
    if (!sceneRef.current || !sceneRef.current.sleeve3D) {
      return;
    }
    
    try {
      const newTexture = await createPixelatedAlbumArt(album, pixelLevel);
      
      // Double-check scene still exists after async operation
      if (!sceneRef.current || !sceneRef.current.sleeve3D) {
        newTexture.dispose();
        return;
      }
      
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
    } catch (error) {
      console.warn('Error updating album texture:', error);
    }
  };

  // Initialize 3D scene
  const init3DScene = async () => {
    if (!canvasRef.current) return;

    // Wait for next frame to ensure DOM is ready
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Get actual canvas dimensions with fallback
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const width = canvasRect.width || window.innerWidth;
    const height = canvasRect.height || window.innerHeight * 0.5;

    // Don't initialize if dimensions are invalid
    if (width === 0 || height === 0) {
      console.warn('Canvas has invalid dimensions, retrying...');
      setTimeout(() => init3DScene(), 100);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup - adjust aspect ratio based on actual canvas size
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6.5);

    // Renderer setup - use actual canvas dimensions
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

  // Add a ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Animation loop
  const animate = () => {
    // Stop animation if lightbox is closed, scene is null, or component unmounted
    if (!isOpen || !sceneRef.current || !isMountedRef.current) {
      animationFrameRef.current = undefined;
      return;
    }

    // Double-check scene exists before accessing properties
    if (sceneRef.current && sceneRef.current.sleeveGroup && sceneRef.current.renderer) {
      try {
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
          // Only update texture if still mounted
          if (isMountedRef.current && isOpen) {
            updateAlbumTexture(roundedLevel);
          }
        }

        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      } catch (error) {
        console.warn('Error in animation loop:', error);
        animationFrameRef.current = undefined;
        return;
      }
    }
    
    // Only continue animation if still mounted
    if (isMountedRef.current && isOpen) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
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
      // Mark component as mounted
      isMountedRef.current = true;
      
      // Reset rotation and pixelation refs when opening
      targetRotationRef.current = { x: 0, y: 0 };
      currentRotationRef.current = { x: 0, y: 0 };
      targetPixelLevelRef.current = 64;
      currentPixelLevelRef.current = 64;
      setCurrentPixelLevel(64);
      setDisplayPixelLevel(64);

      // Save current scroll position BEFORE manipulating body styles
      scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;

      // Store original body styles to restore them properly later
      const originalBodyStyle = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        right: document.body.style.right,
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight
      };

      // Prevent body scrolling
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

      // Delay initialization to ensure DOM is ready
      setTimeout(() => {
        init3DScene().then(() => {
          if (isMountedRef.current) {
            animate();
            startPixelationProgression();
          }
        });
      }, 50);

      // Cleanup function
      return () => {
        // Mark component as unmounting immediately
        isMountedRef.current = false;
        
        // Clear timeouts
        if (progressionTimeoutRef.current) {
          clearTimeout(progressionTimeoutRef.current);
          progressionTimeoutRef.current = null;
        }
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = null;
        }

        // Cancel animation frame FIRST
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }

        // Small delay to ensure animation has stopped
        setTimeout(() => {
          // Dispose of Three.js resources
          if (sceneRef.current) {
            try {
              // Dispose of textures
              if (sceneRef.current.sleeve3D) {
                const materials = sceneRef.current.sleeve3D.material;
                if (Array.isArray(materials)) {
                  materials.forEach(material => {
                    // Type guard to check if material has a map property
                    if (material instanceof THREE.MeshPhongMaterial && material.map) {
                      material.map.dispose();
                    }
                    material.dispose();
                  });
                }
                sceneRef.current.sleeve3D.geometry.dispose();
              }
              
              sceneRef.current.renderer.dispose();
              sceneRef.current.renderer.forceContextLoss();
            } catch (error) {
              console.warn('Error during cleanup:', error);
            } finally {
              sceneRef.current = null;
            }
          }

          // Restore body styles explicitly
          document.body.style.position = originalBodyStyle.position;
          document.body.style.top = originalBodyStyle.top;
          document.body.style.left = originalBodyStyle.left;
          document.body.style.right = originalBodyStyle.right;
          document.body.style.overflow = originalBodyStyle.overflow;
          document.body.style.paddingRight = originalBodyStyle.paddingRight;

          // Force a reflow before scrolling
          document.body.offsetHeight;

          // Restore scroll position with a small delay to ensure DOM is ready
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollPositionRef.current);
            
            // Double-check scroll restoration for mobile
            setTimeout(() => {
              if (window.scrollY !== scrollPositionRef.current) {
                window.scrollTo(0, scrollPositionRef.current);
              }
            }, 0);
          });
        }, 0);
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
        <div className="w-full max-w-[500px] aspect-square max-h-[50vh] relative mb-4">
          <canvas
            ref={canvasRef}
            className={`w-full h-full block ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
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

          {/* Pixelation Level Indicator - Updated styling */}
          <div className="absolute top-4 right-4 text-accent-green/80 font-tech text-xs uppercase tracking-wider bg-primary-bg/80 backdrop-blur-sm px-2 py-1 rounded border border-accent-green/20">
            Focus: {displayPixelLevel}px
          </div>
        </div>

        {/* Album Info - Styled like accordion items */}
        <div className="max-w-lg w-full mx-4">
          {/* Drag hint */}
          <p className="text-center text-accent-orange/60 text-xs mb-3 font-tech uppercase tracking-wider">
            ↔ Drag to Rotate ↔
          </p>
          
          {/* Info Card */}
          <div className="bg-primary-bg/50 backdrop-blur-sm rounded-lg border border-accent-orange/10 p-6 mb-4">
            <div className="text-center space-y-2">
              <h3 className="font-retro text-xl sm:text-2xl font-bold text-white">
                {album.title}
              </h3>
              <p className="text-gray-400 font-tech text-base sm:text-lg">
                {album.artist}
              </p>
              <p className="text-gray-500 font-tech text-sm">
                {album.year}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              {album.spotifyUrl && (
                <button
                  onClick={() => window.open(album.spotifyUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-accent-green/10 hover:bg-accent-green/20 
                    border border-accent-green/30 hover:border-accent-green/50
                    rounded-md transition-all duration-200
                    text-accent-green font-tech text-sm uppercase tracking-wider"
                >
                  <ExternalLink className="w-4 h-4" />
                  SPOTIFY
                </button>
              )}
              {album.appleMusicUrl && (
                <button
                  onClick={() => window.open(album.appleMusicUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 
                    bg-accent-orange/10 hover:bg-accent-orange/20 
                    border border-accent-orange/30 hover:border-accent-orange/50
                    rounded-md transition-all duration-200
                    text-accent-orange font-tech text-sm uppercase tracking-wider"
                >
                  <ExternalLink className="w-4 h-4" />
                  APPLE
                </button>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 
              bg-primary-bg/30 hover:bg-primary-bg/50 
              border border-gray-600/30 hover:border-accent-orange/50
              rounded-md transition-all duration-200
              text-gray-400 hover:text-accent-orange font-tech text-sm uppercase tracking-wider"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};