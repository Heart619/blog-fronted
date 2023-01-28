<template>
  <div class="box">
    <aside class="animate__animated animate__bounceInLeft sidebar">
      <div class="avatar">
        <img :src="$store.state.oss + 'default/fd.jpg'" title="mxp">
      </div>
      <nav class="nav">
        <a v-for="intro in introduceList" @click="showSection(intro.name)" :key="intro.id"><i :class="intro.icon" style="margin-right: 10px"></i> {{intro.title}}</a>
      </nav>
    </aside>
    <main>
      <section class="animate__animated animate__fadeInRight" v-if="showSectionId === '#info'" id="info">
        <div class="wrap">
          <h2 class="title"><i class="iconfont icon-gerenzhongxin1"></i> 个人资料</h2>
          <el-row :gutter="20" class="row">
            <el-col :sm="8" :xs="24" class="col-l-4">
              <p><i class="iconfont icon-name" style="margin-right: 5px"></i>姓名：mxp</p>
              <p><i class="iconfont icon-sex" style="margin-right: 5px"></i>性别：男</p>
              <p><i class="iconfont icon-nianling" style="margin-right: 5px"></i>年龄：21</p>
              <p><i class="iconfont icon-xueli" style="margin-right: 5px"></i>学历：本科</p>
              <p><i class="iconfont icon-qq1" style="margin-right: 5px"></i>QQ：2508615597</p>
              <p><svg t="1674889006336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" style="margin-right: 5px" p-id="2297" id="mx_n_1674889006337" width="16" height="16"><path d="M512 12.63616c-282.74688 0-512 229.21216-512 512 0 226.22208 146.69824 418.14016 350.12608 485.82656 25.57952 4.73088 35.00032-11.10016 35.00032-24.63744 0-12.20608-0.47104-52.55168-0.69632-95.31392-142.4384 30.96576-172.50304-60.416-172.50304-60.416-23.28576-59.16672-56.85248-74.91584-56.85248-74.91584-46.44864-31.78496 3.50208-31.1296 3.50208-31.1296 51.4048 3.60448 78.47936 52.75648 78.47936 52.75648 45.6704 78.27456 119.76704 55.64416 149.01248 42.55744 4.58752-33.09568 17.85856-55.68512 32.50176-68.46464-113.72544-12.94336-233.2672-56.85248-233.2672-253.0304 0-55.88992 20.00896-101.5808 52.75648-137.4208-5.3248-12.9024-22.85568-64.96256 4.95616-135.49568 0 0 43.008-13.74208 140.84096 52.49024 40.83712-11.34592 84.64384-17.03936 128.16384-17.24416 43.49952 0.2048 87.32672 5.87776 128.24576 17.24416 97.73056-66.2528 140.65664-52.49024 140.65664-52.49024 27.87328 70.53312 10.3424 122.59328 5.03808 135.49568 32.82944 35.86048 52.69504 81.53088 52.69504 137.4208 0 196.64896-119.78752 239.94368-233.79968 252.6208 18.37056 15.89248 34.73408 47.04256 34.73408 94.80192 0 68.5056-0.59392 123.63776-0.59392 140.51328 0 13.6192 9.216 29.5936 35.16416 24.576 203.32544-67.76832 349.83936-259.62496 349.83936-485.76512 0-282.78784-229.23264-512-512-512z" fill="#2c2c2c" p-id="2298"></path></svg>GitHub：<a target="_blank" href="https://github.com/Heart619">https://github.com/Heart619</a></p>
              <!--              <p><i class="iconfont icon-shengao" style="margin-right: 5px"></i>身高：168cm</p>-->
<!--              <p><i class="iconfont icon-icon1" style="margin-right: 5px"></i>体重：52kg</p>-->
<!--              <p><i class="iconfont icon-shouye" style="margin-right: 5px"></i>血型：O型</p>-->
            </el-col>
            <el-col :sm="16" :xs="24" class="col-l-4">
              <p><i class="iconfont icon-chushengriqi" style="margin-right: 5px"></i>出生日期：2002-06-19</p>
              <p><i class="iconfont icon-xuexiao1" style="margin-right: 5px"></i>学校：北华大学</p>
              <p><i class="iconfont icon-zhuanye1" style="margin-right: 5px"></i>专业：计算机科学与技术</p>
