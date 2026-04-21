import { useState } from "react";

export default function CommonAppPlatform() {

const programs = [
{
id:1,
title:"Business Mentorship Program",
description:"Support entrepreneurs with mentorship and guidance."
},
{
id:2,
title:"Digital Skills Training",
description:"Training in modern digital and technical skills."
},
{
id:3,
title:"Women Refugee Rise Program",
description:"Empowering refugee women through opportunity."
},
{
id:4,
title:"GVB Healing Program",
description:"Technology-based healing and empowerment program."
},
{
id:5,
title:"Inner Leadership Program",
description:"Leadership development and personal growth."
}
]

const [page,setPage] = useState("login")
const [expanded,setExpanded] = useState("")
const [commonCompleted,setCommonCompleted] = useState(false)

const [applications,setApplications] = useState<any[]>([])

const [form,setForm] = useState({
name:"",
email:"",
phone:"",
country:"",
education:"",
experience:"",
activities:"",
statement:""
})

function toggleSection(id:string){
setExpanded(expanded===id?"":id)
}

function submitCommonApplication(){
setCommonCompleted(true)
setPage("programs")
}

function applyToProgram(program:any){

const newApplication = {
program:program.title,
status:"Submitted"
}

setApplications([...applications,newApplication])

setPage("dashboard")

}

return (

<div className="min-h-screen bg-gray-100 p-8">

<h1 className="text-3xl font-bold mb-6">
Global Fellowship Application Platform
</h1>

{/* LOGIN PAGE */}

{page==="login" && (

<div className="bg-white p-6 rounded shadow max-w-md">

<h2 className="text-xl mb-4">Login</h2>

<input
placeholder="Email"
className="border p-2 w-full mb-3"
/>

<input
placeholder="Password"
type="password"
className="border p-2 w-full mb-4"
/>

<button
onClick={()=>setPage("common")}
className="bg-blue-600 text-white px-4 py-2 rounded w-full"
>
Login
</button>

</div>

)}

{/* COMMON APPLICATION */}

{page==="common" && (

<div className="space-y-4 max-w-2xl">

<h2 className="text-2xl font-bold mb-4">
Common Application
</h2>

{/* PERSONAL */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("personal")}
>
Personal Information
</button>

{expanded==="personal" && (

<div className="p-4 space-y-3">

<input
placeholder="Full Name"
className="border p-2 w-full"
onChange={e=>setForm({...form,name:e.target.value})}
/>

<input
placeholder="Email"
className="border p-2 w-full"
onChange={e=>setForm({...form,email:e.target.value})}
/>

<input
placeholder="Phone"
className="border p-2 w-full"
onChange={e=>setForm({...form,phone:e.target.value})}
/>

</div>

)}

</div>

{/* BACKGROUND */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("background")}
>
Background
</button>

{expanded==="background" && (

<div className="p-4">

<input
placeholder="Country"
className="border p-2 w-full"
onChange={e=>setForm({...form,country:e.target.value})}
/>

</div>

)}

</div>

{/* EDUCATION */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("education")}
>
Education
</button>

{expanded==="education" && (

<div className="p-4">

<textarea
placeholder="Education history"
className="border p-2 w-full"
/>

</div>

)}

</div>

{/* EXPERIENCE */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("experience")}
>
Experience
</button>

{expanded==="experience" && (

<div className="p-4">

<textarea
placeholder="Work experience"
className="border p-2 w-full"
/>

</div>

)}

</div>

{/* ACTIVITIES */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("activities")}
>
Activities
</button>

{expanded==="activities" && (

<div className="p-4">

<textarea
placeholder="Activities and achievements"
className="border p-2 w-full"
/>

</div>

)}

</div>

{/* STATEMENT */}

<div className="bg-white rounded shadow">

<button
className="w-full text-left p-4 font-semibold"
onClick={()=>toggleSection("statement")}
>
Personal Statement
</button>

{expanded==="statement" && (

<div className="p-4">

<textarea
placeholder="Your motivation"
className="border p-2 w-full"
/>

</div>

)}

</div>

<button
onClick={submitCommonApplication}
className="bg-green-600 text-white px-6 py-3 rounded"
>
Submit Common Application
</button>

</div>

)}

{/* PROGRAMS */}

{page==="programs" && (

<div>

<h2 className="text-2xl font-bold mb-6">
Available Programs
</h2>

<div className="grid md:grid-cols-2 gap-4">

{programs.map(program=>(

<div
key={program.id}
className="bg-white p-4 rounded shadow"
>

<h3 className="font-bold text-lg mb-2">
{program.title}
</h3>

<p className="text-gray-600 mb-4">
{program.description}
</p>

<button
onClick={()=>applyToProgram(program)}
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Apply
</button>

</div>

))}

</div>

<button
onClick={()=>setPage("dashboard")}
className="mt-6 underline"
>
Go to My Applications
</button>

</div>

)}

{/* DASHBOARD */}

{page==="dashboard" && (

<div>

<h2 className="text-2xl font-bold mb-4">
My Applications
</h2>

{applications.length===0 && (

<p>No applications yet.</p>

)}

{applications.map((app,i)=>(

<div
key={i}
className="bg-white p-4 rounded shadow mb-3 flex justify-between"
>

<span>{app.program}</span>

<span className="font-semibold text-blue-600">
{app.status}
</span>

</div>

))}

<button
onClick={()=>setPage("programs")}
className="mt-6 bg-gray-800 text-white px-4 py-2 rounded"
>
Apply to More Programs
</button>

</div>

)}

</div>

)

}
