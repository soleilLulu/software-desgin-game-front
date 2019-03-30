<template>
  <div class="create-container">
      <div class="create-header">
          <label>主角姓名</label>
          <b-input v-model="name" placeholder="请输入主角姓名" />
      </div>
      <div class="description-container">
          <div class="character-image">
              <img v-if="currentType == 'ASSASSIN'" src="../assets/assassin.png" />
              <img v-if="currentType == 'DOCTOR'" src="../assets/pastor.png" />
              <img v-if="currentType == 'SOLDIER'" src="../assets/warrior.png" />
          </div>
          <div :class="['character-content',currentType]">
              <div class="occupation">
                  {{currentInfo.name}}
              </div>
              <div class="description">
                  {{currentInfo.description}}
              </div>
              <div class="property">
                  <label>专属属性:</label>{{currentInfo.special}}
              </div>
              <div class="property">
                  <label>职业特色:</label>{{currentInfo.feature}}
              </div>
              <hr class="is-medium">
              <div class="ablity">
                <div class="ablity-item">
                    <label>力量</label>
                    <progress class="progress is-info" :value="currentInfo.strength" max="100"></progress>
                </div> 
                <div class="ablity-item">
                    <label>体质</label>
                    <progress class="progress is-info" :value="currentInfo.body" max="100"></progress>
                </div>   
                <div class="ablity-item">
                    <label>敏捷</label>
                    <progress class="progress is-info" :value="currentInfo.quick" max="100">65%</progress>
                </div> 
                <div class="ablity-item">
                    <label>耐力</label>
                    <progress class="progress is-info" :value="currentInfo.endurance" max="100">65%</progress>
                </div>
                <div class="ablity-item">
                    <label>精神</label>
                    <progress class="progress is-info" :value="currentInfo.spirit" max="100">65%</progress>
                </div>                 
              </div>
          </div>
      </div>
      <div class="create-footer">
        <div class="picture">
            <img style="border:2px solid #1c0e24;" src="../assets/assassin-min.png" @mouseenter="enter('ASSASSIN')" @click="confirmSelect('ASSASSIN')"/>
        </div>
        <div class="picture">
            <img style="border:2px solid #fcee60" src="../assets/pastor-min.png" @mouseenter="enter('DOCTOR')" @click="confirmSelect('DOCTOR')" />
        </div>
        <div class="picture">
            <img style="border:2px solid #740003" src="../assets/warrior-min.png" @mouseenter="enter('SOLDIER')" @click="confirmSelect('SOLDIER')" />
        </div>
      </div>
  </div>
</template>

<script>
import { characterCreate } from "@/api/game.js";
const assassinInfo = {
    name: '刺客',
    description: '对于刺客来说，任何花哨的技巧都比不上效率来的重要，她们总是出其不意的接近目标，给予致命一击，然后消失的无影无踪。',
    special: '敏捷',
    feature: '一击必杀，连击，闪避',
    strength: 100,
    body: 40,
    quick: 100,
    endurance: 40,
    spirit: 40,
    picture: '../assets/assassin.png',
};
const pastorInfo = {
    name: '牧师',
    description: '他们是神最忠实的信徒，他们会尽自己所能保护善良无助的人民，而面对敌人的时候又毫不畏惧，挥舞着战锤击碎一切黑暗。',
    special: '耐力',
    feature: '雷击、控制、恢复',
    strength: 60,
    body: 60,
    quick: 40,
    endurance: 80,
    spirit: 80,
    picture: '../assets/pastor.png',
};
const warriorInfo = {
    name: '狂战士',
    description: '这是一群为复仇而生的战士，为了更快捷的打到敌人，他们宁可放弃自己的防御，在魔物面前，他们要做的，只有杀戮。',
    special: '体质',
    feature: '狂暴、反伤、吸血',
    strength: 80,
    body: 80,
    quick: 40,
    endurance: 60,
    spirit: 40,
    picture: '../assets/warrior.png',
};
export default {
  name: 'HelloWorld',
  data() {
    return {
      name: '',
      currentType: 'ASSASSIN',
      currentInfo: assassinInfo,
    };
  },
  methods: {
      enter(type){
          if(type == this.currentType)return;
          switch(type){
            case 'ASSASSIN':
                this.currentType = 'ASSASSIN';
                this.currentInfo = assassinInfo;
                break;
            case 'DOCTOR':
                this.currentType = 'DOCTOR';
                this.currentInfo = pastorInfo;
                break;
            case 'SOLDIER':
                this.currentType = 'SOLDIER';
                this.currentInfo = warriorInfo;
                break;
          }
      },
      confirmSelect(characterType){
          let self = this;
          // DOCTOR,SOLDIER,ASSASSIN
          characterCreate(this.name,this.currentType).then((res) => {
            //   console.log(res);
              this.$router.push({
                  name:'HOME',
                  query:{
                      userId: self.name,
                      humanModel:res.data.humanModel,
                      stateInfoVO: res.data.stateInfoVO,
                    }
                });
          }).catch((e) => {
              this.$toast.open({
                  message: e.message || '服务器错误',
                  type: 'is-danger'
              })
          });
      },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.create-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    .create-header {
        flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
        label {
            margin-right: 20px;
        }
    }
    .description-container {
        flex: 5;
        display: flex;
        .character-image{
            flex: 1;
            // background-image: url('../assets/assassin.png');
            // background-size: cover;
            // background-repeat: no-repeat;
            img {
                height: 100%;
                width: 100%;
            }
        }
        .character-content {
            .occupation {
                font-size: 1.5rem;
                color: orange;
                margin-bottom: 5px;
            }
            .description {
                margin-bottom: 5px;
            }
            .property {
                label {
                    font-size: 1rem;
                    color: orange;
                    margin-right: 5px;
                }
                margin-bottom: 5px;
            }
            .ablity {
                padding: 20px 60px;
                .ablity-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    label {
                        flex: 1;
                        font-weight: bold;
                    }
                    .progress {
                        flex: 8;
                    }
                }
            }
            &.assassin {
                background-color: #2a1333;
            }
            &.pastor {
                background-color: #3a3819;
            }
            &.warrior {
                background-color: #3d1b1a;
            }
            overflow: hidden;
            padding: 30px 20px;
            color: #fff;
            font-weight: bold;
            flex: 1;
        }
    }
    .create-footer {
        padding: 20px 60px;
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        .picture {
            img {
                height: 100px;
                width: 100px;
                border-radius: 10px;
                margin-right: 60px;
                &:hover {
                    height: 120px;
                    width: 120px;
                }
            }
        }
    }
}
/* h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
