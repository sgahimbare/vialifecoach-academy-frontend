import { useState } from "react";
import Tabs from "../components/MyLearningTabs";
import MyLearningCard from "../components/MyLearningCard";

export default function MyLearning() {
  const [active, setActive] = useState("In Progress");

  type Course = {
    id: number;
    title: string;
    instructor: string;
    thumbnail: string;
    progress: number;
    status: "in-progress" | "completed";
    certificateUrl?: string;
  };

  const courses: Course[] = [
  // In Progress (4)
  {
    id: 1,
    title: "Personal Development & Life Coaching Fundamentals",
    instructor: "Dr. Sarah Mitchell",
    thumbnail: "/thumbnails/life-coaching.png",
    progress: 35,
    status: "in-progress",
  },
  {
    id: 2,
    title: "Leadership & Success Mentorship Mastery",
    instructor: "Marcus Thompson, MBA",
    thumbnail: "/thumbnails/leadership.png",
    progress: 0,
    status: "in-progress",
  },
  {
    id: 3,
    title: "Motivational Speaking & Content Creation",
    instructor: "Jessica Rodriguez",
    thumbnail: "/thumbnails/speaking.png",
    progress: 0,
    status: "in-progress",
  },
  {
    id: 4,
    title: "Corporate Wellness & Staff Development",
    instructor: "Dr. Michael Chen, PhD",
    thumbnail: "/thumbnails/wellness.png",
    progress: 0,
    status: "in-progress",
  },

  // Completed (6)
  {
    id: 5,
    title: "Youth & Student Development Programs",
    instructor: "Elena Martinez, M.Ed",
    thumbnail: "/thumbnails/youth.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/youth.pdf",
  },
  {
    id: 6,
    title: "Mindfulness & Stress Reduction",
    instructor: "Dr. Anjali Gupta",
    thumbnail: "/thumbnails/mindfulness.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/mindfulness.pdf",
  },
  {
    id: 7,
    title: "Entrepreneurship: Launch Your Business",
    instructor: "Alex Johnson",
    thumbnail: "/thumbnails/entrepreneurship.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/entrepreneurship.pdf",
  },
  {
    id: 8,
    title: "Financial Literacy Masterclass",
    instructor: "Sophia Turner, CFA",
    thumbnail: "/thumbnails/finance.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/finance.pdf",
  },
  {
    id: 9,
    title: "Digital Marketing Essentials",
    instructor: "Daniel Green",
    thumbnail: "/thumbnails/marketing.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/marketing.pdf",
  },
  {
    id: 10,
    title: "Artificial Intelligence for Beginners",
    instructor: "Dr. Kenji Tanaka",
    thumbnail: "/thumbnails/ai.png",
    progress: 100,
    status: "completed",
    certificateUrl: "/certificates/ai.pdf",
  },
];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Learning</h1>
      <Tabs active={active} setActive={setActive} />

      <div className="space-y-4">
        {active === "In Progress" &&
          courses.filter(c => c.status === "in-progress").map(c => (
            <MyLearningCard key={c.id} {...c} />
          ))}

        {active === "Completed" &&
          courses.filter(c => c.status === "completed").map(c => (
            <MyLearningCard key={c.id} {...c} />
          ))}
      </div>
    </div>
  );
}
