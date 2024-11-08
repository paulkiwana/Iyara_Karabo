document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const galleryGrid = document.querySelector('.gallery-grid');
    const modal = document.getElementById('payment-modal');
    const closeModal = document.querySelector('.close');
    const stripe = Stripe('your_stripe_publishable_key');
    const elements = stripe.elements();

    // Toggle mobile menu
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Sample gallery items
    const galleryItems = [
        { id: 1, title: 'Charcoal Drawing', price: 500, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/CharcoalArt.jpg' },
        { id: 2, title: 'NAAWA', price: 750, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/NAAWA.jpg' },
        { id: 3, title: 'CHILD OF GOD', price: 600, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/childofgod.jpg' },
        { id: 4, title: 'CHILDREN OF GOD', price: 900, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/childrenofgod.jpg' },
        { id: 5, title: 'PURPLE MEADOW', price: 1200, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/PURPLEMEADOW.jpg' },
        { id: 6, title: 'OF THE DEEP', price: 800, image: 'https://raw.githubusercontent.com/paulkiwana/My-gallery/refs/heads/main/ofthedeep.jpg' },
    ];

    // Render gallery items
    galleryItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${item.title}</h3>
                <p class="gallery-item-price">$${item.price}</p>
                <button class="buy-button" data-id="${item.id}">Buy Now</button>
            </div>
        `;
        galleryGrid.appendChild(galleryItem);
    });

    // Handle buy button clicks
    galleryGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('buy-button')) {
            const itemId = e.target.getAttribute('data-id');
            const selectedItem = galleryItems.find(item => item.id === parseInt(itemId));
            openPaymentModal(selectedItem);
        }
    });

    // Open payment modal
    function openPaymentModal(item) {
        modal.style.display = 'block';
        const paymentForm = document.getElementById('payment-form');
        paymentForm.innerHTML = `
            <h3>${item.title}</h3>
            <p>Price: $${item.price}</p>
            <div id="card-element"></div>
            <button id="submit-payment">Pay $${item.price}</button>
        `;

        const cardElement = elements.create('card');
        cardElement.mount('#card-element');

        const submitButton = document.getElementById('submit-payment');
        submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            submitButton.disabled = true;
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                console.error(error);
                submitButton.disabled = false;
            } else {
                // Send paymentMethod.id to your server for processing
                console.log('Payment successful:', paymentMethod);
                alert('Payment successful! Thank you for your purchase.');
                modal.style.display = 'none';
            }
        });
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        // Here you would typically send the form data to a server
        console.log('Form submitted:', Object.fromEntries(formData));
        alert('Thank you for your message. We will get back to you soon!');
        contactForm.reset();
    });
});
