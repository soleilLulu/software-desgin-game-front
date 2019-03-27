<template> 
<div class="home-container">
    <div class="header-container">
        <div class="occupation-tag">
            刺
        </div>
        <div class="name">
            我是主角
        </div>
        <div class="level-rank">
            LV.8
        </div>
        <div class="life">
            <label class="life-num">
                {{`${currentLife} / ${totalLife}`}}
            </label>
            <span>经验值</span>
            <progress class="progress is-success" :value="currentLife" :max="totalLife"></progress>
        </div>
        <div class="money">
            <img src="../assets/coin.png" />
            2173
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
            <div class="monster-life">
                <label class="life-num">
                    {{`${currentLife} / ${totalLife}`}}
                </label>
                <progress class="progress is-warning" :value="currentLife" :max="totalLife"></progress>     
            </div>
            <div class="fighters">
                <div class="player">
                    <img class="player-pic" src="../assets/assassin-fix.png" />
                </div>
                <div class="monster">
                    <img src="../assets/monster.png" />
                </div>
            </div>
        </div>
        <div class="empty"></div>
    </div>
    <div class="bottom-container">

    </div>
</div> 
</template>
<script>
export default {
    data(){
        return{
            currentLife: 180,
            totalLife: 200,
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
    background-image: url('../assets/home-background.jpg');
    background-size: cover;
    display: flex;
    flex-direction: column;
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
        // .level {
        //     margin-left: 30px;
        //     font-size: 1.2rem;
        //     .tag-back;
        // }
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
        flex: 7;
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
                    .player-pic {
                        height: 330px;
                        width: 450px;
                        display: block;
                    }
                }
                .monster {
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
        }
    }
    .bottom-container {
        flex: 4;
        background-color: #2f2d2c;
    }
}
</style>

