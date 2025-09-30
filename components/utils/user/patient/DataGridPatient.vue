<template>
<div class="patient-table-wrapper">
    <div class="patient-table-card">
        <div class="grid-view">
            <input type="text" class="form-control mb-3"
                placeholder="Buscar por nombre, apellidos o cédula" v-model="searchQuery" />
            <button class="btn btn-primary icon-btn add-btn" @click="openModal()" title="Agregar paciente">
                <svg-add-circle/>
            </button>
        </div>

        <!-- Modal Agregar/Editar Paciente -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content">
                <h2 class="modal-title">{{ isEditing ? 'Editar' : 'Agregar' }} Paciente</h2>
                <form @submit.prevent="savePatient">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">Nombre</label>
                            <input type="text" id="firstName" v-model="currentPatient.firstName" required class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="lastName">Apellido</label>
                            <input type="text" id="lastName" v-model="currentPatient.lastName" required class="form-control">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="birthDate">Fecha de Nacimiento</label>
                            <input type="date" id="birthDate" v-model="currentPatient.birthDate" required class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="gender">Sexo</label>
                            <select id="gender" v-model="currentPatient.gender" required class="form-control">
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="identifier">Cédula</label>
                            <input type="text" id="identifier" v-model="currentPatient.identifier" required class="form-control">
                        </div>
                    </div>
                    <div class="form-group button-group">
                        <button type="button" @click="closeModal" class="btn btn-secondary btn-lg icon-btn add-btn">
                            <svg-close />
                        </button>
                        <button type="submit" class="btn btn-primary btn-lg icon-btn add-btn" :title="isEditing ? 'Actualizar paciente' : 'Guardar paciente'">
                            <svg-add-circle/>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table patient-table">
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Sexo</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="patient in paginatedPatients" :key="patient.id">
                        <td>{{ patient.identifier || 'N/A' }}</td>
                        <td>{{ patient.firstName || 'N/A' }}</td>
                        <td>{{ patient.lastName || 'N/A' }}</td>
                        <td>{{ patient.birthDate || 'N/A' }}</td>
                        <td>{{ patient.gender || 'N/A' }}</td>
                        <td>{{ patient.registrationDate || 'N/A' }}</td>
                        <td>
                            <div class="action-btn-group">
                            <button class="btn btn-success btn-sm icon-btn" @click="editPatient(patient.id)" title="Editar paciente">
                                <EditSvg class="svg-btn" />
                            </button>
                            <button class="btn btn-danger btn-sm icon-btn" @click="deletePatient(patient.id)" title="Eliminar paciente">
                                <DeleteSvg class="svg-btn" />
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
import api from '~/utils/simpleApi';
import EditSvg from '~/components/svg/edit.vue';
import DeleteSvg from '~/components/svg/delete.vue';
import AddCircleSvg from '~/components/svg/add-circle.vue';

