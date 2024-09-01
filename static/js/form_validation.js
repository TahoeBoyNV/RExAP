document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("offer-form");
    const purchasePriceField = document.getElementById("purchase_price");
    const emdValueField = document.getElementById("emd_value");
    const secondPersonCheckbox = document.getElementById("secondPersonCheckbox");
    const secondPersonNameField = document.getElementById("secondPersonNameField");
    const offerTypeRadios = document.getElementsByName("offer_type");
    const cashOfferFields = document.getElementById("cashOfferFields");
    const financingFields = document.getElementById("financingFields");
    const emdMethodSelect = document.getElementById("emdMethodSelect");
    const emdOtherField = document.getElementById("emdOtherField");
    const appraisalContingencyRadios = document.getElementsByName("appraisal_contingency");
    const appraisalContingencyDays = document.getElementById("appraisalContingencyDays");
    const financingContingencyRadios = document.getElementsByName("financing_contingency");
    const financingContingencyDays = document.getElementById("financingContingencyDays");
    const inspectionContingencyRadios = document.getElementsByName("inspection_contingency");
    const inspectionContingencyFields = document.getElementById("inspectionContingencyFields");
    const downpaymentField = document.getElementById("downpayment");
    const amountFinancedField = document.getElementById("amount_financed");

    function formatCurrency(value) {
        value = value.replace(/[^\d]/g, '');
        value = parseInt(value, 10);
        return isNaN(value) ? "" : "$" + value.toLocaleString("en-US");
    }

    function handleCurrencyInput(inputElement) {
        let cursorPosition = inputElement.selectionStart;
        let oldLength = inputElement.value.length;
        inputElement.value = formatCurrency(inputElement.value);
        let newLength = inputElement.value.length;
        cursorPosition = cursorPosition - (oldLength - newLength);
        inputElement.setSelectionRange(cursorPosition, cursorPosition);
    }

    purchasePriceField.addEventListener("input", function(e) {
        handleCurrencyInput(this);
    });

    purchasePriceField.addEventListener("blur", function() {
        let value = parseInt(this.value.replace(/[^\d]/g, ''), 10);
        if (isNaN(value) || value < 100000) {
            this.classList.add("is-invalid");
            document.getElementById("price-error").textContent = "Purchase price must be greater than $100,000.";
        } else {
            this.classList.remove("is-invalid");
            document.getElementById("price-error").textContent = "";
        }
    });

    emdValueField.addEventListener("input", function(e) {
        handleCurrencyInput(this);
    });

    secondPersonCheckbox.addEventListener("change", function() {
        secondPersonNameField.style.display = this.checked ? "block" : "none";
    });

    offerTypeRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            if (this.value === "cash") {
                cashOfferFields.style.display = "block";
                financingFields.style.display = "none";
            } else {
                cashOfferFields.style.display = "none";
                financingFields.style.display = "block";
            }
        });
    });

    emdMethodSelect.addEventListener("change", function() {
        emdOtherField.style.display = this.value === "other" ? "block" : "none";
    });

    appraisalContingencyRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            appraisalContingencyDays.style.display = this.value === "yes" ? "block" : "none";
        });
    });

    financingContingencyRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            financingContingencyDays.style.display = this.value === "yes" ? "block" : "none";
        });
    });

    inspectionContingencyRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            inspectionContingencyFields.style.display = this.value === "yes" ? "block" : "none";
        });
    });

    function calculateAmountFinanced() {
        const purchasePrice = parseInt(purchasePriceField.value.replace(/[^\d]/g, ''), 10);
        const downpayment = parseInt(downpaymentField.value.replace(/[^\d]/g, ''), 10);
        if (!isNaN(purchasePrice) && !isNaN(downpayment)) {
            const amountFinanced = purchasePrice - downpayment;
            amountFinancedField.value = formatCurrency(amountFinanced.toString());
        }
    }

    purchasePriceField.addEventListener("input", calculateAmountFinanced);
    downpaymentField.addEventListener("input", function() {
        handleCurrencyInput(this);
        calculateAmountFinanced();
    });

    form.addEventListener("submit", function(event) {
        // Add any final form validation here if needed
        // If validation fails, call event.preventDefault() to stop form submission
    });
});