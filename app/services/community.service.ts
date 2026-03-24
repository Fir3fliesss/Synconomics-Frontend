import { apiFetch } from './api';
import type { ApiResponse } from '../types/api.types';
import type { Thread, Reply } from '../types/community.types';

export const communityService = {
  // Threads
  getThreads(): Promise<ApiResponse<Thread[]>> {
    return apiFetch(`/threads`, {
      method: 'GET'
    });
  },

  getThreadById(id: number): Promise<ApiResponse<Thread>> {
    return apiFetch(`/threads/${id}`, {
      method: 'GET'
    });
  },

  createThread(payload: { title: string; content: string }): Promise<ApiResponse<Thread>> {
    return apiFetch(`/threads`, {
      method: 'POST',
      body: payload
    });
  },

  updateThread(id: number, payload: { title: string; content: string }): Promise<ApiResponse<Thread>> {
    return apiFetch(`/threads/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  deleteThread(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/threads/${id}`, {
      method: 'DELETE'
    });
  },

  // Replies
  getReplies(threadId: number): Promise<ApiResponse<Reply[]>> {
    return apiFetch(`/replies/thread/${threadId}`, {
      method: 'GET'
    });
  },

  createReply(payload: { thread_id: number; content: string }): Promise<ApiResponse<Reply>> {
    return apiFetch(`/replies`, {
      method: 'POST',
      body: payload
    });
  },
  
  updateReply(id: number, payload: { content: string }): Promise<ApiResponse<Reply>> {
    return apiFetch(`/replies/${id}`, {
      method: 'PUT',
      body: payload
    });
  },

  deleteReply(id: number): Promise<ApiResponse<null>> {
    return apiFetch(`/replies/${id}`, {
      method: 'DELETE'
    });
  }
};
