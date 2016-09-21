//使用小人物，有喽啰单位出现，运用像素鸟背景移动原理实现清理完喽啰后人物向前移动，喽啰冲向玩家效果
//每一场战斗的BGM不同的变换，最终BOSS的音效不同
//战斗面板设计，出现对话时隐藏攻击面板
//释放技能时出现  类似DNF觉醒特效
//释放技能时有音效（语音）
//敌人英雄换为SF_DarkLord2000

//简介时背景切换，背景音乐设置，吓人彩蛋
//伴随着被打破的地底魔印，魔族再次返回了大地，在新的魔族君王的带领下，魔族大军攻陷了大量的人族城池，一步一步向人类的王城逼近......
//数日之后，王城沦陷。


//可以加入拖拽彩蛋
//没有锁定不能攻击
var lock = false;
var gamestart = false;
var clickNum = 0;
var talk = false;
var mark = document.getElementById("mark");
var canves = document.getElementById("canves");
var select = document.getElementById("select");
//玩家属性初始化
var player_Hp = document.getElementById("player_Hp");
var player_Mp = document.getElementById("player_Mp");
var player_img = document.getElementById("player_img");
var box_hide = document.getElementById("box_hide");
var bgms = null;
var bgmsbt = null;
var bgm = document.getElementById("bgm");
var box = document.getElementById("box");
var player_Hp_num = 150;
var player_Mp_num = 150;
var player_attack_num = 10;
var player_talk = document.getElementById("player_talk");
var player_say = document.getElementById("player_say");
var magic =document.getElementById("magic");
//敌人属性初始化
var enemy_Hpl = document.getElementById("enemy_Hpl");
var enemy_Hpr = document.getElementById("enemy_Hpr");
var enemyLeft = document.getElementById("enemyLeft");
var enemyRight = document.getElementById("enemyRight");
var enemy_talk = document.getElementById("enemy_talk");
var enemy_say = document.getElementById("enemy_say");
var enemy_Hpl_num = 150;
var enemy_Hpr_num = 150;
var enemyName = ["Jack", "Boss", "marry", "Jayson", "小强"];
var attack_action_num = 0;
//锁定敌人
var enemy_select1 = document.getElementById("enemy_imgl");
var enemy_select2 = document.getElementById("enemy_imgr");
var selectEnemy = null;
enemy_select1.onclick = function () {
    if (gamestart) {
        selectEnemy = 'enemyl';
        console.log("锁定敌人1");
        lock = true;
        clickNum = 1;
        start();
    }
}
enemy_select2.onclick = function () {
    if (gamestart) {
        selectEnemy = 'enemyr';
        console.log("锁定敌人2");
        lock = true;
        clickNum = 2;
        start();
    }
}
player_img.onclick = function () {
    replaceClassName(select, "hide", "show");

};
select.onclick = function () {
    replaceClassName(select, "show", "hide");
};


