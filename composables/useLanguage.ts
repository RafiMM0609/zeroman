import { ref, watch, onMounted } from 'vue'

const PREF_KEY = 'zeroman_lang'
const GEO_CACHE_KEY = 'geolang_country'
const GEO_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export interface GeoData {
  country: string
  countryCode: string | null
  city: string
  region: string
  ip: string
  lang: 'en' | 'id'
  error?: boolean
}

export const useLanguage = () => {
  const lang = useState<'en' | 'id'>('zeroman-language', () => 'en')
  const geoData = useState<GeoData | null>('zeroman-geodata', () => null)
  const isLoaded = useState<boolean>('zeroman-language-loaded', () => false)

  const setLang = (newLang: 'en' | 'id') => {
    lang.value = newLang
    if (import.meta.client) {
      localStorage.setItem(PREF_KEY, newLang)
      document.documentElement.lang = newLang === 'id' ? 'id' : 'en'
    }
  }

  const translate = (obj: any, key: string) => {
    if (!obj) return ''
    if (lang.value === 'id' && obj[key + '_id'] !== undefined) {
      return obj[key + '_id']
    }
    if (lang.value === 'en' && obj[key + '_en'] !== undefined) {
      return obj[key + '_en']
    }
    return obj[key] || ''
  }

  const fetchGeoLocation = async (): Promise<GeoData> => {
    if (!import.meta.client) {
      return { country: 'Unknown', countryCode: null, city: '', region: '', ip: '', lang: 'en' }
    }

    try {
      const cached = sessionStorage.getItem(GEO_CACHE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Date.now() - parsed.ts < GEO_CACHE_TTL) return parsed
      }
    } catch (_) {}

    try {
      const res = await fetch('https://ip-api.com/json/?fields=status,country,countryCode,city,regionName,query', {
        signal: AbortSignal.timeout(5000)
      })
      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      if (data.status !== 'success') throw new Error('Geo failed')
      
      const result: GeoData = {
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        region: data.regionName,
        ip: data.query,
        lang: (data.countryCode?.toUpperCase() === 'ID' || data.country?.toLowerCase() === 'indonesia') ? 'id' : 'en'
      }
      
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ...result, ts: Date.now() }))
      } catch (_) {}
      
      return result
    } catch (err) {
      console.warn('[geo-lang] Geolocation fetch failed, defaulting to EN:', err)
      return { country: 'Unknown', countryCode: null, city: '', region: '', ip: '', lang: 'en', error: true }
    }
  }

  const initLanguage = async () => {
    if (!import.meta.client) return

    const savedPref = localStorage.getItem(PREF_KEY) as 'en' | 'id' | null
    if (savedPref === 'en' || savedPref === 'id') {
      lang.value = savedPref
      document.documentElement.lang = savedPref === 'id' ? 'id' : 'en'
      isLoaded.value = true
      
      // Still fetch geo in background for geo badge info
      fetchGeoLocation().then(geo => {
        geoData.value = geo
      })
    } else {
      // No saved preference, use geolocation
      const geo = await fetchGeoLocation()
      geoData.value = geo
      lang.value = geo.lang
      document.documentElement.lang = geo.lang === 'id' ? 'id' : 'en'
      isLoaded.value = true
    }
  }

  return {
    lang,
    geoData,
    isLoaded,
    setLang,
    translate,
    initLanguage
  }
}
