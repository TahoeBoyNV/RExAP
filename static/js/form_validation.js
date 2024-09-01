document.addEventListener("DOMContentLoaded", function () {
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

    console.log("Downpayment field:", downpaymentField); // Debugging

    function formatCurrency(value) {
        value = value.replace(/[^\d.]/g, '');
        const parts = value.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return "$" + (parts[0] ? parts[0] : "0") + (parts.length > 1 ? "." + parts[1].slice(0, 2) : "");
    }

    function parseCurrency(value) {
        return parseFloat(value.replace(/[^\d.]/g, '')) || 0;
    }

    function handleCurrencyInput(inputElement) {
        console.log("Handling currency input for", inputElement.id); // Debugging
        const cursorPosition = inputElement.selectionStart;
        const oldValue = inputElement.value;
        let newValue = oldValue.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = newValue.split('.');
        if (parts.length > 2) {
            parts.pop();
            newValue = parts.join('.');
        }

        // Format the value
        newValue = formatCurrency(newValue);

        // Update the input value and cursor position
        inputElement.value = newValue;
        const newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    [purchasePriceField, emdValueField, downpaymentField].forEach(field => {
        if (field) {
            field.addEventListener("input", function () {
                console.log(`Input event fired for ${this.id}`); // Debugging
                handleCurrencyInput(this);
            });
            field.addEventListener("blur", function () {
                console.log(`Blur event fired for ${this.id}`); // Debugging
                const value = parseCurrency(this.value);
                this.value = formatCurrency(value.toFixed(2));
            });
        } else {
            console.error(`Field not found: ${field}`); // Debugging
        }
    });

    purchasePriceField.addEventListener("blur", function () {
        const value = parseCurrency(this.value);
        if (value < 100000) {
            this.classList.add("is-invalid");
            document.getElementById("price-error").textContent = "Purchase price must be greater than $100,000.";
        } else {
            this.classList.remove("is-invalid");
            document.getElementById("price-error").textContent = "";
        }
    });

    secondPersonCheckbox.addEventListener("change", function () {
        secondPersonNameField.style.display = this.checked ? "block" : "none";
    });

    offerTypeRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            cashOfferFields.style.display = this.value === "cash" ? "block" : "none";
            financingFields.style.display = this.value === "cash" ? "none" : "block";
        });
    });

    emdMethodSelect.addEventListener("change", function () {
        emdOtherField.style.display = this.value === "other" ? "block" : "none";
    });

    [appraisalContingencyRadios, financingContingencyRadios, inspectionContingencyRadios].forEach((radios, index) => {
        const contingencyFields = [appraisalContingencyDays, financingContingencyDays, inspectionContingencyFields];
        radios.forEach(radio => {
            radio.addEventListener("change", function () {
                contingencyFields[index].style.display = this.value === "yes" ? "block" : "none";
            });
        });
    });

    function calculateAmountFinanced() {
        const purchasePrice = parseCurrency(purchasePriceField.value);
        const downpayment = parseCurrency(downpaymentField.value);
        const amountFinanced = Math.max(0, purchasePrice - downpayment);
        amountFinancedField.value = formatCurrency(amountFinanced.toFixed(2));
    }

    [purchasePriceField, downpaymentField].forEach(field => {
        if (field) {
            field.addEventListener("input", calculateAmountFinanced);
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission for debugging
        console.log("Form submission attempted");

        let isValid = true;

        // Validate purchase price
        const purchasePrice = parseCurrency(purchasePriceField.value);
        console.log("Purchase price:", purchasePrice); // Debugging
        if (purchasePrice < 100000) {
            purchasePriceField.classList.add("is-invalid");
            document.getElementById("price-error").textContent = "Purchase price must be greater than $100,000.";
            isValid = false;
            console.log("Purchase price invalid");
        } else {
            purchasePriceField.classList.remove("is-invalid");
            document.getElementById("price-error").textContent = "";
            console.log("Purchase price valid");
        }

        // Validate second person name if checkbox is checked
        if (secondPersonCheckbox.checked && !secondPersonNameField.value.trim()) {
            secondPersonNameField.classList.add("is-invalid");
            isValid = false;
        } else {
            secondPersonNameField.classList.remove("is-invalid");
        }

        // Validate EMD value
        const emdValue = parseCurrency(emdValueField.value);
        if (emdValue <= 0) {
            emdValueField.classList.add("is-invalid");
            document.getElementById("emd-value-error").textContent = "Please enter a valid EMD value.";
            isValid = false;
        } else {
            emdValueField.classList.remove("is-invalid");
            document.getElementById("emd-value-error").textContent = "";
        }

        // Add more validations as needed...

        if (isValid) {
            console.log("Form is valid, would submit normally");
            // Uncomment the next line to allow form submission when everything is working
            // form.submit();
        } else {
            console.log("Form is invalid");
            const firstInvalidField = form.querySelector(".is-invalid");
            if (firstInvalidField) {
                console.log("Scrolling to first invalid field:", firstInvalidField.id);
                firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
});