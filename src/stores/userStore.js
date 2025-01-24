import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      user: null,
      token: null,
    };
  },
  actions: {
    setUser(data) {
      this.user = {};
      Object.assign(this.user, data);
      console.log('set user', data)
    },   
    getUser() {
      return this.user;
    },
    setToken(data) {
      this.token = data;
      console.log('set token', data)
    },   
    getToken() {
      return this.token;
    },
    clearUser() {
      this.user = null;
      this.token = null;
    },
  }
});