<!--              <p><i class="iconfont icon-xuefen" style="margin-right: 5px"></i>绩点：3.84 / 4</p>-->
              <p><svg t="1674889389251" class="icon" viewBox="0 0 1024 1024" style="margin-right: 5px" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3569" width="16" height="16"><path d="M686.969238 765.086476l-115.039501 111.200586c-19.877051 19.919706-47.389279 28.237356-77.759367 28.237357s-57.882315-8.31765-77.802021-28.237357l-184.779799-186.102093c-19.919706-19.919706-29.943541-49.052809-29.943541-79.465551s10.023835-57.882315 29.943541-77.80202l184.225289-186.827222c19.919706-19.919706 47.986444-27.512228 78.356531-27.512228s57.882315 8.31765 77.759367 28.237357l115.039501 111.157931c21.924473 21.967128 58.223552 21.199345 81.043772-1.620876 22.82022-22.862875 23.588003-59.161953 1.66353-81.086426l-111.285895-112.43757a215.619088 215.619088 0 0 0-104.290538-57.029222l105.228939-106.764506c22.009782-21.924473 21.241999-58.266206-1.578221-81.086426-22.82022-22.82022-59.161953-23.545348-81.129081-1.620876l-430.811629 430.854284c-41.844179 41.886834-63.725997 99.683839-63.725997 163.580455 0 63.896616 21.881818 123.485115 63.725997 165.28664l185.419619 186.016783c41.844179 41.75887 99.683839 61.934504 163.537801 61.934504s121.693622-21.839164 163.580455-63.725997l111.285895-112.480225c21.924473-21.924473 21.15669-58.223552-1.66353-81.043772s-59.119299-23.588003-81.001117-1.66353z m200.86059-209.860714H455.098741c-29.943541 0-54.171363 25.763389-54.171363 57.413114s24.227822 57.413114 54.171363 57.413114h432.731087c29.900886 0 54.171363-25.763389 54.171363-57.413114s-24.270477-57.413114-54.171363-57.413114z" p-id="3570"></path></svg>力扣：<a target="_blank" href="https://leetcode.cn/u/maoxp/">https://leetcode.cn/u/maoxp/</a></p>
