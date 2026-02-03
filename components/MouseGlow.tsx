'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseGlow() {
    const [mounted, setMounted] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the glow
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const glowX = useSpring(mouseX, springConfig);
    const glowY = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-[9999]"
            style={{
                x: glowX,
                y: glowY,
                translateX: '-50%',
                translateY: '-50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 30%, transparent 70%)',
                filter: 'blur(40px)',
            }}
        />
    );
}
