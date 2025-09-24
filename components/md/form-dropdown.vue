<template>
  <label
    class="flex px-2 col-span-1 justify-between items-center cursor-pointer"
    for="filtracion"
  >
    <input
      type="checkbox"
      class="border hidden p-2 border-slate-500 text-orange-500 cursor-pointer ring-0 focus:ring-0 focus:border-slate-600 focus:ring-slate-600 rounded"
      id="filtracion"
      :value="toggle"
      @change="() => $emit('update:toggle', !toggle)"
    />
    <span class="text-sm text-slate-700 font-bold cursor-pointer">
      {{ title }}
    </span>
    <svg-dropdown-arrow
      :class="`text-slate-700 origin-center transition-all  duration-300 ${
        toggle ? 'rotate-180' : 'rotate-0'
      }`"
    />
  </label>
  <div
    :class="`${
      !toggle ? 'max-h-0 overflow-hidden' : `${maxHeight} overflow-y-auto`
    } px-2 flex col-span-5 gap-4 transition-all duration-300 `"
  >
    <slot />
  </div>
</template>
<script>
export default {
  emits: ["update:toggle"],
  props: {
    toggle: {
      type: Boolean,
      default: false,
    },
    max_h: {
      type: String,
      default: "400px",
    },
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    maxHeight() {
      return `max-h-[${this.max_h}]`;
    },
  },
};
</script>
