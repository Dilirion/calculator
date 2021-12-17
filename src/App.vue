<template>
  <div id="app">
    
    <p id="title" class="w-100 mx-auto my-3">Расчитать дешевый маршрут</p>
    <div v-if="myData" class="d-flex">
      <form id="inputform" class="border shadow-sm h-50 p-3 mx-5 mb-3 bg-body rounded">

        <div class="labelcontainer">
          <label class="label">Звонящая сторона (Caller)</label>
        </div>
        <select class="form-select mb-2 shadow-none" id="caller" v-model="caller" v-on:change="createPath">
          <option v-for="(key, value) in myData.country" :key="value">{{ key }} ({{value}})</option>
        </select>
        
        <div class="labelcontainer">
          <label class="label">Принимающая сторона (Callee)</label>
        </div>
        <select class="form-select shadow-none" id="callee" v-model="callee" v-on:change="createPath">
          <option v-for="(key, value) in myData.country" :key="value">{{ key }} ({{value}}) </option>
        </select>
        <base-checkbox label="Все" v-model="All_isChecked" v-on:change="setCheckbox" :key="All_isChecked + 1"/>
        <base-checkbox label="Прямое соединение" v-model="Direct_isChecked" v-on:change="showPaths" :key="Direct_isChecked + 10"/>
        <base-checkbox label="Один дополнительный узел" v-model="One_isChecked" v-on:change="showPaths" :key="One_isChecked + 20"/>
        <base-checkbox label="Два дополнительных узла" v-model="Two_isChecked" v-on:change="showPaths" :key="Two_isChecked + 30"/>
      </form>

      <the-list-view id="path-list" :listData="showedPaths.sort((a, b) => a.totalPrice > b.totalPrice ? 1 : -1)" :size="4" :key="showedPaths"/>
    </div>
  </div> 
   
</template>

<script>
import BaseCheckbox from './components/BaseCheckbox.vue'
import TheListView from './components/TheListView.vue'
export default {
  name: 'App',
  components: {
    BaseCheckbox, TheListView
  },  
  data(){
    return{
      caller: '', 
      callee: '',
      All_isChecked: true,
      Direct_isChecked: true,
      One_isChecked: true,
      Two_isChecked: true,
      paths: [],
      showedPaths: []
    }
  },  
  mounted() {
    this.$store.dispatch('GET_DATA');
  },
  computed: {
    myData() {
      return this.$store.getters.DATA;
    },
    callerCode() {
      return this.caller.split(" ")[1].substring(1, 3)
    },
    calleeCode() {
      return this.callee.split(" ")[1].substring(1, 3)
    }
  },
  methods: {
    // sets true or false for all checkboxes depending on the 'All' checkbox
    setCheckbox(){      
      if (this.All_isChecked) {
        this.Direct_isChecked = true
        this.One_isChecked = true
        this.Two_isChecked = true
      }
      else {
        this.Direct_isChecked = false
        this.One_isChecked = false
        this.Two_isChecked = false
      }
      this.showPaths()
    },
    showPaths(){
    //sets true or false for 'All' checkbox depending on the other checkboxes
    if (this.Direct_isChecked && this.One_isChecked && this.Two_isChecked) {
      this.All_isChecked = true
    } 
    if (!this.Direct_isChecked || !this.One_isChecked || !this.Two_isChecked) {
      this.All_isChecked = false
    }
    //shows paths correspondent to setted checkboxes
    this.showedPaths = []
    if (this.caller != '' && this.callee != ''){
      if (!this.All_isChecked){
        if (this.Direct_isChecked){
          this.paths.forEach(path => {
            if (path.nodes.length == 2) {
              this.showedPaths.push(path)
            }
          });
        }
        if (this.One_isChecked) {
          this.paths.forEach(path => {
            if (path.nodes.length == 3) {
              this.showedPaths.push(path)
            }
          });
        }
        if (this.Two_isChecked) {
          this.paths.forEach(path => {
            if (path.nodes.length == 4) {
              this.showedPaths.push(path)
            }
          });
        }
      }
      else this.showedPaths = this.paths
    }      
  },   
    //fins all possible call paths from Caller to Callee
    createPath () {
      this.paths = []
        if (this.caller != '' && this.callee != ''){
          let companies = []                                            // names of all telecompanies
          for (let company in this.myData.company) {
            companies.push(company)        
          } 
          let restricted = [this.callerCode]                            // already used call nodes         
          companies.forEach(firstCompany => {
            this.myData.company[firstCompany].forEach(firstWay => {
              if (firstWay.src.substring(0,2) === this.callerCode) {
                //finds all direct paths
                if (firstWay.des.substring(0,2) === this.calleeCode) {
                  this.paths.push({
                    totalPrice: firstWay.price,
                    companies: [firstCompany],
                    prices: [firstWay.price],
                    nodes: [this.callerCode, this.calleeCode],
                    id: this.paths.length+1
                  })                
                }
                else {
                  restricted.push(firstWay.des.substring(0,2))             // saves value of transit node
                  companies.forEach(secondCompany => {
                    this.myData.company[secondCompany].forEach(secondWay => {
                      if (secondWay.src === firstWay.des && !(secondWay.des.substring(0,2) in restricted)){
                        // finds all paths with one transit node
                        if (secondWay.des.substring(0,2) === this.calleeCode) {
                          this.paths.push({
                            totalPrice: firstWay.price + secondWay.price,
                            companies: [firstCompany, secondCompany],
                            prices: [firstWay.price, secondWay.price],
                            nodes: [this.callerCode, secondWay.src.substring(0,2), this.calleeCode],
                            id: this.paths.length+1
                          })
                        }
                        else {
                          companies.forEach(thirdCompany => {
                            this.myData.company[thirdCompany].forEach(thirdWay => {
                              //finds all paths with two transit nodes
                              if (thirdWay.src === secondWay.des && thirdWay.des.substring(0,2) === this.calleeCode){
                                this.paths.push({
                                  totalPrice: firstWay.price + secondWay.price + thirdWay.price,
                                  companies: [firstCompany, secondCompany, thirdCompany],
                                  prices: [firstWay.price, secondWay.price, thirdWay.price],
                                  nodes: [this.callerCode, secondWay.src.substring(0,2), thirdWay.src.substring(0,2), this.calleeCode],
                                  id: this.paths.length+1
                                })
                              }
                            });
                          });
                        }
                      }
                    })
                });
              }
            }
          });          
        });
        //call for showing of finded paths
        this.showPaths()       
        console.log(this.paths.sort((a, b) => a.totalPrice > b.totalPrice ? 1 : -1))
      }
    }
  }  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
#title{
  font-weight: bold;
  font-size: 25px;
}
#inputform{
  width: 30%;
}
#caller,#callee {
  border-top: none;
  border-left:none;
  border-right: none;
  border-color: gray;
  border-width: 2px;
  border-radius: 0%;
  outline: 0;
}
#path-list{
  width: 50%;
  height: 100%;
}
.label{
  font-size: 11px;
  color: gray;
}
.labelcontainer{
  text-align: left;
}
</style>