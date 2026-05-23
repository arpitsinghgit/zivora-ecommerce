import { useParams, Navigate } from 'react-router-dom';
import { infoPagesData } from '../data/infoPages';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug || !infoPagesData[slug]) {
    return <Navigate to="/" replace />;
  }

  const page = infoPagesData[slug];

  const renderContent = (content: string) => {
    return content.split('\\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={index} className="h-4" />;
      
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-serif font-semibold text-zinc-900 mt-10 mb-5">{trimmed.replace('### ', '')}</h3>;
      }
      
      if (trimmed.startsWith('- **')) {
        const parts = trimmed.replace('- **', '').split('**:');
        if (parts.length > 1) {
          return (
            <div key={index} className="flex items-start mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
              <p className="text-zinc-600 text-sm leading-relaxed"><strong className="text-zinc-900 font-semibold">{parts[0]}:</strong>{parts[1]}</p>
            </div>
          );
        }
      }

      if (trimmed.startsWith('- ')) {
        // Check for inline bold in bullet
        let processedLine: React.ReactNode = trimmed.replace('- ', '');
        if (typeof processedLine === 'string' && processedLine.includes('**')) {
          const parts = processedLine.split('**');
          processedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-zinc-900 font-semibold">{part}</strong> : part);
        }

        return (
          <div key={index} className="flex items-start mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
            <p className="text-zinc-600 text-sm leading-relaxed">{processedLine}</p>
          </div>
        );
      }
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
         return <p key={index} className="font-semibold text-zinc-900 mt-8 mb-3">{trimmed.replace(/\\*\\*/g, '')}</p>;
      }

      if (/^\\d+\\.\\s/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\\d+)\\.\\s/);
        const num = numMatch ? numMatch[1] : '';
        const text = trimmed.replace(/^\\d+\\.\\s/, '');
        
        let processedText: React.ReactNode = text;
        if (text.includes('**')) {
          const parts = text.split('**');
          processedText = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-zinc-900 font-semibold">{part}</strong> : part);
        }

        return (
          <div key={index} className="flex items-start mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 border border-amber-100">
              {num}
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed">{processedText}</p>
          </div>
        );
      }

      // Handle standard text with inline bold
      let processedLine: React.ReactNode = trimmed;
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        processedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-zinc-900 font-semibold">{part}</strong> : part);
      }

      return <p key={index} className="text-zinc-600 text-sm leading-relaxed mb-5">{processedLine}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-zinc-500 mb-8 space-x-2">
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-900 font-medium capitalize">{slug.replace(/-/g, ' ')}</span>
        </nav>

        {/* Header */}
        <div className="mb-12 border-b border-zinc-200 pb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 tracking-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="mt-4 text-lg text-zinc-500 font-light">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-zinc-100">
          {renderContent(page.content)}
        </div>

        {/* Need more help CTA */}
        <div className="mt-12 bg-rose-50/50 rounded-2xl p-8 text-center border border-rose-100">
          <h4 className="text-lg font-serif font-semibold text-zinc-900">Still have questions?</h4>
          <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
            Our support team is available Monday to Friday to assist you with any inquiries.
          </p>
          <Link 
            to="/page/support-ticket"
            className="inline-block mt-6 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-colors"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}
