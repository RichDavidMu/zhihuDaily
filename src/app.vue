<template>
<div>
    <div class="daily">
        <div class="daily-menu">
            <div class="daily-menu-item"
            :class="{on:type==='recommend'}"
            @click="handleToRecommend">每日推荐</div>
            <div class="daily-menu-item"
            :class="{on:type==='section'}"
            @click="showSection = !showSection">热门栏目</div>
            <ul v-show="showSection">
                <li v-for="item in sections">
                    <a :class="{on: item.id === sectionId && type === 'section'}"
                    @click="handleToSection(item.id)">{{ item.name}}</a>
                </li>
            </ul>
        </div>
        <div class="daily-list" ref="list">
            <template v-if="type === 'recommend'">
                <div v-for="list in recommendList">
                    <div class="daily-date">{{ formatDay(list.date )}}</div>
                    <item @click.native="handleClick(item.id)"
                        v-for="item in list.stories"
                        :data="item"
                        :key="item.id"></item>
                </div>
            </template>
            <template v-if="type === 'section'">
                <item v-for="item in list"
                      :data="item"
                      :key="item.id"
                    @click.native="handleClick(item.id)"></item>
            </template>
        </div>
        <daily-article :id="articleId" :type="this.type"></daily-article>
    </div>
</div>
</template>

<script>
    import $ from '../libs/util.js';
    import item from './components/item';
    import dailyArticle from './components/daily-article'
    export default {
        name: "app",
        components:{item, dailyArticle},
        data(){
            return {
                sections:[],
                showSection:false,
                type:'recommend',
                sectionId:0,
                list:[],
                recommendList:[],
                dailyTime:$.getTodayTime(),
                sectionTime:0,
                isloading:false,
                articleId:0
            }
        },
        methods:{
            getSections(){
                $.ajaxSection.get('sections').then(res =>{
                    this.sections = res.data;
                })
            },
            handleToSection(id){
                this.type = 'section';
                this.sectionId = id;
                this.list = [];
                $.ajaxSection.get('section/'+id).then(res=>{
                    this.sectionTime = res.timestamp;
                    this.list = res.stories;
                })
            },
            getSectionList(){
                this.isloading = true;
                $.ajaxSection.get('section/' +this.sectionId+`/before/${this.sectionTime}`).then(res=>{
                    this.sectionTime= res.timestamp;
                    for (const value of res.stories){
                        this.list.push(value);
                    }
                    this.isloading=false;
                })
            },
            handleToRecommend(){
                this.type = 'recommend';
                this.recommendList = [];
                this.getRecommendList();
            },
            getRecommendList(){
                this.isloading = true;
                const prevDay = $.prevDay(this.dailyTime + 24*60*60*1000);
                $.ajaxDaily.get('news/before/' + prevDay).then(res =>{
                    this.recommendList.push(res);
                    this.isloading = false;
                })
            },
            formatDay(date){
                let month = date.substr(4,2);
                let day = date.substr(6,2);
                if (month.substr(0,1) ==='0') month = month.substr(1,1);
                if (day.substr(0,1)==='0') day = day.substr(1,1);
                return `${month} 月 ${day} 日`;
            },
            handleClick(id){
                this.articleId = id;
            }
        },
        mounted() {
            this.getSections();
            this.getRecommendList();
            const $list = this.$refs.list;
            console.log($list);
            $list.addEventListener('scroll',()=>{
                if(this.isloading) return;
                if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight-100){
                    if(this.type === 'recommend') {
                        this.dailyTime -=86400000;
                        this.getRecommendList();
                    }else{
                        this.getSectionList()
                    }
                }
            });
        }
    }
</script>

<style scoped>
    .daily-menu{
        width: 150px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        background:#f5f7f9;
    }
    .daily-menu ul{
        list-style: none;
        padding-left: 40px;
    }
    .daily-menu ul li a{
        display: block;
        color: inherit;
        text-decoration: none;
        padding:5px 0;
        margin:5px 0;
        cursor:pointer;
    }
    .daily-menu ul li a:hover,.daily-menu ul li a.on{
        color:#3399ff;
    }
    .daily-menu-item{
        font-size: 18px;
        text-align: center;
        margin: 5px 0;
        cursor:pointer;
        border-right: 2px solid transparent;
        transition: all .3s ease-in-out;
    }
    .daily-menu-item:hover{
        background: #e3e8ee;
    }
    .daily-menu-item.on{
        border-right: 2px solid #3399ff;
    }
    .daily-list{
        width: 300px;
        position: fixed;
        top: 0;
        bottom: 0;
        left:150px;
        overflow: auto;
        border-right: 1px solid #d7dde4;
    }
    .daily-date{
        text-align: center;
        margin: 10px 0;
    }

</style>