//HP初始化
function rstBlood() {
    enemy_Hpl.style.width = enemy_Hpl_num + 'px';
    enemy_Hpr.style.width = enemy_Hpr_num + 'px';
    player_Hp.style.width = player_Hp_num + 'px';
    player_Mp.style.width = player_Mp_num + 'px';
}
rstBlood();
//HP减少特效（伪）
function lostHp(how, much) {
    switch (how) {
        case 'player':
            if (player_Hp_num - much <= 0) {
                player_Hp_num = 0;
            }
            else {
                player_Hp_num -= much;
            }
            break;
        case 'enemyl':
            if (enemy_Hpl_num - much <= 0) {
                enemy_Hpl_num = 0;
                enemyLeft.className = "enemy-l hide";
                resetBgm();
                createElementBgm("03_Battle_to_the_Max");
                clickNum = 6;
                start();
            }
            else {
                enemy_Hpl_num -= much;
            }
            break;
        case 'enemyr':
            if (enemy_Hpr_num - much <= 0) {
                enemy_Hpr_num = 0;
                resetBgm();
                enemyRight.className = "enemy-r hide";
                if (enemy_Hpl_num > 0) {
                clickNum = 7;
                start();}
                createElementBgm("03_The_Final_Battle");
            }
            else {
                enemy_Hpr_num -= much;
            }
    }
    rstBlood();
    gameover();
    lock = false;
}
//抖动特效
function imgMove(who) {
    var star = who.style.left;
    var timerM = null;
    timerM = setInterval(function () {
        who.style.left = star - random(1, 8) + 'px';
        who.style.left = star + random(1, 8) + 'px';
    }, 100);
    setTimeout(function () {
        clearInterval(timerM);
        who.style.left = star;
    }, 2500);
}
//设计玩家英雄
var player = {
    "name": "GH",//prompt("你的名字")
    "hp": player_Hp_num,
    "mp": player_Mp_num,
    "attack_num": player_attack_num,
    "attack": function () {
        if (lock) {
            boomMagic(selectEnemy);
            createElementBgmBT("Claw");
            imgMagic(boom, 5, 1, -192, "url(images/Claw.png)");
            lostHp(selectEnemy, player_attack_num);
            if (enemy_Hpl_num > 0) {
                setTimeout(function () {
                    boomMagic();
                    enemy1.attack(enemy_Hpl_num, enemy1.attack_num);
                }, 3000);
            }
            if (enemy_Hpr_num > 0) {
                setTimeout(function () {
                    boomMagic();
                    enemy2.attack(enemy_Hpr_num, enemy2.attack_num);
                }, 6000);
            }
        } else {
            clickNum = 10;
            start();
        }
    },
    "defense": function () {
        enemy1.attack(enemy_Hpl_num, 0);
        enemy2.attack(enemy_Hpr_num, 0);
    },
    "magics": function (num) {
        if (lock) {
            switch (num) {
                case 4:
                    replaceClassName(magic,"show","hide");
                    break;
                case 1:
                    if (player_Mp_num >= 50) {
                        player_Mp_num -= 50;
                        boomMagic(selectEnemy);
                        createElementBgmBT("Cure4");
                        imgMagic(boom, 5, 3, -192, "url(images/Cure4.png)");
                        lostHp(selectEnemy, player_attack_num*2);
                        if (enemy_Hpl_num > 0) {
                            setTimeout(function () {
                                boomMagic();
                                enemy1.attack(enemy_Hpl_num, enemy1.attack_num);
                            }, 3000);
                        }
                        if (enemy_Hpr_num > 0) {
                            setTimeout(function () {
                                boomMagic();
                                enemy2.attack(enemy_Hpr_num, enemy2.attack_num);
                            }, 6000);
                        }
                    } else {
                        console.log("魔法不足");
                        return;
                    }
                    break;
                case 2:
                    if (player_Mp_num >= 100) {
                        player_Mp_num -= 100;
                        boomMagic(selectEnemy);
                        createElementBgmBT("Explosion2");
                        imgMagic(boom, 5, 6, -192, "url(images/Explosion2.png)");
                        lostHp(selectEnemy, player_attack_num * 5);
                        if (enemy_Hpl_num > 0) {
                            setTimeout(function () {
                                boomMagic();
                                enemy1.attack(enemy_Hpl_num, enemy1.attack_num);
                            }, 3000);
                        }
                        if (enemy_Hpr_num > 0) {
                            setTimeout(function () {
                                boomMagic();
                                enemy2.attack(enemy_Hpr_num, enemy2.attack_num);
                            }, 6000);
                        }
                    } else {
                        console.log("魔法不足");
                        return;
                    }
                    break;
                case 3:
                    if (player_Mp_num >= 80) {
                        player_Mp_num -= 80;
                        boomMagic();
                        createElementBgmBT("Recovery");
                        imgMagic(boom, 5, 6, -192, "url(images/Recovery1.png)");
                            player_Hp_num += 80;
                            if (player_Hp_num >= 150) {
                                player_Hp_num = 150;
                            }

                    } else {
                        console.log("魔法不足");
                        return;
                    }
                    break;
            }
            if (enemy_Hpl_num > 0) {
                setTimeout(function () {
                    boomMagic();
                    enemy1.attack(enemy_Hpl_num, enemy1.attack_num);
                }, 3000);
            }
            if (enemy_Hpr_num > 0) {
                setTimeout(function () {
                    boomMagic();
                    enemy2.attack(enemy_Hpr_num, enemy2.attack_num);
                }, 6000);
            }
        }
    },
    "goods": function (num) {
        switch (num){
            case 0:
                break;
        }
    }
};

