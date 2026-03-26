import { ref } from 'vue';
import { businessService } from '../services/business.service';
import type { Business, BusinessMetric } from '../types/business.types';

export const useBusinessDetail = (businessId: number) => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const business = ref<Business | null>(null);
  const metrics = ref<BusinessMetric | null>(null);
  const score = ref<any | null>(null);

  const fetchBusinessData = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Fetch details, metrics, and score simultaneously
      const [businessRes, metricsRes, scoreRes] = await Promise.allSettled([
        businessService.getById(businessId),
        businessService.getLatestMetrics(businessId),
        businessService.getLatestScore(businessId)
      ]);

      if (businessRes.status === 'fulfilled') {
        business.value = businessRes.value.data;
      } else {
        throw new Error('Gagal memuat detail bisnis');
      }

      // It's okay if metrics or scores fail (e.g., 404 Not Found),
      // we just treat them as null.
      if (metricsRes.status === 'fulfilled') {
        metrics.value = metricsRes.value.data;
      }
      
      if (scoreRes.status === 'fulfilled') {
        score.value = scoreRes.value.data;
      }
      
    } catch (err: any) {
      error.value = err.message || err.data?.message || 'Gagal memuat data bisnis lengkap';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    business,
    metrics,
    score,
    fetchBusinessData
  };
};
