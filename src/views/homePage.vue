<template> 
<div class="home-container">
    <img :class="['background-image',{'animation': isMoving}]" src="../assets/home-background.jpg">
    <img :class="['background-image-2',{'animation': isMoving}]" src="../assets/home-background.jpg">
    <div class="header-container">
        <div class="occupation-tag">
            {{humanTypeTag}}
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
            <div :class="['select-item',{'active':currentTab == 'skill'}]" @click="changeTab('skill')">
                技能介绍
            </div>
            <div :class="['select-item',{'active':currentTab == 'object'}]" @click="changeTab('object')">
                物品
            </div> 
            <!-- <div :class="['select-item',{'active':currentTab == 'set'}]" @click="changeTab('set')">
                设置
            </div>      -->
            <div :class="['select-item',{'active': currentTab == 'log'}]" @click="changeTab('log')">
                日志
            </div>         
        </div>
        <div class="fighting">
            <div class="monster-life" >
                <label class="life-num" v-show="monsterModel.hp && monsterModel.hp > 0">
                    {{`${monsterModel.hp} / ${monsterModel.maxHP}`}}
                </label>
                <progress v-show="monsterModel.hp && monsterModel.hp > 0" class="progress is-warning" :value="monsterModel.hp" :max="monsterModel.maxHP"></progress>     
            </div>
            <div class="fighters">
                <div class="player">
                    <img class="player-pic" v-if="humanType == 'ASSASSIN'" src="../assets/assassin-fix.png" />
                    <img class="player-pic" v-if="humanType == 'DOCTOR'" src="../assets/pastor-fix.png" />
                    <img class="player-pic" v-if="humanType == 'SOLDIER'" src="../assets/warrior-fix.png" />
                </div>
                <div class="monster">
                    <img v-if="monsterModel.hp && monsterModel.hp > 0" src="../assets/monster.png" />
                </div>
            </div>
        </div>
        <div class="empty">
            <div class="keyboard-info">
                <div class="key" v-for="(item,index) of humanModel.skills" :key="index" @click="attack(item.key)">
                    {{item.name}}
                </div>
                <!-- <div class="key" @click="attack('H')"></div>
                <div class="key" @click="attack('J')">J</div>
                <div class="key" @click="attack('K')">K</div>
                <div class="key" @click="attack('L')">L</div> -->
            </div>
            <div class="button-group">
                <div class="lookaround" v-show="stateInfoVO.state == 'MOVING'" @click="beginMoving" >
                    探索
                </div>
                <!-- <a class="lookaround">开始探索</a> -->
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
                    <img v-if="humanModel.role && humanModel.role.head" :src="humanModel.role.head.url" />
                </div>
                <div class="weapon">
                    <img v-if="humanModel.role && humanModel.role.weapon" :src="humanModel.role.weapon.url" />
                </div>
                <div class="weapon">
                    <img v-if="humanModel.role && humanModel.role.body" :src="humanModel.role.body.url" />
                </div>
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
                <!-- 游戏日志 -->
                <div v-if="currentTab == 'log'">
                    <div v-for="(item,index) of logList" :key='index'>
                        {{item}}
                    </div>
                </div>
                <!-- 物品栏 -->
                <div class="object-list" v-if="currentTab == 'object'">
                    <div :class="['object-item',{'opacity': currentObjectType != 'equip'}]" v-for="(item,index) of humanModel.bag" :key="index">
                        <a @click="handleEquipment(item.uuid)"><img :src="item.url" /></a>
                    </div>
                </div>
                <!-- 技能介绍 -->
                <div class="skill-list" v-if="currentTab == 'skill'">
                    <div class="skill-item" v-for="(item,index) of humanModel.skills" :key="index">
                        <label>{{item.name}}</label><br/>
                        <span>技能介绍:</span>{{item.description}};
                        <span>CD回合:</span>{{item.cd}};
                        <span>当前剩余回合:</span>{{item.remainCd}};
                    </div>
                </div>
            </div>
            <div class="equipment-handle" v-if="currentTab == 'object'">
                <div class="equip strength">
                    <a class="button is-success" @click="handleEquipmentState('strength')">{{currentObjectType == 'strength'? '取消强化' : '装备强化'}}</a>
                </div>
                <div class="equip split">
                    <a class="button is-danger" @click="handleEquipmentState('split')">{{currentObjectType == 'split'? '取消分解' : '装备分解'}}</a>
                </div>
            </div>
            <!-- <div class="keyboard-info">
                <div class="key" @click="attack('J')">J</div>
                <div class="key" @click="attack('K')">K</div>
                <div class="key" @click="attack('L')">L</div>
            </div> -->
        </div>
    </div>