export default {
    created() {
        this.loadPatients();
    },
    name: 'DataGridPatient',
    components: {
        EditSvg,
        DeleteSvg,
        AddCircleSvg
    },
    data() {
        return {
            searchQuery: '',
            showModal: false,
            isEditing: false,
            currentPatient: {
                id: null,
                firstName: '',
                lastName: '',
                birthDate: '',
                gender: 'masculino',
                identifier: '',
            },
            patients: [],
            currentPage: 1,
            itemsPerPage: 7
        };
    },
    computed: {
        filteredPatients() {
            const patientsArray = Array.isArray(this.patients) ? this.patients : [];
            if (!this.searchQuery) return patientsArray;
            const searchTerm = this.searchQuery.toLowerCase().trim();
            return patientsArray.filter(patient => {
                if (!patient) return false;
                const searchableFields = [patient.identifier, patient.firstName, patient.lastName];
                return searchableFields.some(field => field && field.toString().toLowerCase().includes(searchTerm));
            });
        },
        paginatedPatients() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPatients.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPatients.length / this.itemsPerPage);
        }
    },
    methods: {
                    async loadPatients() {
                        try {
                            const response = await api.get('/api/patient');
                            let patientsArray = [];
                            if (Array.isArray(response)) {
                                patientsArray = response;
                            } else if (response?.data && Array.isArray(response.data)) {
                                patientsArray = response.data;
                            } else if (response?.data?.patients && Array.isArray(response.data.patients)) {
                                patientsArray = response.data.patients;
                            }
                            this.patients = patientsArray
                                .filter(item => item && typeof item === 'object')
                                .map(patient => ({
                                    id: patient._id || patient.id,
                                    firstName: patient.firstName || '',
                                    lastName: patient.lastName || '',
                                    birthDate: patient.birthDate || '',
                                    gender: patient.gender || '',
                                    identifier: patient.identifier || '',
                                    registrationDate: patient.registrationDate || ''
                                }));
                        } catch (error) {
                            this.patients = [];
                            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los pacientes' });
                        }
                    },
                    async savePatient() {
                        let patientData = null;
                        try {
                            if (!this.currentPatient.firstName || !this.currentPatient.lastName || !this.currentPatient.identifier || !this.currentPatient.birthDate || !this.currentPatient.gender) {
                                Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Por favor complete todos los campos obligatorios' });
                                return;
                            }
                            if (!/^\d+$/.test(this.currentPatient.identifier)) {
                                Swal.fire({ icon: 'warning', title: 'Formato inválido', text: 'La cédula debe contener solo números' });
                                return;
                            }
                            const birthDate = new Date(this.currentPatient.birthDate);
                            const today = new Date();
                            if (birthDate > today) {
                                Swal.fire({ icon: 'warning', title: 'Fecha inválida', text: 'La fecha de nacimiento no puede ser futura' });
                                return;
                            }
                            patientData = {
                                nickname: this.currentPatient.firstName.trim(),
                                firstName: this.currentPatient.firstName.trim(),
                                lastName: this.currentPatient.lastName.trim(),
                                birthDate: this.formatDate(this.currentPatient.birthDate),
                                gender: this.currentPatient.gender.toLowerCase(),
                                identifier: this.currentPatient.identifier.trim(),
                                type: 'patient',
                                status: true
                            };
                            let response;
                            if (this.isEditing) {
                                response = await api.put(`/api/patient/${this.currentPatient.id}`, patientData);
                            } else {
                                response = await api.post('/api/patient', patientData);
                            }
                            Swal.fire({ icon: 'success', title: 'Éxito', text: this.isEditing ? 'Paciente actualizado con éxito' : 'Paciente creado con éxito' });
                            await this.loadPatients();
                            this.closeModal();
                        } catch (error) {
                            let errorMessage = 'Error al guardar el paciente';
                            if (error?.data?.errors && Array.isArray(error.data.errors)) {
                                errorMessage = error.data.errors.map(err => (typeof err === 'string' ? err : err.msg || err.message || JSON.stringify(err))).filter(Boolean).join('\n');
                            } else if (error?.data?.message) {
                                errorMessage = error.data.message;
                            }
                            Swal.fire({ icon: 'error', title: 'Error', html: errorMessage.replace(/\n/g, '<br>'), confirmButtonText: 'Entendido' });
                        }
                    },
                    formatDate(dateString) {
                        if (!dateString) return null;
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0];
                    },
                    async deletePatient(id) {
                        const patient = this.patients.find(p => p.id === id);
                        if (!patient) return;
                        const result = await Swal.fire({
                            title: '¿Está seguro?',
                            text: `¿Desea eliminar el paciente con cédula: ${patient.identifier}?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar'
                        });
                        if (result.isConfirmed) {
                            try {
                                await api.del(`/api/patient/${id}`);
                                await this.loadPatients();
                                Swal.fire('Eliminado', `El paciente ${patient.identifier} ha sido eliminado con éxito`, 'success');
                            } catch (error) {
                                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al eliminar el paciente' });
                            }
                        }
                    },
                    openModal() {
                        this.isEditing = false;
                        this.currentPatient = { id: null, firstName: '', lastName: '', birthDate: '', gender: 'masculino', identifier: '' };
                        this.showModal = true;
                    },
                    closeModal() {
                        this.showModal = false;
                        this.isEditing = false;
                    },
                    async editPatient(id) {
                        try {
                            const response = await api.get(`/api/patient/${id}`);
                            const patientData = response.data || response;
                            this.currentPatient = {
                                id: patientData.id || patientData._id,
                                firstName: patientData.firstName,
                                lastName: patientData.lastName,
                                birthDate: patientData.birthDate,
                                gender: patientData.gender,
                                identifier: patientData.identifier,
                                registrationDate: patientData.registrationDate
                            };
                            this.isEditing = true;
                            this.showModal = true;
                        } catch (error) {
                            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al obtener los datos del paciente' });
                        }
                    },
                    openInactiveModal() { this.showInactiveModal = true; },
                    closeInactiveModal() { this.showInactiveModal = false; },
                    async activatePatient(id) {
                        try {
                            const patient = this.patients.find(p => p.id === id);
                            if (patient) {
                                await api.put(`/api/patient/${id}`, { ...patient, status: true });
                                await this.loadPatients();
                                Swal.fire({ icon: 'success', title: 'Éxito', text: 'Paciente activado con éxito' });
                            }
                        } catch (error) {
                            Swal.fire({ icon: 'error', title: 'Error', text: 'Error al activar el paciente' });
                        }
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
.patient-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    width: 100%;
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
    /* margin-top: 18px; */
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