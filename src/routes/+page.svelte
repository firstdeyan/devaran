<script>
  import { onMount } from "svelte";
  import categories from "$lib/data/categories.json";

  let artworks = [];
  let latestArtworks = [];
  let categoryPreviews = [];
  let token = "mysecret123";

  async function loadArt() {
    const res = await fetch("/api/art", {
      headers: { "x-secret-token": token },
    });
    const data = await res.json();

    // urutkan berdasarkan createdAt terbaru
    artworks = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // ambil 6 terbaru yang aktif
    latestArtworks = artworks.filter((a) => a.isActive).slice(0, 6);

    // ambil 1 artwork per kategori
    categoryPreviews = Object.entries(categories).map(([slug, name]) => {
      const art = artworks.find((a) => a.category === slug && a.isActive);
      return { slug, name, art };
    });
  }

  onMount(loadArt);
</script>

<section class="hero">
  <div class="container hero-wrap">
    <div>
      <h1 class="hero-title">Devaran — A Gallery of Modern Art</h1>
      <p class="hero-sub">
        Showcasing personal artwork across WPAP, Line Art, Pencil Sketch,
        Gouache, Vintage Posters, Warhol Pop Art, and Charcoal Portraits —
        curated with clarity, elegance, and intent.
      </p>

      <div class="cta-row">
        <a class="btn btn-primary" href="/gallery">Explore Gallery</a>
        <a class="btn btn-ghost" href="/about">About Devaran</a>
      </div>
    </div>

    <div class="hero-card">
      <div class="hero-grid">
        {#each latestArtworks as art}
          <div class="preview">
            <img src={art.image} alt={art.title} />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-title">Artwork Categories</div>
        <div class="section-sub">
          Browse by style — each category has its own gallery
        </div>
      </div>
      <a class="btn btn-ghost" href="/gallery">View all categories</a>
    </div>

    <div class="grid">
      {#each categoryPreviews as cat}
        {#if cat.art}
          <article class="card">
            <div class="card-media">
              <img src={cat.art.image} alt={cat.name + " preview"} />
            </div>
            <div class="card-body">
              <div class="card-title">{cat.name}</div>
              <a class="btn btn-primary" href={"/gallery/" + cat.slug}>
                View
              </a>
            </div>
          </article>
        {:else}
          <!-- fallback kalau belum ada artwork untuk kategori -->
          <article class="card">
            <div class="card-media placeholder"></div>
            <div class="card-body">
              <div class="card-title">{cat.name}</div>
              <a class="btn btn-primary" href={"/gallery/" + cat.slug}>
                View
              </a>
            </div>
          </article>
        {/if}
      {/each}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head">
      <div>
        <div class="section-title">About Devaran</div>
        <div class="section-sub">
          A personal gallery built with clarity, elegance, and intent
        </div>
      </div>
      <a class="btn btn-primary" href="/about">Read the story</a>
    </div>
  </div>
</section>

<section class="section highlight">
  <div class="container request-support">
    <div class="section-head">
      <div>
        <div class="section-title">Request & Support</div>
        <div class="section-sub">
          Want your photo transformed into art? Submit a request and support
          Devaran through Saweria.
        </div>
      </div>
    </div>

    <div class="cta-row">
      <a class="btn btn-primary" href="/request">Request an Artwork</a>
      <a
        class="btn btn-ghost"
        href="https://saweria.co/falstworks"
        target="_blank">Support via Saweria</a
      >
    </div>
  </div>
</section>

<!-- <style>
  .hero-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  .preview img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
  .card-media img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }
  .card-media.placeholder {
    background: #2a2a33;
    height: 180px;
    border-radius: 8px 8px 0 0;
  }
</style> -->
