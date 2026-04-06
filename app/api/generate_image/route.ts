import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateImage } from '@/lib/ai/huggingface'
import { z } from 'zod'

const generateSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['sdxl', 'sd21', 'photoreal', 'openjourney']).default('sdxl'),
  size: z.enum(['512x512', '1024x1024', '1920x1080']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard'),
  style: z.enum(['natural', 'vivid', 'anime']).default('natural'),
  negative_prompt: z.string().optional(),
  num_images: z.number().min(1).max(4).default(1),
  seed: z.number().optional(),
})

const DAILY_LIMIT = 10

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // 1. 驗證用戶
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. 驗證請求資料
    const body = await request.json()
    const validatedData = generateSchema.parse(body)

    // 3. 檢查每日限制
    const { data: profile } = await supabase
      .from('profiles')
      .select('daily_generations, last_generation_date')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      )
    }

    const today = new Date().toISOString().split('T')[0]
    const isToday = profile.last_generation_date === today

    if (isToday && profile.daily_generations >= DAILY_LIMIT) {
      return NextResponse.json(
        {
          success: false,
          error: `Daily limit reached (${DAILY_LIMIT} images/day)`,
        },
        { status: 429 }
      )
    }

    // 4. 建立生成記錄
    const { data: generation } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        prompt: validatedData.prompt,
        negative_prompt: validatedData.negative_prompt,
        model: validatedData.model,
        size: validatedData.size,
        quality: validatedData.quality,
        style: validatedData.style,
        seed: validatedData.seed,
        status: 'processing',
      })
      .select()
      .single()

    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Failed to create generation record' },
        { status: 500 }
      )
    }

    try {
      // 5. 呼叫 AI 生成
      const result = await generateImage(validatedData)

      // 6. 更新生成記錄
      await supabase
        .from('generations')
        .update({
          status: result.status,
          image_url: result.images[0].url,
          generation_time: result.generation_time,
          credits_used: result.credits_used,
        })
        .eq('id', generation.id)

      // 7. 更新用戶統計
      await supabase
        .from('profiles')
        .update({
          daily_generations: isToday ? profile.daily_generations + 1 : 1,
          last_generation_date: today,
          total_generations: (profile.total_generations || 0) + 1,
        })
        .eq('id', user.id)

      // 8. 返回結果
      return NextResponse.json({
        success: true,
        task_id: generation.id,
        status: result.status,
        images: result.images,
        credits_used: result.credits_used,
        generation_time: result.generation_time,
        remaining: DAILY_LIMIT - (isToday ? profile.daily_generations + 1 : 1),
      })

    } catch (aiError: any) {
      // 更新失敗狀態
      await supabase
        .from('generations')
        .update({
          status: 'failed',
          error_message: aiError.message,
        })
        .eq('id', generation.id)

      throw aiError
    }

  } catch (error: any) {
    console.error('Generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// GET 方法：查詢生成狀態
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get('task_id')
    
    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'task_id required' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { data: generation } = await supabase
      .from('generations')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', user.id)
      .single()
    
    if (!generation) {
      return NextResponse.json(
        { success: false, error: 'Generation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      task_id: generation.id,
      status: generation.status,
      images: generation.image_url ? [
        {
          url: generation.image_url,
          width: parseInt(generation.size.split('x')[0]),
          height: parseInt(generation.size.split('x')[1]),
        }
      ] : [],
      error_message: generation.error_message,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
