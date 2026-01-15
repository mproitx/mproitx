// Database Types for PM - Roit Educational App

export type UserRole = 'user' | 'admin';

export type ContentCategory = 
  | 'notes' 
  | 'pyq' 
  | 'important_questions' 
  | 'reference_books' 
  | 'mind_maps' 
  | 'formulas' 
  | 'mcq_tests' 
  | 'iit_jee_questions';

export type NotificationType = 'new_content' | 'exam_reminder' | 'announcement' | 'system';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  profile_photo_url: string | null;
  student_class: string | null;
  school_name: string | null;
  city: string | null;
  pincode: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  category: ContentCategory;
  class: number;
  subject: string;
  chapter: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface MCQQuestion {
  id: string;
  category: ContentCategory;
  class: number;
  subject: string;
  chapter: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string | null;
  difficulty: Difficulty | null;
  created_by: string;
  created_at: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  category: ContentCategory;
  class: number;
  subject: string;
  chapter: string | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number;
  answers: Record<string, string>;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata: Record<string, unknown> | null;
  sent_by: string | null;
  created_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  notification_id: string;
  read: boolean;
  created_at: string;
  notification?: Notification;
}

export interface RecentlyViewed {
  id: string;
  user_id: string;
  content_id: string;
  viewed_at: string;
  content?: Content;
}

export interface Download {
  id: string;
  user_id: string;
  content_id: string;
  downloaded_at: string;
  content?: Content;
}

// Category Display Info
export interface CategoryInfo {
  id: ContentCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Test Configuration
export interface TestConfig {
  category: ContentCategory;
  class: number;
  subject: string;
  chapter?: string;
  questionCount: number;
  timeLimit: number; // in seconds
  difficulty?: Difficulty;
}

// Test Answer
export interface TestAnswer {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timeTaken: number;
}

// AI Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

// Content Filter
export interface ContentFilter {
  category?: ContentCategory;
  class?: number;
  subject?: string;
  chapter?: string;
  search?: string;
}
