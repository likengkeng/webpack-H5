<template>
    <div>
        <p>这是mode1.demo1页面</p>
        <!-- <img :src="img" alt=""> -->
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
        <Button></Button>
    </div>
    
</template>
<script>
    import Button from '@/view/mode1/view/button'
    
    export default {
        components: {
            Button
        },
        data () {
            return {
                img: require('@/assets/app2.png')
            }
        },
        created () {
        }
    }
</script>
<style scoped>

</style>