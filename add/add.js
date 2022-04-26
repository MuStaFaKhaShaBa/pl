// mostafa
let adddevice = document.querySelector('.adddevice');
let deviceinfo = document.querySelector('.deviceinfo');
let table = document.getElementById('table');
let addde = document.getElementById('addde');
let close = document.getElementById('close');
let numdevice = document.getElementById('numdevice');
let pricesingle = document.getElementById('pricesingle');
let multiprice = document.getElementById('multiprice');
let number = document.getElementById('number');
let single = document.getElementById('single');
let multi = document.getElementById('multi');
let logout = document.querySelector('.logout');

deviceinfo.style.display = 'none'

adddevice.addEventListener('click', () => {
    deviceinfo.style.display = 'block';
})

close.addEventListener('click', () => {
    deviceinfo.style.display = 'none';

})


// Add Device
let newdevice;

function getFromStorage() {
    if (localStorage.newdevice != null) {
        newdevice = JSON.parse(localStorage.newdevice)
    } else {
        newdevice = [];
    }
    createDevice();
}
getFromStorage();

function setToStorage() { // set To Local And update current devices
    window.localStorage.setItem("newdevice", JSON.stringify(newdevice));
    getFromStorage();
};




addde.addEventListener('click', () => {
  
    if(numdevice.value== '' || pricesingle.value == '' || multiprice.value == ''){
        alert('تأكد من البيانات المدخله');
        return;
    }
  
    let newdevicedata = {
        numdevice: numdevice.value,
        pricesingle: pricesingle.value,
        multiprice: multiprice.value

    }

    newdevice.push(newdevicedata);


    setToStorage();

    cleardata();

    createDevice();

})


function createDevice() {
    let table = '';

    for (let i = 0; i < newdevice.length; i++) {
        table += `
        <tr>
        <td id="number">${newdevice[i].numdevice}</td>
        <td id="single">${newdevice[i].pricesingle}</td>
        <td id="multi">${newdevice[i].multiprice}</td>
        <td style="display: flex;">
            <button onclick="deletedata(${i})" id="delete">delete</button>
        </td>
    </tr>
        `
    }
    document.getElementById('tbody').innerHTML = table;

}


function cleardata() {
    numdevice.value = '';
    pricesingle.value = '';
    multiprice.value = '';
}


function deletedata(i) {
    newdevice.splice(i, 1);
    setToStorage();
}

logout.addEventListener('click', () => {
    window.location = 'login.html'
})
