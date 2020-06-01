<template>
  <div id="simply" :class="[side ? 'expanded' : '']">
    <template v-if="!$client.supported">
      <simply-unsupported />
    </template>
    <template v-else>
      <main class="simply-main">
        <div class="header-container">
          <simply-header />
        </div>
        <div class="video-container">
          <simply-video ref="video" />
        </div>
        <div class="room-container">
          <simply-members />
          <div class="room-menu">
            <div class="settings">
              <simply-menu />
            </div>
            <div class="controls">
              <simply-controls />
            </div>
            <div class="emotes">
              <simply-emotes />
            </div>
          </div>
        </div>
      </main>
      <simply-side v-if="side" />
      <simply-connect v-if="!connected" />
      <simply-about v-if="about" />
      <notifications group="simply" position="top left" style="top: 50px;" />
    </template>
  </div>
</template>

<style lang="scss">
  #simply {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100vw;
    max-height: 100vh;
    flex-direction: row;
    display: flex;

    .simply-main {
      min-width: 360px;
      max-width: 100%;
      flex-grow: 1;
      flex-direction: column;
      display: flex;
      overflow: auto;

      .header-container {
        background: $background-tertiary;
        height: $menu-height;
        flex-shrink: 0;
        display: flex;
      }

      .video-container {
        background: rgba($color: #000, $alpha: 0.4);
        max-width: 100%;
        flex-grow: 1;
        display: flex;
      }

      .room-container {
        background: $background-tertiary;
        height: $controls-height;
        max-width: 100%;
        flex-shrink: 0;
        flex-direction: column;
        display: flex;

        .room-menu {
          max-width: 100%;
          flex: 1;
          display: flex;

          .settings {
            margin-left: 10px;
            flex: 1;
            justify-content: flex-start;
            align-items: center;
            display: flex;
          }

          .controls {
            flex: 1;
            justify-content: center;
            align-items: center;
            display: flex;
          }

          .emotes {
            margin-right: 10px;
            flex: 1;
            justify-content: flex-end;
            align-items: center;
            display: flex;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 600px) {
    #simply {
      &.expanded {
        .simply-main {
          transform: translateX(-$side-width);
        }
        .simply-menu {
          transform: translateX(-$side-width);
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    #simply {
      .simply-main {
        .room-container {
          display: none;
        }
      }
    }
  }
</style>

<script lang="ts">
  import { Vue, Component, Ref } from 'vue-property-decorator'

  import Connect from '~/components/connect.vue'
  import Video from '~/components/video.vue'
  import Menu from '~/components/menu.vue'
  import Side from '~/components/side.vue'
  import Controls from '~/components/controls.vue'
  import Members from '~/components/members.vue'
  import Emotes from '~/components/emotes.vue'
  import About from '~/components/about.vue'
  import Header from '~/components/header.vue'
  import Unsupported from '~/components/unsupported.vue'

  @Component({
    name: 'simply',
    components: {
      'simply-connect': Connect,
      'simply-video': Video,
      'simply-menu': Menu,
      'simply-side': Side,
      'simply-controls': Controls,
      'simply-members': Members,
      'simply-emotes': Emotes,
      'simply-about': About,
      'simply-header': Header,
      'simply-unsupported': Unsupported,
    },
  })
  export default class extends Vue {
    @Ref('video') video!: Video

    get about() {
      return this.$accessor.client.about
    }

    get side() {
      return this.$accessor.client.side
    }

    get connected() {
      return this.$accessor.connected
    }
  }
</script>
