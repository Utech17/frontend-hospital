<template>
  <div class="store-table-wrapper">
    <div class="store-table-card">
      <div class="grid-view">
        <input type="text" class="form-control mb-3" placeholder="Buscar por nombre" v-model="searchQuery" />
        <button class="btn btn-primary icon-btn add-btn" @click="showForm = true" title="Agregar producto">
          <svg-add-circle />
        </button>
      </div>

      <div v-if="showForm" class="modal-overlay" @click.self="cancelar">
        <div class="modal-content">
          <h2 class="modal-title">Agregar Producto</h2>
          <form @submit.prevent="guardarProducto" class="form">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nuevoProducto.nombre" required />
            <label for="descripcion">Descripción</label>
            <input type="text" id="descripcion" v-model="nuevoProducto.descripcion" required />
            <label for="cantidad">Cantidad</label>
            <input type="number" id="cantidad" v-model="nuevoProducto.cantidad" required />
            <label for="peso">Peso</label>
            <input type="number" id="peso" v-model="nuevoProducto.peso" required />
            <label for="ubicacion">Ubicación</label>
            <input type="text" id="ubicacion" v-model="nuevoProducto.ubicacion" required />
            <label for="precio">Precio</label>
            <input type="number" id="precio" v-model="nuevoProducto.precio" required />
            <div class="form-group button-group">
              <button type="button" class="btn btn-secondary btn-lg icon-btn add-btn" @click="cancelar">
                <svg-close />
              </button>
              <button type="submit" class="btn btn-primary btn-lg icon-btn add-btn">
                <svg-add-circle />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table store-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Detalle</th>
              <th>Peso</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id">
              <td>{{ product.status }}</td>
              <td>{{ product.detail }}</td>
              <td>{{ product.weight }}</td>
              <td>{{ product.amount }}</td>
              <td>{{ product.price }}</td>
              <td>
                <div class="action-btn-group">
                  <button class="btn btn-success btn-sm icon-btn" @click="editProduct(product.id)" title="Editar producto">
                    <svg-edit />
                  </button>
                  <button class="btn btn-danger btn-sm icon-btn" @click="deleteProduct(product.id)" title="Eliminar producto">
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
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      searchQuery: '',
      showForm: false,
      nuevoProducto: {
        id: null,
        nombre: '',
        descripcion: '',
        cantidad: '',
        peso: '',
        ubicacion: '',
        precio: '',
      },
      products: [],
      currentPage: 1,
      itemsPerPage: 7,
      loading: false,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        const fullDetail = `${product.status || ''} ${product.detail || ''}`.toLowerCase();
        return fullDetail.includes(this.searchQuery.toLowerCase());
      });
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
    },
  },
  methods: {
    async loadProducts() {
      this.loading = true;
      try {
        const { default: simpleApi } = await import('~/utils/simpleApi');
        const res = await simpleApi.get('/api/product');
        const items = res?.data || res || [];
        // mapear robustamente
        this.products = (Array.isArray(items) ? items : (items.products || items.data || [])).map((it) => ({
          id: it.id ?? it._id ?? null,
          status: it.status ?? it.state ?? 'Activo',
          detail: it.detail ?? it.name ?? it.nombre ?? it.descripcion ?? '',
          weight: it.weight ?? it.peso ?? it.weight_text ?? '',
          amount: it.amount ?? it.cantidad ?? it.stock ?? 0,
          price: it.price ?? it.precio ?? it.unit_price ?? 0,
          raw: it,
        }));
      } catch (err) {
        console.error('Error cargando productos', err);
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    async guardarProducto() {
      // validación mínima
      if (!this.nuevoProducto.nombre || !this.nuevoProducto.precio || !this.nuevoProducto.cantidad) {
        await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Nombre, precio y cantidad son obligatorios' });
        return;
      }
      this.loading = true;
      try {
        const { default: simpleApi } = await import('~/utils/simpleApi');
        const payload = {
          nombre: this.nuevoProducto.nombre,
          descripcion: this.nuevoProducto.descripcion,
          cantidad: this.nuevoProducto.cantidad,
          peso: this.nuevoProducto.peso,
          ubicacion: this.nuevoProducto.ubicacion,
          precio: this.nuevoProducto.precio,
        };

        if (this.nuevoProducto.id) {
          // actualizar
          await simpleApi.put(`/api/product/${this.nuevoProducto.id}`, payload);
          await Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Producto actualizado correctamente' });
        } else {
          await simpleApi.post('/api/product', payload);
          await Swal.fire({ icon: 'success', title: 'Creado', text: 'Producto creado correctamente' });
        }
        await this.loadProducts();
        this.showForm = false;
        this.resetForm();
      } catch (err) {
        console.error('Error guardando producto', err);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el producto' });
      } finally {
        this.loading = false;
      }
    },
    cancelar() {
      this.showForm = false;
      this.resetForm();
    },
    resetForm() {
      this.nuevoProducto = {
        id: null,
        nombre: '',
        descripcion: '',
        cantidad: '',
        peso: '',
        ubicacion: '',
        precio: '',
      };
    },
    editProduct(id) {
      const p = this.products.find((x) => x.id === id);
      if (!p) {
        Swal.fire({ icon: 'warning', title: 'No encontrado', text: 'Producto no encontrado' });
        return;
      }
      // reconstruir form desde raw si existe
      const raw = p.raw || {};
      this.nuevoProducto = {
        id: p.id,
        nombre: raw.nombre ?? raw.name ?? p.detail,
        descripcion: raw.descripcion ?? raw.description ?? '',
        cantidad: raw.cantidad ?? raw.amount ?? p.amount,
        peso: raw.peso ?? raw.weight ?? p.weight,
        ubicacion: raw.ubicacion ?? raw.location ?? '',
        precio: raw.precio ?? raw.price ?? p.price,
      };
      this.showForm = true;
    },
    async deleteProduct(id) {
      const result = await Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;
      this.loading = true;
      try {
        const { default: simpleApi } = await import('~/utils/simpleApi');
        await simpleApi.delete(`/api/product/${id}`);
        await this.loadProducts();
        await Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Producto eliminado correctamente' });
      } catch (err) {
        console.error('Error eliminando producto', err);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el producto' });
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.loadProducts();
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
.store-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.store-table-card {
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

.store-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.store-table th, .store-table td {
    padding: 14px 12px;
    text-align: left;
}
.store-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.store-table tr {
    transition: background 0.15s;
}
.store-table tr:hover {
    background: #e8f0fe;
}
.store-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .store-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .store-table th, .store-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .store-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .store-table th, .store-table td {
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








