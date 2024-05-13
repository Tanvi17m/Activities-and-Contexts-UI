<template>
    <div>
        <Form ref="form" v-if="mode == 'edit'" v-slot="{ errors }">
              <div class="form-container">
            <!-- Form Group for Sensor Name -->
            <div class="form-group">
                <label for="sensorName" class="form-label">Sensor Name</label>
                <Field name="sensorName" v-model="sensorDetails.sensorName" rules="sensorRequired" as="select"
                    id="sensorName" class="form-control select" aria-label="Sensor Name">
                    <option value="" disabled>Select a sensor</option>
                    <option value="Sensor1">Sensor1</option>
                    <option value="Sensor2">Sensor2</option>
                </Field>
                <span class="error-message" v-if="errors.sensorName">{{ errors.sensorName }}</span>
            </div>
            <!-- Form Group for Sensor Types -->
            <div class="form-group">
                <label class="form-label">Sensor Types</label>
                <div class="checkbox-group">
                    <div v-for="type in sensorTypes" :key="type.id" class="checkbox-row">
                        <input type="checkbox" :id="type.id" :value="type.name" v-model="sensorDetails.sensorTypes"
                            class="form-check-input" />
                        <label :for="type.id" class="form-check-label">{{ type.name }}</label>
                    </div>
                </div>
            </div>
            </div>
        </Form>


        <h1>{{ templateName }}</h1>

        <div v-for="(activities, context) in contexts" :key="context" class="context-section">
            <h2>{{ context }}</h2>
            <div class="activities-container">
                <div class="activities">
                <div v-for="(activity, index) in activities" :key="index" class="activity-with-prefix">
                    <span class="activity-prefix">{{ getActivityPrefix(activities, index) }}</span>
                    <span class="activity-item">{{ activity.name }}</span>
                </div>
                </div>

                <!-- Button to trigger modal -->
                <button @click="openModal(context)" class="add-activity-button btn btn-primary">+ Add Activity</button>
            </div>
        </div>

        <hr class="context-separator" />

        <!-- New context section -->
        <div v-if="addingContext" class="add-context-container">
            <input v-model="newContext" @keyup.enter="addContext" placeholder="Enter new context">
            <button class="btn btn-primary nextInContexts" @click="addContext">Add</button>
        </div>

        <button  class="btn btn-primary" v-else @click="addingContext = true">+ Add Context</button>

        <!-- Bootstrap Modal for adding activity -->
        <div class="modal fade" id="vueModal" tabindex="-1" aria-labelledby="vueModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Activity for {{ currentContext }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Activity Name Input -->
                        <input v-model="newActivity.name" placeholder="Enter activity name" class="form-control">
                        <!-- Activity Type Radio Buttons -->
                        <div class="activity-type">
                            <label>
                                <input type="radio" name="activityType" value="Sequential" v-model="newActivity.type">
                                Sequential
                            </label>
                            <label>
                                <input type="radio" name="activityType" value="Parallel" v-model="newActivity.type">
                                Parallel
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="addActivity(currentContext)">Add
                            Activity</button>
                    </div>
                </div>
            </div>
        </div>

         <button type="button" class="btn btn-primary nextInContexts" @click="emitNext">Next</button>
    </div>
</template>

<script>
import { Form, Field, defineRule } from 'vee-validate';

defineRule('sensorRequired', (value) => {
    return value ? true : 'Sensor Name is required';
});

defineRule('templateRequired', (value) => {
    return value ? true : "Template Name is required";
});

