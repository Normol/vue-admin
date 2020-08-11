<template>
  <base-assembler
    :config="config"
  />
</template>

<script>
import { baseAssemblerConfig } from './index'
import BaseAssembler from '@/components/base-assembler'

export default {
  name: 'FilterPagingTable',

  components: {
    BaseAssembler
  },

  data() {
    return {
      config: baseAssemblerConfig
    }
  }
}
</script>

