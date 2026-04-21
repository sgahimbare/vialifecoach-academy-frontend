import { useState, useEffect } from "react";
import { ExternalLink, Search, Clock, Globe, BookOpen, Users, HelpCircle } from "lucide-react";

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  type: 'official' | 'help' | 'community' | 'google';
}

export function GoogleSearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleResults, setGoogleResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    // Fetch real Google search results using iframe approach
    const fetchGoogleResults = async () => {
      try {
        // Create a working Google search URL that bypasses CORS
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`ViaLife Coach ${query} support help`)}`;
        
        // Use a CORS proxy service that works
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${searchUrl}`;
        
        const response = await fetch(proxyUrl);
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const parsedResults: SearchResult[] = [];
        
        // Try multiple selectors for Google results
        const selectors = [
          '.g .LC20lb', // New Google layout
          '.g .r', // Old Google layout  
          '.g h3', // Fallback
          '.tF2Cxc' // Another layout
        ];
        
        for (const selector of selectors) {
          const elements = doc.querySelectorAll(selector);
          if (elements.length > 0) {
            Array.from(elements).slice(0, 3).forEach((element: Element) => {
              const linkEl = element.querySelector('a') || element;
              const titleEl = element.querySelector('h3') || element;
              
              if (linkEl && titleEl) {
                const title = titleEl.textContent || '';
                const link = (linkEl as HTMLAnchorElement).href;
                
                if (title && link && link.includes('http')) {
                  parsedResults.push({
                    title,
                    link,
                    snippet: `Find comprehensive information about ${query} from Google search results. This may include official documentation, community discussions, and helpful resources.`,
                    displayLink: new URL(link).hostname,
                    type: 'google'
                  });
                }
              }
            });
            break; // Stop if we found results
          }
        }

        setGoogleResults(parsedResults);
      } catch (error) {
        console.log('Using direct Google search fallback');
        // Fallback: Create direct Google search links
        setGoogleResults([
          {
            title: `Google Search: "${query}" - ViaLife Coach`,
            link: `https://www.google.com/search?q=${encodeURIComponent(`ViaLife Coach ${query}`)}`,
            snippet: `Search Google for comprehensive results about "${query}" related to ViaLife Coach. Find official documentation, community discussions, tutorials, and helpful resources.`,
            displayLink: 'google.com',
            type: 'google'
          },
          {
            title: `Google Search: "${query}" - Support Help`,
            link: `https://www.google.com/search?q=${encodeURIComponent(`${query} support help tutorial`)}`,
            snippet: `Search Google for detailed help with "${query}". Get answers from support forums, documentation, video tutorials, and community experts.`,
            displayLink: 'google.com',
            type: 'google'
          }
        ]);
      }
    };

    // Internal results
    const internalResults: SearchResult[] = [
      {
        title: `ViaLife Coach Support - ${query}`,
        link: `/support?q=${encodeURIComponent(query)}`,
        snippet: `Find comprehensive help with ${query} on our official support page. Browse FAQs, knowledge base articles, video tutorials, and contact our support team for personalized assistance.`,
        displayLink: 'vialifecoach.org',
        type: 'official'
      }
    ];

    // Combine results
    const allResults = [...internalResults, ...googleResults];
    
    const timer = setTimeout(() => {
      setResults(allResults);
      setLoading(false);
      fetchGoogleResults();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  if (!query) return null;

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'official': return <Globe className="h-4 w-4 text-blue-600" />;
      case 'help': return <BookOpen className="h-4 w-4 text-green-600" />;
      case 'community': return <Users className="h-4 w-4 text-purple-600" />;
      case 'google': return <Search className="h-4 w-4 text-red-600" />;
      default: return <Search className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'official': return 'text-blue-700';
      case 'help': return 'text-green-700';
      case 'community': return 'text-purple-700';
      case 'google': return 'text-red-700';
      default: return 'text-slate-700';
    }
  };

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">
          Search Results for "{query}"
        </h3>
        {loading && <Clock className="h-4 w-4 text-slate-400 animate-spin" />}
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-slate-300">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getTypeIcon(result.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-lg mb-2 hover:text-blue-700 transition-colors">
                  <a 
                    href={result.link} 
                    target={result.type === 'google' ? '_blank' : '_self'}
                    rel={result.type === 'google' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2"
                  >
                    {result.title}
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </a>
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-2">
                  {result.snippet}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-medium ${getTypeColor(result.type)}`}>
                    {result.displayLink}
                  </p>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 capitalize">
                    {result.type === 'google' ? 'Google Search' : `${result.type} resource`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(`ViaLife Coach ${query} support help`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Search Google for more results
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
