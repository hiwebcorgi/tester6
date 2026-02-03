'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseFollower() {
    const [isPointer, setIsPointer] = useState(false);
    const [mounted, setMounted] = useState(false);

    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 700, mass: 0.2 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        setMounted(true);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            const target = e.target as HTMLElement;
            const isClickable = 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.closest('button') !== null || 
                target.closest('a') !== null ||
                window.getComputedStyle(target).cursor === 'pointer';
            
            setIsPointer(isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    if (!mounted) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 w-3 h-3 rounded-full bg-emerald-500 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 0.5 : 1,
                }}
                transition={{ duration: 0.15 }}
            />

            {/* Outer ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-emerald-500/30 pointer-events-none z-[9998]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                animate={{
                    scale: isPointer ? 1.5 : 1,
                    borderColor: isPointer ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.3)',
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Glow effect */}
            <motion.div
                className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-[9997]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
                animate={{
                    scale: isPointer ? 1.3 : 1,
                    opacity: isPointer ? 0.8 : 0.5,
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Trailing particles */}
            <TrailingParticles x={cursorXSpring} y={cursorYSpring} />
        </>
    );
}

function TrailingParticles({ x, y }: { x: any; y: any }) {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        let lastTime = Date.now();
        const unsubscribeX = x.on('change', (latestX: number) => {
            const now = Date.now();
            if (now - lastTime > 50) {
                const latestY = y.get();
                setParticles(prev => [
                    ...prev.slice(-8),
                    { id: now, x: latestX, y: latestY }
                ]);
                lastTime = now;
            }
        });

        return () => unsubscribeX();
    }, [x, y]);

    return (
        <>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="fixed top-0 left-0 w-1 h-1 rounded-full bg-emerald-500/40 pointer-events-none z-[9996]"
                    initial={{
                        x: particle.x,
                        y: particle.y,
                        scale: 1,
                        opacity: 1,
                    }}
                    animate={{
                        scale: 0,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{
                        translateX: '-50%',
                        translateY: '-50%',
                    }}
                />
            ))}
        </>
    );
}