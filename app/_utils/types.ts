export interface Project {
  review: string;
  id: number;
  title: string;
  student: string;
  status: string;
  submissionYear: string;
  abstract: string;
  fileUrl: string;
  studentId: string;
  supervisorId: string;
  category: string;
  createdAt: string;
}

export interface Stats {
  projects: Number;
  projectReviews: Number;
  approved: Number;
  revisions: Number;
}
