<template>
  <div class="flex flex-col w-full gap-5">
    <div class="shadow-md bg-white rounded-lg overflow-x-auto">
      <table
        class="w-full min-w-[900px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          :class="` text-xs rounded-t-lg w-full ${
            props.color ? props.color : 'text-white dark:text-gray-400'
          } uppercase ${
            props.backgroundColor
              ? props.backgroundColor
              : 'bg-slate-800 dark:bg-slate-400 border-b-[2px] border-orange-600'
          }  `"
        >
          <tr>
            <slot name="head" />
          </tr>
        </thead>
        <tbody class="w-full rounded-b-lg max-h-[400px]">
          <km-skeleton-table
            v-if="props.paginationOptions.loading"
            :limit="props.paginationOptions.limit"
            :columns="props.paginationOptions.columns"
          />
          <slot v-else />
        </tbody>
      </table>
      <div
        v-if="
          props.paginationOptions.length == 0 &&
          !props.paginationOptions.loading
        "
        class="w-full flex items-center justify-center text-center text-xl font-semibold text-slate-800 h-[200px]"
      >
        No se encontraron datos...
      </div>
    </div>
    <div
      v-if="props.pagination && paginationOptions.totalRows > 5"
      class="w-full mt-1 flex justify-center"
    >
      <km-pagination :options="props.paginationOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  backgroundColor: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  paginationOptions: {
    type: Object,
    default: () => {
      return {
        currentPage: 0,
        maxPage: 4,
        totalRows: 0,
        length: 0,
        columns: 6,
        loading: false,
        limit: 5,
        next: () => {
          return;
        },
        prev: () => {
          return;
        },
        defaultFunction: (page: number) => {
          return;
        },
        limitPages: (limit: number) => {
          return;
        },
      };
    },
  },
});
</script>
<style>
/* thead tr, */
/* tbody tr { */
/*   display: inline-table; */
/*   width: fit-content; */
/*   table-layout: fixed; */
/* } */
</style>
