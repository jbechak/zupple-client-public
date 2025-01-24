<template>
  <div>
    <nav class="navbar fixed-top ps-3 pe-1 py-0">
      <div class="d-flex justify-content-start">
        <div :class="getClass(CONSTANTS.WORDSEARCH)" id="ws-nav" @click="selectTab(CONSTANTS.WORDSEARCH)">
          Wordsearch
        </div>
        <div :class="getClass(CONSTANTS.CROSSWORD)" id="cw-nav" @click="selectTab(CONSTANTS.CROSSWORD)">
          Crossword
        </div>
        <div :class="getClass(CONSTANTS.SUDOKU)" id="ws-nav" @click="selectTab(CONSTANTS.SUDOKU)">
          SuDoku
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <div v-if="!currentUser" :class="getLoginButtonClass()" id="login-nav" @click="isLoggingIn = !isLoggingIn">
          Login
        </div>
        <div v-else :class="getClass(CONSTANTS.LOGIN)" id="login-nav" @click="logOut">
          Logout
        </div>
        <div v-if="currentUser" class="userInitialClass" :class="[STYLES.FW_BOLD]">
          {{ currentUser.username[0].toUpperCase() }}
        </div>
      </div>
    </nav>
    <div class="px-3">
      <Login 
        v-if="isLoggingIn" 
        class="border-bottom mb-3"
        @loggedIn="isLoggingIn = false"
        @close="isLoggingIn = false" 
      />
      <ModuleView 
        v-if="selectedTab" 
        ref="moduleView"
        :puzzle-type="selectedTab" 
        :userId="currentUser?.id"
        @login="isLoggingIn = true"
      />
      <div v-else class="mt-5">
        <h1>ZUPPLE</h1>
        <div v-if="currentUser">{{ homeMessage }}</div>
        <div v-else>
          Please
          <span class="text-primary" @click="isLoggingIn = !isLoggingIn">log in</span>
          or choose a puzzle type from the navigation bar
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed } from "vue";
import { CONSTANTS, STYLES } from "@/constants";
import ModuleView from "@/components/ModuleView.vue";
import Login from "@/components/Authorization/Login.vue";
import { useUserStore } from "@/stores/userStore";
import { displayToast } from "@/helpers";

const userStore = useUserStore();
const selectedTab = ref(null);
const moduleView = ref(null);
const isLoggingIn = ref(false);

const currentUser = computed(() => userStore.getUser());

const homeMessage = 'Please choose a puzzle type from the navigation bar';

const selectTab = (tabName) => selectedTab.value = selectedTab.value === tabName ? null : tabName;
const getClass = (tabName) => selectedTab.value === tabName
  ? "nav-item py-2 selected"
  : "nav-item py-2";

const getLoginButtonClass = () => isLoggingIn.value
  ? "nav-item py-2 logging-in"
  : "nav-item py-2";

function logOut() {
  clearAllData();
  selectedTab.value = null;
  displayToast(`Logged out`, CONSTANTS.SUCCESS);
}

function clearAllData() {
  userStore.clearUser();
  if (moduleView.value)
    moduleView.value.resetAllFormData();
}
</script>

<style scoped>
.navbar {
  background: #F7F5F0;
}
.nav-item {
  width: 100px;
}
.logging-in {
  background-color: rgb(233, 185, 227);
}
.selected {
  background-color: rgb(185, 185, 233);
}
.userInitialClass {
  background-color: rgb(235, 157, 153);
  font-size: 20px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding-top: 3px;
  width: 36px;
  border-radius: 50%
}
.nav-item, .text-primary:hover {
  cursor: pointer;
}
</style>