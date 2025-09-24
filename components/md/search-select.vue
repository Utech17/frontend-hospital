<template>
  <div :class="`flex flex-col gap-3 ${width}`">
    <label
      v-if="title"
      :for="id"
      class="text-sm font-semibold text-slate-600 tracking-wide dark:text-white"
    >
      {{ title }}
    </label>
    <div class="relative">
      <div
        :class="`${disabled ? 'opacity-80 bg-gray-50 text-orange-400 pointer-events-none' : ''}
          relative w-full flex h-9 bg-gray-50 border items-center  border-slate-500 text-orange-500 text-sm rounded-lg focus:ring-slate-600 focus:border-slate-600`"
      >
        <input
          v-model="searchTitleName"
          :placeholder="placeholder"
          readonly
          @focus="() => (visible = true)"
          class="w-full px-2 cursor-pointer bg-transparent ring-0 outline-none"
        />
        <vField :name="name" v-model="proxyValue" class="hidden" />
        <svg-dropdown-arrow
          @click="() => (visible = true)"
          :class="`${visible ? 'rotate-180' : ' rotate-0'} text-slate-500 absolute right-2 top-3 h-3 mr-1 transition-all duration-200`"
        />
      </div>

      <div
        :class="`${visible ? '' : 'invisible'} absolute p-2 duration-200 top-10 rounded-md z-[99] w-full h-fit bg-gray-50 border border-slate-500 text-gray-600 drop-shadow-md`"
      >
        <ul>
          <li>
            <input
              v-model="searchInputData"
              placeholder="Buscar..."
              ref="input_search"
              @input="() => emit('input', searchInputData)"
              @blur="() => (visible = false)"
              class="w-full bg-white text-slate-700 border border-slate-500 px-3 py-1 rounded-md bg-transparent ring-0 outline-none"
            />
          </li>
        </ul>
        <ul class="max-h-[200px] overflow-y-auto">
          <li
            v-for="(item, i) in options"
            :key="i"
            @click="
              () => {
                emit('update:modelValue', item[props.listValue]);
                emit('change', item[props.listValue]);
                if (searchInputData) {
                  searchInputData = '';
                  emit('input', searchInputData);
                }
                visible = false;
              }
            "
            class="hover:bg-slate-100 hover:text-orange-500 p-1 text-sm font-semibold cursor-pointer rounded-md"
          >
            {{ value(item) }}
          </li>
        </ul>
      </div>
    </div>

    <v-error-message :name="name" class="text-red-500" />
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

const input_search = ref(null);
const visible = ref(false);

const emit = defineEmits(["update:modelValue", "input", "change"]);
const searchInputData = defineModel("searchInputData", { default: "" });
const searchTitleName = ref("");
const proxyValue = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit("update:modelValue", newValue);
  },
});
const props = defineProps({
  type: {
    type: String,
    default: "local",
  },
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
  },
  width: {
    type: String,
    default: "w-full",
  },
  placeholder: {
    type: String,
    default: "Buscar...",
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
  listLabel: {
    type: String,
    default: "name",
  },
  listValue: {
    type: String,
    default: "code",
  },
  selected: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const updateTitleName = (value) => {
  props.list?.forEach((item) => {
    if (item[props.listValue] === value)
      searchTitleName.value = props.listLabel.reduce(
        (acc, v) => (acc += " " + item[v]),
        "",
      );
  });
};

watch(proxyValue, (value) => {
  if (value === "") {
    searchTitleName.value = "";
    return;
  }
  updateTitleName(value);
});
const options = computed(() => {
  if (props.type === "local" && props.list) {
    return props.list.filter((item) => {
      const text = value(item).toLocaleLowerCase();
      return text.indexOf(searchInputData.value.toLocaleLowerCase()) !== -1;
    });
  }
  return props.list;
});
const value = (item) =>
  props.listLabel.reduce((acc, v) => (acc += " " + item[v]), "");

watch(visible, async (v) => {
  await nextTick();
  if (input_search.value) {
    input_search.value.removeEventListener("focus", () => {});
    input_search.value.addEventListener("focus", () => {});
    if (v) {
      setTimeout(() => {
        input_search.value.focus();
        emit("focus");
      }, 150);
    } else {
      setTimeout(() => emit("blur"), 150);
    }
  }
});
onUpdated(() => {
  if (proxyValue.value !== "") {
    updateTitleName(proxyValue.value);
  }
});
</script>
