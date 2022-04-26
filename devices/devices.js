let TimerIDs = [];
let timeinfo = document.querySelector(".timeinfo");

let holder = document.querySelector(".devicescontent");
let Devices = [];
let _alert = document.querySelector(".alert");

let btnStop = document.querySelector(".stop");

let DevicesTransfer = [];
let Drinks = [];

let autoRefreshID ;
/// All Transaction
let AllTransaction = []; // Push Object Describe Day

getFromLocal();

function getFromLocal() {
  Devices = JSON.parse(window.localStorage.getItem("devicesRunning")) || [];
  // Get Devices Ruuning from Local

  DevicesTransfer =
    JSON.parse(window.localStorage.getItem("DevicesDone")) || [];
  // Get Devices Done From Local

  AllTransaction =
    JSON.parse(window.localStorage.getItem("allTransaction")) || [];
  // get All Transaction From Local

  createRunDevice(); // Call Function To Create Elements
}

function setToLocal() {
  window.localStorage.setItem("devicesRunning", JSON.stringify(Devices));
  // Set Devices Running to Local

  getFromLocal(); // call get from Storage To Update
}

function createRunDevice() {
  autoRefreshID = setTimeout(()=>{

    clearTimeout(autoRefreshID);
    window.location ='./devices.html';

  },1000*60*15)
  holder.innerHTML = "";

  // Remove all Intervals

  TimerIDs.forEach((el) => clearInterval(el));
  TimerIDs.length = 0;

  //
  Devices.forEach(({ name, type, timeStart, bookTime }, index) => {
    let device = `<div class="device">
              <img src="../images/remove.png" onclick="deleteDevice(${index})" />
              <h1>${name}</h1>
              <p>${bookTime == "openTime" ? "الوقت المنقضي" : "الوقت المتبقي"
      } : - </p>
              <div class="timeinfo">
                  <p>ساعه : <span ></span></p>
                  <p>دقيقه : <span ></span></p>
                  <p>ثانيه : <span ></span></p>
              </div> 
        
              <div class="row">
                <div class="col">
                    <p>وقت البدء</p>
                    <p class="timestart">
                        ${new Date(timeStart).toLocaleTimeString()}
                    </p>
              </div>

              <div class="col">
                <p>
                    ${Devices[index].finish
        ? `الوقت المنقضي`
        : bookTime == "openTime"
          ? ""
          : `الوقت المحجوز`
      }
                </p>
                <p style ="color:#fff; font-size:17px">
                ${!Devices[index].finish
        ? bookTime == "openTime"
          ? ""
          : Devices[index].totalTime / 60 > 1
            ? `${Math.floor(Devices[index].totalTime / 60)} ساعه ${Devices[index].totalTime % 60 == 0
              ? ""
              : ` و ${Devices[index].totalTime % 60} دقيقه`
            }`
            : Devices[index].totalTime / 60 == 1
              ? `60 دقيقه`
              : `${Devices[index].totalTime % 60} دقيقه`
        : Devices[index].totalTime / 60 > 1
          ? `${Math.floor(Devices[index].totalTime / 60)} ساعه ${Devices[index].totalTime % 60 == 0
            ? ""
            : ` و ${Devices[index].totalTime % 60} دقيقه`
          }`
          : Devices[index].totalTime / 60 == 1
            ? `60 دقيقه`
            : `${Devices[index].totalTime % 60} دقيقه`
      }
              </p>
              </div>
                ${Devices[index].finish
        ? `              
                <div class="col">
                  <p>السعر الاجمالي</p>
                  <p class='price'>
                      ${Devices[index].totalPrice} ج
                  </p>
              </div>`
        : ""
      }              
              </div>

              <div class="row">
              
                  <div class="col">
                    <div style="margin-bottom: 20px;"> 
                    <span style="margin-bottom: 20px;">نوع الجهاز</span>
                    <p class="deviceType">${type == "single" ? "فردي" : "زوجي"
      }</p>
                    </div>
                  </div>
              
                  ${Devices[index].drinks.length
        ? `              
                    <div class="col">
                
                        <details>
                          <summary>المشروبات</summary>
                          <p>
                          ${getDrinks(index)}
                          </p>
                        </details>
                    </div>`
        : ""
      }
              </div>
        
              <div class="controls" style="display: flex; justify-content: space-between;">
                  <button class="addDrink" onclick="addDrink(${index})">اضافه مشروب</button>
                  <button class="stop" onclick="stopOpt(${index})">ايقاف</button>
                  <button class="discount" onclick="setDiscount(${index})">خصم</button>
                  <button class="overTime" onclick="overTime(${index})">اضافة وقت</button>
              </div>
          </div>`;

    holder.innerHTML += device;
  });

  TimerIDs = Array.from(document.querySelectorAll(".timeinfo")).map(
    (el, index) => {
      endRunBox(index, el);
      return remainderTime(
        el,
        Devices[index].bookTime,
        Devices[index].timeStart,
        index
      );
    }
  );
}

