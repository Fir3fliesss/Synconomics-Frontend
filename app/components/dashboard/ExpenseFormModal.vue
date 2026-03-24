<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="glass-card max-w-md w-full p-8 rounded-3xl relative">
      <button @click="$emit('close')" class="absolute top-6 right-6 text-syn-muted hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <h2 class="font-display text-2xl mb-6 text-white tracking-tight">
        {{ initialData ? 'Edit Transactions' : 'Record Transactions' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Title / Description</label>
          <input 
            v-model="form.title" 
            placeholder="Example: Purchase raw materials"
            type="text" 
            required 
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors"
          >
        </div>

        <div>
           <label class="block text-sm text-syn-muted mb-2 font-medium">Transaction Type</label>
           <div class="grid grid-cols-2 gap-3">
             <button 
               type="button"
               @click="form.category = 'revenue'"
               :class="['py-2 px-4 rounded-xl border text-sm font-medium transition-all text-center', form.category === 'revenue' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-syn-muted hover:bg-white/10']"
             >
               Income
             </button>
             <button 
               type="button"
               @click="form.category = 'cost'"
               :class="['py-2 px-4 rounded-xl border text-sm font-medium transition-all text-center', form.category === 'cost' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/10 text-syn-muted hover:bg-white/10']"
             >
               Expenditure
             </button>
           </div>
        </div>

        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Amount (Rp)</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-syn-muted">Rp</span>
            <input 
              v-model="form.amount" 
              type="number" 
              required 
              min="0"
              class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:border-syn-accent outline-none text-white transition-colors"
            >
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full py-4 mt-6 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Expense } from '../../types/expense.types';

const props = defineProps<{
  businessId: number;
  initialData?: Expense | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', data: any): void;
}>();

const { createExpense, updateExpense } = useExpense();

const isSubmitting = ref(false);
const form = ref({
  title: props.initialData?.title || '',
  category: props.initialData?.category || 'cost',
  amount: props.initialData ? Math.abs(props.initialData.amount).toString() : ''
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      category: newVal.category,
      amount: Math.abs(newVal.amount).toString()
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  if (!form.value.title || !form.value.amount || !props.businessId) return;
  
  isSubmitting.value = true;
  try {
    const payload = {
      title: form.value.title,
      category: form.value.category,
      amount: Number(form.value.amount),
      business_id: props.businessId
    };
    
    if (props.initialData?.id) {
      await updateExpense(props.initialData.id, payload);
    } else {
      await createExpense(payload);
    }
    emit('saved', payload);
  } catch (err) {
    console.error('Failed to save expense', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
