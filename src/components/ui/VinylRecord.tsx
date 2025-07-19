import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  labelColor: string;
  accentColor: string;
}

interface VinylRecordProps {
  album: AlbumData;
  index: number;
  onClick: () => void;
}

export const VinylRecord: React.FC<VinylRecordProps> = ({ album, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer } | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Create album art texture
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

  // Create vinyl label texture
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

  // Initialize Three.js scene
  const initRecord = () => {
    if (!containerRef.current) return;

    // Clear any existing canvas
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera setup
    const containerWidth = containerRef.current.offsetWidth || 800;
    const containerHeight = 320;
    const camera = new THREE.PerspectiveCamera(50, containerWidth / containerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create album texture
    const albumTexture = createAlbumArt(album);

    // Create simple sleeve (box) - 1.4x larger
    const sleeveGeometry = new THREE.BoxGeometry(5.6, 5.6, 0.28);
    const sleeveMaterial = new THREE.MeshLambertMaterial({ map: albumTexture });
    const sleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    sleeve.position.set(-1.4, 0, 0);
    sleeve.rotation.y = -0.15;
    scene.add(sleeve);

    // Create simple vinyl record (cylinder) - 1.4x larger
    const recordGeometry = new THREE.CylinderGeometry(2.8, 2.8, 0.14, 32);
    const recordMaterial = new THREE.MeshLambertMaterial({ color: 0x0a0a0a });
    const record = new THREE.Mesh(recordGeometry, recordMaterial);
    record.rotation.x = Math.PI / 2;
    record.position.set(0.28, 0, 0.28); // Positioned to poke out from sleeve
    record.rotation.z = 0.15;
    scene.add(record);

    // Add center label - 1.4x larger
    const labelTexture = createVinylLabel(album);
    const labelGeometry = new THREE.CircleGeometry(0.84, 32);
    const labelMaterial = new THREE.MeshLambertMaterial({ map: labelTexture });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.z = 0.073;
    record.add(label);

    // Add groove lines to vinyl - multiple rings for better effect (1.4x larger)
    for (let i = 0; i < 8; i++) {
      const innerRadius = (0.7 + (i * 0.15)) * 1.4;
      const outerRadius = innerRadius + (0.02 * 1.4);
      const grooveGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
      const grooveMaterial = new THREE.MeshLambertMaterial({
        color: 0x666666,
        side: THREE.FrontSide
      });
      const groove = new THREE.Mesh(grooveGeometry, grooveMaterial);
      groove.position.z = 0.073;
      record.add(groove);
    }

    // Click handler
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.style.cursor = 'pointer';

    sceneRef.current = { scene, camera, renderer };

    // Initial render
    renderer.render(scene, camera);
  };

  // Simple animation loop for subtle rotation
  const animate = () => {
    if (sceneRef.current) {
      // Subtle rotation for the whole scene
      sceneRef.current.scene.rotation.y = Math.sin(Date.now() * 0.0005) * 0.05;

      sceneRef.current.renderer.render(
        sceneRef.current.scene,
        sceneRef.current.camera
      );
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Initialize and cleanup
  useEffect(() => {
    initRecord();
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        if (containerRef.current && sceneRef.current.renderer.domElement) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, [album]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (sceneRef.current && containerRef.current) {
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
          imageRendering: 'pixelated'
        }}
      />

      {/* Click hint */}
      <p className="text-center mt-4 text-accent-orange font-tech text-lg animate-pixel-pulse">
        ► Click to Play ◄
      </p>
    </div>
  );
};