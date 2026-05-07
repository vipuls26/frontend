import JobList from '@/components/job/JobList.vue'
import CandidateDashboard from '@/components/user/CandidateDashboard.vue'
import ApplicationTracker from '@/components/user/ApplicationTracker.vue'
import CompanyList from '@/components/user/CompanyList.vue'
import CompanyManager from '@/components/recruiter/CompanyManager.vue'
import RecruiterApplications from '@/components/recruiter/RecruiterApplications.vue'
import RecruiterDashboard from '@/components/recruiter/RecruiterDashboard.vue'
import RecruiterJobManager from '@/components/recruiter/RecruiterJobManager.vue'

import DashboardLayout from '@/layouts/DashboardLayout.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import { useAuthStore } from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      guest: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: {
      guest: true,
    },
  },
  {
    path: '/',
    component: DashboardLayout,

    meta: {
      requiresAuth: true,
    },

    redirect: '/candidate/dashboard',

    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/candidate/dashboard',
      },
      {
        path: 'candidate/dashboard',
        name: 'candidate-dashboard',
        component: CandidateDashboard,
        meta: {
          roles: ['candidate'],
        },
      },

      {
        path: 'jobs',
        name: 'jobs',
        component: JobList,
        meta: {
          roles: ['candidate'],
        },
      },

      {
        path: 'companies',
        name: 'companies',
        component: CompanyList,
        meta: {
          roles: ['candidate'],
        },
      },
      {
        path: 'applications',
        name: 'application',
        component: ApplicationTracker,
        meta: {
          roles: ['candidate'],
        },
      },
      {
        path: 'recruiter/dashboard',
        name: 'recruiter-dashboard',
        component: RecruiterDashboard,
        meta: {
          roles: ['recruiter'],
        },
      },
      {
        path: 'recruiter/company',
        name: 'recruiter-company',
        component: CompanyManager,
        meta: {
          roles: ['recruiter'],
        },
      },
      {
        path: 'recruiter/jobs',
        name: 'recruiter-jobs',
        component: RecruiterJobManager,
        meta: {
          roles: ['recruiter'],
        },
      },
      {
        path: 'recruiter/applications',
        name: 'recruiter-applications',
        component: RecruiterApplications,
        meta: {
          roles: ['recruiter'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: LoginPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const token = localStorage.getItem('token')

  if (token && !auth.tokenVerified) {
    await auth.verifyToken()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return auth.homeRoute
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.role)) {
    return auth.homeRoute
  }
})

export default router
