interface HeroProps {
    heading: string;
    subheading?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function Hero({
    heading,
    subheading,
    backgroundImage,
    ctaText,
    ctaLink,
}: HeroProps) {
    return (
        <section
            className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: backgroundImage
                    ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                    {heading}
                </h1>
                {subheading && (
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                        {subheading}
                    </p>
                )}
                {ctaText && ctaLink && (
                    <a
                        href={ctaLink}
                        className="inline-block bg-white text-purple-600 font-semibold px-8 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up animation-delay-400"
                    >
                        {ctaText}
                    </a>
                )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </section>
    );
}
