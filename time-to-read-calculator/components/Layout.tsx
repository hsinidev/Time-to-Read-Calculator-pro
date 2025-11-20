import React, { useState, useRef, useEffect, useCallback } from 'react';
import Modal from './Modal';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modalData = {
    'About': 'Our Time to Read Calculator is a precision tool designed for writers, editors, students, and curious readers. We provide instant, accurate reading time estimates to help you gauge content length and optimize for user engagement. Built with modern technology for a seamless experience.',
    'Contact': 'For inquiries, feedback, or support, please reach out to us at hsini.web@gmail.com. We are always happy to help!',
    'Guide': 'Simply paste your text into the large input area. The word count and estimated reading time will update instantly. You can adjust the Words Per Minute (WPM) slider to match your personal reading speed or that of your target audience. Use the "Clear" and "Copy" buttons for easy text management.',
    'Privacy Policy': 'We respect your privacy. The text you enter is processed entirely within your browser. No data is ever sent to our servers or stored by us. Your work remains your own, always.',
    'Terms of Service': 'This tool is provided free of charge for personal and professional use. By using this service, you agree not to submit any content that is unlawful or malicious. We are not liable for any issues arising from the use of this tool.',
    'DMCA': 'We respect intellectual property rights. Since no user content is stored on our servers, we do not host any infringing material. If you have any concerns, please contact us at hsini.web@gmail.com with relevant details.'
  };

  const openModal = (title: keyof typeof modalData) => {
    setModalContent({ title, content: modalData[title] });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const draw = useCallback((ctx: CanvasRenderingContext2D, stars: any[], nebula: any) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000010';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw Nebula
    const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
    gradient.addColorStop(0, `hsla(${nebula.hue}, 100%, 70%, 0.15)`);
    gradient.addColorStop(1, `hsla(${nebula.hue + 60}, 100%, 50%, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    nebula.x += nebula.vx;
    nebula.y += nebula.vy;
    nebula.hue = (nebula.hue + 0.05) % 360;

    if (nebula.x < 0 || nebula.x > ctx.canvas.width) nebula.vx *= -1;
    if (nebula.y < 0 || nebula.y > ctx.canvas.height) nebula.vy *= -1;


    // Draw Stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();

      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0 || star.x > ctx.canvas.width) star.vx = -star.vx;
      if (star.y < 0 || star.y > ctx.canvas.height) star.vy = -star.vy;
    });

    requestAnimationFrame(() => draw(ctx, stars, nebula));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));

    const nebula = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.max(canvas.width, canvas.height) / 2,
      hue: 260,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    };
    
    draw(ctx, stars, nebula);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  const navLinks: (keyof typeof modalData)[] = ['About', 'Contact', 'Guide', 'Privacy Policy', 'Terms of Service', 'DMCA'];

  return (
    <div className="relative min-h-screen bg-[#000010] font-sans">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-4 bg-black/30 backdrop-blur-sm border-b border-slate-700/50">
          <nav className="container mx-auto flex justify-between items-center text-white">
            <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Time to Read
            </h2>
            <div className="hidden md:flex space-x-4">
              {navLinks.map(link => (
                <button key={link} onClick={() => openModal(link)} className="hover:text-purple-400 transition-colors duration-300">
                  {link}
                </button>
              ))}
            </div>
             <div className="md:hidden">
                <select 
                    onChange={(e) => openModal(e.target.value as keyof typeof modalData)} 
                    className="bg-slate-800 text-white border border-slate-600 rounded-md p-2 focus:ring-1 focus:ring-purple-500"
                    defaultValue=""
                >
                    <option value="" disabled>Menu</option>
                    {navLinks.map(link => <option key={link} value={link}>{link}</option>)}
                </select>
            </div>
          </nav>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="w-full text-center p-4 bg-black/30 backdrop-blur-sm text-sm border-t border-slate-700/50">
          <p style={{ color: '#FFD700' }}>
            Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">HSINI MOHAMED</a>
          </p>
          <p className="text-gray-400">
            <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">doodax.com</a> | hsini.web@gmail.com
          </p>
        </footer>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}>
        <p>{modalContent.content}</p>
      </Modal>
    </div>
  );
};

export default Layout;
