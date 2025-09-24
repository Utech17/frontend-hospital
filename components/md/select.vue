<template>
  <div :class="`flex flex-col gap-3 ${width}`">
    <label
      v-if="title"
      :for="id"
      class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white"
    >
      {{ title }}
    </label>
    <vField
      :id="id"
      v-model="proxyValue"
      :name="name"
      as="select"
      v-slot="value"
      v-bind="$attrs"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="`${
        $attrs.class
          ? $attrs.class
          : 'h-[36px] bg-gray-50 border border-slate-500 text-orange-500 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600'
      }
      ${disabled ? 'opacity-80 bg-gray-50 text-orange-400' : ''}
      `"
    >
      <option ref="selected" value="">{{ placeholder }}</option>
      <slot name="default" />
    </vField>
    <v-error-message :name="name" class="text-red-500" />
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
const selected = ref(null);
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
  search: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "w-full",
  },
  modelValue: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  label: {
    type: String,
    default: "name",
  },
  value: {
    type: String,
    default: "code",
  },
  placeholder: {
    type: String,
    default: "Seleccione una opción",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const id = uuidv4();
onMounted(() => {
  selected.value.selected = true;
  selected.value.value = "";
});
</script>
