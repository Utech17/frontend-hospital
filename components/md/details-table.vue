<template>
  <div
    :class="[
      'rounded-lg border border-gray-300 print:border-gray-500',
      { 'animate-pulse overflow-x-auto': loading },
      $attrs.class,
    ]"
  >
    <table
      :class="[
        'relative w-full text-sm text-left rtl:text-right text-gray-500',
      ]"
    >
      <caption
        :class="[
          'uppercase p-3 text-xs text-center font-semibold text-white print:!text-black rounded-t-lg',
          loading ? 'bg-gray-300' : 'bg-gray-800',
          'print:bg-white',
        ]"
      >
        <div
          v-if="loading"
          class="h-2.5 bg-gray-200 mx-auto rounded-full w-40"
        ></div>
        <span v-else> {{ caption }}</span>
      </caption>
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100/50 border-y-[1px] border-gray-300 print:border-gray-500 print:bg-white"
      >
        <tr v-if="loading">
          <th v-for="i in columns" :key="i" scope="col" class="px-2 py-3 w-min">
            <div class="h-2.5 bg-gray-200 mx-4 rounded-full w-12"></div>
          </th>
        </tr>
        <tr v-else>
          <slot name="thead" />
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 print:divide-gray-800">
        <km-skeleton-table v-if="loading" :limit="5" :columns="columns - 1" />
        <slot name="tbody" v-else />
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  setup(props, { slots }) {
    return { columns: slots.thead().length };
  },
  props: {
    caption: {
      type: String,
      default: "Lista de bienes",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
