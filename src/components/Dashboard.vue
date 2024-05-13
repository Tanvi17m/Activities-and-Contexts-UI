<template>
    <div class="dashboard">
         <button class="edit-button" @click="editDashboard">Edit</button>
        <!-- Loop through the contexts and create an adaptable container ellipse for each -->
        <div v-for="(activities, context) in contextDataWithActivities" :key="context" class="context-ellipse">
            <h3 class="context-name">{{ context }}</h3>
            <div class="activities">
                <!-- Loop through activities within the context -->
                <div v-for="(activity, index) in activities" :key="index" class="activity-container">
                    <!-- Determine the prefix based on the activity type and position -->
                    <span class="activity-prefix">{{ getActivityPrefix(activities, index) }}</span>
                    <span class="activity-ellipse">{{ activity.name }}</span>
                </div>
            </div>
        </div>
         <!-- <button type="button" class="btn btn-primary" @click="$emit('next')">Next</button> -->
    </div>
</template>

<script>
import { index, interpolate } from 'd3';

export default {
    name: 'Dashboard',
    props: {
        templateData: Object,
        index: Number
    },
    computed: {
        contextDataWithActivities() {
            return this.templateData.contextDataWithActivities;
        }
    },
    methods: {
        getActivityPrefix(activities, index) {
            if (index === 0) {
                return ''; // No prefix for the first activity
            }
            const currentActivity = activities[index];
            if (currentActivity.type === 'Sequential') {
                return '→ '; // Arrow for Sequential activities
            } else if (currentActivity.type === 'Parallel') {
                return ', '; // Comma for Parallel activities
            }
            return ''; // Default empty string for fallback
        },
         editDashboard() {
            console.log('Edit button clicked');
            this.$emit('edit-dashboard', index); 
        }
    }
};
</script>

<style scoped>
.edit-button {
    position: absolute; /* Position the button absolutely within the dashboard */
    top: 10px; 
    right: 10px; 
    z-index: 10; 
    background: #f0f0f0; 
    border: none;
    cursor: pointer; 
}
.dashboard {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px; 
  border: 2px solid white;
  padding: 20px; 
  border-radius: 10px;
  /* background-color:#b3cefb; */
  background-color: black;
}

.context-ellipse {
  background-color: #f0f0f0;
  border-radius: 50%; /* Initially round, will stretch with content */
  padding: 20px;
  margin: 20px;
  display: inline-flex;
  flex-direction: column; /* Stack context name and activities vertically */
  align-items: center; /* Center items within the ellipse */
  gap: 10px; /* Space between context name and activities */
  width: fit-content; /* Let the ellipse grow as needed */
}

.context-name {
  font-weight: bold;
  color: black;
  margin-top: -10px; /* Pull the context name up a bit */
  z-index: 1; /* Ensure it sits above the activities */
}

.activities {
  display: flex; /* Ensure activities are in a row */
  flex-wrap: wrap; /* Allows activities to wrap within the context ellipse */
  gap: 10px; /* Space between activities */
  justify-content: center; /* Center activities horizontally */
  align-items: flex-start; /* Align items to the start of the flex container */
  width: 100%; /* Ensure container uses full width for wrapping */
}

.activity-container {
  display: flex; /* Inline layout for prefix and activity */
  align-items: center; /* Align prefix and activity vertically */
  flex-shrink: 0; /* Prevent shrinking below content size */
}

.activity-prefix {
  margin-right: 4px; /* Space between prefix and activity ellipse */
  color: black; /* Ensuring arrows and commas are black */
}

.activity-ellipse {
  background-color: #d4e4f7;
  color: black;
  border-radius: 50%; /* Maintain ellipse shape */
  padding: 8px 16px; /* Padding for the ellipse */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
