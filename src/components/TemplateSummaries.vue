<template>
    <div class="template-summaries">
       <div
          v-for="(template, index) in templates" :key="index" :id="'template-summary-' + index" class="template-summary" @click="handleDivClick(index)" >
            <h3>{{ template.templateName }}</h3>
            <p>Sensor: {{ template.sensorName }}</p>
            <hr class="context-separator" />
            <div v-for="(activities, context) in template.contextDataWithActivities" :key="context" class="context">
                <h4>Context : {{ context }}</h4>
                <ul>
                    <li v-for="activity in activities" :key="activity.name">
                        {{ activity.name }} 
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <button type="button" class="btn btn-primary" @click="$emit('next')">+</button>
</template>

<script>
export default {
    name: 'template-summaries',
    props: {
        templates: Array
    },
    methods: {
        handleDivClick(index) {
            this.$emit('template-clicked', index);
        }
    }
};

</script>

<style>
.template-summaries {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}
.btn-primary{
    margin-top: 1rem;
}

.template-summary {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    /* background-color:#b3cefb; */
    background-color: black;
    color: white
}

.context h4 {
    margin: 5px 0;
}
.context ul li {
    background-color: #005af2;
    margin-bottom: 5px;
    padding: 5px;
    border-radius: 5px;
    color: white
}
.context ul {
  list-style-type: none;
  padding: 0;
  display: flex; /* Apply a flexbox layout */
  flex-wrap: wrap; /* Allow the list items to wrap if there's not enough space */
  gap: 5px; /* Add a gap between the items */
}
.context-separator {
    border: none;
    height: 1px;
    background-color: white;
    margin: 16px 0;
}
</style>
