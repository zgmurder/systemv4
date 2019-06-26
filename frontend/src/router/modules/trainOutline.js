/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const trainOutlineRouter = [
  {
    path: '/trainOutline',
    component: Layout,
    redirect: '/trainOutline/trainStandard',
    meta: {
      title: 'trainOutline',
      icon: 'chart',
      belong: 'trainOutline',
      roles: ['Administrator']
    },
    children: [
      {
        path: 'trainStandard',
        component: () => import('@/views/trainOutline/TrainStandard'),
        name: 'TrainStandard',
        meta: {
          title: 'trainStandard'
        }
      },
      {
        path: 'trainSection',
        component: () => import('@/views/trainOutline/TrainSection'),
        name: 'TrainSection',
        meta: {
          title: 'trainSection'
        }
      },
      {
        path: 'TrainStageTime',
        component: () => import('@/views/trainOutline/TrainStageTime'),
        name: 'TrainStageTime',
        meta: {
          title: 'trainStageTime'
        }
      }
    ]
  },
  {
    path: '/armyRelated',
    component: Layout,
    redirect: '/armyRelated/course',
    meta: {
      title: 'armyRelated',
      icon: 'chart',
      belong: 'trainOutline',
      roles: ['Administrator']
    },
    children: [
      {
        path: 'course',
        component: () => import('@/views/trainOutline/armyRelated/Course'),
        name: 'Course',
        meta: {
          title: 'course'
        }
      },
      {
        path: 'courseTime',
        component: () => import('@/views/trainOutline/armyRelated/CourseTime'),
        name: 'CourseTime',
        meta: {
          title: 'courseTime'
        }
      },
      {
        path: 'courseDistribution',
        component: () => import('@/views/trainOutline/armyRelated/CourseDistribution'),
        name: 'CourseDistribution',
        meta: {
          title: 'courseDistribution'
        }
      }
    ]
  },
  {
    path: '/sportRelated',
    component: Layout,
    redirect: '/sportRelated/sportCourse',
    meta: {
      title: 'sportRelated',
      icon: 'chart',
      belong: 'trainOutline',
      roles: ['Administrator']
    },
    children: [
      {
        path: 'sportCourse',
        component: () => import('@/views/trainOutline/sportRelated/SportCourse'),
        name: 'SportCourse',
        meta: {
          title: 'sportCourse'
        }
      },
      {
        path: 'sportTime',
        component: () => import('@/views/trainOutline/sportRelated/SportTime'),
        name: 'SportTime',
        meta: {
          title: 'sportTime'
        }
      },
      {
        path: 'requiredSportCourse',
        component: () => import('@/views/trainOutline/sportRelated/RequiredSportCourse'),
        name: 'RequiredSportCourse',
        meta: {
          title: 'requiredSportCourse'
        }
      },
      {
        path: 'optionalSportCourse',
        component: () => import('@/views/trainOutline/sportRelated/OptionalSportCourse'),
        name: 'OptionalSportCourse',
        meta: {
          title: 'optionalSportCourse'
        }
      }
    ]
  },
  {
    path: '/indicator',
    component: Layout,
    redirect: '/indicator/personRequirement',
    meta: {
      title: 'indicator',
      icon: 'chart',
      belong: 'trainOutline',
      roles: ['Administrator']
    },
    children: [
      {
        path: 'personRequirement',
        component: () => import('@/views/trainOutline/indicator/PersonRequirement'),
        name: 'PersonRequirement',
        meta: {
          title: 'personRequirement'
        }
      },
      {
        path: 'timeRequirement',
        component: () => import('@/views/trainOutline/indicator/TimeRequirement'),
        name: 'TimeRequirement',
        meta: {
          title: 'timeRequirement'
        }
      },
      {
        path: 'orgScoreRequirement',
        component: () => import('@/views/trainOutline/indicator/OrgScoreRequirement'),
        name: 'OrgScoreRequirement',
        meta: {
          title: 'orgScoreRequirement'
        }
      },
      {
        path: 'personScoreRequirement',
        component: () => import('@/views/trainOutline/indicator/PersonScoreRequirement'),
        name: 'PersonScoreRequirement',
        meta: {
          title: 'personScoreRequirement'
        }
      },
      {
        path: 'placeRequirement',
        component: () => import('@/views/trainOutline/indicator/PlaceRequirement'),
        name: 'PlaceRequirement',
        meta: {
          title: 'placeRequirement'
        }
      },
      {
        path: 'bulletRequirement',
        component: () => import('@/views/trainOutline/indicator/BulletRequirement'),
        name: 'BulletRequirement',
        meta: {
          title: 'bulletRequirement'
        }
      },
      {
        path: 'motorRequirement',
        component: () => import('@/views/trainOutline/indicator/MotorRequirement'),
        name: 'MotorRequirement',
        meta: {
          title: 'motorRequirement'
        }
      }
    ]
  }
]

export default trainOutlineRouter
