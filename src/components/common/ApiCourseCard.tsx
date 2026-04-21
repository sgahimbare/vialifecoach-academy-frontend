import { Link } from "react-router-dom";

type ApiCourseCardProps = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  durationWeeks?: number;
  hasCertificate?: boolean;
  thumbnail_url?: string;
  to: string;
  darkMode?: boolean;
};

function cleanCourseTitle(title: string) {
  return title.replace(/^L\d-[A-Z0-9-]+:\s*/i, "").trim();
}

function getPillarBadgeStyles(category?: string) {
  const key = (category || "").toLowerCase();
  if (key.includes("mindset")) return "bg-[#DCEBFF] text-[#1E4E8C]";
  if (key.includes("productivity")) return "bg-[#E2F7E8] text-[#1F6B3A]";
  if (key.includes("leadership")) return "bg-[#FFF1D9] text-[#9A5A00]";
  if (key.includes("resilience")) return "bg-[#FDE3E8] text-[#A32944]";
  return "bg-[#E6ECF5] text-[#102347]";
}

function getCourseImage(title: string, category?: string) {
  const text = `${title} ${category || ""}`.toLowerCase();

  if (text.includes("confidence") || text.includes("mindset")) {
    return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("procrastination")) {
    return "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("goal")) {
    return "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("focus")) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("time")) {
    return "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=1200&q=80";
  }
  if (text.includes("leadership")) {
    return "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";
}

export function ApiCourseCard({
  id,
  title,
  description,
  category,
  durationWeeks,
  hasCertificate,
  thumbnail_url,
  to,
  darkMode = false,
}: ApiCourseCardProps) {
  const cleanTitle = cleanCourseTitle(title);
  const badgeStyles = getPillarBadgeStyles(category);
  
  // Use uploaded thumbnail if available, otherwise use default image based on title
  const image = thumbnail_url 
    ? (thumbnail_url.startsWith('http') ? thumbnail_url : `http://localhost:5000${thumbnail_url}`)
    : getCourseImage(cleanTitle, category);
    
  const fallbackImage =
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";

  return (
    <article
      key={id}
      className={`overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 ${
        darkMode
          ? "border border-slate-700 bg-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.38)]"
          : "border border-[#E6ECF5] bg-white shadow-[0_8px_24px_rgba(17,34,68,0.08)] hover:shadow-[0_14px_32px_rgba(17,34,68,0.12)]"
      }`}
    >
      <img
        className="h-44 w-full object-cover"
        src={image}
        alt={cleanTitle}
        loading="lazy"
        onError={(event) => {
          const target = event.currentTarget;
          if (target.src !== fallbackImage) target.src = fallbackImage;
        }}
      />
      <div className="p-5">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}>
          {category || "General"}
        </span>
        <h2 className={`mt-3 line-clamp-2 text-lg font-semibold ${darkMode ? "text-slate-100" : "text-[#102347]"}`}>{cleanTitle}</h2>
        <p className={`mt-2 line-clamp-2 text-sm ${darkMode ? "text-slate-300" : "text-[#5D6B82]"}`}>
          {description || "Structured course designed for practical growth and measurable results."}
        </p>
        <div className={`mt-4 flex items-center justify-between text-xs ${darkMode ? "text-slate-400" : "text-[#5D6B82]"}`}>
          <span>{durationWeeks ? `${durationWeeks} weeks` : "Self-paced"}</span>
          <span>{hasCertificate ? "Certificate" : "No certificate"}</span>
        </div>
        <Link
          to={to}
          className={`mt-4 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
            darkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-[#1F4E8C] hover:bg-[#173C6C]"
          }`}
        >
          View Course
        </Link>
      </div>
    </article>
  );
}
