<template>
  <km-table-row
    role="status"
    v-for="i in limit"
    class="w-full rounded animate-pulse dark:divide-gray-700 dark:border-gray-700"
  >
    <td class="px-6 py-1" v-for="i in columns" :key="1">
      <div
        v-if="i <= 1"
        class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-20"
      ></div>

      <div
        v-else-if="i <= 3"
        class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"
      ></div>

      <div v-else-if="i < 5">
        <div
          class="h-2 justify-start bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-1.5"
        ></div>
        <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
      <div v-else-if="i <= 6">
        <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    </td>
    <td class="px-6 py-1">
      <div class="flex gap-3">
        <div class="h-4 w-4 bg-gray-300 rounded-full dark:bg-gray-700"></div>
        <div class="h-4 w-4 bg-gray-300 rounded-full dark:bg-gray-700"></div>
      </div>
    </td>
  </km-table-row>
</template>

<script>
export default {
  methods: {
    randItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    },
  },
  props: {
    limit: {
      default: 5,
    },
    columns: {
      type: Number,
      default: 5,
    },
  },
};
</script>
