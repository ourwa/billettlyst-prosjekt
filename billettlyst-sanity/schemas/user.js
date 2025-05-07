export default {
  name: 'bruker',
  title: 'Bruker',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
    },
    {
      name: 'email',
      title: 'E-post',
      type: 'string',
    },
    {
      name: 'gender',
      title: 'Kjønn',
      type: 'string',
      options: {
        list: ['Mann', 'Kvinne', 'Annet'],
      },
    },
    {
      name: 'age',
      title: 'Alder',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Profilbilde',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'previousPurchases',
      title: 'Tidligere kjøp',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
    },
    {
      name: 'wishlist',
      title: 'Ønskeliste',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'event' }] }],
    },
    {
      name: 'friends',
      title: 'Venner',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'bruker' }] }],
    },
  ],
}
