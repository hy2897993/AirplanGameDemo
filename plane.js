;window.onload = function(){
    //get element method
    //so brilliant!!
    function $(idName){
        return document.getElementById(idName);
    }

    //get style values
    function getStyle(ele,attr){
        var res = null;
        if(ele.currentStyle){
            res = ele.currentStyle[attr];
        }else{
            res =  window.getComputedStyle(ele,null)[attr];
        }
        return parseFloat(res);
    }

    //sound register
    const openTrack = $('openTrack');
    const dangerSound = $('dangerSound');
    const laserShoot = $('laserShoot');
    let bgmTime = 0;


    
    

    //start game interface
    var game = $("game")
    //enter game interface
    , gameStart = $("gameStart")
    , gameEnter = $("gameEnter")
    , instruction = $("instruction")
    , myPlane = $("myplane")
    , bulletsP = $("bullets")
    , enemysP = $("enemys")
    , s=$("scores").firstElementChild.firstElementChild;
    //get all elements
    //announce variables
    //1.get game interface size
    var gameW = getStyle(game,"width")
    ,gameH = getStyle(game,"height")
    //2.get game interface top&left margin
    // ,gameML = getStyle(game,"marginLeft")
    // ,gameMT = getStyle(game,"marginTop")
    //3.get myplane width&height
    ,myPlaneW = getStyle(myPlane,"width")
    ,myPlaneH = getStyle(myPlane,"height");
    //4.bullet w&height
    var bulletW = 14
    ,   bulletH = 6; 
     
    //globe variables
    var gameStatus = false
    ,   a = null //bullet clock
    ,   b = null //creat enemy clock
    ,   c = null //background image clock
    ,   backgroundPX = 0 //background Y value
    ,   bullets = []//all bullet elements
    ,   enemys = []//all enemy elements
    ,   scores = 0;
    ;


    //shoot control
    game.onclick = function(){
        if(gameStatus){
            laserShoot.currentTime = 0;
            laserShoot.play();
            createBullet();
        }
    }

    //start game
    gameStart.firstElementChild.onclick = function(){
        gameStart.style.display = "none";
        gameEnter.style.display = "block";
        

        //refresh score
        scores = 0;
        // add keyboard event
        document.onkeyup = function(evt){
            
            var e = evt||window.event;
            //get key value
            var keyVal = e.keyCode;
            if(keyVal == 32){
                if(!gameStatus){
                    //bgm
                    openTrack.currentTime = bgmTime;
                    openTrack.play();

                    setTimeout(()=> instruction.style.opacity = "0" ,2000)
                    //start game
                    this.onmousemove = myPlaneMove;
                    //plane move
                    followMouse()
                    //background move
                    bgMove();
                    //start shooting
                    // shoot();
                    
                    //show enemy
                    appearEnemy();
                    //restart game after paused game
                    if(bullets.length != 0) restart(bullets,1);
                    if(enemys.length != 0)restart(enemys);

                }else{
                    //bgm
                    openTrack.pause();
                    bgmTime = openTrack.currentTime;


                    this.onmousemove = null;
                    //stop enemys and bullets timer
                    clearInterval(a);
                    clearInterval(b);
                    clearInterval(c);
                    a = null;
                    b = null;
                    c = null;
                    //clear all bullet and enemy timers
                    clear(bullets);
                    clear(enemys);
                }
                gameStatus = !gameStatus;
            }
        }
    }
    //myplane movement
    var mouse_x,mouse_y;
    function myPlaneMove(evt){
        
        var e = evt||window.event;
        //get mouse location
        mouse_x = e.clientX||e.pageX;
        mouse_y = e.clientY||e.pageY;
    }
    var x = void 0,
        y = void 0,
        dx = void 0,
        dy = void 0,
        tx = 0,
        ty = 0,
        key = -1;
    var followMouse = function followMouse(){
        key = requestAnimationFrame(followMouse);

        if(!x||!y){
            x = mouse_x;
            y = mouse_y;
        }else{
            dx = (mouse_x - x) * 0.03;
            dy = (mouse_y - y) * 0.03;
            if(Math.abs(dx) + Math.abs(dy) < 0.1){
                x = mouse_x;
                y = mouse_y;
            }else{
                x +=dx;
                y +=dy;
            }
        }
        var last_myPlane_left = x  - myPlaneW/2
        ,   last_myPlane_top = y  - myPlaneH/2;
        
//control plane can not move to outside

        if(last_myPlane_left<=0){
            last_myPlane_left = 0;
        }else if(last_myPlane_left>=gameW-myPlaneW){
            last_myPlane_left = gameW-myPlaneW;
        }
        if(last_myPlane_top<=0){
            last_myPlane_top = 0;   
        }else if(last_myPlane_top>=gameH-myPlaneH){
            last_myPlane_top = gameH-myPlaneH;
        }

        myPlane.style.left = last_myPlane_left + 'px';
        myPlane.style.top = last_myPlane_top + 'px';
    }


    //creat bullet
    function createBullet(){
        var bullet = new Image(18,9);
        bullet.src = "image/04.png";
        // bullet.style.mixBlendMode='multiply';
        bullet.className = "b";

        //plane current location
        var myPlaneL = getStyle(myPlane,"left")
        ,   myPlaneT = getStyle(myPlane,"top");

        //bullet location
        var bulletT = myPlaneT+myPlaneH/2-bulletH/2
        ,   bulletL = myPlaneL+myPlaneW;

        bullet.style.left = bulletL+"px";
        bullet.style.top = bulletT+"px";
        bulletsP.appendChild(bullet);
        bullets.push(bullet);
        move(bullet,"left");
        }
    //bullet movement
    function move(ele,attr){
            var speed = 8;
            ele.timer = setInterval(function(){
                var moveVal = getStyle(ele,attr);
                
                //bullet move out of interface, delete timer and bullet
                if(moveVal >= gameW ){
                    
                    
                    clearInterval(ele.timer);
                    ele.parentNode.removeChild(ele);
                    bullets.splice(0,1);
                    
                }else{
                    ele.style[attr]=moveVal+speed+"px";
                }

            },10);
        }
    // build enemy object
    var enemyObj = {
        enemy1: {
            width:120,
            height:36,
            score:100,
            hp:100,
            fullHp:100
        },
        enemy2: {
            width:175,
            height:47,
            score:500,
            hp:500,
            fullHp:500
        },
        enemy3: {
            width:467,
            height:150,
            score:1000,
            hp:1000,
            fullHp:1000
        }
    };

    //enemys timer
    function appearEnemy(){
        if(b) return;

        dangerSound.currentTime = 0;
        

        A = setTimeout(function(){
            dangerSound.play();
        },3000)

        b = setInterval(function(){
        //creat enemy
        createEnemy();
        //delete dead enemy
        
        delEnemy();
        },3000);
    }
    function createEnemy(){
        //different enemys' chances
        var percentData=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3];
        //type of enemy
        var enemyType = percentData[Math.floor(Math.random()*percentData.length)];
        //get enemy data
        var enemyData = enemyObj["enemy"+enemyType];
        //create the enemy element
        // var enemy = new Image(enemyData.width,enemyData.height);
        var enemy = document.createElement('div');
        enemy.style.backgroundImage = "url('image/enemy"+ enemyType+".png')"
        enemy.style.backgroundPosition = "center"
        enemy.style.backgroundRepeat = "no-repeat"
        enemy.style.backgroundSize= "contain"
        enemy.style.width =enemyData.width+'px'
        enemy.style.height =enemyData.width +'px'

        enemy.t = enemyType;
        enemy.score = enemyData.score;
        enemy.hp = enemyData.hp;
        enemy.fullHp = enemyData.fullHp;
        enemy.className = "e";
        enemy.dead = false;//enemy is alive
        //define the current position of enemy
        var enemyT = Math.floor(Math.random()*(gameH-enemyData.height)-(enemyData.width-enemyData.height)/2)
        ,   enemyL = gameW;
        enemy.style.left = enemyL +"px";
        enemy.style.top = enemyT +"px";

        //why add p is slower than div?
        var enemyHp = document.createElement('p');
        enemyHp.style.width = "60%";
        enemyHp.style.height = "10px";
        enemyHp.style.top = "20%";//invisible ship??
        enemyHp.style.border= "1px solid red";
        enemyHp.style.margin= "auto";
        enemyHp.style.display = "none";
        enemyHp.style.position = "relative";

        var enemyHpVal = document.createElement('p');
        enemyHpVal.style.width = "100%";
        enemyHpVal.style.height = "10px";
        enemyHpVal.style.background= "red";
        
        enemy.appendChild(enemyHp);
        enemyHp.appendChild(enemyHpVal);
        enemysP.appendChild(enemy);
        enemys.push(enemy);
        enemyMove(enemy,"left");
    }
    //enemy movement
    function enemyMove(ele,attr){
        var speed = null;
        if(ele.t == 1){
            speed = -1.5;
        }else if(ele.t == 2){
            speed = -1;
        }else if(ele.t == 3){
            speed = -0.5;
        }
        ele.timer = setInterval(function(){
            var moveVal = getStyle(ele,attr);
            if(moveVal <= -ele.style.width){
                clearInterval(ele.timer);
                enemysP.removeChild(ele);
                enemys.shift(); 
            }else{
                ele.style[attr] = moveVal + speed + "px";
                //moving while testing collision,every enemy
                danger(ele);
                //detect collision
                gameover();

            }
        },10)
    }
    //clear enemy and bullet movement timer
    function clear(childs){
        for(var i = 0;i<childs.length;i++){
            clearInterval(childs[i].timer);
        }
    }
    //restart paused bullets and enemys
    function restart(childs,type){
        for(var i = 0;i<childs.length;i++){
            type == 1 ? move(childs[i],"top") : enemyMove(childs[i],"top");
    }}

    //background image movement
    function bgMove(){
        c = setInterval(function(){
            backgroundPX-=0.5;
            if(backgroundPX<=-3180){
                backgroundPX = 0;
            }
            gameEnter.style.backgroundPositionX = backgroundPX+'px';
            

        },10)

    }
    //test bullets and enemys collision,every bullet
    async function danger(enemy){
        for(var i=0;i<bullets.length;i++){
            //get bullets left-top margin
            var bulletL = getStyle(bullets[i],"left")
            ,   bulletT = getStyle(bullets[i],"top");

            //get enemy left- top margin
            var enemyL = getStyle(enemy,'left')
            ,   enemyT = getStyle(enemy,'top');
 

            var enemyW = getStyle(enemy,'width')
            ,   enemyH = getStyle(enemy,'height');
            var condition = bulletL + bulletW >= enemyL && 
                            bulletL <= enemyL + enemyW && 
                            bulletT <= enemyT + 0.7 * enemyH && //scale down the effective height
                            bulletT + bulletH >= enemyT + 0.3 * enemyH;
            if(condition){
                //detect collision


                //bullets[i].src = "image/bz01.png";//??fix it
                let spark = document.createElement("div");
                spark.style.width = "25px";
                spark.style.height = "25px";
                spark.style.position = "absolute";
                spark.style.backgroundImage = "url(image/bz01.png)";
                spark.style.backgroundSize = "contain";
                spark.style.left = (bulletL-12.5+bulletW/2)+"px";
                spark.style.top = (bulletT-12.5+bulletH/2)+"px";
                bulletsP.appendChild(spark);

                setTimeout(()=> bulletsP.removeChild(spark), 500);

                //1,delete timer
                clearInterval(bullets[i].timer);
                
                
                //2,delete element
                bulletsP.removeChild(bullets[i]);
                //3,remove from array
                bullets.splice(i,1);
                
                
                //4.test hp
                
                enemy.hp-=100;
                
                //show hp value
                var hpObjs = enemy.getElementsByTagName("p")
                hpObjs[0].style.display = "block";
                hpObjs[1].style.width = 100* enemy.hp/enemy.fullHp +"%";
                // enemyHpVal.style.height = "10px";
                // enemyHpVal.style.background= "red";
        
                

                if(enemy.hp==0){
                    //1.timer
                    clearInterval(enemy.timer);
                     
                    
                    
                    if (enemy.t==1){
                        enemy.style.backgroundImage = await "url('image/bz1.gif')";
                    // enemy.style.transform='scaleY(2.768) translateY(-2px)';

                    }else if(enemy.t==2){
                        enemy.style.backgroundImage  = await "url('image/bz2.gif')";

                        // enemy.style.transform='scaleY(2.768) translateY(-2px)';

                    }else if(enemy.t==3){
                        enemy.style.backgroundImage  = await "url('image/bz3.gif')";

                        // enemy.style.transform='scaleY(2.65) translateY(-16px)';

                    }
                    //3.mark dead enemy
                    setTimeout(() => {
                        enemy.dead = true;
                    }, 500);
                    
                    //2.replace explosion gif
                    
                    
                    //caculate score
                    scores += enemy.score;
                    s.innerHTML = scores;
                    
                    
                }
            }

        }
    }
    //delay and delete the dead in array and dead
    function delEnemy(){
        
        for(var i = enemys.length - 1;i>=0;i--){
            if(enemys[i].dead){
                //special syntax!!
                    (function(index){
                        //delete dead enemy from doc
                        enemysP.removeChild(enemys[index]);                   
                        //remove element from array
                        enemys.splice(index,1);
                    })(i)
            }
        }
    }
    //collision my plan
    function gameover(){
        for(var i=0;i<enemys.length;i++){
            if(!enemys[i].dead){
                var enemyL = getStyle(enemys[i],"left")
                ,   enemyT = getStyle(enemys[i],"top")
                ,   enemyW = getStyle(enemys[i],"width")
                ,   enemyH = getStyle(enemys[i],"height")
                ;
                var myPlaneL = getStyle(myPlane,"left")
				,	myPlaneT = getStyle(myPlane,"top");
                var condition = myPlaneL + myPlaneW >= enemyL && 
                                myPlaneL <= enemyL + enemyW 
                                && myPlaneT <= enemyT + 0.7 * enemyH 
                                && myPlaneT + myPlaneH >= enemyT + 0.3 * enemyH;
                if(condition){
                    //1.clear all timer
                    clearInterval(a);
                    a=null;
                    clearInterval(b);
                    b=null;
                    clearInterval(c);
                    c=null;
                    //clear elements
                    remove(bullets);
                    remove(enemys);
                    //clear arrays
                    bullets=[];
                    enemys=[];
                    //clear myplane movement
                    document.onmousemove=null;

                    bgmTime = 0;
                    openTrack.pause();
                    
                    alert("Game over: " + scores + "points");
                    //return to first page
                    gameEnter.style.display="none";
                    gameStart.style.display="block";

                    gameStatus = false;
                    instruction.style.opacity = "1";


                }
            }
        }
    }
    function remove(children){
        for(var i=children.length-1;i>=0;i--){
        clearInterval(children[i].timer);
        children[i].parentNode.removeChild(children[i]);
        }

    }
 
}
