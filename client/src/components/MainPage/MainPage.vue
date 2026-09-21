<template>
  <div id="main">
    <h1>Bienvenue sur le MPS</h1>
    <video controls="controls">
      <source src="../../assets/ComInterne.mp4" type="video/mp4">
    </video>
  </div>

</template>
<script>
</script>
<style scoped>
#main{
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
}
h1{
  color: black;
  font-family: "Istok Web", sans-serif;
  font-size: xx-large;
}
video {
  width: 500px;
  height: auto;
  /* border: solid 2px #0D5BD7; */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  object-fit: contain;
  overflow-clip-margin: content-box;
  overflow: clip;
}
</style>