export default {
    props: {
        templateData: Object,
         mode: {
            type: String,
            default: 'add', // Default to 'add'
            validator: value => ['add', 'edit'].includes(value) // Only allow 'add' or 'edit'
        },
        editData: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        Form,
        Field
    },
    data() {
        return {
            templateName: this.mode === 'edit' ? this.editData.templateName : '', // Conditionally populate
            contexts: this.mode === 'edit' ? this.editData.contextDataWithActivities : {}, // Existing or empty
            newContext: '',
            addingContext: false,
            newActivity: { name: '', type: 'Sequential', completed: false }, // Updated structure for activity with type
            currentContext: null,
             sensorDetails: {
                sensorName: this.mode === 'edit' ? this.editData.sensorName : '',
                templateName: this.mode === 'edit' ? this.editData.templateName : '',
                sensorTypes: this.mode === 'edit' ? this.editData.sensorTypes || [] : []
            },
            sensorTypes: [
                { id: "Type1", name: "Type 1" },
                { id: "Type2", name: "Type 2" },
                { id: "Type3", name: "Type 3" },
                { id: "Type4", name: "Type 4" },
                { id: "Type5", name: "Type 5" },
                { id: "Type6", name: "Type 6" },
                { id: "Type7", name: "Type 7" },
            ],
            formErrors: {}
        };
    },
    watch: {
        templateData: {
            immediate: true, 
            deep: true,
            handler(newValue) {
                this.templateName = newValue.templateName;
           }
        }
    },
    methods: {
        emitNext() {
            if( this.mode == 'edit'){
                this.$emit('sensor-details-updated', this.sensorDetails);
                this.$emit("sensor-type-changed", this.sensorDetails.sensorTypes);
            }
            this.$emit('next', this.contexts);
            // postData();
        },
        validate() {
            return this.$refs.form.validate();
        },
      openModal(context) {
            this.currentContext = context;
            this.newActivity = { name: '', type: 'Sequential' }; // Reset on modal open
            const myModal = new bootstrap.Modal(document.getElementById('vueModal'));
            myModal.show();
        },
        addActivity(context) {
            if (this.newActivity.name && this.newActivity.type) {
                const contextActivities = this.contexts[context] || [];
                contextActivities.push({ name: this.newActivity.name, type: this.newActivity.type });
                this.contexts[context] = contextActivities; 
                this.newActivity = { name: '', type: 'Sequential' }; 
                const myModalEl = document.getElementById('vueModal');
                const modal = bootstrap.Modal.getInstance(myModalEl);
                this.$emit('update-contexts', this.contexts);
                modal.hide();
            }
            console.log(this.contexts)
        },
        getActivityPrefix(activities, index) {
                if (index === 0) {
                    return ''; // No prefix for the first activity
                }
               const currentActivity = activities[index];
                if (currentActivity.type === 'Sequential') {
                    return '→ '; 
                } else if (currentActivity.type === 'Parallel') {
                    return ', '; 
                }
                return ''; 
        },
        addContext() {
            if (this.newContext) {
                this.contexts[this.newContext] = [];
                this.newContext = '';
                this.addingContext = false; 
                this.$emit('update-contexts', this.contexts);
            }
            console.log(this.contexts)
        },
    }
};
</script>

<style>
.form-container {
    display: flex;
    justify-content: space-between; /* Distribute space between the elements */
    padding: 20px;
}

.form-group {
    flex: 1; /* Allow each group to grow and fill the space equally */
    margin: 0 10px; /* Add space between the groups */
}

.checkbox-group {
    display: flex;
    flex-wrap: wrap; /* Allow checkboxes to wrap if not enough space */
    gap: 10px; /* Space between checkboxes */
}

.checkbox-row {
    display: flex;
    align-items: center; /* Align the checkbox and label vertically */
}

.form-control, .form-check-input {
    padding: 5px;
    margin-right: 5px; /* Space after checkboxes */
}

.error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 5px;
}


.add-context-container input {
  font-size: 0.8rem;
  padding: 0.5rem 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: 100%;
  max-width: 300px; 
}
.nextInContexts{
    margin: 1em;
}
#vueModal .modal-content {
  color: black; 
}
.activities-container {
  display: flex;
  align-items: center; /* Align activities and the button vertically */
}

.activities {
  flex-grow: 1; /* Fill the available space */
  display: flex;
  flex-wrap: wrap; /* Ensure activities wrap if necessary */
  gap: 8px; /* Adjust spacing between activities */
}

.add-activity-button {
  margin-left: auto; /* This moves the button to the far right */
}

.activity-with-prefix {
  display: flex;
  align-items: center; /* Align prefix and activity content vertically */
}

.activity-prefix {
  margin-right: 1rem; /* Adjust spacing between prefix and activity content */
  font-size: 2rem; /* Adjust font size for the prefix */
}

.activity-type label{
  margin: 10px; /* Space between input and radio buttons */
}

.activity-item {
  margin-right: 8px;
  background-color: #e4e4e4; 
  padding: 4px 8px; 
  border-radius: 4px; 
  border-color: #005af2;
  color: #005af2;
  font-size: 1.25rem
}
.context-section {
    margin-bottom: 24px;
}

.activity-item {
    margin-bottom: 8px;
}

.add-activity-inline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.activity-input {
    flex-grow: 1;
    margin-right: 8px;
}

.add-context-container {
    margin-top: 16px;
}

.context-separator {
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 16px 0;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}

</style>
