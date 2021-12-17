<template>
  <div id="path-item" class="d-flex justify-content-between border shadow-sm px-3 mb-4 rounded">
    <div id="price" class="rounded-circle text-white">
        <div id="pricetext">
            {{path.totalPrice}}$
        </div>      
    </div>
    
    <div class="d-flex justify-content-center">        
        
        <div class="d-flex justify-content-center" v-for="(node, i) in path.nodes" :key="i">
            <div>
                <!-- This div is just for spacing, it is not visible -->
                <div id="helper" class="mb-1">
                    a
                </div>
                <span id="nodetext" class="rounded text-white px-2 py-1">
                    {{node}}
                </span> 
            </div>
            <div v-if="path.companies[i]" id="company">
                <span id="companytext" class="rounded-pill text-white px-2 py-1 my-1"> 
                    {{path.companies[i]}} {{path.prices[i]}}$
                </span>
                <div class="h2 px-2 mt-2">
                    <b-icon-arrow-right></b-icon-arrow-right>
                </div>
            </div>            
        </div>        
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallView',
  props: ['path']
}
</script>

<style scoped>
#helper{
    visibility: hidden;
}
#company{
    width: 2.1cm;
    font-size: 11px;
}
#price{
    width:1.5cm;
    height:1.5cm;
    display: table;
    background-color: rgb(255, 166, 0);
    
}
#pricetext{
    display: table-cell; 
    vertical-align: middle;
    font-size: 18px;
}
#companytext{
    background-color: rgb(255, 166, 0);
}
#nodetext{
    background-color: gray;
}
#path-item{
    width: 100%;
    padding-top: 12px;
}
</style>
