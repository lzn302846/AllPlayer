<template>
  <div>
    <a-card title="公告信息" style="width:100%;">
      <a-button slot="extra" type="default" @click="oChangeAllIsRead" :disabled="NoticeData.every(item=>item.isRead===false)">全部标记为已读</a-button>
        <!-- <a-list item-layout="horizontal" :data-source="NoticeData">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-badge :dot="item.isRead" :offset="[-10,-10]"></a-badge>
            <a-list-item-meta :description="item.title">
            </a-list-item-meta>
            <a-button v-show="item.isRead" @click="oChangeIsRead(item.id)" type="default">标记为已读</a-button>
          </a-list-item>
        </a-list> -->
        <ul class="noticeList">
          <li v-for="item in NoticeData" :key="item.id" :class="{'oLi':item.isRead?true:false}">
            <p><a-badge :dot="item.isRead" :offset="[-10,-10]"></a-badge>{{item.title}}</p>
            <a-button v-if="item.isRead" @click="oChangeIsRead(item.id)" type="default">标记为已读</a-button>
          </li>
        </ul>
    </a-card>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState('Notice', ['NoticeData'])
  },
  methods: {
    ...mapMutations('Notice', ['oChangeIsRead', 'oChangeAllIsRead'])
  }
}
</script>
<style lang="scss">
.noticeList{
  li{
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid lightgray;
    width:100%;
    padding: 20px;
    font-size: 16px;
    color: gray;
  }
  .oLi{
    color: black;
    text-shadow:5px 2px 6px orange;
  }
}
</style>
