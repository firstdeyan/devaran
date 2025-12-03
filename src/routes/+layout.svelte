<!-- src/routes/+layout.svelte -->
<script>
  import "../global.css";
  import { page } from "$app/stores";
</script>

<nav class="site-nav">
  <div class="container nav-inner">
    <a class="brand" href="/">
      <span class="brand-mark"></span>
      <span>Devaran</span>
    </a>

    <div class="nav-links">
      <a
        href="/"
        class={`nav-link ${$page.url.pathname === "/" ? "active" : ""}`}
      >
        Home
      </a>
      <a
        href="/gallery"
        class={`nav-link ${$page.url.pathname === "/gallery" ? "active" : ""}`}
        >Gallery</a
      >
      <a
        href="/request"
        class={`nav-link ${$page.url.pathname === "/order" ? "active" : ""}`}
        >Request</a
      >
      <a
        href="/about"
        class={`nav-link ${$page.url.pathname === "/about" ? "active" : ""}`}
        >About</a
      >
    </div>
  </div>
</nav>

<slot />

<footer class="site-footer">
  <div class="container footer-inner">
    <div>© 2025 Devaran — All rights reserved</div>
    <div class="footer-links">
      <!-- <a class="footer-link" href="/about">About</a>
      <a class="footer-link" href="/gallery">Gallery</a> -->
      <span class="brand-mark"></span>
      <!-- <span>Devaran</span> -->
    </div>
  </div>
</footer>
