import { PluginObject } from 'vue'
import { SimplyClient } from '~/simply'

declare global {
  const $client: SimplyClient

  interface Window {
    $client: SimplyClient
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $client: SimplyClient
  }
}

const plugin: PluginObject<undefined> = {
  install(Vue) {
    window.$client = new SimplyClient()
      .on('error', window.$log.error)
      .on('warn', window.$log.warn)
      .on('info', window.$log.info)
      .on('debug', window.$log.debug)

    Vue.prototype.$client = window.$client
  },
}

export default plugin
