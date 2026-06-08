import {Worker} from 'bullmq'
import prisma from '../db/prisma'
import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
const genAI=new GoogleGenerativeAI (process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
const connection={
    host:'127.0.0.1',
    port:6379
}
const worker=new Worker('jobs',async(job)=>{
    const{jobId,type,input}=job.data
    await prisma.job.update({
        where:{id:jobId},
        data:{status:'running',startedAt:new Date()}



    })
    await prisma.jobLog.create({
    data: { jobId, event: 'picked_up', message: `Worker picked up job of type ${type}` }
  })
   try {
    let output = {}

    if (type === 'ai-summarize') {
    const prompt = `Summarize this text: ${input.text}`
    const result = await model.generateContent(prompt)
    const summary = result.response.text()
    output = { summary: summary}
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'completed', output, completedAt: new Date() }
    })

    await prisma.jobLog.create({
      data: { jobId, event: 'completed', message: 'Job completed successfully' }
    })

    return output
}catch (e) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'failed', error: (e as Error).message, retryCount: { increment: 1 } }
    })
    await prisma.jobLog.create({
      data: { jobId, event: 'failed', message: (e as Error).message }
    })

    throw e
}

},{connection})
worker.on('completed', (job) => console.log(`Job ${job.id} completed`))
worker.on('failed', (job, err) => console.log(`Job ${job?.id} failed: ${err.message}`))

console.log('Worker started and listening for jobs...')

export default worker