import { FormEvent, useMemo, useState } from "react";

export default function PartnershipsPage() {
  const [organization, setOrganization] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [partnershipType, setPartnershipType] = useState("School/University");
  const [message, setMessage] = useState("");

  const canSend = useMemo(
    () => organization.trim() && contactName.trim() && email.trim() && message.trim(),
    [organization, contactName, email, message],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`[Partnership Inquiry] ${organization}`);
    const body = encodeURIComponent(
      [
        `Organization: ${organization}`,
        `Contact Name: ${contactName}`,
        `Email: ${email}`,
        `Partnership Type: ${partnershipType}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    );
    window.location.href = `mailto:partnership@vialifecoach.org?subject=${subject}&body=${body}`;
  }

  return (
    <main className="bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-12">
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <header className="rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-600 to-emerald-600 p-8 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Partnerships</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Partner With Vialifecoach Academy</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/90">
            We collaborate with schools, organizations, NGOs, and institutions to deliver practical mental
            wellness and coaching education at scale.
          </p>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Partnership Models</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3">School and University Programs</li>
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3">Corporate Wellness and Staff Development</li>
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3">NGO and Community Impact Programs</li>
              <li className="rounded-lg border border-slate-100 bg-slate-50 p-3">Content, Media, and Knowledge Collaboration</li>
            </ul>

            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Direct Email</p>
              <p className="mt-1 text-sm font-medium text-emerald-900">partnership@vialifecoach.org</p>
            </div>
          </article>

          <form className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold text-slate-900">Send Partnership Inquiry</h2>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Organization Name"
                value={organization}
                onChange={(event) => setOrganization(event.target.value)}
                required
              />
              <input
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Contact Name"
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                required
              />
              <input
                type="email"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Contact Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <select
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                value={partnershipType}
                onChange={(event) => setPartnershipType(event.target.value)}
              >
                <option>School/University</option>
                <option>Corporate</option>
                <option>NGO/Community</option>
                <option>Content Collaboration</option>
              </select>
              <textarea
                className="min-h-32 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Tell us your partnership goals"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={!canSend}
              className="mt-4 rounded bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-50"
            >
              Send to partnership@vialifecoach.org
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
