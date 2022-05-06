let devicestart = document.getElementById("devicestart");
let btnstart = document.querySelector(".btnstart");
let addde = document.getElementById("addde");
let close = document.getElementById("close");
let logout = document.querySelector(".logout");

logout.addEventListener("click", () => {
    window.location = "./log/login.html";
});

btnstart.addEventListener("click", () => {
    devicestart.style.display = "block";
});

close.addEventListener("click", () => {
    devicestart.style.display = "none";
});

///  Store Devices

// add Running devices To Local Storage

function addToLocal(arr, key) {
    window.localStorage.setItem(key, JSON.stringify(arr));
    return getfromLocal(arr);
}
function getfromLocal(arr, key) {
    arr = JSON.parse(window.localStorage.getItem(key));
    if (!arr) {
        arr = [];
        window.localStorage.setItem(key, JSON.stringify(arr));
    }
    return arr;
}

//
let selectDevice = document.querySelector(".selectDivce");
let SelectTime = document.querySelector(".selectTime");
let selectType = document.querySelector(".selectType");

let devices; // devices add by user
let _DevicesRunning =
    JSON.parse(window.localStorage.getItem("devicesRunning")) || [];
// Get Running Devices

function addOptDevices() {
    devices = JSON.parse(window.localStorage.getItem("newdevice")) || [];

    let devicesName = devices.map((el) => el.numdevice);

    selectDevice.innerHTML = `
    <option selected="true" disabled="disabled" value="">اختار الجهاز</option>    
`;
    devicesName.forEach((element) => {
        if (_DevicesRunning.some((el) => element == el.name)) {
            return;
        }

        let opt = document.createElement("option"); // create option element
        opt.setAttribute("value", element); //set Device Name As Value

        opt.textContent = element;

        selectDevice.appendChild(opt);
    });
}
addOptDevices();

class deviceTemp {
    // Devices Running Template
    constructor(name, time, type, price) {
        this.name = name;
        this.bookTime = time;
        this.totalTime = this.bookTime;
        this.type = type;
        this.price = price;
        this.timeStart = Date.now();
        this.finish = false;
        this.totalPrice = 1;
        this.drinks = [];
        this.drinkSalary = 0;
        this.discount = 0;
        this.prePaid = false;
    }
}

addde.addEventListener("click", () => {
    let _name = selectDevice.value;
    let bookTime = SelectTime.value;
    let type = selectType.value;

    let deviceSelect = devices.filter((e) => _name == e.numdevice)[0]; // get Device Info

    if (_name != "" && bookTime != "" && type != "") {
        _DevicesRunning = getfromLocal(_DevicesRunning, "devicesRunning"); // Get Devices From Local First

        const _Device = new deviceTemp(
            _name,
            bookTime,
            type,
            calcPrice(type, deviceSelect)
        ); // Get Devices Info & Price

        _DevicesRunning.push(_Device); // push new device

        _DevicesRunning = addToLocal(_DevicesRunning, "devicesRunning"); //Add After Push new Device

        window.location = "./index.html";


    } else {
        window.alert("تأكد من البيانات !!!");
    }
});

function calcPrice(type, deviceSelect) {
    return type == "single" ? deviceSelect.pricesingle : deviceSelect.multiprice;
}

// Initi All Transaction object in localStrorage
class TransactionTemp {
    // temp
    constructor(payment, DevicesTrans) {
        this.date = yyyymmdd(new Date()); // Date Of The Day >> Date
        this.payment = payment; // all Payments In That Day >> []
        this.devicesTrans = DevicesTrans; // all devices Transtion >> []
    }
}

/// All Transaction
let AllTransaction =
    JSON.parse(window.localStorage.getItem("allTransaction")) || [];

if (AllTransaction.length == 0) {
    AllTransaction.push(new TransactionTemp([], []));
    addToLocal(AllTransaction, "allTransaction")
}
// get All Transaction From local


function yyyymmdd(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
}
///

// check new day
let btnNewDay = document.querySelector(".btnNewDay");

let pay = JSON.parse(window.localStorage.getItem("payment")) || [];

btnNewDay.addEventListener("click", () => {
    if (yyyymmdd(new Date()) == AllTransaction[AllTransaction.length - 1].date) {
        return;
    }
    Swal.fire({
        title: "هل تريد بدء يوم جديد",
        showDenyButton: true,
        confirmButtonText: "نعم",
        denyButtonText: "الغاء",
        allowOutsideClick: false,
        customClass: {
            actions: "my-actions",
            cancelButton: "order-1 right-gap",
            confirmButton: "order-2",
            denyButton: "order-3",
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // new Day
            // new Payment Day
            pay.push([]);
            window.localStorage.setItem("payment", JSON.stringify(pay));

            // we will init all tranaction for that day
            let tranaction = new TransactionTemp([], []);
            // Empty Devices Transaction & Payments
            AllTransaction.push(tranaction);

            window.localStorage.setItem(
                "allTransaction",
                JSON.stringify(AllTransaction)
            );
            // Add New Array To Local

            window.localStorage.setItem("DevicesDone", JSON.stringify([]));
            // Reset Devices Done

            Swal.fire("تم بدء يوم جديد!", "", "success");
        }
    });
});

let dayMonth = getMonth_(AllTransaction[AllTransaction.length - 1].date);

// Set All Transaction income
function TranasationIncom() {
    let sumPerMonth = 0,
    sumPerMonthOut = 0;
    for (
        let el = AllTransaction.length - 1;
        AllTransaction[el] && el >= AllTransaction.length - 30;
        el--
    ) {
        let { devicesTrans,payment } = AllTransaction[el];

        sumPerMonth += devicesTrans.reduce((ac, { totalPrice }) => {
            // sum all Salaries in var
            // Loop On Devices Tranasation And Calc Sum Of All Salary At This Day
            return ac + +totalPrice;
        }, 0);
       
        sumPerMonthOut += payment.reduce((ac, { price }) => {
            // sum all Salaries in var
            // Loop On Devices Tranasation And Calc Sum Of All Salary At This Day
            return ac + +price;
        }, 0);

        if (el == AllTransaction.length - 1) {
            // Current Day print it's value
            document.querySelector(".totalThisDay").textContent = sumPerMonth;
        }
        // // Check the yesterday in the current month of today
        if (dayMonth == getMonth_(AllTransaction[el].date)) {
            document.querySelector(".totalThisMonth").textContent = sumPerMonth;
            document.querySelector(".totalThisMonthOut").textContent = sumPerMonthOut;

        } else {
            // last month reaches
            return;
        }
    }
}
TranasationIncom();
// Call Function To Updata Total Income In Current Day..

function getDay_(date) {
    // get number of the day
    let x = new Date(date).getDay();
    return x == 6 ? 0 : x + 1;
}
function getMonth_(date) {
    return new Date(date).getMonth();
}
