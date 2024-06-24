import { createI18n } from 'vue-i18n'

const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
      notation: 'standard',
      currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    percent: {
      style: 'percent',
      useGrouping: false
    }
  },
  de: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal',
      minimumSignificantDigits: 2,
      maximumSignificantDigits: 2
    },
    percent: {
      style: 'percent',
      useGrouping: false
    }
  }
}

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  de: {
    short: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}
// Define your translations
const messages = {
  en: {
    sorryNoDateAvailable: 'Sorry, no dates are currently available.',
    date: 'Dates',
    hour: '',
    freePlaces: 'Free spots',
    fullyBooked: ' Fully booked',
    welcome: 'Welcome',
    bookNow: 'Book now',
    trackday: 'Trackday',
    available_bookings: 'Available Bookings',
    dateElapsed: 'Date elapsed',
    contactInformation: 'Contact Information',
    addVehicle: 'Vehicle',
    addService: 'Add Services',
    redeemVoucher: 'Redeem voucher',
    confirmation: 'Confirmation',
    payment: 'Payment',
    next: 'Next',
    back: 'Back',
    price: 'Price',
    vatFooterNote: 'All prices are gross including the statutory value added tax.',
    firstname: 'First name',
    lastname: 'Last name',
    street: 'Street',
    streetNumber: 'Number',
    zip: 'Zip',
    city: 'City',
    country: 'Country',
    phone: 'Phone',
    email: 'Email',
    language: 'Language',
    additional: 'Additional remarks',
    hasInvoice: 'Different Invoice address',
    companyName: 'Company name',
    vatNumber: 'Vat number',
    required: 'You must enter a {property}',
    type: 'Type',
    make: 'Make',
    model: 'Model',
    constructionYear: 'Construction Year',
    total: 'Total',
    serviceName:'Service name',
    priceType:'Price Type',
    availability:'Availability',
    amount:'Amount',
  },
  de: {
    sorryNoDateAvailable: 'Leider sind aktuell keine Termine verfügbar.',
    date: 'Termine',
    hour: 'Uhr',
    fullyBooked: 'Ausgebucht',
    freePlaces: 'Freie Plätze',
    welcome: 'Bienvenue',
    bookNow: 'Jetzt buchen',
    trackday: 'Journée de piste',
    available_bookings: 'Réservations disponibles',
    dateElapsed: 'Datum abgelaufen',
    contactInformation: 'Teilnehmer Details',
    addVehicle: 'Fahrzeug',
    addService: 'Zusatzleistungen',
    redeemVoucher: 'Gutschein einlösen',
    confirmation: 'Bestätigen',
    payment: 'Zahlung',
    next: 'Weiter',
    back: 'Zurück',
    price: 'Preis',
    vatFooterNote: 'Alle Preise verstehen sich brutto inkl. der gesetzlichen Mehrwertsteuer. ',
    firstname: 'Vorname',
    lastname: 'Name',
    street: 'Straße',
    streetNumber: 'Hausnr',
    zip: 'PLZ',
    city: 'Ort',
    country: 'Land',
    phone: 'Telefon',
    email: 'E-Mail-Adresse',
    language: 'Sprache',
    additional: 'Bemerkungen',
    hasInvoice: 'Abweichende Rechnungsadresse',
    companyName: 'Firmenname',
    vatNumber: 'USt.-Nummer',
    required: '{property} ist erforderlich',
    type: 'Typ',
    make: 'Marke',
    model: 'Modell',
    constructionYear: 'Baujahr',
    total: 'Gesamt',
    serviceName:'Leistung',
    priceType:'Preistyp',
    availability:'Verfügbarkeit',
    amount:'Menge',
  }

}

// Create an i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en', // Set default locale
  fallbackLocale: 'en', // Set fallback locale
  messages, // Set translation messages
  datetimeFormats,
  numberFormats
})

export default i18n
