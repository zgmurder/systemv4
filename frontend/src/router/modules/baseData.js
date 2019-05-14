/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const baseDataRouter = [
  {
    path: '/orgRelated',
    component: Layout,
    name: 'OrgRelated',
    redirect: '/orgRelated/orgProperty',
    meta: {
      title: 'orgRelated',
      icon: 'chart',
      belong: 'basedata'
    },
    children: [
      {
        path: 'orgProperty',
        component: () => import('@/views/baseData/orgRelated/orgProperty'),
        name: 'OrgProperty',
        meta: {
          title: 'orgProperty'
        }
      },
      {
        path: 'orgCategory',
        component: () => import('@/views/baseData/orgRelated/orgCategory'),
        name: 'OrgCategory',
        meta: {
          title: 'orgCategory',
          noCache: true
        }
      },
      {
        path: 'specialMission',
        component: () => import('@/views/baseData/orgRelated/SpecialMission'),
        name: 'SpecialMission',
        meta: {
          title: 'specialMission',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/personRelated',
    component: Layout,
    redirect: '/personRelated/position',
    name: 'PersonRelated',
    meta: {
      title: 'personRelated',
      icon: 'peoples',
      belong: 'basedata'
    },
    children: [
      {
        path: 'position',
        component: () => import('@/views/baseData/personRelated/Position'),
        name: 'Position',
        meta: {
          title: 'position',
          noCache: true
        }
      },
      // {
      //   path: 'position2',
      //   component: () => import('@/views/baseData/personRelated/Position2'),
      //   name: 'Position2',
      //   meta: {
      //     title: 'position2',
      //     noCache: true
      //   }
      // },
      {
        path: 'militaryRank',
        component: () => import('@/views/baseData/personRelated/MilitaryRank'),
        name: 'MilitaryRank',
        meta: {
          title: 'militaryRank',
          noCache: true
        }
      },
      {
        path: 'supporterMajor',
        component: () => import('@/views/baseData/personRelated/SupporterMajor'),
        name: 'SupporterMajor',
        meta: {
          title: 'supporterMajor',
          noCache: true
        }
      },
      {
        path: 'trainerLevel',
        component: () => import('@/views/baseData/personRelated/TrainerLevel'),
        name: 'TrainerLevel',
        meta: {
          title: 'trainerLevel',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/trainRelated',
    component: Layout,
    redirect: '/trainRelated/trainStep',
    name: 'TrainRelated',
    meta: {
      title: 'trainRelated',
      icon: 'component',
      belong: 'basedata'
    },
    children: [
      {
        path: 'trainStep',
        component: () => import('@/views/baseData/trainRelated/TrainStep'),
        name: 'TrainStep',
        meta: {
          title: 'trainStep',
          noCache: true
        }
      },
      {
        path: 'sportCategory',
        component: () => import('@/views/baseData/trainRelated/SportCategory'),
        name: 'SportCategory',
        meta: {
          title: 'sportCategory',
          noCache: true
        }
      },
      {
        path: 'placeType',
        component: () => import('@/views/baseData/trainRelated/PlaceType'),
        name: 'PlaceType',
        meta: {
          title: 'placeType',
          noCache: true
        }
      },
      {
        path: 'motorType',
        component: () => import('@/views/baseData/trainRelated/MotorType'),
        name: 'MotorType',
        meta: {
          title: 'motorType',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/otherRelated',
    component: Layout,
    redirect: '/otherRelated/ordnanceType',
    name: 'OtherRelated',
    meta: {
      title: 'otherRelated',
      icon: 'documentation',
      belong: 'basedata'
    },
    children: [
      {
        path: 'ordnanceType',
        component: () => import('@/views/baseData/otherRelated/OrdnanceType'),
        name: 'OrdnanceType',
        meta: {
          title: 'ordnanceType',
          noCache: true
        }
      },
      {
        path: 'weatherType',
        component: () => import('@/views/baseData/otherRelated/WeatherType'),
        name: 'WeatherType',
        meta: {
          title: 'weatherType',
          noCache: true
        }
      },
      {
        path: 'gunnerType',
        component: () => import('@/views/baseData/otherRelated/GunnerType'),
        name: 'GunnerType',
        meta: {
          title: 'gunnerType',
          noCache: true
        }
      }
    ]
  }
]

export default baseDataRouter
