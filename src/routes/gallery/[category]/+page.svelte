<script>
  import artworks from "$lib/data/art.json";
  import categories from "$lib/data/categories.json";

  export let params;

  // mapping slug ke nama kategori
  // const categories = {
  //   wpap: "WPAP (Wedha’s Pop Art)",
  //   lineart: "Line Art Minimalis",
  //   sketch: "Realistic Pencil Sketch",
  //   gouache: "Gouache / Watercolor Soft Portrait",
  //   poster: "Vintage Japanese Poster (Showa era)",
  //   warhol: "Warhol Pop Art",
  //   charcoal: "Charcoal Portrait",
  // };

  const slug = params.category;
  const title = categories[slug] || slug;

  // filter karya sesuai kategori
  const filtered = artworks.filter(
    (a) => a.category === slug && a.isActive === true
  );

  let selected = null;
  let currentIndex = 0;

  function openModal(art, index) {
    selected = art;
    currentIndex = index;
  }
  function closeModal() {
    selected = null;
    currentIndex = 0;
  }
  function nextArt() {
    currentIndex = (currentIndex + 1) % filtered.length;
    selected = filtered[currentIndex];
  }
  function prevArt() {
    currentIndex = (currentIndex - 1 + filtered.length) % filtered.length;
    selected = filtered[currentIndex];
  }
</script>

<section class="section">
  <div class="container">
    <h1 class="section-title">{title}</h1>
    <p class="section-sub">Gallery of {title} artworks</p>

    {#if filtered.length > 0}
      <div class="grid">
        {#each filtered as art, i}
          <div class="card" on:click={() => openModal(art, i)}>
            <div class="card-media">
              <img src={art.image} alt={art.title} />
            </div>
            <div class="card-body">
              <div class="card-title">{art.title}</div>
              <div class="card-type">{title}</div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="section-sub">No artworks available yet for this category.</p>
    {/if}
  </div>
  <div class="container">
    <br /><br /><br /><br /><br />
  </div>
</section>

<!-- Modal pop-up -->
{#if selected}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal" on:click|stopPropagation>
      <button class="modal-close" on:click={closeModal}>×</button>

      <div class="modal-media">
        <img src={selected.image} alt={selected.title} />
      </div>

      <div class="modal-info">
        <h2>{selected.title}</h2>
        <p>{selected.description}</p>
      </div>

      <div class="modal-nav">
        <button on:click={prevArt}>‹ Prev</button>
        <button on:click={nextArt}>Next ›</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  .modal {
    background: #1c1c22;
    border-radius: 16px;
    max-width: 90%;
    max-height: 100%;
    width: 700px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    animation: scaleIn 0.3s ease;
    position: relative;
  }
  .modal-media {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
  }
  .modal-media img {
    max-width: 100%;
    max-height: 75vh;
    object-fit: contain;
  }
  .modal-info {
    padding: 16px 20px;
    background: #1c1c22;
    color: #eee;
  }
  .modal-info h2 {
    margin: 0 0 8px;
    font-size: 1.4rem;
    font-weight: 600;
    color: #fff;
  }
  .modal-info p {
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
    color: #ccc;
  }
  .modal-close {
    position: absolute;
    top: 12px;
    right: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  .modal-close:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  .modal-nav {
    display: flex;
    justify-content: space-between;
    padding: 12px 20px;
    background: #111;
  }
  .modal-nav button {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .modal-nav button:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
