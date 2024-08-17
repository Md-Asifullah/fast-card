<template>
    <ul class="chip-list" v-if="chipsRemaining < 25">
        <li v-for="chip in chipsRemaining" :key="chip">
            <img class="chip-display-players" :src="imgSource" alt="" />
        </li>
    </ul>
    
</template>

<script>
export default {
    props: ['type', 'remaining'],
    data() {
        return {
            imgSource: '',
            show: true,
        };
    },
    computed: {
        chipsRemaining() {
            if (this.type === 'computer') {
                // console.log("🧯 Using chipsRemaining computed property. Value is : " + this.remaining);
            }
            if (this.remaining < 1) {
                return 25;
            } else {
                return this.remaining;
            }
        },
    },
    methods: {
        getImgSrc() {
            if (this.type === 'player') {
                this.imgSource = require('@/assets/chip_player.png');
            } else if (this.type === 'computer') {
                this.imgSource = require('@/assets/chip_computer.png');
            }
        },
    },
    mounted() {
        this.getImgSrc();
    },
};
</script>

<style scoped>
.chip-display-players {
    width: 50px;
    margin-bottom: 10px;
}
.chip-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.chip-list li {
    display: inline-block;
    margin-right: 10px;
}
</style>
