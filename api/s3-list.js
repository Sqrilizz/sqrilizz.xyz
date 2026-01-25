import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'nl-ams',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
})

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
    })

    const response = await s3Client.send(command)

    const files = (response.Contents || []).map(file => ({
      key: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
      url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${file.Key}`
    }))

    return res.status(200).json({ success: true, files })
  } catch (error) {
    console.error('S3 List Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}
