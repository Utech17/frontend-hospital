<template>
  <nav
    aria-label="pagination"
    class="flex flex-col sm:flex-row-reverse w-full items-center gap-2 sm:gap-0 justify-center sm:justify-between bg-white"
  >
    <ul class="flex items-center h-8 text-sm drop-shadow-md rounded-lg">
      <li>
        <a
          href="#"
          @click="props.options.prev"
          class="flex items-center justify-center px-3 h-7 ms-0 leading-tight text-slate-500 bg-white rounded-l-lg hover:bg-slate-100 hover:text-slate-700"
        >
          <svg-previous />
        </a>
      </li>
      <li
        v-if="
          pagination_range.calcBegin > 0 &&
          pagination_range.current != pagination_range.final
        "
        @click="
          props.options.defaultFunction(
            pagination_range.maxPage - pagination_range.maxPage,
          )
        "
      >
        <span
          class="flex pt-1 justify-center h-7 w-[32px] font-bold text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700"
        >
          ...
        </span>
      </li>
      <li v-for="(range, i) in pagination_range.range()" :key="i">
        <a
          v-if="range === props.options.currentPage"
          @click="props.options.defaultFunction(range)"
          href="#"
          class="z-10 flex items-center justify-center px-3 h-8 leading-tight text-orange-600 border border-orange-300 bg-orange-50 hover:bg-orange-100 hover:text-orange-700"
          aria-current="page"
          >{{ range + 1 }}</a
        >
        <a
          v-else
          @click="props.options.defaultFunction(range)"
          href="#"
          class="flex items-center justify-center px-3 h-7 leading-tight text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700"
        >
          {{ range + 1 }}
        </a>
      </li>

      <li
        v-if="pagination_range.calcFinal < pagination_range.final"
        @click="props.options.defaultFunction(pagination_range.maxPage - 1)"
      >
        <span
          class="flex pt-1 justify-center h-7 w-[32px] font-bold text-slate-500 bg-white hover:bg-slate-100 hover:text-slate-700"
        >
          ...
        </span>
      </li>
      <li>
        <a
          href="#"
          @click="props.options.next"
          class="flex items-center justify-center px-3 h-7 ms-0 leading-tight text-slate-500 bg-white rounded-r-lg hover:bg-slate-100 hover:text-slate-700"
        >
          <svg-next />
        </a>
      </li>
    </ul>
    <ul class="text-sm drop-shadow-md rounded-lg pr-3">
      <select
        id="db44b0ba-8108-466d-8f32-7985b5f2d3c4"
        class="py-1 px-3 h-8 bg-white border-none text-orange-500 text-sm rounded-lg focus:ring-0 focus:border-slate-600 bg-orange-50 hover:bg-slate-100"
        @change="props.options.limitPages($event.target.value)"
      >
        <option v-for="(limit, i) in typeLimits" :key="i" :value="limit">
          {{ limit }}
        </option>
      </select>
      <label
        for="db44b0ba-8108-466d-8f32-7985b5f2d3c4"
        class="ml-2 text-sm text-slate-500"
      >
        Mostrando {{ range.begin }} - {{ range.final }} de
        {{ props.options.totalRows }} registros.
      </label>
    </ul>
  </nav>
</template>
<script setup lang="ts">
const typeLimits = [5, 10, 15, 20];
const range = computed(() => {
  const limit = props.options.limit;
  const page = props.options.currentPage;
  const length = props.options.length;
  return {
    begin: (page - 1) * limit + limit + 1,
    final: (page - 1) * limit + limit + length,
  };
});
const limit_pagination = 7;
const pagination_range = computed(() => {
  const limit = limit_pagination;
  const page = props.options.currentPage;
  const maxPage = props.options.maxPage + 1;
  const calcFinal = Math.round(page + limit / 2);
  const calcBegin = Math.round(page - limit / 2);
  let begin, final;

  if (calcBegin <= -1) begin = 0;
  else begin = calcBegin;

  if (calcFinal < maxPage) {
    if (calcBegin <= 1 && page != 1) {
      final = calcFinal + Math.abs(calcBegin) + 1;
    } else {
      final = calcFinal + 1;
    }
  } else {
    final = maxPage + 1;
    begin = calcBegin - Math.abs(calcFinal - maxPage);
  }

  let range = () => {
    return maxPage > limit
      ? [...Array(limit).keys()].map((i) => {
          if (i + begin < maxPage) return i + begin;
        })
      : [...Array(maxPage).keys()].map((i) => {
          return i;
        });
  };

  return {
    calcBegin,
    calcFinal,
    maxPage,
    begin,
    current: page + 1,
    final,
    range,
  };
});
// [...Array(5).keys()].map(i => i + 5)
const props = defineProps({
  options: {
    type: Object,
    default: () => {
      return {
        currentPage: 0,
        maxPage: 4,
        totalRows: 0,
        length: 0,
        limit: 5,
        next: () => {
          return;
        },
        prev: () => {
          return;
        },
        defaultFunction: (page: number) => {
          return;
        },
        limitPages: (limit: number) => {
          return;
        },
      };
    },
  },
});
</script>
