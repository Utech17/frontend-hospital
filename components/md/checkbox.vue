<template>
  <div
    v-if="type === 'form'"
    :class="`${
      $attrs.class
        ? `flex flex-col gap-3 ${width}`
        : `flex flex-col gap-3 ${width}`
    } pointer-events-auto`"
  >
    <label
      v-if="title"
      :for="id"
      class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white"
    >
      {{ title }}
    </label>
    <vField
      :id="id"
      type="checkbox"
      :name="name"
      v-model="proxyValue"
      :value="true"
      :unchecked-value="false"
      :placeholder="placeholder"
      :class="`${
        $attrs.class
          ? $attrs.class
          : 'border p-2  border-slate-500 text-orange-500 focus:border-slate-600 focus:ring-slate-600 rounded'
      }`"
    />

    <v-error-message :name="name" class="text-red-500" />
  </div>

  <div v-else class="relative pl-3 h-[28px]">
    <div class="w-full flex flex-row absolute top-[4px] items-center">
      <label
        v-if="title"
        :for="id"
        class="w-[30%] text-sm font-bold text-black tracking-wide cursor-pointer"
      >
        {{ title }}
      </label>
      <input
        :id="id"
        type="checkbox"
        :name="name"
        v-model="proxyValue"
        :class="`${
          $attrs.class
            ? $attrs.class
            : 'border border-slate-500 text-orange-500 focus:border-slate-600 focus:ring-0 rounded mr-auto'
        } cursor-pointer`"
      />
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
const emit = defineEmits(["update:modelValue"]);
const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: false,
  },
  width: {
    type: String,
    default: "w-full",
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: "form",
  },
});
const id = uuidv4();
</script>