function getDrinks(index) {
  let x = Devices[index].drinks
    .map((el, index) => {
      return el[1] + " " + el[0].nameproduct;
    })
    .join("  و ");

  return x;
}

function remainderTime(Box, bookTime, timeStart, index) {
  let hours = Box.firstElementChild.firstElementChild; // hours
  let minutes = Box.firstElementChild.nextElementSibling.firstElementChild; // minutes
  let seconds = Box.lastElementChild.firstElementChild; // sec

  if (Devices[index].finish) {
    // reset All Fields To 0
    hours.textContent = 0;
    seconds.textContent = 0;
    minutes.textContent = 0;
    clearInterval(TimerIDs[index]);
    return;
  }

  let Id; // For Intervals

  let diff = Date.now() - +timeStart;

  hours.textContent = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  minutes.textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds.textContent = Math.floor((diff % (1000 * 60)) / 1000);


  if (bookTime == "openTime") {
    Id = setInterval(() => {
      seconds.textContent = +seconds.textContent + 1;
      if (+seconds.textContent >= 59) {
        // If Seconds Reaches 59

        seconds.textContent = 0; // reset 0 to starts again
        minutes.textContent = +minutes.textContent + 1; // add 1 to minutes field

        if (+minutes.textContent >= 59) {
          // if Minutes Reaches 59

          minutes.textContent = 0; // reset it
          hours.textContent = +hours.textContent + 1; // add 1 to Hours Field
        }
      }
    }, 1000);
  } else {
    hours.textContent = Math.floor(+bookTime / 60) - +hours.textContent; // Calc Hours
    // If Hours is 1 Thats Mean We Don't Need To Hours Field we will put It to 0
    // And put 60 to Minutes Field [blew]

    minutes.textContent =
      (+bookTime % 60 || (+hours.textContent-- && 60)) - +minutes.textContent;

    if(+minutes.textContent < 0 ){
      minutes.textContent = 60 + +minutes.textContent;
      hours.textContent--;
    }
    // Get Remainder After Divide On 60 That's Minutes
    // if Remaineder 0 That's Mean No Minutes
    // He Choose Hours And Multiples for That We Will Put 60 to Minutes Field And decrement hours by 1

    Id = setInterval(() => {
      seconds.textContent -= 1;

      if (+minutes.textContent <= -1 || +hours.textContent <= -1) {
        // That Mean time up
        timeFinish(index, Id, Box);
      }

      if (seconds.textContent <= 0) {
        // If Seconds Reaches 0
        seconds.textContent = 59; // reset it to 60 to Starts Again
        minutes.textContent -= 1;

        if (minutes.textContent <= -1) {
          // If Minutes Reaches 0
          minutes.textContent = 59; // reset It 60
          hours.textContent -= 1; // minus 1 from hours

          // Here we will Check If Hours == -1 Thats mean Now Time Remained
          // we Will Stop That Interval And Call Func To Alert User
          if (+hours.textContent <= -1) {
            timeFinish(index, Id, Box);
          }
        }
      }
    }, 1000);
  }

  return Id;
}

