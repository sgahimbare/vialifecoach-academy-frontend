// ─── Virtual Number Utility ───────────────────────────────────────────────────
// Derives a zero-padded 8-digit virtual number from a user's numeric ID.
// When the backend is ready, replace this with the value returned from the API.
export function toVirtualNumber(id: number): string {
  return String(id).padStart(8, "0");
}

// ─── Course Discussions (mock) ────────────────────────────────────────────────
export type DiscussionPost = {
  id: number;
  author: string;
  authorRole: "student" | "instructor";
  virtualNumber: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: DiscussionReply[];
};

export type DiscussionReply = {
  id: number;
  author: string;
  authorRole: "student" | "instructor";
  virtualNumber: string;
  content: string;
  timestamp: string;
};

export type CourseDiscussion = {
  courseId: number;
  courseTitle: string;
  instructor: string;
  posts: DiscussionPost[];
};

export const mockCourseDiscussions: CourseDiscussion[] = [
  {
    courseId: 1,
    courseTitle: "Mindset Mastery: Rewire Your Thinking",
    instructor: "Dr. Amara Osei",
    posts: [
      {
        id: 1,
        author: "Dr. Amara Osei",
        authorRole: "instructor",
        virtualNumber: "00000003",
        avatar: "AO",
        content: "Welcome to the Mindset Mastery discussion board! Feel free to share your reflections after each module. I'll be checking in daily. 🌟",
        timestamp: "2025-01-10 09:00",
        replies: [
          { id: 1, author: "Fatima K.", authorRole: "student", virtualNumber: "00000007", content: "Thank you! Module 1 really shifted my perspective on limiting beliefs.", timestamp: "2025-01-10 10:15" },
          { id: 2, author: "James M.", authorRole: "student", virtualNumber: "00000012", content: "Agreed! The journaling exercise was eye-opening.", timestamp: "2025-01-10 11:30" },
        ],
      },
      {
        id: 2,
        author: "Fatima K.",
        authorRole: "student",
        virtualNumber: "00000007",
        avatar: "FK",
        content: "Has anyone tried the 5-minute morning affirmation routine from Module 2? I've been doing it for a week and I feel more focused.",
        timestamp: "2025-01-12 08:45",
        replies: [
          { id: 3, author: "Lena W.", authorRole: "student", virtualNumber: "00000015", content: "Yes! I pair it with journaling. Game changer.", timestamp: "2025-01-12 09:20" },
        ],
      },
    ],
  },
  {
    courseId: 2,
    courseTitle: "Entrepreneurship & Life Purpose",
    instructor: "Coach Brian Nduta",
    posts: [
      {
        id: 3,
        author: "Coach Brian Nduta",
        authorRole: "instructor",
        virtualNumber: "00000005",
        avatar: "BN",
        content: "Welcome everyone! This week we explore the intersection of purpose and profit. Share your 'why' below — what drives you to build something meaningful?",
        timestamp: "2025-01-08 08:00",
        replies: [
          { id: 4, author: "Samuel O.", authorRole: "student", virtualNumber: "00000009", content: "My why is creating financial freedom for my family while helping others grow.", timestamp: "2025-01-08 09:45" },
        ],
      },
    ],
  },
];

// ─── Community Chat Contacts (mock) ───────────────────────────────────────────
export type ChatContact = {
  id: number;
  name: string;
  virtualNumber: string;
  avatar: string;
  role: "student" | "instructor" | "admin";
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
};

export type ChatMessage = {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
};

