interface Post {
    title: string;
    date: string;
    body: string;
    _sys: {
        filename: string;
    };
}

interface BoardProps {
    posts: Post[];
    title?: string;
}

export default function Board({ posts, title = '공지사항' }: BoardProps) {
    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {title}
                </h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {posts && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <article
                                key={post._sys.filename}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                                        {post.title}
                                    </h3>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-2"></div>
                                </div>

                                <time className="text-sm text-gray-500 block mb-4">
                                    {new Date(post.date).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>

                                <div
                                    className="text-gray-600 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: post.body }}
                                />

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-purple-600 hover:text-purple-700 font-medium text-sm cursor-pointer transition-colors">
                                        자세히 보기 →
                                    </span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            등록된 게시물이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