//敌人攻击模式
function enemyAction(Hp_num, who_attack_num, who) {
    if (Hp_num >= 120) {
        attack_action_num = 1;
    }
    else if (Hp_num >= 80) {
        attack_action_num = random(1, 2);
    }
    else if (Hp_num >= 40) {
        attack_action_num = random(2, 5);
    }
    else {
        attack_action_num = random(3, 5);
    }
    switch (attack_action_num) {
        case 1://普通攻击
            lostHp('player', who_attack_num);
            player_Mp_num += 10;
            if (player_Mp_num > 150) {
                player_Mp_num = 150;
            }
            if (who == "enemy1") {
                createElementBgmBT("Darkness3");
                imgMagic(boom, 5, 2, -192, "url(images/Darkness3.png)");
            } else {
                createElementBgmBT("SlashThunder");
                imgMagic(boom, 5, 3, -192, "url(images/SlashThunder.png)");
            }
            break;
        case 2://重击
            lostHp('player', who_attack_num * 2);
            player_Mp_num += 10;
            if (player_Mp_num > 150) {
                player_Mp_num = 150;
            }
            if (who == "enemy1") {
                // createElementBgmBT("ClawSpecial1");
                // imgMagic(boom, 5, 5, -192, "url(images/ClawSpecial1.png)");//ok
                createElementBgmBT("Darkness1");
                imgMagic(boom, 5, 4, -192, "url(images/Darkness1.png)");
            } else {
                createElementBgmBT("HitThunder");
                imgMagic(boom, 5, 2, -192, "url(images/HitThunder.png)");//ok
            }
            break;
        case 3://魔法
            lostHp('player', who_attack_num * 3);
            player_Mp_num += 15;
            if (player_Mp_num > 150) {
                player_Mp_num = 150;
            }
            if (who == "enemy1") {
                createElementBgmBT("Darkness5");
                imgMagic(boom, 5, 5, -192, "url(images/Darkness5.png)");//ok
            } else {
                createElementBgmBT("ClawSpecial1");
                imgMagic(boom, 5, 5, -192, "url(images/ClawSpecial1.png)");//ok
            }
            break;
        case 4://狂暴
            lostHp(player, who_attack_num * 4);
            player_Mp_num += 20;
            if (player_Mp_num > 150) {
                player_Mp_num = 150;
            }
            if (who == "enemy1") {
                createElementBgmBT("StateDeath");
                imgMagic(boom, 5, 4, -192, "url(images/StateDeath.png)");
                //ok
            } else {
                createElementBgmBT("Thunder5");
                imgMagic(boom, 5, 4, -192, "url(images/Thunder5.png)");//ok
            }
            break;
    }
}

//fire


//攻击特效
var boom = document.getElementById("boom");
//e1
//l:747
//t:213
//e2
//l:760
//t:425
//pl
//l:35
//t:275
//技能特效
function boomMagic(who) {
    if (who == "enemyl") {
        boom.style.left = 747 + 'px';
        boom.style.top = 213 + 'px';
        imgMove(enemy_select1);
    }
    else if (who == "enemyr") {
        boom.style.left = 760 + 'px';
        boom.style.top = 425 + 'px';
        imgMove(enemy_select2);
    }
    else {
        boom.style.left = 35 + 'px';
        boom.style.top = 275 + 'px';
        imgMove(player_img);
    }
}


function imgMagic(who, X, Y, num, url) {
    replaceClassName(who, 'hide', 'show');
    var x = 0, y = 0;
    who.style.backgroundImage = url;
    var timer = null;
    clearInterval(timer);
    timer = setInterval(function () {
        x += num;
        if (x > X * num) {
            who.style.backgroundPositionX = x + 'px';
            who.style.backgroundPositionY = y + 'px';
        } else {
            y += num;
            x = 0;
            who.style.backgroundPositionX = x + 'px';
            who.style.backgroundPositionY = y + 'px';
        }
        if (y <= Y * num) {
            x = 0;
            y = 0;
            clearInterval(timer);
            replaceClassName(who, 'show', 'hide');
        }
    }, 100);
}

