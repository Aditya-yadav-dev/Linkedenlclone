import React, { useContext, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import profile from '../assets/profile.png'
import { UserDataContext } from '../context/UserContext';
import { FaPlus } from "react-icons/fa6";
import { IoCameraReverseOutline } from "react-icons/io5";
import axios from 'axios';
import { AuthDataContext } from '../context/AuthContext';

const EditProfile = () => {
    const { userData, setUserData, edit, setEdit } = useContext(UserDataContext)
    const [firstname, setfirstname] = useState(userData.firstname || '')
    const [lastname, setlastname] = useState(userData.lastname || '')
    const [username, setusername] = useState(userData.username || '')
    const [headline, setheadline] = useState(userData.headline || '')
    const [location, setlocation] = useState(userData.location || "")
    const [gender, setgender] = useState(userData.gender || '')
    const [skills, setskills] = useState(userData.skills || [])
    const [newskills, setnewskills] = useState('')
    const [education, seteducation] = useState(userData.education || [])
    const { ServerUrl } = useContext(AuthDataContext)
    const [frontendprofileImage, setfrontendprofileImage] = useState(userData.profileImage || profile)
    const [backendprofileImage, setbackendprofileImage] = useState(null)
    const [frontendCoverImage, setfrontendCoverImage] = useState(userData.coverImage || '')
    const [backendCoverImage, setbackendCoverImage] = useState(null)
    const [saving, setsaving] = useState(false)
    const [newEducation, setnewEducation] = useState(
        {
        college: '',
        degree: '',
        fieldofstudy: ''

    }
  )

    const [Experience, setExperience] = useState(userData.experience || [])
    const [newExperience, setnewExperience] = useState(
        {
            title: '',
            company: '',
            description: ''
        }
    )

    const profileImage = useRef()
    const coverImage = useRef()

    function addskill(e) {
        e.preventDefault()
        if (newskills && !skills.includes(newskills)) {
            setskills([...skills, newskills])
            setnewskills('')
        }
    }

    function addEducation() {
        if (newEducation.college && newEducation.degree && newEducation.fieldofstudy && !education.includes(newEducation)) {
            seteducation([...education, newEducation])
            setnewEducation({
                college: '',
                degree: '',
                fieldofstudy: ''

            })
        }

    }


    function addExperience() {
        if (newExperience) {
            setExperience([...Experience, newExperience])
            setnewExperience({
                title: '',
                company: '',
                description: ''
            })
        }
    }

    function removeExperience(exp) {
        if (Experience.includes(exp)) {
            setExperience(Experience.filter((ex) => {
                return ex.title !== exp.title && ex.company !== exp.company && ex.description !== exp.description
            }))
        }
    }


    function removeEducation(educat) {
        if (education.includes(educat)) {
            seteducation(education.filter((edu) => {
                return edu.college !== educat.college && edu.degree !== educat.degree && edu.fieldofstudy !== educat.fieldofstudy
            }))
        }
    }

    function removeskill(skill) {
        const nskills = skills.filter((nskill) => {
            return nskill !== skill
        })
        setskills(nskills)
    }

    const handleprofileImage = (e) => {
        const file = e.target.files[0]
        setbackendprofileImage(file)
        setfrontendprofileImage(URL.createObjectURL(file))
    }

    const handlecoverImage = (e) => {
        const file = e.target.files[0]
        setbackendCoverImage(file)
        setfrontendCoverImage(URL.createObjectURL(file))
    }

    const handleSaveProfile = async () => {
        try {
            console.log(ServerUrl);
            setsaving(true)
            let formdata = new FormData()
            formdata.append("firstname", firstname)
            formdata.append("lastname", lastname)
            formdata.append("username", username)
            formdata.append("headline", headline)
            formdata.append("location", location)
            formdata.append("gender", gender)

            formdata.append("skills", JSON.stringify(skills))
            formdata.append("education", JSON.stringify(education))
            formdata.append("experience", JSON.stringify(Experience))

            if (backendprofileImage) {
                formdata.append("profileImage", backendprofileImage)
                // console.log('backend rofile image is:', backendprofileImage)

            }
            console.log('backend profile image is:', backendprofileImage)
            if (backendCoverImage) {
                formdata.append("coverImage", backendCoverImage)
            }

            let result = await axios.put( ServerUrl + '/api/user/updateprofile', formdata,
                { withCredentials: true })
            setsaving(false)
            setEdit(false)
            // console.log(result)
            setUserData(result.data)

        } catch (error) {
           
                console.error('error is:', error);
              
                if (error.response) {
                  console.error('Response error:', error.response.data);
                } else if (error.request) {
                  console.error('No response received:', error.request);
                } else {
                  console.error('Error message:', error.message);
                }
                setsaving(false)
              }
              
       
    }
   
    return (
        <div className='w-screen h-screen fixed top-0 z-50 flex justify-center items-center'>

            <input type="file" accept='image/*' name='profileImage' ref={profileImage} hidden onChange={handleprofileImage} />
            <input type="file" accept='image/*' name='coverImage' ref={coverImage} hidden onChange={handlecoverImage} />


            <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>

            <div className="bg-white w-[90%] max-w-[500px] shadow-lg rounded-[6px] h-[600px] absolute z-[55] overflow-auto p-3">
                <div onClick={() => { setEdit(false) }} className='absolute right-6 top-[10px] cursor-pointer'><RxCross2 className='text-gray-600 w-7 font-bold h-7' /></div>
                <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-7 overflow-hidden relative z-[56]'>
                    <img src={frontendCoverImage} className='w-full' />
                    <IoCameraReverseOutline onClick={() => { coverImage.current.click() }} className='absolute right-7 text-gray-700 h-7 w-7 top-4 cursor-pointer' />
                </div>
                <div className='w-[65px] h-[65px] rounded-full shadow-2xl relative top-[-40px] left-[18px] z-[61] cursor-pointer' >
                    <div className='w-full h-full rounded-full overflow-hidden'>
                        <img src={frontendprofileImage} className='w-full' />
                    </div>
                    <div onClick={() => profileImage.current.click()} className='absolute bottom-[10px] z-20 right-[-6px] w-5 h-5 bg-[#17c1ff] rounded-full flex justify-center items-center cursor-pointer'><FaPlus /></div>
                </div>
                <div className='w-full flex flex-col items-center justify-center gap-5 mt-[-13px]'>
                    <input type="text" placeholder='firstname' value={firstname} onChange={(e) => { setfirstname(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-[12px] py-[5px] text-[18px] border-2 rounded-lg' />
                    <input type="text" placeholder='lasstname' value={lastname} onChange={(e) => { setlastname(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-3 py-[5px] text-[18px] border-2 rounded-lg' />
                    <input type="text" placeholder='username' value={username} onChange={(e) => { setusername(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-3 py-[5px] text-[18px] border-2 rounded-lg' />
                    <input type="text" placeholder='headline' value={headline} onChange={(e) => { setheadline(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-3 py-[5px] text-[18px] border-2 rounded-lg' />
                    <input type="text" placeholder='location' value={location} onChange={(e) => { setlocation(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-3 py-[5px] text-[18px] border-2 rounded-lg' />
                    <input type="text" placeholder='gender (male/female/othre)' value={gender} onChange={(e) => { setgender(e.target.value) }} className='w-full h-[50px] outline-none border-gray-600 px-3 py-[5px] text-[18px] border-2 rounded-lg' />

                    <div className='w-full p-[10px] border-[3px] border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold '>skills</h1>
                        {skills && <div className='flex flex-col gap-2'>
                            {skills.map((skill, index) => {
                                return <div className='w-full h-[40px] p-2 border-2 border-gray-600 rounded-sm bg-gray-200 uppercase flex justify-between' key={index}><span>{skill}</span><RxCross2 onClick={() => { removeskill(skill) }} className='text-gray-600 w-7 font-bold h-7' /></div>
                            })}
                        </div>}

                        <div className='flex flex-col gap-[10px] items-start' >
                            <input type="text" value={newskills} placeholder='add skills' onChange={(e) => { setnewskills(e.target.value) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />
                            <button onClick={addskill} className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff]'>Add</button>
                        </div>
                    </div>

                    <div className='w-full p-[10px] border-[3px] border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold '>Education</h1>
                        {education && <div className='flex flex-col gap-2'>
                            {education.map((edu, index) => {
                                return <div className='w-full p-2 border-2 border-gray-600 rounded-sm bg-gray-200 uppercase flex justify-between' key={index}>
                                    <div className='flex flex-col gap-2'>
                                        <div><span className='font-bold'>college: </span>{edu.college}</div>
                                        <div><span className='font-bold'>degree:</span> {edu.degree}</div>
                                        <div><span className='font-bold'>fieldofstudy: </span>{edu.fieldofstudy}</div>
                                    </div><RxCross2 onClick={() => { removeEducation(edu) }} className='text-gray-600 w-7 font-bold h-7' />

                                </div>
                            })}
                        </div>}

                        <div className='flex flex-col gap-[10px] items-start' >
                            <input type="text" value={education.college} placeholder='add college' onChange={(e) => { setnewEducation({ ...newEducation, college: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />
                            <input type="text" value={education.degree} placeholder='add degree' onChange={(e) => { setnewEducation({ ...newEducation, degree: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />
                            <input type="text" value={education.fieldofstudy} placeholder='add fieldofstudy' onChange={(e) => { setnewEducation({ ...newEducation, fieldofstudy: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />

                            <button onClick={addEducation} className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff]'>Add</button>
                        </div>
                    </div>

                    <div className='w-full p-[10px] border-[3px] border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                        <h1 className='text-[19px] font-semibold '>Experience</h1>
                        {Experience && <div className='flex flex-col gap-2'>
                            {Experience.map((exp, index) => {
                                return <div className='w-full p-2 border-2 border-gray-600 rounded-sm bg-gray-200 uppercase flex justify-between' key={index}>
                                    <div className='flex flex-col gap-2'>
                                        <div><span className='font-bold'>Title:</span> {exp.title}</div>
                                        <div><span className='font-bold'>Company:</span> {exp.company}</div>
                                        <div><span className='font-bold'>Description:</span> {exp.description}</div>
                                    </div><RxCross2 onClick={() => { removeExperience(exp) }} className='text-gray-600 w-7 font-bold h-7 cursor-pointer' />

                                </div>
                            })}
                        </div>}

                        <div className='flex flex-col gap-[10px] items-start' >
                            <input type="text" value={newExperience.title} placeholder='add title' onChange={(e) => { setnewExperience({ ...newExperience, title: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />
                            <input type="text" value={newExperience.company} placeholder='add company' onChange={(e) => { setnewExperience({ ...newExperience, company: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />
                            <input type="text" value={newExperience.description} placeholder='add description' onChange={(e) => { setnewExperience({ ...newExperience, description: e.target.value }) }} className='w-full h-[50px]  placeholder:capitalize border-gray-600 px-3 py-[5px] text-[14px] border-2 rounded-lg' />

                            <button onClick={addExperience} className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff]'>Add</button>
                        </div>
                    </div>

                    <button onClick={handleSaveProfile} disabled={saving} className='w-full bg-blue-600 text-white text-[18px] h-[44px] rounded-full cursor-pointer'>{ saving?'Saving...': 'Save Profile'}</button>

                </div>





            </div>


        </div>
    )
}

export default EditProfile