export interface AddressSuggestion {
  id: string
  label: string
  countryCode: string
  city: string
  addressLine: string
  latitude: number
  longitude: number
}

export const addressSuggestions: AddressSuggestion[] = [
  {
    id: 'addr-1',
    label: 'Milan, Via Carlo Bazzi 18',
    countryCode: 'IT',
    city: 'Milan',
    addressLine: 'Via Carlo Bazzi 18',
    latitude: 45.4449,
    longitude: 9.1872,
  },
  {
    id: 'addr-2',
    label: 'Paris, Rue de Charenton 12',
    countryCode: 'FR',
    city: 'Paris',
    addressLine: 'Rue de Charenton 12',
    latitude: 48.851,
    longitude: 2.372,
  },
  {
    id: 'addr-3',
    label: 'Berlin, Invalidenstraße 116',
    countryCode: 'DE',
    city: 'Berlin',
    addressLine: 'Invalidenstraße 116',
    latitude: 52.531,
    longitude: 13.3849,
  },
  {
    id: 'addr-4',
    label: 'Barcelona, Carrer de Roc Boronat 138',
    countryCode: 'ES',
    city: 'Barcelona',
    addressLine: 'Carrer de Roc Boronat 138',
    latitude: 41.4037,
    longitude: 2.1983,
  },
  {
    id: 'addr-5',
    label: 'Warsaw, Prosta 51',
    countryCode: 'PL',
    city: 'Warsaw',
    addressLine: 'Prosta 51',
    latitude: 52.2319,
    longitude: 20.9929,
  },
  {
    id: 'addr-6',
    label: 'Dublin, Pearse Street 47',
    countryCode: 'IE',
    city: 'Dublin',
    addressLine: 'Pearse Street 47',
    latitude: 53.344,
    longitude: -6.247,
  },
]
