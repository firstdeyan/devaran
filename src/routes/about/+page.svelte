<section class="section">
  <div class="container about-grid">
    <div>
      <h1 class="section-title">About Devaran</h1>
      <p class="section-sub">
        A gallery-first brand built with clarity, elegance, and intent
      </p>

      <div class="about-content">
        <p>
          Devaran is a personal gallery that curates diverse styles of artwork —
          from WPAP and Pop Art to Japanese vintage posters, realistic sketches,
          gouache portraits, and charcoal studies. Each piece is created with a
          balance of creativity and technical rigor, presented in a modern and
          professional aesthetic.
        </p>
        <p>
          More than just a showcase, Devaran is designed to be accessible and
          community-driven. Requests are open for anyone who wants their photo
          or idea transformed into art, with support handled through donations.
          This approach keeps the process clear, flexible, and inclusive.
        </p>
      </div>

      <div class="about-content">
        <br /><br /><br /><br /><br />
      </div>
    </div>

    <div class="services">
      <div class="section-title">Available Styles</div>
      <ul>
        <li><strong>WPAP:</strong> Bold geometric portraits</li>
        <li><strong>Line Art Minimalis:</strong> Clean, minimal outlines</li>
        <li><strong>Pencil Sketch:</strong> Realistic shading and detail</li>
        <li><strong>Gouache / Watercolor:</strong> Soft painterly look</li>
        <li>
          <strong>Vintage Japanese Poster:</strong> Retro Showa-era poster style
        </li>
        <li><strong>Warhol Pop Art:</strong> High-contrast color blocks</li>
        <li><strong>Charcoal Portrait:</strong> Deep textured monochrome</li>
      </ul>
      <a class="btn btn-primary" href="/request" style="margin-top:12px;">
        Make a request
      </a>
    </div>
  </div>
</section>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 32px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .about-grid {
      grid-template-columns: 1fr;
    }
  }
  .about-content {
    max-width: 700px;
    line-height: 1.8;
    color: var(--clr-muted);
  }
  .services {
    background: var(--clr-surface);
    padding: 20px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .services ul {
    margin: 12px 0 0;
    padding-left: 18px;
    display: grid;
    gap: 8px;
  }
</style>
