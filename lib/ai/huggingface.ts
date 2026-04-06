interface GenerateImageRequest {
  prompt: string
  model?: 'sdxl' | 'sd21' | 'photoreal' | 'openjourney'
  size?: '512x512' | '1024x1024' | '1920x1080'
  quality?: 'standard' | 'hd'
  style?: 'natural' | 'vivid' | 'anime'
  negative_prompt?: string
  num_images?: number
  seed?: number
}

interface GenerateImageResponse {
  success: boolean
  task_id: string
  status: 'processing' | 'completed' | 'failed'
  images: Array<{
    url: string
    width: number
    height: number
    seed?: number
  }>
  credits_used: number
  generation_time: number
}

const HUGGINGFACE_MODELS = {
  'sdxl': 'stabilityai/stable-diffusion-xl-base-1.0',
  'sd21': 'stabilityai/stable-diffusion-2-1',
  'photoreal': 'dreamlike-art/dreamlike-photoreal-2.0',
  'openjourney': 'prompthero/openjourney',
}

const STYLE_PROMPTS = {
  'natural': '',
  'vivid': ', vibrant colors, high contrast, dramatic lighting',
  'anime': ', anime style, manga art, japanese animation',
}

export async function generateImage(
  request: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const startTime = Date.now()
  
  const {
    prompt,
    model = 'sdxl',
    size = '1024x1024',
    quality = 'standard',
    style = 'natural',
    negative_prompt = '',
    seed,
  } = request

  // 解析尺寸
  const [width, height] = size.split('x').map(Number)
  
  // 增強 prompt
  const enhancedPrompt = prompt + STYLE_PROMPTS[style]
  
  // 選擇模型
  const modelId = HUGGINGFACE_MODELS[model]
  const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`
  
  // 調整參數
  const steps = quality === 'hd' ? 50 : 30
  
  // 呼叫 Hugging Face API
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: enhancedPrompt,
      parameters: {
        num_inference_steps: steps,
        guidance_scale: 7.5,
        width: width,
        height: height,
        negative_prompt: negative_prompt,
        ...(seed && { seed }),
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Hugging Face API error: ${error}`)
  }

  const imageBlob = await response.blob()
  
  // 上傳到 Supabase Storage
  const imageUrl = await uploadToStorage(imageBlob)
  
  const generationTime = (Date.now() - startTime) / 1000
  
  return {
    success: true,
    task_id: crypto.randomUUID(),
    status: 'completed',
    images: [
      {
        url: imageUrl,
        width: width,
        height: height,
        seed: seed,
      },
    ],
    credits_used: quality === 'hd' ? 2 : 1,
    generation_time: generationTime,
  }
}

async function uploadToStorage(blob: Blob): Promise<string> {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = createClient()
  
  const fileName = `${Date.now()}-${crypto.randomUUID()}.png`
  const filePath = `generations/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, blob, {
      contentType: 'image/png',
      cacheControl: '604800',
    })
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)
  
  return publicUrl
}
