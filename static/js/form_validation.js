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
        const cursorPosition = inputElement.selectionStart;
        const oldValue = inputElement.value;
        let newValue = oldValue.replace(/[^\d.]/g, '');

        const parts = newValue.split('.');
        if (parts.length > 2) {
            parts.pop();
            newValue = parts.join('.');
        }

        newValue = formatCurrency(newValue);

        inputElement.value = newValue;
        const newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    [purchasePriceField, emdValueField, downpaymentField].forEach(field => {
        if (field) {
            field.addEventListener("input", function () {
                handleCurrencyInput(this);
                if (this.id === 'purchase_price' || this.id === 'downpayment') {
                    calculateAmountFinanced();
                }
            });
            field.addEventListener("blur", function () {
                const value = parseCurrency(this.value);
                this.value = formatCurrency(value.toFixed(2));
            });
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        const purchasePrice = parseCurrency(purchasePriceField.value);
        if (purchasePrice < 100000) {
            purchasePriceField.classList.add("is-invalid");
            document.getElementById("price-error").textContent = "Purchase price must be greater than $100,000.";
            isValid = false;
        } else {
            purchasePriceField.classList.remove("is-invalid");
            document.getElementById("price-error").textContent = "";
        }

        if (secondPersonCheckbox.checked && !secondPersonNameField.value.trim()) {
            secondPersonNameField.classList.add("is-invalid");
            isValid = false;
        } else {
            secondPersonNameField.classList.remove("is-invalid");
        }

        const emdValue = parseCurrency(emdValueField.value);
        if (emdValue <= 0) {
            emdValueField.classList.add("is-invalid");
            document.getElementById("emd-value-error").textContent = "Please enter a valid EMD value.";
            isValid = false;
        } else {
            emdValueField.classList.remove("is-invalid");
            document.getElementById("emd-value-error").textContent = "";
        }

        if (isValid) {
            form.submit();
        } else {
            const firstInvalidField = form.querySelector(".is-invalid");
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    });
});