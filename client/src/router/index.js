import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "@/store/index.js";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/MainPage/MainPage.vue'),
    },
    {
      path: '/uploadDoc',
      name: 'UploadDoc',
      component: () => import('../vues/Qualité.vue'),
      //meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/Login.vue'),
    },
    {
      path: '/maintenance',
      name: 'Maintenance',
      component: () => import('../vues/Maintenance.vue'),
    },
    {
      path: '/achats',
      name: 'Achats',
      component: () => import('../vues/Achats.vue'),
    },
    {
      path: '/consignes',
      name: 'Consignes',
      component: () => import('../vues/PassageConsigne.vue'),
    },
    {
      path: '/consultation-machines',
      name: 'ConsultationMachines',
      component: () => import('../vues/ConsultationMachines.vue'),
    },{
      path: '/cycle-prod-bonneville',
      name: 'CycleProdBonneville',
      component: () => import('../vues/CycleProdBonneville.vue'),
    },
    {
      path: '/cycle-prod-vougy',
      name: 'CycleProdVougy',
      component: () => import('../vues/CycleProdVougy.vue'),
    },{
      path: '/insertion-donnees',
      name: 'InsertionDonnees',
      component: () => import('../vues/InsertionDonnées.vue'),
    },{
      path: '/demande-achats',
      name: 'Demandedachats',
      component: () => import('../components/Achats/DemandeAchats.vue'),
    },
    {
      path: '/gestion-achats',
      name: 'Gestionachats',
      component: () => import('../components/Achats/GestionAchats.vue'),
    },
    {
      path: '/gestion-qualite',
      name: 'Gestionqualite',
      component: () => import('../components/GestionDocumentaire/Gestionqualite.vue'),
    },
    {
      path: '/affichage-maintenance',
      name: 'AffichageMaintenance',
      component: () => import('../components/Maintenance/AffichageMaintenance.vue'),
    },
    {
      path: '/gestion-rebuts',
      name: 'GestionRebuts',
      component: () => import('../vues/GestionRebuts.vue'),
    },
    {
      path: '/auth-rebuts',
      name: 'AuthRebuts',
      component: () => import('../components/GestionRebuts/AuthRebuts.vue'),
    },
    {
      path: '/3D',
      name: '3D',
      component: () => import('../components/Interface3D.vue'),
    },{
      path: '/new-consigne',
      name: 'NewConsigne',
      component: () => import('../components/PassageConsignes/ConsigneForm.vue'),
    },
    {
      path: '/controles',
      name: 'Controles',
      component: () => import('../components/Controles/AffichageControles.vue'),
    },

    {
      path: '/gestion-maintenance',
      name: 'GestionMaintenance',
      component: () => import('../components/Maintenance/Niv2/GestionMaintenance.vue'),
    },
    {
      path: '/3D',
      name: '3D',
      component: () => import('../components/Interface3D.vue'),
    },

  ]
})

router.beforeEach((to, from, next) => {
  const store = useAuthStore()
  //store.checkTokenExpiration()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.isLoggedIn) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
