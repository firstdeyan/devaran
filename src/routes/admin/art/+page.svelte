<script>
  import { onMount } from "svelte";
  import categories from "$lib/data/categories.json";

  let artworks = [];
  let filteredArtworks = [];
  let searchQuery = "";
  let newArt = {
    title: "",
    category: "",
    image: "",
    description: "",
    isActive: true,
  };
  let token = "mysecret123";
  let message = null;

  async function loadArt() {
    try {
      const res = await fetch("/api/art", {
        headers: { "x-secret-token": token },
      });
      if (!res.ok) throw new Error("Failed to load artworks");
      artworks = await res.json();
      filteredArtworks = artworks;
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  function showMessage(type, text) {
    message = { type, text };
    setTimeout(() => (message = null), 3000); // auto-hide after 3s
  }

  async function addArt() {
    if (!newArt.title || !newArt.category || !newArt.image) {
      showMessage("error", "Title, category, and image are required");
      return;
    }
    try {
      const res = await fetch("/api/art", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": token,
        },
        body: JSON.stringify(newArt),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add artwork");
      showMessage("success", "Artwork added successfully");
      newArt = {
        title: "",
        category: "",
        image: "",
        description: "",
        isActive: true,
      };
      await loadArt();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  async function updateArt(art) {
    try {
      const res = await fetch("/api/art", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": token,
        },
        body: JSON.stringify(art),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update artwork");
      showMessage("success", "Artwork updated successfully");
      await loadArt();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  async function deleteArt(id) {
    if (!confirm("Delete this artwork?")) return;
    try {
      const res = await fetch("/api/art", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-secret-token": token,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete artwork");
      showMessage("success", "Artwork deleted successfully");
      await loadArt();
    } catch (err) {
      showMessage("error", err.message);
    }
  }

  function searchArtworks() {
    filteredArtworks = artworks.filter((a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  onMount(loadArt);
</script>

<section class="section admin">
  <div class="container">
    <h1 class="section-title">🎨 Manage Artworks</h1>
    <p class="section-sub">Add, edit, or remove artworks from the gallery</p>

    {#if message}
      <div class="alert {message.type}">{message.text}</div>
    {/if}

    <!-- Add new artwork -->
    <div class="form-card">
      <h2 class="form-title">➕ Add New Artwork</h2>
      <div class="form-grid">
        <input bind:value={newArt.title} placeholder="Title" required />
        <select bind:value={newArt.category} class="form-select" required>
          <option value="" disabled selected>Select category</option>
          {#each Object.entries(categories) as [slug, name]}
            <option value={slug}>{name}</option>
          {/each}
        </select>
        <input bind:value={newArt.image} placeholder="Image URL" required />
        <textarea bind:value={newArt.description} placeholder="Description"
        ></textarea>
        <label class="checkbox">
          <input type="checkbox" bind:checked={newArt.isActive} />
          Active
        </label>
      </div>
      <button class="btn btn-primary" on:click={addArt}>Add Artwork</button>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search artworks by title..."
        bind:value={searchQuery}
        on:input={searchArtworks}
      />
    </div>

    <!-- Existing artworks -->
    <h2 class="section-sub">Existing Artworks</h2>
    <div class="grid">
      {#each filteredArtworks as art}
        <div class="card">
          <div class="card-media">
            <img src={art.image} alt={art.title} />
          </div>
          <div class="card-body">
            <input
              class="card-input"
              bind:value={art.title}
              on:change={() => updateArt(art)}
            />
            <select
              class="card-input"
              bind:value={art.category}
              on:change={() => updateArt(art)}
            >
              {#each Object.entries(categories) as [slug, name]}
                <option value={slug}>{name}</option>
              {/each}
            </select>
            <input
              class="card-input"
              bind:value={art.image}
              on:change={() => updateArt(art)}
            />
            <textarea
              class="card-input"
              bind:value={art.description}
              on:change={() => updateArt(art)}
            ></textarea>
            <label class="checkbox">
              <input
                type="checkbox"
                bind:checked={art.isActive}
                on:change={() => updateArt(art)}
              />
              Active
            </label>
            <small>Created: {art.createdAt}</small>
            <div class="card-actions">
              <button class="btn btn-danger" on:click={() => deleteArt(art.id)}
                >🗑 Delete</button
              >
              <button class="btn btn-secondary" on:click={() => updateArt(art)}
                >💾 Save</button
              >
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  .alert.success {
    background: #2ecc71;
    color: #fff;
  }
  .alert.error {
    background: #e74c3c;
    color: #fff;
  }

  .form-select {
    background: #2a2a33;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    color: #eee;
    font-size: 0.9rem;
    appearance: none;
  }
  .form-select:focus {
    outline: 2px solid #4a90e2;
  }

  .search-bar {
    margin: 1rem 0;
  }
  .search-bar input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    background: #2a2a33;
    color: #eee;
  }
  .search-bar input:focus {
    outline: 2px solid #4a90e2;
  }

  .admin {
    padding: 2rem 0;
    color: #eee;
  }

  .form-card {
    background: #1c1c22;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  .form-title {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: #fff;
    font-weight: 600;
  }
  .form-grid {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .form-grid input,
  .form-grid textarea {
    background: #2a2a33;
    border: none;
    padding: 0.75rem;
    border-radius: 8px;
    color: #eee;
    font-size: 0.9rem;
  }
  .form-grid textarea {
    min-height: 80px;
  }
  .form-grid input:focus,
  .form-grid textarea:focus {
    outline: 2px solid #4a90e2;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .card {
    background: #1c1c22;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
  }
  .card-media img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .card-input {
    background: #2a2a33;
    border: none;
    padding: 0.5rem;
    border-radius: 8px;
    color: #eee;
    font-size: 0.9rem;
  }
  .card-input:focus {
    outline: 2px solid #4a90e2;
  }
  .card-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s;
  }
  .btn-primary {
    background: #4a90e2;
    color: #fff;
  }
  .btn-primary:hover {
    background: #357ab8;
  }
  .btn-secondary {
    background: #555;
    color: #fff;
  }
  .btn-secondary:hover {
    background: #777;
  }
  .btn-danger {
    background: #e74c3c;
    color: #fff;
  }
  .btn-danger:hover {
    background: #c0392b;
  }
</style>