export const mockContacts: ChatContact[] = [
  { id: 3, name: "Dr. Amara Osei", virtualNumber: "00000003", avatar: "AO", role: "instructor", online: true, lastMessage: "See you in the next session!", lastMessageTime: "10:30" },
  { id: 5, name: "Coach Brian Nduta", virtualNumber: "00000005", avatar: "BN", role: "instructor", online: false, lastMessage: "Great progress this week 🎉", lastMessageTime: "Yesterday" },
  { id: 7, name: "Fatima K.", virtualNumber: "00000007", avatar: "FK", role: "student", online: true, lastMessage: "Did you finish Module 3?", lastMessageTime: "09:15" },
  { id: 9, name: "Samuel O.", virtualNumber: "00000009", avatar: "SO", role: "student", online: false, lastMessage: "Thanks for the tip!", lastMessageTime: "Mon" },
  { id: 12, name: "James M.", virtualNumber: "00000012", avatar: "JM", role: "student", online: true, lastMessage: "Let's form a study group", lastMessageTime: "Sun" },
  { id: 15, name: "Lena W.", virtualNumber: "00000015", avatar: "LW", role: "student", online: false, lastMessage: "The journaling exercise helped a lot", lastMessageTime: "Sat" },
  { id: 18, name: "Kwame A.", virtualNumber: "00000018", avatar: "KA", role: "student", online: true, lastMessage: "Are you joining the webinar?", lastMessageTime: "Fri" },
  { id: 21, name: "Priya S.", virtualNumber: "00000021", avatar: "PS", role: "student", online: false, lastMessage: "Module 4 was intense!", lastMessageTime: "Thu" },
];

export const mockMessageHistory: Record<number, ChatMessage[]> = {
  3: [
    { id: 1, senderId: 3, content: "Hello! How are you finding the course so far?", timestamp: "10:00" },
    { id: 2, senderId: -1, content: "It's been amazing! The mindset exercises are really helping.", timestamp: "10:05" },
    { id: 3, senderId: 3, content: "Wonderful! Keep up the great work. See you in the next session!", timestamp: "10:30" },
  ],
  7: [
    { id: 1, senderId: 7, content: "Hey! Did you finish Module 3?", timestamp: "09:10" },
    { id: 2, senderId: -1, content: "Almost! Just the last exercise left. You?", timestamp: "09:12" },
    { id: 3, senderId: 7, content: "Done! The affirmation part was powerful.", timestamp: "09:15" },
  ],
  12: [
    { id: 1, senderId: -1, content: "Hey James, how's the course going?", timestamp: "Sun 14:00" },
    { id: 2, senderId: 12, content: "Really well! Let's form a study group", timestamp: "Sun 14:30" },
  ],
};

// ─── Events & Webinars (mock) ─────────────────────────────────────────────────
export type CommunityEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  host: string;
  type: "webinar" | "workshop" | "live-session" | "challenge";
  description: string;
  spots: number | null;
};

export const mockEvents: CommunityEvent[] = [
  { id: 1, title: "Live Q&A: Breaking Through Mental Blocks", date: "2025-02-05", time: "18:00 EAT", host: "Dr. Amara Osei", type: "live-session", description: "Join Dr. Amara for a live interactive session where she answers your most pressing mindset questions.", spots: 50 },
  { id: 2, title: "Webinar: Building a Purpose-Driven Business", date: "2025-02-12", time: "17:00 EAT", host: "Coach Brian Nduta", type: "webinar", description: "Learn how to align your entrepreneurial journey with your life purpose in this 90-minute deep dive.", spots: 100 },
  { id: 3, title: "Workshop: Emotional Intelligence in Leadership", date: "2025-02-20", time: "10:00 EAT", host: "Vialifecoach Team", type: "workshop", description: "A hands-on workshop exploring how emotional intelligence drives better leadership and relationships.", spots: 30 },
  { id: 4, title: "30-Day Mindset Challenge Kickoff", date: "2025-02-01", time: "09:00 EAT", host: "Community Team", type: "challenge", description: "Join hundreds of learners in our flagship 30-day mindset transformation challenge.", spots: null },
];

// ─── Challenges (mock) ────────────────────────────────────────────────────────
export type Challenge = {
  id: number;
  title: string;
  duration: string;
  participants: number;
  description: string;
  progress: number;
  joined: boolean;
  badge: string;
};

