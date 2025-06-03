<template>

  <!-- Header shared between web and mobile view -->
  <div class="header">
    <img src="@/assets/icon.png" alt="Logo" class="logo-small" />
    <div class="user-menu">
      <span @click="toggleDropdown" class="user-icon">
        <img src="@/assets/user.png" alt="User" class="user-icon" /> ▼
      </span>
      <div v-if="dropdownVisible" class="dropdown">
        <div  v-if="user" class="user-info">
          <div>{{ user.displayName }}</div>
          <div>{{ user.email }}</div>
        </div>
        <br>
        <button @click="signOut" class="signout-button">Sign Out</button>
      </div>
    </div>
  </div>

  <!-- Mobile view -->
  <div class="mobile-view">
    <div class="config-panel-mobile">

      <!-- Display existing entries -->
      <div v-for="(entry, index) in sortedData" :key="index" class="entry-card">
        <div><strong>Parameter Key:</strong> {{ entry.parameterKey }}</div>
        <div><strong>Value:</strong> {{ entry.value }}</div>
        <div><strong>Description:</strong> {{ entry.description }}</div>
        <div><strong>Create Date:</strong> {{ formatDate(entry.createdAt) }}</div>
        <div class="actions">

          <!-- Edit a specific entry -->
          <button class="edit-mobile" @click="openEdit(entry)">Edit</button>

          <!-- Delete a specific entry-->
          <button class="delete-mobile" @click="deleteEntry(entry)">Del</button>
        </div>
      </div>

      <!-- Add new entry -->
      <div class="add-entry">
        <input v-model="newEntry.parameterKey" placeholder="New Parameter" />
        <input v-model="newEntry.value" placeholder="Value" />
        <input v-model="newEntry.description" placeholder="New Description" />
        <button class="add" @click="addEntry">ADD</button>
      </div>
    </div>
  </div>

  <!-- Web view  -->
  <div class="web-view">
    <div class="config-panel">

      <!-- Display existing entries -->
      <table>
        <thead>
          <tr>
            <th>Parameter Key</th>
            <th>Value</th>
            <th>Description</th>
            <th @click="toggleSort" style="cursor: pointer;">
              Create Date
              <span v-if="sortOrder === 'asc'">⬆</span>
              <span v-else-if="sortOrder === 'desc'">⬇</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in sortedData" :key="index">
            <td>{{ entry.parameterKey }}</td>
            <td>{{ entry.value }}</td>
            <td>{{ entry.description }}</td>
            <td>{{ formatDate(entry.createdAt) }}</td>
            <td>

              <!-- Edit a specific entry -->
              <button class="edit" @click="openEdit(entry)">Edit</button>

              <!-- Delete a specific entry-->
              <button class="delete" @click="deleteEntry(entry)">Delete</button>
            </td>
          </tr>

          <!-- Add new entry -->
          <tr>
            <td>
              <input
                v-model="newEntry.parameterKey"
                placeholder="New Parameter"
              />
            </td>
            <td><input v-model="newEntry.value" placeholder="Value" /></td>
            <td>
              <input
                v-model="newEntry.description"
                placeholder="New Description"
                class="last-input"
              />
            </td>
            <td></td>
            <td><button class="add" @click="addEntry">ADD</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Edit entry popup card -->
  <div v-if="editIndex !== null" class="modal-overlay">
    <div class="modal-content edit-card">
      <p>Edit Parameter</p>
      <div class="form-group">
        <label>Parameter Key</label>
        <input
          v-model="editForm.parameterKey"
          :placeholder="entries[editIndex]?.parameterKey || ''"
        />
      </div>
      <div class="form-group">
        <label>Value</label>
        <input
          v-model="editForm.value"
          :placeholder="entries[editIndex]?.value || ''"
        />
      </div>
      <div class="form-group">
        <label>Description</label>
        <input
          v-model="editForm.description"
          :placeholder="entries[editIndex]?.description || ''"
        />
      </div>
      <div class="edit-buttons">
        <button class="btn-success" @click="confirmEdit">Confirm</button>
        <button class="btn-cancel" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup name="ConfigurationPanel">
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import api from "@/api";
import { onMounted } from "vue";
import Configuration from '@/models/Configuration';

const router = useRouter();
const entries = ref([]);
const user = ref(null);

const fetchEntries = async () => {
  try {

    //Get all configurations request
    const response = await api.get("api/configurations");

    //Map entries in the response to Configuration model
    entries.value = response.data.map(item => new Configuration({
      id: item.id,
      parameterKey: item.parameterKey,
      value: item.value,
      description: item.description,
      createdAt: item.createdAt,
      lastUpdated: item.lastUpdated
}));
  } catch (error) {
    console.error("Failed to fetch entries", error);
  }
};

onMounted(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }
  fetchEntries();
});

const signOut = async () => {
  try {

    //Sign out request
    await api.post("auth/signout");
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 

    //Redirect to sign in page when user is signed out
    router.push("/signin");
  } catch (error) {
    alert("Logout failed: " + (error.response?.data?.message || error.message));
  }
};

const dropdownVisible = ref(false);
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

//Format date in dd/MM/yyyy HH:mm
const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(date)).replace(",", " ");
};

const newEntry = ref({ parameterKey: "", value: "", description: "" });

