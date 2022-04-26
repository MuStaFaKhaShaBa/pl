
let username = document.getElementById('user');
let pass = document.getElementById('exampleInputPassword1');
let btn = document.querySelector('.btn');
let msg = document.getElementById('msg');


// get data from database

let uservalue = localStorage.getItem('username');
let passvalue = localStorage.getItem('password');

btn.addEventListener('click' , (e)=>{
        e.preventDefault();

        if(username.value==uservalue && pass.value==passvalue){
            setTimeout(()=>{
                window.location = 'index.html'
            },1000)
        } else{
                msg.style.display = 'block'
        }
})


