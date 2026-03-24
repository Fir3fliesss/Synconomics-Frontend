<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Business Health Overview</h1>
      <p class="text-syn-muted text-[15px]">Global performance metrics for the current fiscal quarter.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardStatCard 
        title="Total Revenue" 
        value="$128,430.00" 
        :trend="12.5" 
        icon="heroicons:arrow-trending-up"
        iconColor="success"
      />
      <DashboardStatCard 
        title="Total Cost" 
        value="$45,200.00" 
        :trend="-2.3" 
        icon="heroicons:banknotes"
        iconColor="danger"
      />
      <DashboardStatCard 
        title="Operational Cost" 
        value="$12,800.00" 
        :trend="-0.5" 
        icon="heroicons:cog"
        iconColor="warning"
      />
      <DashboardStatCard 
        title="Net Profit" 
        value="$70,430.00" 
        :trend="14.2" 
        icon="heroicons:building-library"
        iconColor="accent"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <DashboardProductManagement />
      </div>
      
      <div class="space-y-8 flex flex-col">
        <div class="flex-1">
          <DashboardAiMentor />
        </div>
        <DashboardWeeklyPerformance />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})
</script>