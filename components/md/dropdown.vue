<template>
  <button
    :id="`${props.id}Button`"
    :data-dropdown-toggle="`${props.id}`"
    class="px-4 py-1 flex gap-5 items-center group/btn"
  >
    <div class="text-start">
      <slot name="default" />
    </div>
    <svg-dropdown-arrow
      class="origin-center transition-all duration-200 rotate-0 group-focus-within/btn:rotate-180"
    />
  </button>

  <!-- Dropdown menu -->
  <div
    :id="`${props.id}`"
    class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-48"
  >
    <ul
      class="text-sm text-gray-700 dark:text-gray-200"
      :aria-labelledby="`${props.id}Button`"
    >
      <div class="divide-y divide-gray-100">
        <slot name="list" />
      </div>
    </ul>
    <div class="py-1">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
    default: "dropdownDivider",
  },
  divider: {
    type: Boolean,
    default: true,
  },
});
</script>
