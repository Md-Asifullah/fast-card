<template>
    <ul class="chip-list">
        <li v-for="chip in currentBid" :key="chip">
            <img class="chip-display-players animate" :src="imgSource" alt="" />
        </li>
    </ul>
</template>

<script>
export default {
    props: ['currentBid', 'role'],
    data() {
        return {
            imgSource: '',
        };
    },
    methods: {
        getImgSrc() {
            if (this.role === 'player') {
                this.imgSource = require('@/assets/chip_player.png');
            } else if (this.role === 'computer') {
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
