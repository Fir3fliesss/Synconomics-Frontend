<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Inventory Details</h1>
        <p class="text-syn-muted text-[15px]">Comprehensive view of all products, stock levels, and metrics.</p>

        <div class="mt-4 flex items-center gap-3" v-if="businesses.length > 0">
          <label class="text-sm text-syn-muted font-medium">Pilih Bisnis:</label>
          <select 
            v-model="activeBusinessId" 
            @change="handleBusinessChange"
            class="bg-syn-surface border border-syn-border rounded-lg px-3 py-1.5 text-sm text-syn-cream focus:outline-none focus:border-syn-accent/50 appearance-none pr-8 relative cursor-pointer"
            style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23A3A3A3%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 0.7rem top 50%; background-size: 0.65rem auto;"
          >
            <option v-for="b in businesses" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </div>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="openCreateModal"
          v-if="activeBusinessId"
          class="flex items-center gap-2 bg-syn-accent text-syn-dark px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>

    <!-- Inventory Table Wrapper -->
    <div class="bg-syn-dark border border-syn-border rounded-2xl overflow-hidden flex flex-col glow-border relative min-h-[400px]">
      
      <div v-if="isLoading" class="absolute inset-0 bg-syn-darker/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Search/Filters Bar -->
      <div class="p-4 border-b border-syn-border flex items-center justify-between bg-syn-darker/50">
        <div class="relative w-80">
          <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-syn-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search SKUs or product names..." 
            class="w-full bg-syn-surface border border-syn-border rounded-lg py-1.5 pl-10 pr-4 text-sm text-syn-cream placeholder-syn-muted focus:outline-none focus:border-syn-accent/30 transition-all"
          />
        </div>
        <div class="flex items-center gap-3 text-sm text-syn-muted">
          Showing {{ products.length }} items
        </div>
      </div>

      <!-- Header row -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-syn-border text-[11px] font-bold text-syn-muted tracking-wider uppercase bg-syn-surface/30">
        <div class="col-span-1"></div>
        <div class="col-span-4">Product Details</div>
        <div class="col-span-2">Category</div>
        <div class="col-span-2 text-right">Unit Price</div>
        <div class="col-span-2 text-right">Available Stock</div>
        <div class="col-span-1 text-center">Actions</div>
      </div>

      <!-- List -->
      <div v-if="products.length === 0" class="py-20 text-center text-syn-muted">
        Tidak ada produk dalam inventaris. Tambahkan produk pertama Anda.
      </div>
      <div v-else class="divide-y divide-syn-border bg-syn-dark">
        <div v-for="item in products" :key="item.id" class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          
          <div class="col-span-1">
             <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border group-hover:border-syn-accent/30 transition-colors overflow-hidden">
               <img v-if="item.image_url" :src="item.image_url" class="w-full h-full object-cover"/>
               <Icon v-else name="heroicons:cube" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
          </div>
          
          <div class="col-span-4">
            <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">{{ item.name }}</h4>
            <p class="text-xs text-syn-muted mt-0.5 font-mono">ID: PROD-{{ item.id }}</p>
          </div>

          <div class="col-span-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-syn-surface text-syn-muted border border-syn-border">
              {{ item.description ? 'Aktif' : 'N/A' }}
            </span>
          </div>

          <div class="col-span-2 text-right">
            <span class="text-sm font-medium text-syn-cream">{{ formatCurrency(item.price) }}</span>
          </div>

          <div class="col-span-2 text-right flex flex-col items-end justify-center">
            <span :class="['text-sm font-bold mb-1.5', item.stock > 10 ? 'text-syn-cream' : 'text-syn-warning']">{{ item.stock.toLocaleString() }}</span>
            <div class="h-1.5 w-16 bg-syn-border rounded-full overflow-hidden">
              <div :class="['h-full rounded-full', item.stock > 10 ? 'bg-syn-success' : 'bg-syn-warning']" :style="{ width: Math.min(100, (item.stock / 100) * 100) + '%' }"></div>
            </div>
          </div>

          <div class="col-span-1 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="handleEdit(item)" class="p-1.5 flex text-syn-muted hover:text-syn-cream bg-syn-surface rounded-md border border-syn-border hover:border-syn-accent/30 transition-colors">
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            </button>
            <button @click="handleDelete(item.id)" class="p-1.5 flex text-syn-muted hover:text-red-400 bg-syn-surface rounded-md border border-syn-border hover:border-red-500/30 transition-colors">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal -->
    <DashboardProductFormModal 
      v-if="showModal" 
      :businessId="activeBusinessId"
      :initialData="selectedProduct"
      @close="closeModal"
      @saved="onProductSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
  path: '/dashboard/inventory'
});

const showModal = ref(false);
const selectedProduct = ref(null);

const { businesses, fetchBusinesses } = useBusiness();
const { products, isLoading, fetchProducts, deleteProduct } = useProduct();

const activeBusinessId = ref<number>(0);

onMounted(async () => {
  await fetchBusinesses();
  const firstBusiness = businesses.value?.[0];
  if (firstBusiness) {
    activeBusinessId.value = firstBusiness.id;
    await fetchProducts(activeBusinessId.value);
  }
});

const handleBusinessChange = async () => {
  if (activeBusinessId.value) {
    await fetchProducts(activeBusinessId.value);
  }
};

const openCreateModal = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const handleEdit = (product: any) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const onProductSaved = async () => {
  closeModal();
  if (activeBusinessId.value) {
    await fetchProducts(activeBusinessId.value);
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Anda yakin ingin menghapus produk ini?')) {
    await deleteProduct(id);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
</script>
