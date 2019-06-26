<template>
  <div class="train-outline">
    <div class="wrapper">
      <div is="vSidebar" ref="sidebar" :items="items" />
      <div class="content">
        <div class="content-title">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ $route.matched[0].meta.title }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.parentTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div>
            <!--<el-input-->
            <!--size="mini"-->
            <!--placeholder="输入关键字"-->
            <!--v-model="searchText"-->
            <!--&gt;-->
            <!--</el-input>-->
            <!--<i class="el-icon-search" title="点击搜索" @click="search"></i>-->
            <!--<el-button v-if="!noAdd" slot="append" class="add" icon="iconfont icon-jia" @click="$emit('clickAdd',currentOrg)"></el-button>-->
            <!--<i class="iconfont icon-jia add" title="点击添加" @click="informChildAdd"></i>-->
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="informChildAdd" />
          </div>
        </div>
        <transition name="move" mode="out-in"><router-view ref="currentComponent" /></transition>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from 'src/pages/common/Header'
import vSidebar from 'src/pages/common/Sidebar'

export default {
  name: 'Index',
  components: {
    vHeader,
    vSidebar
  },
  data() {
    return {
      items: [
        {
          icon: 'el-icon-menu',
          index: 'plans',
          title: '大纲标准',
          subs: [
            {
              icon: 'el-icon-menu',
              index: 'TrainStandard',
              title: '大纲标准'
            },
            {
              icon: 'el-icon-menu',
              index: 'TrainSection',
              title: '大纲分册'
            },
            {
              icon: 'el-icon-menu',
              index: 'TrainStageTime',
              title: '阶段时长'
            }
          ]
        },
        {
          icon: 'el-icon-date',
          index: 'scores',
          title: '军事课目',
          subs: [
            {
              icon: 'el-icon-date',
              index: 'TrainCourse',
              title: '课目名称表'
            },
            {
              icon: 'el-icon-date',
              index: 'CourseTime',
              title: '时间参考表'
            },
            {
              icon: 'el-icon-date',
              index: 'CourseDistribution',
              title: '课目配当表'
            }
          ]
        },
        {
          icon: 'el-icon-share',
          index: 'sports',
          title: '体育课目',
          subs: [
            {
              icon: 'el-icon-share',
              index: 'SportCourse',
              title: '课目名称表'
            },
            {
              icon: 'el-icon-share',
              index: 'SportCourseTime',
              title: '时间参考表'
            },
            {
              icon: 'el-icon-share',
              index: 'SportAssessReq',
              title: '通用训练课目'
            },
            {
              icon: 'el-icon-share',
              index: 'SportCourseGroup',
              title: '专项训练内容'
            }
          ]
        },
        {
          icon: 'el-icon-bell',
          index: 'resources',
          title: '其它工作',
          subs: [
            {
              icon: 'el-icon-bell',
              index: 'PoliticsCourse',
              title: '政治教育'
            },
            {
              icon: 'el-icon-bell',
              index: 'ActivityCourse',
              title: '党团活动'
            },
            {
              icon: 'el-icon-bell',
              index: 'OthersCourse',
              title: '其它工作'
            }
          ]
        },
        {
          icon: 'el-icon-rank',
          index: 'eightWorkable',
          title: '八落实指标',
          subs: [
            {
              icon: 'el-icon-rank',
              index: 'PersonRequirement',
              title: '人员指标'
            },
            {
              icon: 'el-icon-rank',
              index: 'TimeRequirement',
              title: '时间指标'
            },
            // {
            //     icon: 'el-icon-menu',
            //     index: 'annualschedule',
            //     title: '内容指标'
            // },
            {
              icon: 'el-icon-rank',
              index: 'OrgScoreRequirement',
              title: '质量指标（单位）'
            },
            {
              icon: 'el-icon-rank',
              index: 'PersonScoreRequirement',
              title: '质量指标（个人）'
            },
            {
              icon: 'el-icon-rank',
              index: 'PlaceRequirement',
              title: '场地指标'
            },
            {
              icon: 'el-icon-rank',
              index: 'BulletRequirement',
              title: '弹药指标'
            },
            {
              icon: 'el-icon-rank',
              index: 'MotorRequirement',
              title: '摩托指标'
            }
          ]
        },
        {
          icon: 'el-icon-document',
          index: 'scoreCriteria',
          title: '军事成绩评定标准',
          subs: [
            {
              icon: 'el-icon-document',
              index: 'OrgSingleCourseScoreRule',
              title: '单位单课目'
            },
            {
              icon: 'el-icon-document',
              index: 'OrgMultipleCourseScoreRule',
              title: '单位多课目'
            },
            {
              icon: 'el-icon-document',
              index: 'PersonAnnualScoreRule',
              title: '个人年度'
            },
            {
              icon: 'el-icon-document',
              index: 'MultipleTargetScoreRule',
              title: '多对象综合'
            },
            {
              icon: 'el-icon-document',
              index: 'UnitForceAnnualScoreRule',
              title: '分队年度'
            },
            {
              icon: 'el-icon-document',
              index: 'LeaderOfficeAnnualScoreRule',
              title: '首长机关年度'
            },
            {
              icon: 'el-icon-document',
              index: 'TroopAnnualScoreRule',
              title: '部队年度'
            }
          ]
        },
        {
          icon: 'el-icon-message',
          index: 'performStandard',
          title: '体育成绩评分标准',
          subs: [
            {
              icon: 'el-icon-message',
              index: 'BMIStandard',
              title: '体型合格标准'
            },
            {
              icon: 'el-icon-message',
              index: 'PBFStandard',
              title: '体脂合格标准'
            },
            {
              icon: 'el-icon-message',
              index: 'PersonSportScoreStandard',
              title: '个人评定标准'
            },
            {
              icon: 'el-icon-message',
              index: 'SportScoreStandard',
              title: '体育课目评分标准'
            },
            {
              icon: 'el-icon-message',
              index: 'OrgSportScoreStandard',
              title: '单位体育训练成绩'
            }

          ]
        },
        {
          icon: 'el-icon-star-off',
          index: 'globalRule',
          title: '全局规则',
          subs: [
            {
              icon: 'el-icon-star-off',
              index: 'DailySchedule',
              title: '作息时间'
            },
            {
              icon: 'el-icon-star-off',
              index: 'CourseRule',
              title: '课目规则'
            },
            {
              icon: 'el-icon-star-off',
              index: 'RetrainRule',
              title: '复训规则'
            },
            {
              icon: 'el-icon-star-off',
              index: 'CompetitionRule',
              title: '会操规则'
            }
          ]
        }
      ],
      searchText: ''
    }
  },
  watch: {
    $route: function(nval, oval) {
      // 监听路由跳转，清空搜索框内容
      this.searchText = ''
    }
  },

  methods: {
    search() {
      const currentComponent = this.refs.currentComponent
    },
    informChildAdd() {
      const currentComponent = this.$refs.currentComponent
      currentComponent.openModal(true)
    }
  }
}
</script>

<style scoped lang="scss">
    .wrapper{
        display: flex;
        height: 100%;
        align-items: stretch;
        .content{
            flex: 1;
            transition: all 0.1s linear;
            position: relative;
            padding: 10px 20px;
            overflow: scroll;
        }
        .content-title{
            box-sizing: content-box;
            border-bottom:1px solid #dadada ;
            height: 40px;
            display:flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: -1px;
            .add{
                color: #fff;
                background-color: #409EFF;
                width: 35px;
                height: 28px;
                display: inline-block;
                text-align: center;
                line-height: 28px;
                font-weight: 600;
            }
        }
    }
</style>
