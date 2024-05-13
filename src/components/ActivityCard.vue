<template>
    <div class="activity-card">
        <h3>Training data for {{ activityName }}</h3>
        <div v-if="!inProgress" class="start-container">
            <div class="start-button" @click="start">
                <span>Start</span>
            </div>
        </div>
        <div v-if="inProgress" class="progress-container">
            <div class="progress-ring" @click="stop">
                <span>{{ timerSeconds }}s</span>
            </div>
            <div class="stop-button" @click="stop">Stop</div>
        </div>
        <div v-if="completed" class="completed-indicator">
            <span>Sample {{ sampleNumber }} Completed</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActivityCard',
    props: {
        activityName: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        sampleNumber: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            inProgress: false,
            timerSeconds: 0,
            timer: null,
        };
    },
    methods: {
        start() {
            this.inProgress = true;
            this.timerSeconds = 0;
            this.timer = setInterval(() => {
                this.timerSeconds++;
            }, 1000);
            this.$emit('start-activity');
        },
        stop() {
            this.inProgress = false;
            clearInterval(this.timer);
            this.timer = null;
           // this.completed = true; // Mark as completed
            this.$emit('stop-activity');
            this.$emit('completed'); // Notify parent of completion
        },
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
};
</script>

<style scoped>
.activity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
    width: 75%;
    /* max-width: 340px; */
    color: black;
    margin-bottom: 20px;
}

.activity-card h3 {
    font-size: 1.5em;
    margin-bottom: 15px;
    color: black;
    /* Ensure text is visible */
}

.start-container {
    text-align: center;
}

.start-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: #e0e0e0;
    color: #555;
    font-weight: bold;
    cursor: pointer;
}

.progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.progress-ring {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 6px solid blue;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.stop-button {
    margin-top: 10px;
    color: blue;
    font-weight: bold;
    cursor: pointer;
}

.completed-indicator {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    margin-top: 10px;
}

.completed-indicator span {
    font-size: 1em;
}</style>
