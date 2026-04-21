import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface Application {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  status: "active" | "closed" | "draft";
  deadline: string;
  postedDate: string;
  description: string;
  requirements: string[];
}

export default function ApplicationPortal() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [allPrograms, setAllPrograms] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const applicationTypes = [
    { value: "all", label: "All Programs" },
    { value: "scholarship", label: "Scholarships" },
    { value: "training", label: "Training Programs" },
    { value: "job", label: "Jobs" },
    { value: "internship", label: "Internships" },
    { value: "volunteer", label: "Volunteer Programs" }
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "remote", label: "Remote" },
    { value: "nairobi", label: "Nairobi" },
    { value: "kakuma", label: "Kakuma Camp" },
    { value: "dadaab", label: "Dadaab Camp" }
  ];
  const normalizeProgramStatus = (value: unknown): "active" | "closed" | "draft" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (["open", "opened", "active"].includes(raw)) return "active";
    if (["closed", "close", "inactive", "ended", "end"].includes(raw)) return "closed";
    return "draft";
  };
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/programs");
        const data = await res.json();
        const rows = Array.isArray(data?.data) ? data.data : [];
        const mapped = rows.map((row: any, index: number) => {
          const status = normalizeProgramStatus(row.applicationStatus ?? row.status);
          const rawId = row.id ?? row.code ?? row.name ?? `program-${index + 1}`;
          const safeId = String(rawId);

          return {
            id: safeId,
            title: row.name || "Program",
            organization: "Vialifecoach Global Foundation Academy",
            location: row.location || "Remote",
            type: row.type || "scholarship",
            status,
            deadline: row.deadline ? new Date(row.deadline).toLocaleDateString() : "TBD",
            postedDate: "",
            description: row.description || "",
            requirements: []
          };
        });
        setAllPrograms(mapped);
      } catch (error) {
        console.error("Failed to load programs:", error);
        setAllPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);
  
  useEffect(() => {
    const filtered = allPrograms.filter((app) => {
      const matchesSearch =
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "all" || app.type === selectedType;

      const matchesLocation =
        selectedLocation === "all" ||
        app.location.toLowerCase().includes(selectedLocation);

      return matchesSearch && matchesType && matchesLocation;
    });

    setApplications(filtered);
  }, [searchTerm, selectedType, selectedLocation, allPrograms]);

  const handleApplicationClick = (id: string) => {
    const selected = applications.find((a) => a.id === id);

    // Navigate to comprehensive Vialifecoach GF Application Portal
    navigate("/application-portal/gf/home", {
      state: {
        action: "create-account",
        applicationId: id,
        applicationTitle: selected?.title
      }
    });
  };

  const getStatusStyle = (status: string) => {
    if (status === "active")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "closed")
      return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "active") return <CheckCircle className="h-4 w-4" />;
    if (status === "closed") return <AlertCircle className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vialifecoach Application Portal
            </h1>
            <p className="text-gray-600 text-sm">
              Discover scholarships, training, and career opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-10">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {applicationTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition flex flex-col h-full"
              >
                <div className="p-6 flex flex-col flex-grow">
                  {/* Status */}
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${getStatusStyle(
                        app.status
                      )}`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status === "active"
                        ? "Accepting Applications"
                        : "Closed"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">
                    {app.organization}
                  </p>

                  <p className="text-gray-600 text-sm mb-5 flex-grow">
                    {app.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {app.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Deadline: {app.deadline}
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    disabled={app.status !== "active"}
                    onClick={() => handleApplicationClick(app.id)}
                    className={`mt-auto w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                      app.status === "active"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Create Account to Apply
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




