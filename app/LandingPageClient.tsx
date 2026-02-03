// app/LandingPageClient.tsx - Client Component
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useEditor } from './EditorProvider';
import { useMakeEditable } from './hooks/useMakeEditable';
import MouseGlow from '@/components/MouseGlow';
import MagneticButton from '@/components/MagneticButton';
import {
    ArrowRight,
    CheckCircle2,
    BarChart3,
    Zap,
    Settings,
    MousePointer2,
    ShieldCheck,
    TrendingDown,
    Cloud,
    Database,
    Globe,
    Lock,
    HelpCircle,
    MessageSquare,
    FileText,
    LayoutDashboard
} from 'lucide-react';

// --- Components ---

// Header and Footer removed for singleton integration in SiteLayout
const Hero = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
                className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500/40 rounded-full"
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-1/3 right-1/4 w-1 h-1 bg-emerald-500/60 rounded-full"
                animate={{
                    y: [0, 40, 0],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />
            <motion.div
                className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-500/50 rounded-full"
                animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            />
        </div>

        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-8 rounded-md backdrop-blur-sm"
                    {...makeEditable('hero.badge', homeData?.hero?.badge || '⚡ Web Development Revolution', 'Hero Badge', 'text')}
                >
                    {homeData?.hero?.badge || '⚡ Web Development Revolution'}
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-6xl md:text-9xl font-black leading-[1] tracking-tighter mb-10"
                    {...makeEditable('hero.title', homeData?.hero?.title || '사장님, 언제까지\n홈페이지', 'Hero Title', 'textarea')}
                >
                    {homeData?.hero?.title?.split('\n')[0] || '사장님, 언제까지'}<br />
                    {homeData?.hero?.title?.split('\n')[1] || '홈페이지'} <span className="relative inline-block">
                        <span
                            className="relative z-10 text-black px-3 italic"
                            {...makeEditable('hero.highlight', homeData?.hero?.highlight || "'월세'", 'Hero Highlight', 'text')}
                        >
                            {homeData?.hero?.highlight || "'월세'"}
                        </span>
                        <span className="absolute inset-0 bg-emerald-500 -rotate-1 rounded-sm" />
                    </span>
                    <span {...makeEditable('hero.titleSuffix', homeData?.hero?.titleSuffix || '를\n내실 겁니까?', 'Hero Title Suffix', 'textarea')}>
                        {homeData?.hero?.titleSuffix?.split('\n').map((line: string, i: number) => (
                            <React.Fragment key={i}>
                                {line}{i < homeData?.hero?.titleSuffix?.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        )) || <>를<br />내실 겁니까?</>}
                    </span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative mb-12"
                >
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-transparent" />
                    <p
                        className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium pl-4"
                        {...makeEditable('hero.description', homeData?.hero?.description || '초기 제작비 1회면 끝입니다.', 'Hero Description', 'textarea')}
                    >
                        {homeData?.hero?.description?.split('\n').map((line: string, i: number) => (
                            <React.Fragment key={i}>
                                {line.includes('Zero-Cost') ? (
                                    <><strong className="text-white font-black bg-gradient-to-r from-emerald-500 to-emerald-300 bg-clip-text text-transparent">Zero-Cost Web Factory</strong>가 시작합니다.</>
                                ) : (
                                    <>{line} <br /></>
                                )}
                            </React.Fragment>
                        )) || '초기 제작비 1회면 끝입니다.'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <MagneticButton
                        className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-lg rounded-sm overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all"
                        {...makeEditable('hero.ctaText', homeData?.hero?.ctaText || '유지비 탈출 상담하기', 'Hero CTA Text', 'text')}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative">{homeData?.hero?.ctaText || '유지비 탈출 상담하기'}</span>
                        <ArrowRight className="relative group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                    <div
                        className="flex items-center gap-3 px-6 py-5 bg-white/5 border border-white/10 text-white/60 font-medium rounded-sm backdrop-blur-sm"
                        {...makeEditable('hero.ctaSubtext', homeData?.hero?.ctaSubtext || 'Vercel + Next.js 인프라 지원', 'Hero CTA Subtext', 'text')}
                    >
                        <span className="relative flex w-3 h-3">
                            <span className="absolute inline-flex w-full h-full bg-emerald-500 rounded-full opacity-75 animate-ping" />
                            <span className="relative inline-flex w-3 h-3 bg-emerald-500 rounded-full" />
                        </span>
                        {homeData?.hero?.ctaSubtext || 'Vercel + Next.js 인프라 지원'}
                    </div>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10"
                >
                    {(homeData?.stats || []).map((stat: any, i: number) => (
                        <div key={i}>
                            <div className="text-3xl font-black text-emerald-500">{stat.value}</div>
                            <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    </section>
);

const Comparison = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section id="problem" className="py-24 bg-[#050505] border-y border-white/5">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2
                        className="text-4xl md:text-5xl font-black mb-8 leading-tight"
                        {...makeEditable('comparison.title', homeData?.comparison?.title || '사장님의 돈이\n줄줄 새고 있는 이유', 'Comparison Title', 'textarea')}
                    >
                        {homeData?.comparison?.title?.split('\n').map((line: string, i: number) => (
                            <React.Fragment key={i}>
                                {i === 1 ? <span className="text-red-500">{line}</span> : line}
                                {i < (homeData?.comparison?.title?.split('\n').length - 1) && <br />}
                            </React.Fragment>
                        )) || <>사장님의 돈이 <br /><span className="text-red-500">줄줄 새고 있는 이유</span></>}
                    </h2>
                    <p className="text-lg text-white/60 mb-8 leading-relaxed">
                        {homeData?.comparison?.description?.split('\n\n').map((para: string, i: number) => (
                            <React.Fragment key={i}>
                                {para.startsWith('"') ? (
                                    <strong className="text-white">{para}</strong>
                                ) : (
                                    para.split('\n').map((line: string, j: number) => (
                                        <React.Fragment key={j}>{line}<br /></React.Fragment>
                                    ))
                                )}
                                {i < homeData?.comparison?.description?.split('\n\n').length - 1 && <br />}
                            </React.Fragment>
                        )) || '대부분의 홈페이지 업체는 사장님을 \'플랫폼\'에 가속시킵니다.'}
                    </p>
                    <div className="space-y-4">
                        {(homeData?.comparison?.problemList || []).map((text: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-white/80">
                                <TrendingDown className="text-red-500 w-5 h-5" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-20 uppercase tracking-widest">{homeData?.comparison?.tableNote || '3-Year Cost Analysis'}</div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-xs text-white/40 uppercase tracking-widest">
                                <th className="pb-4 font-medium">{homeData?.comparison?.tableHeaders?.item || '항목'}</th>
                                <th className="pb-4 font-medium text-red-500/60 text-right">{homeData?.comparison?.tableHeaders?.legacy || '타 솔루션'}</th>
                                <th className="pb-4 font-medium text-emerald-500 text-right underline underline-offset-4">{homeData?.comparison?.tableHeaders?.zeropack || 'ZEROPACK'}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {(homeData?.comparison?.tableRows || []).map((row: any, i: number) => (
                                <tr key={i} className="border-b border-white/5">
                                    <td className="py-6 text-white/60">{row.item}</td>
                                    <td className="py-6 text-white/40 text-right">{row.legacy}</td>
                                    <td className="py-6 text-emerald-400 text-right font-bold text-lg">{row.zeropack}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className="pt-8 font-bold text-lg">{homeData?.comparison?.tableSummary?.label || '합계 (3년 기준)'}</td>
                                <td className="pt-8 text-right text-red-500 font-black text-xl line-through opacity-50 italic">{homeData?.comparison?.tableSummary?.legacy || '1,080,000원+'}</td>
                                <td className="pt-8 text-right text-emerald-500 font-black text-3xl">{homeData?.comparison?.tableSummary?.zeropack || '0원'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
);

const FeatureCard = ({ num, icon: Icon, title, highlight, points, variant = 'default', span = '' }: any) => {
    const variants = {
        default: 'bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:from-white/10 hover:to-white/5',
        accent: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-500/10',
        strong: 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-400 text-black hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: num * 0.1 }}
            className={`relative p-8 border rounded-xl transition-all duration-300 group overflow-hidden ${variants[variant as keyof typeof variants]} ${span}`}
        >
            {/* Number badge */}
            <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${variant === 'strong' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-500'}`}>
                {num}
            </div>

            {/* Icon */}
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${variant === 'strong' ? 'bg-black/20' : 'bg-emerald-500/20'}`}>
                <Icon className={`w-8 h-8 ${variant === 'strong' ? 'text-black' : 'text-emerald-500'}`} />
            </div>

            {/* Title with highlight */}
            <h3 className={`text-2xl font-black mb-4 leading-tight ${variant === 'strong' ? 'text-black' : ''}`}>
                {title}
                {highlight && (
                    <span className={`block text-3xl mt-1 ${variant === 'strong' ? 'text-black' : 'text-emerald-500'}`}>
                        {highlight}
                    </span>
                )}
            </h3>

            {/* Bullet points */}
            <ul className="space-y-2">
                {points.map((point: string, i: number) => (
                    <li key={i} className={`flex items-start gap-2 text-sm font-medium ${variant === 'strong' ? 'text-black/80' : 'text-white/60'}`}>
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${variant === 'strong' ? 'text-black' : 'text-emerald-500'}`} />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        </motion.div>
    );
};

const Features = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section id="features" className="py-32 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <span
                    className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 rounded-full"
                    {...makeEditable('features.badge', homeData?.features?.badge || '🚀 Revolutionary Features', 'Features Badge', 'text')}
                >
                    {homeData?.features?.badge || '🚀 Revolutionary Features'}
                </span>
                <h2
                    className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                    {...makeEditable('features.title', homeData?.features?.title || '왜 10배 더\n효율적일까요?', 'Features Title', 'textarea')}
                >
                    {homeData?.features?.title?.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                            {line.includes('10배') ? (
                                <>왜 <span className="text-emerald-500">10배 더</span></>
                            ) : (
                                line
                            )}
                            {i < homeData?.features?.title?.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </h2>
                <p
                    className="text-xl text-white/50 max-w-2xl mx-auto"
                    {...makeEditable('features.description', homeData?.features?.description || '비용만 아끼는게 아닙니다. 기능도, 성능도, 관리도 압도적입니다.', 'Features Description', 'textarea')}
                >
                    {homeData?.features?.description || '비용만 아끼는게 아닙니다. 기능도, 성능도, 관리도 압도적입니다.'}
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {(homeData?.features?.cards || []).map((card: any, i: number) => (
                    <FeatureCard
                        key={i}
                        num={String(i + 1).padStart(2, '0')}
                        icon={[MousePointer2, Zap, BarChart3, LayoutDashboard, ShieldCheck][i]}
                        title={card.title}
                        highlight={card.highlight}
                        points={card.points}
                        variant={card.variant}
                        span={card.span}
                    />
                ))}
            </div>
        </div>
    </section>
);
const TargetAudience = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section className="py-24 bg-[#080808] border-y border-white/5">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <span className="text-emerald-500 font-bold tracking-widest uppercase text-xs mb-4 block">{homeData?.targetAudience?.badge || 'Target Audience'}</span>
                <h2
                    className="text-3xl md:text-5xl font-black mb-6 leading-tight"
                    {...makeEditable('targetAudience.title', homeData?.targetAudience?.title || '대규모 엔터프라이즈가 아닌,\n합리적 리더를 위해 설계되었습니다.', 'Target Audience Title', 'textarea')}
                >
                    {homeData?.targetAudience?.title?.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                            {line.includes('합리적') ? (
                                <span className="text-white">{line}</span>
                            ) : (
                                line
                            )}
                            {i < homeData?.targetAudience?.title?.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    )) || <>대규모 엔터프라이즈가 아닌,<br /><span className="text-white">합리적 리더</span>를 위해 설계되었습니다.</>}
                </h2>
                <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
                    {homeData?.targetAudience?.description?.split('\n').map((line: string, i: number) => (
                        <React.Fragment key={i}>
                            {line}
                            {i < homeData?.targetAudience?.description?.split('\n').length - 1 && <br className="hidden md:block" />}
                        </React.Fragment>
                    )) || '매월 수천만 명의 트래픽을 감당해야 하는 대형 플랫폼이 아니라면, 고정비가 발생하는 기존 호스팅은 낭비입니다.'}
                </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
                {(homeData?.targetAudience?.cards || []).map((card: any, i: number) => (
                    <div key={i} className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-white/[0.07] transition-all group">
                        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ring-1 ring-white/10 group-hover:ring-emerald-500/50">
                            {[TrendingDown, ShieldCheck, MousePointer2, Settings][i] && React.createElement([TrendingDown, ShieldCheck, MousePointer2, Settings][i], { className: "w-6 h-6 text-emerald-500" })}
                        </div>
                        <h3 className="font-bold text-lg text-white mb-3">{card.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed">{card.text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TechStack = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section className="py-24 overflow-hidden relative">
        <div className="container mx-auto px-6 flex flex-col items-center">
            <h2
                className="text-3xl font-black mb-12 uppercase tracking-tighter"
                {...makeEditable('techStack.title', homeData?.techStack?.title || '압도적 성능의 비밀', 'Tech Stack Title', 'text')}
            >
                {homeData?.techStack?.title || '압도적 성능의 비밀'}
            </h2>

            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Visual representation of tech stack */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-bold text-2xl">▲</div>
                    <span className="font-mono text-xs">Vercel</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-bold text-2xl">N</div>
                    <span className="font-mono text-xs">Next.js</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-bold text-2xl">G</div>
                    <span className="font-mono text-xs">GitHub</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center font-bold text-2xl">E</div>
                    <span className="font-mono text-xs">EditMode</span>
                </div>
            </div>
            <p className="mt-12 text-white/40 text-sm max-w-2xl text-center">
                {homeData?.techStack?.description || 'Facebook, Netflix, Uber가 사용하는 최신 기술 스택(React, Next.js)을 귀사의 홈페이지에 그대로 적용했습니다.'}
            </p>
        </div >
    </section >
);

const DeveloperFreedom = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section className="py-32 bg-gradient-to-b from-[#050505] to-black border-y border-white/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 rounded-full">
                    💎 Pure Next.js Architecture
                </span>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                    플랫폼 종속이 아닌,<br />
                    <span className="text-emerald-500">완전한 자유</span>를 드립니다
                </h2>
                <p className="text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
                    타 플랫폼은 사장님을 <strong className="text-white">'고객'</strong>으로 묶어둡니다.<br />
                    저희는 사장님께 <strong className="text-emerald-400">'소스코드'</strong>를 드립니다.
                </p>
            </motion.div>

            {/* Comparison Grid */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
                {/* Platform-based (Bad) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl relative"
                >
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                        ❌ 플랫폼 기반
                    </div>
                    <h3 className="text-2xl font-black mb-6 text-white/80">타 솔루션의 한계</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-white/60">
                            <Lock className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white/80">플랫폼 종속</strong><br />
                                <span className="text-sm">플랫폼을 떠나면 모든 것을 잃습니다</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-white/60">
                            <Settings className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white/80">제한된 커스터마이징</strong><br />
                                <span className="text-sm">플랫폼이 허용한 범위 내에서만 수정 가능</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-white/60">
                            <TrendingDown className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white/80">수정 지옥</strong><br />
                                <span className="text-sm">간단한 수정도 업체에 의뢰하거나 추가 비용 발생</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 text-white/60">
                            <Cloud className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white/80">확장성 제로</strong><br />
                                <span className="text-sm">비즈니스 성장에 맞춰 기능 추가 불가능</span>
                            </div>
                        </li>
                    </ul>
                </motion.div>

                {/* Next.js based (Good) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="p-8 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl relative"
                >
                    <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full">
                        ✅ 순수 Next.js
                    </div>
                    <h3 className="text-2xl font-black mb-6">ZeroPack의 자유</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>100% 소스코드 소유</strong><br />
                                <span className="text-sm text-white/70">모든 코드가 사장님의 GitHub에 저장됩니다</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>무제한 커스터마이징</strong><br />
                                <span className="text-sm text-white/70">개발자라면 원하는 대로 모든 것을 수정 가능</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>수정 자유</strong><br />
                                <span className="text-sm text-white/70">언제든지 개발자를 고용해 직접 수정 가능</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>무한 확장성</strong><br />
                                <span className="text-sm text-white/70">비즈니스 성장에 맞춰 기능 무제한 추가 가능</span>
                            </div>
                        </li>
                    </ul>
                </motion.div>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group"
                >
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Globe className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-black mb-3">표준 기술 스택</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                        React, Next.js는 전 세계 개발자들이 사용하는 표준입니다. 어디서든 개발자를 구할 수 있습니다.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group"
                >
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Database className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-black mb-3">데이터 완전 소유</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                        모든 데이터는 사장님의 GitHub에 저장됩니다. 플랫폼이 망해도 데이터는 안전합니다.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="p-8 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/50 transition-all group"
                >
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-black mb-3">미래 대비 완료</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                        AI 연동, 결제 시스템, 회원 관리 등 필요한 기능을 언제든지 추가할 수 있습니다.
                    </p>
                </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 text-center"
            >
                <div className="inline-block p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl">
                    <p className="text-2xl font-black mb-4">
                        <span className="text-white/60">플랫폼에 갇히지 마세요.</span><br />
                        <span className="text-emerald-400">진짜 자산을 소유하세요.</span>
                    </p>
                    <p className="text-white/40 text-sm max-w-2xl">
                        ZeroPack은 단순한 홈페이지가 아닙니다.<br className="hidden md:block" />
                        사장님이 완전히 소유하고 제어할 수 있는 <strong className="text-white">디지털 자산</strong>입니다.
                    </p>
                </div>
            </motion.div>
        </div>
    </section>
);

const Process = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section id="process" className="py-24 bg-[#050505] border-y border-white/5">
        <div className="container mx-auto px-6 text-center">
            <h2
                className="text-3xl font-black mb-12"
                {...makeEditable('process.title', homeData?.process?.title || '서비스 프로세스', 'Process Title', 'text')}
            >
                {homeData?.process?.title || '서비스 프로세스'}
            </h2>
            <div className="grid md:grid-cols-4 gap-4 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                {(homeData?.process?.steps || []).map((step: any, i: number) => (
                    <div key={i} className="p-8 bg-[#0A0A0A] border border-white/10 text-left relative z-10 group hover:-translate-y-2 transition-transform duration-300">
                        <span className="text-5xl font-black text-white/5 absolute top-2 right-4">{step.number}</span>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full mb-6" />
                        <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Pricing = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section id="pricing" className="py-24 bg-white text-black">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                <div>
                    <h2
                        className="text-5xl font-black uppercase tracking-tighter mb-4"
                        {...makeEditable('pricing.title', homeData?.pricing?.title || '투명한 가격 정책', 'Pricing Title', 'text')}
                    >
                        {homeData?.pricing?.title || '투명한 가격 정책'}
                    </h2>
                    <p
                        className="text-black/60 max-w-lg"
                        {...makeEditable('pricing.description', homeData?.pricing?.description || '한 달 치 광고비도 안 되는 비용으로 평생 유지되는 사옥을 지어드립니다.', 'Pricing Description', 'textarea')}
                    >
                        {homeData?.pricing?.description || '한 달 치 광고비도 안 되는 비용으로 평생 유지되는 사옥을 지어드립니다.'}
                    </p>
                </div>
                <div
                    className="text-xs font-bold uppercase tracking-widest text-black/40 border-b border-black pb-1"
                    {...makeEditable('pricing.vatText', homeData?.pricing?.vatText || 'VAT 별도 기준', 'Pricing VAT Text', 'text')}
                >
                    {homeData?.pricing?.vatText || 'VAT 별도 기준'}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-1">
                {(homeData?.pricing?.plans || []).map((plan: any, i: number) => (
                    <div key={i} className="p-10 border border-black/10 hover:bg-emerald-400 transition-colors group relative">
                        {plan.bestChoice && <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">Best Choice</div>}
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-2 text-black/40">{plan.name}</h4>
                        <p className="text-sm font-bold mb-8">{plan.description}</p>
                        <div className="flex items-baseline gap-1 mb-10">
                            <span className="text-6xl font-black">{plan.price}</span>
                            <span className="font-bold">원</span>
                        </div>
                        <ul className="space-y-4 mb-12">
                            {plan.features.map((f: string, j: number) => (
                                <li key={j} className="flex items-center gap-3 text-sm font-bold">
                                    <CheckCircle2 size={16} />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 bg-black text-white font-bold group-hover:bg-white group-hover:text-black transition-colors">
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border-b border-white/10 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 flex items-center justify-between text-left hover:text-emerald-400 transition-colors"
            >
                <span className="text-lg font-bold pr-8">{q}</span>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ArrowRight className="rotate-90" />
                </div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="pb-8 text-white/50 leading-relaxed max-w-2xl">
                    {a}
                </p>
            </motion.div>
        </div>
    );
};

const FAQ = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section id="faq" className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div>
                <h2
                    className="text-4xl font-black mb-4"
                    {...makeEditable('faq.title', homeData?.faq?.title || '자주 묻는 질문', 'FAQ Title', 'text')}
                >
                    {homeData?.faq?.title || '자주 묻는 질문'}
                </h2>
                <p
                    className="text-white/40 mb-8"
                    {...makeEditable('faq.description', homeData?.faq?.description || '궁금한 점이 있으신가요?', 'FAQ Description', 'text')}
                >
                    {homeData?.faq?.description || '궁금한 점이 있으신가요?'}
                </p>
            </div>
            <div className="md:col-span-2">
                {(homeData?.faq?.items || []).map((item: any, i: number) => (
                    <FAQItem key={i} q={item.question} a={item.answer} />
                ))}
            </div>
        </div>
    </section>
);

const FinalCTA = ({ homeData, makeEditable }: { homeData: any; makeEditable: any }) => (
    <section className="py-32 relative overflow-hidden bg-emerald-500 text-black text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:20px_20px]" />

        <div className="container mx-auto px-6 relative z-10">
            <h2
                className="text-4xl md:text-6xl font-black mb-8 leading-tight"
                {...makeEditable('finalCta.title', homeData?.finalCta?.title || '리스크 제로 보장', 'Final CTA Title', 'text')}
            >
                {homeData?.finalCta?.title || '리스크 제로 보장'}
            </h2>
            <p
                className="text-xl md:text-2xl font-medium mb-12 max-w-3xl mx-auto opacity-80"
                {...makeEditable('finalCta.description', homeData?.finalCta?.description || '"제작 후 평생 유지비 0원이 아님이 확인될 경우,\n이유 불문 제작비의 200%를 환불해 드립니다."', 'Final CTA Description', 'textarea')}
            >
                {homeData?.finalCta?.description?.split('\n').map((line: string, i: number) => (
                    <React.Fragment key={i}>
                        {line.includes('200%') ? (
                            <>이유 불문 <strong className="underline decoration-black/20 underline-offset-4">제작비의 200%를 환불</strong>해 드립니다.</>
                        ) : (
                            <>{line} <br /></>
                        )}
                    </React.Fragment>
                )) || '"제작 후 평생 유지비 0원이 아님이 확인될 경우, 이유 불문 제작비의 200%를 환불해 드립니다."'}
            </p>
            <MagneticButton className="px-12 py-6 bg-black text-emerald-500 font-black text-xl md:text-2xl rounded-sm hover:scale-105 transition-transform shadow-2xl">
                {homeData?.finalCta?.buttonText || '선착순 도입 문의하기'}
            </MagneticButton>
            <p className="mt-8 text-sm font-bold opacity-50">
                {homeData?.finalCta?.limitText || '이번 달 잔여 TO: 3팀'}
            </p>
        </div>
    </section>
);

// Footer component is now imported from @/components/Footer

// Temporary stub for tinaField - to be replaced with custom editing
const tinaField = (...args: any[]) => ({});

export default function LandingPageClient({ data }: { data: any }) {
    const homeData = data;
    const { makeEditable } = useMakeEditable();

    return (
        <div className="bg-black text-white selection:bg-emerald-500 selection:text-black antialiased">
            <MouseGlow />
            <Hero homeData={homeData} makeEditable={makeEditable} />
            <Comparison homeData={homeData} makeEditable={makeEditable} />
            <Features homeData={homeData} makeEditable={makeEditable} />
            <TargetAudience homeData={homeData} makeEditable={makeEditable} />
            <TechStack homeData={homeData} makeEditable={makeEditable} />
            <DeveloperFreedom homeData={homeData} makeEditable={makeEditable} />
            <Process homeData={homeData} makeEditable={makeEditable} />
            <FAQ homeData={homeData} makeEditable={makeEditable} />
            <Pricing homeData={homeData} makeEditable={makeEditable} />
            <FinalCTA homeData={homeData} makeEditable={makeEditable} />
        </div>
    );
}
