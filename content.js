/* WeightLab – gemeinsamer Content-Loader
   Lädt content.json (Overrides aus der Admin-Page) und wendet sie an:
   - [data-t="key"]  → innerHTML-Override aus content[site].texts[key]
   - [data-img="key"] → Bild aus content[site].images[key] (img.src bzw. background)
   - Akzentfarbe der Post-Site aus content.accent.post
   Site-Skripte warten auf window.WL_READY (Promise → Content-Objekt). */
window.WL_READY = fetch('content.json?ts=' + Date.now(), { cache: 'no-store' })
  .then(r => (r.ok ? r.json() : {}))
  .catch(() => ({}))
  .then(C => {
    window.WL_CONTENT = C;
    const apply = () => {
      const site = document.body.dataset.wlSite || 'pre';
      const S = C[site] || {};
      const T = S.texts || {};
      document.querySelectorAll('[data-t]').forEach(el => {
        const v = T[el.dataset.t];
        if (v != null && v !== '') el.innerHTML = v;
      });
      const I = S.images || {};
      document.querySelectorAll('[data-img]').forEach(el => {
        const v = I[el.dataset.img];
        if (!v) return;
        if (el.tagName === 'IMG') { el.src = v; el.classList.add('has-img'); }
        else {
          el.style.backgroundImage = `url("${v}")`;
          el.classList.add('has-img');
        }
      });
      if (site === 'post' && C.accent && C.accent.post) {
        document.documentElement.style.setProperty('--accent', C.accent.post);
      }
      if (C.coachingAktiv === false) document.body.classList.add('wl-coaching-off');
    };
    if (document.readyState !== 'loading') apply();
    else document.addEventListener('DOMContentLoaded', apply);
    return C;
  });
