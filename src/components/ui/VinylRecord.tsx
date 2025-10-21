import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  labelColor: string;
  accentColor: string;
  albumArtUrl?: string; // Add support for real album art
  spotifyUrl?: string;
  appleMusicUrl?: string;
}

interface VinylRecordProps {
  album: AlbumData;
  index: number;
  onClick: () => void;
}

export const VinylRecord: React.FC<VinylRecordProps> = ({ album, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ 
    scene: THREE.Scene; 
    camera: THREE.PerspectiveCamera; 
    renderer: THREE.WebGLRenderer;
    sleeve: THREE.Mesh;
    record: THREE.Mesh;
  } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);
  
  const [isHovered, setIsHovered] = useState(false);
  const pixelationLevelRef = useRef(32); // Start with heavy pixelation
  const targetPixelationRef = useRef(32);
  const currentPixelationRef = useRef(32);

  // Create pixelated album art
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

  // Create vinyl label texture (unchanged from original)
  const createVinylLabel = (albumData: AlbumData) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base circle with album color
    ctx.fillStyle = albumData.labelColor;
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();

    // Inner decorative ring
    ctx.strokeStyle = albumData.accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.stroke();

    // Outer decorative ring
    ctx.strokeStyle = albumData.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Record label name at top
    ctx.fillStyle = '#0f0e0c';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GROOVE RECORDS', 128, 40);

    // Main title
    ctx.fillStyle = '#0f0e0c';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(albumData.title.toUpperCase(), 128, 100);

    // Subtitle
    ctx.font = '16px Arial';
    ctx.fillText(albumData.artist, 128, 130);

    // Side A indicator
    ctx.font = 'bold 20px Arial';
    ctx.fillText('SIDE A', 128, 165);

    // Catalog number
    ctx.font = '12px Arial';
    ctx.fillText('GRV-77-042', 128, 190);

    // Year
    ctx.fillText('℗ 1977', 128, 210);

    // Speed indicator
    ctx.font = 'bold 14px Arial';
    ctx.fillText('33⅓ RPM', 128, 230);

    // Center hole
    ctx.fillStyle = '#0f0e0c';
    ctx.beginPath();
    ctx.arc(128, 128, 12, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Update album texture with new pixelation level
  const updateAlbumTexture = async (pixelLevel: number) => {
    if (sceneRef.current && isMountedRef.current) {
      try {
        const newTexture = await createPixelatedAlbumArt(album, pixelLevel);
        
        // Check if still mounted after async operation
        if (!isMountedRef.current || !sceneRef.current) return;
        
        // Update sleeve texture
        if (sceneRef.current.sleeve.material instanceof THREE.MeshLambertMaterial) {
          if (sceneRef.current.sleeve.material.map) {
            sceneRef.current.sleeve.material.map.dispose();
          }
          sceneRef.current.sleeve.material.map = newTexture;
          sceneRef.current.sleeve.material.needsUpdate = true;
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating album texture:', error);
        }
      }
    }
  };

  // Clean up Three.js resources
  const cleanupThreeJS = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (sceneRef.current) {
      // Dispose of geometries, materials, and textures
      sceneRef.current.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => {
                if (material.map) material.map.dispose();
                material.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        }
      });

      // Remove event listeners
      if (sceneRef.current.renderer.domElement) {
        sceneRef.current.renderer.domElement.removeEventListener('click', onClick);
        sceneRef.current.renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
        sceneRef.current.renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      }

      // Dispose renderer
      sceneRef.current.renderer.dispose();
      
      // Remove canvas from DOM
      if (containerRef.current && sceneRef.current.renderer.domElement) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      
      sceneRef.current = null;
    }
  };

  // Initialize Three.js scene
  const initRecord = async () => {
    // Prevent multiple initializations
    if (isInitializingRef.current || !containerRef.current || !isMountedRef.current) return;
    
    isInitializingRef.current = true;

    try {
      // Clean up any existing scene
      cleanupThreeJS();

      // Check if still mounted after cleanup
      if (!isMountedRef.current || !containerRef.current) {
        isInitializingRef.current = false;
        return;
      }

      // Detect mobile and apply scale factor
      const isMobile = window.innerWidth <= 768;
      const mobileScale = isMobile ? 0.75 : 1.0;

      // Scene setup
      const scene = new THREE.Scene();
      scene.background = null;

      // Camera setup
      const containerWidth = containerRef.current.offsetWidth || 800;
      const containerHeight = 320;
      const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000);
      camera.position.set(-0.5, 0, 8);
      camera.lookAt(-0.5, 0, 0);

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Check if container still exists before appending
      if (!containerRef.current || !isMountedRef.current) {
        renderer.dispose();
        isInitializingRef.current = false;
        return;
      }
      
      containerRef.current.appendChild(renderer.domElement);

      // Simple lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create album texture with initial pixelation
      const albumTexture = await createPixelatedAlbumArt(album, pixelationLevelRef.current);

      // Check if still mounted after async operation
      if (!isMountedRef.current) {
        albumTexture.dispose();
        renderer.dispose();
        isInitializingRef.current = false;
        return;
      }

      // Create simple sleeve (box) - 1.4x larger, with mobile scaling
      const sleeveGeometry = new THREE.BoxGeometry(
        5.6 * mobileScale, 
        5.6 * mobileScale, 
        0.28 * mobileScale
      );
      const sleeveMaterial = new THREE.MeshLambertMaterial({ map: albumTexture });
      const sleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      sleeve.position.set(-1.4 * mobileScale, 0, 0);
      sleeve.rotation.y = -0.15;
      scene.add(sleeve);

      // Create simple vinyl record (cylinder) - 1.4x larger, with mobile scaling
      const recordGeometry = new THREE.CylinderGeometry(
        2.8 * mobileScale, 
        2.8 * mobileScale, 
        0.14 * mobileScale, 
        32
      );
      const recordMaterial = new THREE.MeshLambertMaterial({ color: 0x0a0a0a });
      const record = new THREE.Mesh(recordGeometry, recordMaterial);
      record.rotation.x = Math.PI / 2;
      record.position.set(0.28 * mobileScale, 0, 0.28 * mobileScale);
      record.rotation.z = 0.15;
      scene.add(record);

      // Add center label - 1.4x larger, with mobile scaling
      const labelTexture = createVinylLabel(album);
      const labelGeometry = new THREE.CircleGeometry(0.84 * mobileScale, 32);
      const labelMaterial = new THREE.MeshLambertMaterial({ map: labelTexture });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.position.z = 0.073 * mobileScale;
      record.add(label);

      // Add groove lines to vinyl
      for (let i = 0; i < 8; i++) {
        const innerRadius = (0.7 + (i * 0.15)) * 1.4 * mobileScale;
        const outerRadius = innerRadius + (0.02 * 1.4 * mobileScale);
        const grooveGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
        const grooveMaterial = new THREE.MeshLambertMaterial({
          color: 0x666666,
          side: THREE.FrontSide
        });
        const groove = new THREE.Mesh(grooveGeometry, grooveMaterial);
        groove.position.z = 0.073 * mobileScale;
        record.add(groove);
      }

      // Click handler
      renderer.domElement.addEventListener('click', onClick);
      renderer.domElement.style.cursor = 'pointer';

      // Mouse events for hover
      renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
      renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

      sceneRef.current = { scene, camera, renderer, sleeve, record };

      // Initial render
      renderer.render(scene, camera);

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error initializing Three.js scene:', error);
      }
    } finally {
      isInitializingRef.current = false;
    }
  };

  // Mouse event handlers
  const handleMouseEnter = () => {
    setIsHovered(true);
    targetPixelationRef.current = 64; // Less pixelated on hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetPixelationRef.current = 32; // More pixelated when not hovering
  };

  // Animation loop
  const animate = () => {
    if (sceneRef.current && isMountedRef.current) {
      // Detect mobile for animation scaling
      const isMobile = window.innerWidth <= 768;
      const mobileScale = isMobile ? 0.75 : 1.0;

      // Subtle rotation for the whole scene
      sceneRef.current.scene.rotation.y = Math.sin(Date.now() * 0.0005) * 0.05;

      // Smooth pixelation transition
      currentPixelationRef.current += (targetPixelationRef.current - currentPixelationRef.current) * 0.1;
      
      // Update texture when pixelation changes significantly
      if (Math.abs(pixelationLevelRef.current - currentPixelationRef.current) > 2) {
        const newLevel = Math.round(currentPixelationRef.current);
        if (newLevel !== pixelationLevelRef.current) {
          pixelationLevelRef.current = newLevel;
          updateAlbumTexture(newLevel);
        }
      }

      // Enhanced hover effects with mobile scaling
      if (sceneRef.current.sleeve) {
        const targetSleeveY = isHovered ? 0.2 * mobileScale : 0;
        sceneRef.current.sleeve.position.y += (targetSleeveY - sceneRef.current.sleeve.position.y) * 0.1;
      }

      if (sceneRef.current.record) {
        const targetRecordX = isHovered ? 0.7 * mobileScale : 0.28 * mobileScale;
        sceneRef.current.record.position.x += (targetRecordX - sceneRef.current.record.position.x) * 0.1;
      }

      sceneRef.current.renderer.render(
        sceneRef.current.scene,
        sceneRef.current.camera
      );
    }
    
    if (isMountedRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  // Initialize on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    // Small delay to ensure container is ready
    const initTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        initRecord().then(() => {
          if (isMountedRef.current) {
            animate();
          }
        });
      }
    }, 10);

    return () => {
      isMountedRef.current = false;
      clearTimeout(initTimeout);
      cleanupThreeJS();
    };
  }, []); // Only run on mount/unmount

  // Handle album changes
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    // Reset pixelation level
    pixelationLevelRef.current = 32;
    targetPixelationRef.current = 32;
    currentPixelationRef.current = 32;
    
    // Re-initialize with new album
    initRecord();
  }, [album]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current && containerRef.current && isMountedRef.current) {
        sceneRef.current.camera.aspect = containerRef.current.offsetWidth / 320;
        sceneRef.current.camera.updateProjectionMatrix();
        sceneRef.current.renderer.setSize(containerRef.current.offsetWidth, 320);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        ref={containerRef}
        className="w-full h-80 relative cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden"
        style={{
          imageRendering: 'pixelated',
          minHeight: '320px', // Ensure container maintains height
          backgroundColor: 'transparent' // Prevent flash of color
        }}
      />

      {/* Updated click hint with pixelation indicator */}
      <p className="text-center mt-4 text-accent-green font-tech text-lg">
        {isHovered ? '► Click to Play ◄' : '↕ Hover to Focus ↕'}
      </p>
    </div>
  );
};