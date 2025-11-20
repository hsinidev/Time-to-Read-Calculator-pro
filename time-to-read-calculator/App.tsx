import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import ReadingTimeTool from './components/ReadingTimeTool';
import { SeoArticleContent, WebSiteSchema, WebApplicationSchema, ArticleSchema, FAQPageSchema } from './utils/SeoArticle';

const App: React.FC = () => {
  const [isArticleExpanded, setIsArticleExpanded] = useState(false);

  useEffect(() => {
    const schemas = [WebSiteSchema, WebApplicationSchema, ArticleSchema, FAQPageSchema];
    
    // Clean up old schemas first
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    };
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-16 text-white">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Time to Read Calculator
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Instantly estimate the reading time for your text. Perfect for writers, editors, and avid readers.
          </p>
        </header>

        <ReadingTimeTool />
        
        <div className="max-w-4xl mx-auto mt-24">
          <div 
            className="prose prose-invert lg:prose-xl max-w-none bg-slate-900/50 backdrop-blur-sm p-8 rounded-lg transition-all duration-500 ease-in-out overflow-hidden"
            style={{ maxHeight: isArticleExpanded ? '10000px' : '220px', position: 'relative' }}
          >
            <div className={!isArticleExpanded ? 'line-clamp-3' : ''} dangerouslySetInnerHTML={{ __html: SeoArticleContent }}/>
            {!isArticleExpanded && (
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0d1525] to-transparent pointer-events-none" />
            )}
          </div>
            <div className="text-center mt-4">
                <button 
                    onClick={() => setIsArticleExpanded(!isArticleExpanded)} 
                    className="py-2 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300 font-semibold"
                >
                    {isArticleExpanded ? 'Show Less' : 'Read Full Guide'}
                </button>
            </div>
        </div>
      </div>
      <style>{`.line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
      }`}</style>
    </Layout>
  );
};

export default App;
