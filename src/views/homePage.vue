<template> 
<div class="home-container">
    <img :class="['background-image',{'animation': isMoving}]" src="../assets/home-background.jpg">
    <img :class="['background-image-2',{'animation': isMoving}]" src="../assets/home-background.jpg">
    <div class="header-container">
        <div class="occupation-tag">
            刺
        </div>
        <div class="name">
            {{userId}}
        </div>
        <div class="level-rank">
            LV.{{humanModel.level}}
        </div>
        <div class="life">
            <label class="life-num">
                {{`${humanModel.curLevelExp} / ${totalLife}`}}
            </label>
            <span>经验值</span>
            <progress class="progress is-success" :value="humanModel.curLevelExp" :max="totalLife"></progress>
        </div>
        <div class="money">
            <img src="../assets/coin.png" />
            {{humanModel.money}}
        </div>
    </div>
    <div class="center-conatiner">
        <div class="select-list">
            <div class="select-item">
                技能
            </div>
            <div class="select-item active">
                物品
            </div> 
            <div class="select-item">
                设置
            </div>          
        </div>
        <div class="fighting">
            <div class="monster-life" >
                <label class="life-num" v-show="monsterModel.HP">
                    {{`${monsterModel.HP} / ${monsterModel.maxHP}`}}
                </label>
                <progress v-show="monsterModel.HP" class="progress is-warning" :value="currentLife" :max="monsterModel.maxHP"></progress>     
            </div>
            <div class="fighters">
                <div class="player">
                    <img class="player-pic" src="../assets/assassin-fix.png" />
                </div>
                <div class="monster">
                    <img v-if="monsterModel.HP" src="../assets/monster.png" />
                </div>
            </div>
        </div>
        <div class="empty">
            <div class="button-group">
                <a class="button is-info" @click="beginMoving">开始探索</a>
                <a class="button is-info" @click="stopMoving">关闭webSocket连接</a>
            </div>
        </div>
    </div>
    <div class="bottom-container">
        <div class="player-life">
            <progress class="progress is-danger" style="height:25px;" :value="humanModel.hp" :max="humanModel.maxHP"></progress>   
        </div>
        <div class="detail-content">
            <div class="equipment">
                <div class="weapon">
                </div>
                <div class="weapon"></div>
                <div class="weapon"></div>
            </div>
            <div class="content-box">
                <div class="content-line">
                    生命: {{humanModel.hp}} / {{humanModel.maxHP}}
                </div>
                <div class="content-line">
                    攻击: {{humanModel.atk}}
                </div>
                <div class="content-line">
                    防御: {{humanModel.def}}
                </div>
                <div class="content-line">
                    力量: {{humanModel.power}}
                </div>
                <div class="content-line">
                    体质: {{humanModel.physique}}
                </div>    
                <div class="content-line">
                    敏捷: {{humanModel.agility}}
                </div>     
                <div class="content-line">
                    精神: {{humanModel.spirit}}
                </div> 
                <div class="content-line">
                    耐力: {{humanModel.endurance}}
                </div>  
                <div class="content-line">
                    幸运: {{humanModel.luck}}
                </div>      
            </div>
            <div class="skill-content">
            </div>
            <div class="keyboard-info">
                <div class="key" @click="attack('J')">J</div>
                <div class="key" @click="attack('K')">K</div>
                <div class="key" @click="attack('L')">L</div>
            </div>
        </div>
    </div>
