<template>
  <div>
        <div class="row d-flex justify-content-center">
           <div  class="col-12 col-md-8 col-lg-6">
              <add-template v-if="currentStep === 2" :mode="mode" :editData="templateDataArray[selectedTemplateIndex]" @next="currentStep++" @sensor-details-updated="handleSensorDetailsUpdate" @sensor-type-changed="handleSensorTypeChange"></add-template>
              </div>
              <div class="col-12 col-md-12 col-lg-12">
              <context-creator v-if="currentStep === 3" @next="handleNext"  :mode ="mode" :editData="templateDataArray[selectedTemplateIndex]" :templateData="templateData" @update-contexts="handleContextDataUpdate" @sensor-details-updated="handleSensorDetailsUpdate" @sensor-type-changed="handleSensorTypeChange"></context-creator>
              <template-summaries v-if="currentStep === 1" @next="newTemplate" @template-clicked="showDashboard"  :templates="templateDataArray"></template-summaries>
              <dashboard v-if="currentStep === 1 && dashboardVisible" :templateData="templateDataArray[selectedTemplateIndex]" @edit-dashboard="editTemplate" :index="selectedTemplateIndex"></dashboard>
              </div>
              <div  class="col-12 col-md-8 col-lg-6">
              <div v-if="currentActivity && currentStep === 4" class="training-card">
              <h2>{{ currentContextName }}</h2>
              <activity-card
                :activity-name="currentActivity.name"
                :completed="currentActivity.completed"
                :type="currentActivity.type"
                :sample-number="currentSampleIndex"
                @start-activity="handleStartActivity"
                @stop-activity="handleStopActivity"
                @completed="handleActivityCompleted"
              ></activity-card>
              <button v-if="hasNextActivity" class="btn btn-primary" @click="goToNextActivity">Next Activity</button>
              <button v-else class="btn btn-primary" @click="handleFinish">Finish</button>
            </div>
            </div>
        </div>
  </div>
</template>
<script>
import AddTemplate from './components/AddTemplate.vue'
import ContextCreator from './components/ContextCreator.vue'
import Dashboard from './components/Dashboard.vue'
import TemplateSummaries from './components/TemplateSummaries.vue';
import ActivityCard from './components/ActivityCard.vue';


import { postData, searchTemplateSensors, updateTemplateDetails } from './javascripts/api';

