import { ref } from 'vue';
import { communityService } from '../services/community.service';
import type { Thread, Reply } from '../types/community.types';

export const useCommunity = () => {
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  
  const threads = ref<Thread[]>([]);
  const currentThread = ref<Thread | null>(null);
  const replies = ref<Reply[]>([]);

  // Threads
  const fetchThreads = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await communityService.getThreads();
      threads.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat thread forum';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchThreadById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await communityService.getThreadById(id);
      currentThread.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat detail thread';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createThread = async (payload: { title: string; content: string }) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await communityService.createThread(payload);
      threads.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal membuat thread';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const updateThread = async (id: number, payload: { title: string; content: string }) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await communityService.updateThread(id, payload);
      const index = threads.value.findIndex(t => t.id === id);
      if (index !== -1) {
        threads.value[index] = response.data;
      }
      if (currentThread.value?.id === id) {
        currentThread.value = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengubah thread';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const deleteThread = async (id: number) => {
    isSaving.value = true;
    error.value = null;
    try {
      await communityService.deleteThread(id);
      threads.value = threads.value.filter(t => t.id !== id);
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal menghapus thread';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  // Replies
  const fetchReplies = async (threadId: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await communityService.getReplies(threadId);
      replies.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat balasan';
    } finally {
      isLoading.value = false;
    }
  };

  const createReply = async (payload: { thread_id: number; content: string }) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await communityService.createReply(payload);
      replies.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengirim balasan';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };
  
  const updateReply = async (id: number, payload: { content: string }) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await communityService.updateReply(id, payload);
      const index = replies.value.findIndex(r => r.id === id);
      if (index !== -1) {
        replies.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengubah balasan';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };
  
  const deleteReply = async (id: number) => {
    isSaving.value = true;
    error.value = null;
    try {
      await communityService.deleteReply(id);
      replies.value = replies.value.filter(r => r.id !== id);
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal menghapus balasan';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    isLoading,
    isSaving,
    error,
    threads,
    currentThread,
    replies,
    fetchThreads,
    fetchThreadById,
    createThread,
    updateThread,
    deleteThread,
    fetchReplies,
    createReply,
    updateReply,
    deleteReply
  };
};