const addEntry = async () => {
  const entry = newEntry.value;

  //Check if all fields are not empty
  if (entry.parameterKey && entry.value && entry.description) {
    try {

      //Add new configuration request
      const response = await api.post("api/configurations", entry);
      entries.value.push(new Configuration({
        id: response.data.id,
        parameterKey: response.data.parameterKey,
        value: response.data.value,
        description: response.data.description,
        createdAt: response.data.createdAt,
        lastUpdated: response.data.lastUpdated
    }));
      newEntry.value = { parameterKey: "", value: "", description: "" };
    } catch (error) {
      alert("Add failed: " + error.message);
    }
  } else {
    alert("Fill all fields");
  }
};

// Date sorting, ascending or descending, default is descending
const sortOrder = ref("desc");

const toggleSort = () => {
  if (sortOrder.value === "desc") sortOrder.value = "asc";
  else sortOrder.value = "desc";
};

const sortedData = computed(() => {
  if (sortOrder.value === "asc") {
    return [...entries.value].sort((a, b) => a.createdAt - b.createdAt);
  } else if (sortOrder.value === "desc") {
    return [...entries.value].sort((a, b) => b.createdAt - a.createdAt);
  } else {
    return entries.value;
  }
});

const deleteEntry = async (entry) => {
  const index = entries.value.findIndex(e => e.id === entry.id);
  if (index === -1) return;

  if (confirm(`Delete "${entry.parameterKey}"?`)) {
    try {

      //Delete a specific configuration request
      await api.delete(`api/configurations/${entry.id}`);
      entries.value.splice(index, 1);
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  }
};


//Edit logic
const editIndex = ref(null);
const editForm = ref({ parameterKey: "", value: "", description: "" });

const openEdit = (entry) => {
  const index = entries.value.findIndex(e => e.id === entry.id);
  if (index === -1) return;

  editIndex.value = index;
  editForm.value = {
    parameterKey: entry.parameterKey,
    value: entry.value,
    description: entry.description,
  };
};

const cancelEdit = () => {
  editIndex.value = null;
  editForm.value = { parameterKey: "", value: "", description: "" };
};

const confirmEdit = async () => {
  const updated = {
    parameterKey: editForm.value.parameterKey,
    value: editForm.value.value,
    description: editForm.value.description,
    lastUpdated: entries.value[editIndex.value].lastUpdated
  };

  if (!updated.parameterKey || !updated.value || !updated.description) {
    alert("Fill all fields");
    return;
  }

  const id = entries.value[editIndex.value].id;
  console.log(entries.value[editIndex.value].lastUpdated);
  try {
    const response = await api.put(`api/configurations/${id}`, updated);
    entries.value[editIndex.value] = new Configuration({
      id: response.data.id,
      parameterKey: response.data.parameterKey,
      value: response.data.value,
      description: response.data.description,
      createdAt: response.data.createdAt,
      lastUpdated: response.data.lastUpdated,
    });
    cancelEdit();
  } catch (error) {
    alert("Update failed: " + error.message);
  }
};


</script>

<style>

/*web layout: table structure*/
@media (min-width: 1000px) {
  .web-view {
    display: block;
  }

  .mobile-view {
    display: none;
  }
}

/*mobile layout: list structure, default behavior*/
@media (max-width: 999px) {
  .web-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

.config-panel {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
}

.logo-small {
  height: 40px;
}

.user-menu {
  position: relative;
}

.user-icon {
  cursor: pointer;
  width: 30px;
}

.dropdown {
  position: absolute;
  top: 24px;
  right: 0;
  background-color: var(--background-color-1);
  border: 1px solid var(--border-color-2);
  padding: 6px 10px;
  border-radius: 4px;
  white-space: nowrap;
}

.user-info{
  font-size: 14px;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  font-size: 14px;
  color: var(--text-color-3);
}

th {
  cursor: pointer;
  font-size: 18px;
  font-weight: normal;
  color: var(--text-color-2);
}

input {
  background-color: transparent;
  color: var(--text-color-4);
  border: 1px solid var(--border-color-1);
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px 4px 4px 4px;
  font-size: 12px;
}

.last-input {
  width: 140%;
}

input::placeholder {
  color: var(--text-color-1);
}

.edit {
  background-color: var(--button-color-2);
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 4px;
}

.delete {
  background-color: var(--button-color-3);
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 15px;
}

.add {
  background-color: var(--button-color-4);
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.signout-button {
  background: none;
  border: solid 1px var(--border-color-2);
  padding: 4px;
  border-radius: 4px;
  margin: 0;
  cursor: pointer;
  text-align: left;
}

.config-panel-mobile {
  padding: 20px;
}

.entry-card {
  background-color: transparent;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: solid 1px white;
}

.entry-card > div {
  margin-bottom: 6px;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-mobile {
  background-color: var(--button-color-2);
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-mobile {
  background-color: var(--button-color-3);
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.add-entry input {
  border: 1px solid var(--border-color-1);
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.add-entry input:last-of-type {
  margin-bottom: 10px;
}

.add-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.add-mobile {
  background-color: var(--button-color-4);
  border: none;
  padding: 10px;
  margin-top: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(13, 13, 33, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: var(--background-color-2);
  border-radius: 8px;
  padding: 20px 30px;
  width: 320px;
  box-sizing: border-box;
}

.edit-card p {
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
  color: var(--text-color-2);
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-size: 14px;
  color: var(--text-color-1);
}

.form-group input {
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid var(--border-color-1);
  background-color: transparent;
}

.edit-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.btn-success {
  background-color: var(--button-color-2);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px;
}

.btn-cancel {
  background: var(--button-color-3);
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  padding: 8px;
}

</style>
