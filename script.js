
// ======================================
// WALLETFLEX WEBSITE JAVASCRIPT
// ======================================

// Get HTML elements
const amountInput = document.getElementById("amount");
const periodInput = document.getElementById("period");
const loanForm = document.getElementById("loanForm");

const amountValue = document.getElementById("amountValue");
const principalElement = document.getElementById("principal");
const feeElement = document.getElementById("fee");
const totalElement = document.getElementById("total");

const modal = document.getElementById("confirmationModal");
const historyList = document.getElementById("historyList");
const toast = document.getElementById("toast");

// Demo calculation rate
const SERVICE_FEE_RATE = 0.10;

// Format currency
function formatCurrency(amount) {
    return "UGX " + Number(amount).toLocaleString("en-US");
}

// ======================================
// LOAN CALCULATOR
// ======================================

function calculateLoan() {

    const amount = Number(amountInput.value);

    // Illustrative flat demonstration fee
    const fee = amount * SERVICE_FEE_RATE;

    const total = amount + fee;

    amountValue.textContent =
        amount.toLocaleString("en-US");

    principalElement.textContent =
        formatCurrency(amount);

    feeElement.textContent =
        formatCurrency(fee);

    totalElement.textContent =
        formatCurrency(total);
}

// Update calculator when amount changes
amountInput.addEventListener("input", calculateLoan);

// Update calculator when period changes
periodInput.addEventListener("change", calculateLoan);

// Initial calculation
calculateLoan();

// ======================================
// LOCAL STORAGE
// ======================================

function getApplications() {

    try {
        const saved = localStorage.getItem("MTN MOMO LOANS Applications");

        return saved ? JSON.parse(saved) : [];

    } catch (error) {

        console.error("Could not read application history:", error);

        return [];
    }
}

function saveApplications(applications) {

    try {

        localStorage.setItem(
            "MTN MOMO LOANS Applications",
            JSON.stringify(applications)
        );

        return true;

    } catch (error) {

        console.error("Could not save applications:", error);

        showToast("Unable to save. Check browser storage.");

        return false;
    }
}

// ======================================
// SUBMIT APPLICATION
// ======================================

loanForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Check browser form validation
    if (!loanForm.reportValidity()) {
        return;
    }

    const fullName =
        document.getElementById("fullName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const amount =
        Number(amountInput.value);

    const period =
        Number(periodInput.value);

    const fee =
        amount * SERVICE_FEE_RATE;

    const total =
        amount + fee;

    // Create demonstration application
    const application = {

        id: "WF-" + Date.now(),

        name: fullName,

        phone: phone,

        amount: amount,

        period: period,

        fee: fee,

        total: total,

        status: "Pending  Review",

        date: new Date().toLocaleString()

    };

    // Save to browser
    const applications = getApplications();

    applications.unshift(application);

    // Keep latest 20 records
    if (applications.length > 20) {
        applications.pop();
    }

    if (!saveApplications(applications)) {
        return;
    }

    // Display confirmation
    displayConfirmation(application);

    // Update history
    displayHistory();

    // Show modal
    modal.classList.add("show");

    // Reset form
    loanForm.reset();

    // Reset default loan amount
    amountInput.value = 100000;

    periodInput.value = 30;

    calculateLoan();

});

// ======================================
// CONFIRMATION MODAL
// ======================================

function displayConfirmation(application) {

    const details =
        document.getElementById("confirmationDetails");

    details.innerHTML = `

        <div class="confirm-row">
            <span>Application ID</span>
            <strong>${escapeHTML(application.id)}</strong>
        </div>

        <div class="confirm-row">
            <span>Applicant</span>
            <strong>${escapeHTML(application.name)}</strong>
        </div>

        <div class="confirm-row">
            <span>Loan Amount</span>
            <strong>${formatCurrency(application.amount)}</strong>
        </div>

        <div class="confirm-row">
            <span>Repayment Period</span>
            <strong>${application.period} Days</strong>
        </div>

        <div class="confirm-row">
            <span>Estimated Total</span>
            <strong>${formatCurrency(application.total)}</strong>
        </div>

        <div class="confirm-row">
            <span>Status</span>
            <strong>Pending Review</strong>
        </div>

    `;
}

// Escape user-provided content before inserting HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        const entities = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        };

        return entities[character];

    });
}

// Close modal
function closeModal() {

    modal.classList.remove("show");

    showToast("Application submitted for review.");

}

// Close modal when clicking outside
modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeModal();
    }

});

// ======================================
// APPLICATION HISTORY
// ======================================

function displayHistory() {

    const applications = getApplications();

    if (applications.length === 0) {

        historyList.innerHTML = `

            <div class="empty-state">

                <span>📂</span>

                <p>No applications have been created yet.</p>

            </div>

        `;

        return;
    }

    historyList.innerHTML = applications.map(function(app) {

        return `

            <div class="history-item">

                <div>

                    <h4>${escapeHTML(app.name)}</h4>

                    <p>
                        ${escapeHTML(app.id)}
                        · ${escapeHTML(app.date)}
                        · ${app.period} days
                    </p>

                    <p>
                        Status: ${escapeHTML(app.status)}
                    </p>

                </div>

                <div class="history-amount">

                    ${formatCurrency(app.amount)}

                </div>

            </div>

        `;

    }).join("");

}

// ======================================
// CLEAR HISTORY
// ======================================

function clearHistory() {

    const applications = getApplications();

    if (applications.length === 0) {

        showToast("There is no history to clear.");

        return;
    }

    const confirmation = confirm(
        "Are you sure you want to clear all application history?"
    );

    if (confirmation) {

        if (!saveApplications([])) {
            return;
        }

        displayHistory();

        showToast("Application history cleared.");

    }

}

// ======================================
// NOTIFICATION SYSTEM
// ======================================

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);

}

// ======================================
// NAVIGATION
// ======================================

function scrollToApply() {

    document.getElementById("apply").scrollIntoView({

        behavior: "smooth"

    });

}

// Mobile navigation
function toggleMenu() {

    const nav = document.getElementById("navMenu");

    nav.classList.toggle("open");

}

// Close mobile menu after selecting a link
document.querySelectorAll("#navMenu a").forEach(function(link) {

    link.addEventListener("click", function() {

        document.getElementById("navMenu").classList.remove("open");

    });

});

// ======================================
// INITIALIZE WEBSITE
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    displayHistory();

    calculateLoan();

    console.log("MTN MOMO LOANS  website loaded successfully.");

});
