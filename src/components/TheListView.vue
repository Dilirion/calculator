<template>
    <div>
        <ul>
            <base-call-view v-for="item in paginatedData" :key="item.id + item.nodes" :path="item">
            </base-call-view>
        </ul>
         <b-pagination 
            v-model="pageNumber"
            :total-rows="listData.length"
            :per-page="size"
            first-number
            last-number
            align="center"
            aria-controls="items"
            v-show="isData"
        ></b-pagination>
    </div>  
</template>

<script>
import BaseCallView from './BaseCallView.vue'
export default {
    props: {
        listData:{
            type:Array,
            required:true
        },
        size:{
            type:Number,
            required:false,
            default: 10
        }
    },
    computed: {
        paginatedData(){
            const start = (this.pageNumber-1) * this.size,
            end = start + this.size;     
            return this.listData.slice(start, end);
        },
        isData(){
            return this.listData.length > 0 ? 1 : 0
        }
    },
    components: {
        BaseCallView
    },
    data(){
        return {
            pageNumber: 1
        }   
    }
}
</script>