</div> 
</template>
<script>
import { characterMove, characterAttack } from "@/api/game.js"
export default {
    data(){
        return{
            currentLife: 180,
            totalLife: 200,
            websocket: null,
            humanModel: {},
            monsterModel: {},
            stateInfoVO: {},
            userId: '',
            isMoving: false,
        }
    },
    watch: {
        stateInfoVO(newVal){
            console.log('监听state值'+newVal);
            if(newVal.state != 'MOVING'){
                this.isMoving = false;
            }else if(this.isMoving == true){
                console.log('没发现怪物哦');
                this.$toast.open({
                    message: '没有怪物哦～～请继续探索',
                    type: 'is-warning'
                })

            }
        }
    },
    mounted(){
        let userId = this.$route.query.userId;
        this.userId = userId;
        this.humanModel = this.$route.query.humanModel;
        this.stateInfoVO = this.$route.query.stateInfoVO;
        let websocket = null;
        let self = this;
        if('WebSocket' in window){
            websocket = new WebSocket(`ws://120.77.205.70:8066/websocket/${userId}`);
        }
        else{
            this.$toast.open({
                message: '不支持WebSocket',
                type: 'is-danger',
            })
        }
        //连接发生错误的回调方法
        websocket.onerror = function(){
            this.$toast.open({
                message: 'WebSocket链接错误',
                type: 'is-danger'
            })
        };
        //连接成功建立的回调方法
        websocket.onopen = function(event){
            console.log('WebSocket连接已建立');
        }
        //接收到消息的回调方法
        websocket.onmessage = function(event){
            // console.log(event.data);
            let data = JSON.parse(event.data);
            // console.log(data);
            if(data.stateInfoVO){
                self.stateInfoVO = data.stateInfoVO;
            }
            if(data.humanModel){
                self.humanModel = data.humanModel;
            }
            if(data.monsterModel) {
                self.monsterModel = data.monsterModel;    
            }
        }
        //连接关闭的回调方法
        websocket.onclose = function(){
            console.log('websocket连接已关闭');
        }
        this.websocket = websocket;
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function(){
            this.websocket.close();
        }
        // setInterval(this.send,1000)
    },
    methods: {
        attack(key){
            characterAttack(key).then((res) => {
            }).catch((e) => {     
            })
        },
        move(){
            setTimeout(()=> {
                characterMove().then((res) => {     
                }).catch((e) => {
                    this.$toast.open({
                        message: '服务器错误'
                    })
                })
            },3000);
        },
        beginMoving(){
            this.isMoving = true;
            this.move();
        },
        stopMoving() {
            this.isMoving = false;
            this.websocket.close();
        }
        // send(){
        //     // this.websocket.send('test');
        //     // console.log('send');
        //     // var message = document.getElementById('text').value;
        //     // websocket.send(message);
        // }
    }
}
</script>
<style lang="less" scoped>
.tag-back{
    padding: 5px 20px;
    border-radius: 10px;
    background-color: rgba(198, 157, 120, 1);
}
.home-container {
    height: 100%;
    width: 100%;
    // background-image: url('../assets/home-background.jpg');
    background-size: cover;
    display: flex;
    flex-direction: column;
    // animation: frame 5s infinite;
    .background-image {
        height: 100vh;
        width: 100vw;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 0;
        &.animation {
            animation: frame 10s linear infinite;
            @keyframes frame {
                from { right: 0;}
                to {right:100vw;}
            }
        }
    }
    .background-image-2 {
        height: 100vh;
        width: 100vw;
        position: absolute;
        top: 0;
        right: -100vw;
        z-index: 0;
        &.animation {
            animation: frame_2 10s linear infinite;
            @keyframes frame_2 {
                from { right: -100vw;}
                to {right:0vw;}
            }
        }
    }
    .header-container {
        height: 70px;
        display: flex;
        align-items: center;
        position: relative;
        background-color: #2f2d2c;
        color: #ffffff;
        font-weight: bold;
        .occupation-tag {
            top: 35px;
            left:30px;
            height: 70px;
            width: 70px;
            border-radius: 35px;
            position: absolute;
            border: 2px solid #ffffff;
            background-color: rgba(198, 157, 120, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 35px;
            font-weight: bold;
            color: white;
        }
        .name {
            margin-left: 130px;
            font-size: 20px;
            .tag-back;
        }
        .money {
            margin-left: 30px;
            font-size: 20px;
            display: flex;
            align-items: center;
            margin-right: 30px;
            img {
                height:25px;
                width: 25px;
                margin-right: 5px;
            }
            .tag-back;
        }
        .level-rank {
            .money;
        }
        .life {
            flex: 1;
            // width: 300px;
            margin-left: 30px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            .life-num {
                position: absolute;
            }
            span {
                width: 60px;
                margin-right: 10px;
            }
        }
    }
    .center-conatiner {
        flex: 6;
        display: flex;
        .select-list {
            flex: 1;
            padding-top: 60px;
            .select-item {
                margin-top: 10px;
                color: #ffffff;
                text-align: center;
                font-weight: bold;
                width: 60%;
                height: 40px;
                line-height: 40px;
                // background: ;
                background: -webkit-linear-gradient(right,#2f2d2c, #000000);
                opacity: 0.8;
                &.active {
                    width: 80%;
                    font-size: 1.1rem;
                }
            }
        }
        .fighting {
            padding-top: 30px;
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .monster-life {
                position: relative;
                // position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                label {
                    font-size: 1rem;
                    font-weight: bold;
                    color: #ffffff;
                    position: absolute;
                }
            }
            .fighters {
                display: flex;
                justify-content: space-between;
                .player{
                    flex: 3;
                    z-index: 99;
                    .player-pic {
                        height: 330px;
                        width: 450px;
                        display: block;
                    }
                }
                .monster {
                    flex: 1;
                    display: flex;
                    flex-direction: column-reverse;
                    position: relative;
                    img {
                        // position: absolute;
                        // bottom: 0px;
                        // right: 0px;
                        border-radius: 15px;
                        height: 100px;
                        width: 100px;
                        display: block;
                        border: 2px solid #00ffec;
                    }
                }
            }
        }
        .empty {
            flex: 1;
            position: relative;
            .button-group {
                position: absolute;
                bottom: 20px;
                right: 30px;
            }
        }
    }
    .bottom-container {
        z-index: 99;
        flex: 4;
        display: flex;
        flex-direction: column;
        background-color: #2f2d2c;
        .player-life {
            display: flex;
            padding: 0px 60px;
            margin-top: 30px;
            // width: 80%; 
        }
    }
    .detail-content {
        display: flex;
        margin-top: 10px;
        padding: 0px 60px;
        .equipment {
            margin-right: 20px;
            .weapon {
                height: 60px;
                width: 60px;
                margin-top: 10px;
                background: #ffffff;
                border-radius: 5px;
                border: 3px solid orange;
            }
        }
        .content-box {
            background-color: rgba(67, 49, 39, 1);
            border-radius: 20px;
            border:2px solid white;
            flex: 4;
            margin-right: 20px;
            overflow: scroll;
            padding: 10px 10px;
            .content-line {
                color: white;
                font-size: bold;
            }
        }
        .skill-content {
            flex: 5;
            background-color: rgba(135, 84, 45, 1);
            border:2px solid white;
            border-radius: 20px;
            margin-right: 20px;
        }
        .keyboard-info {
            // flex: 1;
            float: right;
            .key {
                height: 60px;
                width: 60px;
                margin-top: 10px;
                background: rgba(198, 157, 120, 1);
                border-radius: 5px;
                border: 3px solid white;     
                font-size: 30px;
                line-height: 60px;
                text-align: center;
                font-weight: bold; 
                color: #ffffff; 
                &:hover {
                    font-size: 38px;
                }
            }
        }
    }
}
</style>

