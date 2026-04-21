import { BookOpen, Tag, Clock } from "lucide-react";
import { articles, KB_CATEGORIES } from "../data/supportData";

type Props = {
  search: string;
  kbCategory: string;
  setKbCategory: (cat: string) => void;
};

export function SupportKnowledgeBase({ search, kbCategory, setKbCategory }: Props) {
  const filtered = articles.filter((a) => {
    const matchesCategory = kbCategory === "All" || a.category === kbCategory;
    const matchesSearch =
      search.trim() === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="knowledge-base" className="py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">Knowledge Base</h2>
        <p className="text-slate-600">Browse our library of guides and documentation.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {KB_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setKbCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              kbCategory === cat
                ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white border-sky-600 shadow-md"
                : "bg-gradient-to-r from-white to-slate-50 text-slate-600 border-slate-300 hover:border-sky-400 hover:text-sky-700 hover:from-slate-50 hover:to-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
          <BookOpen className="h-10 w-10 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-600">No articles found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-300 p-5 hover:shadow-lg hover:border-sky-300 hover:from-slate-50 hover:to-blue-50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-sky-700 transition-colors leading-snug mb-2">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                      <Tag className="h-3 w-3" /> {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime} read
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
