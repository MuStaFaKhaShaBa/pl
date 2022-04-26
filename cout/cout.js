let btnCout = document.querySelector(".coutbtn");
let btnBuy = document.querySelector(".buymebtn");
let table = document.querySelector(".tableElement");

let popUpCoutType = document.querySelector(".couttype");
let btnAdd = document.querySelector(".buttons #add");
let btnClose = document.querySelector(".buttons #close");
let Payment = [
    []
];
// store Payments Records [[]] becuase we have subarrays describes dates

/// All Transaction
let AllTransaction = []; // Push Object Describe Day


let defaultRowTotalSalary = `
    <div class="coutTable head">
        <p>التاريخ</p>
        <p>صافي الدخل</p>
        <p>ايراد الاوردرات</p>
        <p>ايراد الاجهزه</p>
        <p>المصروفات</p>
        <p>حذف</p>
    </div>
                    
    `;

let defaultPayment = `
    <div class="payTable head">
        <p>التاريخ</p>
        <p>الصنف</p>
        <p class="long">الوصف</p>
        <p>السعر</p>
        <p>
            <button onclick="showPopUp()">اضافة</button>    
        </p>
    </div>
    `;

class PaymentTrans {
    constructor(type, deatils, price) {
        this.date = AllTransaction[AllTransaction.length - 1].date;
        this.type = type;
        this.deatils = deatils;
        this.price = price;
    }
}

btnBuy.addEventListener("click", () => {
    /// Show All payment
    // Should after clicking on it
    // display data in Payment Coming from local

    btnBuy.classList.add("active");

    btnCout.classList.remove("active"); // remove
    fromLocal();
});

function createElements(type, defaultRow) {
    table.innerHTML = "";
    table.innerHTML = defaultRow;

    if (type == "pay") {
        // Print Payment Records of All Days
        let temp = [...Payment]; // put in other array to make reverse
        temp.reverse();

        temp.forEach((day) => {
            day.forEach(({ date, type, deatils, price }, index) => {
                let pay = `   
            <div class="payTable">
                <p>${date}</p>
                <p>${type}</p>
                <p class="long">${deatils}</p>
                <p>${price}</p>
                <p>
                    <button class="deletePay" onclick="deletePay(${
                        temp.length - 1
                    },${index})">حذف</button>
                </p>
            </div>
            `;
                table.innerHTML += pay;
            });
        });
    } else {
        // print All Transaction In All Days

        let temp = [...AllTransaction];
        temp.reverse();

        temp.forEach(({ date, payment, devicesTrans }, index) => {
            let devicesDrinksSum = devicesTrans.reduce((ac, { totalPrice }) => {
                // Loop On Devices Tranasation And Calc Sum Of All Salary At This Day

                return ac + +totalPrice;
            }, 0);

            let drinkSalarySum = devicesTrans.reduce((ac, { drinkSalary }) => {
                // Loop On Devices Tranasation And Calc Sum Of All Drinks Salary At This Day

                return ac + +drinkSalary;
            }, 0);

            let DevicesSalarySum = devicesDrinksSum - drinkSalarySum; // Devices Salary Sum At This Day

            let paySalarySum = payment.reduce((ac, el) => {
                // Loop On Payment array That Catch All Payments In This Day
                // And Calc Sum Of All Transaction

                return +ac + +el.price;
            }, 0);

            let temp = `                      
            <div class="coutTable">
                <p>${date}</p>
                <p>${devicesDrinksSum - paySalarySum || 0}ج</p>
                <p>${drinkSalarySum || 0}ج</p>
                <p>${DevicesSalarySum || 0}ج</p>
                <p>${paySalarySum || 0}ج</p>
                <p>
                    <button class="deleteRec" onclick="<!--DeleteRecord(${index}) -->">حذف</button>
                </p>
            </div>
            `;

            table.innerHTML += temp;
        });
    }
}

function toLacal() {
    // send new records for payment to local
    window.localStorage.setItem("payment", JSON.stringify(Payment));
    fromLocal(); // call func to get payments from local
}

function fromLocal() {
    // get payments from local
    Payment = JSON.parse(window.localStorage.getItem("payment")) || [
        []
    ];
    // if doesn't exist return an empty array []

    AllTransaction =
        JSON.parse(window.localStorage.getItem("allTransaction")) || [];
    // Get All Transaction Array From Local

    createElements("pay", defaultPayment); // call function to show all records of payments
}

btnClose.addEventListener("click", () => {
    popUpCoutType.style.display = "none";
});

btnAdd.addEventListener("click", () => {
    // Get Data From Popup menu
    let inputData = document.querySelectorAll(".couttypecontent input");
    // [0] > type
    // [1] > details
    // [2] > price
    if (inputData[0].value != "" && inputData[2].value != "") {
        let pay = new PaymentTrans(
            inputData[0].value,
            inputData[1].value,
            inputData[2].value
        );

        // first check if there any records or not
        // let exist =
        //     Payment[Payment.length - 1].length > 0 ?
        //     Payment[Payment.length - 1][0].date == pay.date :
        //     false;
        // Payment[Payment.length - 1][0].Date >> That means last record first record it's date
        // if == pay.date .. date that created now
        // means push on last record because of that we are in same day
        // if (exist) {
            Payment[Payment.length - 1].push(pay); // push in last record direct
        // } else {
        //     // Check if that's first record remove the first empty subarray
        //     Payment[Payment.length - 1].length == 0 && Payment.pop();
        //    
        // otherWise we at new day because of that we will create new record
        //     // for new date and push within it the new record
        //     Payment.push([pay]); // push new record in new subarray ..
        // }

        AllTransaction[AllTransaction.length - 1].payment =
            Payment[Payment.length - 1];
        // Update Last Object In All Transaction >> Attribute payment
        // With Updated Payment Last Day [Payment.lenght - 1]

        window.localStorage.setItem(
            "allTransaction",
            JSON.stringify(AllTransaction)
        );
        // Update All Transaction on Local Storage

        popUpCoutType.style.display = "none"; // hide the pop Up
        inputData[0].value = "";
        inputData[1].value = "";
        inputData[2].value = "";

        toLacal(); // Send Changes To local Storage
    } else {
        alert("تأكد من البيانات المدخله");
    }
});

function deletePay(day, index) {
    // delete payment record .. day >> Day Of pay , index >> it's index in array
    Payment[day].splice(index, 1);
    toLacal(); // call function to local to save changes
}

function showPopUp() {
    popUpCoutType.style.display = "block";
    document.querySelector(".dateDay").textContent = AllTransaction[AllTransaction.length -1].date;
}


/// handel income Transtion

btnCout.addEventListener("click", () => {
  btnCout.classList.add("active");
  btnBuy.classList.remove("active");

  fromLocal(); // Get Data From Local
  createElements("income", defaultRowTotalSalary); // call To Print all Transaction
});