<script>
import { computed, onMounted } from 'vue'
import { useSnippetStore } from '@/stores/SnippetStore.js'
import { useI18n } from 'vue-i18n'
export default {
  name: 'TrackdayList',
  props: {
    lang: {
      type: String,
      required: true
    },
    sid: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { locale, d} = useI18n()
    const snippetStore = useSnippetStore()

    onMounted(() => {
      snippetStore.fetch(props.sid)
      locale.value = props.lang
    })
    const firstImageUrl = computed(() => {
      const snippet = snippetStore.getSnippet
      return snippet?.images?.[0]?.url || null
    })
    const formatDate = (date) => {
      return d(new Date(date), 'long') // use 'short' or 'long' format as defined
    }
    const backgroundClass = computed(() => {
      return 'background'
    })

    const backgroundStyle = computed(() => {
      if (firstImageUrl.value) {
        return {
          backgroundImage: `url(${firstImageUrl.value})`,
          backgroundColor: 'var(--trackday-list-background-color)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }else {
        return {
          backgroundColor: 'var(--trackday-list-background-color)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        }
      }
    })
    return {
      firstImageUrl,
      snippetStore,
      backgroundStyle,
      backgroundClass,
      formatDate,
      ...props

    }
  }
}
</script>

<template>
  <div class="spinner" v-if="snippetStore.isFetching">
    <v-progress-circular size="70" color="green"  indeterminate ></v-progress-circular>
  </div>
  <div v-else class="main-wrapper cb-row relative">
    <div class="background background-extra" :style="backgroundStyle"></div>
    <div class="text-overlay text-overlay-extra">
      <div class="background-container">
        <div class="columns image-overlay">
          <div class="season_title concept-content" style="display: none;">
          </div>
          <div class="trackdays-container list">
            <h1 v-if="snippetStore.getTrackdayItems.length === 0" class="main-heading">{{ $t('sorryNoDateAvailable')}}</h1>
            <h4 class="concept-content-extra">
              {{ snippetStore.getSnippet?.trackday.name }}
            </h4>
            <h4>{{ $t('date') }}</h4>

            <div v-for="item in snippetStore.getTrackdayItems" :key="item.id" class="trackday-element-wrapper">
              <div class="d-flex flex-column mb-4 trackday-element">
                <div class="trackday-date-container-normal">
                  <span class="trackday-start-date">{{ formatDate(item.time_start) }}</span>
                  <span class="trackday-start-hour">{{ $t('hour') }}</span>

                  <span v-if="item.is_bookable" class="trackday-available-slots">({{ item.available_bookings }}
                                                {{ $t('freePlaces') }})</span>

                </div>
                <div v-if="typeof item.variant !== 'undefined' && typeof item.variant.location !== 'undefined' ">
                  <span class="trackday-location">{{ item.variant.location.name }}</span>
                  <span class="trackday-variant-name">({{ item.variant.name }})</span>
                </div>
                <div class="trackday-name">
                  <span>{{ item.name }}</span>
                </div>
                <div v-if="item.is_bookable">
                  <div v-if="item.available_bookings <= 0">
                    - {{ $t('fullyBooked') }}
                  </div>
                  <div v-else>
                    <router-link class="trackday-booking-link" :to='{ path: `/trackdays/${lang}/${item.id}`, query: {sid: sid} }'>
                      {{ $t('bookNow') }}
                    </router-link>
                  </div>
                </div>

                <div v-else class="text-muted">
                  - {{ $t('dateElapsed') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="firstImageUrl !== null" class="background-image mobile">
    <img alt="Background Image" :src="firstImageUrl" />
  </div>
  <div v-else class="background-image mobile"></div>

</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ensure it takes the full viewport height */
}


</style>

