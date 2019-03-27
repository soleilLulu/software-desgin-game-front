async function isLogin() {
    return new Promise((resolve) => {
        //模拟异步方法
        setTimeout(()=>{
            let timeOut = Math.random(0,1) * 2;
            console.log(timeOut)
            if(timeOut < 1){
                resolve(true);
            }else{
                resolve(false);
            }
        },2000)
    })
}

function checkLogin(){
    isLogin().then((res) => {
        if(res){
            console.log('登录状态');
        }else{
            console.log('非登录状态');
        }
    })
}

checkLogin();