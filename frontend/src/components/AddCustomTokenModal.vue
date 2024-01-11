<template>
    <q-dialog v-model="isAddCustomTokenDialogVisible" @before-show="onBeforeShow" @before-hide="onBeforeHide">
      <q-layout view="Lhh lpR fff" container class="q-my-sm" :style="isDark ? 'background-color: #121212' : ''">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Add a custom token</q-toolbar-title>
            <!-- <q-btn flat v-close-popup round dense icon="close"></q-btn> -->
          </q-toolbar>
        </q-header>

        <!--<q-footer class="bg-black text-white">
          <q-toolbar>
            <q-toolbar-title>Footer</q-toolbar-title>
            <q-btn @click="{}">OK</q-btn> 
            <q-btn v-close-popup>Cancel</q-btn>
          </q-toolbar>
        </q-footer>-->

        <!-- <q-drawer bordered v-model="drawer" :width="200" :breakpoint="600" class="bg-grey-3 text-dark q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>-->
<!--
        <q-drawer side="right" bordered v-model="drawerR" :width="200" :breakpoint="300" class="bg-grey-3 text-dark q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>
-->
        <q-page-container>
          <q-page padding>
            <!-- p -->
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="tokenAddress"
        label="Token address *"
        hint="0xABCD"
        lazy-rules
        :rules="[ val => val && val.length > 2 || 'Please type a token address']"
      ></q-input>

      <q-input
        filled
        v-model="tokenSymbol"
        label="Token symbol (ticker) *"
        hint="TOK"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type a token symbol (ticker)']"
      ></q-input>

      <q-input
        filled
        v-model="decimals"
        label="Number of decimals *"
        hint="18"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type number of decimals (ERC20)']"
      ></q-input>

      <div>
        <q-btn label="OK" type="submit" color="primary" class="q-ml-sm"></q-btn>
        <q-btn v-close-popup color="primary" class="q-ml-sm">Cancel</q-btn>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
      </div>
    </q-form>
            <!-- /p -->
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>



<!--      <div v-html="$t('Argent.warning-paragraph')"></div>-->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { isTokenAdd } from 'src/components/BaseSelect.vue';
import useSettingsStore from 'src/store/settings';

export var isAddCustomTokenDialogVisible = ref(false);

export default defineComponent({
  name: 'AddCustomTokenModal',
  //setup(_props, context) {
  //  return { context };
  /*data() {
    return {
      decimals,
      tokenAddress,
      tokenSymbol,
      submittedOK,
      hidden
    };
  },*/
  emits: ['update:modelValue'],
  /*watch: {
    modelValue(val) {
      isAddCustomTokenDialogVisible.value = val; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    },
  },*/
  methods: {
    handleInput() {
        this.$emit('update:modelValue', isAddCustomTokenDialogVisible.value);
    },
  },
  setup () {
    const { isDark } = useSettingsStore();

    const $q = useQuasar()

    const tokenAddress = ref(null)
    const tokenSymbol = ref(null)
    const decimals = ref(null)

    const submittedOK = ref(false)
    const hidden = ref(false)

    function clear() {
        decimals.value = null
        tokenAddress.value = null
        tokenSymbol.value = null
        submittedOK.value = false;
    }

    return {
      tokenAddress,
      tokenSymbol,
      decimals,
      hidden,
      submittedOK,
      isTokenAdd,
      isDark,
      isAddCustomTokenDialogVisible,
      
      onSubmit () {
/*        if (accept.value !== true) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        }
        else {*/
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            //icon: 'cloud_done',
            message: 'Submitted'
          });
          submittedOK.value = true;
          isAddCustomTokenDialogVisible.value = false;
        //}
      },

      onReset () {
        clear();
      },
      
      onBeforeHide () {
        hidden.value = true;        
      },
      
      onBeforeShow () {
        hidden.value = false;
        clear();
      },
    }
  },
});
</script>