<!--              <p><i class="iconfont icon-csdn1" style="margin-right: 5px"></i>CSDN博客：<a href="https://blog.csdn.net/weixin_44996854">https://blog.csdn.net/weixin_44996854</a></p>-->
              <p><i class="iconfont icon-email" style="margin-right: 5px"></i>邮箱：<a target="_blank" href="mailto:2569757226@qq.com">2508615597@qq.com</a></p>
              <p><i class="iconfont icon-gitee-fill-round" style="margin-right: 5px"></i>码云仓库：<a target="_blank" href="https://gitee.com/maoxp619">https://gitee.com/maoxp619</a></p>

            </el-col>
          </el-row>
        </div>
      </section>
      <section class="animate__animated animate__fadeInRight" v-show="showSectionId === '#skills'" id="skills">
        <div class="wrap">
          <h2 class="title"><i class="iconfont icon-zhuanye"></i> 掌握的技能</h2>
          <el-row :gutter="40" class="row scrollable">
            <el-col :sm="8" :xs="24" class="center-fixed">
              <div class="skills-icon">
                <i class="iconfont icon-java"></i>
              </div>
              <div class="skills-title">
                <h3>Java</h3>
                <p>熟悉Java语言的基本使用，能使用SpringBoot进行后端开发</p>
              </div>
            </el-col>
            <el-col :sm="8" :xs="24" class="center-fixed">
              <div class="skills-icon">
                <i class="iconfont icon-shujujiegou-01"></i>
              </div>
              <div class="skills-title">
                <h3>计算机专业基础</h3>
                <p>熟悉基本的数据结构，算法，计算机网络等相关知识</p>
              </div>
            </el-col>
            <el-col :sm="8" :xs="24" class="center-fixed">
              <div class="skills-icon">
                <i class="iconfont icon-Vue"></i>
              </div>
              <div class="skills-title">
                <h3>Vue</h3>
                <p>熟悉Vue的开发流程，能够使用Vue框架开发完整项目</p>
              </div>
            </el-col>
            <el-col :sm="8" :xs="24" class="center-fixed">
              <div class="skills-icon">
                <svg t="1674473751215" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3075" width="64" height="64"><path d="M959.718832 123.963683C872.444401 50.185297 704.593576 0.299912 511.850044 0.299912S151.255687 50.185297 63.981255 123.963683C23.193205 158.453578 0 198.04198 0 240.22962v543.840672c0 132.461193 229.132871 239.929708 511.850044 239.929708s511.850044-107.468515 511.850044-239.929708v-543.840672c0-42.18764-23.193205-81.776042-63.981256-116.265937zM87.774285 189.64444c19.794201-21.893586 50.685151-43.087377 89.373816-61.182075 42.287611-19.794201 92.073025-35.489603 147.956653-46.586352C384.087474 70.17944 446.869081 64.281168 511.850044 64.281168s127.76257 5.898272 186.745289 17.594845c55.883628 11.096749 105.669042 26.792151 147.956654 46.586352 38.688665 18.094699 69.579615 39.28849 89.373816 61.182075 15.795372 17.494875 23.793029 34.489896 23.793029 50.48521 0 16.095285-7.997657 33.090306-23.793029 50.485209-19.794201 21.893586-50.685151 43.087377-89.373816 61.182075-42.287611 19.894172-92.073025 35.489603-147.956654 46.586352-58.98272 11.696573-121.864298 17.594845-186.745289 17.594845s-127.76257-5.898272-186.74529-17.594845c-55.883628-11.096749-105.669042-26.792151-147.956653-46.586352-38.688665-18.094699-69.579615-39.28849-89.373816-61.182075C71.978912 273.319926 63.981255 256.324905 63.981255 240.22962s7.997657-33.090306 23.79303-50.58518zM63.981255 356.495558c87.274431 73.778385 255.125256 123.66377 447.868789 123.66377s360.594357-49.885385 447.868788-123.66377v155.254515c0 16.095285-7.997657 33.090306-23.793029 50.48521-19.794201 21.893586-50.685151 43.087377-89.373816 61.182075-42.287611 19.794201-92.073025 35.489603-147.956654 46.586352-58.98272 11.696573-121.864298 17.594845-186.745289 17.594845s-127.76257-5.898272-186.74529-17.594845c-55.883628-11.096749-105.669042-26.792151-147.956653-46.586352-38.688665-18.094699-69.579615-39.28849-89.373816-61.182075C71.978912 544.740408 63.981255 527.745387 63.981255 511.750073V356.495558z m895.737577 427.574734c0 16.095285-7.997657 33.090306-23.793029 50.485209-19.794201 21.893586-50.685151 43.087377-89.373816 61.182076-42.287611 19.894172-92.073025 35.489603-147.956654 46.586352-58.98272 11.696573-121.864298 17.594845-186.745289 17.594845s-127.76257-5.898272-186.74529-17.594845c-55.883628-11.096749-105.669042-26.792151-147.956653-46.586352-38.688665-18.094699-69.579615-39.28849-89.373816-61.182076C71.978912 817.160597 63.981255 800.165576 63.981255 784.070292V627.91604c87.274431 73.778385 255.125256 123.66377 447.868789 123.663771s360.594357-49.885385 447.868788-123.663771v156.154252z" p-id="3076"></path><path d="M167.950796 519.847701m-39.988285 0a39.988285 39.988285 0 1 0 79.976569 0 39.988285 39.988285 0 1 0-79.976569 0Z" p-id="3077"></path><path d="M167.950796 791.768037m-39.988285 0a39.988285 39.988285 0 1 0 79.976569 0 39.988285 39.988285 0 1 0-79.976569 0Z" p-id="3078"></path></svg>
              </div>
              <div class="skills-title">
                <h3>数据库</h3>
                <p>熟悉MySQL，Redis等数据库</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="animate__animated animate__fadeInRight" v-show="showSectionId === '#works'" id="works">
        <div class="wrap">
          <h2 class="title"><i class="iconfont icon-zuopin1"></i>个人作品</h2>
          <el-row :gutter="30">
            <el-col :xs="24" :sm="12" :lg="8" v-for="work in workList" :key="work.id">
              <div class="works-item">
                <el-card class="works-item-front">
                  <el-image :src="work.pic_url"/>
                  <p>{{work.name}}</p>
                </el-card>
                <el-card class="works-item-back">
                  <p>{{work.desp}}</p>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="animate__animated animate__fadeInRight" v-show="showSectionId === '#hobbys'" id="hobbys">
          <h2 class="title"><i class="iconfont icon-xingquaihao"></i>我的爱好</h2>
          <div class="row">
            <el-carousel :interval="2000" :type="cardOpen? 'card':''" height="350px">
              <el-carousel-item v-for="hobby in hobbyList" :key="hobby.id">
                <el-card class="hobby">
                  <el-image style="width: 100%" :src="hobby.pic_url"></el-image>
                  <h3 class="tit">{{hobby.name}}</h3>
                  <p>{{hobby.desp}}</p>
                </el-card>
              </el-carousel-item>
            </el-carousel>
        </div>
      </section>
      <section class="animate__animated animate__fadeInRight" v-show="showSectionId === '#summary'" id="summary">
        <div class="wrap">
          <h2 class="title"><i class="iconfont icon-ziwopingjia"></i>自我评价</h2>
          <div class="row">
            <ul>
              <li>一个对一切未知的事物都会抱有好奇心的人</li>
              <li>一个希望用自己所有的精力将事情做到最尽可能完美的人</li>
              <li>一个喜欢拥抱不确定性，爱折腾，去见不同的人，感受不同的环境，不喜欢一成不变的人</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenWidth: document.documentElement.clientWidth,  //实时屏幕宽度,
      showSectionId: '#info',
      introduceList: [
        {
          id: 0,
          title: '资料',
          name: '#info',
          icon:'iconfont icon-zhuanye1'
        },
        {
          id: 1,
          title: '技能',
          name: '#skills',
          icon:'iconfont icon-jinengliang-xian'
        },
        // {
        //   id: 2,
        //   title: '作品',
        //   name: '#works',
        //   icon:'iconfont icon-zuopin'
        // },
        {
          id: 3,
          title: '爱好',
          name: '#hobbys',
          icon:'iconfont icon-xingquaihao'
        },
        {
          id: 4,
          title: '评价',
          name: '#summary',
          icon:'iconfont icon-ziwopingjia'
        },
      ],
      workList:[
        {
          id:0,
          name:'个人博客',
          desp:'一个简单的个人博客项目，分为前台展示和后台管理系统，前台展示部分实现了博客的浏览，查找，分类，标签，评论，留言等功能，后台管理系统实现了博客发表，博客管理，用户管理等功能。',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        },
        {
          id:1,
          name:'Vue商城管理系统',
          desp:'实现了商城后台管理用户账号(登录，退出，用户管理，权限管理)，商品管理(商品分类，分类参数，商品信息，订单)，数据统计等功能',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        },
        {
          id:2,
          name:'移动Web餐厅小游戏',
          desp:'一个餐厅经营模拟类游戏，实现了厨师、顾客等角色的关键操作，完成从顾客等位、点菜、烹饪、用餐、支付的一系列状态变更的数据、信息、交互、展现的变化及处理。',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        },
        {
          id:3,
          name:'高级个人简历',
          desp:'使用原生HTML,CSS,JavaScript实现的一款高级个人简历',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        },
        {
          id:4,
          name:'Java吃豆人小游戏',
          desp:'使用JavaSwing实现了吃豆人游戏，游戏分为单人，双人和联机模式，用户通过操控吃豆人移动，吃掉屏幕上的豆字，同时躲避怪物，追踪豆字吃完后获得胜利',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        },
        {
          id:5,
          name:'OpenGL天空盒',
          desp:'采用了天空盒的方法，通过一系列处理，如光源，摄影机的设置，键盘交互的设置等，在codeblocks中用c++语言实现了在天空盒中的漫游以及雾气的实现与消除，并且能够在场景中导入obj模型并赋予其材质，并实现了打开场景时播放背景音乐的效果。',
          pic_url:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        },
      ],
      hobbyList:[
        // {
        //   id: 0,
        //   name:'网球',
        //   pic_url:'http://hikari.top/images/ab058900-9c31-4818-9f51-61a60f64f63c.jpeg',
        //   desp:'网球是从大一开始学的一项运动，也是大学坚持最久的运动之一，技术一般般，但水平不高的比赛还是可以上场的，希望工作之后还有时间继续打球'
        // },
        // {
        //   id: 1,
        //   name:'跑步',
        //   pic_url:'http://hikari.top/images/a7e5f1a4-bd29-4e80-aa9f-793342014120.jpeg',
        //   desp:'跑步是从大一那年的冬天开始的，最长的记录是19年跑完了半程马拉松的21.0975km，这是一项不管我年龄多大都想坚持下去的运动'
        // },
        // {
        //   id: 2,
        //   name:'二次元',
        //   pic_url:'http://hikari.top/images/10985f8b-91aa-429a-a515-5b1e9a5db40f.jpeg',
        //   desp:'海贼，火影，网球王子，柯南，妖尾，进击的巨人......，从初中开始，基本上把长篇都看遍啦，二次元给我的生活天机了不少乐趣'
        // },
        {
          id: 3,
          name:'听音乐',
          pic_url: `${this.$store.state.oss}about/music.jpg`,
          desp:'这个不用多说，各种各样的音乐我都喜欢，而且喜欢边学习边听，哈哈'
        },
        {
          id: 4,
          name:'看电影',
          pic_url:`${this.$store.state.oss}about/movie.jpg`,
          desp:'比较喜欢科幻片，虽然因为没钱，没在电影院没看过几部，但这也算一个爱好吧'
        },
        {
          id: 5,
          name:'阅读',
          pic_url:`${this.$store.state.oss}about/book.jpg`,
          desp:'阅读计算机相关技术书籍，越看越不会，越不会越想看'
        },
        // {
        //   id: 6,
        //   name:'骑车',
        //   pic_url:'http://hikari.top/images/b05702ea-673b-46ff-8f03-17db351c3845.jpeg',
        //   desp:'虽然我大学才雪会骑车，但看着别人出去远距离骑行也是挺羡慕的，希望有时间可以去试试'
        // },
        {
          id: 7,
          name:'旅游',
          pic_url:`${this.$store.state.oss}about/city.jpg`,
          desp:'这只能算一个美好的愿望，等我有钱了，要去各种各样的地方玩，体验不一样的生活'
        },
      ],
    }
  },
  computed:{
    cardOpen(){
      return this.screenWidth >= 748;
    }
  },
  created() {
    window.addEventListener('resize', this.screenAdapter)
  },
  methods: {
    showSection(name) {
      this.showSectionId = name
    },
    // 屏幕尺寸变化的监听函数
    screenAdapter(){
      this.screenWidth = document.documentElement.clientWidth;
    }
  }
}
</script>

