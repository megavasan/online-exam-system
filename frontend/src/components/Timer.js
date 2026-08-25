import {useEffect,useState} from "react";

export default function Timer({time,submit}){
const [t,setT]=useState(time);

useEffect(()=>{
 if(t===0) submit();
 const id=setInterval(()=>setT(t-1),1000);
 return()=>clearInterval(id);
});

return <h3>Time Left: {t}</h3>;
}