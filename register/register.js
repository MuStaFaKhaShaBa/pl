
let email = document.getElementById('exampleInputEmail1');
let username = document.getElementById('user');
let pass = document.getElementById('exampleInputPassword1');
let btn = document.querySelector('.btn-primary');
let msg = document.getElementById('msg');

//  Save Data localstorage

btn.addEventListener('click' , (e)=>{
        e.preventDefault();
        if(email.value=='' && username.value=='' && pass.value==''){
            msg.style.display = 'block'
        } else{
            localStorage.setItem('email' , email.value);
            localStorage.setItem('username' , username.value);
            localStorage.setItem('password' , pass.value);
            setTimeout(()=>{
                window.location = 'login.html'
            },1000)
        }
})




