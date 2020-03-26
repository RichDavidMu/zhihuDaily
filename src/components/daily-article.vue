<template>
    <div class="daily-article">
        <div v-if="this.type === 'recommend'" class="daily-article-title">{{ data.title }}</div>
        <div v-if="this.type === 'recommend'" class="daily-article-content" v-html="data.body"></div>
        <div v-if="this.type === 'section'" v-html="this.htmlData"></div>
        <div class="daily-comments" v-show="comments.length">
            <span>评论（{{comments.length}}）</span>
            <div class="daily-comment" v-for="comment in comments">
                <div class="daily-comment-avatar">
                    <img :src="comment.avatar">
                </div>

            <div class="daily-comment-content">
                <div class="daily-comment-name">{{ comment.author }}</div>
                <div class="daily-comment-time" v-time="comment.time"></div>
                <div class="daily-comment-text">{{comment.content}}</div>
            </div>
            </div>
        </div>

    </div>
</template>

<script>
    import time from "../../libs/time";
    import $ from '../../libs/util'
    export default {
        directives:{time},
        name: "daily-article",
        props:{
            id:{
                type:Number,
                default:0
            },
            type:{
                type:String,
                default:'recommend'
            }
        },
        data(){
            return{
                data:{},
                comments:[],
                htmlData:''
            }
        },
        methods:{
            getStores(){
              $.ajaxStories.get(`${this.id}`).then(res=>{
                  res =res.replace(/src="http/g,'src="' + $.imgPath+'http');
                  res =res.replace(/src="https/g,'src="' + $.imgPath + 'http');
                  res =res.replace(/href="http/g,'href="' + $.imgPath+'http');
                  res =res.replace(/href="https/g,'href="' + $.imgPath + 'http');
                  res =res.replace(/ZhihuDailyOIABanner"/,'ZhihuDailyOIABanner" style="display:none;"')
                  this.htmlData = res;
                    this.getComments();
              })
            },
            getArticle(){
                $.ajaxDaily.get('news/' + this.id).then(res=>{
                    res.body =res.body.replace(/src="http/g,'src="' + $.imgPath+'http');
                    res.body =res.body.replace(/src="https/g,'src="' + $.imgPath + 'http');
                    this.data = res;
                    window.scrollTo(0,0);
                    this.getComments();
                })
            },
            getComments(){
                this.comments = [];
                $.ajaxDaily.get('story/' + this.id +'/short-comments').then(res=>{
                    this.comments = res.comments.map(comment=>{
                        comment.avatar = $.imgPath + comment.avatar;
                        return comment;
                    })
                })
            }
        },
        watch:{
            type(val){
                this.data={},
                this.comments=[],
                this.htmlData=''
            },
            id(val){
                if (this.type==='recommend'&&val) {
                    this.getArticle();
                }else {
                    this.getStores()
                }
            }
        }
    }
</script>

<style scoped>
.daily-article{
    margin-left: 450px;
    padding:20px;
}
    .daily-article-title{
        font-size: 28px;
        font-weight: bold;
        color:#222;
        padding:10px 0;
    }

    .daily-comments{
        margin:10px 0;
    }
.daily-comments span{
    display: block;
    margin:10px 0;
    font-size: 20px;
}
    .daily-comment{
        overflow: hidden;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #e3e8ee;
    }
    .daily-comment-avatar{
        width:50px;
        height: 50px;
        float: left;
    }
    .daily-comment-avatar img{
        width: 100%;
        height: 100%;
        border-radius: 3px;
    }
    .daily-comment-content{
        margin-left: 65px;
    }
    .daily-comment-time{
        color: #9ea7b4;
        font-size: 14px;
        margin-top: 5px;
    }
    .daily-comment-text{
        margin-top: 10px;
    }

</style>