//设计敌人
function Enemy(hp, attackNum, id) {
    this.name = enemyName[random(0, 4)];
    this.hp = hp;
    this.attack_num = attackNum;
    this.id = id;
}

Enemy.prototype.attack = function (who_Hp, who_attack_num) {
    enemyAction(who_Hp, who_attack_num, this.id);
};
Enemy.prototype.magic = function (who_Hp, who_attack_num) {
    enemyAction(who_Hp, who_attack_num, this.id);
};
var enemy1 = new Enemy(enemy_Hpl_num, 8, "enemy1");
var enemy2 = new Enemy(enemy_Hpr_num, 5, "enemy2");

//游戏结束
function gameover() {
    if (player_Hp_num == 0 && enemy_Hpl_num == 0 && enemy_Hpr_num == 0) {
        alert("你和怪物同归于尽!");

        window.location.reload(true);
    }
    else if (player_Hp_num <= 0 && (enemy_Hpl_num >= 0 || enemy_Hpr_num >= 0)) {
        alert("你被怪物抓走了!游戏结束");
        window.location.reload(true);
    }
    else if ((enemy_Hpl_num <= 0 && enemy_Hpr_num <= 0) && player_Hp_num >= 0) {
        alert("大英雄！你赢了!");
        window.location.reload(true);
    }
}


