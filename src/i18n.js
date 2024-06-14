import { createI18n } from 'vue-i18n'
const datetimeFormats = {
  'en': {
    short: {
      year: 'numeric', month: 'short', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  },
  'de': {
    short: {
      year: 'numeric', month: 'long', day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short', hour: 'numeric', minute: 'numeric'
    }
  }
}
// Define your translations
const messages = {
  en: {
    sorryNoDateAvailable: "Sorry, no dates are currently available.",
    date: "Dates",
    hour: "",
    freePlaces: "Free spots",
    fullyBooked:" Fully booked",
    welcome: 'Welcome',
    bookNow: 'Book now',
    trackday: 'Trackday',
    available_bookings: 'Available Bookings',
    dateElapsed: "Date elapsed"
    // Add other translations here
  },
  de: {
    sorryNoDateAvailable: "Leider sind aktuell keine Termine verfügbar.",
    date: "Termine",
    hour: "Uhr",
    fullyBooked:"Ausgebucht",
    freePlaces: "Freie Plätze",
    welcome: 'Bienvenue',
    bookNow: 'Jetzt buchen',
    trackday: 'Journée de piste',
    available_bookings: 'Réservations disponibles',
    dateElapsed: "Datum abgelaufen"
    // Add other translations here
  },
  // Add more languages here
}

// Create an i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en', // Set default locale
  fallbackLocale: 'en', // Set fallback locale
  messages, // Set translation messages
  datetimeFormats
})

export default i18n
