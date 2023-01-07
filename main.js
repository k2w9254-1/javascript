// canvas setting
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx =   canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver = false;  //true 게임끝!
let score =0;
let spaceshipX = canvas.width/2 -24
let spaceshipY = canvas.height-48
let bulletList = [];

function Bullet(){
    this.x=0; 
    this.y=0;
    this.init =function(){
        this.x = spaceshipX+16.3;
        this.y = spaceshipY;
        this.alive = true // true 살아있는 총알 false 쓰인총알
        bulletList.push(this);
    }
    this.update =function(){
        this.y -= 7;
    }
    this.checkHit =function(){
        for(let i=0;i<enemyList.length;i++){
            if(this.y <=enemyList[i].y && this.x >= enemyList[i].x && this.x<=enemyList[i].x+48){
                score++;
                this.alive =false //죽은 총알   
                enemyList.splice(i,1)
            }

        }
        
    }
}

let enemyList =[];
function Enemy(){
    this.x=0; 
    this.y=0;
    this.init =function(){
        
        this.y = 0;
        this.x = generateRandomValue(0,canvas.width-48)
        enemyList.push(this);
    }
    this.update =function(){
        this.y += 3;   
        if(this.y >canvas.height-48){
            gameOver=true;
            console.log("gameover")
        }
    }
}
function generateRandomValue(min,max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum;
}
function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src ="images/background.jpg";

    spaceshipImage = new Image();
    spaceshipImage.src ="images/spaceship.png";
    
    bulletImage = new Image();
    bulletImage.src ="images/bullet.png";

    enemyImage = new Image();
    enemyImage.src ="images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src ="images/gameover.png";
}

let keysDown={}
function setupKeyboardListener(){
    document.addEventListener("keydown",function(event){
        //console.log("무슨키가 눌렸어?",event.keyCode)
        keysDown[event.keyCode] =true
        console.log("키다운값",keysDown)
    });
    document.addEventListener("keyup",function(){
        delete keysDown[event.keyCode];
        console.log("키다운값",keysDown)
        if(event.keyCode==32){
            createBullet() //총알 생성

        }
    })

}
function createEnemy(){
    const interval =setInterval(function(){
        let e = new Enemy()
        e.init();

    },1000) 
}
function createBullet(){
    console.log("create!");
    let b = new Bullet();
    b.init();
    console.log(bulletList);
}
function update(){
    if(39 in keysDown){
        spaceshipX +=5; //우주선의 속도
        //right
    }
    if(37 in keysDown){
        spaceshipX -=5; //우주선의 속도
        //right
    }
    //경기장 안에서만 있게해주기
    if(spaceshipX <=0){
        spaceshipX=0;
    }
    if(spaceshipX >= canvas.width-48){
        spaceshipX = canvas.width-48;
    }

    for(let i= 0; i<bulletList.length;i++){
        if(bulletList[i].alive){
            bulletList[i].update();
            bulletList[i].checkHit();    
    
        }
        
    }
    for(let i= 0; i<enemyList.length;i++){
        enemyList[i].update();    
    }
    
}
function render(){
    ctx.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY);
    ctx.fillText(`Score:${score}`,20,20);
    ctx.fillStyle ="White";
    ctx.font ="20px Arial";
    for(let i=0; i<bulletList.length;i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
            
    }
    
    for(let i=0; i<enemyList.length;i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y );
    }
}

function main(){
    if(!gameOver){
        update();//좌표값을 업데이트하고
        render();//그려주고
        requestAnimationFrame(main);
    }
    else
    {
        ctx.drawImage(gameOverImage,10,100,380,380);
    }

    
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

//총알 만들기
//1. 스페이바 누르면 발사
//2. 총알발사 총알의 y값 -- ,값은 스페이스를누른 순간의 우주선의 x좌표와같다
//3. 발사된 총알은 총알 배열에 저장
//4. 모든 총알들은  x,y값이 있어야한다.
//5. 총알 배열을 가지고 render 그려준다.