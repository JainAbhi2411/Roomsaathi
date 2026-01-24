import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { FilterOptions } from '@/types/index';

interface SearchFilterContextType {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  updateFilter: (key: keyof FilterOptions, value: any) => void;
  clearFilters: () => void;
  applyFiltersToUrl: () => void;
  activeFilterCount: number;
}

const SearchFilterContext = createContext<SearchFilterContextType | undefined>(undefined);

export function SearchFilterProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFiltersState] = useState<FilterOptions>({});

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: FilterOptions = {};
    const city = searchParams.get('city');
    const locality = searchParams.get('locality');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const verified = searchParams.get('verified');
    const priceMin = searchParams.get('price_min');
    const priceMax = searchParams.get('price_max');
    const amenities = searchParams.get('amenities');
    const suitableFor = searchParams.get('suitable_for');
    const foodIncluded = searchParams.get('food_included');

    if (city) urlFilters.city = city;
    if (locality) urlFilters.locality = locality;
    if (type) urlFilters.type = type;
    if (search) urlFilters.search = search;
    if (verified === 'true') urlFilters.verified = true;
    if (priceMin) urlFilters.price_min = Number.parseInt(priceMin);
    if (priceMax) urlFilters.price_max = Number.parseInt(priceMax);
    if (amenities) urlFilters.amenities = amenities.split(',');
    if (suitableFor) urlFilters.suitable_for = suitableFor;
    if (foodIncluded === 'true') urlFilters.food_included = true;

    setFiltersState(urlFilters);
  }, [searchParams]);

  // Sync filters to URL
  const applyFiltersToUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.city) params.set('city', filters.city);
    if (filters.locality) params.set('locality', filters.locality);
    if (filters.type) params.set('type', filters.type);
    if (filters.search) params.set('search', filters.search);
    if (filters.verified) params.set('verified', 'true');
    if (filters.price_min) params.set('price_min', filters.price_min.toString());
    if (filters.price_max) params.set('price_max', filters.price_max.toString());
    if (filters.amenities && filters.amenities.length > 0) {
      params.set('amenities', filters.amenities.join(','));
    }
    if (filters.suitable_for) params.set('suitable_for', filters.suitable_for);
    if (filters.food_included) params.set('food_included', 'true');

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const setFilters = useCallback((newFilters: FilterOptions) => {
    setFiltersState(newFilters);
  }, []);

  const updateFilter = useCallback((key: keyof FilterOptions, value: any) => {
    setFiltersState(prev => {
      const updated = { ...prev };
      
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        delete updated[key];
      } else {
        updated[key] = value;
      }

      // Clear locality if city changes
      if (key === 'city' && value !== prev.city) {
        delete updated.locality;
      }

      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Calculate active filter count
  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;

  return (
    <SearchFilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        applyFiltersToUrl,
        activeFilterCount,
      }}
    >
      {children}
    </SearchFilterContext.Provider>
  );
}

export function useSearchFilter() {
  const context = useContext(SearchFilterContext);
  if (context === undefined) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider');
  }
  return context;
}
