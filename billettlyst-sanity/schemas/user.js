export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'gender',
        title: 'Gender',
        type: 'string',
        options: {
          list: ['Male', 'Female', 'Other'],
        },
      },
      {
        name: 'age',
        title: 'Age',
        type: 'number',
      },
      {
        name: 'wishlist',
        title: 'Wishlist',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'event' }] }],
      },
      {
        name: 'previousPurchases',
        title: 'Previous Purchases',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'event' }] }],
      },
      {
        name: 'friends',
        title: 'Friends',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'user' }] }],
      },
      {
        name: 'image',
        title: 'Profile Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
    ],
  }
  