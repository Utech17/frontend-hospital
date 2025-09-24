<template>
  <div
    :class="`${styles[props.type].div} max-w-[500px] max-h-[400px] overflow-y-auto flex gap-2 items-center p-4 mb-4 border-2 bg-white rounded-lg`"
    role="alert"
  >
    <span class="min-w-[25px] max-w-[25px] h-full">
      <svg-danger
        v-if="props.type === 'danger'"
        class="w-full h-full text-red-500"
      />
      <svg-check
        v-else-if="props.type === 'success'"
        class="w-full h-full text-green-500"
      />
      <svg-info
        v-else-if="props.type === 'info'"
        class="w-full h-full text-blue-500"
      />
      <svg-warning v-else class="w-full h-full text-yellow-400" />
    </span>

    <div class="text-sm font-medium text-ellipsis line-clamp-4">
      {{ props.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Type = "success" | "warning" | "info" | "danger";
const styles = {
  success: {
    div: "text-green-800 border-green-500 bg-green-50",
    dismiss:
      "bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200",
  },
  warning: {
    div: "text-yellow-800 border-yellow-300 bg-yellow-50",
    dismiss:
      "bg-yellow-50 text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200",
  },
  info: {
    div: "text-blue-800 border-blue-300 bg-blue-50",
    dismiss: "bg-blue-50 text-blue-500 focus:ring-blue-400 hover:bg-blue-200",
  },
  danger: {
    div: "text-red-800 border-red-500 bg-red-50",
    dismiss: "bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200",
  },
};

const props = defineProps({
  type: {
    type: String as PropType<Type>,
    default: "success",
  },
  message: {
    type: String,
    required: true,
  },
});
</script>
