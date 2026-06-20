/* ============================
   AYUROMA – Interactive JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── CUSTOM CURSOR & TRAIL ─── */
  const cursor = document.getElementById('cursorGlow');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    trailX += (mouseX - trailX) * 0.15;
    trailY += (mouseY - trailY) * 0.15;
    if (cursorTrail) {
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();


  document.querySelectorAll('a, button, .product-card, .ingredient-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  /* ─── THEME TOGGLE ─── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
      }
    });
  }

  /* ─── MAGNETIC BUTTONS ─── */
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  /* ─── FLOATING PETALS ─── */
  const petalContainer = document.getElementById('petalsContainer');
  const petalColors = ['#c7607a', '#d4af37', '#6a9c6a', '#e8a87c', '#d4881a'];
  function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const size = Math.random() * 10 + 8;
    petal.style.cssText = `
      left: ${Math.random() * 100}vw;
      width: ${size}px;
      height: ${size}px;
      background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
      animation-duration: ${Math.random() * 8 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
      opacity: 0.5;
    `;
    petalContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 16000);
  }
  setInterval(createPetal, 800);
  // Initial burst
  for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 200);

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─── MOBILE NAV ─── */
  const navToggleBtn = document.getElementById('navToggle');
  const navLinksMenu  = document.getElementById('navLinks');
  if (navToggleBtn && navLinksMenu) {
    navToggleBtn.addEventListener('click', () => {
      navLinksMenu.classList.toggle('open');
      navToggleBtn.classList.toggle('active');
    });
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        navToggleBtn.classList.remove('active');
      });
    });
  }

  /* ─── SCROLL EFFECTS & MARQUEE ─── */
  const revealTargets = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => observer.observe(el));

  const marqueeTrack = document.querySelector('.marquee-track');
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;
    if (marqueeTrack) {
      const skewAmount = Math.min(Math.max(scrollVelocity * 0.1, -15), 15);
      marqueeTrack.style.transform = `skewX(${skewAmount}deg)`;
    }
  }, { passive: true });
  
  setInterval(() => {
    if (marqueeTrack && Math.abs(scrollVelocity) > 0) {
      scrollVelocity *= 0.9;
      if (Math.abs(scrollVelocity) < 0.5) scrollVelocity = 0;
      marqueeTrack.style.transform = `skewX(${Math.min(Math.max(scrollVelocity * 0.1, -15), 15)}deg)`;
    }
  }, 50);

  /* ─── 3D IMAGE PARALLAX ─── */
  document.querySelectorAll('.product-card__img-wrap').forEach(wrap => {
    const img = wrap.querySelector('.product-card__img');
    wrap.addEventListener('mousemove', e => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (img) img.style.transform = `scale(1.1) translate(${x * -15}px, ${y * -15}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      if (img) img.style.transform = `scale(1) translate(0, 0)`;
    });
  });

  /* ─── CART LOGIC & PARTICLES ─── */
  let cart = [];
  const cartCountEl = document.getElementById('cartCount');
  const floatingCart = document.getElementById('floatingCart');
  const whatsappNumber = '919552671171';
  const cartModal = document.getElementById('cartModal');
  const cartModalClose = document.getElementById('cartModalClose');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCheckoutForm = document.getElementById('cartCheckoutForm');
  const cartToast = document.getElementById('cartToast');
  const openCartModalBtn = document.getElementById('openCartModalBtn');
  const navCartBtn = document.getElementById('navCartBtn');
  const navCartCount = document.getElementById('navCartCount');
  
  function showToast(msg = '✦ Added to cart!') {
    cartToast.textContent = msg;
    cartToast.classList.add('show');
    setTimeout(() => cartToast.classList.remove('show'), 3000);
  }

  function updateCartUI() {
    if (cartCountEl) cartCountEl.textContent = cart.length;
    if (navCartCount) navCartCount.textContent = cart.length;
    if (cart.length > 0) {
        floatingCart.classList.add('visible');
    } else {
        floatingCart.classList.remove('visible');
    }
    
    document.querySelectorAll('.product-btn').forEach(btn => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('.product-card__name').textContent;
      const taglineEl = card.querySelector('.product-card__tagline');
      const fullName = taglineEl ? `${name} - ${taglineEl.textContent}` : name;
      const count = cart.filter(item => item.name === fullName).length;
      
      if (count > 0) {
        btn.textContent = `✓ Added (${count})`;
        btn.style.background = 'var(--green)';
        btn.style.borderColor = 'var(--green)';
      } else {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
        btn.style.borderColor = '';
      }
    });
  }

  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Confetti burst
      const rect = btn.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = originX + 'px';
        particle.style.top = originY + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        particle.style.setProperty('--dx', `${Math.cos(angle) * velocity}px`);
        particle.style.setProperty('--dy', `${Math.sin(angle) * velocity}px`);
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
      
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-card__name').textContent;
      const taglineEl = card.querySelector('.product-card__tagline');
      const fullName = taglineEl ? `${name} - ${taglineEl.textContent}` : name;
      
      const priceText = card.querySelector('.price-current').textContent;
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

      cart.push({ name: fullName, price: priceNum, shortName: name });
      updateCartUI();
      showToast(`✦ ${name} added to cart!`);
    });
  });

  function updateCartModalUI() {
    cartItemsList.innerHTML = '';
    const itemCounts = {};
    let total = 0;
    cart.forEach(item => {
      if (!itemCounts[item.name]) itemCounts[item.name] = { count: 0, price: item.price };
      itemCounts[item.name].count += 1;
      total += item.price;
    });
    
    if (Object.keys(itemCounts).length === 0) {
      cartItemsList.innerHTML = '<p style="color:var(--text-muted);">Your cart is empty. Please add some items to proceed.</p>';
      cartCheckoutForm.classList.remove('visible');
    } else {
      for (const [name, data] of Object.entries(itemCounts)) {
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `<span>${name}</span> <span style="white-space:nowrap;">${data.price} Rs. &times; ${data.count}</span>`;
        cartItemsList.appendChild(row);
      }
      const totalRow = document.createElement('div');
      totalRow.className = 'cart-item-row';
      totalRow.style.marginTop = '1rem';
      totalRow.style.paddingTop = '1rem';
      totalRow.style.borderTop = '1px solid var(--gold)';
      totalRow.style.borderBottom = 'none';
      totalRow.style.fontSize = '1.2rem';
      totalRow.innerHTML = `<strong>Total</strong> <strong>${total} Rs.</strong>`;
      cartItemsList.appendChild(totalRow);

      cartCheckoutForm.classList.add('visible');
    }
  }

  if (openCartModalBtn) openCartModalBtn.addEventListener('click', () => {
    updateCartModalUI();
    cartModal.classList.add('open');
  });
  if (cartModalClose) cartModalClose.addEventListener('click', () => {
    cartModal.classList.remove('open');
  });

  if (cartCheckoutForm) {
    cartCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('customerName').value;
      const phone = document.getElementById('customerPhone').value;
      const address = document.getElementById('customerAddress').value;
      
      const itemCounts = {};
      let total = 0;
      cart.forEach(item => {
        if (!itemCounts[item.name]) itemCounts[item.name] = { count: 0, price: item.price };
        itemCounts[item.name].count += 1;
        total += item.price;
      });
      
      let itemsText = '';
      for (const [name, data] of Object.entries(itemCounts)) {
        itemsText += `\n- ${name} (x${data.count}) = ${data.price * data.count} Rs.`;
      }
      itemsText += `\n\nTotal: ${total} Rs.`;
      
      const message = `Hello Ayuroma, I would like to place an order:\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:${itemsText}`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      // Optionally clear cart after redirect
      // cart = []; updateCartUI(); cartModal.classList.remove('open');
    });
  }

  /* ─── SOURCING MAP INTERACTIVITY ─── */
  const mapPins = document.querySelectorAll('.map-pin');
  const mapTooltip = document.getElementById('mapTooltip');
  
  if (mapPins.length > 0 && mapTooltip) {
    const tooltipTitle = mapTooltip.querySelector('.tooltip-title');
    const tooltipRegion = mapTooltip.querySelector('.tooltip-region');
    const tooltipStory = mapTooltip.querySelector('.tooltip-story');
    
    mapPins.forEach(pin => {
      pin.addEventListener('mouseenter', () => {
        mapPins.forEach(p => p.classList.remove('active'));
        pin.classList.add('active');
        
        tooltipTitle.textContent = pin.getAttribute('data-title');
        tooltipRegion.textContent = pin.getAttribute('data-region');
        tooltipStory.textContent = pin.getAttribute('data-story');
        
        mapTooltip.classList.add('visible');
      });
      
      pin.addEventListener('mouseleave', () => {
        pin.classList.remove('active');
      });
    });
    
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      mapContainer.addEventListener('mouseleave', () => {
        mapTooltip.classList.remove('visible');
        mapPins.forEach(p => p.classList.remove('active'));
      });
    }
  }

  function openCartModal() {
    cartModal.classList.add('open');
    updateCartModalUI();
  }

  if (openCartModalBtn) openCartModalBtn.addEventListener('click', openCartModal);
  if (navCartBtn) navCartBtn.addEventListener('click', openCartModal);

  if (cartModalClose) {
    cartModalClose.addEventListener('click', () => {
      cartModal.classList.remove('open');
    });
  }

  if (cartCheckoutForm) {
    cartCheckoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('customerName').value;
      const phone = document.getElementById('customerPhone').value;
      const address = document.getElementById('customerAddress').value;
      
      const itemCounts = {};
      cart.forEach(item => itemCounts[item] = (itemCounts[item] || 0) + 1);
      
      let orderText = `Hello Ayuroma! I would like to place an order.\n\n*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n*Order Details:*\n`;
      for (const [item, count] of Object.entries(itemCounts)) {
        orderText += `- ${count}x ${item}\n`;
      }
      orderText += "\nPlease let me know the total amount and payment options. Thank you!";
      
      const encodedText = encodeURIComponent(orderText);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
      
      cartModal.classList.remove('open');
      cart = [];
      updateCartUI();
      cartCheckoutForm.reset();
    });
  }

  /* ─── CONTACT FORM TO WHATSAPP ─── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      let text = `Hello! This is a message from ${name} (${email}) via the Ayuroma website:\n\n${message}`;
      const encodedText = encodeURIComponent(text);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
      
      form.reset();
      formSuccess.classList.add('visible');
      setTimeout(() => formSuccess.classList.remove('visible'), 5000);
    });
  }

  /* ─── SMOOTH PARALLAX ON HERO IMAGES ─── */
  const heroImgs = document.querySelectorAll('.hero-product-img');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroImgs.forEach((img, i) => {
      const dir = i === 0 ? 1 : -1;
      img.style.transform = `translateY(${scrolled * 0.04 * dir}px)`;
    });
  }, { passive: true });


  /* ─── ACTIVE NAV LINK ON SCROLL ─── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active-link'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(sec => sectionObserver.observe(sec));

  /* ─── TRANSFORMATION JOURNEY SCROLL ─── */
  const journeySteps = document.querySelectorAll('.journey-step');
  const journeyImgs = document.querySelectorAll('.journey-img');
  
  if (journeySteps.length > 0) {
    const journeyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          journeySteps.forEach(step => step.classList.remove('active'));
          entry.target.classList.add('active');
          
          const stepIndex = entry.target.getAttribute('data-step');
          journeyImgs.forEach(img => img.classList.remove('active'));
          const targetImg = document.getElementById(`journeyImg${stepIndex}`);
          if (targetImg) targetImg.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    
    journeySteps.forEach(step => journeyObserver.observe(step));
  }

});
