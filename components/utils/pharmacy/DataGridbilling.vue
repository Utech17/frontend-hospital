<template>
  <div class="medicine-table-wrapper">
    <div class="medicine-table-card">
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
          <svg-add-circle />
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
        <table class="table medicine-table">
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
                  <svg-download />
                </button>
              </td>
              <td>
                <div class="action-btn-group">
                  <button
                    class="btn btn-success btn-sm icon-btn"
                    @click="editItem(sale)"
                    title="Editar factura"
                  >
                    <svg-edit />
                  </button>
                  <button
                    class="btn btn-danger btn-sm icon-btn"
                    @click="deleteItem(sale)"
                    title="Eliminar factura"
                  >
                    <svg-delete />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="pagination-container" v-if="totalPages > 1">
        <div class="custom-pagination">
          <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
          <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
          <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      currentPage: 1,
      itemsPerPage: 7,
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
.add-btn {
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    min-width: 44px;
    min-height: 44px;
    box-shadow: 0 2px 8px rgba(37,99,235,0.10);
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.18s, box-shadow 0.18s;
    padding: 0;
}
.add-btn:hover {
    background: #1746b0;
    color: #fff;
    box-shadow: 0 4px 16px rgba(37,99,235,0.18);
}

.table {
    margin-top: 20px;
}

/* Modern grid for search and add button */
.grid-view {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0;
    margin-bottom: 20px;
    width: 100%;
}
.grid-view input[type="text"] {
    flex: 1 1 320px;
    margin-right: 12px;
    min-width: 0;
}


/* Modal mejorado y siempre por encima */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(30, 41, 59, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: background 0.2s;
    backdrop-filter: blur(2px);
}

.modal-content {
    display: flex;
    flex-direction: column;
    background: #fff;
    padding: 38px 30px 28px 30px;
    border-radius: 22px;
    width: 95vw;
    max-width: 420px;
    min-width: 260px;
    box-shadow: 0 12px 48px 0 rgba(30,41,59,0.22), 0 2px 8px rgba(0,0,0,0.10);
    justify-content: center;
    align-items: stretch;
    animation: modalIn .22s cubic-bezier(.4,0,.2,1);
    position: relative;
}

@keyframes modalIn {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-title {
    text-align: center;
    margin-bottom: 22px;
    color: #1e293b;
    font-size: 1.45rem;
    font-weight: 700;
    letter-spacing: 0.01em;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 15px;
    justify-content: space-between;
}

.form-group {
    flex: 1 1 180px;
    min-width: 120px;
}

.form-group label {
    text-align: left;
    display: block;
    margin: 0 5px 6px 5px;
    font-weight: 600;
    color: #334155;
    font-size: 1rem;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1.5px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1.05rem;
    background: #f8fafc;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px rgba(30,41,59,0.04);
}
.form-group input:focus,
.form-group select:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px #2563eb22;
}

.button-group {
    display: flex;
    justify-content: flex-end;
    gap: 14px;
    margin-top: 32px;
}

.btn-block {
    align-items: center;
    padding: 8px 18px;
    font-size: 1.1rem;
    border-radius: 8px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(37,99,235,0.08);
    transition: background 0.2s;
}

.table {
    width: 100%;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.table th, .table td {
    padding: 12px 10px;
    text-align: left;
}
.table th {
    background: #f1f5f9;
    font-weight: 600;
    color: #2563eb;
    border-bottom: 2px solid #e5e7eb;
}
.table tr {
    transition: background 0.15s;
}
.table tr:hover {
    background: #f3f6fa;
}
/* Centrado y card visual para la tabla de pacientes */
.medicine-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.medicine-table-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    padding: 32px 28px 28px 28px;
    width: 100%;
    max-width: 1100px;
    min-width: 320px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
    /* margin-top: 18px; */
}

.medicine-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.medicine-table th, .medicine-table td {
    padding: 14px 12px;
    text-align: left;
}
.medicine-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.medicine-table tr {
    transition: background 0.15s;
}
.medicine-table tr:hover {
    background: #e8f0fe;
}
.medicine-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .medicine-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .medicine-table th, .medicine-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .medicine-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .medicine-table th, .medicine-table td {
        padding: 7px 2px;
        font-size: 0.93rem;
    }
}
/* SVG button icon style */
.svg-btn {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-bottom: 2px;
}
.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    min-width: 32px;
    min-height: 32px;
    border-radius: 6px;
    transition: background 0.15s;
    position: relative;
}
.icon-btn:hover {
    background: #e8f0fe;
}
.action-btn-group {
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-start;
    align-items: center;
}
.pagination-container {
  margin-top: 20px;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}
.pagination-btn {
  background: #2d60ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 18px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination-btn:disabled {
  background: #bfcbe6;
  color: #fff;
  cursor: not-allowed;
}
.pagination-info {
  font-size: 15px;
  color: #2d60ff;
  font-weight: 500;
}
</style>