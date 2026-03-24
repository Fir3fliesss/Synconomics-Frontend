export interface CommunityUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Thread {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  user?: CommunityUser;
}

export interface Reply {
  id: number;
  user_id: number;
  title?: string;
  content: string;
  created_at: string;
  user?: CommunityUser;
  thread_id?: number;
}
