import React from 'react';
import { Link } from 'react-router-dom'; 
const NotFound = () => {
    return (
        <div className='min-h-screen md:min-h-[500px] w-full flex justify-center items-center flex-col'>
            <h1 className='font-bold text-6xl'>404 - Page Not Found</h1>
            <p className='text-red-500 mt-4'>The page you're looking for doesn't exist.</p>
            <Link className='bg-slate-500 p-2 rounded-md text-center w-fit text-white font-semibold mt-2' to="/">Go to Home</Link> 
        </div>
    );
};

export default NotFound;
