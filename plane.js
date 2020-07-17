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
    
    

    //start game interface
    var game = $("game")
    //enter game interface
    , gameStart = $("gameStart")
    , gameEnter = $("gameEnter")
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
    ,gameML = getStyle(game,"marginLeft")
    ,gameMT = getStyle(game,"marginTop")
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
                    
                    //start game
                    this.onmousemove = myPlaneMove;
                    //plane move
                    followMouse()
                    //background move
                    bgMove();
                    //start shooting
                    shot();
                    //show enemy
                    appearEnemy();
                    //restart game after paused game
                    if(bullets.length != 0) restart(bullets,1);
                    if(enemys.length != 0)restart(enemys);

                }else{
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

        
        // myPlane.timer = setInterval(function () {
        //     console.log('timer')
            
        //     if(last_myPlane_left>myPlane.style.left){
        //         myPlane.style.left = myPlane.style.left+1+"px";

        //     }
        //     else if(last_myPlane_left<myPlane.style.left){
        //         myPlane.style.left = myPlane.style.left-1+"px";

        //     }else{
        //         myPlane.style.left = myPlane.style.left+"px";
        //     }
        //     if(last_myPlane_top>myPlane.style.top){
        //         myPlane.style.top = 1+myPlane.style.top+"px";

        //     }
        //     else if(last_myPlane_top<myPlane.style.top){
        //         myPlane.style.top = myPlane.style.top-1+"px";

        //     }else{
        //         myPlane.style.top = myPlane.style.top+"px";
        //     }
        // },1000)
        // if(myPlane.style.left == last_myPlane_left+"px"&&myPlane.style.top == last_myPlane_top+"px")
        // {
        //     clearInterval(myPlane.timer);
        // }
    
    function sddvsd(last_myPlane_left,last_myPlane_top){
        myPlane.timer = setInterval(function () {
            var speed = 0.01;
            if(last_myPlane_left>myPlane.style.left){
                myPlane.style.left = speed+last_myPlane_left+"px";

            }
            else if(last_myPlane_left<myPlane.style.left){
                myPlane.style.left = -speed+last_myPlane_left+"px";

            }
            if(last_myPlane_top>myPlane.style.top){
                myPlane.style.top = speed+last_myPlane_top+"px";

            }
            else if(last_myPlane_top<myPlane.style.top){
                myPlane.style.top = -speed+last_myPlane_top+"px";

            }
        },100)

    }
    // creat bullets timer
    function shot(){
        if(a) return;
        a = setInterval(function(){
            createBullet();
        },500);
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
            hp:100
        },
        enemy2: {
            width:175,
            height:47,
            score:500,
            hp:500
        },
        enemy3: {
            width:467,
            height:150,
            score:1000,
            hp:1000
        }
    };

    //enemys timer
    function appearEnemy(){
        if(b) return;
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
        var enemy = new Image(enemyData.width,enemyData.height);
        enemy.src = "image/enemy"+enemyType+".png"
        enemy.t = enemyType;
        enemy.score = enemyData.score;
        enemy.hp = enemyData.hp;
        enemy.className = "e";
        enemy.dead = false;//enemy is alive
        //define the current position of enemy
        var enemyT = Math.floor(Math.random()*(gameH-enemyData.height))
        ,   enemyL = gameW;
        enemy.style.left = enemyL +"px";
        enemy.style.top = enemyT +"px";
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
            var condition = bulletL + bulletW >= enemyL && bulletL <= enemyL + enemyW && bulletT <= enemyT + enemyH && bulletT + bulletH >= enemyT;
            if(condition){
                //detect collision
                //1,delete timer
                clearInterval(bullets[i].timer);
                //2,delete element
                bulletsP.removeChild(bullets[i]);
                //3,remove from array
                bullets.splice(i,1);
                //4.test hp
                
                enemy.hp-=100;
                if(enemy.hp==0){
                    //1.timer
                    clearInterval(enemy.timer);
                     
                    
                    
                    if (enemy.t==1){
                        enemy.src = await "image/bz1.gif";
                    enemy.style.transform='scaleY(2.768) translateY(-2px)';

                    }else if(enemy.t==2){
                        enemy.src = await "image/bz2.gif";

                        enemy.style.transform='scaleY(2.768) translateY(-2px)';

                    }else if(enemy.t==3){
                        enemy.src = await "image/bz3.gif";

                        enemy.style.transform='scaleY(2.65) translateY(-16px)';

                    }
                    //3.mark dead enemy
                    setTimeout(() => {
                        enemy.dead = true;
                    }, 1000);
                    
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
                var condition = myPlaneL + myPlaneW >= enemyL && myPlaneL <= enemyL + enemyW && myPlaneT <= enemyT + enemyH && myPlaneT + myPlaneH >= enemyT;
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
                    alert("Game over: " + scores + "points");
                    //return to first page
                    gameEnter.style.display="none";
                    gameStart.style.display="block";

                    myPlane.style.left = "127px";
					myPlane.style.top = gameH - myPlaneH + "px";


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
