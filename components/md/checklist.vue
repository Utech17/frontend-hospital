<template>
  <div class="flex w-full flex-col justify-center align-center gap-4">
    <div class="flex flex-row justify-center align-center gap-2 flex-wrap">
      <label
        class="flex items-center hover:bg-gray-50 ps-4 border cursor-pointer border-slate-200 rounded-md dark:border-gray-700 px-4 min-w-[100px]"
        v-for="(item, i) in list_[0]"
        :key="i"
        :for="item.name + 'a'"
      >
        <input
          :id="item.name + 'a'"
          type="checkbox"
          v-model="item.status"
          :checked="item.status"
          @change="onChange"
          class="border border-slate-500 cursor-pointer text-orange-500 focus:border-slate-600 focus:ring-slate-600 rounded"
        />
        <label
          :for="item.name + 'a'"
          class="w-full py-3 ms-2 text-sm cursor-pointer font-medium text-gray-700 dark:text-gray-300"
          >{{ item.name }}</label
        >
      </label>
    </div>
    <div
      v-if="list[1]"
      class="flex flex-row justify-center align-center gap-2 flex-wrap"
    >
      <label
        class="flex items-center hover:bg-gray-50 ps-4 border cursor-pointer border-gray-200 rounded-md dark:border-gray-700 px-4 min-w-[100px]"
        v-for="(item, i) in list_[1]"
        :key="i"
        :for="item.name + 'a'"
      >
        <input
          :id="item.name + 'a'"
          type="checkbox"
          v-model="item.status"
          :checked="item.status"
          @change="onChange"
          class="border border-slate-500 cursor-pointer text-orange-500 focus:border-slate-600 focus:ring-slate-600 rounded"
        />
        <label
          :for="item.name + 'a'"
          class="w-full py-3 ms-2 text-sm cursor-pointer font-medium text-gray-700 dark:text-gray-300"
          >{{ item.name }}</label
        >
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
  },
  max: {
    type: Number,
    default: 6,
  },
});
const list_ = computed(() => {
  const list = props.list;
  const max = props.max;
  const mid = Math.ceil(list.length / 2);
  const mid1 = list.slice(0, mid);
  const mid2 = list.slice(mid);
  const divided_list = [mid1, mid2];
  return list.length >= max ? divided_list : [list, false];
});
</script>
<style lang="css">
.item:last-child {
  border: none;
}
</style>
