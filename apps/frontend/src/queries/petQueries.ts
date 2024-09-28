import petService, { SortOrder } from '@frontend/services/petService';
import { PaginatedList } from '@frontend/services/types/pagination';
import { UseQueryOptions } from '@tanstack/react-query';
import { Pet } from '@validation/schema/pet.schema';

const petQueries = {
  list(query: {
    page: number;
    pageSize: number;
    order?: SortOrder;
  }): UseQueryOptions<PaginatedList<Pet>> {
    return {
      queryKey: ['listPets', query],
      queryFn: () => petService.listPets(query),
    };
  },
} as const;

export default petQueries;