export const mockChallenges: Challenge[] = [
  { id: 1, title: "30-Day Mindset Reset", duration: "30 days", participants: 342, description: "Daily mindset exercises, journaling prompts, and affirmations to rewire your thinking patterns.", progress: 40, joined: true, badge: "🧠" },
  { id: 2, title: "21-Day Gratitude Practice", duration: "21 days", participants: 218, description: "Build a daily gratitude habit that shifts your perspective and improves emotional wellbeing.", progress: 0, joined: false, badge: "🙏" },
  { id: 3, title: "7-Day Digital Detox", duration: "7 days", participants: 156, description: "Reclaim your focus and mental clarity by intentionally reducing screen time for one week.", progress: 0, joined: false, badge: "📵" },
  { id: 4, title: "14-Day Goal Clarity Sprint", duration: "14 days", participants: 189, description: "Clarify your top 3 life goals and create an actionable roadmap with daily accountability check-ins.", progress: 0, joined: false, badge: "🎯" },
];

// ─── Success Stories (mock) ───────────────────────────────────────────────────
export type SuccessStory = {
  id: number;
  name: string;
  avatar: string;
  virtualNumber: string;
  role: string;
  story: string;
  course: string;
  rating: number;
};

export const mockSuccessStories: SuccessStory[] = [
  { id: 1, name: "Fatima K.", avatar: "FK", virtualNumber: "00000007", role: "Entrepreneur, Nairobi", story: "Before joining Vialifecoach Academy, I was stuck in a cycle of self-doubt. The Mindset Mastery course gave me the tools to break free. Within 3 months, I launched my first business.", course: "Mindset Mastery", rating: 5 },
  { id: 2, name: "Samuel O.", avatar: "SO", virtualNumber: "00000009", role: "Life Coach, Kampala", story: "The Entrepreneurship course helped me turn my passion for coaching into a sustainable career. Coach Brian's guidance was transformational.", course: "Entrepreneurship & Life Purpose", rating: 5 },
  { id: 3, name: "Lena W.", avatar: "LW", virtualNumber: "00000015", role: "HR Manager, Bujumbura", story: "The Emotional Wellness course completely changed how I handle stress at work. I'm now a better leader and a calmer person.", course: "Emotional Wellness", rating: 5 },
  { id: 4, name: "Kwame A.", avatar: "KA", virtualNumber: "00000018", role: "Student, Accra", story: "I joined the 30-day mindset challenge on a whim and it changed my life. The community accountability kept me going every single day.", course: "30-Day Mindset Challenge", rating: 5 },
];

// ─── Mentorship (mock) ────────────────────────────────────────────────────────
export type Mentor = {
  id: number;
  name: string;
  avatar: string;
  virtualNumber: string;
  expertise: string[];
  bio: string;
  sessions: number;
  rating: number;
  available: boolean;
};

export const mockMentors: Mentor[] = [
  { id: 3, name: "Dr. Amara Osei", avatar: "AO", virtualNumber: "00000003", expertise: ["Mindset", "Mental Wellness", "Personal Growth"], bio: "Certified life coach with 10+ years helping individuals break through mental barriers and achieve their full potential.", sessions: 124, rating: 4.9, available: true },
  { id: 5, name: "Coach Brian Nduta", avatar: "BN", virtualNumber: "00000005", expertise: ["Entrepreneurship", "Life Purpose", "Goal Setting"], bio: "Serial entrepreneur and certified coach passionate about helping people build purpose-driven businesses.", sessions: 98, rating: 4.8, available: true },
  { id: 6, name: "Grace M.", avatar: "GM", virtualNumber: "00000006", expertise: ["Emotional Intelligence", "Relationships", "Communication"], bio: "Emotional wellness specialist helping professionals build stronger relationships and lead with empathy.", sessions: 76, rating: 4.7, available: false },
];