</div> 
</template>
<script>
import { characterMove, characterAttack, characterEquip, characterSplit, characterStrength } from "@/api/game.js"
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
            humanTypeTag: '刺',
            humanType: 'ASSASSIN',
            playerPic: '../assets/assassin-fix.png',
            logList: ['人物初始化'],
            currentTab: 'log',
            currentObjectType: 'equip',
        }
    },
    computed:{
    },
    watch: {
        stateInfoVO(newVal){
            console.log('监听state值'+newVal);
            if(newVal.state != 'MOVING'){
                this.isMoving = false;
            }else if(this.isMoving == true){
                this.$toast.open({
                    message: '没有怪物哦～～请继续探索',
                    type: 'is-warning'
                })
            }
            if(newVal.curLog){
                this.logList.push(newVal.curLog);
            }
        }
    },
    mounted(){
        let userId = this.$route.query.userId;
        this.userId = userId;
        this.humanModel = this.$route.query.humanModel;
        this.stateInfoVO = this.$route.query.stateInfoVO;
        // let currentType = '';
        switch(this.humanModel.humanType){
            case 'ASSASSIN':
                this.humanTypeTag = '刺';
                this.playerPic = '../assets/assassin-fix.png';
                break;
            case 'DOCTOR':
                this.humanTypeTag = '牧';
                this.playerPic = '../assets/pastor-fix.png';
                break;
            case 'SOLDIER':
                this.humanTypeTag = '狂';
                this.playerPic = '../assets/warrior-fix.png';
                break;
        }
        this.humanType = this.humanModel.humanType;
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
            self.$toast.open({
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
        handleEquipment(uuid){
            switch(this.currentObjectType){
                case 'equip':
                    this.equip(uuid);
                    break;
                case 'strength':
                    this.strength(uuid);
                    break;
                case 'split':
                    this.split(uuid);
                    break;
            }
        },
        //处理物品状态
        handleEquipmentState(buttonType){
            if(buttonType == this.currentObjectType){
                this.currentObjectType = 'equip';
            }else {
                this.currentObjectType = buttonType;
            }
        },
        //分解物品
        split(uuid){
            characterSplit(uuid).then((res) => {
                if(res.data.code != 0){
                    this.$toast.open({
                        message: res.data.res,
                        type: 'is-danger'
                    })    
                }else {
                    this.humanModel = res.data.res;
                    this.$toast.open({
                        message: '分解成功',
                        type: 'is-success'
                    })
                }
            })
        },
        //强化物品
        strength(uuid){
            characterStrength(uuid).then((res) => {
                if(res.data.res.successFlag){
                    this.$toast.open({
                        message: '强化成功',
                        type: 'is-success'
                    })
                    this.humanModel = res.data.res.humanModel;
                }else {
                    this.$toast.open({
                        message: '强化失败',
                        type: 'is-danger'
                    })
                }
            }).catch((e) => {
                console.log(e);
            })
        },
        //装备物品
        equip(uuid){
            characterEquip(uuid).then((res) => {
                console.log(res);
                if(res.data.code != 0){
                    this.$toast.open({
                        message: res.data.res,
                        type: 'is-danger'
                    })
                }else{
                    this.humanModel = res.data.res;
                    this.$toast.open({
                        message: '装备成功',
                        type: 'is-success'
                    })
                }
            }).catch((e) => {
  
            })
        },
        //切换tab
        changeTab(tabName){
            if(tabName == this.currentTab){
                return;
            }
            this.currentTab = tabName;
        },
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
                &:hover {
                    width: 70%;
                }
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
                .lookaround {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    color: white;
                    background-color: rgba(198, 157, 120, 1);
                    border: 2px solid white;
                    height: 80px;
                    width: 80px;
                    border-radius: 40px;
                    &:hover {
                        margin-right: -5px;
                        // margin-top: -5px;
                        height: 90px;
                        width: 90px;
                        border-radius: 50px;
                    }
                }
            }
            .keyboard-info {
                // flex: 1;
                margin-top: 20px;
                float: right;
                .key {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding:5px;
                    // height: 60px;
                    // width: 60px;
                    margin-top: 10px;
                    background: rgba(198, 157, 120, 1);
                    border-radius: 5px;
                    border: 3px solid white;     
                    font-size: 18px;
                    // line-height: 60px;
                    text-align: center;
                    font-weight: bold; 
                    color: #ffffff; 
                    // &:hover {
                    //     font-size: 24px;
                    // }
                }
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
                img {
                    height: 55px;
                    width: 55px;
                }
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
            max-height: 240px;
            .content-line {
                color: white;
                font-size: bold;
            }
        }
        .skill-content {
            flex: 5;
            max-height: 240px;
            background-color: rgba(135, 84, 45, 1);
            border:2px solid white;
            padding: 10px 10px;
            border-radius: 20px;
            margin-right: 20px;
            color: white;
            font-size: bold;
            overflow: scroll;
            .object-list {
                display:flex;
                flex-wrap: wrap;
                .object-item {
                    height: 50px;
                    width: 50px;
                    border-radius: 5px;
                    background-color: #2f2d2c;
                    margin-right: 5px;
                    img {
                        height: 50px;
                        width: 50px;
                    }
                    &.opacity {
                        opacity: 0.5;
                    }
                }
            }
            .skill-list {
                .skill-item {
                    label {
                        font-weight: bold;
                    }
                    span {
                        margin-right: 10px;
                    }
                }
            }
        }
        .equipment-handle {
            .equip {
                margin-top:30px;
            }
        }
    }
}
</style>

