<template>
      <span :class="badgeClass">
        <span>{{ statusLabel }}</span>
      </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: [String, Number],
    required: true,
  },
  type: {
    type: [String, Number],
    default: baseClass,
  }
});

const statusMap = {
  'ACTIVO': { label: 'Activo' },
  1: { label: 'Activo' },
  'ESPERA': { label: 'Espera' },
  2: { label: 'Espera' },
  'CERRADO': { label: 'Cerrado' },
  3: { label: 'Cerrado' },
  'RECHAZADO': { label: 'Rechazado' },
  4: { label: 'Rechazado' },
  'APROBADO': { label: 'Aprobado' },
  5: { label: 'Aprobado' },
  'CORREGIR': { label: 'Corregir' },
  6: { label: 'Corregir' },
  'ABIERTO': { label: 'Abierto' },
};

const statusLabel = computed(() => statusMap[props.status]?.label || props.status);
  const baseClass = 'inline-flex items-center px-3 py-1 text-xs rounded font-semibold';
  const pillClass = 'inline-flex items-center px-3 py-1 text-xs rounded-full font-semibold';

  const buttonClass = computed(() => {
    switch (props.status) {
      case 1:
      case 'ACTIVO':
        return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
      case 2:
      case 'ESPERA':
        return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';
      case 3:
      case 'CERRADO':
        return 'bg-gradient-to-br from-red-500 to-red-700 text-white';
      case 4:
      case 'RECHAZADO':
        return 'bg-gradient-to-br from-red-500 to-red-700 text-white';
      case 5:
      case 'APROBADO':
        return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
      case 6:
      case 'CORREGIR':
        return 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-white';
      case 'ABIERTO':
        return 'bg-gradient-to-br from-blue-500 to-blue-700 text-white';
      case 'SIN APROBAR':
        return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';
      case 'APROBADO':
        return 'bg-gradient-to-br from-green-400 to-green-600 text-white';
    }
  });

  const badgeClass = computed(() => {
    let classes = [];
  if (props.type === 'pill') {
    classes.push(pillClass);
  } else {
    classes.push(baseClass);
  }
  classes.push(buttonClass.value);
  return classes.join(' ');
  });
</script>