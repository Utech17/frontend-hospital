<template>
  <div
    :id="idToast"
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
    <button
      type="button"
      :class="`${styles[props.type].dismiss} rounded-lg ml-[2px] -mx-1.5 -my-1.5  focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8`"
      :id="closeToast"
    >
      <span class="sr-only">Dismiss</span>
      <svg-close />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Dismiss } from "flowbite";
import type { DismissOptions, DismissInterface } from "flowbite";

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
  id: {
    type: String,
    required: true,
  },
});

const idToast =
  props.type === "success"
    ? "toast-success-" + props.id
    : props.type === "warning"
      ? "toast-warning-" + props.id
      : props.type === "danger"
        ? "toast-danger" + props.id
        : "toast-info-" + props.id;

const closeToast = "close-" + props.id;

onMounted(() => {
  // target element that will be dismissed
  const $targetEl: HTMLElement = document.getElementById(idToast);
  // optional trigger element
  const $triggerEl = document.getElementById(closeToast);
  // options object
  const options: DismissOptions = {
    transition: "transition-opacity",
    duration: 300,
    timing: "ease-in",
  };

  // instance options object
  const instanceOptions = {
    id: idToast,
    override: true,
  };

  /*
   * $targetEl (required)
   * $triggerEl (optional)
   * options (optional)
   * instanceOptions (optional)
   */
  const dismiss: DismissInterface = new Dismiss(
    $targetEl,
    $triggerEl,
    options,
    instanceOptions,
  );
  // programmatically hide it
  setTimeout(() => dismiss.hide(), stateMachineStore().toastTimeOut);

  $targetEl.parentElement.style.zIndex = "9999999";
});
</script>
