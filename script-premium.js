/* ============================
   AYUROMA – Interactive JS
   ============================ */

document.addEventListener('DOMContentLoaded', () => {



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
        btn.innerHTML = `<span class="qty-minus" style="flex:1; display:flex; justify-content:center; align-items:center; padding:0.6rem 0; cursor:pointer; font-size:1.5rem; font-weight:bold; line-height:1; user-select:none;">−</span> <span style="font-weight:bold; user-select:none; font-size:1.2rem; min-width:40px; text-align:center; display:flex; justify-content:center; align-items:center;">${count}</span> <span class="qty-plus" style="flex:1; display:flex; justify-content:center; align-items:center; padding:0.6rem 0; cursor:pointer; font-size:1.5rem; font-weight:bold; line-height:1; user-select:none;">+</span>`;
        btn.style.background = 'var(--green)';
        btn.style.borderColor = 'var(--green)';
        btn.style.display = 'flex';
        btn.style.justifyContent = 'center';
        btn.style.alignItems = 'stretch';
        btn.style.padding = '0'; // thinner padding for flex items
        btn.classList.add('is-qty-mode');
      } else {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.display = 'inline-block';
        btn.style.padding = '0.8rem 2rem';
        btn.classList.remove('is-qty-mode');
      }
    });
  }

  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-card__name').textContent;
      const taglineEl = card.querySelector('.product-card__tagline');
      const fullName = taglineEl ? `${name} - ${taglineEl.textContent}` : name;
      const priceText = card.querySelector('.price-current').textContent;
      const priceNum = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

      // If button is in quantity selector mode
      if (btn.classList.contains('is-qty-mode')) {
        if (e.target.classList.contains('qty-minus')) {
          const idx = cart.findIndex(item => item.name === fullName);
          if (idx > -1) {
            cart.splice(idx, 1);
            updateCartUI();
            if (cartModal.classList.contains('open')) updateCartModalUI();
          }
        } else if (e.target.classList.contains('qty-plus')) {
          cart.push({ name: fullName, price: priceNum, shortName: name });
          updateCartUI();
          if (cartModal.classList.contains('open')) updateCartModalUI();
        }
        // If they click the background or the number, do nothing
        return;
      }

      // Normal Add to Cart (only if it wasn't plus or minus)
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
      
      cart.push({ name: fullName, price: priceNum, shortName: name });
      updateCartUI();
      if (cartModal.classList.contains('open')) updateCartModalUI();
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
      const deliveryRow = document.createElement('div');
      deliveryRow.className = 'cart-item-row';
      deliveryRow.style.marginTop = '0.5rem';
      deliveryRow.style.paddingTop = '0.5rem';
      deliveryRow.style.borderTop = '1px dashed var(--gold)';
      deliveryRow.style.fontSize = '0.95rem';
      deliveryRow.innerHTML = `<span>Delivery Charge</span> <span style="white-space:nowrap;">50 Rs.</span>`;
      cartItemsList.appendChild(deliveryRow);

      const totalRow = document.createElement('div');
      totalRow.className = 'cart-item-row';
      totalRow.style.marginTop = '0.5rem';
      totalRow.style.paddingTop = '0.5rem';
      totalRow.style.borderTop = '1px solid var(--gold)';
      totalRow.style.borderBottom = 'none';
      totalRow.style.fontSize = '1.2rem';
      totalRow.innerHTML = `<strong>Total</strong> <strong>${total + 50} Rs.</strong>`;
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
      itemsText += `\n\nDelivery Charge: 50 Rs.`;
      itemsText += `\nTotal: ${total + 50} Rs.`;
      
      const message = `Hello Ayuroma, I would like to place an order:\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:${itemsText}`;
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
      
      // Clear cart after redirect
      cart = [];
      updateCartUI();
      cartModal.classList.remove('open');
      cartCheckoutForm.reset();
    });
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

  /* ─── GOOGLE-SIGNED-IN REVIEWS & PROFILE (SUPABASE) ─── */
  const reviewConfig = window.AYUROMA_REVIEWS_CONFIG;
  const reviewsList = document.getElementById('reviewsList');
  const reviewsCount = document.getElementById('reviewsCount');
  const reviewsAccountCopy = document.getElementById('reviewsAccountCopy');
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const reviewSignOutBtn = document.getElementById('reviewSignOutBtn');
  const reviewViewProfileBtn = document.getElementById('reviewViewProfileBtn');
  const reviewForm = document.getElementById('reviewForm');
  const reviewSignedInAs = document.getElementById('reviewSignedInAs');
  const reviewFeedback = document.getElementById('reviewFeedback');
  const reviewSubmitBtn = document.getElementById('reviewSubmitBtn');
  const reviewRatingInput = document.getElementById('reviewRating');
  const ratingSelectedText = document.getElementById('ratingSelectedText');
  const starPickBtns = document.querySelectorAll('.star-pick-btn');

  // Profile Modal Elements
  const navProfileBtn = document.getElementById('navProfileBtn');
  const navProfileAvatar = document.getElementById('navProfileAvatar');
  const navProfileText = document.getElementById('navProfileText');
  const profileModal = document.getElementById('profileModal');
  const profileModalClose = document.getElementById('profileModalClose');
  const profileGuestView = document.getElementById('profileGuestView');
  const profileUserView = document.getElementById('profileUserView');
  const modalGoogleSignInBtn = document.getElementById('modalGoogleSignInBtn');
  const modalSignOutBtn = document.getElementById('modalSignOutBtn');
  const profileUserAvatarImg = document.getElementById('profileUserAvatarImg');
  const profileUserAvatarFallback = document.getElementById('profileUserAvatarFallback');
  const profileUserName = document.getElementById('profileUserName');
  const profileUserEmail = document.getElementById('profileUserEmail');
  const profileUserReviewsCount = document.getElementById('profileUserReviewsCount');
  const profileUserRatingAvg = document.getElementById('profileUserRatingAvg');
  const profileMyReviewsList = document.getElementById('profileMyReviewsList');

  // Stats elements
  const ratingAverageScore = document.getElementById('ratingAverageScore');
  const ratingHeroStars = document.getElementById('ratingHeroStars');
  const ratingTotalReviews = document.getElementById('ratingTotalReviews');

  let reviewUser = null;
  let reviewsClient = null;
  let allReviewsData = [];

  const reviewsAreConfigured = Boolean(
    reviewConfig && reviewConfig.supabaseUrl && reviewConfig.supabaseAnonKey && window.supabase
  );
  const isReviewModerator = () => reviewUser &&
    reviewUser.email && reviewUser.email.toLowerCase() === (reviewConfig?.adminEmail || '').toLowerCase();

  function setReviewFeedback(message, isError = false) {
    if (!reviewFeedback) return;
    reviewFeedback.textContent = message;
    reviewFeedback.classList.toggle('is-error', isError);
  }

  function formatReviewDate(value) {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(value));
  }

  /* ── Interactive Star Rating Picker ── */
  const ratingLabels = {
    1: '1 / 5 — Needs Improvement',
    2: '2 / 5 — Fair',
    3: '3 / 5 — Good',
    4: '4 / 5 — Very Good',
    5: '5 / 5 — Excellent'
  };

  function updateStarRatingUI(value) {
    if (reviewRatingInput) reviewRatingInput.value = value;
    if (ratingSelectedText) ratingSelectedText.textContent = ratingLabels[value] || `${value} / 5`;
    starPickBtns.forEach(btn => {
      const btnVal = Number(btn.getAttribute('data-val'));
      btn.classList.toggle('active', btnVal <= value);
    });
  }

  starPickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number(btn.getAttribute('data-val'));
      updateStarRatingUI(val);
    });
    btn.addEventListener('mouseenter', () => {
      const hoverVal = Number(btn.getAttribute('data-val'));
      starPickBtns.forEach(b => {
        const bVal = Number(b.getAttribute('data-val'));
        b.classList.toggle('active', bVal <= hoverVal);
      });
      if (ratingSelectedText) ratingSelectedText.textContent = ratingLabels[hoverVal] || `${hoverVal} / 5`;
    });
  });

  const starRatingPickerEl = document.getElementById('starRatingPicker');
  if (starRatingPickerEl) {
    starRatingPickerEl.addEventListener('mouseleave', () => {
      const cur = Number(reviewRatingInput?.value || 5);
      updateStarRatingUI(cur);
    });
  }

  /* ── Review Card Builder ── */
  function makeReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card';

    const top = document.createElement('div');
    top.className = 'review-card-top';

    const userMeta = document.createElement('div');
    userMeta.className = 'review-user-meta';

    // Avatar
    const initial = (review.reviewer_name || 'A').trim().charAt(0).toUpperCase();
    const avatarEl = document.createElement('div');
    avatarEl.className = 'reviewer-avatar-placeholder';
    avatarEl.textContent = initial;

    const details = document.createElement('div');
    details.className = 'reviewer-details';

    const nameRow = document.createElement('div');
    nameRow.className = 'reviewer-name-row';

    const name = document.createElement('strong');
    name.className = 'reviewer-name';
    name.textContent = review.reviewer_name;

    const verified = document.createElement('span');
    verified.className = 'verified-buyer-tag';
    verified.textContent = 'Verified Ritual';

    nameRow.append(name, verified);

    const date = document.createElement('time');
    date.className = 'review-date';
    date.dateTime = review.created_at;
    date.textContent = formatReviewDate(review.created_at);

    details.append(nameRow, date);
    userMeta.append(avatarEl, details);

    const stars = document.createElement('span');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
    stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;

    top.append(userMeta, stars);
    card.append(top);

    const body = document.createElement('p');
    body.textContent = review.body;
    card.append(body);

    const footer = document.createElement('div');
    footer.className = 'review-card-footer';

    // Helpful button
    const helpfulBtn = document.createElement('button');
    helpfulBtn.type = 'button';
    helpfulBtn.className = 'review-helpful-btn';
    let helpfulCount = Math.floor(Math.random() * 4) + 1;
    helpfulBtn.innerHTML = `🌿 Helpful (${helpfulCount})`;
    helpfulBtn.addEventListener('click', () => {
      helpfulCount++;
      helpfulBtn.innerHTML = `🌿 Helpful (${helpfulCount})`;
      helpfulBtn.style.color = 'var(--green)';
      helpfulBtn.disabled = true;
    }, { once: true });
    footer.append(helpfulBtn);

    if (isReviewModerator()) {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'review-delete';
      deleteButton.textContent = 'Delete review';
      deleteButton.addEventListener('click', () => deleteReview(review.id));
      footer.append(deleteButton);
    }

    card.append(footer);
    return card;
  }

  /* ── Aggregate Review Breakdown ── */
  function updateReviewsBreakdown(reviews) {
    const total = reviews.length;
    if (total === 0) {
      if (ratingAverageScore) ratingAverageScore.textContent = '5.0';
      if (ratingHeroStars) ratingHeroStars.textContent = '★★★★★';
      if (ratingTotalReviews) ratingTotalReviews.textContent = 'No reviews yet';
      for (let s = 1; s <= 5; s++) {
        const countEl = document.getElementById(`countStar${s}`);
        if (countEl) countEl.textContent = '0';
        const row = document.querySelector(`.rating-bar-row[data-star="${s}"] .bar-fill`);
        if (row) row.style.width = '0%';
      }
      return;
    }

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, r.rating || 5));
      counts[star] = (counts[star] || 0) + 1;
      sum += star;
    });

    const avg = (sum / total).toFixed(1);
    if (ratingAverageScore) ratingAverageScore.textContent = avg;
    if (ratingHeroStars) {
      const roundedAvg = Math.round(Number(avg));
      ratingHeroStars.textContent = `${'★'.repeat(roundedAvg)}${'☆'.repeat(5 - roundedAvg)}`;
    }
    if (ratingTotalReviews) {
      ratingTotalReviews.textContent = `Based on ${total} verified ${total === 1 ? 'review' : 'reviews'}`;
    }

    for (let s = 1; s <= 5; s++) {
      const countEl = document.getElementById(`countStar${s}`);
      if (countEl) countEl.textContent = counts[s];
      const row = document.querySelector(`.rating-bar-row[data-star="${s}"] .bar-fill`);
      if (row) {
        const pct = Math.round((counts[s] / total) * 100);
        row.style.width = `${pct}%`;
      }
    }
  }

  async function loadReviews() {
    if (!reviewsClient || !reviewsList) return;
    reviewsCount.textContent = 'Loading reviews…';
    const { data, error } = await reviewsClient
      .from('reviews')
      .select('id, user_id, reviewer_name, rating, body, created_at')
      .order('created_at', { ascending: false });

    reviewsList.replaceChildren();
    if (error) {
      reviewsCount.textContent = 'Reviews are temporarily unavailable.';
      console.error('Could not load reviews:', error.message);
      return;
    }

    allReviewsData = data || [];
    reviewsCount.textContent = `${data.length} community ${data.length === 1 ? 'review' : 'reviews'}`;
    updateReviewsBreakdown(allReviewsData);
    updateProfileUserView();

    if (!data.length) {
      const empty = document.createElement('p');
      empty.className = 'reviews-empty';
      empty.textContent = 'Be the first to share your Ayuroma experience.';
      reviewsList.append(empty);
      return;
    }
    data.forEach(review => reviewsList.append(makeReviewCard(review)));
  }

  /* ── User Profile & Modal Handling ── */
  function openProfileModal() {
    if (profileModal) profileModal.classList.add('open');
    updateProfileUserView();
  }

  function closeProfileModal() {
    if (profileModal) profileModal.classList.remove('open');
  }

  if (navProfileBtn) navProfileBtn.addEventListener('click', openProfileModal);
  if (reviewViewProfileBtn) reviewViewProfileBtn.addEventListener('click', openProfileModal);
  if (profileModalClose) profileModalClose.addEventListener('click', closeProfileModal);
  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) closeProfileModal();
    });
  }

  function renderReviewAccount() {
    if (!reviewsAreConfigured) return;
    const signedIn = Boolean(reviewUser);
    googleSignInBtn.hidden = signedIn;
    reviewSignOutBtn.hidden = !signedIn;
    if (reviewViewProfileBtn) reviewViewProfileBtn.hidden = !signedIn;
    reviewForm.hidden = !signedIn;

    // Update navbar profile button
    if (navProfileText) {
      navProfileText.textContent = signedIn ? (reviewUser.user_metadata?.full_name?.split(' ')[0] || 'Profile') : 'Sign In';
    }
    if (navProfileAvatar) {
      const photo = reviewUser?.user_metadata?.avatar_url || reviewUser?.user_metadata?.picture;
      if (signedIn && photo) {
        navProfileAvatar.innerHTML = `<img src="${photo}" alt="Avatar" />`;
      } else if (signedIn) {
        const initial = (reviewUser.user_metadata?.full_name || reviewUser.email || 'U')[0].toUpperCase();
        navProfileAvatar.textContent = initial;
      } else {
        navProfileAvatar.textContent = '👤';
      }
    }

    if (!signedIn) {
      reviewsAccountCopy.textContent = 'Please sign in with Google to post your review.';
      reviewSignedInAs.textContent = '';
      if (profileGuestView) profileGuestView.hidden = false;
      if (profileUserView) profileUserView.hidden = true;
      return;
    }

    if (profileGuestView) profileGuestView.hidden = true;
    if (profileUserView) profileUserView.hidden = false;

    const reviewerName = reviewUser.user_metadata?.full_name || reviewUser.user_metadata?.name || reviewUser.email;
    reviewsAccountCopy.textContent = isReviewModerator()
      ? 'You are signed in as the review moderator.'
      : 'You are signed in and can share your experience.';
    reviewSignedInAs.textContent = `Posting as ${reviewerName}`;

    updateProfileUserView();
  }

  function updateProfileUserView() {
    if (!reviewUser || !profileUserView) return;
    const meta = reviewUser.user_metadata || {};
    const name = meta.full_name || meta.name || reviewUser.email.split('@')[0];
    const email = reviewUser.email;
    const avatar = meta.avatar_url || meta.picture;

    if (profileUserName) profileUserName.textContent = name;
    if (profileUserEmail) profileUserEmail.textContent = email;

    if (avatar && profileUserAvatarImg && profileUserAvatarFallback) {
      profileUserAvatarImg.src = avatar;
      profileUserAvatarImg.style.display = 'block';
      profileUserAvatarFallback.style.display = 'none';
    } else if (profileUserAvatarFallback) {
      profileUserAvatarFallback.textContent = (name || 'A')[0].toUpperCase();
      profileUserAvatarFallback.style.display = 'flex';
      if (profileUserAvatarImg) profileUserAvatarImg.style.display = 'none';
    }

    // Filter reviews belonging to this user
    const myReviews = allReviewsData.filter(r => r.user_id === reviewUser.id || (r.reviewer_name && r.reviewer_name === name));
    if (profileUserReviewsCount) profileUserReviewsCount.textContent = myReviews.length;

    if (myReviews.length > 0) {
      const avg = (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1);
      if (profileUserRatingAvg) profileUserRatingAvg.textContent = `${avg} ★`;
    } else {
      if (profileUserRatingAvg) profileUserRatingAvg.textContent = '—';
    }

    if (profileMyReviewsList) {
      profileMyReviewsList.replaceChildren();
      if (!myReviews.length) {
        profileMyReviewsList.innerHTML = '<p class="profile-empty-reviews">You haven\'t written any reviews yet. Scroll to our reviews section to share your thoughts!</p>';
      } else {
        myReviews.forEach(r => {
          const div = document.createElement('div');
          div.className = 'profile-my-review-card';
          div.innerHTML = `
            <div class="profile-my-review-top">
              <span style="color:#f59e0b; font-weight:bold;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              <span style="color:var(--text-muted);">${formatReviewDate(r.created_at)}</span>
            </div>
            <p style="margin:0; color:var(--text-main); font-size:0.86rem; line-height:1.5;">${r.body}</p>
          `;
          profileMyReviewsList.appendChild(div);
        });
      }
    }
  }

  async function deleteReview(id) {
    if (!isReviewModerator() || !window.confirm('Delete this review permanently?')) return;
    const { error } = await reviewsClient.from('reviews').delete().eq('id', id);
    if (error) {
      setReviewFeedback('This review could not be deleted. Please try again.', true);
      console.error('Could not delete review:', error.message);
      return;
    }
    setReviewFeedback('Review deleted.');
    loadReviews();
  }

  if (reviewsAreConfigured) {
    reviewsClient = window.supabase.createClient(reviewConfig.supabaseUrl, reviewConfig.supabaseAnonKey);

    function scrollToReviewsAfterSignIn() {
      if (window.sessionStorage.getItem('ayuromaReturnToReviews') !== 'true') return;
      window.sessionStorage.removeItem('ayuromaReturnToReviews');
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const startOAuthSignIn = async () => {
      window.sessionStorage.setItem('ayuromaReturnToReviews', 'true');
      const { error } = await reviewsClient.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${window.location.pathname}` }
      });
      if (error) setReviewFeedback('Google sign-in could not start. Please try again.', true);
    };

    googleSignInBtn.addEventListener('click', startOAuthSignIn);
    if (modalGoogleSignInBtn) modalGoogleSignInBtn.addEventListener('click', startOAuthSignIn);

    const performSignOut = async () => {
      await reviewsClient.auth.signOut();
      reviewUser = null;
      renderReviewAccount();
      setReviewFeedback('You have been signed out.');
      closeProfileModal();
    };

    reviewSignOutBtn.addEventListener('click', performSignOut);
    if (modalSignOutBtn) modalSignOutBtn.addEventListener('click', performSignOut);

    reviewForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!reviewUser) return;
      const body = document.getElementById('reviewBody').value.trim();
      const rating = Number(reviewRatingInput ? reviewRatingInput.value : 5);
      const reviewerName = reviewUser.user_metadata?.full_name || reviewUser.user_metadata?.name || reviewUser.email.split('@')[0];
      if (body.length < 3) {
        setReviewFeedback('Please write at least 3 characters.', true);
        return;
      }
      reviewSubmitBtn.disabled = true;
      reviewSubmitBtn.textContent = 'Posting…';
      const { error } = await reviewsClient.from('reviews').insert({
        reviewer_name: reviewerName.slice(0, 100), rating, body
      });
      reviewSubmitBtn.disabled = false;
      reviewSubmitBtn.textContent = 'Post Your Review ✦';
      if (error) {
        setReviewFeedback('Your review could not be posted. Please try again.', true);
        console.error('Could not post review:', error.message);
        return;
      }
      reviewForm.reset();
      updateStarRatingUI(5);
      setReviewFeedback('Thank you—your review is now live.');
      loadReviews();
    });

    reviewsClient.auth.getSession().then(({ data: { session } }) => {
      reviewUser = session?.user || null;
      renderReviewAccount();
      loadReviews();
      if (reviewUser) scrollToReviewsAfterSignIn();
    });
    reviewsClient.auth.onAuthStateChange((_event, session) => {
      reviewUser = session?.user || null;
      renderReviewAccount();
      loadReviews();
      if (reviewUser) scrollToReviewsAfterSignIn();
    });
  } else if (reviewsAccountCopy && reviewsCount) {
    reviewsAccountCopy.textContent = 'Reviews will be available shortly.';
    reviewsCount.textContent = 'Reviews are being set up.';
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
