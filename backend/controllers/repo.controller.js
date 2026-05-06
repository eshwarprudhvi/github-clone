import mongoose from "mongoose";
import Repo from "../models/repository.model.js"
import repoValidation from "../validations/repo.validations.js";
export const createRepo = async(req,res)=>{
try {
    const {name,description,content,visibility,owner,issues  } = req.body;
    const validationResult = repoValidation.safeParse({name,description,content,visibility,owner,issues});
    if(!validationResult.success){
        return res.status(400).json({
            error:validationResult.error.issues[0].message
        })
    }
    if(!mongoose.Schema.Types.ObjectId.isValid(owner)){
        return res.status(400).json({
            error:"invalid owner id"
        })
    }
    const repo = new Repo(validationResult.data);
    await repo.save();
    return res.status(201).json({
        success:true,
        message:"repository created successfully",
        repo
    })

} catch (error) {
    console.error("error during creation of repo",error)
    
}
}

export const getAllRepositories =async(req,res)=>{

    try {
       const repos = await Repo.find().populate("owner").populate("issues")
       
       return res.status(200).json({
        success:true,
        message:"repos found",
        repos
       })
    } catch (error) {
        console.error("error during fetching of repositories",error)
    }
}

export const getRepoById =async (req,res)=>{
    const repoId =req.params.id;
    try {
        const repo = Repo.findById(repoId).populate("owner").populate("issues").toArray()
        if(!repo){
            return res.status(404).json({
                message:"repo not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"repo found",
            repo
        })
    } catch (error) {
        console.error("error during fetching of repo",error)
        
    }

}
export const getRepoByName = async(req,res)=>{
     const repoName =req.params.name;
    try {
        const repo = Repo.find({name:repoName}).populate("owner").populate("issues")
        if(!repo){
            return res.status(404).json({
                message:"repo not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"repo found",
            repo
        })
    } catch (error) {
        console.error("error during fetching of repo",error)
        
    }


}

export const getReposCurrentUser =async (req,res)=>{
    const userId = req.user;
    try {
        const repos = Repo.find({owner:userId}).populate("owner").populate("issues").toArray()
        if(!repos || repos.length ===0){
            return res.status(404).json({
                message:"repo not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"repo found",
            repos
        })
    } catch (error) {
        console.error("error during fetching of repo",error)
        
    }

}

export const updateRepoById = async(req,res)=>{
    const repoId = req.params.id;
    const {description,content} = req.body;
    try {
        const repo = await Repo.findById(repoId)
        if(!repo){
            return res.status(404).json({
                message:"repo not found"
            })
        }
        repo.description = description;
        repo.content.push(...content) ;
        await repo.save();
        return res.status(200).json({
            success:true,
            message:"repo updated",
            repo
        })
    } catch (error) {
        console.error("error during fetching of repo",error)
        
    }
}

export const toggleVisibilityById =async (req,res)=>{
    const repoId = req.params.id;
    const repo = await Repo.findById(repoId)
    if(!repo){
        return res.status(404).json({
            message:"repo not found"
        })
    }
    repo.visibility = !repo.visibility;
    await repo.save();
    return res.status(200).json({
        success:true,
        message:"repo visibility toggled",
        repo
    })
};

export const deleteRepoById =async (req,res)=>{
    const repoId = req.params.id;
    const repo = await Repo.findById(repoId)
    if(!repo){
        return res.status(404).json({
            message:"repo not found"
        })
    }
    await repo.remove();
    return res.status(200).json({
        success:true,
        message:"repo deleted",
        repo
    })
}





