"use client"

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Mail, Instagram, Github, ArrowDown } from 'lucide-react';

// --- Styled Components / Components ---

const GrainOverlay = () => (
  <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.03] contrast-150" 
       style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }}></div>
);

const SectionTitle = ({ children, number }: { children: React.ReactNode, number: string }) => (
  <div className="flex items-baseline gap-4 mb-16 border-b border-white/10 pb-4">
    <span className="font-mono text-volt text-sm">{number}</span>
    <h2 className="text-4xl md:text-6xl font-serif italic">{children}</h2>
  </div>
);

const ProjectCard = ({ title, category, year }: { title: string, category: string, year: string }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="group flex items-center justify-between py-8 border-b border-white/10 cursor-pointer"
  >
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-white/40 uppercase tracking-widest">{category}</span>
      <h3 className="text-3xl md:text-5xl font-serif group-hover:text-volt transition-colors">{title}</h3>
    </div>
    <div className="flex items-center gap-8">
      <span className="font-mono text-lg hidden md:block">{year}</span>
      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-volt group-hover:border-volt group-hover:text-black transition-all">
        <ArrowUpRight size={20} />
      </div>
    </div>
  </motion.div>
);

const RoadmapStep = ({ year, title, desc, tag }: { year: string, title: string, desc: string, tag: string }) => (
  <div className="relative pl-12 pb-16 border-l border-white/10 last:border-0">
    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-volt rounded-full" />
    <span className="font-mono text-volt text-sm mb-2 block">{year} — {tag}</span>
    <h4 className="text-2xl font-serif mb-4">{title}</h4>
    <p className="text-white/60 max-w-md leading-relaxed">{desc}</p>
  </div>
);

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="bg-[#0A0A0A] text-[#F4F4F4] min-h-screen selection:bg-volt selection:text-black font-sans overflow-x-hidden">
      <Head>
        <title>Identity — Freelancer & Instructor</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet" />
      </Head>

      <GrainOverlay />
      
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-volt z-[100] origin-left" style={{ scaleX }} />

      {/* Navigation */}
      <nav className="fixed w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <span className="font-serif italic text-2xl tracking-tighter uppercase">Identity.</span>
        <div className="hidden md:flex gap-12 font-mono text-xs uppercase tracking-[0.2em]">
          <a href="#work" className="hover:text-volt transition-colors">Work</a>
          <a href="#roadmap" className="hover:text-volt transition-colors">Roadmap</a>
          <a href="#contact" className="hover:text-volt transition-colors">Contact</a>
        </div>
        <button className="md:hidden text-volt font-mono">MENU</button>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="h-screen flex flex-col justify-center px-8 md:px-24 relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-[12vw] md:text-[8vw] leading-[0.9] font-serif mb-8">
              Crafting <br />
              <span className="italic text-volt">Knowledge</span> & <br />
              Experiences.
            </h1>
            <div className="flex flex-col md:flex-row gap-12 items-start md:items-end">
              <p className="max-w-sm text-lg text-white/60 leading-relaxed font-light">
                프리랜서 디자이너이자 개발 교육자로서, 복잡한 기술을 아름다운 경험으로 번역하는 작업을 합니다. 
              </p>
              <div className="flex gap-4 font-mono text-xs">
                <div className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer">UI/UX DESIGN</div>
                <div className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer">DEVELOPMENT</div>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-12 right-12 animate-bounce">
            <ArrowDown className="text-volt" />
          </div>
        </section>

        {/* WORK SECTION */}
        <section id="work" className="px-8 md:px-24 py-32 bg-[#0F0F0F]">
          <SectionTitle number="01">Selected Archives</SectionTitle>
          <div className="mt-12">
            <ProjectCard title="Aether Design System" category="Brand / Web" year="2025" />
            <ProjectCard title="Lumiere EdTech Platform" category="Fullstack Dev" year="2024" />
            <ProjectCard title="Modern Next.js Lecture" category="Education" year="2024" />
            <ProjectCard title="Quantum Marketing Page" category="Creative Coding" year="2023" />
          </div>
          <motion.div className="mt-16 flex justify-center">
             <button className="group flex items-center gap-2 font-mono text-sm border-b border-volt pb-2 hover:text-volt transition-colors">
                VIEW ALL PROJECTS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        </section>

        {/* ROADMAP SECTION */}
        <section id="roadmap" className="px-8 md:px-24 py-32 flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3 sticky top-32 h-fit">
            <SectionTitle number="02">Roadmap</SectionTitle>
            <p className="text-white/40 font-mono text-sm leading-loose uppercase tracking-wider">
              지속 가능한 성장을 위한 <br /> 기록의 여정.
            </p>
          </div>
          <div className="md:w-2/3 mt-8">
            <RoadmapStep 
              year="2024 — PRESENT" 
              tag="EDUCATION"
              title="Senior Tech Instructor at 'V'" 
              desc="프론트엔드 아키텍처 및 디자인 시스템 구축 전문가 과정 리드 강사. 누적 수강생 2,000명 돌파."
            />
             <RoadmapStep 
              year="2022 — 2024" 
              tag="FREELANCE"
              title="Creative Developer for Global Brands" 
              desc="해외 스타트업 및 디자인 에이전시와의 협업을 통해 인터랙티브 웹 사이트 20+ 프로젝트 완수."
            />
             <RoadmapStep 
              year="2020 — 2022" 
              tag="INDUSTRY"
              title="Product Designer at 'K' Tech" 
              desc="핀테크 플랫폼의 모바일 인터페이스 고도화 및 사용자 경험 설계 주도."
            />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="px-8 md:px-24 py-40 border-t border-white/10 relative overflow-hidden">
          <div className="absolute top-[-10vw] right-[-10vw] text-[40vw] font-serif italic text-white/[0.02] pointer-events-none select-none">
            Hello.
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-6xl md:text-8xl font-serif mb-12 italic">Let's <br /> <span className="text-volt">Collaborate</span>.</h2>
              <div className="flex gap-8">
                <a href="#" className="p-4 border border-white/10 rounded-full hover:bg-volt hover:text-black transition-all"><Mail size={24} /></a>
                <a href="#" className="p-4 border border-white/10 rounded-full hover:bg-volt hover:text-black transition-all"><Instagram size={24} /></a>
                <a href="#" className="p-4 border border-white/10 rounded-full hover:bg-volt hover:text-black transition-all"><Github size={24} /></a>
              </div>
            </div>
            
            <div className="bg-[#151515] p-8 md:p-12 rounded-sm border border-white/5">
              <form className="flex flex-col gap-8 font-mono text-sm">
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 uppercase tracking-tighter">Your Name</label>
                  <input type="text" className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-volt transition-colors" placeholder="NAME" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 uppercase tracking-tighter">Your Email</label>
                  <input type="email" className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-volt transition-colors" placeholder="EMAIL@DOMAIN.COM" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white/40 uppercase tracking-tighter">Message</label>
                  <textarea rows={4} className="bg-transparent border-b border-white/20 py-2 focus:outline-none focus:border-volt transition-colors resize-none" placeholder="HOW CAN I HELP YOU?" />
                </div>
                <button className="bg-volt text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/20">
        <p>© 2026 IDENTITY — ALL RIGHTS RESERVED.</p>
        <p>DESIGNED BY YOUR NAME IN SEOUL.</p>
      </footer>

      <style jsx global>{`
        body {
          cursor: crosshair;
        }
        .text-volt { color: #CFFF04; }
        .bg-volt { background-color: #CFFF04; }
        .border-volt { border-color: #CFFF04; }
      `}</style>
    </div>
  );
}