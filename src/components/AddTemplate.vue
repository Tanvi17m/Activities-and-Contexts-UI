<template>
    <div class="text-center form-container">
        <Form ref="form" v-slot="{ errors }">
            <!-- Form Group for Sensor Name -->
            <div class="form-group" >
                <label for="sensorName" class="form-label">Sensor Name</label>
                <Field name="sensorName" v-model="sensorDetails.sensorName" rules="sensorRequired" as="select"
                    id="sensorName" class="form-control" aria-label="Sensor Name">
                    <option value="" disabled>Select a sensor</option>
                    <option value="Sensor1">Sensor1</option>
                    <option value="Sensor2">Sensor2</option>
                </Field>
                 <span class="error-message" v-if="errors.sensorName">{{ errors.sensorName }}</span>
            </div>

            <!-- Form Group for Template Name -->
            <div class="form-group">
                <label for="templateName" class="form-label">Template Name</label>
                <Field name="templateName" v-model="sensorDetails.templateName" rules="templateRequired" as="input"
                    type="text" id="templateName" class="form-control" aria-label="Template Name"
                    placeholder="Enter template name">
                </Field>
                <span class="error-message" v-if="errors.templateName">{{ errors.templateName }}</span>
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

            <div class="form-group button-group">
                <button type="button" class="btn btn-primary" @click="submitForm">Next</button>
            </div>
        </Form>
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
    name: 'first-step',
      props: {
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
    methods: {
        submitForm() {
            this.$refs.form.validate().then((isValid) => {
                if (isValid.valid) {
                    this.emitSensorDetails();
                    this.$emit('go-to-next-step'); // Emit event to proceed to the next step
                }
            });
        },
        emitSensorDetails() {
            this.$emit('sensor-details-updated', this.sensorDetails);
            this.$emit("sensor-type-changed", this.sensorDetails.sensorTypes);
            this.$emit('next');
           // postData();
        },
        validate() {
            return this.$refs.form.validate();
        }
    },
    watch: {
        "sensor_type.sensorType": {
            deep: true,
            handler(newVal) {
                this.$emit("sensor-type-changed", newVal);
            },
        },
    }
};
</script>

<style scoped>
.form-container {
    width: 100%;
}

.form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* Full width */
}

.form-label {
    text-align: left;
}

.form-control {
    width: 100%;
    /* Full width */
    margin-bottom: 0.5rem;
    /* Space below each input */
}

.checkbox-group {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* Allow checkboxes to wrap */
    justify-content: flex-start;
    /* Align checkboxes to the start */
    gap: 10px;
    /* Space between checkboxes */
}

.checkbox-row {
    display: flex;
    align-items: center;
}

.form-check-input {
    margin-right: 0.5rem;
    /* Space between checkbox and label */
}

.form-check-label {
    margin-bottom: 0;
    /* Remove bottom margin from label */
}

.button-group {
    display: flex;
    justify-content: flex-end;
    /* Align button to the right */
    padding-top: 1rem;
    /* Space above the button */
}

.error-message {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    /* Space above error message */
}


.form-select-lg,
.form-control-lg {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}

form {
    width: 100%;
}</style>
