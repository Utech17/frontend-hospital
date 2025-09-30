<template>
<div class="supplier-table-wrapper">
    <div class="supplier-table-card">
        <div class="grid-view">
            <input type="text" class="form-control mb-3"
                placeholder="Buscar por RIF, Dirección o Razon Social" v-model="searchQuery" />
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary btn-block icon-btn add-btn" style="display: flex;" @click="openModal()">
                    <svg-add-circle/>
                </button>
                <button class="btn btn-secondary btn-block icon-btn add-btn" style="display: flex;" @click="openInactiveModal()">
                    <svg-eye/>
                </button>
            </div>
        </div>

        <!-- Modal de Proveedores Inactivos -->
        <div v-if="showInactiveModal" class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">Proveedores Inactivos</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>RIF</th>
                            <th>Dirección</th>
                            <th>Razón Social</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="supplier in inactiveSuppliers" :key="supplier.id">
                            <td>{{ supplier.rif }}</td>
                            <td>{{ supplier.address }}</td>
                            <td>{{ supplier.business_name }}</td>
                            <td>
                                <button class="icon-btn add-btn" @click="activateSupplier(supplier.id)" title="Activar">
                                    <svg-add-circle/>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="form-group button-group">
                    <button type="button" @click="closeInactiveModal" class="icon-btn add-btn" title="Cerrar">
                        <svg-close />
                    </button>
                </div>
            </div>
        </div>

        <!---------------- Modal Agregar/Editar Proveedor ---------------->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Proveedor</h2>
                <form @submit.prevent="saveSupplier">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="rif">RIF</label>
                            <input type="text" id="rif" v-model="currentSupplier.rif" required class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="address">Dirección</label>
                            <input type="text" id="address" v-model="currentSupplier.address" required class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="businessName">Razón Social</label>
                            <input type="text" id="businessName" v-model="currentSupplier.business_name" required class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="status">Estado</label>
                            <select id="status" v-model="currentSupplier.status" required class="form-control">
                                <option value=true>Activo</option>
                                <option value=false>Inactivo</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group button-group">
                        <button type="button" @click="closeModal" class="icon-btn add-btn" title="Cancelar">
                           <svg-close />
                        </button>
                        <button type="submit" class="icon-btn add-btn" title="{{ isEditing ? 'Actualizar' : 'Guardar' }}">
                            <svg-add-circle/>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table supplier-table">
                <thead>
                    <tr style="border-radius: 30px;">
                        <th>RIF</th>
                        <th>Dirección</th>
                        <th>Razón Social</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-if="paginatedSuppliers.length === 0">
                            <td colspan="5" style="text-align:center; color:#2563eb; font-weight:500;">No hay proveedores para mostrar</td>
                        </tr>
                        <tr v-for="supplier in paginatedSuppliers" :key="supplier.id">
                            <td>{{ supplier.rif }}</td>
                            <td>{{ supplier.address }}</td>
                            <td>{{ supplier.business_name }}</td>
                            <td>{{ supplier.status ? 'Activo' : 'Inactivo' }}</td>
                            <td>
                                <div class="action-btn-group">
                                    <button class="icon-btn" @click="editSupplier(supplier.id)" title="Editar">
                                        <svg-edit/>
                                    </button>
                                    <button class="icon-btn" @click="deleteSupplier(supplier.id)" title="Eliminar">
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
            <div class="pagination-container" v-if="totalPages > 1">
                <div class="custom-pagination">
                    <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
                    <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
                    <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">Siguiente</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import Swal from 'sweetalert2';
import api from '@/utils/simpleApi';