<style scoped lang="less">
  body {
    height: 100vh;
    overflow: hidden;
  }

  .box {
    width: 100%;
    height: 100vh;
    position: relative;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    color: #fff;
    width: 250px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    background: rgba(75, 75, 75, 0.9);

    nav {
      margin: 0;
      display: flex;
      list-style: none;
      flex-direction: column;

      a {
        font: 16px/1.5 'Microsoft Yahei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
        list-style: none;
        box-sizing: border-box;
        text-decoration: none;
        color: #fff;
        padding: 1em;
        display: block;
        text-align: center;
        transition: background .3s, box-shadow .3s;
      }

      a:hover {
        background: rgba(60, 60, 60, 1);
      }
    }

    .avatar {
      width: 140px;
      height: 140px;
      margin: 1em auto;
      margin-top: 5em;
      background: #fff;
      border-radius: 100%;
      border: #fff 5px solid;
      transition: transform 0.5s;

      img {
        width: 100%;
        border-radius: 50%;
        /*transition: .6s;*/
      }

      img:hover {
        transform: rotate(360deg);
        transition: all 1.5s;
      }
    }
  }

  main {
    color: #353535;
    font: 16px/1.5 'Microsoft Yahei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    box-sizing: border-box;
    margin-left: 250px;

    section {
      top: 50%;
      transform: translateY(-50%);
      position: relative;
      background-color: rgba(255, 255, 255, 0.8);
      border: 3px dashed rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      padding: 20px;
      .title{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        i{
          font-size: larger;
          margin-right: 10px;
        }
      }
      a{
        text-decoration: none;
      }
    }

    section:before {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-right: 20px solid rgba(0, 0, 0, 0.3);
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      top: 50%;
      transform: translateY(-50%);
      left: -20px;
    }

    #info {
      .warp {
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }

    #skills {
      .center-fixed {
        text-align: center;
        display: flex;
        flex-direction: column;

        .skills-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto;
          background: #fff;
          border-radius: 100%;
          box-shadow: 0 5px rgba(0, 0, 0, 0.3);

          i {
            font-size: 50px;
            line-height: 100px;
            transition: all 1s;
          }

          .fa-html5 {
            content: "\f13b";
          }
        }

        .skills-icon:hover {
          i {
            transform: rotate(180deg);
            transition: all 1s;
          }
        }

      }

    }
    #works{
      .el-card /deep/ .el-card__body{
        padding: 0;
      }

      .works-item{
        margin-bottom: 20px;
        position: relative;
        .works-item-front,.works-item-back{
          background-color: white;
          text-align: center;
          border-radius: 5px;
          box-shadow: 0 0 5px 0 #ccc;
          border: 1px solid #5d5d5d;
          transition: all 1s;
          backface-visibility: hidden;
          width: 100%;
          height: 100%;
        }
        .works-item-front{
          .el-image{
            max-width: 100%;
            max-height: 180px;
            border-radius: 5px 5px 0 0;
          }
          p{
            margin-top: 2px;
            margin-bottom: 2px;
            color: #303133;
          }
        }
        .works-item-back{
          box-sizing: border-box;
          padding: 20px;
          position: absolute;
          top: 0;
          background: rgba(255, 255, 255, 0.8);
          transform: rotateY(180deg);
        }
      }
      .works-item:hover {
       .works-item-back{
          transform: rotateY(0deg);
        }
        .works-item-front{
          transform: rotateY(180deg);
        }
      }
    }

    #hobbys{
      .el-card /deep/ .el-card__body{
        padding: 0;
        height: 350px;
      }
      .hobby{
        opacity: 0.9;
        background-color: rgba(255,255,255,0.9);
        box-shadow: none;
        margin-bottom: 20px;
        border-radius: 20px;
        .el-image{
          width: 100%;
          max-height: 200px;
        }
        .tit{
          margin: 0 auto;
          line-height: 20px;
          text-align: center;
        }
        p{
          margin: 0;
          padding: 20px;
          font-size: medium;
        }
      }
    }
    #summary{
      ul{
        li{
          line-height: 50px;
          border-bottom: 2px dashed #63a35c;
          background-color: rgba(0,0,0,0.1);
          margin-bottom: 20px;
          border-radius: 9999px;
          list-style-type: circle;
        }
      }
    }
  }


  @media screen and (max-width: 768px){
    .sidebar{
      position: relative;
      top: 0;
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      .avatar{
        margin: 1rem auto;
        width: 100px;
        height: 100px;
      }
      nav{
        background-color: rgba(255,255,255,0.1);
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }
    }
    main{
      margin: 0 auto;
      width: 100%;
      text-align: center;
      section{
        border-radius: 0;
        border: none;
      }
      #summary{
        ul{
          li{
            border-radius: 0;
            border-bottom: none;
            background-color: transparent;
            text-align: left;
          }
        }
      }
    }
  }

</style>
