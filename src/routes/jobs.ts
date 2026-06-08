import { Router } from 'express'
import {jobQueue} from '../queue/index'
import prisma from '../db/prisma'
import { userMiddleware, AuthRequest } from '../middleware/auth'
const router=Router()


router.post('/job',userMiddleware,async(req:AuthRequest,res)=>{
    const{type,input}=req.body
    try{
        const job=await prisma.job.create({
            data:{type,input,userId:req.userId!}
        })
        await jobQueue.add(type,{
            jobId:job.id,
            type,
            input
        })
        return res.json(job)
    }catch(e){
        return res.status(500).json({
            message:"Something went wrong"
        })

    }
})
router.get('/jobs',userMiddleware,async(req:AuthRequest,res)=>{
    const jobs=await prisma.job.findMany({
        where:{userId:req.userId!},
        orderBy:{createdAt:'desc'},
        include:{logs:true}
    })
    return res.json(jobs)
})
export default router;