export default {
    name: 'DataGridSupplier',
    data() {
        return {
            searchQuery: '',
            showModal: false,
            isEditing: false,
            currentSupplier: {
                id: null,
                rif: '',
                address: '',
                business_name: '',
                status: true
            },
            suppliers: [],
            showInactiveModal: false,
            currentPage: 1,
            itemsPerPage: 7
        };
    },
    computed: {
        filteredSuppliers() {
            return this.suppliers.filter(supplier => {
                const searchString = `${supplier.rif} ${supplier.address} ${supplier.business_name}`.toLowerCase();
                return searchString.includes(this.searchQuery.toLowerCase());
            });
        },
        activeSuppliers() {
            // Solo proveedores activos
            return this.filteredSuppliers.filter(supplier => {
                const status = supplier.status;
                return status === true || status === 1 || String(status).toLowerCase() === 'true' || String(status) === '1';
            });
        },
        paginatedSuppliers() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const pageSuppliers = this.activeSuppliers.slice(start, end);
            if (pageSuppliers.length === 0 && this.currentPage > 1) {
                this.currentPage = 1;
                return this.activeSuppliers.slice(0, this.itemsPerPage);
            }
            return pageSuppliers;
        },
        totalPages() {
            return Math.ceil(this.activeSuppliers.length / this.itemsPerPage);
        },
        inactiveSuppliers() {
            return this.suppliers.filter(supplier => {
                const status = supplier.status;
                return status === false || status === 0 || String(status).toLowerCase() === 'false' || String(status) === '0';
            });
        }
    },
    async created() {
        await this.loadSuppliers();
    },
    methods: {
            async loadSuppliers() {
        try {
            const res = await api.get('/api/supplier');
            // Mapear los datos a la estructura esperada para la tabla
            this.suppliers = (res.data?.suppliers || res.data?.data?.suppliers || []).map(supplier => ({
                id: supplier.id,
                rif: supplier.rif || '',
                address: supplier.address || '',
                business_name: supplier.business_name || '',
                status: supplier.status ?? true,
                // Puedes agregar más campos si lo necesitas para la tabla
            }));
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los proveedores' });
        }
    },
        async saveSupplier() {
            try {
                const supplierData = {
                    rif: this.currentSupplier.rif,
                    address: this.currentSupplier.address,
                    business_name: this.currentSupplier.business_name,
                    status: this.currentSupplier.status
                };
                const existingSupplier = this.suppliers.find(s =>
                    s.rif === supplierData.rif &&
                    (!this.isEditing || s.id !== this.currentSupplier.id)
                );
                if (existingSupplier) {
                    Swal.fire({ icon: 'warning', title: 'Advertencia', text: 'Ya existe un proveedor con este RIF' });
                    return;
                }
                if (this.isEditing) {
                    await api.put(`/api/supplier/${this.currentSupplier.id}`, supplierData);
                    Swal.fire({ icon: 'success', title: 'Éxito', text: 'Proveedor actualizado con éxito' });
                } else {
                    await api.post('/api/supplier', supplierData);
                    Swal.fire({ icon: 'success', title: 'Éxito', text: 'Proveedor creado con éxito' });
                }
                await this.loadSuppliers();
                this.closeModal();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar el proveedor' });
            }
        },
        async deleteSupplier(id) {
            const supplier = this.suppliers.find(s => s.id === id);
            if (!supplier) return;
            const result = await Swal.fire({
                title: '¿Está seguro?',
                text: `¿Desea eliminar el proveedor con RIF: ${supplier.rif}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
            if (result.isConfirmed) {
                try {
                    await api.delete(`/api/supplier/${id}`);
                    await this.loadSuppliers();
                    Swal.fire('Eliminado', `El proveedor ${supplier.rif} ha sido eliminado con éxito`, 'success');
                } catch (error) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar el proveedor' });
                }
            }
        },
        openModal() {
            this.isEditing = false;
            this.currentSupplier = {
                id: null,
                rif: '',
                address: '',
                business_name: '',
                status: true
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.isEditing = false;
        },
        async editSupplier(id) {
            try {
                const response = await api.get(`/api/supplier/${id}`);
                let supplierData = null;
                if (response.data && response.data.data) {
                    if (response.data.data.supplier) {
                        supplierData = response.data.data.supplier;
                    } else if (response.data.data.id) {
                        supplierData = response.data.data;
                    }
                }
                if (!supplierData) {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'No se encontró el proveedor.' });
                    return;
                }
                this.currentSupplier = {
                    id: supplierData.id,
                    rif: supplierData.rif,
                    address: supplierData.address,
                    business_name: supplierData.business_name,
                    status: supplierData.status
                };
                this.isEditing = true;
                this.showModal = true;
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al obtener los datos del proveedor' });
            }
        },
        openInactiveModal() {
            this.showInactiveModal = true;
        },
        closeInactiveModal() {
            this.showInactiveModal = false;
        },
        async activateSupplier(id) {
            try {
                const supplier = this.suppliers.find(s => s.id === id);
                if (supplier) {
                    await api.put(`/api/supplier/${id}`, { ...supplier, status: true });
                    await this.loadSuppliers();
                    Swal.fire({ icon: 'success', title: 'Éxito', text: 'Proveedor activado con éxito' });
                }
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al activar el proveedor' });
            }
        }
    },
    watch: {
            searchQuery() {
                this.currentPage = 1;
            },
            suppliers() {
                this.currentPage = 1;
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
.supplier-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
}

.supplier-table-card {
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

.supplier-table {
    width: 100%;
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border-collapse: separate;
    border-spacing: 0;
}
.supplier-table th, .supplier-table td {
    padding: 14px 12px;
    text-align: left;
}
.supplier-table th {
    background: #e0e7ef;
    font-weight: 700;
    color: #2563eb;
    border-bottom: 2px solid #d1d5db;
}
.supplier-table tr {
    transition: background 0.15s;
}
.supplier-table tr:hover {
    background: #e8f0fe;
}
.supplier-table td {
    font-size: 1.05rem;
    color: #222;
}

@media (max-width: 900px) {
    .supplier-table-card {
        padding: 18px 4px;
        max-width: 98vw;
    }
    .supplier-table th, .supplier-table td {
        padding: 10px 6px;
        font-size: 0.98rem;
    }
}

@media (max-width: 600px) {
    .supplier-table-card {
        padding: 8px 0;
        min-width: 0;
    }
    .supplier-table th, .supplier-table td {
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