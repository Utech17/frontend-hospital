<template>
  <div class="patient-table-wrapper">
    <div class="patient-table-card">
      <div class="grid-view">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Buscar por paciente, producto, factura..."
          v-model="searchQuery"
        />
        <button
          class="btn btn-primary icon-btn add-btn"
          @click="openModal()"
          title="Agregar Factura"
        >
          <AddCircleSvg class="svg-btn" />
        </button>
      </div>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">
            {{ isEditing ? 'Editar' : 'Agregar' }} Factura
          </h2>
          <form @submit.prevent="saveBilling">
            <div class="form-row">
              <div class="form-group">
                <label for="date">Fecha</label>
                <input
                  type="date"
                  id="date"
                  v-model="form.date"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="client">Paciente</label>
                <input
                  type="text"
                  id="client"
                  v-model="form.client"
                  required
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="invoiceNumber">N° de Factura</label>
                <input
                  type="text"
                  id="invoiceNumber"
                  v-model="form.invoiceNumber"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="saleType">Tipo de Venta</label>
                <input
                  type="text"
                  id="saleType"
                  v-model="form.saleType"
                  required
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="product">Producto</label>
                <input
                  type="text"
                  id="product"
                  v-model="form.product"
                  required
                  class="form-control"
                />
              </div>
              <div class="form-group">
                <label for="amount">Monto</label>
                <input
                  type="number"
                  id="amount"
                  v-model="form.amount"
                  required
                  class="form-control"
                />
              </div>
            </div>
            <div class="form-group button-group">
              <button
                type="button"
                @click="closeModal"
                class="btn btn-secondary btn-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary btn-lg"
              >
                {{ isEditing ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table patient-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Paciente</th>
              <th>N° de Factura</th>
              <th>Tipo de Venta</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Factura</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td>{{ sale.date }}</td>
              <td>{{ sale.client }}</td>
              <td>{{ sale.invoiceNumber }}</td>
              <td>{{ sale.saleType }}</td>
              <td>{{ sale.product }}</td>
              <td>{{ sale.amount }}</td>
              <td>
                <button
                  class="btn btn-outline-primary btn-sm icon-btn"
                  title="Descargar factura"
                >
                  <DownloadSvg class="svg-btn" />
                </button>
              </td>
              <td>
                <div class="action-btn-group">
                  <button
                    class="btn btn-success btn-sm icon-btn"
                    @click="editItem(sale)"
                    title="Editar factura"
                  >
                    <EditSvg class="svg-btn" />
                  </button>
                  <button
                    class="btn btn-danger btn-sm icon-btn"
                    @click="deleteItem(sale)"
                    title="Eliminar factura"
                  >
                    <DeleteSvg class="svg-btn" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';
import DownloadSvg from '~/components/svg/download.vue';

export default {
  name: "SalesTable",
  data() {
    return {
      searchQuery: "",
      showModal: false,
      isEditing: false,
      form: {
        date: '',
        client: '',
        invoiceNumber: '',
        saleType: '',
        product: '',
        amount: null,
      },
      sales: [
        {
          id: 1,
          date: "22/12/2024",
          client: "Juan Pérez",
          invoiceNumber: "00001",
          saleType: "Farmacia",
          product: "Paracetamol",
          amount: "50.00 Bs.",
        },
        {
          id: 2,
          date: "21/12/2024",
          client: "Ana López",
          invoiceNumber: "00002",
          saleType: "Laboratorio",
          product: "Análisis de sangre",
          amount: "200.00 Bs.",
        },
        {
          id: 3,
          date: "20/12/2024",
          client: "Roberto Sánchez",
          invoiceNumber: "00003",
          saleType: "Farmacia",
          product: "Termómetro digital",
          amount: "120.00 Bs.",
        },
        {
          id: 4,
          date: "19/12/2024",
          client: "Carla Torres",
          invoiceNumber: "00004",
          saleType: "Radiología",
          product: "Radiografía de tórax",
          amount: "400.00 Bs.",
        },
        {
          id: 5,
          date: "18/12/2024",
          client: "Luis Fernández",
          invoiceNumber: "00005",
          saleType: "Farmacia",
          product: "Inhalador para asma",
          amount: "150.00 Bs.",
        },
        {
          id: 6,
          date: "17/12/2024",
          client: "María Gómez",
          invoiceNumber: "00006",
          saleType: "Cirugía",
          product: "Consulta preoperatoria",
          amount: "300.00 Bs.",
        },
        {
          id: 7,
          date: "16/12/2024",
          client: "Diego Méndez",
          invoiceNumber: "00007",
          saleType: "Farmacia",
          product: "Silla de ruedas (alquiler)",
          amount: "250.00 Bs.",
        },
        {
          id: 8,
          date: "15/12/2024",
          client: "Lorena Castillo",
          invoiceNumber: "00008",
          saleType: "Laboratorio",
          product: "Prueba de COVID-19",
          amount: "180.00 Bs.",
        },
      ],
    };
  },
  computed: {
    filteredSales() {
      return this.sales.filter((sale) => {
        const searchString = `${sale.client} ${sale.product}`.toLowerCase();
        return searchString.includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
      this.isEditing = false;
      this.form = {
        date: '',
        client: '',
        invoiceNumber: '',
        saleType: '',
        product: '',
        amount: null,
      };
    },
    closeModal() {
      this.showModal = false;
    },
    editItem(item) {
      this.isEditing = true;
      this.form = { ...item };
      this.showModal = true;
    },
    deleteItem(item) {
      const confirmDelete = confirm(`¿Estás seguro de eliminar la factura N° ${item.invoiceNumber}?`);
      if (confirmDelete) {
        this.sales = this.sales.filter(sale => sale.id !== item.id);
      }
    },
    saveBilling() {
      if (this.isEditing) {
        const index = this.sales.findIndex(sale => sale.id === this.form.id);
        if (index !== -1) {
          this.sales.splice(index, 1, { ...this.form });
        }
      } else {
        const newItem = {
          id: this.sales.length + 1,
          ...this.form
        };
        this.sales.push(newItem);
      }
      this.closeModal();
    }
  },
};
</script>

<style scoped>
.patient-table-wrapper {
  max-width: 1200px;
  margin: auto;
}

.patient-table-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.grid-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-control {
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.add-btn {
  background-color: #0d6efd;
  color: white;
  border: none;
}

.add-btn:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-right: 10px;
}

.form-group:last-child {
  margin-right: 0;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.table-responsive {
  overflow-x: auto;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.patient-table thead {
  background: #f8fafc;
  color: #333;
}

.patient-table th,
.patient-table td {
  padding: 12px 15px;
  text-align: left;
}

.patient-table tbody tr:hover {
  background: #f1f4f9;
}

.action-btn-group {
  display: flex;
  gap: 5px;
}

.svg-btn {
  width: 20px;
  height: 20px;
}

.dropdown-menu {
  min-width: 160px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid #f5f9fb;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item.text-danger:hover {
  background-color: #fff5f5;
}

.btn-link {
  padding: 0;
  border: none;
}

.btn-link:hover .actions-icon {
  color: #2d60ff;
}

.actions-icon {
  font-size: 20px;
  color: #6c757d;
  cursor: pointer;
  display: inline-block;
  letter-spacing: 2px;
}
</style>