function timeFinish(index, Id, Box) {
  let { name, price, totalTime, drinks } = Devices[index];

  Devices[index].drinkSalary = 0;

  drinks.forEach((el) => {
    let sum = +el[0].salebuy * +el[1];

    Devices[index].drinkSalary += sum;
  });

  let salary =
    Math.round((+price / 60) * +totalTime) + +Devices[index].drinkSalary;

  Devices[index].totalPrice = salary - Devices[index].discount;

  clearInterval(Id); //Clear Interval

  new Promise((resolve) => {
    _alert.play();
    resolve(
      Swal.fire({
        title: `جهاز ${name}`,
        html: `
      <div class="Alert">
      <p>انتهي الوقت</p>
      <p>الحساب : ${Devices[index].totalPrice}ج</p>
      </div>
      `,
        allowOutsideClick: false,
      })
    );
  }).finally(() => {
    Devices[index].finish = true;
    _alert.pause();
    setToLocal(Devices);
  });
}

function overTime(index) {
  new Promise((resolve) => {
    resolve(
      Swal.fire({
        input: "text",
        allowOutsideClick: false,
        inputLabel: "كم المده المضافه",
        inputPlaceholder: "ادخل المده",
      })
    );
  }).then((v) => {
    if (v) {
      Swal.fire(`المده المضافه هي: ${v.value}`);
    }

    if (!Devices[index].finish) {
      // current interval running
      Devices[index].bookTime = +Devices[index].bookTime + +v.value || 0;
    } else {
      // if not
      Devices[index].bookTime = +v.value || 0; // add new value
      Devices[index].timeStart = Date.now(); // set time starts
      Devices[index].finish = false; // make finish to false
    }

    Devices[index].totalTime =
      +Devices[index].totalTime + +v.value || +Devices[index].totalTime; // add new value to total time

    setToLocal();
  });
}

function stopOpt(index) {
  let time = Array.from(document.querySelectorAll(".timeinfo"));
  let hours = +time[index].firstElementChild.firstElementChild.textContent;
  let minute =
    +time[index].firstElementChild.nextElementSibling.firstElementChild
      .textContent;

  let timeout = hours * 60 + minute; // Calc Time Reach

  if (Devices[index].bookTime == "openTime") {
    Devices[index].totalTime = timeout; // In open Time timeout Is The totalTime
  } else {
    // otherwise time out it's time that user doesn't use it
    // So We Subtract it with totalTime to get time that user use.
    Devices[index].totalTime = +Devices[index].totalTime - +timeout;
  }

  Devices[index].drinkSalary = 0;

  Devices[index].drinks.forEach((el) => {
    let sum = +el[0].salebuy * +el[1];

    Devices[index].drinkSalary += sum;
  });

  let salary =
    Math.round((+Devices[index].price / 60) * +Devices[index].totalTime) +
    +Devices[index].drinkSalary;

  Devices[index].totalPrice = salary - Devices[index].discount;

  clearInterval(TimerIDs[index]); //Clear Interval

  new Promise((resolved) => {
    _alert.play();
    resolved(
      Swal.fire({
        title: `${Devices[index].name} هل تريد ايقاف الجهاز`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "ايقاف",
        denyButtonText: "الغاء",
        allowOutsideClick: false,
        customClass: {
          actions: "my-actions",
          cancelButton: "order-1 right-gap",
          confirmButton: "order-2",
          denyButton: "order-3",
        },
      })
    );
  })
    .then((result) => {
      if (result.isConfirmed) {
        new Promise((resolve) => {
          resolve(Swal.fire("تم ايقاف الجهاز", "", "success"));
        }).then((v) => {
          new Promise((resolve) => {
            resolve(
              Swal.fire({
                title: `جهاز ${Devices[index].name}`,
                html: `
              <div class="Alert">
              <p>انتهي الوقت</p>
              <p>الحساب : ${Devices[index].totalPrice}ج</p>
              </div>
              `,
              })
            );
          }).then((v) => {
            Devices[index].finish = true;
            setToLocal(Devices);
          });
        });
      } else if (result.isDenied) {
        Swal.fire("لم يتم الحذف", "", "info");

        window.location = "./devices.html";
      }
    })
    .finally(() => _alert.pause());
}

function endRunBox(index, Box) {
  if (Devices[index].finish) {
    Box.parentElement.style.cssText = `
  background-color: #777;
  box-shadow: 0 0 10px #f00;
  `;
  }
}

