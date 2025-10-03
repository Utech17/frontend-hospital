<template>
  <div class="medicine-table-wrapper">
    <div class="medicine-table-card">
      <div class="grid-view">
        <input
          type="text"
          class="form-control mb-3"
          placeholder="Buscar por nombre de medicamento"
          v-model="searchQuery"
        />
        <button
          class="btn btn-primary icon-btn add-btn"
          @click="showModal = true"
          title="Ingresar producto"
        >
          <svg-add-circle />
        </button>
      </div>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar Producto</h5>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nombre"
                    v-model="newProduct.name"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Descripción</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Descripción"
                    v-model="newProduct.description"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    class="form-control"
                    placeholder="Cantidad"
                    v-model="newProduct.quantity"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Peso</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Peso"
                    v-model="newProduct.weight"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Ubicación"
                    v-model="newProduct.location"
                  />
                </div>
                <div class="form-group col-md-6">
                  <label>Precio</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Precio"
                    v-model="newProduct.price"
                  />
                </div>
              </div>
            </form>
          </div>
          <div class="form-group button-group">
            <button
              type="button"
              class="btn btn-secondary icon-btn add-btn"
              @click="showModal = false"
            >
              <svg-close />
            </button>
            <button
              type="button"
              class="btn btn-primary icon-btn add-btn"
              @click="saveProduct"
            >
              <svg-add-circle />
            </button>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table medicine-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Nombre</th>
              <th>Peso</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="med in filteredMedicines" :key="med.id">
              <td>
                <span
                  :class="['status-oval', med.state === 'Disponible' ? 'available' : 'out-of-stock']"
                >
                  {{ med.state }}
                </span>
              </td>
              <td>{{ med.name }}</td>
              <td>{{ med.weight }} kg</td>
              <td>{{ med.stock }}</td>
              <td>{{ formatCurrency(med.price) }}</td>
              <td>
                <div class="action-btn-group">
                  <button
                    class="btn btn-success btn-sm icon-btn"
                    @click="editItem(med)"
                    title="Editar medicamento"
                  >
                    <svg-edit />
                  </button>
                  <button
                    class="btn btn-danger btn-sm icon-btn"
                    @click="deleteItem(med)"
                    title="Eliminar medicamento"
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
  name: 'DataGridMedicine',
  data() {
    return {
      searchQuery: '',
      showModal: false,
      newProduct: {
        name: '',
        description: '',
        quantity: null,
        weight: null,
        location: '',
        price: null,
      },
      medicines: [
        { id: 1, name: 'Paracetamol', state: 'Disponible', weight: 0.05, stock: 100, price: 1.2 },
         { id: 2, name: 'Ibuprofeno', state: 'Disponible', weight: 0.07, stock: 50, price: 2.5 },
        { id: 3, name: 'Omeprazol', state: 'Disponible', weight: 0.04, stock: 80, price: 3.0 },
        { id: 4, name: 'Amoxicilina', state: 'Agotado', weight: 0.03, stock: 0, price: 1.8 },
        { id: 5, name: 'Loratadina', state: 'Disponible', weight: 0.02, stock: 60, price: 1.5 },
        { id: 6, name: 'Cetirizina', state: 'Disponible', weight: 0.05, stock: 120, price: 1.3 },
        { id: 7, name: 'Claritromicina', state: 'Disponible', weight: 0.08, stock: 200, price: 4.0 },
        { id: 8, name: 'Ranitidina', state: 'Disponible', weight: 0.03, stock: 85, price: 1.9 },
        { id: 9, name: 'Ciproflaxacino', state: 'Agotado', weight: 0.12, stock: 0, price: 2.8 },
        { id: 10, name: 'Fexofenadina', state: 'Disponible', weight: 0.06, stock: 150, price: 2.0 },
        { id: 11, name: 'Loperamida', state: 'Disponible', weight: 0.02, stock: 95, price: 1.6 },
        { id: 12, name: 'Dextrometorfano', state: 'Disponible', weight: 0.04, stock: 110, price: 1.7 },
        { id: 13, name: 'Metformina', state: 'Disponible', weight: 0.04, stock: 180, price: 2.2 },
        { id: 14, name: 'Simvastatina', state: 'Disponible', weight: 0.03, stock: 130, price: 2.6 },
        { id: 15, name: 'Levotiroxina', state: 'Agotado', weight: 0.01, stock: 0, price: 3.3 },
        { id: 16, name: 'Amlodipina', state: 'Disponible', weight: 0.07, stock: 50, price: 2.9 },
        { id: 17, name: 'Atorvastatina', state: 'Disponible', weight: 0.06, stock: 75, price: 3.5 },
        { id: 18, name: 'Fluoxetina', state: 'Disponible', weight: 0.05, stock: 65, price: 2.7 },
        { id: 19, name: 'Acetaminofén', state: 'Disponible', weight: 0.04, stock: 90, price: 1.0 },
        { id: 20, name: 'Escitalopram', state: 'Agotado', weight: 0.03, stock: 0, price: 3.2 },
        // Agregar datos
      ],
    };
  },
  computed: {
    filteredMedicines() {
      return this.medicines.filter((med) =>
        med.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    formatCurrency(value) {
      return `$${parseFloat(value).toFixed(2)}`;
    },
    editItem(item) {
      alert(`Editar medicamento con ID: ${item.id}`);
    },
    deleteItem(item) {
      const confirmDelete = confirm(
        `¿Estás seguro de eliminar el medicamento con ID: ${item.id}?`
      );
      if (confirmDelete) {
        this.medicines = this.medicines.filter((med) => med.id !== item.id);
      }
    },
    saveProduct() {
      if (this.newProduct.name && this.newProduct.quantity) {
        this.medicines.push({
          id: this.medicines.length + 1,
          name: this.newProduct.name,
          description: this.newProduct.description,
          state: 'Disponible',
          weight: this.newProduct.weight || 0,
          stock: this.newProduct.quantity,
          location: this.newProduct.location,
          price: parseFloat(this.newProduct.price) || 0,
        });
        this.resetForm();
        this.showModal = false;
      } else {
        alert('Completa los campos obligatorios');
      }
    },
    resetForm() {
      this.newProduct = {
        name: '',
        description: '',
        quantity: null,
        weight: null,
        location: '',
        price: null,
      };
    },
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
