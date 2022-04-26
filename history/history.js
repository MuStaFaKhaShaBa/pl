let table = document.querySelector(".tableElement");
let inputDate = document.querySelector(".date");
let btnPayments = document.querySelector(".which .payment");
let btnIncome = document.querySelector(".which .income");

let dateSpecific = null;

let dataInDay = []; // put data to dispaly specific
let x = false; // check if day specified


function yyyymmdd(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1)}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
}
///

let defaultIncome = `
    <div class="coutTable head">
        <p>اسم الجهاز</p>
        <p>مشروبات</p>
        <p>سعر المشروبات</p>
        <p>نوع الحجز</p>
        <p>الوقت المحجوز</p>
        <p>قيمة الحجز</p>
        <p>السعر الاجمالي</p>
    </div>                    
    `;

let defaultPayment = `
    <div class="payTable head">
        <p>الصنف</p>
        <p class="long">الوصف</p>
        <p>السعر</p>
    </div>
    `;

let allTransaction = JSON.parse(window.localStorage.getItem("allTransaction"));


inputDate.min = allTransaction[0].date; // min date can choose
inputDate.max = allTransaction[allTransaction.length - 1].date; // max date can choose



document.querySelector('.btnsdate').addEventListener("click", () => {
    if (inputDate.value != '') {
        
        dateSpecific = inputDate.value;

        dataInDay = allTransaction.filter((el) => el.date == dateSpecific);
        x = true;
        // return the specific object depends on his day 
        // if returned is [] >> means the data his been removed


    }
    else {
        alert('ادخل تاريخ من فضلك');
    }
})

function createElements(type, defaultRow, array) {
    table.innerHTML = "";
    table.innerHTML = defaultRow;

    if (type == "pay") {
        // Print Payment Records of lastest day [ Payment.length -1]
        array.forEach(
            ({ type, deatils, price }, index) => {
                let pay = `   
                <div class="payTable">
                    <p>${type}</p>
                    <p class="long">${deatils}</p>
                    <p>${price}</p>
                </div>
                `;
                table.innerHTML += pay;
            }
        );
    } else {
        // print All Transaction In All Days
        array.forEach(({ drinkSalary, drinks, name, totalPrice, totalTime, type }) => {

            let temp = `                      
                <div class="coutTable">
                    <p>${name}</p>
                    <p class="long">${getDrinks(drinks)}</p>
                    <p>${drinkSalary}</p>
                    <p>${type == 'single' ? "فردي" : "زوجي"}</p>
                    <p>${totalTime}</p>
                    <p>${totalPrice - drinkSalary}</p>
                    <p>${totalPrice}</p>
                </div>
                `;

            table.innerHTML += temp;
        });
    }
}

function getDrinks(arr) {

    let x = arr.map((el) => {
        return el[1] + ' ' + el[0].nameproduct;
    }).join(("  و "));

    return x;
}

btnIncome.addEventListener("click", () => {
    if (!x) {
        alert("يرجي تحديد تاريخ")
    }
    else if (dataInDay.length == 0) {
        alert('السجل المراد عرضه غير موجود, ربما تم حذفه');
    } else {
        btnIncome.classList.add("active");
        btnPayments.classList.remove("active");
        let arr = dataInDay[0].devicesTrans;
        createElements("incom", defaultIncome, arr);
    }

});
btnPayments.addEventListener("click", () => {
    if (!x) {
        alert("يرجي تحديد تاريخ")
    }
    else if (dataInDay.length == 0) {
        alert('السجل المراد عرضه غير موجود, ربما تم حذفه');
    } else {
        
        btnIncome.classList.remove("active");
        btnPayments.classList.add("active");
        let arr = dataInDay[0].payment;

        createElements("pay", defaultPayment, arr);
    }

});