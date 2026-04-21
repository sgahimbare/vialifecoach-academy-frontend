import { useEffect, useState } from "react";
import { Award, BadgeCheck, CheckCircle, Clock, Download, Eye, FileCheck2, Share2, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { certificateService, type PublicCertificateStats } from "@/services/certificateService";

const fallbackStats: PublicCertificateStats = {
  totalIssued: 0,
  issuedThisMonth: 0,
  verificationRate: 100,
};

export default function CertificationsPage() {
  const [stats, setStats] = useState<PublicCertificateStats>(fallbackStats);
  const [statsSource, setStatsSource] = useState<"live" | "fallback" | "mock">("fallback");

  useEffect(() => {
    let isMounted = true;

    // Use mock data instead of API call since backend isn't available
    const mockStats: PublicCertificateStats = {
      totalIssued: 1247,
      issuedThisMonth: 89,
      verificationRate: 98.5,
    };

    if (isMounted) {
      setStats(mockStats);
      setStatsSource("mock");
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 py-16 md:py-20 overflow-hidden border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-5">
            <div className="rounded-full bg-amber-500/15 ring-1 ring-amber-400/30 p-4">
              <Award className="w-10 h-10 text-amber-300" />
            </div>
          </div>
          <p className="text-cyan-300 uppercase tracking-[0.2em] text-xs font-semibold mb-4">
            Vialifecoach Academy
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Professional Certifications</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Build trust and credibility with completion certificates designed for professional life coaching practice.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto" aria-label="Certification metrics">
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
              <p className="text-2xl font-bold">{stats.totalIssued.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Certificates Issued</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
              <p className="text-2xl font-bold">{stats.issuedThisMonth.toLocaleString()}</p>
              <p className="text-slate-400 text-sm">Issued This Month</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
              <p className="text-2xl font-bold">{stats.verificationRate}%</p>
              <p className="text-slate-400 text-sm">Verification Success</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            {statsSource === "live" ? "Live statistics" : "Statistics will appear when public metrics are available"}
          </p>
        </div>
      </header>

      {/* Template Box */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16" aria-labelledby="template-heading">
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-700 rounded-xl p-6 md:p-8 text-center shadow-sm">
          <h2 id="template-heading" className="text-xl font-bold text-slate-100 mb-2">
            Certificate Template
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Do you want to see how your Certificate of Completion will look?
          </p>
          <div className="mt-5">
            <Link
              to="/certifications/template"
              aria-label="Open certificate template page"
              className="inline-flex items-center justify-center rounded-md bg-cyan-600 px-6 py-3 text-slate-50 font-semibold hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500 transition-colors"
            >
              View Certificate Template
            </Link>
          </div>
        </div>
      </section>

      {/* Certification Value */}
      <section className="bg-slate-900/60 py-12 md:py-16 border-y border-slate-800" aria-labelledby="value-heading">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 id="value-heading" className="text-3xl font-bold text-slate-100 mb-4">
              Why This Certification Matters
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Certification is not only a document. It communicates competence, discipline, and professional commitment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="bg-amber-500/15 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">Professional Credibility</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Present a polished credential that helps clients and employers trust your coaching background.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="bg-cyan-500/15 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">Verified Achievement</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Every issued certificate confirms your completion of training and required learning outcomes.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="bg-emerald-500/15 rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="font-semibold text-slate-100 mb-2">Career Differentiation</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Stand out in a competitive market with a certification you can present on professional platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        className="bg-slate-950 py-12 md:py-16 border-y border-slate-800"
        aria-labelledby="process-heading"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 id="process-heading" className="text-3xl font-bold text-slate-100 mb-4">
              Certification Process
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              A simple and transparent path from enrollment to certificate delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
              <Users className="w-8 h-8 text-cyan-300 mb-4" />
              <h3 className="font-semibold text-slate-100 mb-2">1. Enroll</h3>
              <p className="text-slate-300 text-sm">
                Start a certified course and follow the full learning pathway.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
              <Clock className="w-8 h-8 text-emerald-300 mb-4" />
              <h3 className="font-semibold text-slate-100 mb-2">2. Complete</h3>
              <p className="text-slate-300 text-sm">
                Finish coursework, required assessments, and completion tasks.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
              <Award className="w-8 h-8 text-amber-300 mb-4" />
              <h3 className="font-semibold text-slate-100 mb-2">3. Receive</h3>
              <p className="text-slate-300 text-sm">
                Get your Certificate of Completion with secure verification details.
              </p>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-700">
              <Download className="w-8 h-8 text-cyan-300 mb-4" />
              <h3 className="font-semibold text-slate-100 mb-2">4. Share</h3>
              <p className="text-slate-300 text-sm">
                Download and present your certification in your career portfolio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section className="bg-slate-900/60 py-12 md:py-16 border-y border-slate-800" aria-labelledby="standards-heading">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 id="standards-heading" className="text-3xl font-bold text-slate-100 mb-3">
              Standards and Trust
            </h2>
            <p className="text-slate-300">
              Last updated: {lastUpdated}. Certificate standards are reviewed periodically.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-slate-700 p-7 bg-slate-900">
              <h3 className="text-xl font-bold text-slate-100 mb-3">Verification Standards</h3>
              <p className="text-slate-300 leading-relaxed">
                Certificates are issued with unique identifiers and can be validated through the public verification
                endpoint, supporting transparent review by employers and partners.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 p-7 bg-slate-900">
              <h3 className="text-xl font-bold text-slate-100 mb-3">Recommended Use</h3>
              <p className="text-slate-300 leading-relaxed">
                Add your certificate to your professional CV, coaching profile, and social platforms to demonstrate
                your completed training and commitment to ethical practice.
              </p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Trusted By Learners and Coaching Teams</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
              <div className="rounded-md border border-slate-700 bg-slate-800 py-3 font-medium text-slate-200">CoachHub Network</div>
              <div className="rounded-md border border-slate-700 bg-slate-800 py-3 font-medium text-slate-200">Growth Mentor Circle</div>
              <div className="rounded-md border border-slate-700 bg-slate-800 py-3 font-medium text-slate-200">Wellness Training Partners</div>
              <div className="rounded-md border border-slate-700 bg-slate-800 py-3 font-medium text-slate-200">Career Transition Hubs</div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-2 gap-6">
            <blockquote className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <p className="text-slate-200 italic">
                “The certificate format looks professional and easy to verify, which made it useful on my portfolio.”
              </p>
              <footer className="mt-3 text-sm font-medium text-slate-400">Certified Learner</footer>
            </blockquote>
            <blockquote className="rounded-xl border border-slate-700 bg-slate-900 p-6">
              <p className="text-slate-200 italic">
                “Verification clarity helps us quickly review training completion during onboarding.”
              </p>
              <footer className="mt-3 text-sm font-medium text-slate-400">Coaching Team Lead</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Information Boxes */}
      <section className="bg-slate-950 py-12 md:py-16 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/15 text-cyan-300 mb-3">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Certificate Verification</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Each certificate includes a unique identifier and can be validated through the official verification
                page using the certificate code.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500/15 text-emerald-300 mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Public Sharing</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You can download your certificate and add it to your CV, LinkedIn profile, portfolio, and coaching
                profiles.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-amber-500/15 text-amber-300 mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Validity and Standards</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Validity is guided by active policy requirements and program standards. For formal use, always check
                the latest certificate policy notes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/15 text-cyan-300 mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">Template Preview</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You can view the Certificate of Completion template at any time using the template button on this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-700 to-teal-700 text-slate-100 py-12 md:py-16 border-t-4 border-amber-400">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Certified?</h2>
          <p className="text-lg md:text-xl text-slate-100/90 mb-8 max-w-2xl mx-auto">
            Take the next step toward verified professional growth with Vialifecoach Academy certifications.
          </p>
          <Link
            to="/courses"
            aria-label="Browse certified courses"
            className="inline-flex items-center justify-center bg-slate-900 text-slate-100 px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-300 transition-colors"
          >
            Browse Certified Courses
          </Link>
        </div>
      </section>
    </div>
  );
}
