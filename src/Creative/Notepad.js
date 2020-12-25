import React, {useState, useEffect} from "react"
import {app} from './rebase'
import {v4 as uuidv4} from "uuid"

const db = app.firestore().collection("CreativeCollections")


const Notepad=()=>{

  const [username, setUsername] = useState("")
  const [comment, setComment] = useState("")
  const [userimg, setUserimg] = useState(null)
  const [pusher, setPusher] = useState([])
  const [like, setLike] = useState(false)

  const Imager = async(e)=>{
    const File = e.target.files[0]
    const StoreRef = app.storage().ref()
    const FileRef = StoreRef.child(File.name)

    await FileRef.put(File)
    setUserimg(await FileRef.getDownloadURL())
  }

  const knotter = async()=>{
    await db.doc().set({
      name: username,
      feedback: comment,
      avatar: await userimg,
      id: uuidv4(),
      check: like
    })
  }

  const fetcher = async()=>{
    await db.onSnapshot((snapshot)=>{
      const item = []
      snapshot.forEach(doc=>{
        item.push({...doc.data(), id: doc.id})
      })
      setPusher(item)
    })
  }

  const removal = async(id)=>{
    if(window.confirm("Are you sure you want to remove this?")){
      await db.doc(id).delete()
    }
  }
  const emojiChanger = async(id)=>{
    await db.doc(id).update({check: like})
  }
  const rethink = async(id)=>{
    const newComment = prompt()
    await db.doc(id).update({feedback: newComment})
  }



  useEffect(()=>{
    fetcher()
  }, [])

  return(
    <div>
      <div style={{marginBottom:"70px"}}>
          <input type="text" placeholder="Username" value={username}
           onChange={(e)=>{setUsername(e.target.value)}}/>
          <input type="text" placeholder="Comment" value={comment}
           onChange={(e)=>{setComment(e.target.value)}}/>
           <input type="file" onChange={Imager}/>
          <div>
            <button style={{height: "10px", width: "30px", display:"flex", alignItems:"center",
          justifyContent:"center"}}
          onClick={knotter}>Submit</button>
          </div>
      </div>

<section>
<div>
  {pusher.map(({id, name, feedback, avatar, check})=>(
      <div key={id}>
        <div style={{height: "400px", width: "400px", background:"skyblue",
      display:"flex", marginLeft: "30px", flexDirection:"column", 
      padding: "20px", borderRadius: "5px", marginTop:"20px"}}>
        <div style={{display:"flex", justifyContent:"space-between"}}>
        <div style={{display: "flex", padding: "5px", width: "200px",
        height: "50px", justifyContent:"space-evenly"}}>
          <div style={{height: "50px", width:"50px", borderRadius:"50%"}}>
          <img src={avatar} alt="per" style={{objectFit:"fill", width:"100%", borderRadius:"50%",
        height:"100%"}}/>
        </div>
          <div style={{fontWeight:"20px", fontSize:"20px", marginTop: "10px"}}>{name}</div>
        </div>
        <div style={{cursor:"pointer"}} onClick={()=>{removal(id)}}>🔴</div>
        </div>
        <div style={{height: "70%", backgroundColor: "blue", marginTop: "5px", borderRadius:"5px"}}>
          <img src={avatar} alt="per" style={{objectFit:"fill", width:"100%", height:"100%"}}/>
        </div>
        <div style={{display:"flex", justifyContent:"space-between", marginTop:"20px"}}>
          <div style={{}}>{feedback}</div>
          <div style={{display: "flex", justifyContent: "space-between", width:"150px"}}>
            <div style={{cursor:"pointer"}} 
            onClick={()=>{rethink(id)}}>📓 Edit</div>
            <div style={{cursor:"pointer"}}
            onClick={()=>{setLike(!like); emojiChanger(id)}}>{check===true?"🍎Liked":"🍏Plain"}</div>
          </div>
        </div>
      </div>
      </div>
  ))}
</div>

</section>  
    </div>
  )
}
export default Notepad