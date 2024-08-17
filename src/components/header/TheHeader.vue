<template>
    <div class="row">
        <div class="col-4"></div>
        <div class="col-4">
            <img class="mt-2" :src="logoImgSrc" alt="" />
        </div>
        <div class="col-4 text-end">
            <button type="button" class="btn btn-warning mt-4 me-4" @click="showAlert">Rules</button>
        </div>
    </div>
</template>

<script>
export default {
 
    props: ['title'],
    data(){
        return{
            logoImgSrc: require('@/assets/Fast Card Logo.png')
        }
    },
    methods:{
        showAlert(){
            alert("Rules button clicked!");
        }
    }
};
</script>

<style scoped>
.main-title {
    color: #e5b439;
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
}
</style>
