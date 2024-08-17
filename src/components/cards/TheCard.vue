<template>
    <h3 class="text-white">{{ role }}</h3>
    <img class="img-fluid" :src="imgSource" :class="{ 'animate-opacity': animate }" />
</template>

<script>
export default {
    props: ['card', 'role', 'animate'],
    data() {
        return {
            imgSource: '',
        };
    },
    methods: {
        getImgSrc() {
            this.imgSource = require('@/assets/' + this.card + '.png');
            // const path = require('@/assets/' + this.card + '.png');
            // console.log(path);
        },
    },
    mounted() {
        this.getImgSrc();
    },
    watch: {
        card() {
            this.getImgSrc();
        },
    },
};
</script>

<style scoped>
img {
    width: 200px;
}

.animate-opacity {
    animation: fade-in-effect 2.0s ease-in-out;
}
@keyframes fade-in-effect {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

</style>
