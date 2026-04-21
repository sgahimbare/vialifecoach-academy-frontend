import { Footer } from "@/components/common/Footer"
import { Navbar } from "@/components/common/Navbar"
import { ArrowLeft } from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react"

function MainLayout () {
  const location = useLocation()
  const navigate = useNavigate()
  const showBackButton = location.pathname !== "/" && location.pathname !== "/home"
  const isStudentBoard = location.pathname.startsWith("/student/")

  useEffect(() => {
    const key = "vlf_visitor_id";
    let visitorId = localStorage.getItem(key);
    if (!visitorId) {
      visitorId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, visitorId);
    }

    const params = new URLSearchParams(location.search);
    const shareSlug = params.get("share") || params.get("ref");
    const locale = navigator.language || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const countryFromLocale = locale.includes("-") ? locale.split("-")[1]?.toUpperCase() : "";
    let referrerDomain = "";
    if (document.referrer) {
      try {
        referrerDomain = new URL(document.referrer).hostname;
      } catch {
        referrerDomain = "";
      }
    }

    const payload = {
      path: `${location.pathname}${location.search}`,
      referrer: document.referrer || "",
      referrer_domain: referrerDomain,
      visitor_id: visitorId,
      share_slug: shareSlug || null,
      country_code: countryFromLocale,
      timezone,
      locale
    };

    fetch("/api/v1/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => {});

    if (shareSlug) {
      fetch("/api/v1/analytics/share-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: shareSlug,
          visitor_id: visitorId,
          path: location.pathname,
          referrer: document.referrer || "",
          referrer_domain: referrerDomain,
          country_code: countryFromLocale,
          timezone,
          locale
        })
      }).catch(() => {});
    }
  }, [location.pathname, location.search]);

  return (
    <>
    <div className="min-h-screen flex flex-col">
        <Navbar />
        {showBackButton ? (
          <div className={`${isStudentBoard ? "bg-amber-800 border-b border-amber-700" : ""}`}>
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 pb-3 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  isStudentBoard
                    ? "border border-amber-200/40 bg-amber-900 text-amber-100 hover:bg-amber-950"
                    : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>
        ) : null}
         <div className="flex-1">
          <Outlet/>
        </div>
        <Footer />
    </div>
    </>
  )
}

export default  MainLayout
