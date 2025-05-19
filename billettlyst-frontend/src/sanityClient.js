import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'lslkf7ze',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: import.meta.env.VITE_SANITY_TOKEN, 
})

export default client
