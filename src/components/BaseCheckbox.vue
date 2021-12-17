<template>
  <label class="container">
    {{label}}
    <input type="checkbox" :checked="isChecked" :value="value" @change="updateInput">
    <span class="checkmark"></span>
  </label>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  model: {
      prop: 'modelValue',
      event: 'change'
    },
  props: {
    "modelValue": { default: "" },
    "label": { type: String, required: true},
    "trueValue": { default: true },
    "falseValue": { default: false }
  },
  computed: {
    isChecked() {
      return this.modelValue === this.trueValue
    }
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked
      this.$emit('change', isChecked ? this.trueValue : this.falseValue)
    }
  }
}
</script>

<style scoped>
.container {
  display: block;
  position: relative;
  padding-left: 20px;
  margin-bottom: 6px;
  margin-top: 20px;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  user-select: none;
  text-align: left;
  color:gray;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 5px;
  left: 0;
  height: 15px;
  width: 15px;
  border-radius: 2px;
  background-color: #eee;
  border: 1px solid gray;
}

.container input:checked ~ .checkmark {
  background-color: rgb(255, 166, 0);
  border: none;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  left: 4.2px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);  
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
