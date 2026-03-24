<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api';

const token = localStorage.getItem('authToken');
const error = ref('')
const loading = ref(false)
const tab = ref(false)
const showAddProductDialog = ref(false)
const showUserDialog = ref(false)
const showAddRoleDialog = ref(false)
const roles = ref(null)

const rules = {
    required: value => !!value || 'Required.',
    min: v => v.length >= 8 || 'Min 8 characters',
}


const users = ref(null)
const role = ref(null)
const email = ref(null)
const phone = ref(null)
const deliveryAddress = ref(null)

//products
//models
const products = ref(null)
const name = ref(null)
const price = ref(null)
const description = ref(null)
const category = ref(null)
const imagePath = ref(null)

async function fetchProducts() {

    try {
        await api.get('products', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                if (response.data) {
                    products.value = response.data
                }
            })
    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
        throw err
    }
}

//add user
async function addProduct() {
    const formData = new FormData()
    formData.append("name", name.value,);
    formData.append("price", price.value);
    formData.append("description", description.value);
    formData.append("category", category.value);
    formData.append("image", imagePath.value);

    try {
        await api.post('products', formData,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                error.value = ''
                loading.value = false
                close()
                fetchProducts();
            })
    } catch (err) {
        error.value = err.response?.data?.message || 'Creating user failed'
        throw err
    }
}

async function fetchUsers() {
    try {
        await api.get('users', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                if (response.data) {
                    users.value = response.data;
                }
            })
    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
        console.error('Error fetching users:', err);
        throw err
    }
}

async function addUser() {
    const formData = new FormData()
    formData.append("name", name.value,);
    formData.append("email", email.value);
    formData.append("phone", phone.value);
    formData.append("delivery_address", deliveryAddress.value);
    formData.append("password", password.value);
    formData.append("role_id", role.value);

    try {
        await api.post('users', formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                error.value = ''
                loading.value = false
                close()
                fetchUsers();
            })
    } catch (err) {
        error.value = err.response?.data?.message || 'Creating user failed'
        throw err
    }
}

async function fetchRoles() {
    try {
        await api.get('roles', { headers: { 'Authorization': `Bearer ${token}` }})
        .then(function (response) {
            if (response.data) {
                roles.value = response.data;
            }
        })
    } catch (err) {
        error.value = err.response?.data?.message || 'Retrieving data failed'
        console.error('Error fetching roles:', err);
        throw err
    }
}

async function addRoles() {
    const formData = new FormData()
    formData.append("name", name.value,);
    formData.append("description", description.value);

    try {
        await api.post('roles', formData, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
                error.value = ''
                loading.value = false
                close()
                fetchRoles();
            })
    } catch (err) {
        error.value = err.response?.data?.message || 'Creating role failed'
        throw err
    }

}

//clear reactive model values
function close() {
    showAddProductDialog.value = false
    name.value = null
    price.value = null
    description.value = null
    category.value = null
    imagePath.value = null
}
onMounted(() => {
    fetchProducts();
    fetchUsers();
    fetchRoles();
});

</script>

