import Link from 'next/link';
import { useParams } from 'next/navigation';

interface BlogPost {
    id: string;
    title: string;
    date: string;
}

interface BlogSidebarProps {
    posts: BlogPost[];
}

export default function BlogSidebar({ posts }: BlogSidebarProps) {
    const params = useParams();
    const currentId = params?.id;

    return (
        <aside className="hidden lg:block w-72 shrink-0">
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.5);
                }
            `}</style>
            <div className="sticky top-32 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar pr-2">
                {/* Search / Filter could go here */}

                {/* Recent Posts List */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold mb-4 text-white">최신 포스트</h3>
                    <div className="space-y-3">
                        {posts.slice(0, 10).map((post) => {
                            const isActive = currentId === post.id;
                            return (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    className={`block group transition-all duration-200 ${isActive ? 'translate-x-1' : ''
                                        }`}
                                >
                                    <h4
                                        className={`text-sm font-medium leading-relaxed mb-1 transition-colors ${isActive
                                            ? 'text-emerald-400'
                                            : 'text-white/70 group-hover:text-emerald-400'
                                            }`}
                                    >
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-white/30">
                                        <span>{post.date}</span>
                                    </div>
                                </Link>
                            );
                        })}
                        {posts.length === 0 && (
                            <p className="text-white/40 text-sm">포스트가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* Categories could go here in future */}
            </div>
        </aside>
    );
}
