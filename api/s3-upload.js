import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'nl-ams',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
})

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500mb',
    },
  },
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileName, fileData, contentType } = req.body

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'Missing fileName or fileData' })
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData.split(',')[1], 'base64')

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    })

    await s3Client.send(command)

    const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileName}`

    return res.status(200).json({ 
      success: true, 
      url: fileUrl,
      message: 'File uploaded successfully'
    })
  } catch (error) {
    console.error('S3 Upload Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}
