import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: "hey",
    token: null,
    groups: null,
    display:'',
    isAuthorized: false,

  }),
  getters: {
    isLoggedIn () {
      if(this.token){
        return !!this.token
      }
    }
  },
  actions: {
    setToken(newToken) {
      //console.log("store :", newToken)
      localStorage.setItem('token', newToken)
      this.token = newToken;
    },
    setUser(newUser) {
      //console.log("store :", newUser)
      this.user = newUser;
    },
    setIsAuthorized(isAuthorized) {
      console.log("store :", isAuthorized)
      this.isAuthorized = isAuthorized;
    },
    setGroups(newgroups) {
      console.log("store :", newgroups)
      localStorage.setItem('groups', newgroups)
      this.groups = newgroups;
    },
    setDisplay(newDisplay) {
      //console.log("store :", newDisplay)
      this.display = newDisplay;
    },
    clearToken() {
      this.token = null;
      this.user = null;
      this.isAuthorized = false;
      localStorage.removeItem('token')
      localStorage.removeItem('groups')
      location.reload(true);
    },
    initializeToken() {
      const token = localStorage.getItem('token');
      const groups = localStorage.getItem('groups');
      if (token) {
        this.token = token;
        this.groups = groups;
      }
    },
    checkTokenExpiration () {
      if (this.token) {
        const decodedToken = jwtDecode(this.token)
        //this.group = decodedToken['group'];
        this.user = decodedToken['username'];
        const currentTime = Date.now() / 1000
        const expirationTime = decodedToken.exp
        const timeRemaining = expirationTime - currentTime
        //console.log('Temps restant avant expiration du token:', timeRemaining, 'secondes')
        if (decodedToken.exp < currentTime) {
          if (this.token) {
            this.clearToken()
          }
          router.push({ name: 'Login' })
        }
      }
    },
  },
})

