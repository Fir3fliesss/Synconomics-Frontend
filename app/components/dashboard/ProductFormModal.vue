<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="glass-card max-w-lg w-full p-8 rounded-3xl relative">
      <button @click="$emit('close')" class="absolute top-6 right-6 text-syn-muted hover:text-white transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <h2 class="font-display text-2xl mb-6 text-white tracking-tight">
        {{ initialData ? 'Edit Produk' : 'Tambah Produk' }}
      </h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Nama Produk</label>
          <input 
            v-model="form.name" 
            placeholder="Misal: Kopi Robusta 1kg"
            type="text" 
            required 
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors"
          >
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm text-syn-muted mb-2 font-medium">Harga (Rp)</label>
            <input 
              v-model="form.price" 
              type="number" 
              required 
              min="0"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white transition-colors"
            >
          </div>
          <div>
            <label class="block text-sm text-syn-muted mb-2 font-medium">Stok Awal</label>
            <input 
              v-model="form.stock" 
              type="number" 
              required 
              min="0"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white transition-colors"
            >
          </div>
        </div>
        
        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Stok Minimum</label>
          <input 
            v-model="form.min_stock" 
            type="number" 
            required 
            min="0"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white transition-colors"
          >
        </div>
        
        <!-- Additional Fields for completeness -->
        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Deskripsi</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm text-syn-muted mb-2 font-medium">Gambar Produk</label>
          
          <div v-if="initialData?.image_url && !selectedFile" class="mb-3">
            <p class="text-xs text-syn-cream/50 mb-2">Gambar saat ini:</p>
            <div class="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
              <img :src="getImageUrl(initialData.image_url)" class="w-full h-full object-cover" alt="Product image" />
            </div>
          </div>

          <input 
            type="file" 
            accept="image/*"
            @change="handleFileChange"
            class="w-full text-sm text-syn-muted file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-syn-surface file:text-white hover:file:bg-syn-surface/80 transition-colors bg-white/5 border border-white/10 rounded-xl"
          >
          <p v-if="initialData?.image_url" class="text-xs text-syn-muted mt-2 tracking-wide">*Biarkan kosong jika tidak ingin mengubah gambar.</p>
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="w-full py-4 mt-6 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50"
        >
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Produk' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Product } from '../../types/product.types';

const props = defineProps<{
  businessId: number;
  initialData?: Product | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const { createProduct, updateProduct } = useProduct();

const isSubmitting = ref(false);

const config = useRuntimeConfig();
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${config.public.apiBase}/${url.replace(/^\//, '')}`;
};

const form = ref({
  name: props.initialData?.name || '',
  price: props.initialData?.price || '',
  stock: props.initialData?.stock || '',
  min_stock: props.initialData?.min_stock || '10', // Default 10 if not present
  description: props.initialData?.description || ''
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name,
      price: newVal.price.toString(),
      stock: newVal.stock.toString(),
      min_stock: newVal.min_stock?.toString() || '10',
      description: newVal.description || ''
    };
  }
}, { immediate: true });
const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0] || null;
  }
};

const handleSubmit = async () => {
  if (!form.value.name || !form.value.price || !props.businessId) return;
  
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('business_id', props.businessId.toString());
    formData.append('name', form.value.name);
    formData.append('description', form.value.description);
    formData.append('price', form.value.price.toString());
    formData.append('stock', form.value.stock.toString());
    formData.append('min_stock', form.value.min_stock.toString());
    
    if (selectedFile.value) {
      formData.append('image_url', selectedFile.value as Blob);
    }
    
    if (props.initialData?.id) {
      await updateProduct(props.initialData.id, formData);
    } else {
      await createProduct(formData);
    }
    
    emit('saved');
  } catch (err) {
    console.error('Failed to save product', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
