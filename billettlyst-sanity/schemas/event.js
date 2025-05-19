export default {
  name: 'event',    //internt navn (brukes i referanser)
  title: 'Event',      //vises i Sanity Studio
  type: 'document',   //dette er et dokumenttype

  fields: [           //definerer feltene i dokumentet
    {
      name: 'title',     //intern nøkkel
      title: 'Tittel',  //vises i Studio
      type: 'string',  //tekstfelt
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
        list: ['Festival', 'Sport', 'Show'], //rullgardinliste
      },
    },
  ],
}
