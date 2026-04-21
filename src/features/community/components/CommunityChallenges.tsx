import { useEffect, useState } from "react";
import { Users, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { communityService, type CommunityChallenge } from "@/services/communityService";

export function CommunityChallenges() {
  const { accessToken, user } = useAuth();
  const [challenges, setChallenges] = useState<CommunityChallenge[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CommunityChallenge | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await communityService.getChallenges(accessToken);
      setChallenges(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load challenges");
    }
  }

  useEffect(() => {
    void load();
  }, [accessToken]);

  function openJoin(challenge: CommunityChallenge) {
    setSelected(challenge);
    setMessage("");
    if (accessToken) {
      setGuestName(user?.name || "");
      setGuestEmail("");
    }
  }

  async function submitJoin() {
    if (!selected) return;
    try {
      await communityService.joinChallenge(selected.id, {
        token: accessToken,
        name: accessToken ? undefined : guestName,
        email: accessToken ? undefined : guestEmail,
      });
      setMessage("Registration successful.");
      await load();
      setTimeout(() => setSelected(null), 900);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Join failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Active Challenges</h2>
        <p className="text-sm text-slate-500 mt-1">Join open competitions and funding opportunities</p>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{challenge.badge || "🏆"}</div>
              <div>
                <h3 className="font-semibold text-slate-800">{challenge.title}</h3>
                <p className="text-xs text-slate-500">{challenge.duration_days} days</p>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {challenge.participants} participants
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600">{challenge.description || "No description provided."}</p>
            <button
              className={`mt-auto rounded-xl px-4 py-2 text-sm ${challenge.joined ? "bg-green-100 text-green-800" : "bg-sky-700 text-white"}`}
              onClick={() => openJoin(challenge)}
              disabled={challenge.joined}
            >
              {challenge.joined ? "Joined" : "Join Challenge"}
            </button>
          </div>
        ))}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Challenge Registration</h3>
              <button type="button" onClick={() => setSelected(null)} className="rounded p-1 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-600">{selected.title}</p>

            {!accessToken ? (
              <div className="mt-4 space-y-3">
                <input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">You are joining as {user?.name}.</p>
            )}

            {message ? <p className="mt-3 text-sm text-sky-700">{message}</p> : null}
            <button
              type="button"
              onClick={() => void submitJoin()}
              disabled={!accessToken && (!guestName.trim() || !guestEmail.trim())}
              className="mt-4 w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Submit Registration
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
