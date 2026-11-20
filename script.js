document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const revealLines = document.querySelectorAll('.reveal-line');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hide');
            setTimeout(() => {
                revealLines.forEach((line, index) => {
                    setTimeout(() => line.classList.add('active'), index * 180);
                });
                document.querySelectorAll('.reveal-fade').forEach((element) => element.classList.add('active'));
            }, 350);
        }, 850);
    });

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.14;
        outlineY += (mouseY - outlineY) * 0.14;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const revealTargets = document.querySelectorAll('.section-header, .cake-card, .craft-image, .craft-content');
    revealTargets.forEach((target) => target.classList.add('scroll-reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealTargets.forEach((target, index) => {
        target.style.transitionDelay = `${(index % 3) * 90}ms`;
        revealObserver.observe(target);
    });

    const magneticBtn = document.querySelector('.magnetic-btn');
    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (event) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            magneticBtn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        magneticBtn.addEventListener('mouseleave', () => {
            magneticBtn.style.transform = 'translate(0, 0)';
        });
    }

    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total-price');
    const toastEl = document.getElementById('toast');
    let cart = [];

    function showToast(message) {
        toastEl.textContent = message;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2300);
    }

    function toggleCart(open) {
        cartDrawer.classList.toggle('active', open);
        cartOverlay.classList.toggle('active', open);
    }

    openCartBtn.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));

    function updateCartUI() {
        cartCountEl.textContent = cart.length;
        document.getElementById('admin-cart-count').textContent = cart.length;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-msg">ยังไม่มีรายการขนมในตะกร้า</p>';
            cartTotalEl.textContent = '฿0';
            document.getElementById('admin-cart-total').textContent = '฿0';
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            total += item.price;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div>
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">฿${item.price.toLocaleString()}</div>
                </div>
                <button class="remove-item" data-index="${index}">ลบ</button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        cartTotalEl.textContent = `฿${total.toLocaleString()}`;
        document.getElementById('admin-cart-total').textContent = `฿${total.toLocaleString()}`;

        document.querySelectorAll('.remove-item').forEach((button) => {
            button.addEventListener('click', () => {
                cart.splice(Number(button.dataset.index), 1);
                updateCartUI();
            });
        });
    }

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('กรุณาเลือกขนมเค้กก่อนสั่งซื้อ');
            return;
        }
        alert('ขอบคุณสำหรับการสั่งซื้อ! ทีมงานกำลังเตรียมจัดส่งความอร่อยให้คุณ');
        cart = [];
        updateCartUI();
        toggleCart(false);
    });

    const defaultProducts = [
        {
            name: 'Noir et Fraise',
            price: 1450,
            description: 'สปันจ์วานิลลามาดากัสการ์ สลับชั้นครีมสดฮอกไกโดและสตรอว์เบอร์รีออร์แกนิก',
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'L’Or Salted Caramel',
            price: 1690,
            description: 'มูสช็อกโกแลต 70% สอดไส้ซอลท์เท็ดคาราเมลโฮมเมด ตกแต่งทองคำเปลวบริสุทธิ์',
            image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80'
        },
        {
            name: 'Uji Matcha Opera',
            price: 1550,
            description: 'เค้กโอเปร่า 7 เลเยอร์ ผสานมัทฉะเกรดพิธีการจากเมืองอุจิและอัลมอนด์อบกรอบ',
            image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80'
        }
    ];

    let products = JSON.parse(localStorage.getItem('latelier-products') || 'null') || defaultProducts;

    function bindHoverCursor() {
        document.querySelectorAll('a, button, .cake-card').forEach((target) => {
            target.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
            target.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
        });
    }

    function renderProducts() {
        const grid = document.getElementById('cake-grid');
        grid.innerHTML = '';
        products.forEach((product) => {
            const card = document.createElement('article');
            card.className = 'cake-card tilt-card';
            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="quick-add hover-target" data-name="${product.name}" data-price="${product.price}">
                        + เพิ่มลงตะกร้า
                    </button>
                </div>
                <div class="card-info">
                    <div class="card-meta">
                        <h3>${product.name}</h3>
                        <span class="price">฿${Number(product.price).toLocaleString()}</span>
                    </div>
                    <p>${product.description}</p>
                </div>
            `;
            grid.appendChild(card);

            card.addEventListener('mousemove', (event) => {
                if (window.innerWidth <= 900) return;
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;
                card.style.transform = `perspective(1000px) rotateX(${(y / rect.height) * -4}deg) rotateY(${(x / rect.width) * 4}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            });
        });

        document.querySelectorAll('.quick-add').forEach((button) => {
            button.addEventListener('click', () => {
                cart.push({
                    name: button.dataset.name,
                    price: Number(button.dataset.price)
                });
                updateCartUI();
                showToast(`เพิ่ม "${button.dataset.name}" ลงในตะกร้าแล้ว`);
            });
        });
        document.getElementById('admin-product-count').textContent = products.length;
        bindHoverCursor();
    }

    function renderAdminProducts() {
        const container = document.getElementById('admin-products');
        container.innerHTML = '';
        products.forEach((product, index) => {
            const item = document.createElement('article');
            item.className = 'admin-product';
            item.innerHTML = `
                <img src="${product.image}" alt="">
                <div>
                    <div class="admin-product-name">${product.name}</div>
                    <div class="admin-product-price">฿${Number(product.price).toLocaleString()}</div>
                </div>
                <div class="admin-product-actions">
                    <button type="button" data-edit="${index}">แก้ไข</button>
                    <button type="button" data-delete="${index}">ลบ</button>
                </div>
            `;
            container.appendChild(item);
        });

        container.querySelectorAll('[data-edit]').forEach((button) => {
            button.addEventListener('click', () => openEditor(Number(button.dataset.edit)));
        });
        container.querySelectorAll('[data-delete]').forEach((button) => {
            button.addEventListener('click', () => {
                if (!confirm(`ลบสินค้า "${products[Number(button.dataset.delete)].name}" หรือไม่?`)) return;
                products.splice(Number(button.dataset.delete), 1);
                saveProducts();
            });
        });
    }

    function saveProducts() {
        localStorage.setItem('latelier-products', JSON.stringify(products));
        renderProducts();
        renderAdminProducts();
        showToast('บันทึกข้อมูลเรียบร้อยแล้ว');
    }

    const adminPanel = document.getElementById('admin-panel');
    const adminOverlay = document.getElementById('admin-overlay');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');

    function toggleAdmin(open) {
        adminPanel.classList.toggle('active', open);
        adminOverlay.classList.toggle('active', open);
    }

    document.getElementById('open-admin').addEventListener('click', () => toggleAdmin(true));
    document.getElementById('close-admin').addEventListener('click', () => toggleAdmin(false));
    adminOverlay.addEventListener('click', () => toggleAdmin(false));

    document.getElementById('toggle-password').addEventListener('click', (event) => {
        const password = document.getElementById('admin-password');
        const show = password.type === 'password';
        password.type = show ? 'text' : 'password';
        event.target.textContent = show ? 'ซ่อน' : 'แสดง';
    });

    async function passwordHash(value) {
        const bytes = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    document.getElementById('admin-login-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = document.getElementById('admin-password').value;
        const hash = await passwordHash(password);
        if (hash === 'a814b306936219bfd001b13dba4bb69b2adbc4a2cbe6e7b94b9596b68b297668') {
            adminLogin.classList.add('hidden');
            adminDashboard.classList.add('visible');
            document.getElementById('admin-password').value = '';
            document.getElementById('login-error').classList.remove('visible');
            renderAdminProducts();
        } else {
            document.getElementById('login-error').classList.add('visible');
        }
    });

    document.getElementById('admin-logout').addEventListener('click', () => {
        adminDashboard.classList.remove('visible');
        adminLogin.classList.remove('hidden');
    });

    const editor = document.getElementById('product-editor');
    function openEditor(index = -1) {
        document.getElementById('edit-index').value = index;
        document.getElementById('editor-title').textContent = index >= 0 ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่';
        if (index >= 0) {
            const product = products[index];
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description;
            document.getElementById('product-image').value = product.image;
        } else {
            document.getElementById('product-name').value = '';
            document.getElementById('product-price').value = '';
            document.getElementById('product-description').value = '';
            document.getElementById('product-image').value = '';
        }
        editor.classList.add('visible');
        editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    document.getElementById('add-product').addEventListener('click', () => openEditor());
    document.getElementById('cancel-edit').addEventListener('click', () => editor.classList.remove('visible'));
    document.getElementById('product-editor').addEventListener('submit', (event) => {
        event.preventDefault();
        const index = Number(document.getElementById('edit-index').value);
        const product = {
            name: document.getElementById('product-name').value.trim(),
            price: Number(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value.trim(),
            image: document.getElementById('product-image').value.trim()
        };
        if (index >= 0) products[index] = product;
        else products.push(product);
        editor.classList.remove('visible');
        saveProducts();
    });

    renderProducts();
    updateCartUI();
    bindHoverCursor();
});
