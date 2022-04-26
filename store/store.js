
let deviceinfo = document.querySelector('.deviceinfo');
let adddevice = document.querySelector('.adddevice');
let close = document.getElementById('close');
let logout = document.querySelector('.logout');

deviceinfo.style.display = 'none'


adddevice.addEventListener('click', () => {
    deviceinfo.style.display = 'block'
})


close.addEventListener('click', () => {
    deviceinfo.style.display = 'none'
})

// Add Product;

let nameproduct = document.getElementById('name');
let salebuy = document.getElementById('salebuy');
let addde = document.getElementById('addde')


let newproduct;

if (localStorage.newproduct != null) {
    newproduct = JSON.parse(localStorage.newproduct)

} else {
    newproduct = [];
}




addde.addEventListener('click', () => {

    if (nameproduct.value == '' || salebuy.value == '') {
        alert('تأكد من البيانات المدخله')
        return;
    }

    let newproductdata = {
        nameproduct: nameproduct.value,
        salebuy: salebuy.value,
    }

    newproduct.push(newproductdata)
    localStorage.setItem('newproduct', JSON.stringify(newproduct))

    cleardata();
    showdata();

    deviceinfo.style.display = 'none'

})


function showdata() {
    let table = '';

    for (let i = 0; i < newproduct.length; i++) {
        table += `
        <tr>
        <td id="number">${newproduct[i].nameproduct}</td>
        <td id="single">${newproduct[i].salebuy}</td>

        <td style="display: flex;">
            <button onclick="deletedata(${i})" id="delete" style="margin-left:25px; margin-top:10px">delete</button>
        </td>
    </tr>
        `
    }
    document.getElementById('tbody').innerHTML = table;
}

showdata();

function cleardata() {
    nameproduct.value = '';
    salebuy.value = '';
}


function deletedata(i) {
    newproduct.splice(i, 1);

    localStorage.newproduct = JSON.stringify(newproduct)

    showdata();
}

logout.addEventListener('click', () => {
    window.location = 'login.html'
})