function deleteDevice(index) {
  if (Devices[index].finish) {
    Swal.fire({
      title: "هل تريد حذف الجهاز",
      showDenyButton: true,
      confirmButtonText: "احذف",
      denyButtonText: "الغاء",
      customClass: {
        actions: "my-actions",
        cancelButton: "order-1 right-gap",
        confirmButton: "order-2",
        denyButton: "order-3",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("تم الحذف!", "", "success");
        DevicesTransfer.push(Devices[index]); // Put Devices Deleted To Array
        // Add Devices End To LocalStorage

        AllTransaction[AllTransaction.length - 1].devicesTrans =
          DevicesTransfer;
        // update Devices transaction in All Transaction

        window.localStorage.setItem(
          "DevicesDone",
          JSON.stringify(DevicesTransfer)
        );
        // Set Change Of Devices Transfer to Local

        window.localStorage.setItem(
          "allTransaction",
          JSON.stringify(AllTransaction)
        );
        // Set Change of All Transaction to Local

        Devices.splice(index, 1); // Remove That Device From Running Device List
        setToLocal(); // Call Set To Local To Update Data
      }
    });
  } else {
    alert("يجب عليك ايقاف الجهاز اولا ثم حذفه");
  }
}

/// Add Drink Code

function addDrink(index) {
  Drinks = JSON.parse(window.localStorage.getItem("newproduct")) || []; // Get Drinks From Local

  let drinks = {};

  if (Drinks.length) {
    Drinks.forEach((el) => {
      drinks[el.nameproduct] = {
        [el.nameproduct]: `السعر : ${el.salebuy}`,
      };
    });

    new Promise((resolved) => {
      resolved(
        Swal.fire({
          title: "اختار المنتج",
          input: "select",
          inputOptions: drinks,
          inputPlaceholder: "اختار المنتج",
          showCancelButton: true,

          cancelButtonText: "الغاء",
          confirmButtonText: "اختيار",
          allowOutsideClick: false,

          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve("يجب عليك اختيار منتج :)");
              }
            });
          },
        })
      );
    }).then((v) => {
      if (v.value) {
        Swal.fire({
          title: `المنتج الذي اخترته :${v.value}`,
          input: "number",
          inputLabel: "ادخل الكميه",
          showCancelButton: true,
          cancelButtonText: "الغاء",
          allowOutsideClick: false,
          confirmButtonText: "موافق",
          inputValidator: (value) => {
            if (!value) {
              return "يجب ان تقم بادخال قيمه !!";
            }
          },
        }).then((qua) => {
          if (qua.value) {
            let x = Drinks.filter((el) => el.nameproduct == v.value);

            let existDrink = Devices[index].drinks.some(
              (el) => el[0].nameproduct == v.value
            );
            if (!existDrink) {
              Devices[index].drinks.push([x[0], qua.value]);
            } else {
              let ind;
              Devices[index].drinks.forEach((el, index) => {
                if (el[0].nameproduct == v.value) {
                  ind = index;
                }
              });

              Devices[index].drinks[ind][1] =
                +Devices[index].drinks[ind][1] + +qua.value;
            }

            // Calc Drinks Salary
            Devices[index].drinkSalary = 0;

            Devices[index].drinks.forEach((el) => {
              let sum = +el[0].salebuy * +el[1];

              Devices[index].drinkSalary += sum;
            });

            // update total Price
            let salary =
              Math.round(
                (+Devices[index].price / 60) * +Devices[index].totalTime
              ) + +Devices[index].drinkSalary;

            Devices[index].totalPrice = salary - Devices[index].discount;

            setToLocal();
          }
        });
      }
    });
  } else {
    alert("قم باضافه بعض المشاريب");
  }
}

function setDiscount(index) {
  new Promise((resolve) => {
    resolve(
      Swal.fire({
        title: "ادخل قيمه الخصم",
        input: "number",
        showCancelButton: true,
        cancelButtonText: "الغاء",
        allowOutsideClick: false,
        confirmButtonText: "تم",
        inputValidator: (value) => {
          if (!value) {
            return "لابد من ادخال قيمه الخصم";
          }
        },
      })
    );
  }).then((value) => {
    console.log(value);
    Devices[index].discount = +value.value;
    Devices[index].totalPrice -= +value.value;
    setToLocal();
  });
}