//音乐
function createElementBgmBT(bgmName) {
    bgmsbt = document.createElement("AUDIO");
    bgmsbt.setAttribute("src", "bgm/" + bgmName + ".ogg");
    // bgmsbt.setAttribute("loop", "loop");
    bgm.appendChild = bgmsbt;
    bgmsbt.play();
}
function createElementBgm(bgmName) {
    bgms = document.createElement("AUDIO");
    bgms.setAttribute("src", "bgm/" + bgmName + ".ogg");
    // bgms.setAttribute("loop", "loop");
    bgm.appendChild = bgms;
    bgms.play();
}
createElementBgm("Theme6");
function gameStar() {
    bgms.pause();
    createElementBgm("Decision1");
    replaceClassName(canves, "hide", "show");
    animate(mark, {"opacity": 1}, function () {
        box_hide.style.display = "none";
        replaceClassName(canves, "hide", "show");
        start();
        resetBgm();
    });

}
function resetBgm() {//只能停止当前播放的音乐
    bgms.pause();
    // console.log(bgms);
    // audio.addEventListener('ended', function () {
    //     // Wait 500 milliseconds before next loop
    //     setTimeout(function () {if(index<4){ bgms.play(); index++}}, 500);
    // }, false);
    if (enemy_Hpl_num > 0 && enemy_Hpr_num > 0) {
        createElementBgm("Battle1");
        // setTimeout(function () {
        //     resetBgm();
        // },71000);
    }
    else {
        // createElementBgm("name");
    }
}
//盒子显示隐藏
function replaceClassName(element, oldStr, newStr) {
    var arr = element.className.split(" ");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === oldStr) {
            arr[i] = newStr;
        }
    }
    element.className = arr.join(" ");
}
//随机数
function random(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

enemyLeft.onmousedown = function (event) {
    if (gamestart) {
        var event = event || window.event;
        var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
        var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
        var boxX = pageX - enemy_select1.offsetLeft;
        var boxY = pageY - enemy_select1.offsetTop;
        document.onmousemove = function (event) {
            // clickNum = 6;
            // start();
            var event = event || window.event;
            var pageX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            var pageY = event.pageY || event.clientY + document.documentElement.scrollTop;
            enemy_select1.style.left = pageX - boxX + "px";
            enemy_select1.style.top = pageY - boxY + "px";
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            if (talk) {
                talk = false;
                clickNum = 4;
                start();
            }
            if (pageX > 1600) {
                enemy_Hpl_num = 0;
                replaceClassName(enemyLeft, "show", "hide");
                clickNum = 5;
                start();
            }
        }
    }
};

document.onmouseup = function () {
    document.onmousemove = null;
};

function start() {
    switch (clickNum) {
        case 0:
            replaceClassName(player_talk, "hide", "show");
            player_say.innerHTML = "欢迎体验游戏，我是本次游戏的向导~请多指教！";
            setTimeout(function () {
                player_say.innerHTML = "首先，任务为控制本方英雄（左方为本方英雄）击退怪物，本次的怪物有两只，想要攻击哪只怪物就点击锁定它。PS：不锁定怪物，英雄是不会攻击的哟！";
            }, 4000);
            setTimeout(function () {
                player_say.innerHTML = "请先试着锁定一个怪物吧！";
                setTimeout(function () {
                    replaceClassName(player_talk, "show", "hide");
                    clickNum = 3;
                    start();
                }, 3000);
            }, 8000);

            break;
        case 1:
            replaceClassName(player_talk, "hide", "show");
            player_say.innerHTML = "上方的怪物已被锁定！";
            setTimeout(function () {
                replaceClassName(player_talk, "show", "hide");
            }, 2000);
            //enemy_say
            break;
        case 2:
            replaceClassName(player_talk, "hide", "show");
            player_say.innerHTML = "下方的怪物已被锁定！";
            setTimeout(function () {
                replaceClassName(player_talk, "show", "hide");
            }, 2000);
            break;
        case 3:
            replaceClassName(enemy_talk, "hide", "show");
            enemy_say.innerHTML = "凡人，吾乃镇守魔殿的典狱长，这里不是你该来的地方！";
            setTimeout(function () {
                enemy_say.innerHTML = "既然来了，凡人，那就留下你的命吧！";
                talk = true;
                gamestart = true;
                setTimeout(function () {
                    enemy_say.innerHTML = "让你见识见识魔族真正的力量，在我的面前颤抖吧，凡人！";
                    setTimeout(function () {
                        replaceClassName(enemy_talk, "show", "hide");
                    }, 8000)
                }, 6000);
            }, 4000);
            break;
        case 4:
            replaceClassName(enemy_talk, "hide", "show");
            enemy_say.innerHTML = "你想干什么！！！";
            setTimeout(function () {
                enemy_say.innerHTML = "凡人！你根本不知道你在做什么，快停手！！！";
                setTimeout(function () {
                    replaceClassName(enemy_talk, "show", "hide");
                }, 3000);
            }, 3000);
            break;
        case 5:
            replaceClassName(enemy_talk, "hide", "show");
            enemy_say.innerHTML = "呃~啊啊啊！！你永远无法消灭魔族，我还会回来的！！！";
            setTimeout(function () {
                replaceClassName(enemy_talk, "show", "hide");
            }, 3000);
            break;
        case 6:
            replaceClassName(enemy_talk, "hide", "show");
            enemy_say.innerHTML = "魔君会复活我的！你永远无法战胜魔族！！！";
            setTimeout(function () {
                replaceClassName(enemy_talk, "show", "hide");
            }, 3000);
            break;
        case 7:
            replaceClassName(enemy_talk, "hide", "show");
            enemy_say.innerHTML = "你竟然干掉了我的仆人，不可饶恕！！！";
            setTimeout(function () {
                replaceClassName(enemy_talk, "show", "hide");
            }, 3000);
            break;
        case 8:
            break;
        case 9:
            break;
        case 10:
            player_say.innerHTML = "请先锁定敌人！";
            break;
    }
    player_talk.onclick = function () {
        clickNum++;
    };
    enemy_talk.onclick = function () {
        clickNum++;
    };

    if (clickNum) {

    }
}

function animate(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;
        for (var k in json) {
            if (k === "opacity") {
                var leader = getStyle(obj, k) * 100;
                var target = json[k] * 100;
                var step = (target - leader) / 50;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                obj.style[k] = leader / 100;
                if (leader != target) {
                    flag = false;
                }
            } else if (k === "zIndex") {
                obj.style.zIndex = json[k];
            } else {
                var leader = parseInt(getStyle(obj, k)) || 0;
                var target = json[k];
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                obj.style[k] = leader + "px";
                if (leader != target) {
                    flag = false;
                }
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    }, 15);
}

function getStyle(obj, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}
//盒子显示
function show(name) {
    replaceClassName(name,"hide","show");
}
function hide(name) {
    replaceClassName(name,"show","hide");
}