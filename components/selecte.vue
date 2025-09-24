<template>
  <div class="relative z-0 w-full mb-6 group">
    <label :for="uuid" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ label }}
    </label>
    <select :id="uuid"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500">
      <option v-for="(item, i) in items" :key="i" :value="item.code">{{ item.name }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
const uuid = uuidv4()
defineProps({
  items: {
    type: Array,
    default: () => {
      return []
    }
  },
  label: {
    type: String,
    default: ""
  }
})
</script>

<style lang="scss" scoped></style>
