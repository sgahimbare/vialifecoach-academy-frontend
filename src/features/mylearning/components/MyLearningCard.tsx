import { Button } from "@/components/ui/button";

type MyLearningCardProps = {
  thumbnail: string;
  title: string;
  instructor: string;
  progress: number;
  status: "in-progress" | "completed";
  certificateUrl?: string;
};

export default function MyLearningCard({
  thumbnail,
  title,
  instructor,
  progress,
  status,
  certificateUrl,
}: MyLearningCardProps) {
  return (
    <div className="flex gap-4 items-center p-4 rounded-2xl shadow bg-white">
      <img src={thumbnail} alt={title} className="w-28 h-20 object-cover rounded-lg" />
      
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{instructor}</p>

        {status === "in-progress" && (
          <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
          </div>
        )}

        {status === "completed" && (
          <p className="text-green-600 font-medium mt-2">Completed ✔</p>
        )}
      </div>

      {status === "in-progress" && <Button>Continue</Button>}

      {status === "completed" && (
        <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
          <Button>View Certificate</Button>
        </a>
      )}
    </div>
  );
}
