<template>
  <div class="container" v-on:mousedown.left="createLoves($event)" v-on:mouseup="removeSmallHert">
    <video :src="videoSrc" controls="controls" width="500" height="400"></video>
    <input type="file" @change="getBigectURL($event)" />
    <background ref="background"></background>
  </div>
</template>

<script>
// 组件内引用vue-video-player插件
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import background from '../../components/clickShow/clickShow'
export default {
  name: 'HomeVideo',
  components: { background },
  data () {
    return {
      videoSrc: ''
    }
  },
  methods: {
    createLoves () {
      this.$refs.background.createLoves(event)
    },
    removeSmallHert () {
      this.$refs.background.removeSmallHert()
    },
    getBigectURL (event) {
      console.log('getBigectURL', event)
      var current = event.target.files[0]
      var fileReader = new FileReader()
      fileReader.readAsDataURL(current)
      var that = this
      fileReader.onload = function (e) {
        that.videoSrc = e.currentTarget.result
      }
    }
  }
}
</script>
<style>
.content{
  margin-left: 10px;
}
.content_video .video-js .vjs-big-play-button {
    font-size: 1.5em ;
    width: 2.5em;
    border-radius: 50%;
    top: 40%;
    left: 45%;
  }
  .content_video {
    text-align: left;
    padding: 0 7%;
  }
</style>
