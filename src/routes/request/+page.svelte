<script>
  let name = "";
  let email = "";
  let social = "";
  let style = "";
  let notes = "";
  let file;
  let submitting = false;
  let showPopup = false;

  const styles = [
    "WPAP (Wedha’s Pop Art)",
    "Line Art Minimalis",
    "Realistic Pencil Sketch",
    "Gouache / Watercolor Soft Portrait",
    "Vintage Japanese Poster (Showa era)",
    "Warhol Pop Art",
    "Charcoal Portrait",
  ];

  async function submitRequest(e) {
    e.preventDefault();
    submitting = true;

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("social", social);
      form.append("style", style);
      form.append("notes", notes);
      form.append("file", file);

      const res = await fetch("/api/requests", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");

      // ✅ Show popup instead of plain text
      showPopup = true;

      // reset form
      name = "";
      email = "";
      social = "";
      style = "";
      notes = "";
      file = null;
      e.target.reset();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      submitting = false;
    }
  }

  function closePopup() {
    showPopup = false;
  }

  import saweriaImg from "$lib/assets/saweria.png";
</script>

<section class="section">
  <div class="container">
    <h1 class="section-title">Request an Artwork</h1>
    <p class="section-sub">
      Got a photo or concept in mind? Let Devaran transform it into unique
      artwork. Your Saweria support helps us keep this service open and
      affordable.
    </p>

    <div class="request-grid">
      <form class="request-form" on:submit|preventDefault={submitRequest}>
        <label>
          <span>Name</span>
          <input
            type="text"
            bind:value={name}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          <span>Email (used to deliver your artwork)</span>
          <input
            type="email"
            bind:value={email}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <span>Social media (optional)</span>
          <input
            type="text"
            bind:value={social}
            placeholder="@username or link"
          />
        </label>

        <label>
          <span>Artwork style</span>
          <select bind:value={style} required>
            <option value="" disabled selected>Select a style</option>
            {#each styles as s}<option>{s}</option>{/each}
          </select>
        </label>

        <label>
          <span>Notes</span>
          <textarea
            bind:value={notes}
            placeholder="Describe your request (optional)"
          ></textarea>
        </label>

        <label>
          <span>Upload photo / image</span>
          <input
            type="file"
            accept="image/*"
            required
            on:change={(e) => (file = e.currentTarget.files[0])}
          />
        </label>

        <button class="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit request"}
        </button>
      </form>

      <aside class="saweria-box">
        <div class="section-title" style="font-size:18px;">
          Support via Saweria
        </div>
        <div class="section-sub">
          Requests are processed with community support. Please consider
          donating via Saweria.
        </div>
        <div class="saweria-img">
          <img src={saweriaImg} alt="Saweria QR / banner" />
        </div>
        <a
          class="btn btn-ghost"
          href="https://saweria.co/falstworks"
          target="_blank"
        >
          Open Saweria
        </a>
      </aside>
    </div>
  </div>
</section>

<!-- ✅ Popup modal -->
{#if showPopup}
  <div class="popup-backdrop" on:click={closePopup}>
    <div class="popup" on:click|stopPropagation>
      <button class="popup-close" on:click={closePopup}>×</button>
      <div class="popup-content">
        <h2>🎉 Thank you for your request!</h2>
        <p>
          Your artwork request has been received. The edited result will be
          delivered to your <strong>email</strong> and
          <strong>social media</strong>
          within about <strong>1 day</strong>.
        </p>
        <p>We truly appreciate your support through Saweria 💜</p>
        <button class="btn btn-primary" on:click={closePopup}>Close</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .request-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 24px;
  }
  @media (max-width: 900px) {
    .request-grid {
      grid-template-columns: 1fr;
    }
  }

  .request-form {
    display: grid;
    gap: 12px;
    max-width: 640px;
  }
  .request-form label {
    display: grid;
    gap: 8px;
  }
  .request-form input,
  .request-form select,
  .request-form textarea {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #1c1c22;
    color: white;
  }
  .request-form textarea {
    min-height: 100px;
  }

  .saweria-box {
    background: var(--clr-surface);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 14px;
    padding: 16px;
  }
  .saweria-img {
    margin: 12px 0;
    border-radius: 10px;
    overflow: hidden;
    display: grid;
    place-items: center;
    background: #ffffff; /* white background for QR clarity */
  }
  .saweria-img img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Popup styles */
  .popup-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  }
  .popup {
    background: #1c1c22;
    border-radius: 16px;
    max-width: 500px;
    padding: 24px;
    color: #fff;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
    position: relative;
    animation: scaleIn 0.3s ease;
  }
  .popup-close {
    position: absolute;
    top: 12px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
  }
  .popup-content h2 {
    margin: 0 0 12px;
    font-size: 1.4rem;
    color: var(--brand-accent, #7aa2ff);
  }
  .popup-content p {
    margin: 8px 0;
    line-height: 1.6;
    color: #ccc;
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
