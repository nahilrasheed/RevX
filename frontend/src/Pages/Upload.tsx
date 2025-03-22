import React, { useState } from 'react'

const Upload = () => {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files[0]){
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !category || !file) {
            alert('Please fill all fields and upload a file.');
            return;
          }
          console.log({ title, description, category, file });
          alert('Project uploaded successfully!');
    };  
    return (
    <div className='flex flex-col items-center justify-center min-h screen bg-black text-white botton my-5'>
        <h1 className='text-4xl font-bold mb-4'>Upload a Project</h1>
        <p className='mb-8'>Enter project details</p>

        <form 
            onSubmit={handleSubmit}
            className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className='mb-6'>
                    <label htmlFor='title' className='block mb-2 text-sm font-medium'>
                        Title
                    </label>
                    <input
                        id="title"
                        type = "text"
                        value = {title}
                        onChange={(e)=>setDescription(e.target.value)}
                        placeholder='Project Title'
                        className='w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none'
                        required
                        />
                </div>

                <div className='mb-6'>
                    <label htmlFor='description' className='block mb-2 text-sm font-medium'>
                        Description
                    </label>
                    <input
                        id="description"
                        type = "text"
                        value = {description}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder='Brief Description'
                        className='w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none'
                        required
                        />
                </div>
                <div className="mb-6">
                    <label htmlFor="category" className="block mb-2 text-sm font-medium">
                        Category
                    </label>
                    <input
                        id="category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Web dev, AI ML, etc"
                        className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                        required
                    />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="file" className="block mb-2 text-sm font-medium">
                            Upload source code
                        </label>
                        <input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none"
                            accept=".zip,.rar,.tar,.gz,.7z,.pdf"
                            required
                        />
                        <p className="text-sm mt-2">File Max Limit: 10 MB</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 mt-4 bg-white text-black rounded-lg hover:bg-gray-300"
                    > Submit </button>
               
            </form>
      
    </div>
  );
};

export default Upload