export default {
  data() {
    return {
      currentSampleIndex: 0,
      currentContextIndex: 0,
      currentActivityIndex: 0,
      activities: [],

      currentStep: 1,
      mode:"add",
      templateDataArray: [],
      dashboardVisible: false, 
      selectedTemplateIndex: -1, 
      templateData: {
        sensorName: "",
        templateName: "",
        sensorTypes:[],
        activitiesData:[],
        contextsData:[],
        contextDataWithActivities:{}
      }
    };
  },
  computed: {
    currentContextName() {
      const contextNames = Object.keys(this.templateData.contextDataWithActivities);
      return contextNames[this.currentContextIndex];
    },
    // currentActivity() {
    //   const contextNames = Object.keys(this.templateData.contextDataWithActivities);
    //   const currentContextName = contextNames[this.currentContextIndex];
    //   const activities = this.templateData.contextDataWithActivities[currentContextName];
    //   return activities ? activities[this.currentActivityIndex] : null;
    // },
    // hasNextActivity() {
    //   const contextNames = Object.keys(this.templateData.contextDataWithActivities);
    //   const activities = this.templateData.contextDataWithActivities[currentContextName];
    //   const isLastActivity = this.currentActivityIndex >= activities.length - 1;
    //   return !(this.currentContextIndex >= contextNames.length - 1 && isLastActivity);
    // },
    currentActivity() {
      const contextName = this.currentContextName;
      const activities = this.templateData.contextDataWithActivities[contextName];
      return activities ? activities[this.currentActivityIndex] : null;
    },
    hasNextActivity() {
      const contextNames = Object.keys(this.templateData.contextDataWithActivities);
      const activities = this.templateData.contextDataWithActivities[this.currentContextName];
      const isLastActivityInContext = this.currentActivityIndex >= activities.length - 1;
      return !(
        this.currentContextIndex >= contextNames.length - 1 &&
        isLastActivityInContext
      );
    },
  },
  components: {
    AddTemplate,
    ContextCreator,
    Dashboard,
    TemplateSummaries,
    ActivityCard,
  },
  async mounted(){
     this.templateDataArray = await searchTemplateSensors()
     this.templateData.contextDataWithActivities = this.templateDataArray[0].contextDataWithActivities
     console.log(this.templateDataArray)
     console.log(this.templateData.contextDataWithActivities)
  },
  methods: {
    handleStartActivity() {
      console.log("Activity started");
      const currentContextName = Object.keys(this.templateData.contextDataWithActivities)[this.currentContextIndex];
      const activities = this.templateData.contextDataWithActivities[currentContextName];
      activities[this.currentActivityIndex].completed = false;
    },
    handleStopActivity() {
      console.log("Activity stopped");
    //  currentActivity.completed = true
    },
    handleActivityCompleted() {
        this.currentSampleIndex++;
        this.currentActivity.completed = true; // Mark activity as completed
       // this.goToNextActivity(); // Move to the next activity
      
      // const currentContextName = Object.keys(this.templateData.contextDataWithActivities)[this.currentContextIndex];
      // const activities = this.templateData.contextDataWithActivities[currentContextName];
      // activities[this.currentActivityIndex].completed = true;
      console.log("Activity completed");
    },
    async handleFinish() {
      this.currentStep = 1;
      this.currentContextIndex = 0
      this.currentActivityIndex = 0
      this.currentSampleIndex = 0;
      // const contextName = this.currentContextName;
      // const activities = this.templateData.contextDataWithActivities[contextName];
      // currentActivity = activities ? activities[this.currentActivityIndex] : null;
      this.resetTemplateData();
    },
    goToNextActivity() {
      const contextNames = Object.keys(this.templateData.contextDataWithActivities);
      const activities = this.templateData.contextDataWithActivities[this.currentContextName];

      if (this.currentActivityIndex < activities.length - 1) {
        this.currentActivityIndex++;
        this.currentSampleIndex = 0;
      } else {
        if (this.currentContextIndex < contextNames.length - 1) {
          this.currentContextIndex++;
          this.currentActivityIndex = 0;
          this.currentSampleIndex = 0;
        }
      }
    },
    showDashboard(index) {
      this.selectedTemplateIndex = index;
      this.dashboardVisible = true; 
    },
    editTemplate(index){
      this.mode = "edit"
      this.currentStep = 3;
    },
    newTemplate(){
      this.mode = "add"
      this.currentStep++
    },
    async validateFirstStep() {
      const response = await this.$refs.firstStepComponent.validate()
      console.log(response)
      return response.valid;
    },
    async validateSecondStep() {
      const response = await this.$refs.secondStepComponent.validate();
      return response.valid;
    },
    handleStepChange(prevIndex,newIndex) {
      console.log(newIndex)
    },
    afterTabSwitch(event) {
     // isValid = false;
      console.log("Clicked")
      console.log(event)
    //  console.log(prevIndex)
      return true;
    },
    handleSensorDetailsUpdate(sensorDetails) {
      this.templateData.sensorName = sensorDetails.sensorName
      this.templateData.templateName = sensorDetails.templateName
      console.log("Sensor details updated:", sensorDetails);
    },
     handleSensorTypeChange(sensorTypes) {
      this.templateData.sensorTypes = sensorTypes;
    //  console.log('Updated Sensor Types:', this.templateData.sensorTypes);
    },
    updateActivities(activities) {
      this.templateData.activitiesData = activities;
     //  console.log('Activities: ', this.templateData.activitiesData);
    },
    updateContexts(contexts) {
      this.templateData.contextsData = contexts;
    //  console.log('Contexts: ', this.templateData.contextsData);
    },
    handleContextDataUpdate(newContextData) {
      this.templateData.contextDataWithActivities = newContextData; // Assuming `contextData` is defined in your data
      console.log('Context Data updated in App.vue:', this.templateData.contextDataWithActivities);
    },
    async handleNext(contexts) {
      this.templateData.contextDataWithActivities = contexts;
      if( this.mode == 'add'){
          await postData(this.templateData)
      }else if( this.mode == 'edit'){
          await updateTemplateDetails(this.templateData)
      }
      this.templateDataArray.push(this.templateData);
      this.templateDataArray = await searchTemplateSensors()
      this.currentStep++;
     // console.log(currentStep)
     // this.resetTemplateData();
      console.log(this.templateDataArray)
    },

    resetTemplateData() {
      this.templateData = {
        sensorName: "",
        templateName: "",
        sensorTypes: [],
        activitiesData: [],
        contextsData: [],
        contextDataWithActivities: {}
      };
    }
  }
};
</script>
<style>
body {
  .training-card{
    display: flex;
    flex-direction: column;
    justify-content: center; /* Center children vertically */
    align-items: center; /* Center children horizontally */
  };
  margin: auto;
  padding: 0;
  height: 100vh; /* 100% of the viewport height */
  width: 100vw; /* 100% of the viewport width */
  display: flex; /* Use flexbox to center contents */
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center children vertically */
  align-items: center; /* Center children horizontally */
}

/* The #app element should take the full width of its parent, which is body */
#app {
  width: 100%; /* Take full width of the body */
  display: block;
  justify-content: center;
  align-items: center;
}
/* #app{
  display: block;
  justify-content: center;
  align-items: center;
    place-items: center;
}
 body {
  display: block;
  place-items: center;
  margin: 0;
  height: 100vh;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5; 
  place-items: center;
  width: 100%; 
  color: black;
}  */
/* #app {
  display: block,
} */
</style>