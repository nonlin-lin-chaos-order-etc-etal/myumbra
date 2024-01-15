<template>
  <div>
    <q-select
      v-model="content"
      color="primary"
      class="q-my-sm"
      data-cy="base-select"
      :dense="dense"
      :disable="disable"
      :emit-value="emitValue"
      :filled="filled"
      :hide-bottom-space="hideBottomSpace"
      :hint="!hideBottomSpace ? hintString : undefined"
      :label="label"
      :lazy-rules="lazyRules"
      :options="options"
      :option-label="optionLabel"
      :outlined="outlined"
      :readonly="readonly"
      ref="QSelect"
      :rounded="rounded"
      :rules="[(val) => rules(val)]"
      @blur="hideHint"
      @focus="showHint"
      @update:modelValue="() => { handleInput(); updateTokenSelectValue(toRaw(content)); }"
    >
      <!-- Show icons when selected or when the slot is provided-->
      <template v-slot:prepend v-if="content && content.logoURI">
        <img :src="content.logoURI" style="height: 1.5rem" />
      </template>
      <template v-slot:prepend v-else>
        <slot name="prepend"></slot>
      </template>

      <!-- Show icons in dropdown list -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemProps" v-if="scope.opt.address">
          <q-item-section avatar v-if="scope.opt.logoURI">
            <img class="horizontal-center" :src="scope.opt.logoURI" style="height: 1.5rem" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt[optionLabel] }}</q-item-label>
          </q-item-section>
          <q-item-section v-if="tokenBalances">
            <q-item-label class="text-right">
              {{ humanizeTokenAmount(tokenBalances[scope.opt.address], scope.opt) }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-bind="scope.itemProps" v-on="scope.itemProps" v-else>
          <q-item-section>
            <q-item-label>{{ $t('BaseSelect.addToken') }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!--<add-custom-token-modal
        isAddCustomTokenDialogVisible="isTokenAdd"
        class="q-pa-lg" 
    />-->
    <q-dialog v-model="isAddCustomTokenDialogVisible" @before-show="onBeforeShow" @before-hide="onBeforeHide">
      <q-layout view="Lhh lpR fff" container class="q-my-sm" :style="isDark ? 'background-color: #121212' : 'background-color: white'">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title>Add a custom token</q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
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
                :rules="[ val => val && val.length > 2 && val.startsWith('0x') && isAddress(val) || 'Please type a valid address of token\'s smart contract']"
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
                :rules="[ val => val && val.length > 0 && isIntString(val) || 'Please type token\'s number of decimals (as in ERC20)']"
              ></q-input>

              <div>
                <q-btn label="OK" type="submit" color="primary" class="q-ml-sm"></q-btn>
                <q-btn v-close-popup color="primary" class="q-ml-sm">Cancel</q-btn>
                <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
              </div>
            </q-form>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
    
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, computed/*, getCurrentInstance*/, toRaw } from 'vue';
import { tc } from 'src/boot/i18n';
import { humanizeTokenAmount } from 'src/utils/utils';
import { TokenInfoExtended } from 'src/components/models';
import { useQuasar } from 'quasar';
import useSettingsStore from 'src/store/settings';
import useWalletStore from 'src/store/wallet';
import { isAddress } from 'src/utils/ethers';


interface IAddCustomTokenCommand {
  add: boolean;
}

export class AddCustomTokenCommand implements IAddCustomTokenCommand {
  add: boolean;
  symbol: string;
  constructor() {
    this.add = true;
    this.symbol = tc('BaseSelect.addToken');
  }
}


export default defineComponent({
  name: 'BaseSelect',
  
  //components: { AddCustomTokenModal }, // prettier-ignore

  setup() {

    const {
        isDark,
        setCustomTokens,
        customTokens
    } = useSettingsStore();
    const {
        chainId,
        tokens
    } = useWalletStore();    

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

    const updateTokenSelectValue = (value: AddCustomTokenCommand | TokenInfoExtended) => {
        if(value instanceof AddCustomTokenCommand){
            console.log('add custom token triggered, value.add:', value.add);
            isAddCustomTokenDialogVisible.value  = true;
        }
        else console.log('known token triggered, value:', value);
        unconvertedToken.value = value;
    }

    const unconvertedToken  = ref<unknown|null>(null);
    
    const QSelect = ref<AddCustomTokenCommand | TokenInfoExtended | null>(null);

    const isTokenAdd = computed(() => unconvertedToken.value instanceof AddCustomTokenCommand ? unconvertedToken.value.add : <boolean>false);
    
    const isAddCustomTokenDialogVisible = ref(false);
    
    const addCustomTokenModalShown = computed(() => isTokenAdd.value);
    console.log('addCustomTokenModalShown.value:', addCustomTokenModalShown.value)
    //const addCustomTokenModal = computed<boolean>(() => addCustomTokenModalShown.value);

    watch(isTokenAdd, (newTokenAdd, oldTokenAdd) => {
      if (newTokenAdd && (newTokenAdd != oldTokenAdd)) {
        console.log('BaseSelect: newTokenAdd:', newTokenAdd);
        isAddCustomTokenDialogVisible.value  = true;
      }else 
        console.log('BaseSelect: newTokenAdd is false or old');
    });
    
    const isIntString = (str: string): boolean => {
      const n = parseInt(str);  
      if (`${n}`==str)return true;
      return false;
    };

    const content = ref(tokens.value[0]);

    return {
      content,
      setCustomTokens,
      customTokens,
      QSelect,
      isTokenAdd,
      unconvertedToken,
      updateTokenSelectValue,
      toRaw,
      tokenAddress,
      tokenSymbol,
      decimals,
      hidden,
      submittedOK,
      isDark,
      isAddCustomTokenDialogVisible,
      isAddress,
      isIntString,

      onSubmit () {
        const tokenSymbol_ = tokenSymbol;
        if (tokenSymbol_.value == null) throw '!tokenSymbol.value'
        if (decimals.value == null) throw '!decimals.value'
        if (tokenAddress.value == null) throw '!tokenAddress.value'
        if (!chainId.value) throw '!chainId.value'
        const symbol = (<string>tokenSymbol_.value).toUpperCase()
        const token = <TokenInfoExtended> {
            chainId: chainId.value, // number
            address: <string>tokenAddress.value,
            name: symbol,
            decimals: parseInt(decimals.value),
            symbol: symbol,
            /*
            logoURI: null,
            tags: null,
            extensions: null,
            */
            minSendAmount: '0'
        };
        const newCustomTokens = <TokenInfoExtended[]>[];
        if (customTokens.value)
            for(var a of customTokens.value)
                newCustomTokens.push(a);
        newCustomTokens.push(token);
        
        const strcmp = ( str1: string, str2: string ): number => {
            return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
        }
        
        newCustomTokens.sort((ta, tb) => strcmp ( ta.symbol, tb.symbol ) );
        setCustomTokens(newCustomTokens);
        
        $q.notify({
            color: 'green-4',
            textColor: 'white',
            //icon: 'cloud_done',
            message: 'Submitted'
        });
        submittedOK.value = true;
        
        //select the newly added token in the current tokens dropdown
        console.log('content onSubmit:', content);
        if(content.value!=null)content.value=token;
        
        //hide
        isAddCustomTokenDialogVisible.value = false;
      },

      onReset () {
        clear();
      },
      
      onBeforeHide () {
        hidden.value = true;        
        if (!submittedOK.value) {
            //select the default token in the current tokens dropdown
            console.log('content onCancel:', content, 'toRaw(tokens.value[0]):', toRaw(tokens.value[0]));
            content.value=toRaw(tokens.value[0]);
        }
      },
      
      onBeforeShow () {
        hidden.value = false;
        clear();
      },
    }
  },
  props: {
    dense: {
      type: Boolean,
      required: false,
      default: false,
    },

    disable: {
      type: Boolean,
      required: false,
      default: false,
    },

    emitValue: {
      type: Boolean,
      required: false,
      default: false,
    },

    filled: {
      type: Boolean,
      required: false,
      default: true,
    },

    hideBottomSpace: {
      type: Boolean,
      required: false,
      default: false,
    },

    hint: {
      type: String,
      required: false,
      default: undefined,
    },

    label: {
      type: undefined,
      required: false,
      default: undefined,
    },

    lazyRules: {
      type: undefined, // can be true, false, or ondemand
      required: false,
      default: 'ondemand',
    },

    modelValue: {
      type: undefined,
      required: true,
      default: undefined,
    },

    options: {
      type: Array,
      required: true,
    },

    optionLabel: {
      type: String,
      required: false,
      default: 'value',
    },

    outlined: {
      type: Boolean,
      required: false,
      default: true,
    },

    readonly: {
      type: Boolean,
      required: false,
      default: false,
    },

    rounded: {
      type: Boolean,
      required: false,
      default: false,
    },

    rules: {
      type: Function,
      required: false,
      default() {
        return true;
      },
    },

    // If provided, assumes the list given is a token list and shows token balances in the dropdown.
    tokenBalances: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      hintString: '',
      humanizeTokenAmount,
    };
  },

  watch: {
    /**
     * @notice This is required for two-way binding when programmatically updating the input
     * in the parent component using BaseInput
     */
    modelValue(val) {
      this.content = val; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    },
  },

  emits: ['update:modelValue'],

  methods: {
    handleInput() {
      this.$emit('update:modelValue', this.content);
    },

    hideHint() {
      this.hintString = '';
    },

    showHint() {
      this.hintString = (this as unknown as { hint: string }).hint;
    },
  },
});
</script>
