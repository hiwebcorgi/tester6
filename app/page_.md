import Hero from '@/components/Hero';
import Board from '@/components/Board';
import ContactForm from '@/components/ContactForm';

// TODO: After running `npm run dev` successfully, uncomment the TinaCMS client integration
// import client from '@/tina/__generated__/client';

export default async function Home() {
  // Static content for initial setup
  // After TinaCMS generates the client, you can uncomment the code below and remove this static data

  const page = {
    title: 'Home',
    hero: {
      heading: 'Welcome to Zero-Cost Web Factory',
      subheading: 'Build and manage beautiful websites without any ongoing costs. Self-hosted CMS powered by GitHub and TinaCMS.',
      backgroundImage: '',
      ctaText: 'Get Started',
      ctaLink: '#contact',
    },
    body: `
      <h2>About</h2>
      <p>Zero-Cost Web Factory는 지속적인 유지비용 없이 웹사이트를 제작하고 관리할 수 있는 혁신적인 솔루션입니다.</p>
      
      <h3>Main Features</h3>
      <ul>
        <li><strong>무료 호스팅</strong>: Vercel의 무료 플랜 활용</li>
        <li><strong>시각적 편집</strong>: TinaCMS를 통한 직관적인 콘텐츠 관리</li>
        <li><strong>GitHub 연동</strong>: Git 기반 버전 관리 및 데이터 저장</li>
        <li><strong>자동 배포</strong>: 콘텐츠 수정 시 자동으로 사이트 재배포</li>
      </ul>
      
      <h3>Benefits</h3>
      <ol>
        <li>서버 비용 0원</li>
        <li>데이터베이스 불필요</li>
        <li>개발자 개입 최소화</li>
        <li>완전한 데이터 소유권</li>
      </ol>
    `,
  };

  const posts = [
    {
      title: '첫 번째 공지사항',
      date: '2026-01-13T22:00:00+09:00',
      body: '<p>Zero-Cost Web Factory 보일러플레이트에 오신 것을 환영합니다!</p>',
      _sys: { filename: 'welcome' },
    },
  ];

  /* 
  // Uncomment this after running `npm run dev` successfully and TinaCMS generates the client:
  
  const pageResponse = await client.queries.page({
    relativePath: 'home.md',
  });
  const page = pageResponse.data.page;

  const postsResponse = await client.queries.postConnection();
  const posts = postsResponse.data.postConnection.edges?.map((edge) => edge?.node) || [];
  */

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Hero
        heading={page.hero.heading}
        subheading={page.hero.subheading || ''}
        backgroundImage={page.hero.backgroundImage || ''}
        ctaText={page.hero.ctaText || ''}
        ctaLink={page.hero.ctaLink || ''}
      />

      {/* About/Content Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <article
            className="prose prose-lg prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: page.body || '' }}
          />
        </div>
      </section>

      {/* Board Section */}
      <Board posts={posts} />

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Zero-Cost Web Factory. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Next.js, TinaCMS, and Vercel
          </p>
        </div>
      </footer>
    </main>
  );
}
