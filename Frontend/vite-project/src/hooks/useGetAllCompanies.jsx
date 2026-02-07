import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCompanies } from "@/redux/companySlice";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "https://jobsphere-3-muax.onrender.com/api/v1/company/get",
          { withCredentials: true }
        );

        if (isMounted && res.data?.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Fetch companies failed:", error);
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
};

export default useGetAllCompanies;
