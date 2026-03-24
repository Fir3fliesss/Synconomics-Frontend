<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Inventory Details</h1>
        <p class="text-syn-muted text-[15px]">Comprehensive view of all products, stock levels, and warehouse metrics.</p>
      </div>
      
      <div class="flex gap-3">
        <button class="flex items-center gap-2 bg-syn-surface border border-syn-border hover:border-syn-accent/30 text-syn-cream px-4 py-2 rounded-xl text-sm font-medium transition-all">
          <Icon name="heroicons:funnel" class="w-4 h-4" />
          Filters
        </button>
        <button class="flex items-center gap-2 bg-syn-surface border border-syn-border hover:border-syn-accent/30 text-syn-cream px-4 py-2 rounded-xl text-sm font-medium transition-all">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
          Export
        </button>
      </div>
    </div>

    <!-- Inventory Table Wrapper -->
    <div class="bg-syn-dark border border-syn-border rounded-2xl overflow-hidden flex flex-col glow-border">
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
          Showing 1 - 8 of 2,492 items
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
      <div class="divide-y divide-syn-border bg-syn-dark">
        <div v-for="(item, i) in dummyInventory" :key="i" class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          
          <div class="col-span-1">
             <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border group-hover:border-syn-accent/30 transition-colors">
               <Icon :name="item.icon" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
          </div>
          
          <div class="col-span-4">
            <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">{{ item.name }}</h4>
            <p class="text-xs text-syn-muted mt-0.5 font-mono">SKU: {{ item.sku }}</p>
          </div>

          <div class="col-span-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-syn-surface text-syn-muted border border-syn-border">
              {{ item.category }}
            </span>
          </div>

          <div class="col-span-2 text-right">
            <span class="text-sm font-medium text-syn-cream">{{ item.price }}</span>
          </div>

          <div class="col-span-2 text-right flex flex-col items-end justify-center">
            <span :class="['text-sm font-bold mb-1.5', item.stock > 100 ? 'text-syn-cream' : 'text-syn-warning']">{{ item.stock.toLocaleString() }}</span>
            <div class="h-1.5 w-16 bg-syn-border rounded-full overflow-hidden">
              <div :class="['h-full rounded-full', item.stock > 100 ? 'bg-syn-success' : 'bg-syn-warning']" :style="{ width: Math.min(100, (item.stock / 500) * 100) + '%' }"></div>
            </div>
          </div>

          <div class="col-span-1 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="p-1.5 flex text-syn-muted hover:text-syn-cream bg-syn-surface rounded-md border border-syn-border hover:border-syn-accent/30 transition-colors">
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            </button>
            <button class="p-1.5 flex text-syn-muted hover:text-syn-danger bg-syn-surface rounded-md border border-syn-border hover:border-syn-danger/30 transition-colors">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      <!-- Formatting bottom pagination -->
      <div class="p-4 border-t border-syn-border flex items-center justify-between bg-syn-darker/30">
        <button class="px-4 py-2 border border-syn-border rounded-lg text-sm font-medium text-syn-muted hover:text-syn-cream hover:border-syn-accent/30 transition-all bg-syn-surface disabled:opacity-50">
          Previous
        </button>
        <div class="flex gap-2">
          <button class="w-8 h-8 rounded-lg bg-syn-accent text-syn-darker font-bold text-sm">1</button>
          <button class="w-8 h-8 rounded-lg bg-syn-surface border border-syn-border text-syn-cream hover:border-syn-accent hover:text-syn-accent text-sm transition-all focus:outline-none focus:ring-1 focus:ring-syn-accent">2</button>
          <button class="w-8 h-8 rounded-lg bg-syn-surface border border-syn-border text-syn-cream hover:border-syn-accent hover:text-syn-accent text-sm transition-all focus:outline-none focus:ring-1 focus:ring-syn-accent">3</button>
          <span class="w-8 h-8 flex items-center justify-center text-syn-muted">...</span>
          <button class="w-8 h-8 rounded-lg bg-syn-surface border border-syn-border text-syn-cream hover:border-syn-accent hover:text-syn-accent text-sm transition-all">250</button>
        </div>
        <button class="px-4 py-2 border border-syn-border rounded-lg text-sm font-medium text-syn-muted hover:text-syn-cream hover:border-syn-accent/30 transition-all bg-syn-surface">
          Next
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const dummyInventory = [
  { name: 'UltraBook Pro 16"', sku: 'UB-16-004', category: 'Electronics', price: '$1,899.00', stock: 1240, icon: 'heroicons:computer-desktop' },
  { name: 'SonicBuds Gen 2', sku: 'SB-G2-882', category: 'Audio', price: '$149.00', stock: 42, icon: 'heroicons:speaker-wave' },
  { name: 'Nexus Watch S3', sku: 'NW-S3-112', category: 'Wearables', price: '$299.00', stock: 890, icon: 'heroicons:clock' },
  { name: 'ErgoChair Pro+', sku: 'EC-P-901', category: 'Furniture', price: '$450.00', stock: 320, icon: 'heroicons:squares-plus' },
  { name: 'CloudStorage 4TB', sku: 'CS-4T-005', category: 'Components', price: '$210.00', stock: 2, icon: 'heroicons:server' },
  { name: 'ProVision 4K Monitor', sku: 'PV-4K-M3', category: 'Electronics', price: '$650.00', stock: 154, icon: 'heroicons:tv' },
  { name: 'Titan Mechanical Keyboard', sku: 'TMK-101', category: 'Accessories', price: '$120.00', stock: 450, icon: 'heroicons:device-phone-mobile' },
  { name: 'PowerHub 2000W', sku: 'PH-2K-88', category: 'Energy', price: '$980.00', stock: 15, icon: 'heroicons:bolt' }
]
</script>
