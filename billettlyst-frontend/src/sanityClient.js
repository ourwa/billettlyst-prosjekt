import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'lslktf7ze',  
  dataset: 'production',
  apiVersion: '2023-01-01', 
  useCdn: true,           
})

export default client
