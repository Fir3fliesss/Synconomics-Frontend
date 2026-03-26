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
              v-model="formattedAmount" 
              @input="handleAmountInput"
              type="text" 
              inputmode="numeric"
              required 
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
import { ref, watch, computed } from 'vue';
import type { Expense } from '../../types/expense.types';
import { useExpense } from '~/composables/useExpense';

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
  amount: props.initialData ? Math.abs(props.initialData.amount) : 0 // Store as number
});

const formattedAmount = ref('');

// Function to format a number into IDR currency string without currency symbol
const formatNumberToIDR = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : value;
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('id-ID').format(num);
};

// Function to parse a formatted string back to a raw number
const parseFormattedNumber = (formattedString: string) => {
  if (!formattedString) return 0;
  // Remove all non-digit characters except for a potential comma (for decimal, though IDR usually uses comma for thousands)
  // For simplicity, assuming only thousands separator (dot) for now.
  const cleanString = formattedString.replace(/\./g, ''); // Remove dots (thousands separator)
  return parseFloat(cleanString);
};

// Initialize formattedAmount from form.amount
watch(() => form.value.amount, (newVal) => {
  formattedAmount.value = formatNumberToIDR(newVal);
}, { immediate: true });

// Update form.amount when formattedAmount changes (user input)
const handleAmountInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const cursorPosition = target.selectionStart;
  const oldValue = target.value;

  const rawValue = parseFormattedNumber(target.value);
  form.value.amount = rawValue;

  // Re-format the input field value
  const newFormattedValue = formatNumberToIDR(rawValue);
  formattedAmount.value = newFormattedValue;

  // Adjust cursor position after re-formatting
  // This is a bit tricky and might not be perfect for all cases,
  // but a basic attempt to keep the cursor in a reasonable place.
  const diff = newFormattedValue.length - oldValue.length;
  if (cursorPosition !== null) {
    target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
  }
};

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      category: newVal.category,
      amount: Math.abs(newVal.amount)
    };
  } else {
    form.value = {
      title: '',
      category: 'cost',
      amount: 0
    };
  }
}, { immediate: true });

const handleSubmit = async () => {
  if (!form.value.title || form.value.amount <= 0 || !props.businessId) return; // Check amount > 0
  
  isSubmitting.value = true;
  try {
    const payload = {
      title: form.value.title,
      category: form.value.category,
      amount: form.value.amount, // Use the raw number
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