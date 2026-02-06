import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection  from './HeroSection'
import CategoryCarousel from "../components/CategoryCarousel";
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer';
import useGetAllJobs from '../hooks/useGetAllJobs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Home() {
  useGetAllJobs();
  const {user} = useSelector(store=>store.auth);
  const navigate = useNavigate();
  useEffect(()=> {
    if(user?.role === 'recuiter'){
      navigate("/admin/companies");
    }
  },[]);
  
  return (
    <>
    <Navbar />
    <HeroSection />
    <CategoryCarousel/>
    <LatestJobs />
    <Footer />
    </>
    
  )
}

export default Home