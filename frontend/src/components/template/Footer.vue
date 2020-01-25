<template>
  <footer class="footer">
      <span>Copyright <strong>Cod3r</strong> &copy; 2015-2020</span>
  </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>

<style>
    .footer {
        grid-area: footer;
        background-color: #ddd;
        color: #333;

        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 10px;
    }
</style>