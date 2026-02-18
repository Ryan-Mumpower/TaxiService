// ========== Form Validation Functions ==========

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 */
function isValidPhone(phone) {
    const phoneRegex = /^[0-9\-\(\)\s+]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Validate name (at least 3 characters, no numbers)
 */
function isValidName(name) {
    return name.trim().length >= 3 && /^[a-zA-Z\s'-]+$/.test(name);
}

/**
 * Validate date is not in the past
 */
function isValidDate(dateString) {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

/**
 * Clear all error messages
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

/**
 * Display error message for a specific field
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// ========== Booking Form Validation ==========

/**
 * Handle booking form submission
 */
function handleBookingSubmit(event) {
    event.preventDefault();
    
    clearErrors();
    let isValid = true;

    // Get form values
    const service = document.getElementById('service').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const passengers = document.getElementById('passengers').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const terms = document.getElementById('terms').checked;
    const privacy = document.getElementById('privacy').checked;

    // Validate Service Type
    if (!service) {
        showError('service', 'Please select a service type');
        isValid = false;
    }

    // Validate Full Name
    if (!fullName) {
        showError('fullName', 'Full name is required');
        isValid = false;
    } else if (!isValidName(fullName)) {
        showError('fullName', 'Full name must be at least 3 characters and contain only letters');
        isValid = false;
    }

    // Validate Email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Phone
    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number (at least 10 digits)');
        isValid = false;
    }

    // Validate Pickup Location
    if (!pickupLocation) {
        showError('pickupLocation', 'Pickup location is required');
        isValid = false;
    } else if (pickupLocation.trim().length < 3) {
        showError('pickupLocation', 'Pickup location must be at least 3 characters');
        isValid = false;
    }

    // Validate Drop-off Location
    if (!dropoffLocation) {
        showError('dropoffLocation', 'Drop-off location is required');
        isValid = false;
    } else if (dropoffLocation.trim().length < 3) {
        showError('dropoffLocation', 'Drop-off location must be at least 3 characters');
        isValid = false;
    }

    // Validate pickup and drop-off are different
    if (pickupLocation && dropoffLocation && pickupLocation.toLowerCase() === dropoffLocation.toLowerCase()) {
        showError('dropoffLocation', 'Pickup and drop-off locations must be different');
        isValid = false;
    }

    // Validate Date
    if (!date) {
        showError('date', 'Date is required');
        isValid = false;
    } else if (!isValidDate(date)) {
        showError('date', 'Please select a date in the future');
        isValid = false;
    }

    // Validate Time
    if (!time) {
        showError('time', 'Time is required');
        isValid = false;
    }

    // Validate Passengers
    if (!passengers || passengers < 1 || passengers > 8) {
        showError('passengers', 'Please select between 1 and 8 passengers');
        isValid = false;
    }

    // Validate Payment Method
    if (!paymentMethod) {
        showError('paymentMethod', 'Please select a payment method');
        isValid = false;
    }

    // Validate Terms & Conditions
    if (!terms) {
        showError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }

    // Validate Privacy Policy
    if (!privacy) {
        showError('privacy', 'You must agree to the privacy policy');
        isValid = false;
    }

    // If all validations pass
    if (isValid) {
        // Hide form and show success message
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('bookingSuccess').style.display = 'block';
        
        // Generate booking reference number
        const bookingRef = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('bookingRef').textContent = bookingRef;

        // Scroll to top
        window.scrollTo(0, 0);

        // In a real application, you would send this data to a server
        console.log('Booking Data:', {
            service,
            fullName,
            email,
            phone,
            pickupLocation,
            dropoffLocation,
            date,
            time,
            passengers,
            paymentMethod
        });
    }
}

/**
 * Update booking summary and calculate estimated fare
 */
function updateBookingSummary() {
    const service = document.getElementById('service').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const passengers = document.getElementById('passengers').value;

    // Update summary
    const serviceLabel = document.querySelector(`#service [value="${service}"]`)?.textContent || '-';
    document.getElementById('summaryService').textContent = serviceLabel || '-';
    document.getElementById('summaryPickup').textContent = pickupLocation || '-';
    document.getElementById('summaryDropoff').textContent = dropoffLocation || '-';
    
    if (date && time) {
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        document.getElementById('summaryDateTime').textContent = `${dateStr} at ${time}`;
    } else {
        document.getElementById('summaryDateTime').textContent = '-';
    }
    
    document.getElementById('summaryPassengers').textContent = passengers || '-';

    // Calculate estimated fare
    updateEstimatedFare(service);
}

/**
 * Update estimated fare based on service type
 */
function updateEstimatedFare(service) {
    const baseFares = {
        economy: 10,
        comfort: 15,
        xl: 25,
        premium: 40,
        delivery: 8
    };

    const baseFare = baseFares[service] || 0;
    
    if (baseFare > 0) {
        // Estimate: base fare + ~$2 per km (assuming average distance of 5km)
        const distanceCharge = 10; // Example: 5km * $2
        const totalEstimate = baseFare + distanceCharge;

        document.getElementById('baseFare').textContent = '$' + baseFare;
        document.getElementById('estimatedTotal').textContent = '$' + totalEstimate;
        document.getElementById('summaryTotal').textContent = '$' + totalEstimate;
        document.getElementById('priceEstimate').style.display = 'block';
    } else {
        document.getElementById('priceEstimate').style.display = 'none';
    }
}

/**
 * Handle service type change
 */
function updateServiceInfo() {
    updateBookingSummary();
}

// ========== Contact Form Validation ==========

/**
 * Handle contact form submission
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    clearErrors();
    let isValid = true;

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate Name
    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    } else if (!isValidName(name)) {
        showError('name', 'Please enter a valid name');
        isValid = false;
    }

    // Validate Email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate Phone
    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate Subject
    if (!subject) {
        showError('subject', 'Please select a subject');
        isValid = false;
    }

    // Validate Message
    if (!message) {
        showError('message', 'Message is required');
        isValid = false;
    } else if (message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }

    if (isValid) {
        // Show success message
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
        
        // Reset form after 3 seconds
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            document.getElementById('contactForm').style.display = 'block';
            document.getElementById('contactSuccess').style.display = 'none';
        }, 3000);

        console.log('Contact Data:', {
            name,
            email,
            phone,
            subject,
            message
        });
    }
}

// ========== Event Listeners ==========

/**
 * Initialize event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Booking form listeners
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Real-time summary updates
        document.getElementById('service').addEventListener('change', updateBookingSummary);
        document.getElementById('pickupLocation').addEventListener('input', updateBookingSummary);
        document.getElementById('dropoffLocation').addEventListener('input', updateBookingSummary);
        document.getElementById('date').addEventListener('change', updateBookingSummary);
        document.getElementById('time').addEventListener('change', updateBookingSummary);
        document.getElementById('passengers').addEventListener('change', updateBookingSummary);
    }

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // Check if there's a service parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && document.getElementById('service')) {
        document.getElementById('service').value = serviceParam;
        updateBookingSummary();
    }

    // Set current time as default
    const timeInput = document.getElementById('time');
    if (timeInput) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
});

// ========== Utility Functions ==========

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Log form data for debugging
 */
function logFormData(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const formData = new FormData(form);
        console.log('Form Data:', Object.fromEntries(formData));
    }
}

/**
 * Reset form with visual feedback
 */
function resetFormWithFeedback(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        clearErrors();
        updateBookingSummary?.();
    }
}
