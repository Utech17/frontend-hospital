<template>
  <div class="patient-table-wrapper">
    <div class="patient-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3"
            placeholder="Buscar por producto, cliente, estado..." v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="openModal()" title="Agregar venta">
            <AddCircleSvg class="svg-btn" />
        </button>
      </div>
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Venta</h2>
          <form @submit.prevent="saveSale">
            <div class="form-row">
              <div class="form-group">
                <label for="product">Producto</label>
                <input type="text" id="product" v-model="currentSale.product" required class="form-control">
              </div>
              <div class="form-group">
                <label for="client">Cliente</label>
                <input type="text" id="client" v-model="currentSale.client" required class="form-control">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="amount">Monto</label>
                <input type="number" id="amount" v-model="currentSale.amount" required class="form-control">
              </div>
              <div class="form-group">
                <label for="status">Estado</label>
                <select id="status" v-model="currentSale.status" required class="form-control">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
            <div class="form-group button-group">
              <button type="button" @click="closeModal" class="btn btn-secondary btn-lg">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-lg">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
            </div>
          </form>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table patient-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td>{{ sale.product }}</td>
              <td>{{ sale.client }}</td>
              <td>{{ sale.amount }}</td>
              <td>
                <span :class="['status-oval', sale.status === 'Pendiente' ? 'available' : 'out-of-stock']">
                  {{ sale.status }}
                </span>
              </td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editSale(sale.id)" title="Editar venta">
                    <EditSvg class="svg-btn" />
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteSale(sale.id)" title="Eliminar venta">
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
import Swal from 'sweetalert2';
import api from '~/utils/simpleApi';
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';
export default {
  name: 'DataGridSales',
  components: { EditSvg, DeleteSvg, AddCircleSvg },
  data() {
    return {
      searchQuery: '',
      showModal: false,
      isEditing: false,
      currentSale: {
        id: null,
        product: '',
        client: '',
        amount: '',
        status: 'Pendiente'
      },
      sales: []
    };
  },
  computed: {
    filteredSales() {
      const search = this.searchQuery.toLowerCase().trim();
      return this.sales.filter(sale => {
        return (
          (sale.product && sale.product.toLowerCase().includes(search)) ||
          (sale.client && sale.client.toLowerCase().includes(search)) ||
          (sale.status && sale.status.toLowerCase().includes(search))
        );
      });
    }
  },
  created() {
    this.loadSales();
  },
  methods: {
    async loadSales() {
      try {
        const response = await api.get('/api/sales');
        let arr = Array.isArray(response) ? response : (response?.data || response?.sales || []);
        this.sales = arr.map(sale => ({
          id: sale.id || sale._id,
          product: sale.product || '',
          client: sale.client || '',
          amount: sale.amount || '',
          status: sale.status || 'Pendiente'
        }));
      } catch (e) {
        this.sales = [];
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar ventas' });
      }
    },
    async saveSale() {
      try {
        if (!this.currentSale.product || !this.currentSale.client || !this.currentSale.amount) {
          Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor complete todos los campos obligatorios' });
          return;
        }
        let data = { ...this.currentSale };
        let response;
        if (this.isEditing) {
          response = await api.put(`/api/sales/${this.currentSale.id}`, data);
        } else {
          response = await api.post('/api/sales', data);
        }
        Swal.fire({ icon: 'success', title: 'Éxito', text: this.isEditing ? 'Venta actualizada' : 'Venta creada' });
        await this.loadSales();
        this.closeModal();
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar venta' });
      }
    },
    async deleteSale(id) {
      try {
        await api.del(`/api/sales/${id}`);
        await this.loadSales();
        Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Venta eliminada' });
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar venta' });
      }
    },
    async editSale(id) {
      try {
        const response = await api.get(`/api/sales/${id}`);
        const sale = response.data || response;
        this.currentSale = {
          id: sale.id || sale._id,
          product: sale.product || '',
          client: sale.client || '',
          amount: sale.amount || '',
          status: sale.status || 'Pendiente'
        };
        this.isEditing = true;
        this.showModal = true;
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al obtener venta' });
      }
    },
    openModal() {
      this.isEditing = false;
      this.currentSale = {
        id: null,
        product: '',
        client: '',
        amount: '',
        status: 'Pendiente'
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
    }
  }
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
.patient-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
    margin-top: 40px;
}
.patient-table-card {
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
    margin-top: 18px;
}
.patient-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.patient-table th, .patient-table td {
    padding: 14px 12px;
    text-align: left;
}
.patient-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.patient-table tr {
    transition: background 0.15s;
}
.patient-table tr:hover {
    background: #e8f0fe;
}
.patient-table td {
    font-size: 1.05rem;
    color: #222;
}
@media (max-width: 900px) {
    .patient-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .patient-table th, .patient-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}
@media (max-width: 600px) {
    .patient-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .patient-table th, .patient-table td {
        padding: 7px 2px;
        font-size: 0.93rem;
    }
}
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
</style>