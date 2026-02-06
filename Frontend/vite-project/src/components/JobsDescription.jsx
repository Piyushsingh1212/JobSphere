import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();

  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyApplied = singleJob?.application?.some(application=>application.applicant === user?.id) || false;
  const [isApplied,setIsApplied] = useState(isInitiallyApplied)
  
  // ✅ Fetch single job
  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        dispatch(setSingleJob(null)); // reset old job

        const res = await axios.get(
          `${JOB_API_END_POINT}/get/${jobId}`, // ✅ keep route consistent with backend
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          const applied = res.data.job.applications?.some(
            (application) => application.applicant === user?._id
          );
          setIsApplied(applied);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load job details");
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // ✅ Apply job
  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);

        dispatch(
          setSingleJob({
            ...singleJob,
            applications: [
              ...(singleJob.applications || []),
              { applicant: user?._id },
            ],
          })
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Apply failed");
    }
  };

  // ✅ Loading guard (prevents blank page)
  if (!singleJob) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob.title}</h1>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant="ghost" className="text-blue-700 font-bold">
              {singleJob.position} Positions
            </Badge>
            <Badge variant="ghost" className="text-[#F83002] font-bold">
              {singleJob.jobType}
            </Badge>
            <Badge variant="ghost" className="text-[#7209b7] font-bold">
              {singleJob.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={!isApplied ? applyJobHandler : undefined}
          disabled={isApplied}
          className={`rounded-lg ${
            isApplied
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isApplied ? "Already Applied" : "Apply Now"}
        </Button>
      </div>

      <h1 className="border-b-2 border-gray-300 font-medium py-4 mt-6">
        Job Description
      </h1>

      <div className="my-4 space-y-2">
        <p>
          <strong>Role:</strong>{" "}
          <span className="text-gray-800">{singleJob.title}</span>
        </p>
        <p>
          <strong>Location:</strong>{" "}
          <span className="text-gray-800">{singleJob.location}</span>
        </p>
        <p>
          <strong>Description:</strong>{" "}
          <span className="text-gray-800">{singleJob.description}</span>
        </p>
        <p>
          <strong>Experience:</strong>{" "}
          <span className="text-gray-800">
            {singleJob.experience} yrs
          </span>
        </p>
        <p>
          <strong>Salary:</strong>{" "}
          <span className="text-gray-800">{singleJob.salary} LPA</span>
        </p>
        <p>
          <strong>Total Applicants:</strong>{" "}
          <span className="text-gray-800">
            {singleJob.applications?.length || 0}
          </span>
        </p>
        <p>
          <strong>Posted Date:</strong>{" "}
          <span className="text-gray-800">
            {singleJob.createdAt?.split("T")[0]}
          </span>
        </p>
      </div>
    </div>
  );
};

export default JobDescription;
