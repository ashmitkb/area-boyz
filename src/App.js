import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Moon, Sun, ChevronDown } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function AreaBoys() {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 3D Canvas refs
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);

  // Initialize 3D Background Scene
  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.innerHTML = '';

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3.5;
    camera.position.x = -1.2;
    camera.position.y = -0.3;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 8, 10);
    scene.add(directionalLight);

    // Add a placeholder geometry while model loads
    const geometry = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.7, roughness: 0.2 });
    const placeholder = new THREE.Mesh(geometry, material);
    placeholder.position.x = -0.5;
    scene.add(placeholder);
    modelRef.current = placeholder;

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
      '/green_arm_bracer_3d_model.glb',
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 5.5 / maxDim;
        model.scale.multiplyScalar(scale);

        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x;
        model.position.y = -center.y - 0.2;
        model.position.z = -center.z;

        model.rotation.x = 2;
        model.rotation.y = -1;
        model.rotation.z = 1;

        scene.remove(placeholder);
        scene.add(model);
        modelRef.current = model;
        console.log('Model loaded successfully');
      },
      (progress) => {
        console.log('Loading:', (progress.loaded / progress.total) * 100, '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        console.log('Using placeholder geometry instead');
      }
    );

    let rotationSpeed = 0.0015;
    let frameCount = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      frameCount++;

      if (modelRef.current) {
        modelRef.current.rotation.y += rotationSpeed;
        if (frameCount % 60 === 0) {
          console.log('Rotating:', modelRef.current.rotation.y);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const sections = [
    {
      title: 'We are\nmovement',
      subtitle: 'Your freedom to enjoy life',
      description: 'Premium custom sleeves designed for the active mind. Each piece is crafted with meticulous attention to detail.',
      cta: 'Explore Collection'
    },
    {
      title: 'We are\ndistinction',
      subtitle: '3D Embroidered Excellence',
      description: 'Textured depth meets modern design. Our 3D embroidered sleeves bring your vision to life with premium materials.',
      cta: 'View 3D Gallery'
    }
  ];

  const products = [
    { id: 1, name: 'Zoro Scar Collection', price: 89.99, colors: ['Emerald', 'Midnight'] },
    { id: 2, name: 'Minimalist Gradient', price: 45.99, colors: ['Peach Blend'] },
    { id: 3, name: 'Midnight Geometric', price: 54.99, colors: ['Charcoal'] },
    { id: 4, name: 'Neural Texture', price: 94.99, colors: ['Neon Purple'] },
    { id: 5, name: 'Minimalist Line Art', price: 49.99, colors: ['Pure Black'] },
    { id: 6, name: 'Custom Design', price: 79.99, colors: ['Any'] }
  ];

  const handleScroll = (e) => {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight;
    const newSection = Math.round(scrollY / sectionHeight);
    setActiveSection(Math.min(newSection, 1));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-500`}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        body {
          scroll-behavior: smooth;
        }

        #canvas-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        #canvas-container canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        .section {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .section-transition {
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-15px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .accent-dot {
          position: absolute;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .accent-line {
          position: absolute;
          background: linear-gradient(90deg, rgba(255, 138, 101, 0), rgba(255, 138, 101, 0.5), rgba(255, 138, 101, 0));
        }

        .text-glow {
          text-shadow: 0 0 40px rgba(255, 138, 101, 0.6), 0 6px 20px rgba(255, 138, 101, 0.35);
        }

        h1 {
          text-shadow: 0 4px 15px rgba(255, 138, 101, 0.4);
        }

        h2 {
          text-shadow: 0 4px 12px rgba(255, 138, 101, 0.3);
        }

        p {
          text-shadow: 0 2px 6px rgba(255, 138, 101, 0.2);
        }
      `}</style>

      {/* Fixed Canvas Background */}
      <div id="canvas-container" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: activeSection === 0 ? 1 : 0, transition: 'opacity 0.6s ease' }} />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300`} style={{ background: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">AREA BOYZ</h1>
          <div className="flex items-center gap-8">
            <button onClick={() => setIsDark(!isDark)} className="p-2 hover:opacity-70 transition">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowCart(!showCart)} className="relative p-2 hover:opacity-70 transition">
              <ShoppingBag size={20} />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-black text-xs rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {showCart && (
        <div className={`fixed right-0 top-0 h-full w-96 z-40 transition-all ${isDark ? 'bg-gray-900' : 'bg-gray-50'} border-l ${isDark ? 'border-gray-800' : 'border-gray-200'} p-8 overflow-y-auto`}>
          <h2 className="text-2xl font-bold mb-8">Cart</h2>
          {cart.length === 0 ? (
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Your cart is empty</p>
          ) : (
            <div className="space-y-6">
              {cart.map((item, idx) => (
                <div key={idx} className={`pb-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                  <p className="font-semibold">{item.name}</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>${item.price}</p>
                  <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-sm text-orange-500 hover:text-orange-400 mt-2">Remove</button>
                </div>
              ))}
              <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-6`}>
                <p className="text-lg font-bold mb-4">Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                <button className="w-full py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition">Checkout</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hero Sections */}
      <section className="min-h-screen flex items-center justify-center relative" style={{ minHeight: '100vh', zIndex: 10, position: 'relative' }}>
        {/* Decorative elements */}
        <div className="accent-dot" style={{ top: '10%', right: '15%', width: '40px', height: '40px', background: 'rgba(255, 138, 101, 0.2)', animationDelay: '0s' }} />
        <div className="accent-dot" style={{ bottom: '20%', left: '10%', width: '60px', height: '60px', background: 'rgba(255, 138, 101, 0.15)', animationDelay: '1s' }} />
        <div className="accent-dot" style={{ top: '45%', right: '5%', width: '50px', height: '50px', background: 'rgba(255, 138, 101, 0.12)', animationDelay: '0.7s' }} />
        <div className="accent-line" style={{ top: '30%', right: '20%', width: '200px', height: '2px', animationDelay: '0.5s' }} />
        <div className="accent-line" style={{ bottom: '40%', left: '5%', width: '150px', height: '3px', background: 'rgba(255, 138, 101, 0.4)' }} />
        <div className="accent-line" style={{ top: '60%', right: '10%', width: '100px', height: '2px', background: 'rgba(255, 138, 101, 0.3)' }} />
        
        <div className="absolute inset-0 z-0"></div>
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-8 md:p-16">
          {/* Top Left - We are movement */}
          <div className="max-w-lg">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6">
              We are<br />movement
            </h1>
            <div className="w-12 h-1 bg-orange-500 mb-6"></div>
            <h2 className="text-lg font-light mb-4 tracking-wide">Your freedom to enjoy life</h2>
            <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Premium custom sleeves designed for the active mind. Each piece is crafted with meticulous attention to detail.
            </p>
          </div>

          {/* Bottom Right - We are area boys */}
          <div className="max-w-lg self-end">
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight mb-6 text-right">
              We are<br />area<br />boys
            </h1>
            <div className="w-12 h-1 bg-orange-500 mb-6 ml-auto"></div>
            <div className="text-right">
              <button className="px-8 py-4 border-2 border-orange-500 text-orange-500 font-bold hover:bg-orange-500 hover:text-black transition duration-300 tracking-widest text-sm">
                START JOURNEY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={`min-h-screen py-32 px-8 ${isDark ? 'bg-black' : 'bg-white'}`} style={{ opacity: activeSection >= 1 ? 1 : 0.5, transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}>
        {/* Decorative background elements */}
        <div style={{ position: 'absolute', top: '50%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255, 138, 101, 0.1) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(255, 138, 101, 0.08) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
        
        <div className="max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          {!selectedProduct ? (
            <>
              <div className="mb-12">
                <h2 className="text-4xl font-semibold mb-4">PRODUCTS</h2>
                <p className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{products.length} / {products.length}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, idx) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer group overflow-hidden rounded-lg transition-all duration-300 hover:shadow-2xl"
                    style={{
                      background: isDark ? 'rgba(20, 20, 30, 0.6)' : 'rgba(240, 240, 240, 0.8)',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl font-light text-center" style={{ color: isDark ? '#666' : '#999' }}>
                        {product.name.slice(0, 2)}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <p className="text-white text-sm font-semibold">{product.name}</p>
                      <p className="text-orange-400 text-xs font-bold">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Product Detail View
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left sidebar */}
              <div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="mb-8 text-sm font-semibold"
                  style={{ color: '#FF8A65' }}
                >
                  ← BACK
                </button>

                <h3 className="text-xs font-mono mb-2" style={{ color: isDark ? '#666' : '#999' }}>CATEGORY</h3>
                <p className="text-xs font-mono mb-8" style={{ color: '#FF8A65' }}>SLEEVE COLLECTION</p>

                <h1 className="text-4xl font-semibold mb-2">{selectedProduct.name}</h1>
                <p className="text-sm font-semibold mb-8" style={{ color: '#FF8A65' }}>${selectedProduct.price}</p>

                <div className="space-y-6 mb-12">
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: isDark ? '#666' : '#999' }}>COLORS</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.colors.map((color) => (
                        <span
                          key={color}
                          className="text-xs px-4 py-2 rounded-full font-semibold transition-all cursor-pointer hover:scale-110"
                          style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            color: isDark ? '#fff' : '#000'
                          }}
                        >
                          • {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: isDark ? '#666' : '#999' }}>SIZE</p>
                    <div className="flex gap-2 flex-wrap">
                      {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                        <span
                          key={size}
                          className="text-xs px-4 py-2 rounded-full font-semibold transition-all cursor-pointer hover:scale-110"
                          style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            color: isDark ? '#fff' : '#000'
                          }}
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: isDark ? '#666' : '#999' }}>DETAILS</p>
                    <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <li>• Premium materials</li>
                      <li>• Hand-crafted</li>
                      <li>• Limited edition</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCart([...cart, selectedProduct]);
                    setSelectedProduct(null);
                  }}
                  className="w-full mt-8 py-4 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: '#FF8A65',
                    color: isDark ? 'black' : 'white'
                  }}
                >
                  ADD TO CART
                </button>
              </div>

              {/* Center - Product Image/Preview */}
              <div className="flex items-center justify-center lg:col-span-2">
                <div
                  style={{
                    width: '100%',
                    height: '600px',
                    background: isDark ? 'rgba(20, 20, 30, 0.4)' : 'rgba(240, 240, 240, 0.6)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                  }}
                >
                  <div className="text-8xl font-light text-center" style={{ color: isDark ? '#333' : '#ddd' }}>
                    {selectedProduct.name.slice(0, 2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className={`min-h-screen py-32 px-8 ${isDark ? 'bg-black' : 'bg-white'}`} style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Starfield background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                background: 'rgba(255, 138, 101, 0.8)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                borderRadius: '50%',
                boxShadow: `0 0 ${5 + Math.random() * 10}px rgba(255, 138, 101, ${0.4 + Math.random() * 0.6})`,
                animation: `twinkle ${2 + Math.random() * 4}s infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - About Us Info */}
            <div style={{
              background: isDark ? 'rgba(20, 20, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(255, 138, 101, 0.3)',
              borderRadius: '16px',
              padding: '40px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(255, 138, 101, 0.1), inset 0 0 20px rgba(255, 138, 101, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, rgba(255, 138, 101, 0.8), transparent)' }} />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2 className="text-5xl font-semibold mb-2">ABOUT US</h2>
                <p className="text-sm font-mono mb-8" style={{ color: '#FF8A65', letterSpacing: '2px' }}>
                  THE STORY BEHIND AREA BOYZ
                </p>

                <div style={{ height: '3px', width: '60px', background: 'rgba(255, 138, 101, 0.6)', marginBottom: '24px' }} />

                <p className={`text-lg leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  We're a group of creative friends from Bangalore who share a passion for design and innovation. What started as a hobby became a mission to create something truly unique in the world of sleeve art.
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: '#FF8A65', letterSpacing: '1px' }}>OUR MISSION</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      To transform everyday sleeves into wearable art. We believe in pushing boundaries and creating products that tell a story.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: '#FF8A65', letterSpacing: '1px' }}>OUR VALUES</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Quality, creativity, and authenticity guide every design decision we make.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-mono mb-2" style={{ color: '#FF8A65', letterSpacing: '1px' }}>BASED IN</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Bangalore, India 🇮🇳
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Logo with stars */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px' }}>
              {/* Animated star burst background */}
              <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 138, 101, 0.15) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite',
                zIndex: 1
              }} />

              {/* Logo placeholder */}
              <div style={{
                position: 'relative',
                zIndex: 2,
                width: '300px',
                height: '300px',
                borderRadius: '20px',
                background: isDark ? 'rgba(20, 20, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                border: '3px solid rgba(255, 138, 101, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 40px rgba(255, 138, 101, 0.3), inset 0 0 30px rgba(255, 138, 101, 0.1)`,
                overflow: 'hidden'
              }}>
                {/* Inner star field */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: `${Math.random() * 3}px`,
                        height: `${Math.random() * 3}px`,
                        background: 'rgba(255, 138, 101, 0.7)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        borderRadius: '50%',
                        animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>

                {/* Logo text */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                  <div className="text-6xl font-bold mb-2" style={{ color: '#FF8A65' }}>AB</div>
                  <p className="text-xs font-mono tracking-widest" style={{ color: '#FF8A65' }}>AREA BOYZ</p>
                </div>
              </div>

              {/* Animated rings */}
              <div style={{
                position: 'absolute',
                width: '350px',
                height: '350px',
                border: '2px solid rgba(255, 138, 101, 0.2)',
                borderRadius: '50%',
                animation: 'spin 8s linear infinite',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                border: '1px solid rgba(255, 138, 101, 0.1)',
                borderRadius: '50%',
                animation: 'spin 12s linear reverse',
                zIndex: 0
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40`}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          background: isDark ? 'rgba(20, 20, 30, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isDark ? 'rgba(255, 138, 101, 0.2)' : 'rgba(255, 138, 101, 0.3)'}`,
          borderRadius: '50px',
          boxShadow: '0 8px 32px rgba(255, 138, 101, 0.1)'
        }}>
          <button className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:bg-white/10" style={{ color: 'inherit' }}>
            Home
          </button>
          <button className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:bg-white/10" style={{ color: 'inherit' }}>
            Collection
          </button>
          <button 
            onClick={() => setShowCart(!showCart)}
            className="px-5 py-2 rounded-full font-semibold text-sm transition-all hover:bg-white/10 relative"
            style={{ color: 'inherit' }}
          >
            Cart
            {cart.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: '#FF8A65', color: isDark ? 'black' : 'white' }}>{cart.length}</span>}
          </button>
          <button className="px-5 py-2 rounded-full font-semibold text-sm transition-all" style={{ background: '#FF8A65', color: isDark ? 'black' : 'white' }}>
            Contact
          </button>
        </div>
      </nav>
      <footer className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} py-24 px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-orange-500 transition">Collections</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Custom Design</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-orange-500 transition">Our Story</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Craftsmanship</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-orange-500 transition">Shipping</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#" className="hover:text-orange-500 transition">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Email</a></li>
              </ul>
            </div>
          </div>
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-8 flex justify-between items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>&copy; 2025 AREA BOYZ. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-orange-500 transition">Privacy</a>
              <a href="#" className="hover:text-orange-500 transition">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}