<template>
    <v-container class="text-center mt-12" style="background-color:#CFD0D6">
        <v-card>
            <v-tabs v-model="tab" align-tabs="center" color="primary">
                <v-tab :value="1">Products</v-tab>
                <v-tab :value="2">Users</v-tab>
                <v-tab :value="3">Roles</v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <!-- Products -->
                <v-tabs-window-item :value="1">
                    <div v-if="products == null || products == undefined || Object.keys(products).length == 0" align="center">
                        <v-row>
                            <v-col cols="12" md="6" sm="12">
                                <div class="text-h6">No product found</div>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                                <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                    @click="showAddProductDialog = true"></v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12" sm="12" align="right">
                                    <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                        @click="showAddProductDialog = true"></v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-table class="border">
                                        <thead>
                                            <tr>
                                                <th class="text-left"> ID </th>
                                                <th class="text-left"> Name </th>
                                                <th class="text-left"> Price </th>
                                                <th class="text-left"> Description </th>
                                                <th class="text-left"> Category </th>
                                                <th class="text-center" colspan="3"> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in products" :key="item.id">
                                                <td>{{ item.id }}</td>
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.price }}</td>
                                                <td>{{ item.description }}</td>
                                                <td>{{ item.category }}</td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="primary" size="small"><v-icon
                                                            icon="mdi-pencil"></v-icon> Edit Product</v-btn>
                                                </td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="error" size="small"><v-icon
                                                            icon="mdi-account-cancel"></v-icon> Deactivate</v-btn>
                                                </td>
                                                <td colspan="3" v-if="item.deleted_at !== null" align="center">
                                                    <v-btn color="warning" size="small"><v-icon
                                                            icon="mdi-account-check"></v-icon> Activate</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>

            <v-tabs-window v-model="tab">
                <!-- Users -->
                <v-tabs-window-item :value="2">
                    <div v-if="users == null || users == undefined || Object.keys(users).length == 0" align="center">
                        <v-row>
                            <v-col cols="12" md="6" sm="12">
                                <div class="text-h6">No user found</div>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                                <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                    @click="showAddUserDialog = true"></v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12" sm="12" align="right">
                                    <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                        @click="showAddUserDialog = true"></v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-table class="border">
                                        <thead>
                                            <tr>
                                                <th class="text-left"> ID </th>
                                                <th class="text-left"> Name </th>
                                                <th class="text-left"> Email </th>
                                                <th class="text-left"> Phone </th>
                                                <th class="text-left"> Role </th>
                                                <th class="text-center" colspan="3"> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in users" :key="item.id">
                                                <td>{{ item.id }}</td>
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.email }}</td>
                                                <td>{{ item.phone }}</td>
                                                <td>{{ item.role }}</td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="primary" size="small"><v-icon
                                                            icon="mdi-pencil"></v-icon> Edit User</v-btn>
                                                </td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="error" size="small"><v-icon
                                                            icon="mdi-account-cancel"></v-icon> Deactivate</v-btn>
                                                </td>
                                                <td colspan="3" v-if="item.deleted_at !== null" align="center">
                                                    <v-btn color="warning" size="small"><v-icon
                                                            icon="mdi-account-check"></v-icon> Activate</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>

            <v-tabs-window v-model="tab">
                <!-- Roles -->
                <v-tabs-window-item :value="3">
                    <div v-if="roles == null || roles == undefined || Object.keys(roles).length == 0" align="center">
                        <v-row>
                            <v-col cols="12" md="6" sm="12">
                                <div class="text-h6">No role found</div>
                            </v-col>
                            <v-col cols="12" md="6" sm="12">
                                <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                    @click="showAddRoleDialog = true"></v-btn>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="12" sm="12" align="right">
                                    <v-btn class="ma-2" color="blue-darken-2" icon="mdi-plus"
                                        @click="showAddRoleDialog = true"></v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-table class="border">
                                        <thead>
                                            <tr>
                                                <th class="text-left"> ID </th>
                                                <th class="text-left"> Name </th>
                                                <th class="text-left"> Description </th>
                                                <th class="text-center" colspan="3"> Action </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in roles" :key="item.id">
                                                <td>{{ item.id }}</td>
                                                <td>{{ item.name }}</td>
                                                <td>{{ item.description }}</td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="primary" size="small"><v-icon
                                                            icon="mdi-pencil"></v-icon> Edit Role</v-btn>
                                                </td>
                                                <td v-if="item.deleted_at == null">
                                                    <v-btn color="error" size="small"><v-icon
                                                            icon="mdi-account-cancel"></v-icon> Deactivate</v-btn>
                                                </td>
                                                <td colspan="3" v-if="item.deleted_at !== null" align="center">
                                                    <v-btn color="warning" size="small"><v-icon
                                                            icon="mdi-account-check"></v-icon> Activate</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card>
    </v-container>

    <!-- Add Product Dialog -->
    <v-dialog v-model="showAddProductDialog" max-width="600">
        <v-form @submit.prevent>
            <v-card>
                <v-card-title class="pa-6">
                    <v-row>
                        Add Product
                        <v-spacer></v-spacer>
                        <v-btn class="ma-2" color="blue-darken-2" icon="mdi-close" @click="close();"></v-btn>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col md="6">
                            <v-text-field label="Name" v-model="name" required :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field label="Price" v-model="price" required
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col md="6">
                            <v-textarea label="Description" v-model="description" required
                                :rules="[rules.required]"></v-textarea>
                        </v-col>
                        <v-col md="6">
                            <v-text-field label="Category" v-model="category" required
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="6">
                            <v-col md="6">
                                <v-text-field label="Image Path" v-model="imagePath" required
                                    :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="plain" @click="close()"></v-btn>
                    <v-btn color="primary" text="Save" variant="tonal" @click="addProduct()"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>

    <!-- Add User Dialog -->
    <v-dialog v-model="showUserDialog" max-width="600">
        <v-form @submit.prevent>
            <v-card>
                <v-card-title class="pa-6">
                    <v-row>
                        Add User
                        <v-spacer></v-spacer>
                        <v-btn class="ma-2" color="blue-darken-2" icon="mdi-close" @click="close();"></v-btn>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col md="6">
                            <v-text-field label="Name" v-model="name" required :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field label="Email" v-model="email" required
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col md="6">
                            <v-text-field label="Phone" v-model="phone" required
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-text-field label="Delivery Address" v-model="deliveryAddress" required
                                :rules="[rules.required]"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col md="6">
                            <v-text-field label="Password" v-model="password" required
                                :rules="[rules.required, rules.min]"></v-text-field>
                        </v-col>
                        <v-col md="6">
                            <v-select label="Role" v-model="role" :items="roles" item-title="name" item-value="id"
                                required :rules="[rules.required]"></v-select>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="plain" @click="close()"></v-btn>
                    <v-btn color="primary" text="Save" variant="tonal" @click="addUser()"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>