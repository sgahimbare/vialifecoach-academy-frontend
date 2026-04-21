import { FormEvent, useMemo, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactUsPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSend = useMemo(
    () => fullName.trim() && email.trim() && subject.trim() && message.trim(),
    [fullName, email, subject, message]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mailSubject = encodeURIComponent(`[Academy Contact] ${subject}`);
    const bodyLines = [
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      "",
      "Message:",
      message,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:academy@vialifecoach.org?subject=${mailSubject}&body=${body}`;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Contact Us</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Reach out to Vialifecoach Academy for support, guidance, and partnership conversations.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3 text-slate-800">
                <MapPin className="h-5 w-5 text-sky-700" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3 text-slate-800">
                <MapPin className="h-5 w-5 text-sky-700" />
                <span>Bujumbura, Burundi</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3 text-slate-800">
                <Phone className="h-5 w-5 text-sky-700" />
                <span>+254792965970</span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3 text-slate-800">
                <Mail className="h-5 w-5 text-sky-700" />
                <span>academy@vialifecoach.org</span>
              </div>
            </div>
          </div>

          <form className="rounded-lg border border-slate-200 overflow-hidden" onSubmit={handleSubmit}>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="w-36 bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">Full Name</th>
                  <td className="px-4 py-2">
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">Email</th>
                  <td className="px-4 py-2">
                    <input
                      type="email"
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">Phone</th>
                  <td className="px-4 py-2">
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-700">Subject</th>
                  <td className="px-4 py-2">
                    <input
                      className="w-full rounded border border-slate-300 px-3 py-2"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-50 px-4 py-3 text-left font-medium text-slate-700 align-top">Message</th>
                  <td className="px-4 py-2">
                    <textarea
                      className="min-h-32 w-full rounded border border-slate-300 px-3 py-2"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
              <button
                type="submit"
                disabled={!canSend}
                className="rounded bg-sky-700 px-5 py-2.5 text-white disabled:opacity-50 hover:bg-sky-800"
              >
                Send to academy@vialifecoach.org
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
