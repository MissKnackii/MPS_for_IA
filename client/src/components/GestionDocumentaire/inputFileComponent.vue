
<script>
export default {
    name: 'FileComponent',
    ref: "fileInput",
    methods: {
        onChangeFile(event) {
          this.$emit('update:modelValue', event.target.files[0]);
        }
    },
    mounted() {
      this.$refs.fileInput.focus()
    }
}
</script>
<template>
    <input type="file"  @change="onChangeFile" name="file"   />

</template>
<style scoped>
button {
  margin-top: 0%;
  margin-right: 10%;
  color: #ffffff;
  background-color: #0452c8;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border: 1px solid #0452c8;
  border-radius: 11px;
  padding: 10px 20px;
  cursor: pointer
}
button:hover {
  color: #0452c8;
  background-color: #ffffff;
}</style>