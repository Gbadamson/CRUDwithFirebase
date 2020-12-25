import React,{useState, useEffect} from "react"
import {app} from "./Base"
import {v4 as uuidv4} from "uuid"

const db = app.firestore().collection("MyBase")

const MainApp =()=>{
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [imgfile, setImgfile] = useState(null)
  const [dev, setDev] = useState([])
  const [done, setDone] = useState(false)


  const imgUpload = async(e)=>{
    const File = e.target.files[0]
    const StoreRef = app.storage().ref()
    const FileRef = StoreRef.child(File.name)

    await FileRef.put(File)
    setImgfile(await FileRef.getDownloadURL())
  }

  const backSet = async()=>{
    await db.doc().set({
      name: name,
      email: email,
      avatar: await imgfile,
      id: uuidv4(),
      status : done
    })
  }

  const removeFile = async(id)=>{
    if(window.confirm("Are you sure you want to delete this item?")){
      await db.doc(id).delete();
    } 
    console.log(id)
  }

  const editable = async(id)=>{
    const newemail = prompt()
    await db.doc(id).update({email: newemail})
  }

  const staNature= async(id)=>{
    await db.doc(id).update({status: done})
  }

  const getData = async()=>{
    await db.onSnapshot((snapshot)=>{
      const items = []
      snapshot.forEach(doc=>{
        items.push({ ...doc.data(), id: doc.id})
      })
      setDev(items)
    })
  }

  useEffect(()=>{
    getData()
  }, [])


  return(
    <section>
      <aside>  
        <input type="file" onChange={imgUpload}/>
        <input type="text" placeholder="Your name" value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <input type="text" placeholder="Your email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <button onClick={backSet}>Submit</button>
      </aside>
   
      <section>
        <div>
          {dev.map(({id, name, email, avatar, status})=>(
            <aside key={id}>
             <div style={{display: "flex", flexDirection:"row", justifyContent:"space-between"}}>
             <div style={{cursor: "pointer"}} onClick={()=>{
               setDone(!done);
               staNature(id)
             }}>
               {status === true ? "✔️": "⚠️"}
               </div>
              <div>{name}</div>
              <div style={{cursor: "pointer"}}
              onClick={()=>removeFile(id)}>🔴</div>
             </div>
            <div><img src={avatar}
              alt={name}
              style={{ width: "300px", height: "200px", objectFit: "cover" }}/></div>
            <div style={{display: "flex", justifyContent: "space-between"}}>
            <div>{email}</div>
            <div style={{cursor: "pointer"}} 
            onClick={()=>editable(id)}>📔</div>
            </div>
            </aside>
          ))}
        </div>
      </section>
    </section>
  )
}
export default MainApp