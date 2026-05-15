// ── Mobile menu ─────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const drawer  = document.getElementById('drawer');
  menuBtn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('[data-close]').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    });
  });

  // ── Reveal on scroll ─────────────────────
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ── Mobile bar appears after scrolling past hero ──
  const mbar = document.getElementById('mbar');
  const onScroll = () => {
    if (window.scrollY > window.innerHeight * 0.6) mbar.classList.add('in');
    else mbar.classList.remove('in');
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // ── Live "open / closed" status (fictional schedule) ──
  // Hours: Wed/Thu/Fri 15-21, Sat/Sun 11-19. Closed Mon/Tue.
  function status(){
    const now = new Date();
    const d = now.getDay(); // 0 Sun ... 6 Sat
    const h = now.getHours() + now.getMinutes()/60;
    let openH, closeH, baked=false;
    if (d === 1 || d === 2){ // Mon/Tue
      return { txt: 'CLOSED · MON / TUE', color: '--steel' };
    }
    if (d === 0 || d === 6){ openH=11; closeH=19; baked = (h >= 13.05); }
    else { openH=15; closeH=21; baked = (h >= 17.05); }
    if (h < openH){
      return { txt: `OPENS AT ${String(openH).padStart(2,'0')}:00`, color:'--steel' };
    }
    if (h > closeH){
      return { txt: 'CLOSED FOR TONIGHT', color:'--steel' };
    }
    if (baked){
      return { txt: 'OPEN NOW · BAKED', color:'--butter' };
    }
    return { txt: `OPEN · BAKES AT ${(d===0||d===6)?'13:03':'17:03'}`, color:'--butter' };
  }
  const ls = document.getElementById('liveStatus');
  function tick(){
    const s = status();
    ls.textContent = '● ' + s.txt;
    ls.style.color = `var(${s.color})`;
  }
  tick(); setInterval(tick, 30000);
