export default {
    name: 'event',
    title: 'Event',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Tittel',
        type: 'string',
      },
      {
        name: 'apiId',
        title: 'API-ID (fra Ticketmaster)',
        type: 'string',
      },
      {
        name: 'category',
        title: 'Kategori',
        type: 'string',
        options: {
          list: ['Festival', 'Sport', 'Show'],
        },
      },
    ],
  };
  