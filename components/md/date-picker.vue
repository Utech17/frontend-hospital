<template>
  <div :class="`flex flex-col gap-3 ${width}`">
    <label
      v-if="title"
      :for="id"
      class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white"
    >
      {{ title }}
    </label>
    <div class="relative w-full h-full min-h-9">
      <div
        :class="`flex rounded-lg relative w-full ${
          type === 'time' ? 'ps-3 h-[42px] border border-gray-300' : 'h-[36px]'
        }
          overflow-hidden items-center text-gray-900
        ${disabled ? 'opacity-80 bg-gray-50 text-orange-400' : 'bg-white'}
        `"
      >
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg-date />
        </div>
        <vField
          :id="id"
          :disabled="disabled"
          :name="name"
          v-model="proxyValue"
          datepicker-format="dd/mm/yyyy"
          v-mask="stateMachineStore().maskGen('##/##/####')"
          :placeholder="placeholder"
          :class="`${$attrs.class ? $attrs.class : ''}
          ${
            type === 'time'
              ? 'border-none border-transparent outline-none'
              : 'border border-slate-400 text-orange-500 ring-1 focus:ring-slate-600 focus:border-slate-600'
          } bg-transparent w-full h-full rounded-lg pl-9 text-orange-500`"
        />
        <input
          v-if="type === 'time'"
          type="time"
          ref="refTime"
          :disabled="disabled"
          :class="`
          w-full h-full p-0 pr-2 border-none group/time text-orange-500 focus:border-transparent focus:ring-0`"
          value="00:00"
          @change="(e) => updateModelValue(e.target.value)"
        />
      </div>
    </div>
    <v-error-message :name="name" class="text-red-500" />
  </div>
  <div
    v-if="type === 'time'"
    ref="targetEl"
    role="tooltip"
    class="absolute w-64 z-10 p-5 text-sm text-gray-500 transition-opacity duration-300 bg-white rounded-lg opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
  >
    <ul id="timetable" class="grid w-full grid-cols-2 gap-2">
      <li v-for="(hour, i) in hours" :key="i">
        <input
          type="radio"
          :id="`${hour.value}${id}`"
          value=""
          @click="
            () => {
              refTime.value = hour.value;
              updateModelValue(hour.value);
            }
          "
          class="hidden peer"
          name="timetable"
        />
        <label
          :for="`${hour.value}${id}`"
          class="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-orange-500 border-gray-200 hover:text-white peer-checked:text-white hover:bg-orange-500 peer-checked:bg-orange-500"
        >
          {{ hour.name }}
        </label>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import Datepicker from "flowbite-datepicker/Datepicker";
import es from "../../node_modules/flowbite-datepicker/js/i18n/locales/es.js";
import { Popover } from "flowbite";

const props = defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "date",
  },
  inputType: {
    type: String,
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
  defaultTime: {
    type: String,
    default: "00:00",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hours: {
    type: Array,
    default: [
      { name: "8:00 AM", value: "08:00" },
      { name: "9:00 AM", value: "09:00" },
      { name: "10:00 AM", value: "10:00" },
      { name: "11:00 AM", value: "11:00" },
      { name: "12:00 PM", value: "12:00" },
      { name: "13:00 PM", value: "13:00" },
      { name: "2:00 PM", value: "14:00" },
      { name: "4:00 PM", value: "16:00" },
      { name: "6:00 PM", value: "18:00" },
      { name: "8:00 PM", value: "20:00" },
    ],
  },
});

const id = uuidv4();
const refTime = ref(null);
const emit = defineEmits(["update:modelValue"]);
const proxyValue = computed({
  get() {
    const val =
      props.type === "time"
        ? props.modelValue + " " + refTime.value?.value
        : props.modelValue;
    return val;
  },
  set(newValue) {
    const val =
      props.type === "time" ? newValue + " " + refTime.value?.value : newValue;
    emit("update:modelValue", val);
  },
});
const updateModelValue = (timeValue) => {
  const [date] = proxyValue.value.split(" ");
  const value = date + " " + timeValue;
  emit("update:modelValue", value);
  return date;
};

const targetEl = ref(null);
onMounted(() => {
  const $targetEl = targetEl.value;
  const $triggerEl = refTime.value;

  const options = {
    placement: "bottom",
    triggerType: "click",
    offset: 10,
  };

  const instanceOptions = {
    id: "popoverContent",
    override: true,
  };
  const popover = new Popover($targetEl, $triggerEl, options, instanceOptions);

  const datepickerEl = document.getElementById(id);
  Object.assign(Datepicker.locales, es);
  new Datepicker(datepickerEl, {
    language: "es",
  });

  datepickerEl.addEventListener("changeDate", function () {
    emit("update:modelValue", this.value);
  });

  if (props.type === "time") {
    refTime.value.value = props.defaultTime;
    emit("update:modelValue", `${datepickerEl.value} ${props.defaultTime}`);
  }
});
</script>
<style lang="css">
.focused,
.selected {
  background-color: rgb(255 90 31 / 1) !important;
}
</style>
